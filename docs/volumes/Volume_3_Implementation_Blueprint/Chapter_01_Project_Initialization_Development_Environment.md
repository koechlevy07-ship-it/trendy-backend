# VOLUME 3: IMPLEMENTATION BLUEPRINT

**Version:** 1.0  
**Date:** July 15, 2026  
**Status:** Active Development  

---

# CHAPTER 1: PROJECT INITIALIZATION & DEVELOPMENT ENVIRONMENT

---

## Chapter Objective

Initialize the Volleyball Analytics Platform repository and establish a standardized development environment for all modules.

---

## Dependencies

- Volume 1 (Master Blueprint & SRS)
- Volume 2 (AI Engineering & Computer Vision Implementation Specification)

---

## Deliverables

At the end of this chapter, the repository shall contain:

```
volleyball-analytics-platform/
├── backend/
├── frontend/
├── ai-engine/
├── mobile/
├── database/
├── infrastructure/
├── deployment/
├── documentation/
├── shared/
└── README.md
```

---

## Implementation Tasks

### Task 1: Create the Git Repository

**Action:** Initialize the Git repository with proper configuration.

**Commands:**
```bash
mkdir volleyball-analytics-platform
cd volleyball-analytics-platform
git init
git branch -m main
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

**Expected Output:** Empty Git repository with `main` branch.

---

### Task 2: Create the Monorepo Folder Structure

**Action:** Create the complete monorepo directory structure.

**Commands:**
```bash
mkdir -p backend frontend ai-engine mobile database infrastructure deployment documentation shared
```

**Verification:**
```bash
find . -type d -maxdepth 1 | sort
```

**Expected Output:**
```
.
./backend
./deployment
./documentation
./frontend
./infrastructure
./mobile
./shared
./database
./infrastructure
```

---

### Task 3: Initialize the Backend Project

**Action:** Initialize the FastAPI backend project with Poetry.

**Commands:**
```bash
cd backend
poetry init --name volley-backend --description "Volleyball Analytics Platform Backend" --author "Your Name <email@example.com>" --python ">=3.11,<3.12" --no-interaction
poetry add fastapi==0.110.0 uvicorn==0.29.0 sqlalchemy==2.0.30 alembic==1.12.1 pydantic==2.7.0 pydantic-settings==2.3.0 python-jose==3.3.0 passlib==1.7.4 bcrypt==4.1.2 python-multipart==0.0.6 redis==5.0.1 psycopg2-binary==2.9.9 python-dotenv==1.0.1 httpx==0.27.0
poetry add --group dev pytest==8.2.0 pytest-asyncio==0.23.0 pytest-cov==4.1.0 httpx==0.27.0 ruff==0.4.0 mypy==1.9.0
```

**Files Created:**
- `backend/pyproject.toml`
- `backend/poetry.lock`
- `backend/.python-version` (contains `3.11`)

**Verification:**
```bash
poetry run python -c "import fastapi; print('FastAPI OK')"
```

---

### Task 4: Initialize the Frontend Project

**Action:** Initialize the React + TypeScript + Vite frontend project.

**Commands:**
```bash
cd frontend
npm create vite@latest . -- --template react-ts
npm install
npm install zustand@4.5.0 @tanstack/react-query@5.17.0 react-router-dom@6.22.0 recharts@2.12.0 echarts@5.5.0 @tanstack/react-table@8.11.0 date-fns@3.3.0 clsx@2.1.0 tailwind-merge@2.2.0
npm install -D tailwindcss@3.4.0 postcss@8.4.35 autoprefixer@10.4.17 @types/react@18.2.0 @types/react-dom@18.2.0 @types/node@20.11.0 eslint@8.56.0 @typescript-eslint/eslint-plugin@7.0.0 @typescript-eslint/parser@7.0.0 prettier@3.2.0 prettier-plugin-tailwindcss@0.5.0 @testing-library/react@14.2.0 @testing-library/jest-dom@6.4.0 vitest@1.2.0 @testing-library/user-event@14.5.0 playwright@1.41.0 @playwright/test@1.41.0
npx tailwindcss init -p
```

**Configuration Files to Update:**

**`tailwind.config.js`:**
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8' },
        court: { green: '#1a7f37', light: '#dcfce7' },
      },
    },
  },
  plugins: [],
}
```

