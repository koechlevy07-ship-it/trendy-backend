# VOLUME 3: IMPLEMENTATION BLUEPRINT

**Version:** 1.0  
**Date:** July 15, 2026  
**Status:** Active Development

---

# CHAPTER 10: DEPLOYMENT & OPERATIONS GUIDE

---

## 10.1 Purpose

This chapter provides the complete operational guide for deploying, monitoring, and maintaining the Volleyball Analytics Platform in production environments.

---

## 10.2 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DEPLOYMENT ARCHITECTURE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐              │
│   │   Client     │────▶│  Load        │────▶│   API        │              │
│   │   (Web/      │     │  Balancer    │     │   Gateway    │              │
│   │   Mobile)    │     │  (ALB/NGINX) │     │   (Kong/     │              │
│   └──────────────┘     └──────────────┘     │    NGINX)    │              │
│                                              └──────┬───────┘              │
│                                                     │                        │
│                          ┌──────────────────────────┼──────────────────┐   │
│                          ▼                          ▼                  ▼   │
│                  ┌─────────────────┐      ┌─────────────────┐  ┌────────┐ │
│                  │   Backend       │      │   AI Engine     │  │ Frontend │ │
│                  │   Services      │      │   (GPU)         │  │  (CDN)   │ │
│                  │   (K8s)         │      │                 │  │          │ │
│                  └─────────────────┘      └─────────────────┘  └────────┘ │
│                          │                          │                  │   │
│                          ▼                          ▼                  ▼   │
│                  ┌────────────────────────────────────────────────────────┐ │
│                  │              DATA LAYER                                 │ │
│                  │  ┌──────────┐  ┌──────────┐  ┌──────────┐             │ │
│                  │  │PostgreSQL│  │  Redis   │  │ MinIO/   │             │ │
│                  │  │  (RDS)   │  │  (Cluster)│  │  S3      │             │ │
│                  │  └──────────┘  └──────────┘  └──────────┘             │ │
│                  └────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 10.3 Environment Strategy

| Environment | Purpose | Infrastructure | Data |
|-------------|---------|----------------|------|
| **Development** | Local development | Docker Compose | Synthetic/Dev DB |
| **Testing (CI)** | Automated testing | GitHub Actions | Test fixtures |
| **Staging** | Pre-production validation | K8s (dev cluster) | Anonymized prod subset |
| **Production** | Live traffic | Multi-AZ K8s (EKS/GKE) | Live data + backups |

---

## 10.4 Infrastructure as Code (Terraform)

### 10.1 Core Infrastructure Modules

```
infrastructure/terraform/
├── modules/
│   ├── vpc/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── eks/
│   │   ├── main.tf
│   │   ├── node-groups.tf
│   │   ├── iam.tf
│   │   └── addons.tf
│   ├── rds/
│   │   ├── main.tf
│   │   ├── replicas.tf
│   │   └── snapshots.tf
│   ├── elasticache/
│   │   ├── main.tf
│   │   └── replication.tf
│   ├── s3/
│   │   ├── main.tf
│   │   ├── lifecycle.tf
│   │   └── replication.tf
│   ├── cloudfront/
│   ├── route53/
│   ├── acm/
│   ├── iam/
│   ├── kms/
│   └── monitoring/
├── environments/
│   ├── dev/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── terraform.tfvars
│   ├── staging/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── terraform.tfvars
│   └── prod/
│       ├── main.tf
│       ├── variables.tf
│       └── terraform.tfvars
└── main.tf
```

### 10.2 Key Terraform Module: EKS Cluster

