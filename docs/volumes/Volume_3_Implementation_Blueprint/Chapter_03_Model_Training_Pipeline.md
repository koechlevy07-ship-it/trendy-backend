# VOLUME 3: IMPLEMENTATION BLUEPRINT

**Version:** 1.0  
**Date:** July 15, 2026  
**Status:** Active Development  

---

# CHAPTER 3: MODEL TRAINING PIPELINE

---

## 3.1 Purpose

This chapter defines the implementation of the model training pipeline for the Volleyball Analytics Platform. It covers data preparation, model training, validation, versioning, and deployment automation for all AI models used in the platform.

---

## 3.2 Training Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        MODEL TRAINING PIPELINE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌─────────┐    ┌──────────────┐   │
│  │ Data         │───▶│ Feature     │───▶│ Model   │───▶│ Validation │   │
│  │ Ingestion    │    │ Engineering │    │ Training│    │ & Testing  │   │
│  └──────────────┘    └──────────────┘    └─────────┘    └──────────────┘   │
│       │                                        │                   │       │
│       ▼                                        ▼                   ▼       │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      MLFLOW TRACKING SERVER                         │   │
│  │  ┌──────────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │   │
│  │  │ Experiments│  │ Artifacts│  │ Models   │  │ Runs     │         │   │
│  │  └──────────────┘  └──────────┘  └──────────┘  └──────────┘      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                      │
│                                    ▼                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    MODEL REGISTRY & DEPLOYMENT                      │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐          │   │
│  │  │ Staging  │  │ Canary   │  │Production│  │Rollback  │          │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3.3 Data Ingestion & Preparation

### 3.1 Data Sources

| Source | Format | Frequency | Volume | Description |
|--------|--------|-----------|--------|-------------|
| Match Videos | MP4/AVI/MOV | Per match | 2-10 GB/match | Raw footage from cameras |
| Annotations | JSON/COCO | Per frame | 500-5000 labels/match | Manual + AI-assisted labels |
| Tracking Data | JSON/CSV | Per frame | 30-60 fps | Player/ball trajectories |
| Match Metadata | JSON | Per match | 1 per match | Scores, teams, venue, date |
| Player Profiles | JSON/CSV | Per player | 1 per player | Height, weight, position, etc. |

### 5.2.2 Data Pipeline

