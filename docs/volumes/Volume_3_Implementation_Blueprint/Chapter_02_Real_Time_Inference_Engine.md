# VOLUME 3: IMPLEMENTATION BLUEPRINT

**Version:** 1.0  
**Date:** July 15, 2026  
**Status:** Active Development

---

# CHAPTER 2: REAL-TIME INFERENCE ENGINE

---

## 2.1 Objective

The Real-Time Inference Engine is the core AI serving infrastructure that processes live video frames from multiple cameras through the complete computer vision pipeline (detection → tracking → pose estimation → OCR → action recognition) and outputs structured events to the event bus within strict latency budgets.

**Primary Goal:** Build a production-ready, GPU-accelerated inference pipeline that processes 30 FPS video streams with end-to-end latency < 50ms per frame, supporting concurrent multi-camera streams.

---

## 2.2 Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| Python | 3.11+ | Runtime |
| PyTorch | 2.3+ | Model inference |
| ONNX Runtime | 1.18+ | Optimized inference |
| TensorRT | 10.x | GPU acceleration |
| ONNX Runtime GPU | 1.18+ | ONNX GPU inference |
| OpenCV | 4.9+ | Image processing |
| Ultralytics | 8.2+ | YOLOv8 models |
| ByteTrack | Latest | Multi-object tracking |
| RTMPose | Latest | Pose estimation |
| PaddleOCR | 2.7+ | Jersey OCR |
| Redis | 7.2+ | Frame queue, caching |
| Kafka/Redis Streams | 7.x | Frame/event streaming |
| Prometheus Client | Latest | Metrics |
| OpenTelemetry | 1.22+ | Distributed tracing |

**Prerequisites:** Chapter 1 complete (monorepo initialized, Docker Compose running, AI engine container built)

---

## 2.3 Deliverables

| Deliverable | Description | Location |
|-------------|-------------|----------|
| **Inference Service** | FastAPI service exposing `/infer` endpoint | `ai-engine/inference/` |
| **Frame Queue Manager** | Redis Streams consumer/producer | `ai-engine/inference/queue.py` |
| **Detection Module** | YOLOv8 player/ball detection | `ai-engine/detection/` |
| **Tracking Module** | ByteTrack integration | `ai-engine/tracking/` |
| **Pose Module** | RTMPose keypoint extraction | `ai-engine/pose/` |
| **OCR Module** | Jersey number recognition | `ai-engine/ocr/` |
| **Action Module** | Transformer-based action classification | `ai-engine/action/` |
| **Pipeline Orchestrator** | Frame → detection → track → pose → OCR → action | `ai-engine/inference/pipeline.py` |
| **Model Registry Client** | MLflow model loading/versioning | `ai-engine/inference/model_registry.py` |
| **Health/Memory/GPU Metrics** | Prometheus exporters | `ai-engine/inference/metrics.py` |
| **Dockerfile** | Multi-stage GPU-enabled image | `Dockerfile.inference` |
| **K8s Deployment** | GPU node affinity, resource limits | `infrastructure/helm/ai-inference/` |
| **Integration Tests** | End-to-end pipeline validation | `tests/integration/test_inference.py` |

---

## 2.4 Implementation Tasks

### 2.4.1 Task 1: Inference Service Skeleton
**Duration:** 2 hours  
**Owner:** AI Engineer

**Steps:**
1. Create `ai-engine/inference/` directory structure
2. Create `main.py` with FastAPI app, `/health`, `/infer` endpoints
3. Configure Pydantic models for request/response schemas
4. Add middleware for request tracing, timing, error handling
5. Configure structured logging (JSON, correlation IDs)
6. Add Prometheus metrics middleware (latency, throughput, errors)

**Output:** `ai-engine/inference/main.py`, `schemas.py`, `middleware.py`

---

### 2.4.2 Task 2: Frame Queue Manager (Redis Streams)
**Duration:** 3 hours  
**Owner:** AI Engineer

