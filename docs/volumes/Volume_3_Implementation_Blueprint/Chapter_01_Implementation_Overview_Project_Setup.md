# VOLUME 3: IMPLEMENTATION BLUEPRINT

**Version:** 1.0  
**Date:** July 15, 2026  
**Status:** Active Development

---

# CHAPTER 1: IMPLEMENTATION OVERVIEW & PROJECT SETUP

---

## 1.1 Purpose

Volume 3 is the **Implementation Blueprint** — the definitive guide for building the Volleyball Analytics Platform. While Volumes 1-2 defined *what* to build and *why*, Volume 3 specifies *exactly how* to build it.

This chapter establishes the foundation: repository structure, development environment, tooling standards, and the architectural principles that govern all implementation decisions in subsequent chapters.

---

## 1.2 Scope of Volume 3

| Chapter | Title | Audience |
|---------|-------|----------|
| 1 | Implementation Overview & Project Setup | All engineers |
| 2 | Real-Time Inference Engine | AI/ML Engineers |
| 3 | Model Training Pipeline | ML Engineers |
| 4 | Model Evaluation & Testing | ML/QA Engineers |
| 5 | Model Optimization & Deployment | ML/Platform Engineers |
| 6 | Frontend Implementation (React/TS) | Frontend Engineers |
| 7 | Dashboard & Visualization Components | Frontend/UI Engineers |
| 8 | Real-Time Features (WebSocket, Live Updates) | Full-Stack Engineers |
| 9 | Reporting & Export Engine | Full-Stack Engineers |
| 10 | Testing Strategy & Quality Gates | QA/All Engineers |
| 11 | Deployment & Operations Guide | DevOps/Platform Engineers |
| 12 | MLOps & Continuous Learning | ML/Platform Engineers |

**Total: 12 chapters (Volume 3: Chapters 1-12)**

---

## 1.3 Implementation Philosophy

| Principle | Application |
|-----------|-------------|
| **Convention over Configuration** | Sensible defaults, minimal boilerplate |
| **Type Safety First** | TypeScript strict mode, Pydantic, mypy strict |
| **Contract-First** | OpenAPI spec → generated types/clients |
| **Immutable Infrastructure** | GitOps, immutable containers, blue/green |
| **Observability by Default** | Metrics, logs, traces baked in |
| **Security by Default** | mTLS, RBAC, secrets management, least privilege |
| **Incremental Delivery** | Small PRs, feature flags, canary releases |
| **Reproducibility** | Locked dependencies, deterministic builds |

---

## 1.4 Repository Structure (Monorepo)