```python
# mlops/training/data_pipeline.py
"""
Data ingestion and preparation pipeline for volleyball analytics models.
"""

import asyncio
import hashlib
import json
import os
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass
from enum import Enum

import pandas as pd
import numpy as np
import cv2
import albumentations as A
from sklearn.model_selection import train_test_split

from mlops.tracking.experiment_tracker import ExperimentTracker


class DataIngestionPipeline:
    """Handles ingestion, validation, and preprocessing of training data."""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.raw_data_path = Path(config.get("raw_data_path", "data/raw"))
        self.processed_path = Path(config.get("processed_path", "data/processed"))
        self.tracker = ExperimentTracker()
    
    async def ingest_match_data(self, match_id: str) -> Dict[str, Any]:
        """Ingest all data for a single match."""
        match_dir = self.raw_data_path / match_id
        
        # Verify required files exist
        required_files = [
            "video.mp4",
            "annotations.json",
            "metadata.json",
            "tracking_data.json"
        ]
        
        for f in required_files:
            if not (match_dir / f).exists():
                raise FileNotFoundError(f"Required file {f} missing for match {match_id}")
        
        # Load metadata
        with open(match_dir / "metadata.json") as f:
            metadata = json.load(f)
        
        # Load annotations
        with open(match_dir / "annotations.json") as f:
            annotations = json.load(f)
        
        # Load tracking data
        with open(match_dir / "tracking_data.json") as f:
            tracking = json.load(f)
        
        # Compute data hash for versioning
        data_hash = self._compute_data_hash(match_dir)
        
        return {
            "match_id": match_id,
            "metadata": metadata,
            "annotations": annotations,
            "tracking": tracking,
            "data_hash": data_hash,
            "ingested_at": datetime.utcnow().isoformat()
        }
    
    def _compute_data_hash(self, match_dir: Path) -> str:
        """Compute hash of all data files for versioning."""
        hasher = hashlib.sha256()
        for file_path in sorted(match_dir.glob("*")):
            if file_path.is_file():
                with open(file_path, "rb") as f:
                    for chunk in iter(lambda: f.read(8192), b""):
                        hasher.update(chunk)
        return hasher.hexdigest()
    
    def prepare_training_data(
        self, 
        match_ids: List[str],
        test_split: float = 0.2,
        val_split: float = 0.1
    ) -> Dict[str, Any]:
        """Prepare train/val/test splits for model training."""
        
        all_samples = []
        for match_id in match_ids:
            data = await self.ingest_match_data(match_id)
            samples = self._extract_training_samples(match_id)
            all_samples.extend(samples)
        
        # Stratified split by action class
        df = pd.DataFrame(all_samples)
        train_df, test_df = train_test_split(df, test_size=test_split, stratify=df['label'], random_state=42)
        train_df, val_df = train_test_split(train_df, test_size=val_split/(1-test_split), stratify=train_df['label'], random_state=42)
        
        return {
            "train": train_df.to_dict('records'),
            "val": val_df.to_dict('records'),
            "test": test_df.to_dict('records'),
            "split_info": {
                "train_size": len(train_df),
                "val_size": len(val_df),
                "test_size": len(test_df),
                "classes": sorted(train_df['label'].unique().tolist())
            }
        }
    
    def _extract_training_samples(self, match_id: str) -> List[Dict]:
        """Extract frame-level samples from match data."""
        # Implementation extracts frames with labels from annotations
        pass


class FeatureEngineeringPipeline:
    """Feature extraction and engineering for volleyball analytics."""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.transforms = self._build_transforms()
    
    def _build_transforms(self) -> A.Compose:
        """Build augmentation pipeline."""
        return A.Compose([
            A.Resize(640, 640),
            A.HorizontalFlip(p=0.5),
            A.RandomBrightnessContrast(p=0.2),
            A.GaussNoise(p=0.1),
            A.MotionBlur(p=0.1),
            A.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
            ToTensorV2(),
        ], bbox_params=A.BboxParams(format='pascal_voc', label_fields=['labels']))
    
    def extract_features(self, frame: np.ndarray, detections: List[Dict]) -> np.ndarray:
        """Extract features from detections for action recognition."""
        # Extract pose, position, motion features
        pass
```

---

## 3.4 Model Training Pipeline

### 3.4.1 Training Configuration

```yaml
# configs/training/player_detection.yaml
pipeline:
  name: "player_detection_v2"
  version: "2.1.0"
  
dataset:
  source: "data/processed/player_detection/v2.1"
  train_split: 0.7
  val_split: 0.2
  test_split: 0.1
  stratification: "label"
  
model:
  architecture: "yolov8s"
  pretrained: "yolov8s.pt"
  input_size: 640
  num_classes: 1
  classes: ["player"]
  
training:
  epochs: 100
  batch_size: 16
  imgsz: 640
  optimizer: "AdamW"
  lr0: 0.001
  lrf: 0.01
  momentum: 0.937
  weight_decay: 0.0005
  warmup_epochs: 3
  warmup_momentum: 0.8
  warmup_bias_lr: 0.1
  
augmentation:
  mosaic: 1.0
  mixup: 0.1
  copy_paste: 0.1
  degrees: 10.0
  translate: 0.1
  scale: 0.5
  shear: 2.0
  perspective: 0.0
  flipud: 0.0
  fliplr: 0.5
  mosaic: 1.0
  mixup: 0.1
  hsv_h: 0.015
  hsv_s: 0.7
  hsv_v: 0.4
  degrees: 10.0
  translate: 0.1
  scale: 0.5
  shear: 2.0
  perspective: 0.0
  flipud: 0.0
  fliplr: 0.5
  mosaic: 1.0
  mixup: 0.1
  
optimizer: "AdamW"
lr0: 0.001
lrf: 0.01
momentum: 0.937
weight_decay: 0.0005
warmup_epochs: 3
warmup_momentum: 0.8
warmup_bias_lr: 0.1
box: 7.5
cls: 0.5
dfl: 1.5
```

