# VOLUME 2: AI ENGINEERING & COMPUTER VISION IMPLEMENTATION SPECIFICATION (AECVIS)

**Version:** 1.0  
**Date:** July 15, 2026  
**Status:** Active Development

---

# CHAPTER 18: DEVOPS, DEPLOYMENT & PRODUCTION INFRASTRUCTURE

---

## 18.1 Purpose

The DevOps, Deployment & Production Infrastructure defines the processes, tools, and operational practices required to develop, deploy, monitor, and maintain the Volleyball Analytics Platform.

Its objectives are to:

- Automate software delivery
- Ensure reliable deployments
- Support scalable infrastructure
- Enable continuous monitoring
- Maintain high availability
- Simplify system maintenance

---

## 18.2 DevOps Principles

The platform shall follow these DevOps principles:

| Principle | Implementation |
|-----------|----------------|
| **Continuous Integration (CI)** | Every change builds and tests automatically |
| **Continuous Delivery (CD)** | Validated builds deploy to staging automatically |
| **Infrastructure as Code (IaC)** | All infrastructure defined in version-controlled code |
| **Automated Testing** | Unit, integration, contract, E2E tests in CI |
| **Continuous Monitoring** | Metrics, logs, traces, alerts in production |
| **Security by Design** | Security baked into pipeline and runtime |
| **Observability** | Metrics, logs, traces, health checks everywhere |
| **Incremental Releases** | Small, frequent, reversible changes |

---

## 18.3 Environment Strategy

Separate environments mirror production as closely as practical:

| Environment | Purpose | Data | Deploy Trigger |
|-------------|---------|------|----------------|
| **Development** | Daily coding, experiments | Synthetic / subset | Every push to feature branch |
| **Testing (CI)** | Automated validation | Test fixtures | Every PR / push to `develop` |
| **Staging** | Pre-production validation | Anonymized production subset | Every merge to `develop` |
| **Production** | Live platform | Real data | Manual promotion from `main` |

**Environment Parity:** All environments use identical container images, configuration patterns, and deployment manifests (environment-specific values injected via Kustomize/Helm).

---

## 18.4 High-Level Deployment Architecture

```
Developer
    │
    ▼
Source Control (Git)
    │
    ▼
CI Pipeline (GitHub Actions)
    │
    ├── Code Quality (lint, type-check, static analysis)
    ├── Unit Tests
    ├── Integration Tests (testcontainers)
    ├── Security Scan (SAST, dependency, container)
    ▼
Build & Push Container Images (GHCR / ECR)
    │
    ▼
Deploy to Staging (ArgoCD / Flux)
    │
    ├── Smoke Tests
    ├── Contract Tests
    ▼
Manual Approval (GitHub Environment)
    │
    ▼
Deploy to Production (Blue/Green or Rolling)
    │
    ├── Canary (5% → 25% → 100%)
    ├── Health Verification
    ▼
Production (Live)
```

**Only tested builds promote to production. No manual server access.**

---

## 18.5 Source Code Management

### 18.5.1 Repository Structure (Monorepo)

```
volley-analytics-platform/
├── frontend/                 # React + TypeScript + Vite
├── backend/                  # FastAPI / Go services
├── ai-engine/                # Python CV/ML modules
│   ├── detection/
│   ├── tracking/
│   ├── pose/
│   ├── ocr/
│   ├── action/
│   ├── training/
│   └── inference/
├── ml-models/                # Model registry, weights, configs
├── database/                 # Migrations (Alembic), seeds
├── infrastructure/           # Terraform, Helm, Kustomize
│   ├── terraform/
│   ├── helm/
│   └── kustomize/
├── docs/                     # Architecture, API, runbooks
├── scripts/                  # Dev, deploy, utility scripts
└── tests/                    # Cross-cutting E2E, contract
```

### 18.5.2 Branching Strategy (GitHub Flow)

| Branch | Purpose | Protection |
|--------|---------|------------|
| `main` | Production-ready | Required PR reviews, status checks, signed commits |
| `develop` | Integration branch | Auto-deploy to staging |
| `feature/*` | Feature development | Short-lived, rebased |
| `hotfix/*` | Critical production fixes | Fast-track to `main` |
| `release/v*` | Release candidates | Tagged, immutable |