**`tsconfig.json`** (key settings):
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@hooks/*": ["src/hooks/*"],
      "@stores/*": ["src/stores/*"],
      "@api/*": ["src/api/*"],
      "@types/*": ["src/types/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**Verification:**
```bash
npm run build
npm run typecheck
npm run lint
```

---

### Task 5: Initialize the AI Engine

**Action:** Initialize the AI engine Python package.

**Commands:**
```bash
cd ai-engine
poetry init --name volley-ai-engine --description "Volleyball Analytics AI Engine" --author "Your Name <email@example.com>" --python ">=3.11,<3.12" --no-interaction
poetry add torch==2.3.0 torchvision==0.18.0 torchaudio==2.3.0 --index-url https://download.pytorch.org/whl/cu121
poetry add ultralytics==8.2.0 opencv-python==4.9.0.80 pillow==10.0.0 supervision==0.21.0 onnxruntime==1.18.0 onnx==1.16.0 onnxsim==0.4.33
poetry add paddleocr==2.8.0 easyocr==1.7.0 rtpose==0.1.0 mediapipe==0.10.9
poetry add pyyaml==6.0.1 pydantic==2.7.0 pydantic-settings==2.3.0 python-dotenv==1.0.1 loguru==0.7.2
poetry add --group dev pytest==8.2.0 pytest-asyncio==0.23.0 pytest-cov==4.1.0 ruff==0.4.0 mypy==1.9.0 black==24.3.0
```

**Configuration Files to Create:**

**`ai-engine/configs/detection.yaml`:**
```yaml
player_detection:
  model_path: "models/detection/yolov8s_v2.1.0.pt"
  confidence_threshold: 0.5
  iou_threshold: 0.45
  imgsz: 1280
  classes: [0]  # person class

ball_detection:
  model_path: "models/detection/ball_yolov8s_v1.3.0.pt"
  confidence_threshold: 0.3
  iou_threshold: 0.4
  imgsz: 640
  classes: [32]  # sports ball class
```

**`ai-engine/configs/tracking.yaml`:**
```yaml
bytetrack:
  track_thresh: 0.5
  track_buffer: 30
  match_thresh: 0.8
  min_box_area: 100
  mot20: false
```

---

### Task 6: Configure Docker

**Action:** Create Docker configuration for all services.

**Files to Create:**

**`docker-compose.yml`** (root):
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: volley
      POSTGRES_USER: volley
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-volley}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U volley -d volley"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: ${MINIO_SECRET_KEY:-minioadmin}
    volumes:
      - minio_data:/data
    ports:
      - "9000:9000"
      - "9001:9001"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3

  kafka:
    image: confluentinc/cp-kafka:7.5.0
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:29092,PLAINTEXT_HOST://localhost:9092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_VERSION: 2
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
      - "29092:29092"

  zookeeper:
    image: confluentinc/cp-zookeeper:7.5.0
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000

volumes:
  postgres_data:
  redis_data:
  minio_data:
```

**`backend/Dockerfile`:**
```dockerfile
FROM python:3.11-slim AS builder

WORKDIR /app
COPY pyproject.toml poetry.lock ./
RUN pip install --no-cache-dir poetry==1.7.1 && \
    poetry export -f requirements.txt --output requirements.txt --without-hashes

FROM python:3.11-slim AS runtime
WORKDIR /app
COPY --from=builder /app/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**`frontend/Dockerfile`:**
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine AS runtime
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**`ai-engine/Dockerfile`:**
```dockerfile
FROM nvidia/cuda:12.2-runtime-ubuntu22.04 AS builder
WORKDIR /app
COPY pyproject.toml poetry.lock ./
RUN pip install --no-cache-dir poetry==1.7.1 && \
    poetry export -f requirements.txt --output requirements.txt --without-hashes

FROM nvidia/cuda:12.2-runtime-ubuntu22.04 AS runtime
WORKDIR /app
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH
COPY . .
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser
EXPOSE 8001
CMD ["uvicorn", "inference.main:app", "--host", "0.0.0.0", "--port", "8001"]
```

---

### Task 7: Configure Environment Variables

**Action:** Create environment variable templates for all services.

**Files to Create:**

**`.env.example` (root):**
```bash
# Database
POSTGRES_DB=volley
POSTGRES_USER=volley
POSTGRES_PASSWORD=changeme
DATABASE_URL=postgresql+asyncpg://volley:changeme@postgres:5432/volley

# Redis
REDIS_URL=redis://redis:6379/0

# MinIO
MINIO_ENDPOINT=minio:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=changeme
MINIO_BUCKET=videos

# JWT
JWT_SECRET_KEY=your-super-secret-jwt-key-change-in-production
JWT_ALGORITHM=RS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7

# AI Services
AI_INFERENCE_URL=http://ai-engine:8001
DETECTION_MODEL_PATH=models/detection/yolov8s_v2.1.0.pt
BALL_MODEL_PATH=models/detection/ball_yolov8s_v1.3.0.pt
POSE_MODEL_PATH=models/pose/rtmpose_s_v1.2.0.onnx
OCR_MODEL_PATH=models/ocr/ppocr_v3_mobile.pt
ACTION_MODEL_PATH=models/action/transformer_v1.0.0.pt

# Frontend
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
VITE_APP_TITLE=Volleyball Analytics Platform

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

### Task 8: Create the Initial README

**Action:** Create comprehensive README with project overview and quick start.

**`README.md`:**
```markdown
# Volleyball Analytics Platform

AI-powered volleyball match analysis platform with real-time player tracking, action recognition, and automated statistics generation.

## Architecture Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend   │◀──▶│  AI Engine  │
│  (React/TS) │     │  (FastAPI)  │     │  (PyTorch)  │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                    ┌──────┴──────┐
                    ▼           ▼
              ┌──────────┐ ┌──────────┐
              │PostgreSQL│ │   Redis  │
              └──────────┘ └──────────┘
```

## Quick Start

```bash
# 1. Clone & setup
git clone https://github.com/yourorg/volleyball-analytics-platform.git
cd volleyball-analytics-platform

# 2. Start infrastructure
docker-compose up -d

# 2. Backend
cd backend && poetry install && poetry run alembic upgrade head
poetry run uvicorn app.main:app --reload

# 3. Frontend (new terminal)
cd frontend && npm install && npm run dev

# 4. AI Engine (separate terminal)
cd ai-engine && poetry install
poetry run python -m inference.main
```

## Services & Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend | 5173 | http://localhost:5173 |
| Backend API | 8000 | http://localhost:8000 |
| API Docs | 8000 | http://localhost:8000/docs |
| AI Inference | 8001 | http://localhost:8001 |
| AI Docs | 8001 | http://localhost:8001/docs |
| MinIO Console | 9001 | http://localhost:9001 |
| PostgreSQL | 5432 | - |
| Redis | 6379 | - |

## Project Structure

```
volleyball-analytics-platform/
├── backend/           # FastAPI backend
├── frontend/          # React + TypeScript + Vite
├── ai-engine/         # PyTorch AI services
├── database/          # Migrations & seeds
├── infrastructure/    # Terraform, Helm, Kustomize
├── deployment/        # Docker Compose, K8s manifests
├── documentation/     # Architecture, API docs
├── shared/            # Shared types, constants
└── scripts/           # Utility scripts
```

## Development Commands

```bash
# Start all services
make dev

# Run tests
make test

# Build all images
make build

# Lint & typecheck
make lint

# Database migrations
make migrate

# Clean everything
make clean
```

## Documentation

- [Architecture Overview](documentation/architecture.md)
- [API Reference](http://localhost:8000/docs)
- [AI Model Documentation](ai-engine/docs/)
- [Deployment Guide](deployment/README.md)
- [Runbooks](documentation/runbooks/)

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feat/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feat/amazing-feature`)
5. Open Pull Request

## License

Proprietary - All rights reserved.
```

---

### Task 9: Verify All Projects Build Successfully

**Action:** Run build verification for all services.

**Commands:**
```bash
# Backend
cd backend
poetry run pytest -v --tb=short
poetry run mypy .
poetry run ruff check .

# Frontend
cd ../frontend
npm run typecheck
npm run lint
npm run build

# AI Engine
cd ../ai-engine
poetry run pytest -v
poetry run mypy .

# Docker Build Test
docker-compose build
docker-compose up -d
sleep 10
curl -f http://localhost:8000/health
curl -f http://localhost:5173
curl -f http://localhost:8001/health
docker-compose down
```

**Acceptance Criteria:**
- [ ] All unit tests pass (>80% coverage)
- [ ] Type checking passes (mypy strict, tsc --noEmit)
- [ ] Linting passes (ruff, eslint)
- [ ] All Docker images build successfully
- [ ] All services start and respond to health checks
- [ ] Frontend loads at http://localhost:5173
- [ ] Backend API responds at http://localhost:8000/health
- [ ] AI Engine responds at http://localhost:8001/health

---

## Architecture Notes

### Monorepo Benefits
- Single source of truth
- Atomic commits across services
- Shared types via `shared/` package
- Simplified dependency management
- Atomic deployments

### Service Communication

| Communication | Protocol | Use Case |
|--------------|----------|----------|
| Backend ↔ Frontend | REST + WebSocket | Real-time updates |
| Backend ↔ AI Engine | HTTP/gRPC | Inference requests |
| Backend ↔ Database | asyncpg | Async ORM |
| Backend ↔ Redis | Redis Streams | Event streaming |
| AI Engine ↔ MinIO | S3 API | Model/video storage |

### Configuration Management

| Config Type | Method | Location |
|-------------|--------|----------|
| Secrets | Vault/Sealed Secrets | `.env` (dev), Vault (prod) |
| App Config | Pydantic Settings | `.env` files |
| Feature Flags | ConfigMap | Kubernetes ConfigMaps |
| Feature Flags | LaunchDarkly (future) | External service |

---

## AI Developer Prompt

> You are an expert full-stack AI engineer. Initialize the Volleyball Analytics Platform monorepo with the complete development environment.
>
> **Context:** Building a production-grade volleyball analytics platform with real-time computer vision, player tracking, action recognition, and automated statistics generation.
>
> **Requirements:**
> 1. Initialize Git repository with proper structure
> 2. Create monorepo with backend, frontend, ai-engine, mobile, database, infrastructure, deployment, documentation, shared
> 3. Initialize backend (FastAPI + Poetry + SQLAlchemy + Alembic)
> 4. Initialize frontend (React 18 + TypeScript + Vite + Tailwind)
> 3. Initialize AI engine (PyTorch + Ultralytics + ONNX Runtime)
    - Detection (YOLOv8)
    - Tracking (ByteTrack)
    - Pose (RTMPose)
    - OCR (PaddleOCR)
    - Action Recognition (Transformer)
> 4. Configure Docker Compose for local development (PostgreSQL, Redis, MinIO, Kafka, Zookeeper)
> 5. Configure environment variables with `.env.example`
> 4. Create comprehensive README with quick start
> 5. Verify all services build and start successfully
>
> **Constraints:**
> - Python 3.11+, TypeScript 5.4, Node 20 LTS
> - Strict type checking (mypy strict, tsc --noEmit)
> - Code formatting: Black/Ruff, Prettier
> - Linting: Ruff, ESLint (Airbnb + TypeScript)
> - Tests: pytest (backend), Vitest (frontend), pytest (AI)
> - Docker multi-stage builds for all services
> - Health checks for all services
> - Git conventional commits enforced
> - Pre-commit hooks enforced
>
> **Success Criteria:**
> - `make dev` starts all services
> - `make test` passes all tests
> - `make build` builds all Docker images
> - `make lint` passes all checks
> - All health endpoints return 200 OK
> - Frontend loads at localhost:5173
> - Backend API at localhost:8000/docs
> - AI Engine at localhost:8001/health

---

## Expected Folder/File Changes

```
volleyball-analytics-platform/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── cd-staging.yml
│       ├── cd-production.yml
│       └── security-scan.yml
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── websocket/
│   │   └── main.py
│   ├── alembic/
│   ├── tests/
│   ├── pyproject.toml
│   ├── poetry.lock
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── stores/
│   │   ├── api/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── styles/
│   │   └── main.tsx
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── Dockerfile
├── ai-engine/
│   ├── detection/
│   ├── tracking/
│   ├── pose/
│   ├── ocr/
│   ├── action/
│   ├── inference/
│   ├── training/
│   ├── evaluation/
│   ├── models/
│   ├── configs/
│   ├── pyproject.toml
│   ├── poetry.lock
│   └── Dockerfile
├── mobile/
├── database/
│   ├── migrations/
│   ├── seeds/
│   └── scripts/
├── infrastructure/
│   ├── terraform/
│   ├── helm/
│   └── kustomize/
├── deployment/
│   ├── docker-compose.yml
│   ├── docker-compose.override.yml
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   ├── Dockerfile.ai-engine
│   └── nginx.conf
├── documentation/
│   ├── architecture/
│   ├── api/
│   ├── deployment/
│   └── runbooks/
├── shared/
│   ├── types/
│   ├── constants/
│   └── utils/
├── scripts/
├── tests/
├── .github/
│   ├── workflows/
│   └── dependabot.yml
├── docker-compose.yml
├── docker-compose.override.yml
├── Makefile
├── .env.example
├── .gitignore
├── .pre-commit-config.yaml
├── CLAUDE.md
└── README.md
```

---

## Testing & Validation Checklist

- [ ] `git status` shows clean working tree after init
- [ ] `cd backend && poetry run pytest -v` passes
- [ ] `cd backend && poetry run mypy .` passes (strict mode)
- [ ] `cd backend && poetry run ruff check .` passes
- [ ] `cd frontend && npm run typecheck` passes
- [ ] `cd frontend && npm run lint` passes
- [ ] `cd frontend && npm run build` succeeds
- [ ] `cd ai-engine && poetry run pytest -v` passes
- [ ] `cd ai-engine && poetry run mypy .` passes
- [ ] `docker-compose build` succeeds for all services
- [ ] `docker-compose up -d` starts all services
- [ ] `curl -f http://localhost:8000/health` returns 200 OK
- [ ] `curl -f http://localhost:5173` returns HTML
- [ ] `curl -f http://localhost:8001/health` returns 200 OK
- [ ] `docker-compose down` cleans up properly

---

## Definition of Done

- [ ] Repository initialized with complete monorepo structure
- [ ] Backend, Frontend, AI Engine initialized and buildable
- [ ] Docker Compose starts all infrastructure services
- [ ] Environment variable templates created
- [ ] README with quick start guide complete
- [ ] All services build and start successfully
- [ ] Health endpoints responding
- [ ] Git commit created with conventional commit message

---

## Recommended Git Commit

```bash
git add -A
git commit -m "feat(core): initialize volleyball analytics platform monorepo

- Initialize Git repository with monorepo structure
- Create backend (FastAPI + Poetry + SQLAlchemy + Alembic)
- Create frontend (React 18 + TypeScript + Vite + Tailwind)
- Create AI engine (PyTorch + Ultralytics + ONNX Runtime)
- Configure Docker Compose for local development (PG, Redis, MinIO, Kafka)
- Configure environment variable templates
- Create comprehensive README with quick start guide
- Add Dockerfiles for all services
- Add development Makefile with common commands
- Configure pre-commit hooks, linting, type checking
- Add Dockerfiles for all services
- Verify all services build and health checks pass
```

---

**END OF CHAPTER 1**

---

*Next: Chapter 2 — Real-Time Inference Engine*