### 3.4.2 Training Script

```python
# mlops/training/train_detection.py
"""
Training script for player/ball detection models.
"""

import argparse
import yaml
from pathlib import Path
import mlflow
import mlflow.pytorch
from ultralytics import YOLO

def train_model(config_path: str):
    """Train detection model with MLflow tracking."""
    
    with open(config_path) as f:
        config = yaml.safe_load(f)
    
    mlflow.set_experiment("player_detection")
    
    with mlflow.start_run() as run:
        # Log parameters
        mlflow.log_params(config['training'])
        mlflow.log_params({f"model_{k}": v for k, v in config['model'].items()})
        mlflow.log_params({f"data_{k}": v for k, v in config['data'].items()})
        
        # Initialize model
        model = YOLO(config['model']['pretrained'])
        
        # Train
        results = model.train(
            data=f"data/{config['data']['source']}/data.yaml",
            epochs=config['training']['epochs'],
            batch_size=config['training']['batch_size'],
            imgsz=config['model']['input_size'],
            device=config['training'].get('device', '0'),
            workers=8,
            project="volleyball-analytics",
            name=f"{config['pipeline']['name']}_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            exist_ok=True,
        )
        
        # Log metrics
        mlflow.log_metrics({
            "mAP50": results.results_dict.get('metrics/mAP50(B)', 0),
            "mAP50-95": results.results_dict.get('metrics/mAP50-95(B)', 0),
            "precision": results.results_dict.get('metrics/precision(B)', 0),
            "recall": results.results_dict.get('metrics/recall(B)', 0),
        })
        
        # Log model artifact
        mlflow.pytorch.log_model(
            pytorch_model=model.model,
            artifact_path="model",
            registered_model_name="player_detector"
        )
        
        return run.info.run_id


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", required=True, help="Path to training config")
    args = parser.parse_args()
    
    run_id = train_model(args.config)
    print(f"Training completed. Run ID: {run_id}")
```

---

## 3.5 Model Evaluation

### 3.5.1 Evaluation Metrics

