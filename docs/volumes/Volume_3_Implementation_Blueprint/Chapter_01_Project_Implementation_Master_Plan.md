# VOLUME 3: SOFTWARE DEVELOPMENT BLUEPRINT & IMPLEMENTATION GUIDE (SDBIG)

**Version:** 1.0  
**Date:** July 15, 2026  
**Status:** Active Development

---

# CHAPTER 1: PROJECT IMPLEMENTATION MASTER PLAN

---

## 1.1 Purpose

This chapter establishes the master implementation plan for the AI-powered Volleyball Analytics Platform. It defines the development methodology, technology stack, milestones, build strategy, and development roadmap that all subsequent chapters follow.

This chapter serves as the **master execution plan** — every subsequent chapter in Volume 3 maps to a specific milestone or deliverable defined here.

---

## 1.2 Platform Vision Recap

The Volleyball Analytics Platform is an AI-powered system that:

- **Observes** volleyball matches via camera feeds (webcam, IP camera, broadcast)
- **Detects** players, ball, court, net, and referees in real-time
- **Tracks** player and ball movement with persistent identities
- **Recognizes** volleyball actions (serve, spike, block, dig, set, reception, etc.)
- **Generates** live statistics, heat maps, tactical analytics
- **Delivers** insights via Coach, Analyst, Player, and Admin dashboards
- **Produces** automated match reports and performance predictions

---

## 1.3 Development Methodology

### 1.1.1 Sequential Dependency-Driven Development

The implementation follows strict dependency order:

```
Phase 1: Foundation (Chapters 1-4)          → Environment, Standards, Repo
Phase 2: Backend Core (Chapters 5-10)       → API, DB, Auth, Real-time
Phase 3: Frontend (Chapters 11-16)          → Dashboards, UI System
Phase 4: AI Pipeline (Chapters 17-28)       → CV Pipeline → Analytics
Phase 5: Production Platform (Chapters 29-35) → Video, Multi-cam, Cloud, CI/CD
Phase 6: Testing (Chapters 36-40)           → Unit, Integration, AI Eval, Perf, UAT
Phase 7: Deployment & Evolution (Chapters 41-44) → Deploy, Maintain, Scale
```

**Rule:** Do not start Chapter N+1 until Chapter N is complete, tested, and documented.

---

## 1.4 Technology Stack (Locked)

| Layer | Technology | Version | Locked |
|-------|------------|---------|--------|
| **Frontend** | React + TypeScript + Vite | 18 / 5.4 / 5.x | ✅ |
| **Styling** | Tailwind CSS | 3.4 | ✅ |
| **State** | Zustand + TanStack Query | 4.5 / 5.x | ✅ |
| **Charts** | Recharts / ECharts | Latest | ✅ |
| **Backend** | FastAPI (Python) | 3.11 / 0.110 | ✅ |
| **ORM** | SQLAlchemy 2.0 + Alembic | 2.0 / 1.12 | ✅ |
| **Database** | PostgreSQL | 16 | ✅ |
| **Cache/Queue** | Redis 7 | 7.2 | ✅ |
| **Auth** | JWT (RS256) + RBAC | — | ✅ |
| **AI Framework** | PyTorch 2.3 / Ultralytics 8.2 | — | ✅ |
| **CV** | OpenCV 4.9 / MediaPipe / RTMPose | — | ✅ |
| **Tracking** | ByteTrack / BoT-SORT | — | ✅ |
| **OCR** | PaddleOCR / EasyOCR | — | ✅ |
| **Tracking** | ByteTrack / BoT-SORT | — | ✅ |
| **MLOps** | MLflow + DVC | 2.11 / Latest | ✅ |
| **Container** | Docker / Kubernetes | Latest | ✅ |
| **CI/CD** | GitHub Actions + ArgoCD | — | ✅ |
| **Monitoring** | Prometheus / Grafana / Loki / Tempo | Latest | ✅ |
| **Orchestration** | Kubernetes (EKS/GKE) | 1.28+ | ✅ |

**All versions are locked.** No version changes without architecture review.

---

## 1.5 Development Milestones