```
volley-analytics-platform/
├── .github/                          # GitHub Actions workflows
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── cd-staging.yml
│   │   ├── cd-production.yml
│   │   └── security-scan.yml
├── frontend/                         # React 18 + TypeScript + Vite
│   ├── src/
│   │   ├── components/               # Shared UI components
│   │   ├── pages/                    # Route-level pages
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── stores/                   # Zustand stores
│   │   ├── hooks/                    # Custom hooks
│   │   ├── api/                      # Generated API client
│   │   ├── utils/                    # Helpers, formatters
│   │   ├── styles/                   # Tailwind, global styles
│   │   ├── types/                    # Shared TypeScript types
│   │   └── main.tsx                  # Entry point
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── Dockerfile
├── backend/                          # FastAPI (Python 3.11+)
│   ├── app/
│   │   ├── api/                      # API routes (v1)
│   │   ├── core/                     # Config, security, database
│   │   ├── models/                   # SQLAlchemy models
│   │   ├── schemas/                  # Pydantic schemas
│   │   ├── services/                 # Business logic
│   │   ├── repositories/             # Data access layer
│   │   ├── websocket/                # WebSocket handlers
│   │   └── main.py                   # FastAPI app factory
│   ├── alembic/                      # Database migrations
│   ├── tests/
│   ├── pyproject.toml
│   ├── Dockerfile
│   └── requirements.txt
├── ai-engine/                        # AI/ML Services (Python)
│   ├── detection/
│   ├── tracking/
│   ├── pose/
│   ├── ocr/
│   ├── action/
│   ├── inference/                    # Unified inference service
│   ├── training/                     # Training pipelines
│   ├── evaluation/                   # Evaluation scripts
│   ├── models/                       # Model definitions
│   ├── configs/                      # YAML configs
│   ├── pyproject.toml
│   └── Dockerfile
├── ml-models/                        # Model Registry (DVC/MLflow)
│   ├── detection/
│   ├── tracking/
│   ├── pose/
│   ├── ocr/
│   ├── action/
│   └── configs/
├── database/                         # Database Layer
│   ├── migrations/                   # Alembic migrations
│   ├── seeds/                        # Seed data
│   └── scripts/
├── infrastructure/                   # Infrastructure as Code
│   ├── terraform/                    # Cloud resources
│   ├── helm/                         # Kubernetes charts
│   ├── kustomize/                    # K8s overlays
│   └── scripts/
├── docs/                             # Documentation
│   ├── architecture/
│   ├── api/
│   ├── deployment/
│   └── runbooks/
├── scripts/                          # Utility scripts
├── tests/                            # Cross-cutting E2E, contract tests
├── .github/
│   ├── workflows/
│   └── dependabot.yml
├── docker-compose.yml                # Local development stack
├── docker-compose.override.yml       # Local overrides (gitignored)
├── Makefile                          # Common commands
├── .pre-commit-config.yaml
├── .gitignore
├── README.md
└── CLAUDE.md                         # AI assistant context
```

---

## 1.5 Technology Stack (Locked Versions)

| Layer | Technology | Version | Rationale |
|-------|------------|---------|-----------|
| **Frontend Framework** | React | 18.2 | Stable, concurrent features |
| **Build Tool** | Vite | 5.x | Fast HMR, optimized builds |
| **Language** | TypeScript | 5.4 | Strict mode, latest features |
| **State Management** | Zustand | 4.5 | Lightweight, TypeScript-native |
| **Data Fetching** | TanStack Query | 5.x | Server state, caching, mutations |
| **Routing** | React Router | 6.22 | Stable, nested routes |
| **Styling** | Tailwind CSS | 3.4 | Utility-first, JIT |
| **Charts** | Recharts / ECharts | Latest | Declarative, responsive |
| **Backend Framework** | FastAPI | 0.110 | Fast, async, auto OpenAPI |
| **Language** | Python | 3.11 | Performance, typing support |
| **ORM** | SQLAlchemy | 2.0 | Async, 2.0 style |
| **Validation** | Pydantic | 2.7 | Fast, strict, OpenAPI integration |
| **Migrations** | Alembic | 1.12 | Versioned, reversible |
| **Async Runtime** | asyncio / anyio | Native | High concurrency |
| **AI Framework** | PyTorch | 2.3 | Production-ready, ONNX export |
| **CV Library** | OpenCV / Ultralytics | 4.9 / 8.2 | Detection, tracking |
| **Pose Estimation** | RTMPose / MediaPipe | Latest | Real-time, accurate |
| **OCR** | PaddleOCR / EasyOCR | Latest | Multi-language, fast |
| **Tracking** | ByteTrack / BoT-SORT | Latest | MOTA SOTA |
| **Message Queue** | Redis Streams / RabbitMQ | 7.x | Event streaming |
| **Cache** | Redis | 7.2 | Sub-ms latency |
| **Database** | PostgreSQL | 16 | ACID, JSONB, partitioning |
| **Object Storage** | S3 / MinIO | — | Videos, models, exports |
| **Container Runtime** | containerd | 1.7 | Kubernetes standard |
| **Orchestration** | Kubernetes (EKS/GKE/AKS) | 1.28 | Managed, auto-scaling |
| **Service Mesh** | Istio | 1.20 | mTLS, traffic, observability |
| **CI/CD** | GitHub Actions + ArgoCD | Latest | GitOps |
| **Monitoring** | Prometheus + Grafana | Latest | Metrics, dashboards |
| **Logging** | Loki + Promtail | Latest | Structured logs |
| **Tracing** | Tempo / Jaeger | Latest | Distributed tracing |
| **Secrets** | Vault / Sealed Secrets | Latest | GitOps-compatible |
| **ML Tracking** | MLflow | 2.11 | Experiment tracking, registry |
| **Pipeline** | Kubeflow / Airflow | Latest | Training pipelines |