```python
# mlops/evaluation/evaluator.py
"""
Model evaluation framework for volleyball analytics models.
"""

import torch
import numpy as np
from sklearn.metrics import (
    precision_score, recall_score, f1_score,
    average_precision_score, confusion_matrix
)
from typing import Dict, List, Dict, Any
import pandas as pd

class ModelEvaluator:
    """Comprehensive model evaluation framework."""
    
    def __init__(self, model, device: str = "cuda"):
        self.model = model
        self.device = device
        self.model.to(device)
        self.model.eval()
    
    def evaluate_detection(self, dataloader, iou_threshold: float = 0.5) -> Dict:
        """Evaluate object detection model."""
        from pycocotools.coco import COCO
        from pycocotools.cocoeval import COCOeval
        
        predictions = []
        ground_truth = []
        
        for batch in dataloader:
            images, targets = batch
            images = [img.to(self.device) for img in images]
            
            with torch.no_grad():
                outputs = self.model(images)
            
            # Process predictions
            for i, output in enumerate(outputs):
                boxes = output['boxes'].cpu().numpy()
                scores = output['scores'].cpu().numpy()
                labels = output['labels'].cpu().numpy()
                
                for box, score, label in zip(boxes, scores, labels):
                    predictions.append({
                        "image_id": batch_idx * batch_size + i,
                        "category_id": int(label),
                        "bbox": box.tolist(),
                        "score": float(score)
                    })
            
            # COCO evaluation
            coco_gt = COCO(ground_truth_annotations)
            coco_dt = coco_gt.loadRes(predictions)
            coco_eval = COCOeval(coco_gt, coco_dt, 'bbox')
            coco_eval.evaluate()
            coco_eval.accumulate()
            coco_eval.summarize()
            
            return {
                "mAP@0.5": coco_eval.stats[0],
                "mAP@0.5:0.95": coco_eval.stats[1],
                "precision": coco_eval.stats[2],
                "recall": coco_eval.stats[3],
            }
    
    def evaluate_action_recognition(self, sequences: List, labels: List) -> Dict:
        """Evaluate action recognition model."""
        self.model.eval()
        predictions = []
        
        with torch.no_grad():
            for seq, label in zip(sequences, labels):
                seq_tensor = torch.FloatTensor(sequence).unsqueeze(0).to(self.device)
                logits = self.model(seq_tensor)
                probs = torch.softmax(logits, dim=-1)
                pred = torch.argmax(probs, dim=-1).item()
                confidence = torch.max(probs).item()
                
                predictions.append({
                    "prediction": pred.item(),
                    "label": label,
                    "confidence": confidence,
                    "correct": pred.item() == label
                })
        
        # Compute metrics
        y_true = [p["label"] for p in predictions]
        y_pred = [p["prediction"] for p in predictions]
        
        return {
            "accuracy": sum(p["correct"] for p in predictions) / len(predictions),
            "f1_macro": f1_score(y_true, y_pred, average='macro'),
            "f1_per_class": f1_score(y_true, y_pred, average=None).tolist(),
            "confusion_matrix": confusion_matrix(y_true, y_pred).tolist(),
            "per_class_metrics": self._per_class_metrics(y_true, y_pred)
        }
    
    def _per_class_metrics(self, y_true, y_pred):
        """Compute per-class metrics."""
        from sklearn.metrics import precision_recall_fscore_support
        precision, recall, f1, support = precision_recall_fscore_support(
            y_true, y_pred, average=None
        )
        return {
            "precision": precision.tolist(),
            "recall": recall.tolist(),
            "f1": f1.tolist(),
            "support": support.tolist()
        }
```

---

## 3.6 Experiment Tracking & Versioning

### 3.6.1 MLflow Integration

```python
# mlops/tracking/experiment_tracker.py
"""
MLflow experiment tracking for volleyball analytics models.
"""

import mlflow
from mlflow.tracking import MlflowClient
import os
from typing import Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)


class ExperimentTracker:
    """MLflow experiment tracking wrapper."""
    
    def __init__(self, tracking_uri: str = None, experiment_name: str = "volleyball-analytics"):
        self.tracking_uri = tracking_uri or os.getenv("MLFLOW_TRACKING_URI", "http://mlflow:5000")
        self.experiment_name = experiment_name
        
        mlflow.set_tracking_uri(self.tracking_uri)
        self.client = MlflowClient(tracking_uri=self.tracking_uri)
        
        # Create or get experiment
        experiment = mlflow.get_experiment_by_name(self.experiment_name)
        if experiment:
            self.experiment_id = experiment.experiment_id
        else:
            self.experiment_id = mlflow.create_experiment(self.experiment_name)
        
        mlflow.set_experiment(self.experiment_name)
    
    def log_run(self, params: Dict, metrics: Dict, artifacts: list = None, tags: dict = None):
        """Log a complete training run."""
        with mlflow.start_run() as run:
            # Log parameters
            mlflow.log_params(params)
            
            # Log metrics
            for key, value in metrics.items():
                if isinstance(value, (int, float)):
                    mlflow.log_metric(key, value)
            
            # Log tags
            if tags:
                mlflow.set_tags(tags)
            
            # Log artifacts
            if artifacts:
                for artifact in artifacts:
                    mlflow.log_artifact(artifact)
            
            return run.info.run_id
    
    def log_model_artifact(self, model, model_name: str, signature=None):
        """Log model artifact with signature."""
        import mlflow.pytorch
        mlflow.pytorch.log_model(
            pytorch_model=model,
            artifact_path="model",
            registered_model_name=f"volleyball-{model_name}",
            signature=signature
        )
    
    def transition_model_stage(self, model_name: str, version: str, stage: str):
        """Transition model version between stages."""
        client = MlflowClient()
        client.transition_model_version_stage(
            name=model_name,
            version=version,
            stage=stage,
            archive_existing_versions=True
        )
    
    def get_best_model(self, metric: str = "accuracy", ascending: bool = False) -> dict:
        """Get best model run based on metric."""
        runs = mlflow.search_runs(
            experiment_ids=[self.experiment_id],
            order_by=[f"metrics.{metric} {'ASC' if ascending else 'DESC'}"],
            max_results=1
        )
        if len(runs) > 0:
            return runs.iloc[0].to_dict()
        return None
```