**Merge Policy:** Squash merge, linear history, required: 2 approvals, all CI checks pass, no conflicts.

---

## 18.6 Continuous Integration (CI)

### 18.6.1 Pipeline Stages (GitHub Actions)

```yaml
# .github/workflows/ci.yml
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Python/Node/Go
      - name: Lint (ruff, eslint, golangci-lint)
      - name: Type Check (mypy, tsc, go vet)
      - name: Format Check (black, prettier, gofmt)

  test:
    needs: quality
    runs-on: ubuntu-latest
    services:
      postgres: { image: postgres:16, env: POSTGRES_PASSWORD: test }
      redis: { image: redis:7 }
    steps:
      - uses: actions/checkout@v4
      - name: Unit Tests
        run: pytest --cov=80 --junitxml=report.xml
      - name: Integration Tests
        run: pytest tests/integration -v
      - name: Contract Tests
        run: pact-verifier ...

  security:
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - name: SAST (CodeQL)
      - name: Dependency Scan (pip-audit, npm audit, govulncheck)
      - name: Container Scan (Trivy)
      - name: Secret Detection (TruffleHog)

  build:
    needs: [test, security]
    runs-on: ubuntu-latest
    strategy:
      matrix:
        service: [frontend, auth, player, match, stats, ai-inference]
    steps:
      - name: Build Docker Image
      - name: Multi-arch Build (linux/amd64, arm64)
      - name: Push to Registry (ghcr.io/org/service:${{ github.sha }})
      - name: Sign Image (cosign)
```

---

## 18.7 Continuous Delivery (CD)

### 18.7.1 ArgoCD GitOps Deployment

```yaml
# argocd/applications/production.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: volley-platform-prod
  namespace: argocd
spec:
  project: production
  source:
    repoURL: https://github.com/volleyplatform/infra.git
    targetRevision: main
    path: clusters/prod
  destination:
    server: https://kubernetes.default.svc
    namespace: volley-prod
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
      allowEmpty: false
    syncOptions:
      - CreateNamespace=true
      - PrunePropagationPolicy=foreground
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
```

### 18.7.2 Deployment Strategies

| Service Type | Strategy | Rollback |
|--------------|----------|----------|
| **Stateless APIs** | Rolling (maxSurge: 25%, maxUnavailable: 0) | Immediate (previous ReplicaSet) |
| **AI Inference** | Blue/Green (separate node pools) | Instant (switch service selector) |
| **Frontend** | Atomic deploy (new version at new path, swap CDN) | Instant (CDN cache invalidation) |
| **Database Migrations** | Expand-contract (backward compatible) | Manual rollback script |

**Canary Release (AI Inference):**
```
1. Deploy v2 to 5% traffic (header-based routing)
2. Monitor: latency p99, error rate, GPU mem, drift metrics
3. 10 min → 25% → 50% → 100%
4. Auto-rollback if: error rate > 1% OR latency p99 > 200ms
```

---

## 18.8 Containerization

### 18.8.1 Base Images

| Service Type | Base Image | Size Target |
|--------------|------------|-------------|
| Python AI | `python:3.11-slim` + CUDA base | < 2 GB |
| Go Services | `golang:1.22-alpine` (build) → `distroless/static` | < 20 MB |
| Frontend | `node:20-alpine` (build) → `nginx:alpine` | < 50 MB |
| PostgreSQL | `postgres:16-alpine` | — |
| Redis | `redis:7-alpine` | — |

### 18.8.2 Multi-Stage Build Example (AI Inference)