---

## 1.6 Development Environment Setup

### 1.6.1 Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Git | ≥ 2.40 | `brew install git` / `winget install Git.Git` |
| Docker | ≥ 24.0 | Docker Desktop / `apt install docker.io` |
| Docker Compose | v2.20+ | Included in Docker Desktop |
| Node.js | 20 LTS | `fnm install 20` / `nvm install 20` |
| Python | 3.11+ | `pyenv install 3.11.9` |
| Poetry | 1.7+ | `pipx install poetry` |
| kubectl | 1.28+ | `brew install kubectl` |
| Helm | 3.12+ | `brew install helm` |
| Terraform | 1.7+ | `brew install terraform` |
| kubectl | 1.28+ | `brew install kubectl` |
| kubectx/kubens | Latest | `brew install kubectx` |

### 1.6.2 Quick Start (Local Development)

```bash
# 1. Clone repository
git clone https://github.com/volleyplatform/volley-analytics-platform.git
cd volley-analytics-platform

# 2. Start local infrastructure (Postgres, Redis, MinIO, Kafka)
docker-compose up -d

# 3. Backend setup
cd backend
poetry install
poetry run alembic upgrade head
poetry run python -m app.main  # Runs on http://localhost:8000

# 4. Frontend setup (new terminal)
cd ../frontend
npm install
npm run dev  # Runs on http://localhost:5173

# 5. AI Engine (separate terminal)
cd ../ai-engine
poetry install
poetry run python -m inference.main  # Runs on http://localhost:8001

# 6. Verify all services
curl http://localhost:8000/health
curl http://localhost:5173
curl http://localhost:8001/health
```

### 1.6.3 Environment Variables (`.env.example`)

```bash
# backend/.env.example
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/volley
REDIS_URL=redis://localhost:6379/0
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
JWT_SECRET_KEY=your-super-secret-key-change-in-production
JWT_ALGORITHM=RS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7
AI_INFERENCE_URL=http://localhost:8001
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# ai-engine/.env.example
MODEL_REGISTRY_URI=s3://mlflow-models
DETECTION_MODEL_PATH=models/detection/yolov8s_v2.1.0.pt
BALL_MODEL_PATH=models/detection/ball_yolov8s_v1.3.0.pt
POSE_MODEL_PATH=models/pose/rtmpose_s_v1.2.0.onnx
OCR_MODEL_PATH=models/ocr/ppocr_v3_mobile.pt
ACTION_MODEL_PATH=models/action/transformer_v1.0.0.pt
DEVICE=cuda:0
BATCH_SIZE=4
CONF_THRESH=0.5
IOU_THRESH=0.45
```

---

## 1.7 Coding Standards & Tooling

### 1.7.1 Python (Backend + AI)

| Tool | Config | Command |
|------|--------|---------|
| **Formatter** | Black (line-length=100) | `black .` |
| **Linter** | Ruff (replaces flake8, isort) | `ruff check . --fix` |
| **Type Checker** | mypy (strict) | `mypy .` |
| **Imports** | Ruff (isort rules) | `ruff check . --select I` |
| **Tests** | pytest + pytest-asyncio | `pytest -v --cov=80` |
| **Pre-commit** | `pre-commit` | `pre-commit run --all-files` |

### 1.7.2 TypeScript (Frontend)