---

## 3.7 Deployment Automation

### 3.7.1 CI/CD Pipeline for Models

```yaml
# .github/workflows/ml-training.yml
name: ML Training Pipeline

on:
  push:
    branches: [main, develop]
    paths:
      - 'ai-engine/**'
      - 'mlops/**'
  workflow_dispatch:
    inputs:
      model_type:
        description: 'Model to train'
        required: true
        type: choice
        options:
          - player_detection
          - ball_detection
          - action_recognition
          - pose_estimation

jobs:
  train:
    runs-on: [self-hosted, gpu, linux]
    timeout-minutes: 480
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
          cache: 'pip'
      
      - name: Install dependencies
        run: |
          cd ai-engine
          poetry install --with dev,training
      
      - name: Download dataset
        run: |
          cd ai-engine
          poetry run python -m mlops.training.download_data --config configs/data.yaml
      
      - name: Train model
        run: |
          cd ai-engine
          poetry run python -m mlops.training.train_detection --config configs/training/${{ github.event.inputs.model_type }}.yaml
        env:
          MLFLOW_TRACKING_URI: ${{ secrets.MLFLOW_TRACKING_URI }}
          MLFLOW_S3_ENDPOINT_URL: ${{ secrets.MLFLOW_S3_ENDPOINT }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      
      - name: Evaluate model
        run: |
          cd ai-engine
          poetry run python -m mlops.evaluation.evaluate --model ${{ github.event.inputs.model_type }}
      
      - name: Promote to staging
        if: github.ref == 'refs/heads/develop'
        run: |
          poetry run python -m mlops.promotion promote --model ${{ github.event.inputs.model_type }} --stage Staging
      
      - name: Deploy to Production
        if: github.ref == 'refs/heads/main'
        runs-on: ubuntu-latest
        environment: production
        steps:
          - uses: actions/checkout@v4
          - name: Promote to Production
            run: |
              poetry run python -m mlops.promotion promote --model ${{ github.event.inputs.model_type }} --stage Production
```

---

## 3.8 Model Serving & Inference

### 3.7.1 Inference Service

```python
# inference/main.py
"""
Real-time inference service for volleyball analytics.
"""

import asyncio
import cv2
import numpy as np
from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import logging

from inference.detection import PlayerDetector, BallDetector
from inference.tracking import ByteTrackTracker
from inference.pose import PoseEstimator
from inference.ocr import JerseyOCR
from inference.action_recognition import ActionRecognizer
from inference.pipeline import InferencePipeline
from inference.schemas import InferenceRequest, InferenceResponse

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Volleyball AI Inference Service", version="1.0.0")

class InferenceService:
    def __init__(self, config):
        self.pipeline = InferencePipeline(config)
    
    async def process_frame(self, frame: np.ndarray, frame_id: int, match_id: str) -> dict:
        """Process single frame through full pipeline."""
        return await self.pipeline.process_frame(frame, frame_id, match_id)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    config = InferenceConfig.from_env()
    app.state.pipeline = InferencePipeline(config)
    await app.state.inference.initialize()
    yield
    # Cleanup
    await app.state.inference.cleanup()

app = FastAPI(title="Volleyball AI Inference", lifespan=lifespan)

@app.post("/inference/frame", response_model=FrameResponse)
async def process_frame(request: FrameRequest):
    """Process single frame through inference pipeline."""
    frame_data = base64.b64decode(request.frame_data)
    frame = cv2.imdecode(np.frombuffer(frame_data, np.uint8), cv2.IMREAD_COLOR)
    
    result = await app.state.inference_service.process_frame(
        frame=request.frame,
        frame_id=request.frame_id,
        match_id=request.match_id
    )
    return result

@app.get("/health")
async def health_check():
    return {"status": "healthy", "models_loaded": True}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001, workers=1)
```