| Milestone | Target | Deliverable | Gate Criteria |
|-----------|--------|-------------|---------------|
| **M1: Foundation** | Week 1-2 | Repo, CI/CD, Dev env, Standards | All devs productive |
| **M2: Backend Core** | Week 3-6 | Auth, DB, Auth, Matches, Teams, Players APIs | API contract tests pass |
| **M3: Real-time** | Week 7-8 | WebSocket, Live stats, Live score | WebSocket load test pass |
| **M3: Background Jobs** | Week 8-9 | Celery, Celery Beat, AI task queue | Job processing < 5s |
| **M4: Frontend Core** | Week 10-12 | React, Design System, Auth, Routing | Storybook published |
| **M5: Dashboards** | Week 13-16 | Coach/Analyst/Player/Admin dashboards | Coach sign-off |
| **M6: AI Pipeline** | Week 17-24 | Detection, Tracking, Pose, OCR, Action, Stats | mAP ≥ 0.85, F1 ≥ 0.85 |
| **M7: Analytics** | Week 25-27 | Ratings, Insights, Recommendations, Heatmaps | Coach validation |
| **M8: Video/Streaming** | Week 28-30 | Multi-cam, RTSP, WebRTC, Recording | 2-cam sync < 50ms |
| **M9: Cloud/Prod** | Week 31-33 | K8s, GPU, Monitoring, DR | Load test 50 matches |
| **M10: Testing** | Week 34-36 | Unit, Integration, AI Eval, Perf, UAT | All gates pass |
| **M11: Deploy** | Week 37 | Production release | v1.0 Release |

**Total Estimated Timeline: ~24 weeks (6 months)**

---

## 1.6 Build Strategy

| Strategy | Implementation |
|----------|----------------|
| **Monorepo** | Single repo: `frontend/`, `backend/`, `ai-engine/`, `ml-models/`, `infrastructure/` |
| **Trunk-based Development** | Short-lived feature branches, PR → `develop` → `main` |
| **CI/CD** | GitHub Actions → Build → Test → Scan → Docker → ArgoCD → Staging → Prod |
| **Container First** | Every service = Docker image, multi-arch (amd64/arm64) |
| **GitOps** | ArgoCD watches `infra/clusters/{env}` for GitOps sync |
| **Feature Flags** | LaunchDarkly-style flags for gradual rollout |
| **Semantic Versioning** | MAJOR.MINOR.PATCH, tags on `main` |

---

## 1.6 Development Roadmap (Phased)

| Phase | Weeks | Focus | Key Chapters |
|-------|-------|-------|--------------|
| **Phase 0: Foundation** | 1-2 | Repo, CI/CD, Dev env, Standards | Ch 1-4 |
| **Phase 1: Backend Core** | 3-6 | Auth, DB, REST API, Match mgmt | Ch 5-8 |
| **Phase 2: Real-time & Async** | 7-9 | WebSocket, Celery, AI task queue | Ch 9-10 |
| **Phase 2: Frontend** | 10-12 | React, Design System, Auth | Ch 11-13 |
| **Phase 3: Dashboards** | 13-16 | Coach/Analyst/Player/Admin | Ch 14-16 |
| **Phase 3: AI Pipeline** | 17-24 | CV Pipeline (17-28) | Ch 17-28 |
| **Phase 4: Analytics** | 25-27 | Ratings, Insights, Heatmaps | Ch 27-28 |
| **Phase 4: Production Platform** | 28-33 | Video, Multi-cam, Cloud, CI/CD, Monitor | Ch 29-35 |
| **Phase 5: Testing** | 34-36 | Unit, Integration, AI Eval, Perf, UAT | Ch 36-40 |
| **Phase 6: Deploy & Evolve** | 37-44 | Deploy, Maintain, Scale, Roadmap | Ch 41-44 |

---

## 1.7 Build Strategy

| Strategy | Detail |
|----------|--------|
| **Container-First** | Every service = Docker image (multi-arch: amd64/arm64) |
| **Multi-stage Builds** | Builder → Runtime (distroless where possible) |
| **Base Images** | `python:3.11-slim`, `node:20-alpine`, `nginx:alpine`, `distroless` |
| **GPU Images** | `nvidia/cuda:12.2-runtime-ubuntu22.04` + NVIDIA Container Toolkit |
| **Image Scanning** | Trivy in CI (block HIGH/CRITICAL), Cosign signing |
| **SBOM** | Syft generates SPDX on every build |
| **Registry** | GHCR / ECR / Harbor (configurable) |

---

## 1.8 Development Roadmap (Detailed)