```dockerfile
# ai-inference/Dockerfile
FROM python:3.11-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

FROM nvidia/cuda:12.2-runtime-ubuntu22.04 AS runtime
WORKDIR /app
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH
COPY . .
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 18.8.3 Image Security

| Control | Tool | Policy |
|---------|------|--------|
| **Vulnerability Scan** | Trivy / Grype | Block HIGH/CRITICAL in CI |
| **Image Signing** | Cosign + Fulcio | Required for production |
| **Base Image Updates** | Dependabot + Renovate | Weekly automated PRs |
| **SBOM Generation** | Syft | Attached to image metadata |

---

## 18.9 Infrastructure as Code (IaC)

### 18.9.1 Terraform Module Structure

```
infrastructure/terraform/
├── modules/
│   ├── vpc/
│   ├── eks/
│   ├── rds-postgres/
│   ├── elasticache-redis/
│   ├── s3/
│   ├── cloudfront/
│   ├── iam/
│   ├── kms/
│   └── monitoring/
├── environments/
│   ├── dev/
│   ├── staging/
│   └── prod/
└── backend.tf      # S3 backend + DynamoDB locking
```

### 18.9.2 Example: EKS Module

```hcl
# modules/eks/main.tf
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 19.0"

  cluster_name    = var.cluster_name
  cluster_version = "1.28"
  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.private_subnets

  eks_managed_node_groups = {
    system = {
      name           = "system"
      instance_types = ["t3.medium"]
      capacity_type  = "ON_DEMAND"
      min_size       = 2
      max_size       = 10
      labels = { workload = "system" }
    }
    general = {
      name           = "general"
      instance_types = ["t3.large", "t3.xlarge"]
      capacity_type  = "ON_DEMAND"
      min_size       = 2
      max_size       = 20
      labels = { workload = "general" }
    }
    gpu_inference = {
      name           = "gpu-inference"
      instance_types = ["g5.xlarge", "g5.2xlarge"]
      capacity_type  = "SPOT"
      min_size       = 0
      max_size       = 10
      labels = { workload = "ai-inference" }
      taints = [{
        key    = "nvidia.com/gpu"
        value  = "present"
        effect = "NO_SCHEDULE"
      }]
    }
  }
}
```

---

## 18.10 Cloud Infrastructure

### 18.10.1 Recommended Stack (AWS Example)

| Layer | Service | Rationale |
|-------|---------|-----------|
| **Compute** | EKS (EKS Auto Mode) | Managed K8s, IRSA, Fargate option |
| **Database** | Aurora PostgreSQL 16 | Multi-AZ, read replicas, IAM auth |
| **Cache** | ElastiCache Redis 7 | Cluster mode, TLS, backup |
| **Object Storage** | S3 + CloudFront | Versioning, lifecycle, SSE-KMS |
| **GPU Compute** | EKS GPU Node Groups (g5, g6) | NVIDIA Device Plugin, DCGM |
| **Ingress** | ALB + NGINX Ingress | WAF, TLS 1.3, rate limiting |
| **DNS** | Route 53 | Health checks, latency routing |
| **Secrets** | AWS Secrets Manager + External Secrets Operator | Rotation, least privilege |

---

## 18.11 GPU Infrastructure

### 18.11.1 GPU Node Pool Design

| Pool | Instance | GPUs | Use Case | Scaling |
|------|----------|------|----------|---------|
| **Inference** | g5.xlarge (1x A10G) | 1 | Real-time match inference | KEDA (queue depth) |
| **Inference Heavy** | g5.2xlarge (1x A10G) | 1 | Batch replay, high-res | Manual / Scheduled |
| **Training** | g5.12xlarge (4x A10G) | 4 | Model retraining | Manual (job-based) |
| **Training Large** | p4d.24xlarge (8x A100) | 8 | Large model training | On-demand |

### 18.11.2 NVIDIA GPU Operator

```yaml
# Helm values for NVIDIA GPU Operator
operator:
  runtimeClass: nvidia
  driver:
    enabled: true
  toolkit:
    enabled: true
  devicePlugin:
    enabled: true
  dcgmExporter:
    enabled: true
  dcgm:
    enabled: true
  migManager:
    enabled: true  # Multi-Instance GPU for sharing
```

### 18.11.3 MPS / MIG Configuration

```yaml
# Enable MPS for inference sharing on single GPU
env:
  - name: CUDA_MPS_ACTIVE_THREAD_PERCENTAGE
    value: "100"
  - name: CUDA_MPS_LOG_DIRECTORY
    value: "/tmp/nvidia-mps"