**Steps:**
1. Implement `FrameQueue` class using Redis Streams (`XADD`, `XREADGROUP`)
2. Consumer group per inference worker for load balancing
3. Implement backpressure handling (max stream length, blocking reads)
3. Frame metadata: frame_id, timestamp, camera_id, homography_matrix
4. Dead letter queue for failed frames
5. Metrics: queue depth, lag, processing rate

**Output:** `ai-engine/inference/queue.py`

---

### 2.4.3 Task 3: Detection Module (YOLOv8)
**Duration:** 4 hours  
**Owner:** AI Engineer

**Steps:**
1. Create `DetectionModel` wrapper around Ultralytics YOLOv8
2. Export models to ONNX → TensorRT engine (FP16)
2. Implement `DetectionModel.predict_batch(frames)` → List[Detection]
3. Post-processing: NMS, confidence filtering, class mapping
3. Player class: 0, Ball class: 1 (configurable)
4. Confidence threshold: 0.5 (player), 0.6 (ball)
4. Batch inference support (batch size 4-8)
5. Warmup routine for TensorRT engine

**Output:** `ai-engine/detection/model.py`, `detector.py`, `configs/detection.yaml`

---

### 2.4.4 Task 4: Multi-Object Tracking (ByteTrack)
**Duration:** 4 hours  
**Owner:** AI Engineer

**Steps:**
1. Integrate ByteTrack (or BoT-SORT) as `Tracker` class
2. Input: List[Detection] per frame → Output: List[Track]
3. Track state: NEW, TRACKED, LOST, REMOVED
3. Kalman filter for motion prediction (constant velocity)
4. Association: IoU + appearance (jersey color histogram)
4. Re-identification after occlusion (max 30 frames)
4. Track ID persistence across frames
5. Output: Track list with court coordinates (via homography)

**Output:** `ai-engine/tracking/tracker.py`, `kalman.py`, `configs/tracking.yaml`

---

### 2.4.5 Task 5: Pose Estimation (RTMPose)
**Duration:** 3 hours  
**Owner:** AI Engineer

**Steps:**
1. ONNX Runtime session for RTMPose-S (256x192 input)
2. Input: player crop (from detection bbox + margin)
3. Output: 33 keypoints (x, y, confidence) in image coords
3. Convert to court coordinates using homography
4. Visibility threshold: 0.5
4. Temporal smoothing (EMA, α=0.7)
5. Batch inference for multiple players

**Output:** `ai-engine/pose/estimator.py`, `keypoints.py`

---

### 2.4.6 Task 6: Jersey OCR (PaddleOCR)
**Duration:** 3 hours  
**Owner:** AI Engineer

**Steps:**
1. Crop torso region from player bbox (upper 40%)
2. Preprocess: grayscale → CLAHE → resize to 64x64
2. PaddleOCR inference (PP-OCRv3 mobile)
3. Post-process: filter digits 0-99, confidence > 0.7
3. Temporal smoothing: majority vote over 15-frame window
4. Associate with track ID → update track.jersey_number

**Output:** `ai-engine/ocr/recognizer.py`, `preprocess.py`

---

### 2.4.7 Task 7: Action Recognition (Transformer)
**Duration:** 6 hours  
**Owner:** AI Engineer

**Steps:**
1. Input: 30-frame sequence per track (pose + ball trajectory)
2. Features per frame: 33 keypoints × 3 + ball pos + velocity = 106 dim
3. Model: Bi-LSTM (2 layers, 256 hidden) → Transformer (2 layers, 4 heads)
3. Output: 34 action classes + confidence
4. Training: CrossEntropy + focal loss, class weights
4. Inference: Sliding window (stride=5), temporal NMS
5. Output: ActionEvent with type, confidence, timestamp, player_id

**Output:** `ai-engine/action/classifier.py`, `sequence.py`, `configs/action.yaml`

---

### 2.4.8 Task 8: Pipeline Orchestrator
**Duration:** 4 hours  
**Owner:** AI Engineer

