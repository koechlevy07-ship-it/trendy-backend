# VOLUME 2: AI ENGINEERING & COMPUTER VISION IMPLEMENTATION SPECIFICATION (AECVIS)

**Version:** 1.0  
**Date:** July 15, 2026  
**Status:** Active Development

---

# CHAPTER 2: AI DEVELOPMENT ENVIRONMENT

---

## 2.1 Purpose

This chapter defines the standard development environment required for building, training, testing, and deploying the AI components of the Volleyball Analytics Platform.

The objectives are to:

- Standardize development environments
- Improve reproducibility
- Simplify onboarding
- Ensure compatibility between developers
- Optimize AI training and inference

---

## 2.2 Development Philosophy

Every developer should work in an isolated, reproducible environment.

The development environment should support:

- AI model training
- Dataset annotation
- Video processing
- Experiment tracking
- Local inference testing
- Integration with backend APIs

Where possible, project dependencies should be managed through virtual environments and configuration files rather than manual installation.

---

## 2.3 Hardware Requirements

The platform should support three hardware profiles.

### Beginner Workstation

Suitable for: learning, small experiments, dataset annotation, API development.

| Component | Recommendation |
|-----------|----------------|
| CPU | Quad-core processor or better |
| RAM | 16 GB |
| GPU | Optional |
| Storage | 512 GB SSD |
| OS | Windows 11, Ubuntu LTS, or macOS (Apple Silicon supported where compatible) |

### AI Development Workstation

Suitable for: model training, video processing, real-time testing.

| Component | Recommendation |
|-----------|----------------|
| CPU | 8-core or better |
| RAM | 32 GB or more |
| GPU | NVIDIA RTX-series with CUDA support |
| VRAM | 8 GB minimum (more is beneficial for larger models) |
| Storage | 1 TB NVMe SSD |

### Production AI Server

Suitable for: live inference, multiple cameras, concurrent matches.

| Characteristic | Recommendation |
|----------------|----------------|
| CPU | Enterprise-grade |
| RAM | 64 GB+ |
| GPU | One or more GPU accelerators |
| Storage | Redundant, high-speed |
| Networking | High-speed |

*Exact specifications should be selected based on expected workload and deployment scale.*

---

## 2.4 Operating Systems

| Platform | Status |
|----------|--------|
| Windows 11 | Supported |
| Ubuntu LTS | **Recommended for AI development** |
| macOS | Supported where dependencies allow |

*Production deployments are recommended on Linux.*

---

## 2.5 Python Environment

A dedicated virtual environment should be created for the project.

**Benefits:**
- Dependency isolation
- Easier upgrades
- Consistent package versions
- Simplified collaboration

Each service may use its own environment if appropriate.

**Recommended approach:** `conda` or `venv` + `pip-tools` / `poetry` for dependency resolution.

---

## 2.6 GPU Support

GPU acceleration is primarily used for:

- Model training
- Real-time inference
- Video processing
- Batch processing

If no compatible GPU is available, CPU execution should remain possible for development and testing, though with reduced performance.

**CUDA Requirements:**
- CUDA 11.8+ (matching PyTorch build)
- cuDNN 8.6+
- NVIDIA Driver 525+

---

## 2.7 Project Directory Structure

```
volleyball-analytics-ai/
├── datasets/
│   ├── raw/
│   ├── processed/
│   ├── annotations/
│   └── versions/
│
├── models/
│   ├── detection/
│   ├── tracking/
│   ├── pose/
│   ├── ocr/
│   ├── action/
│   └── deployed/
│
├── training/
│
├── inference/
│
├── evaluation/
│
├── experiments/
│
├── notebooks/
│
├── services/
│
├── tests/
│
├── scripts/
│
├── configs/
│
└── documentation/
```

| Directory | Purpose |
|-----------|---------|
| `datasets/` | Raw, processed, annotated data + versioning |
| `models/` | Trained weights organized by task + production artifacts |
| `training/` | Training scripts, configs, pipelines |
| `inference/` | Inference engines, optimization, serving |
| `evaluation/` | Metrics, benchmarking, regression tests |
| `experiments/` | MLflow tracking, configs, artifacts |
| `notebooks/` | Exploration, visualization, debugging |
| `services/` | AI microservices (FastAPI) |
| `tests/` | Unit, integration, regression tests |
| `scripts/` | Utility scripts (data prep, conversion, etc.) |
| `configs/` | YAML/JSON configs for all environments |
| `documentation/` | Component docs, API refs, runbooks |