```

---

## 18.12 Networking

### 18.12.1 Network Topology

```
Internet
    │
    ▼
┌─────────────────────────────────────┐
│         Public Subnets              │
│  ┌──────────────┐  ┌──────────────┐ │
│  │ ALB (Public) │  │ NAT Gateway  │ │
│  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────┘
    │                    │
    ▼                    ▼
┌─────────────────────────────────────┐
│        Private Subnets              │
│  ┌─────────┐ ┌─────────┐ ┌────────┐ │
│  │ EKS     │ │ RDS     │ │ Elasti │ │
│  │ Pods    │ │ Aurora  │ │ Cache  │ │
│  └─────────┘ └─────────┘ └────────┘ │
└─────────────────────────────────────┘
```

### 18.12.2 Security Groups

| SG | Ingress | Egress |
|----|---------|--------|
| **ALB** | 443 (HTTPS), 80 (HTTP → 443) | EKS nodes (80/443) |
| **EKS Nodes** | ALB SG, 443 (kubelet) | 443 (API, registry), 53 (DNS) |
| **RDS** | EKS SG (5432) | None |
| **Redis** | EKS SG (6379) | None |
| **GPU Nodes** | EKS SG | 443 (model registry, S3) |

---

## 18.13 Load Balancing

| Layer | Technology | Purpose |
|-------|------------|---------|
| **L7 (HTTP)** | ALB + NGINX Ingress | Path routing, TLS, WAF, rate limit |
| **L4 (TCP)** | NLB | WebSocket, gRPC, raw TCP |
| **Internal** | Kubernetes Service (ClusterIP) | Service-to-service |
| **Headless** | Headless Service | StatefulSets (Redis, PostgreSQL) |

---

## 18.14 Auto Scaling

### 18.14.1 Horizontal Pod Autoscaler (HPA)

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ai-inference-hpa
  namespace: ai-platform
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ai-inference
  minReplicas: 2
  maxReplicas: 20
  metrics:
  - type: External
    external:
      metric:
        name: kafka_consumergroup_lag
        selector:
          matchLabels:
            consumergroup: ai-inference
      target:
        type: AverageValue
        averageValue: "50"  # 50 messages per pod
  - type: Resource
    resource:
      name: nvidia.com/gpu
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Percent
          value: 10
          periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
        - type: Percent
          value: 100
          periodSeconds: 15
        - type: Pods
          value: 4
          periodSeconds: 15
      selectPolicy: Max
```

### 18.14.2 Cluster Autoscaler

```yaml
# AWS Cluster Autoscaler with GPU awareness
autoScalingGroups:
  - name: gpu-inference
    minSize: 1
    maxSize: 10
    gpu: true
  - name: general
    minSize: 2
    maxSize: 20
```

---

## 18.15 Monitoring & Observability

### 18.15.1 Metrics Stack (Prometheus + Grafana)

| Component | Purpose |
|-----------|---------|
| **Prometheus** | Metrics collection (15d retention local, 13mo Thanos) |
| **Alertmanager** | Deduplication, routing, inhibition |
| **Grafana** | Dashboards, alerting UI |
| **Node Exporter** | Host metrics |
| **Kube State Metrics** | K8s object state |
| **DCGM Exporter** | GPU metrics (temp, mem, util, power) |
| **cAdvisor** | Container resource usage |

### 18.15.2 Key Dashboards

| Dashboard | Key Panels |
|-----------|------------|
| **Cluster Overview** | CPU, Mem, GPU, Pods, Nodes |
| **API Gateway** | RPS, p50/p95/p99 latency, error rate |
| **AI Inference** | Queue depth, latency p50/p95/p99, batch size, GPU util |
| **Video Pipeline** | Ingest FPS, processing latency, queue depth |
| **Database** | Connections, query latency, replication lag |
| **Business** | Active matches, events/sec, stats updates |

### 18.15.3 Critical Alerts