```hcl
# modules/eks/main.tf
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 19.0"

  cluster_name    = var.cluster_name
  cluster_version = "1.28"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  eks_managed_node_group_defaults = {
    ami_type       = "AL2_x86_64"
    root_volume_size = 50
    root_volume_type = "gp3"
  }

  eks_managed_node_groups = {
    system = {
      name           = "system"
      instance_types = ["t3.medium"]
      capacity_type  = "ON_DEMAND"
      min_size       = 2
      max_size       = 10
      desired_size   = 2

      labels = {
        workload = "system"
      }

      taints = [{
        key    = "workload"
        value  = "system"
        effect = "NO_SCHEDULE"
      }]
    }

    general = {
      name           = "general"
      instance_types = ["t3.large", "t3.xlarge"]
      capacity_type  = "ON_DEMAND"
      min_size       = 2
      max_size       = 20
      desired_size   = 3

      labels = {
        workload = "general"
      }
    }

    gpu_inference = {
      name           = "gpu-inference"
      instance_types = ["g5.xlarge", "g5.2xlarge"]
      capacity_type  = "SPOT"
      min_size       = 0
      max_size       = 10
      desired_size   = 2

      labels = {
        workload = "ai-inference"
        accelerator = "nvidia-gpu"
      }

      taints = [{
        key    = "nvidia.com/gpu"
        value  = "true"
        effect = "NO_SCHEDULE"
      }]
    }

    gpu_training = {
      name           = "gpu-training"
      instance_types = ["g5.12xlarge", "p4d.24xlarge"]
      capacity_type  = "SPOT"
      min_size       = 0
      max_size       = 4
      desired_size   = 0

      labels = {
        workload = "ai-training"
        accelerator = "nvidia-gpu"
      }

      taints = [{
        key    = "nvidia.com/gpu"
        value  = "true"
        effect = "NO_SCHEDULE"
      }]
    }
  }

  cluster_endpoint_public_access  = true
  cluster_endpoint_private_access = true

  cluster_addons = {
    vpc-cni             = { most_recent = true }
    coredns             = { most_recent = true }
    kube-proxy          = { most_recent = true }
    aws-ebs-csi-driver  = { most_recent = true }
  }
}
```

---

## 10.5 Kubernetes Deployment (Helm/Kustomize)

### 10.2 Base Kustomize Structure

```
infrastructure/kubernetes/
├── base/
│   ├── kustomization.yaml
│   ├── namespace.yaml
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   ├── hpa.yaml
│   ├── pdb.yaml
│   ├── configmap.yaml
│   └── secret.yaml
├── overlays/
│   ├── dev/
│   │   ├── kustomization.yaml
│   │   └── patches/
│   ├── staging/
│   │   ├── kustomization.yaml
│   │   └── patches/
│   └── prod/
│       ├── kustomization.yaml
│       ├── patches/
│       └── replicas.yaml
└── overlays/prod/kustomization.yaml
```

### 10.2 Base Deployment Template