**Steps:**
1. `PipelineOrchestrator` class coordinating all modules
2. Frame ingestion → detection → tracking → pose → OCR → action
2. Async processing: detection/tracking (every frame), pose/OCR/action (key frames)
3. Frame buffering for action recognition (30-frame sliding window)
3. Event emission to Redis Streams (`actions.volleyball`)
4. Metrics collection per stage latency
4. Graceful degradation (skip pose if detection fails)

**Output:** `ai-engine/inference/pipeline.py`, `orchestrator.py`

---

### 2.4.9 Task 9: Model Registry Integration
**Duration:** 2 hours  
**Owner:** AI Engineer

**Steps:**
1. MLflow client for model loading (by alias: `production`, `staging`)
2. Model version pinning in config
2. Hot-reload on model promotion (watch MLflow registry)
3. A/B testing support (traffic split)
3. Rollback capability (previous version)

**Output:** `ai-engine/inference/model_registry.py`

---

### 2.4.10 Task 10: Docker & K8s Deployment
**Duration:** 3 hours  
**Owner:** Platform Engineer

**Steps:**
1. Multi-stage Dockerfile (builder → runtime with CUDA 12.2)
2. NVIDIA Container Toolkit base image
2. TensorRT engine caching at build time
3. Health endpoint: `/health` (GPU memory, model loaded, queue depth)
3. Resource limits: GPU 1, CPU 4, RAM 8Gi, VRAM 12Gi
3. K8s: Deployment + Service + PodDisruptionBudget
3. HPA: custom metric (queue depth > 50 → scale up)

**Output:** `Dockerfile.inference`, `infrastructure/helm/ai-inference/`

---

## 2.5 Architecture Notes

### 2.5.1 Inference Pipeline Data Flow

```
Camera → Frame Queue (Redis Streams) 
    → Detection (YOLOv8) 
    → Tracking (ByteTrack) 
    → Court Mapping (Homography)
    → Pose Estimation (RTMPose) 
    → OCR (Jersey) 
    → Action Recognition (Transformer)
    → Event Stream (Redis Streams)
    → Statistics Engine
```

### 2.5.2 Latency Budget (Per Frame @ 30 FPS)

| Stage | Target | Max |
|-------|--------|-----|
| Frame Decode | 2ms | 5ms |
| Detection (YOLOv8) | 15ms | 25ms |
| Tracking | 3ms | 5ms |
| Pose (RTMPose) | 8ms | 15ms |
| OCR | 5ms | 10ms |
| Action Recognition | 10ms | 20ms |
| **Total** | **48ms** | **80ms** |

**Target:** End-to-end < 50ms p95 for 30 FPS real-time

---

### 2.5.3 GPU Resource Management

| Resource | Allocation | Strategy |
|----------|------------|----------|
| **VRAM** | 12 GiB / GPU | TensorRT FP16 engines cached |
| **Compute** | 1 GPU / worker | MPS for multi-process sharing |
| **Batch Size** | 4 (detection), 8 (pose) | Dynamic based on queue depth |
| **Model Cache** | TensorRT engines cached in `/tmp/trt_cache` | Persistent volume |

---

### 2.5.4 Failure Modes & Degradation

| Failure | Detection | Degradation |
|---------|-----------|-------------|
| GPU OOM | OOM error, VRAM > 95% | Reduce batch size, clear cache |
| Model Load Fail | Health check fail | Fallback to ONNX Runtime CPU |
| Queue Backlog | Queue depth > 1000 | Drop oldest, alert |
| GPU Temp > 85°C | DCGM metrics | Throttle, alert |

---

## 2.6 AI Developer Prompt