| Alert | Condition | Severity | Runbook |
|-------|-----------|----------|---------|
| `AIInferenceDown` | No frames processed 2m | Critical | Restart pods, check GPU |
| `APIHighLatency` | p99 > 2s for 5m | Warning | Scale API, check DB |
| `GPUMemoryHigh` | > 90% for 10m | Warning | Reduce batch, scale |
| `CameraDisconnected` | No frames 30s | Warning | Check network, restart |
| `DiskSpaceLow` | < 10% free | Critical | Cleanup, expand |
| `PostgreSQLReplicationLag` | > 30s | Warning | Check replica |

---

## 18.16 Logging

### 18.16.1 Structured Logging (JSON)

```json
{
  "timestamp": "2026-07-15T14:32:17.420Z",
  "level": "INFO",
  "service": "ai-inference",
  "trace_id": "abc123",
  "span_id": "def456",
  "message": "Frame processed",
  "fields": {
    "frame_number": 24830,
    "detections": 12,
    "inference_ms": 28.5,
    "track_updates": 11
  }
}
```

### 18.16.2 Log Pipeline

```
Application (stdout) 
    │
    ▼
Promtail (DaemonSet) ──labels──▶ Loki
    │
    ▼
Grafana (LogQL queries, dashboards, alerts)
    │
    ▼
S3 Archive (90d hot, 7y cold via Loki compactor)
```

**Log Labels:** `namespace`, `pod`, `container`, `app`, `match_id`, `rally_number`

---

## 18.17 Distributed Tracing

### 18.17.1 OpenTelemetry Integration

```python
# Auto-instrumentation
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.httpx import HTTPXClientInstrumentor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter

FastAPIInstrumentor.instrument_app(app)
HTTPXClientInstrumentor().instrument()

trace.set_tracer_provider(TracerProvider(resource=Resource.create({
    "service.name": "ai-inference",
    "service.version": "v2.1.0",
    "deployment.environment": "production"
})))
```

### 18.17.2 Key Spans

| Span | Service | Attributes |
|------|---------|------------|
| `HTTP GET /matches/1001` | API Gateway | match_id, user_id |
| `Validate JWT` | Auth Service | user_id, roles |
| `Get Match State` | Competition | match_id, set, rally |
| `AI Inference` | AI Inference | model_version, batch_size, gpu_time_ms |
| `Validate Event` | Domain Engine | action_type, confidence |
| `Update Statistics` | Statistics | player_id, delta |
| `WebSocket Push` | API Gateway | channel, subscriber_count |

**Storage:** Tempo (Grafana) with 30d retention, S3 archive 13mo.

---

## 18.18 Backup Strategy

| Component | Method | Schedule | Retention | Verification |
|-----------|--------|----------|-----------|--------------|
| **PostgreSQL** | pgBackRest (S3) | Continuous WAL + Daily base | 30d daily, 12m monthly | Monthly restore test |
| **Redis** | RDB + AOF → S3 | 6-hourly | 7 days | Weekly restore test |
| **Object Storage** | CRR (Cross-Region Replication) | Continuous | 90d (auto-tier to Glacier) | Quarterly restore |
| **Kubernetes (Etcd)** | Velero (S3) | Daily | 30d | Monthly DR drill |
| **MLflow / Model Registry** | S3 Versioning | Continuous | Permanent | N/A (immutable) |

**RTO/RPO Targets:**

| Tier | RTO | RPO |
|------|-----|-----|
| Match Data (live) | 5 min | < 1 min |
| PostgreSQL | 30 min | 5 min |
| Object Storage | 1 hour | 0 (CRR) |
| Full Cluster | 2 hours | 24 hours |

---

## 18.18 Disaster Recovery

### 18.18.1 DR Architecture (Active-Passive)