| Week | Milestone | Primary Focus | Exit Criteria |
|------|-----------|---------------|---------------|
| 1 | **M1: Foundation** | Repo, CI/CD, dev env, standards | All devs `make dev` works |
| 2 | | Docs, standards, repo structure | All linters pass, tests run |
| 3 | **M2: Backend Core** | FastAPI, SQLAlchemy, Alembic, Auth | Auth flows work, DB migrated |
| 4 | | Match, Team, Player CRUD | CRUD tests pass |
| 5 | | Match management (start/pause/end) | Live match simulation works |
| 6 | | Set/Lineup/Rotation/Sub APIs | Full match flow works |
| 7 | **M3: Real-time** | WebSocket server, channels | Live scoreboard updates < 200ms |
| 8 | | Live stats, events push | Coach dashboard live |
| 9 | **M4: Background** | Celery + Redis, AI task queue | AI jobs process < 5s |
| 10 | **M4: Frontend Core** | React + Vite + TS + Tailwind | Storybook deployed |
| 11 | | Design System, Auth pages, Routing | Login → Dashboard works |
| 12 | | Routing, TanStack Query, Zustand | All routes accessible |
| 13 | **M5: Dashboards** | Coach Dashboard (live + post) | Coach sign-off |
| 14 | | Analyst, Player, Admin dashboards | All roles functional |
| 15 | | Match timeline, heatmaps, charts | Charts render < 200ms |
| 16 | | Reports, exports (PDF/CSV) | Reports generate < 10s |
| 17 | **M6: AI Pipeline** | Court detection + calibration | Homography < 3px error |
| 18 | | Player detection (YOLOv8) | mAP@0.5 ≥ 0.95 |
| 19 | | Ball detection + tracking | Track continuity > 90% |
| 20 | | Player tracking (ByteTrack) | ID switches < 2/1000 frames |
| 21 | | Jersey OCR (PaddleOCR) | Accuracy ≥ 95% clear frames |
| 22 | | Pose estimation (RTMPose) | PCK@0.2 ≥ 0.90 |
| 23 | | Action recognition (LSTM/Transformer) | F1 ≥ 0.85 |
| 24 | | Statistics engine + validation | Stats match human 95%+ |
| 25 | **M7: Analytics** | Player/Team ratings | Coach validates ratings |
| 26 | | Insights, recommendations | > 80% acceptance |
| 27 | | Heatmaps, zone analytics | Interactive < 200ms |
| 28 | **M8: Video/Streaming** | Webcam, RTSP, IP, USB, Broadcast | All sources ingest |
| 29 | | Multi-cam sync (2-4 cams) | Frame sync < 33ms |
| 30 | | Recording, replay, clips | Clip gen < 10s |
| 30 | **M9: Cloud/Prod** | K8s (EKS/GKE), GPU nodes, ArgoCD | Staging = Prod parity |
| 31 | | Monitoring (Prom/Grafana/Loki/Tempo) | Alerts fire < 1min |
| 32 | | DR, backup, scaling, cost | DR drill passes |
| 33 | | Load test (50 concurrent matches) | p99 < 500ms |
| 34 | **M10: Testing** | Unit, integration, contract | Coverage ≥ 80% |
| 35 | | AI model eval (mAP, F1, latency) | All gates pass |
| 36 | | Perf, load, UAT | Coach/Analyst sign-off |
| 37 | **M11: Deploy** | Production release v1.0 | Go-live |
| 38-44 | **M11: Evolve** | Maintenance, scaling, v2.0 roadmap | Ongoing |

---

## 1.9 Team Responsibilities

| Role | Primary Chapters | Key Deliverables |
|------|------------------|------------------|
| **Backend Engineers** | Ch 5-10, 29-30 | APIs, DB, Auth, WebSocket, Celery |
| **AI/ML Engineers** | Ch 17-28 | Detection, Tracking, Pose, OCR, Action, Stats |
| **Frontend Engineers** | Ch 11-16, 24-25 | React, Dashboards, Charts, Real-time |
| **DevOps Engineers** | Ch 29-35, 33-35 | K8s, Docker, CI/CD, GPU, Monitoring |
| **ML Engineers** | Ch 16-18, 21-22, 27-28 | Training, Eval, Optimization, MLOps |
| **QA Engineers** | Ch 36-40 | Unit, Integration, AI Eval, Perf, UAT |
| **UI/UX Designer** | Ch 12, 13, 16 | Design system, Dashboards, Accessibility |
| **DB Engineer** | Ch 6, 16, 18 | Schema, Migrations, Performance |
| **Product Manager** | All | Prioritization, Acceptance, Roadmap |

---