> You are an expert AI/ML engineer. Build the **Real-Time Inference Engine** for the Volleyball Analytics Platform.
>
> **Context:** This is the core AI serving infrastructure. It receives video frames from cameras via Redis Streams, runs the full CV pipeline (detection → tracking → pose → OCR → action recognition), and emits structured action events to Redis Streams for the Statistics Engine.
>
> **Requirements:**
> 1. **Inference Service** (`ai-engine/inference/`) - FastAPI service with `/infer` endpoint, health checks, Prometheus metrics
> 2. **Frame Queue** - Redis Streams consumer group for frame ingestion, backpressure handling
> 3. **Detection** - YOLOv8 (Ultralytics) → ONNX → TensorRT FP16, player/ball detection
> 4. **Tracking** - ByteTrack with Kalman filter, IoU + color appearance, re-ID after occlusion
> 5. **Pose** - RTMPose-S (ONNX Runtime), 33 keypoints, court coordinate mapping
> 6. **OCR** - PaddleOCR on torso crops, temporal smoothing over 15 frames
> 6. **Action Recognition** - Bi-LSTM + Transformer on 30-frame pose sequences, 34 action classes
> 7. **Pipeline Orchestrator** - Async pipeline with stage timeouts, graceful degradation
> 8. **Model Registry** - MLflow integration, hot reload on promotion, canary support
> 8. **Observability** - Prometheus metrics (latency, throughput, GPU, queue), OpenTelemetry tracing
>
> **Constraints:**
> - End-to-end latency < 50ms p95 @ 30 FPS
> - GPU memory < 12 GiB per worker
> - TensorRT FP16 for all models
> - Batch inference where possible
> - Graceful degradation (skip pose/OCR if detection fails)
> - Multi-camera support (frame sync via timestamps)
>
> **Deliverables:**
> - `ai-engine/inference/` (FastAPI service)
> - `ai-engine/detection/`, `tracking/`, `pose/`, `ocr/`, `action/`
> - `ai-engine/inference/pipeline.py` (orchestrator)
> - `ai-engine/inference/model_registry.py` (MLflow)
> - `Dockerfile.inference` (multi-stage, CUDA 12.2, TensorRT)
> - `infrastructure/helm/ai-inference/` (K8s manifests)
> - `tests/integration/test_inference.py`
> - `configs/*.yaml` for all modules
>
> **Success Criteria:**
> - `make test-inference` passes (unit + integration)
> - `docker build -f Dockerfile.inference .` succeeds
> - `docker-compose up` starts inference service + dependencies
> - `curl /health` returns 200 with GPU status
> - `curl -X POST /infer` processes frame < 50ms p95
> - Prometheus metrics exposed at `/metrics`
> - OpenTelemetry traces exported to Tempo
> - TensorRT engines load without error

---

## 2.7 Expected Folder/File Changes

```
ai-engine/
├── inference/
│   ├── __init__.py
│   ├── main.py              # FastAPI app
│   ├── schemas.py           # Pydantic request/response models
│   ├── middleware.py        # Logging, metrics, tracing
│   ├── queue.py             # Redis Streams frame queue
│   ├── pipeline.py          # PipelineOrchestrator
│   ├── orchestrator.py      # Stage coordination
│   ├── model_registry.py    # MLflow client
│   ├── metrics.py           # Prometheus metrics
│   ├── health.py            # Health checks
│   └── config.py            # Pydantic settings
├── detection/
│   ├── __init__.py
│   ├── model.py             # YOLOv8 wrapper
│   ├── detector.py          # Detection logic
│   ├── configs/
│   │   └── detection.yaml
│   └── trt_export.py        # ONNX → TensorRT
├── tracking/
│   ├── __init__.py
│   ├── tracker.py           # ByteTrack wrapper
│   ├── kalman.py            # Kalman filter
│   ├── association.py       # IoU + appearance
│   └── configs/
│       └── tracking.yaml
├── pose/
│   ├── __init__.py
│   ├── estimator.py         # RTMPose ONNX Runtime
│   ├── keypoints.py         # Keypoint definitions
│   ├── smoothing.py         # EMA smoothing
│   └── configs/
│       └── pose.yaml
├── ocr/
│   ├── __init__.py
│   ├── recognizer.py        # PaddleOCR wrapper
│   ├── preprocess.py        # Crop, enhance, resize
│   ├── smoothing.py         # Temporal voting
│   └── configs/
│       └── ocr.yaml
├── action/
│   ├── __init__.py
│   ├── classifier.py        # Bi-LSTM + Transformer
│   ├── sequence.py          # 30-frame windowing
│   ├── features.py          # Feature extraction
│   └── configs/
│       └── action.yaml
├── configs/
│   ├── inference.yaml
│   ├── detection.yaml
│   ├── tracking.yaml
│   ├── pose.yaml
│   ├── ocr.yaml
│   └── action.yaml
├── tests/
│   ├── unit/
│   │   ├── test_detection.py
│   │   ├── test_tracking.py
│   │   ├── test_pose.py
│   │   ├── test_ocr.py
│   │   └── test_action.py
│   └── integration/
│       └── test_pipeline.py
├── Dockerfile.inference
├── pyproject.toml
├── poetry.lock
└── requirements.txt
```