```
┌─────────────────────┐         Async Replication         ┌─────────────────────┐
│   PRIMARY REGION    │ ────────────────────────────────► │   DR REGION         │
│  (us-east-1)        │                                     │  (us-west-2)        │
│                     │                                     │                     │
│ ┌─────────────────┐ │                                     │ ┌─────────────────┐ │
│ │ EKS Cluster     │ │                                     │ │ EKS Cluster     │ │
│ │ (Active)        │ │                                     │ │ (Standby, 0)    │ │
│ └─────────────────┘ │                                     │ └─────────────────┘ │
│ ┌─────────────────┐ │                                     │ ┌─────────────────┐ │
│ │ RDS Primary     │ │────────────────────────────────────►│ │ RDS Read Replica│ │
│ └─────────────────┘ │                                     │ └─────────────────┘ │
│ ┌─────────────────┐ │                                     │ ┌─────────────────┐ │
│ │ ElastiCache     │ │────────────────────────────────────►│ │ ElastiCache     │ │
│ │ (Primary)       │ │                                     │ │ (Replica)       │ │
│ └─────────────────┘ │                                     │ └─────────────────┘ │
│ ┌─────────────────┐ │                                     │ ┌─────────────────┐ │
│ │ S3 (Primary)    │ │────────────────────────────────────►│ │ S3 (Replica)    │ │
│ └─────────────────┘ │                                     │ └─────────────────┘ │
└─────────────────────┘                                     └─────────────────────┘
```

### 18.18.2 Failover Procedure

| Step | Action | Automation | Time |
|------|--------|------------|------|
| 1 | Detect primary region failure (health checks) | Route 53 / CloudWatch | < 1 min |
| 2 | Promote RDS read replica to primary | Manual (5 min) | 5 min |
| 2 | Promote ElastiCache replica | Manual (2 min) | 2 min |
| 3 | Update DNS to DR ALB (Route 53 failover) | Automated | < 1 min |
| 4 | Scale up DR EKS node groups | Cluster Autoscaler | 3-5 min |
| 5 | ArgoCD sync to DR cluster | Automated | 2 min |
| 5 | Verify application health | Automated + Manual | 3 min |
| **Total RTO** | | | **< 15 min** |

**RPO:** < 1 min (PostgreSQL), 0 (S3/MinIO CRR)

---

## 18.19 Security Operations

| Practice | Tool | Frequency |
|----------|------|-----------|
| **Vulnerability Scan** | Trivy (CI), Inspector (runtime) | Every build / Daily |
| **Dependency Updates** | Dependabot / Renovate | Daily PRs |
| **Secret Rotation** | Vault / AWS Secrets Manager | 90 days (auto) |
| **Access Reviews** | IAM Access Analyzer, CloudTrail | Quarterly |
| **Penetration Testing** | External vendor | Annual |
| **Incident Response** | Runbooks + PagerDuty | As needed |

---

## 18.20 Release Management

### 18.20.1 Release Process

| Phase | Action | Owner |
|-------|--------|-------|
| **Plan** | Define scope, version (semver), migration plan | PM + Tech Lead |
| **Build** | CI builds, tests, signs images | CI Pipeline |
| **Stage** | Deploy to staging, run smoke/contract tests | Auto |
| **Validate** | QA sign-off, performance baseline | QA + Eng |
| **Release** | Tag `vX.Y.Z`, create GitHub Release | Tech Lead |
| **Deploy** | ArgoCD sync to prod (canary) | Auto + Manual approval |
| **Verify** | Health checks, synthetic transactions | Auto + On-call |
| **Monitor** | 24h enhanced monitoring | On-call |
| **Retrospective** | Post-release review (1 week) | Team |

### 18.20.2 Versioning

| Change | Version Bump |
|--------|--------------|
| Breaking API change | MAJOR (v2.0.0) |
| New feature (backward compat) | MINOR (v1.3.0) |
| Bug fix / patch | PATCH (v1.2.1) |

---

## 18.21 Rollback Strategy

| Scenario | Action | Time |
|----------|--------|------|
| **Failed Deploy** | ArgoCD `argocd app rollback <app> <revision>` | < 2 min |
| **Bad Migration** | `alembic downgrade -1` + rollback deploy | < 10 min |
| **AI Model Regression** | Switch model version in ConfigMap, restart | < 1 min |
| **Config Error** | Revert ConfigMap/Secret, rollout restart | < 30 sec |
| **Full Region Loss** | DR Failover Procedure (18.18) | < 15 min |

---

## 18.22 Performance Optimization

