# Software Requirements Specification (SRS)
# AI-Based Real-Time Volleyball Player Performance Analysis System

**Version:** 1.0  
**Date:** July 15, 2026  
**Status:** Master Development Blueprint

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Functional Requirements](#2-functional-requirements)
3. [Non-Functional Requirements](#3-non-functional-requirements)
4. [Complete Folder Structure](#4-complete-folder-structure)
5. [Database Schema](#5-database-schema)
6. [API Specification](#6-api-specification)
7. [AI Pipeline](#7-ai-pipeline)
8. [Computer Vision Pipeline](#8-computer-vision-pipeline)
9. [YOLO Integration](#9-yolo-integration)
10. [ByteTrack Integration](#10-bytetrack-integration)
11. [MediaPipe Integration](#11-mediapipe-integration)
12. [OCR Module](#12-ocr-module)
13. [Event Recognition Module](#13-event-recognition-module)
14. [Automatic Statistics Engine](#14-automatic-statistics-engine)
15. [Heat Maps](#15-heat-maps)
16. [Distance Tracking](#16-distance-tracking)
17. [Jump Estimation](#17-jump-estimation)
18. [Dashboard Design](#18-dashboard-design)
19. [Admin Panel](#19-admin-panel)
20. [Coach Dashboard](#20-coach-dashboard)
21. [Authentication](#21-authentication)
22. [Match Management](#22-match-management)
23. [Team Management](#23-team-management)
24. [Player Management](#24-player-management)
25. [Training Pipeline](#25-training-pipeline)
26. [Dataset Organization](#26-dataset-organization)
27. [Model Evaluation](#27-model-evaluation)
28. [Deployment](#28-deployment)
29. [Testing](#29-testing)
30. [Documentation](#30-documentation)
31. [Git Workflow](#31-git-workflow)
32. [Docker Support](#32-docker-support)
33. [Future Enhancements](#33-future-enhancements)

---

## 1. Project Overview

### 1.1 Purpose

This system is an AI-powered, real-time volleyball analytics platform that uses computer vision to automatically detect players, track movements, recognize volleyball actions, and generate comprehensive match statistics — eliminating the need for manual data entry.

### 1.2 Problem Statement

Schools, universities, and amateur volleyball clubs cannot afford expensive commercial analytics systems (VolleyMetrics, Hudl). Manual statistic keeping is labor-intensive, error-prone, and cannot capture detailed metrics like heat maps, jump heights, or sprint speeds. There is a need for an affordable, camera-based solution that works from ordinary video feeds.

### 1.3 Solution

A computer vision pipeline that processes live or recorded video from standard cameras, uses YOLO for object detection, ByteTrack for multi-object tracking, MediaPipe for pose estimation, and custom LSTM/Transformer models for action recognition — all feeding into a statistics engine and React dashboard.

### 1.4 Scope

**In Scope:**
- Real-time and recorded video processing
- Player detection, tracking, and jersey number recognition
- Ball detection and trajectory tracking
- Volleyball action recognition (serve, spike, block, dig, set, reception)
- Automatic statistics generation
- Heat maps, distance tracking, jump estimation
- REST API backend
- React dashboard for admins and coaches
- Match, team, and player management
- Report generation and export

**Out of Scope:**
- Live broadcasting or streaming to external platforms
- Player biometric data (heart rate, etc.)
- Multi-language support (Phase 1)
- Mobile native applications (web-responsive only)
- Referee decision assistance

### 1.5 Target Users

| User Role | Description |
|-----------|-------------|
| System Admin | Full system access, user management, configuration |
| Team Coach | View team/player stats, match analysis, heat maps |
| Analyst | Deep analytics, report generation, performance tracking |
| Team Manager | Team roster management, match scheduling |

### 1.6 Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18+, TypeScript, TailwindCSS, Recharts, Leaflet |
| Backend | Python 3.10+, Flask, Flask-RESTful, Flask-JWT-Extended |
| Database | MySQL 8.0 |
| AI/CV | Python, OpenCV, Ultralytics YOLOv8, ByteTrack, MediaPipe |
| Deep Learning | PyTorch, custom LSTM/Transformer models |
| OCR | EasyOCR or PaddleOCR |
| Deployment | Docker, Docker Compose, Nginx |
| Version Control | Git with feature branch workflow |

### 1.7 System Context Diagram

```
+------------------+       +--------------------+       +------------------+
|   HD Camera      |------>| Video Ingestion    |------>| CV Pipeline      |
|   (RTSP/Web)     |       | (OpenCV)           |       | (YOLO+Track)     |
+------------------+       +--------------------+       +--------+---------+
                                                                    |
                                                                    v
+------------------+       +--------------------+       +------------------+
|   React          |<------| Flask REST API     |<------| Statistics       |
|   Dashboard      |       | (JWT Auth)         |       | Engine           |
+------------------+       +--------+-----------+       +------------------+
                                 |
                                 v
                        +------------------+
                        | MySQL Database   |
                        +------------------+
```

---

## 2. Functional Requirements

### 2.1 Video Processing

| ID | Requirement | Priority |
|----|------------|----------|
| FR-VP-01 | System shall accept video input from RTSP streams, webcams, and video files (MP4, AVI, MKV) | Must |
| FR-VP-02 | System shall process video at minimum 15 FPS for real-time analysis | Must |
| FR-VP-03 | System shall support configurable input resolution (720p, 1080p, 4K) | Must |
| FR-VP-04 | System shall detect and calibrate volleyball court boundaries from video | Must |
| FR-VP-05 | System shall pause/resume video processing without data loss | Should |

### 2.2 Player Detection & Tracking

| ID | Requirement | Priority |
|----|------------|----------|
| FR-PD-01 | System shall detect all players on court using YOLO with confidence >= 0.5 | Must |
| FR-PD-02 | System shall assign unique tracking ID to each detected player | Must |
| FR-PD-03 | System shall maintain tracking across occlusions up to 5 seconds | Must |
| FR-PD-04 | System shall identify player court position (front row, back row, left, center, right) | Must |
| FR-PD-05 | System shall recognize jersey numbers via OCR with >= 85% accuracy | Should |
| FR-PD-06 | System shall distinguish teams by jersey color | Must |

### 2.3 Ball Detection & Tracking

| ID | Requirement | Priority |
|----|------------|----------|
| FR-BD-01 | System shall detect volleyball in every frame with confidence >= 0.6 | Must |
| FR-BD-02 | System shall track ball position, speed, direction, and height | Must |
| FR-BD-03 | System shall compute ball trajectory and flight path | Must |
| FR-BD-04 | System shall detect ball contact points with players | Must |
| FR-BD-05 | System shall calculate ball speed in km/h | Should |

### 2.4 Action Recognition

| ID | Requirement | Priority |
|----|------------|----------|
| FR-AR-01 | System shall recognize actions: serve, serve ace, service error, reception, set, spike, kill, attack error, blocked attack, dig, free ball, block, solo block, block assist, net touch, rotation fault | Must |
| FR-AR-02 | System shall classify actions with >= 80% accuracy | Must |
| FR-AR-03 | System shall detect actions in real-time (within 2 seconds of occurrence) | Must |
| FR-AR-04 | System shall associate each action with the responsible player | Must |
| FR-AR-05 | System shall determine action outcome (point scored, side out, error) | Must |

### 2.5 Statistics Engine

| ID | Requirement | Priority |
|----|------------|----------|
| FR-SE-01 | System shall automatically calculate all standard volleyball statistics per player per match | Must |
| FR-SE-02 | System shall track cumulative statistics across multiple matches | Must |
| FR-SE-03 | System shall generate heat maps per player | Should |
| FR-SE-04 | System shall calculate distance covered per player | Should |
| FR-SE-05 | System shall estimate jump count and height | Should |
| FR-SE-06 | System shall calculate sprint speed and average movement speed | Should |
| FR-SE-07 | System shall calculate playing time from entry/exit times | Must |
| FR-SE-08 | System shall produce Player of the Match recommendations | Could |

### 2.6 Match Management

| ID | Requirement | Priority |
|----|------------|----------|
| FR-MM-01 | System shall allow creating matches with team assignments, date, venue, and match type | Must |
| FR-MM-02 | System shall support best-of-3 and best-of-5 set formats | Must |
| FR-MM-03 | System shall track set scores and point-by-point events | Must |
| FR-MM-04 | System shall link video recordings to matches | Must |
| FR-MM-05 | System shall support live match processing and post-match analysis | Must |

### 2.7 Team & Player Management

| ID | Requirement | Priority |
|----|------------|----------|
| FR-TM-01 | System shall allow CRUD operations for teams (name, logo, league, roster) | Must |
| FR-TM-02 | System shall allow CRUD operations for players (name, jersey number, position, team) | Must |
| FR-TM-03 | System shall support positions: Outside Hitter, Opposite, Setter, Middle Blocker, Libero, Defensive Specialist | Must |
| FR-TM-04 | System shall track player availability and match history | Should |

### 2.8 Dashboard

| ID | Requirement | Priority |
|----|------------|----------|
| FR-DB-01 | React dashboard shall display real-time match statistics during live processing | Must |
| FR-DB-02 | Dashboard shall show player comparison charts | Must |
| FR-DB-03 | Dashboard shall render interactive heat maps | Should |
| FR-DB-04 | Dashboard shall support match replay with annotated events | Should |
| FR-DB-05 | Dashboard shall allow PDF/CSV report export | Must |
| FR-DB-06 | Dashboard shall be responsive (desktop, tablet) | Must |

### 2.9 Authentication & Authorization

| ID | Requirement | Priority |
|----|------------|----------|
| FR-AUTH-01 | System shall support JWT-based authentication | Must |
| FR-AUTH-02 | System shall implement role-based access control (Admin, Coach, Analyst, Viewer) | Must |
| FR-AUTH-03 | System shall enforce API endpoint permissions based on roles | Must |
| FR-AUTH-04 | System shall support password hashing (bcrypt) | Must |
| FR-AUTH-05 | System shall support token refresh mechanism | Must |

---

## 3. Non-Functional Requirements

### 3.1 Performance

| ID | Requirement | Target |
|----|------------|--------|
| NFR-P-01 | Real-time processing FPS | >= 15 FPS |
| NFR-P-02 | Action recognition latency | <= 2 seconds |
| NFR-P-03 | API response time (P95) | <= 200ms |
| NFR-P-04 | Dashboard initial load time | <= 3 seconds |
| NFR-P-05 | Database query execution (P95) | <= 100ms |
| NFR-P-06 | Concurrent video streams supported | >= 2 |
| NFR-P-07 | Simultaneous dashboard users | >= 20 |

### 3.2 Scalability

| ID | Requirement |
|----|------------|
| NFR-S-01 | System shall support horizontal scaling via containerization |
| NFR-S-02 | Database shall handle 10,000+ matches and 500+ players |
| NFR-S-03 | Video processing shall be decoupled from API serving |
| NFR-S-04 | Statistics calculation shall support batch processing for historical data |

### 3.3 Reliability

| ID | Requirement |
|----|------------|
| NFR-R-01 | System uptime target: 99.5% |
| NFR-R-02 | Database shall perform daily automated backups |
| NFR-R-03 | Video processing shall recover gracefully from frame drops |
| NFR-R-04 | System shall log all errors with context for debugging |

### 3.4 Security

| ID | Requirement |
|----|------------|
| NFR-SEC-01 | All API traffic shall use HTTPS |
| NFR-SEC-02 | Passwords shall be hashed with bcrypt (12+ rounds) |
| NFR-SEC-03 | JWT tokens shall expire within 24 hours |
| NFR-SEC-04 | Sensitive configuration shall use environment variables |
| NFR-SEC-05 | Database connections shall use connection pooling with limits |

### 3.5 Maintainability

| ID | Requirement |
|----|------------|
| NFR-M-01 | Code shall follow PEP 8 (Python) and ESLint (TypeScript) standards |
| NFR-M-02 | All modules shall have docstrings and type hints |
| NFR-M-03 | Test coverage shall be >= 80% for backend services |
| NFR-M-04 | API endpoints shall be documented via OpenAPI/Swagger |

### 3.6 Compatibility

| ID | Requirement |
|----|------------|
| NFR-C-01 | Backend shall run on Python 3.10+ |
| NFR-C-02 | Frontend shall support Chrome, Firefox, Edge (latest 2 versions) |
| NFR-C-03 | System shall run on Windows 10+, Ubuntu 20.04+, macOS 12+ |
| NFR-C-04 | GPU acceleration shall be optional (CUDA 11.8+ for NVIDIA GPUs) |

---

## 4. Complete Folder Structure

```
Volleyball_AI_System/
│
├── backend/
│   ├── __init__.py
│   ├── main.py                          # Flask application entry point
│   ├── config.py                        # Configuration management
│   ├── requirements.txt                 # Python dependencies
│   │
│   ├── app/
│   │   ├── __init__.py
│   │   ├── extensions.py                # Flask extensions initialization
│   │   └── factory.py                   # Application factory pattern
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── auth_routes.py           # /api/auth/*
│   │   │   ├── team_routes.py           # /api/teams/*
│   │   │   ├── player_routes.py         # /api/players/*
│   │   │   ├── match_routes.py          # /api/matches/*
│   │   │   ├── statistics_routes.py     # /api/statistics/*
│   │   │   ├── video_routes.py          # /api/videos/*
│   │   │   ├── report_routes.py         # /api/reports/*
│   │   │   └── dashboard_routes.py      # /api/dashboard/*
│   │   └── middleware/
│   │       ├── __init__.py
│   │       ├── auth_middleware.py        # JWT authentication middleware
│   │       ├── error_handler.py         # Global error handling
│   │       └── rate_limiter.py          # API rate limiting
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py                      # User model
│   │   ├── team.py                      # Team model
│   │   ├── player.py                    # Player model
│   │   ├── match.py                     # Match model
│   │   ├── match_set.py                 # Set model
│   │   ├── point_event.py               # Point event model
│   │   ├── player_statistics.py         # Player match statistics
│   │   ├── video.py                     # Video record model
│   │   ├── heat_map.py                  # Heat map data model
│   │   └── report.py                    # Generated report model
│   │
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── auth_schemas.py              # Marshmallow auth schemas
│   │   ├── team_schemas.py
│   │   ├── player_schemas.py
│   │   ├── match_schemas.py
│   │   ├── statistics_schemas.py
│   │   └── report_schemas.py
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py              # Authentication logic
│   │   ├── team_service.py              # Team CRUD logic
│   │   ├── player_service.py            # Player CRUD logic
│   │   ├── match_service.py             # Match management logic
│   │   ├── statistics_service.py        # Statistics retrieval logic
│   │   ├── video_service.py             # Video upload/management
│   │   └── report_service.py            # Report generation logic
│   │
│   ├── database/
│   │   ├── __init__.py
│   │   ├── connection.py                # Database connection manager
│   │   ├── migrations/                  # Alembic migrations
│   │   │   ├── env.py
│   │   │   └── versions/
│   │   └── seed.py                      # Database seeding script
│   │
│   └── tests/
│       ├── __init__.py
│       ├── conftest.py                  # Pytest fixtures
│       ├── test_auth.py
│       ├── test_teams.py
│       ├── test_players.py
│       ├── test_matches.py
│       ├── test_statistics.py
│       └── test_api.py
│
├── ai/
│   ├── __init__.py
│   ├── config.py                        # AI pipeline configuration
│   │
│   ├── detection/
│   │   ├── __init__.py
│   │   ├── player_detector.py           # YOLO player detection
│   │   ├── ball_detector.py             # YOLO ball detection
│   │   ├── court_detector.py            # Court line detection
│   │   └── models/                      # YOLO weight files
│   │       ├── player_yolov8.pt
│   │       └── ball_yolov8.pt
│   │
│   ├── tracking/
│   │   ├── __init__.py
│   │   ├── player_tracker.py            # ByteTrack for players
│   │   ├── ball_tracker.py              # Ball tracking module
│   │   └── tracker_config.py            # Tracker parameters
│   │
│   ├── pose/
│   │   ├── __init__.py
│   │   ├── pose_estimator.py            # MediaPipe pose estimation
│   │   ├── body_analyzer.py             # Body angle/keypoint analysis
│   │   └── jump_detector.py             # Jump detection from pose
│   │
│   ├── ocr/
│   │   ├── __init__.py
│   │   ├── jersey_reader.py             # Jersey number OCR
│   │   └── preprocessor.py              # Image preprocessing for OCR
│   │
│   ├── action_recognition/
│   │   ├── __init__.py
│   │   ├── action_classifier.py         # Main action classification
│   │   ├── action_rules.py              # Rule-based action detection
│   │   ├── lstm_model.py                # LSTM action model
│   │   ├── transformer_model.py         # Transformer action model
│   │   └── models/                      # Trained model weights
│   │       ├── action_lstm.pt
│   │       └── action_transformer.pt
│   │
│   ├── statistics/
│   │   ├── __init__.py
│   │   ├── stats_engine.py              # Main statistics calculator
│   │   ├── heat_map_generator.py        # Heat map generation
│   │   ├── distance_calculator.py       # Player distance tracking
│   │   ├── jump_analyzer.py             # Jump height estimation
│   │   └── speed_analyzer.py            # Speed calculation
│   │
│   ├── inference/
│   │   ├── __init__.py
│   │   ├── video_processor.py           # Main video processing pipeline
│   │   ├── frame_buffer.py              # Frame buffering management
│   │   ├── pipeline.py                  # Full AI pipeline orchestration
│   │   └── real_time_processor.py       # Real-time stream processing
│   │
│   └── training/
│       ├── __init__.py
│       ├── train_action_model.py        # Action model training script
│       ├── train_yolo.py                # YOLO fine-tuning script
│       ├── evaluate.py                  # Model evaluation script
│       ├── augmentations.py             # Data augmentation pipeline
│       └── configs/
│           ├── action_lstm_config.yaml
│           ├── action_transformer_config.yaml
│           └── yolo_config.yaml
│
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── index.html
│   ├── public/
│   │   └── assets/
│   └── src/
│       ├── main.tsx                     # React entry point
│       ├── App.tsx                      # Root component with routing
│       ├── index.css                    # Global styles
│       │
│       ├── api/
│       │   ├── client.ts                # Axios instance with interceptors
│       │   ├── authApi.ts
│       │   ├── teamApi.ts
│       │   ├── playerApi.ts
│       │   ├── matchApi.ts
│       │   ├── statisticsApi.ts
│       │   └── reportApi.ts
│       │
│       ├── components/
│       │   ├── common/
│       │   │   ├── Navbar.tsx
│       │   │   ├── Sidebar.tsx
│       │   │   ├── DataTable.tsx
│       │   │   ├── LoadingSpinner.tsx
│       │   │   ├── Modal.tsx
│       │   │   ├── Toast.tsx
│       │   │   └── ProtectedRoute.tsx
│       │   ├── charts/
│       │   │   ├── BarChart.tsx
│       │   │   ├── LineChart.tsx
│       │   │   ├── RadarChart.tsx
│       │   │   ├── HeatMap.tsx
│       │   │   └── PlayerComparison.tsx
│       │   ├── match/
│       │   │   ├── MatchCard.tsx
│       │   │   ├── ScoreBoard.tsx
│       │   │   ├── SetTimeline.tsx
│       │   │   ├── EventLog.tsx
│       │   │   └── LiveProcessor.tsx
│       │   └── player/
│       │       ├── PlayerCard.tsx
│       │       ├── PlayerStats.tsx
│       │       ├── PlayerHeatMap.tsx
│       │       └── PerformanceTrend.tsx
│       │
│       ├── pages/
│       │   ├── LoginPage.tsx
│       │   ├── DashboardPage.tsx
│       │   ├── TeamsPage.tsx
│       │   ├── TeamDetailPage.tsx
│       │   ├── PlayersPage.tsx
│       │   ├── PlayerDetailPage.tsx
│       │   ├── MatchesPage.tsx
│       │   ├── MatchDetailPage.tsx
│       │   ├── LiveMatchPage.tsx
│       │   ├── ReportsPage.tsx
│       │   ├── SettingsPage.tsx
│       │   └── AdminPage.tsx
│       │
│       ├── hooks/
│       │   ├── useAuth.ts
│       │   ├── useMatches.ts
│       │   ├── usePlayers.ts
│       │   ├── useTeams.ts
│       │   └── useStatistics.ts
│       │
│       ├── store/
│       │   ├── authStore.ts             # Zustand auth state
│       │   ├── matchStore.ts
│       │   └── dashboardStore.ts
│       │
│       ├── types/
│       │   ├── auth.ts
│       │   ├── team.ts
│       │   ├── player.ts
│       │   ├── match.ts
│       │   ├── statistics.ts
│       │   └── api.ts
│       │
│       └── utils/
│           ├── formatters.ts
│           ├── validators.ts
│           └── constants.ts
│
├── datasets/
│   ├── raw/                             # Original video files
│   ├── processed/                       # Extracted and labeled frames
│   │   ├── players/
│   │   ├── ball/
│   │   └── actions/
│   ├── annotations/                     # YOLO format annotation files
│   │   ├── players/
│   │   ├── ball/
│   │   └── actions/
│   └── splits/                          # Train/val/test splits
│       ├── train.txt
│       ├── val.txt
│       └── test.txt
│
├── models/                              # Exported/trained model artifacts
│   ├── detection/
│   │   ├── player_yolov8_best.pt
│   │   └── ball_yolov8_best.pt
│   ├── action_recognition/
│   │   ├── action_lstm_best.pt
│   │   └── action_transformer_best.pt
│   └── ocr/
│       └── jersey_ocr_model.pth
│
├── videos/                              # Uploaded match videos
│   ├── uploads/
│   └── processed/
│
├── reports/                             # Generated match reports
│   ├── pdf/
│   └── csv/
│
├── docs/
│   ├── SRS.md
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── DEPLOYMENT.md
│   └── USER_GUIDE.md
│
├── scripts/
│   ├── setup_dev.sh                     # Development environment setup
│   ├── seed_database.py                 # Database seeding
│   ├── run_tests.sh                     # Test runner
│   └── export_models.py                 # Model export utility
│
├── venv/                                # Python virtual environment
├── .gitignore
├── .env.example                         # Environment variable template
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
├── Makefile                             # Common commands
└── README.md
```

---

## 5. Database Schema

### 5.1 Entity Relationship Diagram

```
users ─────────────────────────┐
                                │
teams ──────── players ─────────┤
   │              │             │
   │              │             │
matches ──── match_sets ────────┤
   │              │             │
   │              │             │
   ├── point_events              │
   │                            │
   ├── player_statistics ───────┤
   │                            │
   ├── videos                   │
   │                            │
   ├── heat_maps               │
   │                            │
   └── reports ─────────────────┘
```

### 5.2 Table Definitions

#### users
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | User ID |
| username | VARCHAR(50) | UNIQUE, NOT NULL | Login username |
| email | VARCHAR(100) | UNIQUE, NOT NULL | User email |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| role | ENUM | NOT NULL | 'admin', 'coach', 'analyst', 'viewer' |
| full_name | VARCHAR(100) | NOT NULL | Display name |
| is_active | BOOLEAN | DEFAULT TRUE | Account status |
| created_at | TIMESTAMP | DEFAULT CURRENT | Account creation |
| updated_at | TIMESTAMP | ON UPDATE CURRENT | Last update |

#### teams
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Team ID |
| name | VARCHAR(100) | UNIQUE, NOT NULL | Team name |
| short_name | VARCHAR(10) | NOT NULL | Abbreviation (e.g., "USA") |
| logo_url | VARCHAR(500) | NULL | Team logo path |
| league | VARCHAR(100) | NULL | League/association |
| country | VARCHAR(50) | NULL | Country |
| coach_name | VARCHAR(100) | NULL | Head coach |
| created_at | TIMESTAMP | DEFAULT CURRENT | Creation date |
| updated_at | TIMESTAMP | ON UPDATE CURRENT | Last update |

#### players
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Player ID |
| team_id | INT | FK -> teams.id, NOT NULL | Team affiliation |
| jersey_number | INT | NOT NULL | Jersey number |
| first_name | VARCHAR(50) | NOT NULL | First name |
| last_name | VARCHAR(50) | NOT NULL | Last name |
| position | ENUM | NOT NULL | Position enum (see below) |
| date_of_birth | DATE | NULL | Date of birth |
| height_cm | INT | NULL | Height in centimeters |
| weight_kg | INT | NULL | Weight in kilograms |
| jersey_color | VARCHAR(7) | NULL | Hex color code for team jersey |
| is_active | BOOLEAN | DEFAULT TRUE | Active roster status |
| created_at | TIMESTAMP | DEFAULT CURRENT | |
| updated_at | TIMESTAMP | ON UPDATE CURRENT | |

**Position Enum Values:** `outside_hitter`, `opposite`, `setter`, `middle_blocker`, `libero`, `defensive_specialist`

#### matches
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Match ID |
| home_team_id | INT | FK -> teams.id, NOT NULL | Home team |
| away_team_id | INT | FK -> teams.id, NOT NULL | Away team |
| match_date | DATE | NOT NULL | Scheduled date |
| venue | VARCHAR(200) | NULL | Venue name |
| match_type | ENUM | NOT NULL | 'friendly', 'league', 'tournament', 'practice' |
| sets_format | ENUM | NOT NULL | 'best_of_3', 'best_of_5' |
| status | ENUM | NOT NULL | 'scheduled', 'live', 'completed', 'cancelled' |
| winner_team_id | INT | FK -> teams.id, NULL | Winner (set after completion) |
| home_score | INT | DEFAULT 0 | Total sets won by home |
| away_score | INT | DEFAULT 0 | Total sets won by away |
| processing_status | ENUM | DEFAULT 'pending' | 'pending', 'processing', 'completed', 'failed' |
| created_at | TIMESTAMP | DEFAULT CURRENT | |
| updated_at | TIMESTAMP | ON UPDATE CURRENT | |

#### match_sets
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Set ID |
| match_id | INT | FK -> matches.id, NOT NULL | Parent match |
| set_number | INT | NOT NULL | Set number (1-5) |
| home_points | INT | DEFAULT 0 | Home team points |
| away_points | INT | DEFAULT 0 | Away team points |
| winner_team_id | INT | FK -> teams.id, NULL | Set winner |
| status | ENUM | DEFAULT 'pending' | 'pending', 'in_progress', 'completed' |
| created_at | TIMESTAMP | DEFAULT CURRENT | |

#### point_events
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Event ID |
| match_id | INT | FK -> matches.id, NOT NULL | Match reference |
| set_id | INT | FK -> match_sets.id, NOT NULL | Set reference |
| player_id | INT | FK -> players.id, NULL | Responsible player |
| team_id | INT | FK -> teams.id, NOT NULL | Team that performed action |
| event_type | ENUM | NOT NULL | Action type (see below) |
| event_outcome | ENUM | NOT NULL | 'point', 'side_out', 'error', 'neutral' |
| timestamp_seconds | FLOAT | NOT NULL | Time in match (seconds) |
| frame_number | INT | NULL | Video frame reference |
| video_id | INT | FK -> videos.id, NULL | Video reference |
| court_position_x | FLOAT | NULL | Normalized court X (0.0-1.0) |
| court_position_y | FLOAT | NULL | Normalized court Y (0.0-1.0) |
| ball_speed_kmh | FLOAT | NULL | Ball speed if applicable |
| confidence | FLOAT | NULL | AI confidence score |
| set_score_home | INT | NULL | Score at time of event |
| set_score_away | INT | NULL | Score at time of event |
| created_at | TIMESTAMP | DEFAULT CURRENT | |

**Event Type Enum Values:** `serve`, `serve_ace`, `service_error`, `reception`, `set`, `spike`, `kill`, `attack_error`, `blocked_attack`, `dig`, `free_ball`, `block`, `solo_block`, `block_assist`, `net_touch`, `rotation_fault`

**Event Outcome Enum Values:** `point`, `side_out`, `error`, `neutral`

#### player_statistics
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Stats ID |
| player_id | INT | FK -> players.id, NOT NULL | Player |
| match_id | INT | FK -> matches.id, NOT NULL | Match |
| | | UNIQUE(player_id, match_id) | |
| sets_played | INT | DEFAULT 0 | Sets played |
| total_points | INT | DEFAULT 0 | Total points scored |
| kill_points | INT | DEFAULT 0 | Kills |
| attack_attempts | INT | DEFAULT 0 | Total attacks |
| attack_errors | INT | DEFAULT 0 | Attack errors |
| blocked_attacks | INT | DEFAULT 0 | Attacks blocked |
| serve_attempts | INT | DEFAULT 0 | Total serves |
| serve_aces | INT | DEFAULT 0 | Serve aces |
| serve_errors | INT | DEFAULT 0 | Service errors |
| reception_attempts | INT | DEFAULT 0 | Total receptions |
| perfect_receptions | INT | DEFAULT 0 | Perfect passes |
| reception_errors | INT | DEFAULT 0 | Reception errors |
| set_attempts | INT | DEFAULT 0 | Total sets |
| set_assists | INT | DEFAULT 0 | Successful assists |
| set_errors | INT | DEFAULT 0 | Setting errors |
| solo_blocks | INT | DEFAULT 0 | Solo blocks |
| block_assists | INT | DEFAULT 0 | Block assists |
| block_errors | INT | DEFAULT 0 | Blocking errors |
| digs | INT | DEFAULT 0 | Digs |
| saves | INT | DEFAULT 0 | Emergency saves |
| free_balls | INT | DEFAULT 0 | Free balls given |
| playing_time_seconds | FLOAT | DEFAULT 0 | Time on court |
| distance_covered_meters | FLOAT | DEFAULT 0 | Total distance |
| avg_speed_kmh | FLOAT | DEFAULT 0 | Average movement speed |
| max_speed_kmh | FLOAT | DEFAULT 0 | Max sprint speed |
| jump_count | INT | DEFAULT 0 | Total jumps |
| avg_jump_height_cm | FLOAT | DEFAULT 0 | Average jump height |
| max_jump_height_cm | FLOAT | DEFAULT 0 | Max jump height |
| heatmap_data | JSON | NULL | Grid cell visit counts |
| position_data | JSON | NULL | Position tracking array |
| created_at | TIMESTAMP | DEFAULT CURRENT | |

#### videos
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Video ID |
| match_id | INT | FK -> matches.id, NULL | Associated match |
| filename | VARCHAR(255) | NOT NULL | Stored filename |
| original_filename | VARCHAR(255) | NOT NULL | Upload filename |
| file_path | VARCHAR(500) | NOT NULL | Storage path |
| file_size_bytes | BIGINT | NOT NULL | File size |
| duration_seconds | FLOAT | NULL | Video duration |
| resolution_width | INT | NULL | Width in pixels |
| resolution_height | INT | NULL | Height in pixels |
| fps | FLOAT | NULL | Frames per second |
| source_type | ENUM | NOT NULL | 'upload', 'rtsp', 'webcam' |
| processing_status | ENUM | DEFAULT 'pending' | 'pending', 'processing', 'completed', 'failed' |
| processing_progress | FLOAT | DEFAULT 0 | 0-100 percent |
| uploaded_by | INT | FK -> users.id, NULL | Uploader |
| created_at | TIMESTAMP | DEFAULT CURRENT | |

#### heat_maps
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Heat map ID |
| player_id | INT | FK -> players.id, NOT NULL | Player |
| match_id | INT | FK -> matches.id, NOT NULL | Match |
| set_id | INT | FK -> match_sets.id, NULL | Specific set (NULL = full match) |
| grid_data | JSON | NOT NULL | 12x6 grid cell counts |
| court_zone_data | JSON | NULL | Zone-level aggregation |
| total_events | INT | NOT NULL | Total events mapped |
| created_at | TIMESTAMP | DEFAULT CURRENT | |

#### reports
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Report ID |
| match_id | INT | FK -> matches.id, NOT NULL | Match reference |
| generated_by | INT | FK -> users.id, NULL | User who triggered |
| report_type | ENUM | NOT NULL | 'full', 'team', 'player', 'summary' |
| format | ENUM | NOT NULL | 'pdf', 'csv', 'json' |
| file_path | VARCHAR(500) | NOT NULL | Stored report path |
| file_size_bytes | BIGINT | NULL | File size |
| created_at | TIMESTAMP | DEFAULT CURRENT | |

### 5.3 Database Indices

```sql
-- Performance indices
CREATE INDEX idx_players_team ON players(team_id);
CREATE INDEX idx_players_jersey ON players(team_id, jersey_number);
CREATE INDEX idx_matches_date ON matches(match_date);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_match_sets_match ON match_sets(match_id);
CREATE INDEX idx_point_events_match ON point_events(match_id);
CREATE INDEX idx_point_events_set ON point_events(set_id);
CREATE INDEX idx_point_events_player ON point_events(player_id);
CREATE INDEX idx_point_events_type ON point_events(event_type);
CREATE INDEX idx_player_stats_player ON player_statistics(player_id);
CREATE INDEX idx_player_stats_match ON player_statistics(match_id);
CREATE INDEX idx_heat_maps_player ON heat_maps(player_id, match_id);
CREATE INDEX idx_videos_match ON videos(match_id);
```

---

## 6. API Specification

### 6.1 Base Configuration

```
Base URL:       /api/v1
Authentication: Bearer JWT token in Authorization header
Content-Type:   application/json
```

### 6.2 Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/v1/auth/register | Register new user | No |
| POST | /api/v1/auth/login | Login and get JWT | No |
| POST | /api/v1/auth/refresh | Refresh access token | Yes (refresh token) |
| GET | /api/v1/auth/me | Get current user profile | Yes |
| PUT | /api/v1/auth/me | Update current user profile | Yes |
| PUT | /api/v1/auth/password | Change password | Yes |

### 6.3 Team Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | /api/v1/teams | List all teams | Yes | All |
| POST | /api/v1/teams | Create team | Yes | admin, coach |
| GET | /api/v1/teams/{id} | Get team details | Yes | All |
| PUT | /api/v1/teams/{id} | Update team | Yes | admin, coach |
| DELETE | /api/v1/teams/{id} | Delete team | Yes | admin |
| GET | /api/v1/teams/{id}/players | List team players | Yes | All |
| GET | /api/v1/teams/{id}/statistics | Team aggregate stats | Yes | All |
| GET | /api/v1/teams/{id}/matches | Team match history | Yes | All |

### 6.4 Player Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | /api/v1/players | List all players (filterable) | Yes | All |
| POST | /api/v1/players | Create player | Yes | admin, coach |
| GET | /api/v1/players/{id} | Get player details | Yes | All |
| PUT | /api/v1/players/{id} | Update player | Yes | admin, coach |
| DELETE | /api/v1/players/{id} | Delete player | Yes | admin |
| GET | /api/v1/players/{id}/statistics | Player stats (all matches) | Yes | All |
| GET | /api/v1/players/{id}/statistics/{match_id} | Player stats per match | Yes | All |
| GET | /api/v1/players/{id}/heatmap/{match_id} | Player heat map | Yes | All |
| GET | /api/v1/players/{id}/trends | Performance trends | Yes | All |
| GET | /api/v1/players/{id}/comparison | Compare with other players | Yes | All |

### 6.5 Match Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | /api/v1/matches | List all matches | Yes | All |
| POST | /api/v1/matches | Create match | Yes | admin, coach |
| GET | /api/v1/matches/{id} | Get match details | Yes | All |
| PUT | /api/v1/matches/{id} | Update match | Yes | admin, coach |
| DELETE | /api/v1/matches/{id} | Delete match | Yes | admin |
| GET | /api/v1/matches/{id}/events | Get all point events | Yes | All |
| GET | /api/v1/matches/{id}/sets | Get all sets | Yes | All |
| GET | /api/v1/matches/{id}/statistics | Match statistics (both teams) | Yes | All |
| POST | /api/v1/matches/{id}/start | Start live match processing | Yes | admin, coach |
| POST | /api/v1/matches/{id}/stop | Stop live processing | Yes | admin, coach |
| GET | /api/v1/matches/{id}/live | WebSocket for live data | Yes | All |

### 6.6 Video Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | /api/v1/videos | List all videos | Yes | All |
| POST | /api/v1/videos/upload | Upload video file | Yes | admin, coach |
| GET | /api/v1/videos/{id} | Get video details | Yes | All |
| DELETE | /api/v1/videos/{id} | Delete video | Yes | admin |
| POST | /api/v1/videos/{id}/process | Start AI processing | Yes | admin, coach |
| GET | /api/v1/videos/{id}/status | Get processing status | Yes | All |
| POST | /api/v1/videos/process-rtsp | Process RTSP stream | Yes | admin |

### 6.7 Statistics Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | /api/v1/statistics/match/{id} | Full match statistics | Yes | All |
| GET | /api/v1/statistics/player/{id} | Player career statistics | Yes | All |
| GET | /api/v1/statistics/team/{id} | Team aggregate statistics | Yes | All |
| GET | /api/v1/statistics/leaderboards | Statistical leaderboards | Yes | All |
| GET | /api/v1/statistics/comparison | Multi-player comparison | Yes | All |
| GET | /api/v1/statistics/trends | Performance trends over time | Yes | All |

### 6.8 Report Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | /api/v1/reports | List all reports | Yes | All |
| POST | /api/v1/reports/generate | Generate new report | Yes | admin, coach, analyst |
| GET | /api/v1/reports/{id} | Get report details | Yes | All |
| GET | /api/v1/reports/{id}/download | Download report file | Yes | All |
| DELETE | /api/v1/reports/{id} | Delete report | Yes | admin |

### 6.9 Dashboard Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | /api/v1/dashboard/overview | Dashboard summary stats | Yes | All |
| GET | /api/v1/dashboard/recent-matches | Recent match cards | Yes | All |
| GET | /api/v1/dashboard/top-players | Top performing players | Yes | All |
| GET | /api/v1/dashboard/live-matches | Currently live matches | Yes | All |

### 6.10 Admin Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | /api/v1/admin/users | List all users | Yes | admin |
| PUT | /api/v1/admin/users/{id}/role | Change user role | Yes | admin |
| PUT | /api/v1/admin/users/{id}/status | Activate/deactivate user | Yes | admin |
| GET | /api/v1/admin/system-stats | System statistics | Yes | admin |
| POST | /api/v1/admin/backup | Trigger database backup | Yes | admin |

### 6.11 API Response Format

**Success Response:**
```json
{
  "status": "success",
  "data": { ... },
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

**Error Response:**
```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "jersey_number": "Must be between 0 and 99"
    }
  }
}
```

### 6.12 Request/Response Examples

**POST /api/v1/auth/login**
```json
// Request
{
  "username": "coach_smith",
  "password": "securepassword123"
}

// Response
{
  "status": "success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "username": "coach_smith",
      "role": "coach",
      "full_name": "John Smith"
    }
  }
}
```

**POST /api/v1/matches**
```json
// Request
{
  "home_team_id": 1,
  "away_team_id": 2,
  "match_date": "2026-07-20",
  "venue": "City Sports Arena",
  "match_type": "league",
  "sets_format": "best_of_5"
}

// Response
{
  "status": "success",
  "data": {
    "id": 101,
    "home_team": { "id": 1, "name": "Thunder Hawks" },
    "away_team": { "id": 2, "name": "Storm Riders" },
    "match_date": "2026-07-20",
    "venue": "City Sports Arena",
    "status": "scheduled",
    "created_at": "2026-07-15T10:30:00Z"
  }
}
```

---

## 7. AI Pipeline

### 7.1 Pipeline Overview

The AI pipeline is a sequential, multi-stage process that transforms raw video frames into structured match statistics. Each stage feeds its output to the next.

### 7.2 Pipeline Architecture

```
Video Input (Frame Stream)
        │
        ▼
┌─────────────────────┐
│ 1. Frame Preprocessing  │  Resize, normalize, color correction
└─────────┬───────────┘
        │
        ▼
┌─────────────────────┐
│ 2. Court Detection      │  Homography transform, court boundary mapping
└─────────┬───────────┘
        │
        ▼
┌─────────────────────┐
│ 3. Object Detection     │  YOLOv8: detect players + ball
└─────────┬───────────┘
        │
        ▼
┌─────────────────────┐
│ 4. Object Tracking      │  ByteTrack: assign IDs, maintain tracks
└─────────┬───────────┘
        │
        ├──────────────────────┐
        │                      │
        ▼                      ▼
┌──────────────┐    ┌──────────────┐
│ 5a. Jersey OCR│    │ 5b. Pose Est  │  Parallel processing per player
└──────┬───────┘    └──────┬───────┘
        │                      │
        └──────────┬───────────┘
                │
                ▼
┌─────────────────────┐
│ 6. Action Recognition  │  LSTM/Transformer classifies volleyball actions
└─────────┬───────────┘
        │
        ▼
┌─────────────────────┐
│ 7. Statistics Engine   │  Aggregate events into player/match stats
└─────────┬───────────┘
        │
        ▼
┌─────────────────────┐
│ 8. Data Storage        │  Write to MySQL, update cache
└─────────────────────┘
```

### 7.3 Pipeline Configuration

```yaml
pipeline:
  input:
    source_type: "video_file"  # video_file | rtsp | webcam
    source_path: "videos/match_001.mp4"
    target_fps: 15
    resize_width: 1280
    resize_height: 720

  court_detection:
    enabled: true
    calibration_file: "models/detection/court_calibration.json"
    homography_matrix: null  # Auto-detected if null

  detection:
    player_model: "models/detection/player_yolov8_best.pt"
    ball_model: "models/detection/ball_yolov8_best.pt"
    player_confidence: 0.5
    ball_confidence: 0.6
    iou_threshold: 0.45
    device: "auto"  # auto | cpu | cuda:0

  tracking:
    type: "bytetrack"  # bytetrack | deepsort | botsort
    track_thresh: 0.5
    track_buffer: 30  # frames to keep lost track
    match_thresh: 0.8
    min_hits: 3  # minimum detections before track confirmed

  pose:
    enabled: true
    model: "mediapipe"  # mediapipe | yolopose
    min_detection_confidence: 0.5
    model_complexity: 2  # 0, 1, or 2

  ocr:
    enabled: true
    engine: "easyocr"  # easyocr | paddleocr
    languages: ["en"]
    min_confidence: 0.7
    roi_padding: 10  # pixels around detected jersey number

  action_recognition:
    model_type: "lstm"  # lstm | transformer | rules
    model_path: "models/action_recognition/action_lstm_best.pt"
    sequence_length: 30  # frames per action window
    confidence_threshold: 0.7
    device: "auto"

  statistics:
    heatmap_grid: [12, 6]  # 12 columns x 6 rows
    jump_velocity_threshold: 1.5  # m/s upward velocity
    sprint_speed_threshold: 6.0  # km/h
    distance_smoothing_window: 10  # frames
    pixel_to_meter_ratio: null  # Auto-calibrated from court
```

### 7.4 Pipeline Data Flow

Each frame passes through the pipeline with the following data structure:

```python
@dataclass
class PipelineFrameData:
    frame_number: int
    timestamp: float              # seconds from video start
    frame: np.ndarray             # original frame
    resized_frame: np.ndarray     # preprocessed frame

    # Court detection results
    court_corners: Optional[np.ndarray]  # 4 corner points
    homography_matrix: Optional[np.ndarray]
    court_mask: Optional[np.ndarray]

    # Detection results
    player_detections: List[Detection]     # bounding boxes + confidence
    ball_detections: List[Detection]

    # Tracking results
    player_tracks: List[Track]     # tracked player objects
    ball_track: Optional[Track]    # tracked ball object

    # Per-player results
    player_jerseys: Dict[int, Optional[int]]  # track_id -> jersey number
    player_poses: Dict[int, PoseResult]       # track_id -> pose keypoints
    player_court_positions: Dict[int, Tuple[float, float]]  # normalized

    # Action recognition results
    detected_actions: List[DetectedAction]

    # Ball analysis
    ball_position: Optional[Tuple[float, float, float]]  # 3D position
    ball_speed: Optional[float]    # km/h
    ball_trajectory: List[Tuple[float, float]]
```

### 7.5 Pipeline Processing Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| Real-time | Process live stream frame-by-frame | Live match analysis |
| Batch | Process recorded video, store all results | Post-match analysis |
| Replay | Re-process with different parameters | Re-analysis with tuned settings |
| Stream API | Process and push results via WebSocket | Dashboard live view |

---

## 8. Computer Vision Pipeline

### 8.1 Frame Preprocessing

```
Input Frame (1920x1080)
        │
        ▼
Resize to target resolution (1280x720)
        │
        ▼
Color space conversion (BGR -> RGB for model input)
        │
        ▼
Normalize pixel values (0-1 or 0-255)
        │
        ▼
Optional: CLAHE for contrast enhancement
        │
        ▼
Output: Preprocessed frame ready for detection
```

### 8.2 Court Detection

The court detection module identifies the volleyball court boundaries in the video frame:

**Algorithm:**
1. Edge detection (Canny) on the frame
2. Line detection (Hough Transform) to find court lines
3. Identify the 4 trapezoid corners of the court
4. Compute homography matrix for perspective transform
5. Map pixel coordinates to real court coordinates (18m x 9m)

**Court Coordinate System:**
```
(0,0)────────────────────────(18,0)
  │                              │
  │         TEAM A SIDE          │
  │         (y: 0-4.5)          │
  │                              │
(0,4.5)────────────────────(18,4.5)  ← Net line
  │                              │
  │         TEAM B SIDE          │
  │         (y: 4.5-9)          │
  │                              │
(0,9)──────────────────────(18,9)
```

### 8.3 Detection Processing

```
Preprocessed Frame
        │
        ├──▶ Player YOLO Model ──▶ Player Bounding Boxes (x, y, w, h, conf)
        │
        └──▶ Ball YOLO Model ────▶ Ball Bounding Box (x, y, w, h, conf)

Results merged with NMS (Non-Maximum Suppression)
        │
        ▼
Filtered Detections (players + ball per frame)
```

### 8.4 Tracking Assignment

```
Frame N Detections          Frame N+1 Detections
     │                           │
     └───────┬───────────────────┘
             │
             ▼
      ByteTrack Algorithm
      - IoU matching
      - Kalman filter prediction
      - Track state management
             │
             ▼
      Updated Track IDs (consistent across frames)
```

---

## 9. YOLO Integration

### 9.1 Model Selection

| Model | Use Case | Size | Speed | Accuracy |
|-------|----------|------|-------|----------|
| YOLOv8n | Fast detection (CPU) | 6.2 MB | Fast | Good |
| YOLOv8s | Balanced | 22.5 MB | Medium | Better |
| YOLOv8m | High accuracy | 52.0 MB | Slower | High |
| YOLOv8l | Best accuracy | 87.3 MB | Slowest | Highest |

**Recommended:** YOLOv8s for real-time, YOLOv8m for post-match analysis.

### 9.2 Custom Training Data

Two separate YOLO models are trained:

**Player Detection Model:**
- Classes: 1 (player)
- Input: 640x640
- Training data: 2000+ annotated volleyball player frames
- Augmentations: mosaic, mixup, HSV jitter, horizontal flip, scale

**Ball Detection Model:**
- Classes: 1 (ball)
- Input: 640x640
- Training data: 3000+ annotated volleyball ball frames
- Augmentations: same as player + copy-paste for small objects
- Special handling: ball is small, needs higher resolution input or tiling

### 9.3 YOLO Detection Config

```python
# ai/detection/player_detector.py

from ultralytics import YOLO

class PlayerDetector:
    def __init__(self, model_path: str, confidence: float = 0.5, device: str = "auto"):
        self.model = YOLO(model_path)
        self.confidence = confidence
        self.device = device

    def detect(self, frame: np.ndarray) -> List[Detection]:
        results = self.model.predict(
            source=frame,
            conf=self.confidence,
            iou=0.45,
            device=self.device,
            verbose=False
        )
        detections = []
        for result in results:
            for box in result.boxes:
                detections.append(Detection(
                    bbox=box.xyxy[0].cpu().numpy(),
                    confidence=float(box.conf[0]),
                    class_id=int(box.cls[0])
                ))
        return detections
```

### 9.4 YOLO Fine-tuning Process

1. Collect 2000+ frames from volleyball matches
2. Annotate using Roboflow or Label Studio (YOLO format)
3. Split into train (80%) / val (15%) / test (5%)
4. Fine-tune YOLOv8s for 100 epochs with:
   - Learning rate: 0.01 (initial), cosine annealing
   - Batch size: 16
   - Image size: 640
   - Augmentation:mosaic=1.0, mixup=0.1, hsv_h=0.015, hsv_s=0.7, hsv_v=0.4
5. Export best model to .pt format

---

## 10. ByteTrack Integration

### 10.1 Why ByteTrack

ByteTrack is chosen over DeepSORT and BoT-SORT for:
- Better handling of low-confidence detections (uses all detections)
- Higher MOTA (Multiple Object Tracking Accuracy) scores
- Better performance with fast-moving objects (volleyball)
- Lower computational overhead

### 10.2 ByteTrack Parameters

```python
# ai/tracking/tracker_config.py

BYTETRACK_CONFIG = {
    "track_thresh": 0.5,        # Detection confidence threshold
    "match_thresh": 0.8,        # Matching threshold for association
    "track_buffer": 30,         # Frames to keep lost track alive
    "min_hits": 3,              # Detections before track confirmed
    "frame_rate": 15,           # Expected frame rate
}
```

### 10.3 Tracking Pipeline

```
Per Frame:
  1. Receive detections from YOLO (high + low confidence)
  2. Separate into high-confidence (>= track_thresh) and low-confidence groups
  3. Predict new positions using Kalman filter for existing tracks
  4. First association: match high-confidence detections to tracks (IoU + ReID)
  5. Second association: match low-confidence detections to unmatched tracks
  6. Create new tracks for unmatched high-confidence detections
  7. Update matched tracks, increment lost counter for unmatched
  8. Remove tracks lost for > track_buffer frames
  9. Output: List of active tracks with IDs, bboxes, and states
```

### 10.4 Track States

| State | Description |
|-------|-------------|
| New | Track just created, needs `min_hits` confirmations |
| Tracked | Active, confirmed track |
| Lost | Not matched for 1+ frames but within buffer |
| Removed | Lost for > track_buffer frames, deleted |

### 10.5 Player Re-identification

When a player is occluded and re-appears:
1. ByteTrack maintains the Kalman filter prediction during occlusion
2. Upon re-detection, IoU matching reconnects the track
3. For long occlusions (>30 frames), appearance features (ReID) assist matching
4. Jersey color histogram serves as lightweight ReID feature

---

## 11. MediaPipe Integration

### 11.1 Pose Landmarks

MediaPipe Pose provides 33 body landmarks per detected player:

```
                    0 (nose)
                   / \
          11 (L_shoulder)   12 (R_shoulder)
            /                      \
     13 (L_elbow)            14 (R_elbow)
        /                          \
  15 (L_wrist)              16 (R_wrist)
                               |
                          17-22 (hands)

     23 (L_hip)              24 (R_hip)
        \                          /
     25 (L_knee)             26 (R_knee)
        /                          /
  27 (L_ankle)              28 (R_ankle)
```

### 11.2 Pose-Based Action Features

```python
@dataclass
class PoseFeatures:
    # Joint angles
    shoulder_angle: float      # L/R shoulder angle (blocking, serving)
    elbow_angle: float         # Arm extension (spike, set)
    hip_angle: float           # Squat depth (ready position)
    knee_angle: float          # Jump preparation

    # Body orientation
    torso_angle: float         # Forward lean
    shoulder_tilt: float       # Rotation for spike
    hip_tilt: float            # Body alignment

    # Arm positions
    arm_extension: float       # 0=compact, 1=full extension
    arm_height: float          # Relative to head

    # Key point positions (normalized to player bbox)
    head_y: float
    hand_y: float             # Above head = serving/spiking
    foot_y: float             # Ground contact

    # Velocity features
    hand_velocity: float      # Speed of hand movement
    body_velocity: float      # Speed of body movement
    vertical_velocity: float  # Upward/downward speed
```

### 11.3 Pose Estimation Config

```python
# ai/pose/pose_estimator.py

import mediapipe as mp

class PoseEstimator:
    def __init__(self, complexity: int = 2, min_confidence: float = 0.5):
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(
            static_image_mode=False,
            model_complexity=complexity,
            smooth_landmarks=True,
            min_detection_confidence=min_confidence,
            min_tracking_confidence=0.5
        )

    def estimate(self, frame: np.ndarray, bbox: np.ndarray) -> PoseResult:
        # Crop player from frame using bbox
        x1, y1, x2, y2 = bbox.astype(int)
        crop = frame[y1:y2, x1:x2]

        # Run MediaPipe
        results = self.pose.process(cv2.cvtColor(crop, cv2.COLOR_BGR2RGB))

        if results.pose_landmarks:
            return PoseResult(
                landmarks=results.pose_landmarks,
                features=self._extract_features(results.pose_landmarks),
                confidence=results.pose_landmarks.visibility
            )
        return None
```

### 11.4 Action Feature Mapping

| Action | Key Pose Features |
|--------|------------------|
| Serve | Arm above head, body extended, forward lean |
| Spike | Arm swing from back to front, jump (high body), wrist snap |
| Set | Both hands above forehead, elbows bent, body under ball |
| Block | Both arms raised, standing tall, hands above net height |
| Dig | Low body position, arms extended forward, lunging |
| Reception | Arms together, platform angle, stable base |
| Ready Position | Knees bent, weight on toes, arms forward |

---

## 12. OCR Module

### 12.1 Jersey Number Recognition Pipeline

```
Player Bounding Box (from YOLO)
        │
        ▼
Region of Interest (ROI) Extraction
- Focus on upper torso area (top 40% of bbox)
        │
        ▼
Preprocessing
- Convert to grayscale
- Apply adaptive thresholding
- Morphological operations (noise removal)
- Edge enhancement
        │
        ▼
OCR Engine (EasyOCR)
- Read digits from preprocessed image
- Filter for numeric-only results
        │
        ▼
Post-processing
- Validate range (0-99)
- Apply confidence threshold
- Temporal smoothing (majority vote over 10 frames)
        │
        ▼
Jersey Number (int)
```

### 12.2 OCR Configuration

```python
# ai/ocr/jersey_reader.py

class JerseyReader:
    def __init__(self, engine: str = "easyocr", min_confidence: float = 0.7):
        if engine == "easyocr":
            import easyocr
            self.reader = easyocr.Reader(['en'], gpu=True)
        self.min_confidence = min_confidence
        self.history: Dict[int, List[int]] = {}  # track_id -> recent reads

    def read_jersey(self, frame: np.ndarray, bbox: np.ndarray) -> Optional[int]:
        roi = self._extract_jersey_roi(frame, bbox)
        preprocessed = self._preprocess(roi)
        results = self.reader.readtext(preprocessed)

        for _, text, conf in results:
            if conf >= self.min_confidence and text.isdigit():
                number = int(text)
                if 0 <= number <= 99:
                    return number
        return None

    def smooth_reading(self, track_id: int, reading: Optional[int]) -> Optional[int]:
        """Temporal smoothing: majority vote over last 10 frames."""
        if track_id not in self.history:
            self.history[track_id] = []

        if reading is not None:
            self.history[track_id].append(reading)

        # Keep last 10 readings
        self.history[track_id] = self.history[track_id][-10:]

        if len(self.history[track_id]) >= 3:
            return max(set(self.history[track_id]), key=self.history[track_id].count)
        return reading
```

### 12.3 OCR Accuracy Targets

| Condition | Target Accuracy |
|-----------|----------------|
| Clear view, good lighting | >= 95% |
| Partial occlusion | >= 80% |
| Fast movement / blur | >= 70% |
| Overall average | >= 85% |

---

## 13. Event Recognition Module

### 13.1 Action Recognition Approach

The system uses a **hybrid approach** combining rule-based detection with deep learning classification:

**Phase 1: Rule-Based Detection (Immediate)**
- Simple actions detected from single-frame or short-window rules
- Ball trajectory analysis for serve direction
- Player-ball proximity for contact detection
- Net proximity for net touch detection

**Phase 2: Deep Learning Classification (Sequence-based)**
- LSTM/Transformer model processes 30-frame sequences
- Input: pose features + ball trajectory + player positions
- Output: action class probabilities

### 13.2 Action Classification Table

| Action | Detection Method | Key Indicators |
|--------|-----------------|----------------|
| **Serve** | Rules + DL | Player behind back line, ball toss, arm swing |
| **Serve Ace** | Rules | Serve -> ball lands in court, no return |
| **Service Error** | Rules | Serve -> ball hits net/out of bounds |
| **Reception** | DL | Player receives serve, ball changes direction |
| **Set** | DL | Player contacts ball with fingertips above head |
| **Spike** | DL | Jump + overhead arm swing + forceful ball contact |
| **Kill** | Rules | Spike -> ball lands in opponent court |
| **Attack Error** | Rules | Spike -> ball out of bounds or into net |
| **Blocked Attack** | Rules | Spike -> ball returned by opponent block |
| **Dig** | DL | Low defensive save of hard-driven ball |
| **Free Ball** | DL | Easy underhand ball over net |
| **Block** | DL + Rules | Jump at net, arms extended over net |
| **Solo Block** | Rules | Block -> single player, point scored |
| **Block Assist** | Rules | Block -> two players involved |
| **Net Touch** | Rules | Player body/hand touches net |
| **Rotation Fault** | Rules | Wrong player positions at serve |

### 13.3 Action Recognition Rules Engine

```python
# ai/action_recognition/action_rules.py

class ActionRulesEngine:
    def __init__(self, court_config: dict):
        self.court = court_config

    def detect_serve(self, frame_data: PipelineFrameData) -> Optional[DetectedAction]:
        # Check: player behind back line
        # Check: ball trajectory from server position
        # Check: arm swing pose
        pass

    def detect_kill(self, frame_data: PipelineFrameData, previous_events: List) -> Optional[DetectedAction]:
        # Check: recent spike event from same team
        # Check: ball landed in opponent court
        # Check: no successful block/dig
        pass

    def detect_net_touch(self, frame_data: PipelineFrameData) -> Optional[DetectedAction]:
        # Check: player bbox intersects net line
        # Check: pose shows hand near net
        pass

    def detect_rotation_fault(self, frame_data: PipelineFrameData, serving_team: int) -> Optional[DetectedAction]:
        # Check: player positions at serve time
        # Verify rotation order (1-6 clockwise)
        pass
```

### 13.4 LSTM Action Model Architecture

```
Input Features (per frame):
  - 33 pose landmarks x 3 (x, y, z) = 99
  - Player court position (x, y) = 2
  - Ball position relative to player (x, y, z) = 3
  - Ball speed = 1
  - Player speed = 1
  Total per frame: 106 features

Sequence Length: 30 frames (~2 seconds at 15 FPS)

Model Architecture:
  Input (30, 106)
      │
      ▼
  LSTM(106, 128, bidirectional=True, num_layers=2)
      │
      ▼
  BatchNorm1d(256)
      │
      ▼
  Dropout(0.3)
      │
      ▼
  LSTM(256, 64, num_layers=1)
      │
      ▼
  BatchNorm1d(64)
      │
      ▼
  Dropout(0.3)
      │
      ▼
  Linear(64, 32)
      │
      ▼
  ReLU
      │
      ▼
  Linear(32, NUM_CLASSES)  # 16 action classes
      │
      ▼
  Softmax
```

### 13.5 Action Sequence Window

```
Timeline:
  ──────────────────────────────────────────────────▶
  |  Frame 1  ...  Frame 15  ...  Frame 30  |
  |                                           |
  |   └──── 2-second analysis window ────┘    |
  |                                           |
  Output: action class at Frame 30

  Window slides forward by 5 frames (overlap = 25 frames)
  Rate: ~3 action predictions per second
```

---

## 14. Automatic Statistics Engine

### 14.1 Statistics Computation Flow

```
Point Events (from Action Recognition)
        │
        ▼
┌─────────────────────────────┐
│ Per-Match Statistics         │
│ (Computed after each event)  │
│                              │
│ - Update player stat record  │
│ - Update team stat record    │
│ - Update set score           │
│ - Update cumulative totals   │
└──────────────┬──────────────┘
        │
        ▼
┌─────────────────────────────┐
│ Match Completion Processing  │
│ (When match ends)            │
│                              │
│ - Finalize all statistics    │
│ - Generate match report      │
│ - Update season aggregates   │
│ - Compute advanced metrics   │
└─────────────────────────────┘
```

### 14.2 Standard Volleyball Statistics

**Serving Statistics:**
| Stat | Formula |
|------|---------|
| Total Serves | Count of serve events |
| Aces | Serves that directly score (serve_ace) |
| Errors | Serves into net or out (service_error) |
| Serve % | (Total Serves - Errors) / Total Serves * 100 |
| Ace % | Aces / Total Serves * 100 |

**Attacking Statistics:**
| Stat | Formula |
|------|---------|
| Attack Attempts | Total spike/attack events |
| Kills | Successful attacks landing in court |
| Errors | Attacks into net or out |
| Blocked | Attacks returned by opponent block |
| Kill % | Kills / Attack Attempts * 100 |
| Kill Efficiency | (Kills - Errors - Blocked) / Attack Attempts * 100 |

**Blocking Statistics:**
| Stat | Formula |
|------|---------|
| Solo Blocks | Blocks by single player scoring point |
| Block Assists | Blocks involving 2 players |
| Total Blocks | Solo + Block Assists |
| Block Errors | Net touch or violation during block |

**Receiving/Defense Statistics:**
| Stat | Formula |
|------|---------|
| Reception Attempts | Total serve receive attempts |
| Perfect Passes | High-quality receptions (3-point scale) |
| Errors | Shanked or ace received |
| Reception % | (Attempts - Errors) / Attempts * 100 |
| Digs | Successful defensive saves |
| Free Balls | Easy balls sent over net |

**Setting Statistics:**
| Stat | Formula |
|------|---------|
| Assist Attempts | Total sets attempted |
| Assists | Sets leading to kills |
| Errors | Setting violations or poor sets |
| Assist % | Assists / Assist Attempts * 100 |

### 14.3 Advanced Metrics

| Metric | Description | Calculation |
|--------|-------------|-------------|
| Side-out % | % of serve receive points won | Side-out points / Reception attempts * 100 |
| Break points | Points scored while serving | Serve points (aces + opponent errors) |
| Point efficiency | Points scored per opportunity | Total points / Total opportunities * 100 |
| Ball handling | Setting precision rating | Assists / (Assists + Errors) * 100 |
| True hitting % | Actual attack efficiency | (Kills - Errors - Blocked) / Attempts |
| Ranking score | Composite performance score | Weighted average of all statistics |

### 14.4 Statistics Storage

Statistics are stored at three levels:

1. **Real-time:** Updated in-memory during processing, flushed to DB every 30 seconds
2. **Per-Match:** Finalized statistics saved when match completes
3. **Career/Cumulative:** Aggregated across all matches, updated after each match

---

## 15. Heat Maps

### 15.1 Heat Map Generation

```
Court Grid: 12 columns x 6 rows = 72 cells
Each cell: 1.5m x 1.5m (on 18m x 9m court)

For each frame:
  1. Get player's normalized court position (x, y)
  2. Map to grid cell (col, row)
  3. Increment cell counter

Heat Map = 2D array of visit counts
Visualization: colormap (blue -> green -> yellow -> red)
```

### 15.2 Heat Map Types

| Type | Description | Grid |
|------|-------------|------|
| Position Heat Map | Where player stood | 12x6 full court |
| Action Heat Map | Where player performed actions | 12x6 full court |
| Attack Heat Map | Attack landing positions | 6x3 opponent court |
| Defense Heat Map | Defensive positions | 6x3 own court |

### 15.3 Heat Map Data Format

```json
{
  "player_id": 7,
  "match_id": 101,
  "set_id": null,
  "type": "position",
  "grid": [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  "total_events": 2847
}
```

---

## 16. Distance Tracking

### 16.1 Distance Calculation

```
Per Frame:
  1. Get player's court position in meters (using homography)
  2. Calculate displacement from previous frame:
     distance = sqrt((x2-x1)^2 + (y2-y1)^2)
  3. Apply Kalman filter to smooth trajectory
  4. Accumulate total distance

Per Match:
  Total Distance = Sum of all frame-to-frame displacements
```

### 16.2 Speed Calculation

```
Instantaneous Speed:
  speed = displacement_meters / (1 / fps)
  speed_kmh = speed * 3.6

Average Speed:
  avg_speed = total_distance / playing_time

Max Speed:
  Rolling window (1-second) maximum of instantaneous speeds
```

### 16.3 Distance Categories

| Category | Speed Range (km/h) | Description |
|----------|-------------------|-------------|
| Standing | 0 - 0.5 | Player stationary |
| Walking | 0.5 - 3.0 | Slow movement |
| Jogging | 3.0 - 6.0 | Moderate movement |
| Running | 6.0 - 10.0 | Fast movement |
| Sprinting | 10.0+ | Maximum effort |

---

## 17. Jump Estimation

### 17.1 Jump Detection Algorithm

```
Per Frame (per player):
  1. Get body keypoint positions (ankles, hips)
  2. Calculate vertical velocity of hip center
  3. Detect jump phases:

  Pre-jump:  Vertical velocity > threshold upward
  Takeoff:   Foot keypoints lose ground contact
  Flight:    Body elevated, both feet off ground
  Landing:   Foot keypoints regain ground contact

  Jump Event:
    - Count increment
    - Flight time = landing_time - takeoff_time
    - Jump height = 0.5 * g * (flight_time/2)^2
      (using free-fall physics: h = 1/2 * g * t^2)
```

### 17.2 Jump Height Estimation

```python
GRAVITY = 9.81  # m/s^2

def estimate_jump_height(flight_time_seconds: float) -> float:
    """Estimate jump height from flight time using free-fall physics."""
    # Time from takeoff to peak = flight_time / 2
    time_to_peak = flight_time_seconds / 2.0
    # Height = 0.5 * g * t^2
    height = 0.5 * GRAVITY * (time_to_peak ** 2)
    return height * 100  # Convert to centimeters
```

### 17.3 Jump Statistics Per Player Per Match

| Metric | Description |
|--------|-------------|
| Total Jumps | Count of all jumps |
| Attack Jumps | Jumps during spikes |
| Block Jumps | Jumps during blocks |
| Serve Jumps | Jump serves |
| Max Jump Height | Highest jump in match |
| Avg Jump Height | Mean of all jump heights |
| Avg Attack Jump | Mean of attack jump heights |
| Jump Fatigue Index | Decrease in jump height over match duration |

---

## 18. Dashboard Design

### 18.1 Dashboard Layout

```
+----------------------------------------------------------+
|  LOGO   NAV: Dashboard | Teams | Players | Matches | ... |
+----------------------------------------------------------+
|                                                          |
|  +------------------+  +------------------+              |
|  | Match Summary    |  | Live Feed        |              |
|  | Card (recent)    |  | (if live)        |              |
|  +------------------+  +------------------+              |
|                                                          |
|  +------------------+  +------------------+              |
|  | Top Players      |  | Quick Stats      |              |
|  | Table            |  | Charts           |              |
|  +------------------+  +------------------+              |
|                                                          |
|  +--------------------------------------------------+    |
|  | Upcoming / Recent Matches (horizontal scroll)   |    |
|  +--------------------------------------------------+    |
|                                                          |
+----------------------------------------------------------+
```

### 18.2 Dashboard Pages

| Page | Description | Key Components |
|------|-------------|----------------|
| Dashboard (Home) | Overview of all activity | Summary cards, recent matches, top players |
| Teams | List of teams | Team cards, search, filters |
| Team Detail | Single team view | Roster, match history, team stats |
| Players | All players | Player cards, search, position filter |
| Player Detail | Single player | Stats, heat map, performance trends |
| Matches | All matches | Match list, status filters, date range |
| Match Detail | Single match | Scoreboard, event log, player stats |
| Live Match | Real-time processing | Live scoreboard, event feed, video |
| Reports | Generated reports | Report list, generate new, download |
| Settings | System configuration | Profile, preferences |

### 18.3 Key Dashboard Components

**Match Card:**
```
+----------------------------------+
| Thunder Hawks  3  vs  1  Storm   |
| Date: Jul 20, 2026 | Arena      |
| Status: Completed | Type: League |
| [View Details]                   |
+----------------------------------+
```

**Player Stats Card:**
```
+----------------------------------+
| #7  John Smith                   |
| Outside Hitter | Thunder Hawks   |
|                                  |
| Kills: 15  |  Blocks: 3         |
| Aces: 2   |  Digs: 8            |
| [View Profile]                   |
+----------------------------------+
```

---

## 19. Admin Panel

### 19.1 Admin Features

| Feature | Description |
|---------|-------------|
| User Management | Create, edit, deactivate users; assign roles |
| Team Management | CRUD for teams with logo upload |
| Player Management | CRUD for players with jersey assignment |
| Match Management | Create matches, link videos, set status |
| System Statistics | Processing stats, storage usage, active streams |
| Database Backup | Trigger manual backups, view backup history |
| System Settings | Pipeline config, detection thresholds |
| Audit Log | Track all admin actions |

### 19.2 Admin Routes

```
/admin
├── /admin/users          -> User management table
├── /admin/users/:id      -> User edit form
├── /admin/teams          -> Team management
├── /admin/players        -> Player management
├── /admin/matches        -> Match management
├── /admin/videos         -> Video management
├── /admin/system         -> System dashboard
└── /admin/settings       -> Configuration panel
```

---

## 20. Coach Dashboard

### 20.1 Coach-Specific Views

| View | Description |
|------|-------------|
| Team Overview | Quick stats for all team players |
| Match Analysis | Deep dive into a specific match |
| Player Comparison | Side-by-side player stat comparison |
| Heat Map Viewer | Interactive heat map with filtering |
| Performance Trends | Charts showing player improvement over time |
| Opposition Analysis | Stats from matches against specific opponents |
| Report Generator | Create custom reports for team meetings |

### 20.2 Match Analysis View

```
+----------------------------------------------------------+
| Match: Thunder Hawks vs Storm Riders | Jul 20, 2026      |
+----------------------------------------------------------+
|                                                          |
| Score: [3-1] Sets                                        |
|                                                          |
| +--------+  +--------+  +--------+  +--------+          |
| | Set 1  |  | Set 2  |  | Set 3  |  | Set 4  |          |
| | 25-21  |  | 23-25  |  | 25-19  |  | 25-22  |          |
| +--------+  +--------+  +--------+  +--------+          |
|                                                          |
| [Player Stats] [Team Comparison] [Heat Maps] [Events]   |
|                                                          |
| +--------------------------------------------------+    |
| | Kill Distribution (bar chart)                    |    |
| | Smith: ████████████ 15                           |    |
| | Jones: ████████ 10                               |    |
| | Brown: ██████ 7                                  |    |
| +--------------------------------------------------+    |
+----------------------------------------------------------+
```

---

## 21. Authentication

### 21.1 JWT Token Flow

```
Client                          Server
  │                               │
  │  POST /auth/login             │
  │  {username, password}         │
  │──────────────────────────────▶│
  │                               │  Validate credentials
  │                               │  Generate access token (24h)
  │                               │  Generate refresh token (7d)
  │  {access_token,               │
  │   refresh_token, user}        │
  │◀──────────────────────────────│
  │                               │
  │  GET /api/teams               │
  │  Authorization: Bearer <JWT>  │
  │──────────────────────────────▶│
  │                               │  Validate JWT
  │                               │  Check role permissions
  │  {data}                       │
  │◀──────────────────────────────│
  │                               │
  │  POST /auth/refresh           │
  │  {refresh_token}              │
  │──────────────────────────────▶│
  │                               │  Validate refresh token
  │  {access_token}               │  Generate new access token
  │◀──────────────────────────────│
```

### 21.2 Role Permissions Matrix

| Endpoint Category | Admin | Coach | Analyst | Viewer |
|-------------------|-------|-------|---------|--------|
| Auth (own profile) | Yes | Yes | Yes | Yes |
| Teams (read) | Yes | Yes | Yes | Yes |
| Teams (write) | Yes | Yes | No | No |
| Players (read) | Yes | Yes | Yes | Yes |
| Players (write) | Yes | Yes | No | No |
| Matches (read) | Yes | Yes | Yes | Yes |
| Matches (write) | Yes | Yes | No | No |
| Videos (read) | Yes | Yes | Yes | Yes |
| Videos (upload) | Yes | Yes | No | No |
| Videos (process) | Yes | Yes | No | No |
| Statistics (read) | Yes | Yes | Yes | Yes |
| Reports (read) | Yes | Yes | Yes | Yes |
| Reports (generate) | Yes | Yes | Yes | No |
| Admin panel | Yes | No | No | No |
| System settings | Yes | No | No | No |
| User management | Yes | No | No | No |

### 21.3 Password Security

```python
import bcrypt

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
```

---

## 22. Match Management

### 22.1 Match Lifecycle

```
Scheduled ──▶ Live ──▶ Completed
    │            │
    │            └──▶ Cancelled
    │
    └──▶ Cancelled
```

### 22.2 Set Scoring Rules

- Standard rally scoring to 25 points (win by 2)
- Tie-break set (5th set) to 15 points (win by 2)
- Sets 1-4: Cap at 25, must win by 2
- Point awarded on every rally regardless of serve

### 22.3 Match Processing States

| State | Description | Actions |
|-------|-------------|---------|
| pending | Match created, not started | Can edit, delete |
| processing | Video being analyzed | View live stats |
| completed | Processing finished | View full stats, reports |
| failed | Processing error occurred | Retry processing |

---

## 23. Team Management

### 23.1 Team Data Model

| Field | Type | Description |
|-------|------|-------------|
| name | String | Full team name |
| short_name | String (max 10) | Abbreviation |
| logo_url | URL | Team logo |
| league | String | League affiliation |
| country | String | Country |
| coach_name | String | Head coach |
| roster | Player[] | List of players (max 14) |

### 23.2 Team Roster Rules

- Maximum 14 players per team
- Maximum 6 players on court at once
- Libero cannot serve (standard rule)
- Jersey numbers must be unique within team
- Each player must have assigned position

---

## 24. Player Management

### 24.1 Player Data Model

| Field | Type | Description |
|-------|------|-------------|
| first_name | String | First name |
| last_name | String | Last name |
| jersey_number | Integer (0-99) | Unique within team |
| position | Enum | Playing position |
| team_id | FK | Team affiliation |
| height_cm | Integer | Height in centimeters |
| weight_kg | Integer | Weight in kilograms |
| date_of_birth | Date | Birth date |
| jersey_color | String | Hex color for CV identification |
| is_active | Boolean | Active roster status |

### 24.2 Position Definitions

| Position | Abbreviation | Court Zones | Primary Role |
|----------|-------------|-------------|--------------|
| Outside Hitter | OH | Zone 4 (front), Zone 5 (back) | Attack from left, receive |
| Opposite | OPP | Zone 2 (front), Zone 1 (back) | Attack from right |
| Setter | S | Zone 3 (front), Zone 6 (back) | Set plays |
| Middle Blocker | MB | Zone 3 (front), Zone 6 (back) | Block, quick attack |
| Libero | L | Back row only | Defense, receive |
| Defensive Specialist | DS | Back row only | Defense |

---

## 25. Training Pipeline

### 25.1 Training Stages

```
1. Data Collection
   - Record volleyball matches (various quality levels)
   - Extract frames at 15 FPS
   - Minimum 50 matches for robust training

2. Data Annotation
   - YOLO format for player/ball detection
   - Custom format for action labels
   - Pose keypoints (auto-generated by MediaPipe)

3. Model Training
   ├── YOLO Fine-tuning (detection)
   ├── Action Model Training (LSTM/Transformer)
   └── OCR Training (jersey numbers)

4. Model Evaluation
   - mAP for detection models
   - Accuracy/F1 for action recognition
   - Character accuracy for OCR

5. Model Export
   - Export to deployment format
   - Optimize for inference speed
```

### 25.2 Training Configurations

**YOLO Fine-tuning:**
```yaml
epochs: 100
batch_size: 16
img_size: 640
learning_rate: 0.01
optimizer: SGD
scheduler: cosine
augmentations:
  mosaic: 1.0
  mixup: 0.1
  hsv_h: 0.015
  hsv_s: 0.7
  hsv_v: 0.4
  flipud: 0.0
  fliplr: 0.5
  scale: 0.5
```

**Action Model Training:**
```yaml
epochs: 50
batch_size: 32
sequence_length: 30
learning_rate: 0.001
optimizer: Adam
scheduler: ReduceLROnPlateau
loss: CrossEntropyLoss
class_weights: balanced
early_stopping_patience: 10
```

---

## 26. Dataset Organization

### 26.1 Directory Structure

```
datasets/
├── raw/
│   ├── match_001/
│   │   ├── video.mp4
│   │   └── metadata.json
│   ├── match_002/
│   │   ├── video.mp4
│   │   └── metadata.json
│   └── ...
│
├── processed/
│   ├── detection/
│   │   ├── players/
│   │   │   ├── frame_0001.jpg
│   │   │   ├── frame_0002.jpg
│   │   │   └── ...
│   │   └── ball/
│   │       ├── frame_0001.jpg
│   │       └── ...
│   │
│   ├── action_sequences/
│   │   ├── sequence_0001/
│   │   │   ├── frame_01.jpg
│   │   │   ├── frame_02.jpg
│   │   │   ├── ... (30 frames)
│   │   │   └── label.json
│   │   └── ...
│   │
│   └── jersey_numbers/
│       ├── cropped_images/
│       └── labels.csv
│
├── annotations/
│   ├── detection/
│   │   ├── players/
│   │   │   ├── frame_0001.txt  (YOLO format)
│   │   │   └── ...
│   │   └── ball/
│   │       ├── frame_0001.txt
│   │       └── ...
│   │
│   ├── actions/
│   │   ├── actions.csv
│   │   │   # sequence_id, label, player_id, confidence
│   │   └── action_classes.json
│   │
│   └── jersey/
│       └── labels.csv
│
├── splits/
│   ├── detection_train.txt
│   ├── detection_val.txt
│   ├── detection_test.txt
│   ├── action_train.txt
│   ├── action_val.txt
│   └── action_test.txt
│
└── stats/
    ├── class_distribution.json
    ├── total_frames.json
    └── dataset_info.json
```

### 26.2 Annotation Formats

**YOLO Detection Format:**
```
# class_id center_x center_y width height (normalized 0-1)
0 0.512 0.435 0.089 0.234
0 0.723 0.428 0.091 0.241
1 0.650 0.312 0.021 0.021  # ball
```

**Action Label Format:**
```json
{
  "sequence_id": "seq_0001",
  "match_id": "match_001",
  "frames": ["frame_001.jpg", "...", "frame_030.jpg"],
  "player_id": 7,
  "action": "spike",
  "outcome": "kill",
  "court_position": [0.75, 0.25],
  "annotator": "analyst_1",
  "confidence": "high"
}
```

---

## 27. Model Evaluation

### 27.1 Detection Model Metrics

| Metric | Target | Description |
|--------|--------|-------------|
| mAP@0.5 | >= 0.85 | Mean Average Precision at IoU 0.5 |
| mAP@0.5:0.95 | >= 0.70 | Mean AP across IoU thresholds |
| Precision | >= 0.80 | True positives / predicted positives |
| Recall | >= 0.85 | True positives / actual positives |
| FPS (inference) | >= 30 | Inference speed on GPU |

### 27.2 Action Recognition Metrics

| Metric | Target | Description |
|--------|--------|-------------|
| Accuracy | >= 0.80 | Overall classification accuracy |
| F1 Score (macro) | >= 0.75 | Average F1 across classes |
| F1 Score (per class) | >= 0.70 | F1 for each action class |
| Confusion Matrix | - | Analyze misclassification patterns |

### 27.3 OCR Metrics

| Metric | Target | Description |
|--------|--------|-------------|
| Character Accuracy | >= 0.90 | Correct characters / total characters |
| Full Number Accuracy | >= 0.85 | Correctly read full jersey numbers |
| Processing Speed | >= 50ms | Per-player OCR inference time |

### 27.4 Evaluation Scripts

```bash
# Run detection evaluation
python ai/training/evaluate.py --model detection --data datasets/splits/ --metrics mAP

# Run action model evaluation
python ai/training/evaluate.py --model action --data datasets/splits/ --metrics accuracy,f1

# Run OCR evaluation
python ai/training/evaluate.py --model ocr --data datasets/processed/jersey_numbers/
```

---

## 28. Deployment

### 28.1 Deployment Architecture

```
                    +------------------+
                    |     Nginx        |
                    |   (Reverse Proxy)|
                    +--------+---------+
                             |
              +--------------+--------------+
              |                             |
    +---------v---------+     +------------v-----------+
    |  Backend (Flask)   |     |  Frontend (React)      |
    |  Port: 5000        |     |  Port: 3000            |
    +---------+---------+     +------------------------+
              |
    +---------v---------+
    |  AI Processor      |
    |  (Celery Worker)   |
    |  Port: N/A         |
    +---------+---------+
              |
    +---------v---------+     +------------------------+
    |  MySQL Database    |     |  Redis (Cache)         |
    |  Port: 3306        |     |  Port: 6379            |
    +-------------------+     +------------------------+
```

### 28.2 Server Requirements

**Minimum (Development):**
| Resource | Specification |
|----------|---------------|
| CPU | 4 cores |
| RAM | 8 GB |
| Storage | 50 GB SSD |
| GPU | Optional (NVIDIA GTX 1660+) |
| OS | Ubuntu 20.04+ / Windows 10+ |

**Recommended (Production):**
| Resource | Specification |
|----------|---------------|
| CPU | 8+ cores |
| RAM | 16+ GB |
| Storage | 200+ GB SSD |
| GPU | NVIDIA RTX 3060+ (CUDA 11.8) |
| OS | Ubuntu 22.04 LTS |
| Network | 100+ Mbps |

### 28.3 Environment Variables

```bash
# .env.example

# Flask
FLASK_ENV=production
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-here

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=volleyball_ai
DB_USER=volleyball_user
DB_PASSWORD=secure_password_here

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# AI Pipeline
AI_DEVICE=auto
YOLO_PLAYER_MODEL=models/detection/player_yolov8_best.pt
YOLO_BALL_MODEL=models/detection/ball_yolov8_best.pt
ACTION_MODEL=models/action_recognition/action_lstm_best.pt

# Video Processing
UPLOAD_FOLDER=videos/uploads
MAX_UPLOAD_SIZE_MB=2048

# API
API_RATE_LIMIT=100/hour
CORS_ORIGINS=http://localhost:3000
```

---

## 29. Testing

### 29.1 Testing Strategy

| Test Type | Framework | Coverage Target | Scope |
|-----------|-----------|-----------------|-------|
| Unit Tests | pytest | >= 80% | Services, utilities, models |
| Integration Tests | pytest | >= 70% | API endpoints, DB operations |
| E2E Tests | Cypress | Critical paths | Full user workflows |
| AI Model Tests | Custom | Per-model metrics | Detection, tracking, actions |
| Performance Tests | Locust | - | API load testing |

### 29.2 Backend Test Structure

```
backend/tests/
├── conftest.py                    # Fixtures: test client, test DB, test data
├── test_auth.py                   # Login, register, token refresh
├── test_teams.py                  # Team CRUD, permissions
├── test_players.py                # Player CRUD, team association
├── test_matches.py                # Match lifecycle, set scoring
├── test_videos.py                 # Upload, processing triggers
├── test_statistics.py             # Stats calculation accuracy
├── test_reports.py                # Report generation, download
├── test_api.py                    # API response format validation
└── test_permissions.py            # Role-based access control
```

### 29.3 AI Testing

```
ai/tests/
├── test_detection.py              # YOLO detection accuracy
├── test_tracking.py               # ByteTrack ID consistency
├── test_pose.py                   # Pose estimation accuracy
├── test_ocr.py                    # Jersey number reading
├── test_action_rules.py           # Rule-based action detection
├── test_action_model.py           # LSTM/Transformer accuracy
├── test_statistics_engine.py      # Stats calculation correctness
└── test_pipeline.py               # Full pipeline integration test
```

### 29.4 Test Commands

```bash
# Backend tests
cd backend && pytest tests/ -v --cov=app --cov-report=html

# AI tests
cd ai && pytest tests/ -v

# Frontend tests
cd frontend && npm test

# Full test suite
make test
```

---

## 30. Documentation

### 30.1 Documentation Files

| File | Description |
|------|-------------|
| README.md | Project overview, setup, usage |
| docs/SRS.md | This document (Software Requirements Specification) |
| docs/API.md | API reference with examples |
| docs/ARCHITECTURE.md | System architecture details |
| docs/DEPLOYMENT.md | Deployment guide |
| docs/USER_GUIDE.md | End-user manual |
| docs/DEVELOPER.md | Developer setup and contribution guide |

### 30.2 API Documentation

Flask-RESTX or Flask-Swagger will auto-generate OpenAPI docs at:
- `/api/v1/docs` - Swagger UI
- `/api/v1/openapi.json` - OpenAPI spec

---

## 31. Git Workflow

### 31.1 Branch Strategy

```
main (production-ready)
  │
  ├── develop (integration branch)
  │   ├── feature/phase-1-project-setup
  │   ├── feature/phase-2-backend-api
  │   ├── feature/phase-3-cv-engine
  │   ├── ...
  │   └── bugfix/fix-detection-confidence
  │
  ├── staging (pre-production testing)
  │
  └── release/v1.0.0 (tagged releases)
```

### 31.2 Commit Convention

```
<type>(<scope>): <description>

Types:
  feat     - New feature
  fix      - Bug fix
  docs     - Documentation
  style    - Code style (formatting, no logic change)
  refactor - Code refactoring
  test     - Adding tests
  chore    - Build, config, tooling
  perf     - Performance improvement

Examples:
  feat(detection): add YOLO player detection module
  fix(tracking): resolve ID switch during occlusion
  docs(api): add swagger annotations for match endpoints
  test(statistics): add kill percentage calculation tests
```

### 31.3 Branch Workflow

1. Create feature branch from `develop`
2. Make changes with atomic commits
3. Push and create Pull Request
4. Code review (self-review checklist)
5. Pass CI checks (lint, tests)
6. Merge to `develop`
7. Delete feature branch

---

## 32. Docker Support

### 32.1 Docker Compose Configuration

```yaml
# docker-compose.yml

version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "5000:5000"
    environment:
      - DB_HOST=mysql
      - DB_PORT=3306
      - REDIS_HOST=redis
      - FLASK_ENV=production
    volumes:
      - ./videos:/app/videos
      - ./models:/app/models
      - ./reports:/app/reports
    depends_on:
      - mysql
      - redis
    restart: unless-stopped

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
    restart: unless-stopped

  ai_worker:
    build:
      context: .
      dockerfile: Dockerfile.backend
    command: celery -A app.celery worker --loglevel=info --concurrency=2
    environment:
      - DB_HOST=mysql
      - REDIS_HOST=redis
      - AI_DEVICE=cuda:0
    volumes:
      - ./videos:/app/videos
      - ./models:/app/models
    depends_on:
      - mysql
      - redis
    deploy:
      resources:
        reservations:
          devices:
            - capabilities: [gpu]
    restart: unless-stopped

  mysql:
    image: mysql:8.0
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: volleyball_ai
      MYSQL_USER: volleyball_user
      MYSQL_PASSWORD: secure_password
    volumes:
      - mysql_data:/var/lib/mysql
      - ./backend/database/init.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - backend
      - frontend
    restart: unless-stopped

volumes:
  mysql_data:
  redis_data:
```

### 32.2 Backend Dockerfile

```dockerfile
# Dockerfile.backend

FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

EXPOSE 5000

CMD ["python", "main.py"]
```

### 32.3 Frontend Dockerfile

```dockerfile
# Dockerfile.frontend

FROM node:18-alpine as build

WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/frontend.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

### 32.4 Docker Commands

```bash
# Start all services
docker-compose up -d

# Start with GPU support
docker-compose --profile gpu up -d

# View logs
docker-compose logs -f backend

# Run database migrations
docker-compose exec backend flask db upgrade

# Seed database
docker-compose exec backend python database/seed.py

# Stop all services
docker-compose down

# Rebuild after changes
docker-compose up -d --build
```

---

## 33. Future Enhancements

### 33.1 Phase 2 Features

| Feature | Description |
|---------|-------------|
| Multi-camera fusion | Combine multiple camera angles for better tracking |
| Real-time WebSocket streaming | Live event push to dashboard |
| Mobile responsive design | Full mobile support for coach viewing |
| Video highlight generation | Auto-clip key moments from matches |
| Team formation analysis | Detect and analyze team formations |
| Fatigue detection | Monitor player fatigue through movement patterns |

### 33.2 Phase 3 Features

| Feature | Description |
|---------|-------------|
| Multi-sport support | Extend to basketball, soccer, etc. |
| AI-powered coaching suggestions | Recommend plays based on opponent analysis |
| Player recruitment analytics | Compare players across leagues |
| Historical trend analysis | Multi-season performance tracking |
| Cloud deployment | AWS/GCP hosted SaaS offering |
| API for third-party integration | Public API for external tools |

### 33.3 Advanced Analytics

| Feature | Description |
|---------|-------------|
| Win probability model | ML model predicting match outcome in real-time |
| Optimal lineup suggestions | Data-driven player positioning |
| Serve direction prediction | Predict opponent serve patterns |
| Attack efficiency by rotation | Stats breakdown by team rotation |
| Rally analysis | Detailed breakdown of long rallies |

---

**END OF SRS DOCUMENT**

*This document serves as the complete Software Requirements Specification and Master Development Blueprint for the AI-Based Real-Time Volleyball Player Performance Analysis System.*