```yaml
# base/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: SERVICE_NAME
  labels:
    app: SERVICE_NAME
    version: VERSION
spec:
  replicas: REPLICAS
  selector:
    matchLabels:
      app: SERVICE_NAME
  template:
    metadata:
      labels:
        app: SERVICE_NAME
        version: VERSION
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "8000"
        prometheus.io/path: "/metrics"
    spec:
      serviceAccountName: SERVICE_NAME
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        fsGroup: 1000
      containers:
        - name: SERVICE_NAME
          image: REGISTRY/SERVICE_NAME:VERSION
          imagePullPolicy: Always
          ports:
            - containerPort: 8000
              name: http
            - containerPort: 9090
              name: metrics
          envFrom:
            - configMapRef:
                name: SERVICE_NAME-config
            - secretRef:
                name: SERVICE_NAME-secrets
          env:
            - name: POD_NAME
              valueFrom:
                fieldRef:
                  fieldPath: metadata.name
            - name: POD_IP
              valueFrom:
                fieldRef:
                  fieldPath: status.podIP
          resources:
            requests:
              cpu: "500m"
              memory: "512Mi"
            limits:
              cpu: "2000m"
              memory: "2Gi"
          livenessProbe:
            httpGet:
              path: /health
              port: 8000
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /ready
              port: 8000
            initialDelaySeconds: 10
            periodSeconds: 5
          volumeMounts:
            - name: tmp
              mountPath: /tmp
      volumes:
        - name: tmp
          emptyDir: {}
---
# base/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: SERVICE_NAME
  labels:
    app: SERVICE_NAME
spec:
  type: ClusterIP
  ports:
    - port: 80
      targetPort: 8000
      protocol: TCP
      name: http
    - port: 9090
      targetPort: 9090
      name: metrics
  selector:
    app: SERVICE_NAME
---
# base/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: SERVICE_NAME
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: SERVICE_NAME
  minReplicas: 2
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
    - type: Pods
      pods:
        metric:
          name: http_requests_per_second
        target:
          type: AverageValue
          averageValue: "100"
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
---

## 10.6 CI/CD Pipeline (GitHub Actions + ArgoCD)

### 10.3 CI Pipeline

```yaml
# .github/workflows/ci.yml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  lint-and-typecheck:
    name: Lint & Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
          cache: 'pip'
      
      - name: Install Poetry
        uses: snok/install-poetry@v1
        with:
          version: 1.7.1
      
      - name: Install dependencies
        run: |
          cd backend && poetry install --with dev,test
          cd ../frontend && npm ci
          cd ../ai-engine && poetry install
      
      - name: Lint (Ruff)
        run: |
          cd backend && poetry run ruff check .
          cd ../ai-engine && poetry run ruff check .
      
      - name: Type Check (MyPy)
        run: |
          cd backend && poetry run mypy .
          cd ../ai-engine && poetry run mypy .
          cd ../frontend && npm run typecheck
      
      - name: Frontend Lint
        run: |
          cd frontend && npm run lint

  test-backend:
    name: Backend Tests
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: volley_test
          POSTGRES_USER: volley
          POSTGRES_PASSWORD: volley
        ports: [5432:5432]
        options: --health-cmd pg_isready --health-interval 10s --health-timeout 5s --health-retries 5
      redis:
        image: redis:7-alpine
        ports: [6379:6379]
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.11', cache: 'pip' }
      - uses: snok/install-poetry@v1
      - name: Install dependencies
        run: |
          cd backend && poetry install --with dev,test
      - name: Run migrations
        run: cd backend && poetry run alembic upgrade head
      - name: Run tests
        run: |
          cd backend
          poetry run pytest -v --cov=app --cov-report=xml --cov-report=term-missing
      - uses: codecov/codecov-action@v3
        with:
          files: ./backend/coverage.xml
          flags: backend

  test-frontend:
    name: Frontend Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: cd frontend && npm ci
      - run: cd frontend && npm run test -- --coverage
      - name: E2E Tests
        run: cd frontend && npm run test:e2e

  test-ai:
    name: AI Engine Tests
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: volley_test
          POSTGRES_USER: volley
          POSTGRES_PASSWORD: volley
        ports: [5432:5432]
      redis:
        image: redis:7-alpine
        ports: [6379:6379]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.11', cache: 'pip' }
      - uses: snok/install-poetry@v1
      - run: |
          cd ai-engine
          poetry install --with dev,test
          poetry run pytest -v --cov=inference --cov-report=xml
      - uses: codecov/codecov-action@v3
        with:
          files: ./ai-engine/coverage.xml
          flags: ai-engine

  docker-build:
    needs: [lint-and-typecheck, test-backend, test-frontend, test-ai]
    if: github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      - name: Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GHCR_TOKEN }}
      - name: Build and Push Backend
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          push: true
          tags: ghcr.io/${{ github.repository }}/backend:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
      - name: Build and Push Frontend
        uses: docker/build-push-action@v5
        with:
          context: ./frontend
          push: true
          tags: ghcr.io/${{ github.repository }}/frontend:${{ github.sha }}
      - name: Build and Push AI Engine
        uses: docker/build-push-action@v5
        with:
          context: ./ai-engine
          push: true
          tags: ghcr.io/${{ github.repository }}/ai-engine:${{ github.sha }}
  
  deploy-staging:
    needs: docker-build
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - name: Deploy to Staging
        run: |
          kubectl config use-context staging
          kubectl apply -k infrastructure/kubernetes/overlays/staging
          kubectl rollout status deployment/backend -n volleyball-staging
          kubectl rollout status deployment/frontend -n volleyball-staging
          kubectl rollout status deployment/ai-engine -n volleyball-staging

  deploy-production:
    needs: docker-build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy to Production
        run: |
          kubectl config use-context production
          kubectl apply -k infrastructure/kubernetes/overlays/prod
          kubectl rollout status deployment/backend -n volleyball-prod --timeout=5m
          kubectl rollout status deployment/frontend -n volleyball-prod --timeout=5m
          kubectl rollout status deployment/ai-engine -n volleyball-prod --timeout=5m
        env:
          KUBECONFIG: ${{ secrets.KUBECONFIG_PROD }}
```

---

## 10.7 Monitoring & Observability Stack

### 10.3 Prometheus Configuration

```yaml
# monitoring/prometheus/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    cluster: '${CLUSTER_NAME}'
    environment: '${ENVIRONMENT}'

alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager:9093']

rule_files:
  - '/etc/prometheus/rules/*.yml'

scrape_configs:
  - job_name: 'kubernetes-apiservers'
    kubernetes_sd_configs:
      - role: endpoints
    scheme: https
    tls_config:
      ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
    bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
    relabel_configs:
      - source_labels: [__meta_kubernetes_namespace, __meta_kubernetes_service_name, __meta_kubernetes_endpoint_port_name]
        action: keep
        regex: default;kubernetes;https

  - job_name: 'kubernetes-nodes'
    kubernetes_sd_configs:
      - role: node
    scheme: https
    tls_config:
      ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
    bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
    relabel_configs:
      - action: labelmap: - action: labelmap
        regex: __meta_kubernetes_node_label_(.+)

  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)
      - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
        action: replace
        regex: ([^:]+)(?::\d+)?;(\d+)
        replacement: $1:$2
        target_label: __address__
      - action: labelmap
        regex: __meta_kubernetes_pod_label_(.+)
      - source_labels: [__meta_kubernetes_namespace]
        action: replace
        target_label: kubernetes_namespace
      - source_labels: [__meta_kubernetes_pod_name]
        action: replace
        target_label: kubernetes_pod_name

  - job_name: 'volleyball-backend'
    kubernetes_sd_configs:
      - role: pod
        namespaces:
          names: ['volleyball-prod']
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)
      - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
        action: replace
        regex: ([^:]+)(?::\d+)?;(\d+)
        replacement: $1:$2
        target_label: __address__
      - action: labelmap
        regex: __meta_kubernetes_pod_label_(.+)
      - source_labels: [__meta_kubernetes_namespace]
        action: replace
        target_label: kubernetes_namespace
      - source_labels: [__meta_kubernetes_pod_name]
        action: replace
        target_label: kubernetes_pod_name

  - job_name: 'ai-inference'
    kubernetes_sd_configs:
      - role: pod
        namespaces:
          names: ['ai-platform']
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_label_app]
        action: keep
        regex: ai-inference
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
```

### 10.4 Grafana Dashboards

```json
{
  "dashboard": {
    "title": "Volleyball Analytics Platform",
    "tags": ["volleyball", "production"],
    "timezone": "utc",
    "panels": [
      {
        "title": "API Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{handler}}"
          }
        ],
        "gridPos": {"x": 0, "y": 0, "w": 12, "h": 8}
      },
      {
        "title": "API Latency (p50, p95, p99)",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.50, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "p50"
          },
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "p95"
          },
          {
            "expr": "histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "p99"
          }
        ],
        "gridPos": {"x": 12, "y": 0, "w": 12, "h": 8}
      },
      {
        "title": "AI Inference Latency",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(ai_inference_duration_seconds_bucket[5m]))",
            "legendFormat": "p95"
          },
          {
            "expr": "rate(ai_inference_total[5m])",
            "legendFormat": "throughput"
          }
        ],
        "gridPos": {"x": 0, "y": 8, "w": 12, "h": 8}
      },
      {
        "title": "GPU Utilization",
        "type": "graph",
        "targets": [
          {
            "expr": "nvidia_gpu_memory_used_bytes / nvidia_gpu_memory_total_bytes * 100",
            "legendFormat": "GPU {{gpu}} memory %"
          },
          {
            "expr": "nvidia_gpu_utilization",
            "legendFormat": "GPU {{gpu}} compute %"
          }
        ],
        "gridPos": {"x": 12, "y": 8, "w": 12, "h": 8}
      },
      {
        "title": "Live Matches",
        "type": "stat",
        "targets": [{
          "expr": "count(volleyball_matches_status{status=\"live\"})",
          "legendFormat": "Live Matches"
        }],
        "gridPos": {"x": 0, "y": 16, "w": 6, "h": 4}
      },
      {
        "title": "Active Users",
        "type": "stat",
        "targets": [{
          "expr": "count(volleyball_active_users)",
          "legendFormat": "Active Users"
        }],
        "gridPos": {"x": 6, "y": 16, "w": 6, "h": 4}
      }
    ],
    "templating": {
      "list": [
        {
          "name": "cluster",
          "type": "query",
          "query": "label_values(kubernetes_build_info, cluster)",
          "refresh": 1
        }
      ]
    }
  }
}
```

### 10.3 Alerting Rules

```yaml
# monitoring/prometheus/rules/alerts.yml
groups:
  - name: volleyball-platform
    interval: 30s
    rules:
      - alert: APIHighLatency
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High API latency"
          description: "p99 latency > 1s for 5m"

      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "High error rate"
          description: "Error rate > 5% for 2m"

      - alert: AIInferenceDown
        expr: up{job="ai-inference"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "AI Inference service down"
          description: "AI inference service has been down for 1 minute"

      - alert: GPUOutOfMemory
        expr: nvidia_gpu_memory_used_bytes / nvidia_gpu_memory_total_bytes > 0.95
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "GPU memory critical"
          description: "GPU {{ $labels.gpu }} memory > 95%"

      - alert: DatabaseConnectionsHigh
        expr: pg_stat_database_numbackends / pg_settings_max_connections > 0.8
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Database connections high"
          description: "PostgreSQL connections > 80%"

      - alert: DiskSpaceLow
        expr: (node_filesystem_avail_bytes / node_filesystem_size_bytes) < 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Disk space critical"
          description: "Disk {{ $labels.device }} on {{ $labels.instance }} < 10% free"

      - alert: HighQueueDepth
        expr: kafka_consumergroup_lag > 10000
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Kafka consumer lag high"
          description: "Consumer group {{ $labels.consumergroup }} lag > 10k"
```

---

## 10.8 Logging Architecture

```yaml
# infrastructure/logging/fluentd/fluent.conf
<source>
  @type tail
  path /var/log/containers/*.log
  pos_file /var/log/fluentd-containers.log.pos
  tag kubernetes.*
  <parse>
    @type json
    time_format %Y-%m-%dT%H:%M:%S.%NZ
  </parse>
  <filter>
    @type kubernetes_metadata
  </filter>
</source>

<filter kubernetes.**>
  @type kubernetes_metadata
</filter>

<filter kubernetes.**>
  @type parser
  key_name log
  reserve_data true
  remove_key_name_field true
  <parse>
    @type json
  </parse>
</filter>

<match kubernetes.**>
  @type loki
  url http://loki:3100/loki/api/v1/push
  extra_labels {"cluster": "prod", "environment": "production"}
  label_keys "namespace,pod,container"
  extra_labels {"cluster": "prod", "app": "volleyball-analytics"}
  <buffer>
    @type file
    path /var/log/fluentd-buffer/loki
    flush_mode interval
    flush_interval 5s
    chunk_limit_size 8m
    queue_limit_length 1024
  </buffer>
</match>
```

---

## 10.11 Backup & Disaster Recovery

### 10.11.1 Backup Strategy

| Component | Method | Frequency | Retention | RPO | RTO |
|-----------|--------|-----------|-----------|-----|-----|
| PostgreSQL | pgBackRest | Continuous WAL + Daily base | 30d daily, 12m monthly | < 1 min | < 30 min |
| Redis | RDB + AOF | Every 6h | 7d | 1 hour | 15 min |
| Object Storage | Cross-region replication | Continuous | 90 days | 0 | < 1 hour |
| Kubernetes Etcd | Velero | Daily | 30d | 1 hour | 30 min |
| ML Models | S3 Versioning | On publish | Permanent | 0 | < 1 hour |

### 10.11.2 Disaster Recovery Runbook

```bash
#!/bin/bash
# disaster-recovery.sh

# 1. Verify backup integrity
velero backup describe backup-latest --details

# 2. Restore PostgreSQL
velero restore create --from-backup backup-latest \
  --include-resources='postgresql.*' \
  --wait

# 3. Verify database
kubectl exec -it postgresql-0 -- pg_isready
kubectl exec -it postgresql-0 -- psql -c "SELECT count(*) FROM matches;"

# 3. Restore Redis
velero restore create --from-backup backup-latest \
  --include-resources='redis.*'

# 4. Restore object storage
aws s3 sync s3://backup-bucket/volley-prod/ s3://volley-prod/ --delete

# 5. Verify application
kubectl rollout status deployment/backend -n volleyball-prod
curl -f https://api.volleyball.ai/health

# 6. Verify AI engine
curl -f http://ai-engine:8001/health
```

---

## 10.11 Security Hardening

### 10.11.1 Network Policies

```yaml
# kubernetes/base/network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend-network-policy
  namespace: volleyball-prod
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              name: volleyball-prod
        - namespaceSelector:
            matchLabels:
              name: ingress-nginx
      ports:
        - protocol: TCP
          port: 8000
    - from:
        - namespaceSelector:
            matchLabels:
              name: monitoring
        ports:
          - protocol: TCP
            port: 9090
  egress:
    - to:
        - namespaceSelector:
            matchLabels:
              name: volleyball-prod
        - podSelector:
            matchLabels:
              app: postgresql
      ports:
        - protocol: TCP
          port: 5432
    - to:
        - namespaceSelector:
            matchLabels:
              name: kube-system
        ports:
          - protocol: TCP
            port: 53
          - protocol: UDP
            port: 53
    - to: []
      ports:
        - protocol: TCP
          port: 443  # HTTPS for external APIs
        - protocol: TCP
          port: 53   # DNS
        - protocol: UDP
          port: 53   # DNS
```

### 10.11.2 Pod Security Standards

```yaml
# kubernetes/base/pod-security.yaml
apiVersion: policy/v1
kind: PodSecurityPolicy
metadata:
  name: restricted
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
    - ALL
  volumes:
    - 'configMap'
    - 'emptyDir'
    - 'projected'
    - 'secret'
    - 'downwardAPI'
    - 'persistentVolumeClaim'
  hostNetwork: false
  hostIPC: false
  hostPID: false
  runAsUser:
    rule: 'MustRunAsNonRoot'
  seLinux:
    rule: 'RunAsAny'
  allowedCapabilities: []
```

---

## 10.12 Cost Optimization

| Strategy | Implementation | Estimated Savings |
|----------|----------------|-------------------|
| **Spot Instances** | Training workloads | 70% |
| **Right-sizing** | VPA + HPA | 30% |
| **S3 Lifecycle** | IA/Glacier after 30d | 60% storage |
| **RDS Proxy** | Connection pooling | 50% connections |
| **Spot Fleet** | Training nodes | 90% |
| **S3 Intelligent Tiering** | Auto-tiering | 40% |
| **Graviton/ARM** | ARM-based nodes | 20% compute |

---

## 10.12 Runbooks

### 10.12.1 Common Operations

```bash
# Scale AI inference
kubectl scale deployment ai-inference --replicas=10 -n volleyball-prod

# Rollback deployment
kubectl rollout undo deployment/backend -n volleyball-prod

# Check pod logs
kubectl logs -n volleyball-prod -l app=backend --tail=100 -f

# Scale AI workers
kubectl scale deployment ai-inference --replicas=10 -n volleyball-prod

# View live match events
kubectl exec -it ai-engine-pod -n volleyball-prod -- python -m inference.monitor

# Check GPU utilization
kubectl top pods -n volleyball-prod --containers
```

---

## 10.13 Compliance & Audit

| Requirement | Implementation |
|------------|----------------|
| **GDPR** | Data subject APIs, 30-day retention, DPA |
| **SOC 2** | Annual audit, encrypted data, access logs |
| **ISO 27001** | Risk assessment, policies, training |
| **Data Retention** | Match data: 7 years, Videos: 2 years, Logs: 90 days |

---

## 10.13 Chapter Summary

This chapter provides the complete operational blueprint for deploying and operating the Volleyball Analytics Platform.

| Area | Status |
|------|--------|
| **Infrastructure (Terraform)** | ✅ Defined |
| **Kubernetes (Kustomize)** | ✅ Base + Overlays |
| **CI/CD (GitHub Actions + ArgoCD)** | ✅ Pipeline defined |
| **Monitoring (Prometheus/Grafana/Loki/Tempo)** | ✅ Configured |
| **Logging (Loki/Fluentd)** | ✅ Configured |
| **Tracing (Tempo)** | ✅ Configured |
| **Backup/DR** | ✅ Documented |
| **Security (NetworkPolicy, PSP)** | ✅ Defined |
| **Cost Optimization** | ✅ Strategies defined |
| **Runbooks** | ✅ Documented |

---

**END OF CHAPTER 10**

*Volume 3 - Chapter 10 Complete*

*Next: Chapter 11 - MLOps & Continuous Learning*