---

## 2.8 Dependency Management

| Practice | Implementation |
|----------|----------------|
| **Version Control** | `requirements.txt` / `pyproject.toml` in Git |
| **Lock Files** | `requirements.lock` or `poetry.lock` committed |
| **Security Scanning** | `pip-audit`, `safety`, `pipdeptree` in CI |
| **Virtual Environments** | Per-project or per-service |
| **Reproducibility** | Locked versions, pinned CUDA/cuDNN |

**Per-module `requirements.txt` example:**
```
# detection/requirements.txt
ultralytics==8.0.206
opencv-python-headless==4.8.1.78
torch==2.1.0+cu118
torchvision==0.16.0+cu118
numpy==1.24.3
```

---

## 2.9 Configuration Management

Configuration values should **never** be hard-coded.

| Config Type | Examples |
|-------------|----------|
| Camera Sources | RTSP URLs, device indices, resolution |
| Database | Host, port, credentials (from secret manager) |
| Model Paths | Local paths, S3 URIs, registry URIs |
| Thresholds | Detection conf, tracking IOU, OCR min-conf |
| API Endpoints | Internal service URLs, external webhooks |
| Logging | Level, format, destination |

**Configuration Format:** YAML with environment-specific overrides.

```yaml
# configs/detection.yaml
model:
  path: "models/detection/player_yolov8m_v2.1.0.pt"
  confidence: 0.5
  iou: 0.45
  device: "auto"  # auto, cpu, cuda:0
  imgsz: 640

tracking:
  algorithm: "bytetrack"
  track_thresh: 0.5
  track_buffer: 30
  match_thresh: 0.8
```

**Runtime:** Load via `pydantic-settings` with environment variable overrides.

---

## 2.10 Logging Standards

Every AI module generates structured logs (JSON).

**Required Fields:**
```json
{
  "timestamp": "2026-07-15T14:32:17.420Z",
  "level": "INFO",
  "module": "detection.player",
  "message": "Processed frame 12450",
  "correlation_id": "evt_abc123",
  "fields": {
    "frame_number": 12450,
    "detections": 12,
    "inference_ms": 28
  }
}
```

**Log Levels:**
| Level | Usage |
|-------|-------|
| DEBUG | Verbose debugging, per-frame details |
| INFO | Normal operation milestones |
| WARNING | Degraded performance, recoverable issues |
| ERROR | Failed operations, retry exhausted |
| CRITICAL | System failure, immediate attention |

**Implementation:** Python `structlog` or `loguru` with JSON formatter.

---

## 2.11 Experiment Management

Every training run is tracked as an **MLflow Experiment**.

**Required Tracking:**
| Field | Description |
|-------|-------------|
| `model_version` | Semantic version (e.g., `v2.1.0`) |
| `dataset_version` | DVC tag (e.g., `volleyball-player-v2.3`) |
| `hyperparameters` | LR, batch size, epochs, optimizer, scheduler |
| `training_duration` | Wall-clock time |
| `hardware` | GPU type, count, CPU, RAM |
| `evaluation_metrics` | mAP, precision, recall, F1, latency |
| `notes` | Qualitative observations, issues |

**Tooling:** MLflow + DVC for data lineage. Auto-logged via `mlflow.pytorch.autolog()`.

---

## 2.12 Dataset Versioning

Datasets are versioned with **DVC** (Data Version Control).

| Release Artifact | Content |
|------------------|---------|
| Version Tag | Semantic (e.g., `v2.3.0`) |
| Collection Date | ISO timestamp |
| Annotation Status | % complete, pending, reviewed |
| Image Count | Train / val / test splits |
| Video Count | Source videos |
| Quality Assessment | Annotator agreement, class balance |
| Known Limitations | Lighting gaps, missing angles |

**Storage:** DVC remote → S3/MinIO. Git tracks `.dvc` files only.

---

## 2.13 Model Storage

Each trained model artifact includes a **Model Card** (JSON + MLflow).

| Metadata Field | Example |
|----------------|---------|
| `model_name` | `player-detection-yolov8m` |
| `version` | `v2.1.0` |
| `training_date` | `2026-07-15T10:30:00Z` |
| `framework` | `PyTorch 2.1.0 / Ultralytics 8.0.206` |
| `dataset_version` | `volleyball-player-v2.3` |
| `metrics` | `{mAP50: 0.952, mAP50-95: 0.721, latency_ms: 18}` |
| `checksum` | SHA256 of `.pt` file |