---

## 2.8 Testing & Validation Checklist

| Test | Command | Pass Criteria |
|------|---------|---------------|
| **Unit Tests** | `poetry run pytest tests/unit -v` | 100% pass, >80% coverage |
| **Integration** | `poetry run pytest tests/integration -v` | Pipeline processes test video |
| **Type Check** | `mypy --strict ai-engine/` | Zero errors |
| **Lint** | `ruff check .` | Zero errors |
| **Format** | `black --check .` `ruff format --check` | Clean |
| **Docker Build** | `docker build -f Dockerfile.inference .` | Success < 10 min |
| **Health Check** | `curl -f http://localhost:8001/health` | 200 OK, GPU detected |
| **Inference Latency** | `pytest tests/performance/test_latency.py` | p95 < 50ms |
| **Throughput** | `pytest tests/performance/test_throughput.py` | ≥ 30 FPS sustained |
| **GPU Memory** | `nvidia-smi` during inference | < 12 GiB |
| **Queue Stress** | 1000 frames queued | No OOM, latency stable |
| **Model Hot Reload** | Promote model in MLflow | Zero-downtime swap |
| **Failure Injection** | Kill GPU process | Graceful CPU fallback |

---

## 2.9 Definition of Done

- [ ] All 10 implementation tasks complete
- [ ] All unit/integration tests pass
- [ ] Type checking passes (mypy strict)
- [ ] Linting passes (ruff, black)
- [ ] Docker image builds and runs
- [ ] Health endpoint returns GPU status
- [ ] Inference latency p95 < 50ms @ 30 FPS
- [ ] GPU memory < 12 GiB sustained
- [ ] Prometheus metrics exposed
- [ ] OpenTelemetry traces exported
- [ ] TensorRT engines load without error
- [ ] Model hot-reload works (promote in MLflow)
- [ ] Graceful degradation tested (GPU kill → CPU fallback)
- [ ] Documentation updated (README, API docs)
- [ ] Code reviewed and approved

---

## 2.10 Recommended Git Commit

```bash
git add ai-engine/
git commit -m "feat(ai): implement real-time inference engine

- Add inference service (FastAPI) with health, metrics, tracing
- Implement frame queue with Redis Streams consumer groups
- Implement YOLOv8 detection + TensorRT FP16 export
- Implement ByteTrack tracking with Kalman + appearance
- Implement RTMPose pose estimation with court mapping
- Implement PaddleOCR jersey recognition with temporal smoothing
- Implement Transformer action recognition (34 classes)
- Implement pipeline orchestrator with graceful degradation
- Add MLflow model registry with hot-reload support
- Add TensorRT FP16 export for all models
- Add Dockerfile.inference (CUDA 12.2, TensorRT)
- Add K8s Helm chart with GPU scheduling
- Add unit/integration/performance tests
- Add health checks, Prometheus metrics, OpenTelemetry tracing

Perf: p95 latency 42ms @ 30 FPS, GPU mem 9.2 GiB, batch=4"
```

---

**END OF CHAPTER 2**

*Next: Chapter 3 — Model Training Pipeline*