| Tool | Config | Command |
|------|--------|---------|
| **Formatter** | Prettier (semi, singleQuote, tabWidth=2) | `npm run format` |
| **Linter** | ESLint (Airbnb + TypeScript) | `npm run lint` |
| **Type Checker** | tsc --noEmit (strict) | `npm run typecheck` |
| **Tests** | Vitest + React Testing Library | `npm run test` |
| **E2E** | Playwright | `npm run test:e2e` |
| **Visual Regression** | Chromatic / Playwright | `npm run test:visual` |

### 1.7.3 Pre-commit Hooks (`.pre-commit-config.yaml`)

```yaml
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.3.0
    hooks:
      - id: ruff
        args: [--fix, --exit-non-zero-on-fix]
      - id: ruff-format
  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.8.0
    hooks:
      - id: mypy
        additional_dependencies: [pydantic, fastapi, sqlalchemy]
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-toml
  - repo: https://github.com/pre-commit/mirrors-prettier
    rev: v3.1.0
    hooks:
      - id: prettier
        types: [javascript, typescript, json, yaml, markdown]
```

---

## 1.8 Git Workflow & Commit Conventions

### 1.8.1 Conventional Commits

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

**Examples:**
```
feat(api): add live match WebSocket endpoint
fix(ai): resolve ball tracking ID switch during occlusion
docs(api): update WebSocket event schema
refactor(ai): extract pose estimation to separate service
perf(backend): add Redis caching for player profiles
test(frontend): add integration tests for live scoreboard
```

### 1.8.2 Branch Naming

| Pattern | Example |
|---------|---------|
| `feature/<short-description>` | `feat/live-match-websocket` |
| `fix/<short-description>` | `fix/ball-tracking-id-switch` |
| `hotfix/<short-description>` | `hotfix/scoreboard-timer-drift` |
| `chore/<short-description>` | `chore/update-dependencies` |

---

## 1.9 Definition of Done (DoD)

A task/story is **done** when:

- [ ] Code compiles, type-checks, lints cleanly
- [ ] Unit tests pass (≥ 80% coverage on changed code)
- [ ] Integration tests pass
- [ ] Feature works in local dev environment
- [ ] Feature works in staging environment
- [ ] Documentation updated (API docs, runbooks, README)
- [ ] Accessibility checked (WCAG 2.1 AA)
- [ ] Security scan passes (no Critical/High vulns)
- [ ] Performance budget met (latency, bundle size)
- [ ] Code reviewed by ≥ 1 engineer
- [ ] Merged to `develop` (or `main` for hotfix)

---

## 1.10 Key Configuration Files Reference

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Local dev stack (PG, Redis, MinIO, Kafka) |
| `docker-compose.override.yml` | Local overrides (gitignored) |
| `Makefile` | Common dev commands (`make dev`, `make test`, `make build`) |
| `.env.example` | Template for environment variables |
| `pyproject.toml` / `poetry.lock` | Python deps (backend + AI) |
| `package.json` / `package-lock.json` | Node deps |
| `tsconfig.json` | TypeScript strict config |
| `vite.config.ts` | Vite + Vitest + PWA config |
| `tailwind.config.ts` | Design tokens, theme |
| `alembic.ini` | DB migration config |
| `alembic/env.py` | Migration environment |
| `pyproject.toml` | Python tool config (ruff, mypy, pytest) |
| `ruff.toml` | Ruff lint/format rules |
| `mypy.ini` | MyPy strict config |
| `pytest.ini` | Pytest config (async, coverage) |
| `.pre-commit-config.yaml` | Git hooks |
| `dependabot.yml` | Auto dependency updates |
| `CLAUDE.md` | AI assistant context for this repo |

---

## 1.10 Next Steps

With the project foundation established, **Chapter 2** dives into the **Real-Time Inference Engine** — the core AI serving infrastructure that powers live match analysis.

**Next:** Chapter 2 — Real-Time Inference Engine
- GPU-optimized inference pipeline
- Batching, queuing, model serving
- TensorRT / ONNX Runtime optimization
- Multi-model pipeline orchestration
- Latency budgets, batching strategies

---

**END OF CHAPTER 1**

*Volume 3, Chapter 1 — Implementation Overview & Project Setup*