| Area | Technique | Target |
|------|-----------|--------|
| **Database** | Partitioned tables (events by month), BRIN indexes, read replicas | Query p95 < 50ms |
| **API Caching** | Redis (TTL 5s-5m), stale-while-revalidate | 95% cache hit |
| **AI Inference** | TensorRT FP16/INT8, batch=4, MPS | < 40ms/frame |
| **Video Pipeline** | H.264 HW encode (NVENC), segment=2s | < 500ms glass-to-glass |
| **Frontend** | Code splitting, SW caching, CDN | LCP < 2.5s |
| **Database** | Connection pooling (PgBouncer 200 conn), prepared statements | 99th %ile < 100ms |

---

## 18.23 Maintenance Operations

| Activity | Frequency | Window | Automation |
|----------|-----------|--------|------------|
| **OS Patches** | Weekly | Sun 02:00-04:00 UTC | Node pool rolling update |
| **K8s Version Upgrade** | Quarterly | Planned | EKS Managed |
| **PostgreSQL Minor Upgrade** | Quarterly | Planned | Blue/Green RDS |
| **Model Retraining** | Monthly / On drift | Off-peak | Airflow/KFP |
| **Backup Verification** | Monthly | Weekend | Automated restore test |
| **Certificate Rotation** | 90 days | Auto | cert-manager |
| **Dependency Updates** | Weekly PRs | Auto-merge (tests pass) | Dependabot |

---

## 18.24 Compliance & Governance

| Requirement | Implementation |
|-------------|----------------|
| **SOC 2 Type II** | Audit logs, access controls, encryption, monitoring |
| **GDPR** | Data subject API, right to erasure, DPA, DPIA |
| **Data Residency** | Region-locked deployments (EU, US, APAC) |
| **Audit Trail** | Immutable logs (Loki + S3 WORM), 7yr retention |
| **Change Management** | All changes via PR + ArgoCD, no manual `kubectl apply` |
| **Vulnerability Management** | SLAs: Critical 24h, High 7d, Medium 30d |

---

## 18.25 Future Enhancements

| Area | Roadmap |
|--------|---------|
| **Multi-Region Active-Active** | Global load balancing, conflict-free data |
| **Edge AI Inference** | Jetson/IGX at venues, federated model updates |
| **Zero-Downtime Deployments** | Istio traffic shifting, session draining |
| **Serverless Event Processing** | Knative / Lambda for burst workloads |
| **AI Model Orchestration** | Kubeflow Pipelines, automated A/B testing |
| **Self-Healing** | K8s auto-repair, KEDA scaledown, predictive scaling |
| **Cost Optimization** | Kubecost, spot instance automation, rightsizing |

---

## 18.26 Chapter Summary

The DevOps, Deployment & Production Infrastructure chapter defines the complete operational blueprint for the Volleyball Analytics Platform—from source code to production reliability.

**Key Deliverables:**

- **CI/CD Pipeline** — GitHub Actions → ArgoCD GitOps (18.6-18.7)
- **Containerization** — Multi-stage builds, distroless, signed images (18.8)
- **IaC** — Terraform modules, Kustomize overlays, ArgoCD (18.9)
- **Cloud Architecture** — EKS, Aurora, ElastiCache, S3, GPU nodes (18.10-18.11)
- **Networking** — Private subnets, ALB/Nginx, security groups (18.12)
- **Auto-scaling** — HPA (KEDA), Cluster Autoscaler, GPU-aware (18.14)
- **Observability** — Prometheus/Grafana/Loki/Tempo, critical alerts (18.15-18.17)
- **Backup/DR** — pgBackRest, CRR, Velero, RTO<15min (18.18-18.18)
- **Security** — mTLS, RBAC, Vault, scanning, compliance (18.19-18.24)
- **Release/Release** — ArgoCD GitOps, canary, automated rollback (18.20-18.21)

*This operational foundation transforms the platform from a prototype into a resilient, scalable, production-grade service capable of serving clubs, leagues, and federations worldwide.*

---

**END OF CHAPTER 18**

*Next: Chapter 19 — Real-Time Inference Engine*