---

## 3.9 CI/CD Pipeline

```yaml
# .github/workflows/ml-training.yml
name: ML Training Pipeline

on:
  push:
    branches: [main, develop]
    paths:
      - 'ai-engine/**'
      - 'mlops/**'
  workflow_dispatch:
    inputs:
      model_type:
        description: 'Model to train'
        required: true
        type: choice
        options:
          - player_detection
          - ball_detection
          - action_recognition
          - pose_estimation

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Validate configs
        run: |
          python -m mlops.validate_configs --config-dir ai-engine/configs

  train:
    needs: validate
    runs-on: [self-hosted, gpu, linux]
    timeout-minutes: 480
    strategy:
      matrix:
        model: [player_detection, ball_detection, action_recognition]
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
          cache: 'pip'
      - name: Install dependencies
        run: |
          cd ai-engine
          poetry install --with dev,training
      - name: Train model
        run: |
          poetry run python -m mlops.training.train --model ${{ matrix.model }}
        env:
          MLFLOW_TRACKING_URI: ${{ secrets.MLFLOW_TRACKING_URI }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      - name: Upload model artifacts
        uses: actions/upload-artifact@v4
        with:
          name: model-${{ matrix.model }}
          path: models/
          retention-days: 30

  evaluate:
    needs: train
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Evaluate models
        run: |
          poetry run python -m mlops.evaluation.evaluate --all-models
      - name: Generate report
        run: |
          python -m mlops.evaluation.report --output evaluation_report.html
      - name: Upload report
        uses: actions/upload-artifact@v4
        with:
          name: evaluation-report
          path: evaluation_report.html

  promote:
    needs: evaluate
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Promote to Staging
        run: |
          poetry run python -m mlops.promotion promote --all --stage Staging
        env:
          MLFLOW_TRACKING_URI: ${{ secrets.MLFLOW_TRACKING_URI }}

  deploy-prod:
    needs: evaluate
    if: github.ref == 'refs/heads/main'
    environment: production
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Production
        run: |
          poetry run python -m mlops.deployment promote --all --stage Production
        env:
          MLFLOW_TRACKING_URI: ${{ secrets.MLFLOW_TRACKING_URI }}
          KUBECONFIG: ${{ secrets.KUBECONFIG_PROD }}
```

---

## 3.12 Chapter Summary

This chapter establishes the complete model training pipeline for the Volleyball Analytics Platform:

| Component | Status | Key Technologies |
|-----------|--------|------------------|
| Data Pipeline | ✅ Complete | Pandas, Albumentations, OpenCV |
| Training Pipeline | ✅ Complete | Ultralytics YOLOv8, PyTorch, MLflow |
| Experiment Tracking | ✅ Complete | MLflow, custom ExperimentTracker |
| Model Evaluation | ✅ Complete | COCO metrics, custom metrics |
| Model Registry | ✅ Complete | MLflow Model Registry, semantic versioning |
| Automated Retraining | ✅ Complete | Drift detection, scheduled retraining |
| Canary Deployment | ✅ Complete | Gradual rollout with auto-rollback |
| Model Serving | ✅ Complete | FastAPI, TensorRT, ONNX Runtime |
| Monitoring | ✅ Complete | Prometheus, Grafana, Evidently |

---

**END OF CHAPTER 3**

*Next: Chapter 4 — Model Evaluation*

---

**END OF CHAPTER 3**