**Promotion:** Only models passing evaluation gates → `models/deployed/`.

---

## 2.14 Testing Environment

| Test Type | Data Source |
|-----------|-------------|
| Unit Tests | Synthetic frames, fixture images |
| Integration | Short recorded clips (10-30s) |
| Regression | Golden-set videos (fixed, versioned) |
| Live Inference | Live camera feed (dev only) |
| Load Test | Replay at 2x/4x speed |

**Golden Set:** Curated 50+ clips covering edge cases (occlusion, blur, lighting, occlusion). Versioned with dataset.

---

## 2.15 Coding Standards

| Standard | Tool |
|----------|------|
| **Formatter** | `black` (line length 100) |
| **Linter** | `ruff` (replaces flake8, isort, pyupgrade) |
| **Type Checker** | `mypy` (strict mode) |
| **Import Sort** | `ruff` (via `isort` rules) |
| **Pre-commit** | `pre-commit` hooks (black, ruff, mypy, pytest) |
| **Docstrings** | NumPy style, required for public API |
| **Type Hints** | Required for all public functions |

**Pre-commit Config:**
```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.1.0
    hooks:
      - id: ruff
      - id: ruff-format
  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.8.0
    hooks:
      - id: mypy
```

---

## 2.16 Performance Profiling

The environment supports profiling:

| Metric | Tool |
|--------|------|
| CPU Usage | `py-spy`, `pyinstrument`, `cProfile` |
| GPU Usage | `nvidia-smi dmon`, `nsys profile`, `torch.profiler` |
| Memory | `memory_profiler`, `torch.cuda.memory_summary()` |
| Inference Latency | Custom timer, `torch.utils.benchmark` |
| Throughput | Custom script (frames/sec) |

**CI Integration:** Benchmark regression test on PR (fail if >5% regression).

---

## 2.17 Security Practices

| Practice | Implementation |
|----------|----------------|
| **Secrets** | Never in code; use secret manager (Vault, AWS SM) |
| **Input Validation** | Pydantic schemas on all external inputs |
| **Dataset Protection** | Encrypted at rest; access-controlled storage |
| **Credentials** | Short-lived tokens; no long-lived keys in env |
| **Dependencies** | `pip-audit` in CI; dependabot alerts |
| **Container Security** | Non-root user, distroless base, signed images |

---

## 2.18 Documentation Standards

Every AI component includes:

| Section | Content |
|---------|---------|
| **Purpose** | What the module does |
| **Inputs** | Expected data format, schema |
| **Outputs** | Produced data format, schema |
| **Dependencies** | External libs, internal modules |
| **Configuration** | All params with defaults |
| **Known Limitations** | Edge cases, failure modes |
| **Examples** | Usage snippets, CLI help |

**Format:** Markdown in `documentation/` + auto-generated from docstrings.

---

## 2.19 Development Workflow

```
Plan Feature
      │
      ▼
Create Feature Branch
      │
      ▼
Implement + Unit Tests
      │
      ▼
Run Integration Tests
      │
      ▼
Performance Benchmark
      │
      ▼
Code Review (PR)
      │
      ▼
Merge to develop
      │
      ▼
CI/CD → Staging
```

**Branch Policy:**
- `main` — production-ready releases
- `develop` — integration branch
- `feature/*` — individual features
- `hotfix/*` — critical fixes

---

## 2.20 Chapter Summary

This chapter defines the standard AI development environment, ensuring consistency across:

- Hardware profiles (beginner → production)
- Operating systems & Python environments
- GPU/CUDA configuration
- Project structure & dependency management
- Configuration, logging, experiment tracking
- Dataset & model versioning
- Testing, coding standards, profiling
- Security, documentation, workflow

A standardized environment minimizes integration issues and supports efficient collaboration as the platform grows.

---

## Transition to Chapter 3

With the development environment established, the next step is to build the most valuable asset in any AI project: **the data**.

**Chapter 3 — Volleyball Dataset Engineering** will define:

- How to collect volleyball video data
- Camera placement strategies
- Dataset design & diversity requirements
- Recording standards
- Public and custom datasets
- Storage organization
- Dataset quality assurance
- Expansion strategy

*This chapter is especially critical because the quality of the AI system will ultimately be constrained by the quality and diversity of its training data.*

---

**END OF CHAPTER 2**

*Next: Chapter 3 — Volleyball Dataset Engineering*