## 1.10 Risk Management

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **AI Model Accuracy** | High | High | Diverse datasets, continuous eval, human-in-loop |
| **GPU Availability** | Medium | High | Spot instances, CPU fallback, model optimization |
| **Real-time Latency** | Medium | High | Profiling, batching, TensorRT, edge inference |
| **Multi-cam Sync** | High | High | Genlock/PTP, timestamp sync, frame buffering |
| **Data Quality** | Medium | High | Annotation QA, automated QA gates |
| **Model Drift** | Medium | High | Drift detection (Evidently), auto-retrain triggers |
| **Scope Creep** | High | Medium | Strict phase gates, change control board |
| **Team Scaling** | Medium | Medium | Clear ownership, documentation, onboarding |

---

## 1.11 Success Criteria (v1.0 Release)

| Criterion | Target |
|-----------|--------|
| **Detection mAP@0.5** | ≥ 0.95 (players), ≥ 0.85 (ball) |
| **Tracking MOTA** | ≥ 0.90 |
| **Action Recognition F1** | ≥ 0.85 |
| **OCR Accuracy** | ≥ 95% (clear frames) |
| **Pose PCK@0.2** | ≥ 0.90 |
| **Action → Stats Accuracy** | ≥ 95% vs manual |
| **Live Latency (event → dashboard)** | < 500ms |
| **API p95 Latency** | < 200ms |
| **WebSocket Latency** | < 100ms |
| **Availability** | 99.9% |
| **AI Inference p95** | < 50ms/frame (GPU) |
| **Test Coverage** | ≥ 80% (unit), 70% (integration) |
| **Coach UAT Sign-off** | Required |

---

## 1.12 Chapter Dependencies Map

```
Ch 1 (Master Plan)
    │
    ├─→ Ch 2 (Repo) → Ch 3 (Env) → Ch 4 (Standards)
    │
    ├─→ Ch 5 (Backend Init) → Ch 6 (DB) → Ch 7 (Auth) → Ch 8 (REST) → Ch 9 (WS) → Ch 10 (Celery)
    │
    ├─→ Ch 11 (React Setup) → Ch 12 (Design System) → Ch 13 (Auth Pages)
    │
    ├─→ Ch 14 (Coach Dash) → Ch 15 (Match UI) → Ch 16 (Stats Viz)
    │
    ├─→ Ch 17 (CV Env) → Ch 18 (Court) → Ch 19 (Player) → Ch 20 (Ball)
    │                              → Ch 21 (Tracking) → Ch 22 (Ball Track)
    │                              → Ch 23 (OCR) → Ch 24 (Pose) → Ch 25 (Action)
    │                              → Ch 26 (Stats Engine) → Ch 27 (Analytics) → Ch 28 (Heatmaps)
    │
    ├─→ Ch 29 (Video) → Ch 30 (Multi-cam) → Ch 31 (Cloud) → Ch 32 (Docker) → Ch 33 (CI/CD)
    │
    ├─→ Ch 34 (Monitoring) → Ch 35 (Scaling)
    │
    ├─→ Ch 36 (Unit) → Ch 37 (Integration) → Ch 38 (AI Eval) → Ch 39 (Perf) → Ch 40 (UAT)
    │
    └─→ Ch 41 (Deploy) → Ch 42 (Maintain) → Ch 43 (Future) → Ch 44 (Roadmap)
```

**Rule:** No chapter starts until ALL its dependencies are complete and tested.

---

## 1.13 Definition of Done (Global)

A chapter is **DONE** when:

- [ ] All code compiles, type-checks (mypy/tsc strict), lints (ruff/eslint)
- [ ] Unit tests ≥ 80% coverage on new code
- [ ] Integration tests pass
- [ ] Feature works in local dev (`make dev`)
- [ ] Feature works in staging (ArgoCD deployed)
- [ ] Documentation updated (API docs, runbooks, README)
- [ ] Accessibility verified (WCAG 2.1 AA)
- [ ] Security scan clean (no Critical/High)
- [ ] Performance budgets met (latency, bundle size)
- [ ] Code reviewed by ≥ 1 engineer
- [ ] Merged to `develop` (or `main` for hotfix)

---

## 1.14 Next Steps

With the Master Plan established, the team proceeds to **Chapter 2: Repository Structure & Project Organization** to create the monorepo foundation.

**Next:** Chapter 2 — Repository Structure & Project Organization

---

**END OF CHAPTER 1**

*Volume 3: Software Development Blueprint & Implementation Guide (SDBIG)*