# VOLUME 1: MASTER BLUEPRINT & SOFTWARE REQUIREMENTS SPECIFICATION (SRS)

---

**Project:** AI-Based Real-Time Volleyball Player Performance Analysis and Statistics Management System Using Computer Vision

**Version:** 1.0  
**Date:** July 15, 2026  
**Classification:** Final-Year Project Engineering Specification  
**Status:** Active Development

---

## TABLE OF CONTENTS — VOLUME 1

1. [Project Overview](#chapter-1-project-overview)
2. [System Architecture](#chapter-2-system-architecture)
3. [Functional Requirements](#chapter-3-functional-requirements)
4. [Non-Functional Requirements](#chapter-4-non-functional-requirements)
5. [Use Case Analysis](#chapter-5-use-case-analysis)
6. [Database Architecture & Entity Relationship Design (ERD)](#chapter-6-database-architecture--entity-relationship-design-erd)
7. [Production System Architecture](#chapter-7-production-system-architecture)
8. [AI & MLOps Architecture](#chapter-8-ai--mlops-architecture)
9. [Volleyball Domain Engine](#chapter-9-volleyball-domain-engine)
10. [Video Intelligence Pipeline (VIP)](#chapter-10-video-intelligence-pipeline-vip)
11. [Data Engineering & Event Processing Architecture](#chapter-11-data-engineering--event-processing-architecture)
12. [Frontend Architecture & User Experience (UX)](#chapter-12-frontend-architecture--user-experience-ux)
13. [API Architecture & Integration Specification](#chapter-13-api-architecture--integration-specification)
14. [DevOps, Infrastructure & Cloud Deployment Architecture](#chapter-14-devops-infrastructure--cloud-deployment-architecture)
15. [Architecture Summary & Implementation Roadmap](#chapter-15-architecture-summary--implementation-roadmap)

---

# CHAPTER 1: PROJECT OVERVIEW

## 1.1 Project Title

**AI-Based Real-Time Volleyball Player Performance Analysis and Statistics Management System Using Computer Vision**

---

## 1.2 Project Description

The AI-Based Real-Time Volleyball Player Performance Analysis and Statistics Management System is an intelligent sports analytics platform that uses Computer Vision and Artificial Intelligence to automatically observe a volleyball match through one or more cameras, detect players and the ball, recognize volleyball actions, generate player and team statistics in real time, and present insights through a modern web dashboard.

Unlike traditional volleyball statistics systems that rely on manual input by statisticians, this system performs automatic analysis directly from live video streams. It continuously tracks players and the ball, recognizes game events, updates statistics, and generates comprehensive reports without human intervention.

The project is intended for schools, universities, volleyball clubs, coaches, analysts, and sports organizations seeking an affordable alternative to commercial analytics systems.

---

## 1.3 Problem Statement

Traditional volleyball statistics are usually collected manually by trained statisticians. This approach has several limitations:

- **Human errors** during data entry reduce data reliability.
- **High operational costs** due to the need for dedicated statisticians at every match.
- **Delayed availability** of match statistics, often hours or days after the match.
- **Inconsistent analysis** across different observers and statistical standards.
- **Limited access** for schools and amateur clubs that cannot afford commercial sports analytics platforms such as VolleyMetrics or Hudl.

This project addresses these limitations by developing an AI-powered system capable of automatically generating match statistics using computer vision techniques, thereby eliminating the need for manual data entry entirely.

---

## 1.4 Aim

To develop an AI-powered volleyball analytics platform that automatically detects volleyball events and generates player performance statistics in real time using ordinary video cameras.

---

## 1.5 Main Objectives

### Objective 1 — Video Capture

Capture live video from:

- Webcam
- Mobile phone camera
- IP Camera
- Recorded video files (MP4, AVI, MKV)

### Objective 2 — Automatic Detection

Automatically detect:

- Volleyball court boundaries
- All players on court
- The volleyball
- The net

### Objective 3 — Player Identification

Automatically identify every player by:

- Jersey number (via OCR)
- Team affiliation (via jersey color)
- Playing position
- Unique tracking ID

### Objective 4 — Player Tracking

Track every player continuously throughout the match, maintaining identity across occlusions and fast movements.

### Objective 5 — Ball Tracking

Track the volleyball throughout every rally, including position, speed, direction, and trajectory.

### Objective 6 — Action Recognition

Recognize volleyball actions including:

| Action | Category |
|--------|----------|
| Serve | Serving |
| Serve Ace | Serving |
| Service Error | Serving |
| Reception | Receiving |
| Set | Setting |
| Spike | Attacking |
| Kill | Attacking |
| Attack Error | Attacking |
| Blocked Attack | Attacking |
| Block | Blocking |
| Solo Block | Blocking |
| Block Assist | Blocking |
| Dig | Defense |
| Free Ball | Defense |
| Net Touch | Violation |
| Rotation Fault | Violation |

### Objective 7 — Automatic Statistics

Automatically update statistics without manual input as events are detected.

### Objective 8 — Centralized Database

Store all statistics in a centralized database for retrieval, analysis, and reporting.

### Objective 9 — Live Dashboard

Display live dashboards showing real-time match statistics, scores, and event feeds.

### Objective 10 — Report Generation

Generate comprehensive reports after every match, including player reports, team reports, and match summaries.

---

## 1.6 Research Objectives

The research component of the project includes:

1. **Evaluating AI-based volleyball event recognition accuracy** against manually labeled ground truth.
2. **Comparing automated statistics** with manually collected statistics from trained statisticians.
3. **Measuring player tracking accuracy** using MOTA, ID Switch, and fragment metrics.
4. **Measuring ball detection accuracy** using precision, recall, and F1 score.
5. **Evaluating real-time processing performance** including FPS, latency, and resource utilization.
6. **Demonstrating a low-cost alternative** to commercial volleyball analytics systems.

---

## 1.7 Scope

### 1.7.1 Match Management

- Create matches
- Start matches
- Pause matches
- End matches
- Track set scores and point-by-point events
- Link video recordings to matches

### 1.7.2 Team Management

- Register teams
- Manage team rosters (up to 14 players)
- Assign coaches
- Upload team logos
- Track league affiliation

### 1.7.3 Player Management

- Register players
- Assign jersey numbers (unique within team)
- Define playing positions
- Record physical attributes (height, weight, age)
- Assign to teams

### 1.7.4 AI Analysis

Automatic detection of:

- Players (all on-court participants)
- Volleyball
- Court boundaries
- Net position

### 1.7.5 Tracking

Continuous tracking of:

- Every player (unique ID maintained throughout match)
- Volleyball (position, speed, trajectory)

### 1.7.6 Event Recognition

Automatic recognition of all volleyball events listed in Objective 6.

### 1.7.7 Statistics Generation

Automatic generation of the following statistics per player per match:

**Serving:**

| Statistic | Description |
|-----------|-------------|
| Total Serves | Number of serve attempts |
| Aces | Serves that directly score a point |
| Errors | Serves into the net or out of bounds |

**Attacking:**

| Statistic | Description |
|-----------|-------------|
| Attack Attempts | Total spike/attack attempts |
| Kills | Successful attacks landing in opponent court |
| Attack Errors | Attacks into net or out of bounds |

**Blocking:**

| Statistic | Description |
|-----------|-------------|
| Solo Blocks | Blocks by single player scoring a point |
| Block Assists | Blocks involving two players |

**Defense:**

| Statistic | Description |
|-----------|-------------|
| Digs | Successful defensive saves |
| Saves | Emergency saves keeping ball in play |

**Receiving:**

| Statistic | Description |
|-----------|-------------|
| Reception Attempts | Total serve receive attempts |
| Perfect Receptions | High-quality passes |
| Errors | Shanked receptions |

**Setting:**

| Statistic | Description |
|-----------|-------------|
| Assists | Sets leading to kills |
| Setting Errors | Setting violations or poor sets |

**Movement:**

| Statistic | Description |
|-----------|-------------|
| Distance Covered | Total meters traveled |
| Average Speed | Mean movement speed (km/h) |
| Maximum Speed | Peak sprint speed (km/h) |

**Jump Statistics:**

| Statistic | Description |
|-----------|-------------|
| Jump Count | Total jumps during match |
| Estimated Jump Height | Maximum and average jump height (cm) |

### 1.7.8 Reporting

Generate:

- Match reports (full match summary)
- Player reports (individual performance)
- Team reports (aggregate team performance)
- Tournament reports (multi-match analysis)

---

## 1.8 Expected Users

The system shall support different user roles with distinct permissions:

### Administrator

Responsible for:

- Managing users (create, edit, deactivate, assign roles)
- Managing teams (CRUD operations)
- Managing players (CRUD operations)
- Managing tournaments and match schedules
- Viewing all reports across the system
- Configuring AI pipeline settings
- System backup and maintenance

### Coach

Can:

- Watch live statistics during matches
- Review match videos with annotated events
- View individual player performance
- Download match and player reports
- Compare players side by side
- View heat maps and movement analytics

### Statistician (Optional)

Can:

- Review AI-generated events for accuracy
- Correct AI errors if necessary
- Validate and approve statistics before publication

### Analyst

Can:

- Analyze player performance across multiple matches
- Compare teams and players
- Review tactical insights and patterns
- Generate custom reports

---

## 1.9 Expected Benefits

The project will:

1. **Eliminate manual statistics entry** — fully automated from video to dashboard.
2. **Reduce operational costs** — no need for dedicated statisticians at every match.
3. **Improve statistical accuracy** — consistent AI analysis across all matches.
4. **Provide real-time analytics** — statistics available during the match, not after.
5. **Improve coaching decisions** — data-driven insights for tactical planning.
6. **Support talent identification** — objective performance data for player development.
7. **Help players evaluate their performance** — personal statistics and improvement tracking.
8. **Provide affordable sports analytics** — accessible to schools, universities, and amateur clubs.

---

## 1.10 System Modules

The completed platform will consist of the following 20 modules:

| Module | Name | Category |
|--------|------|----------|
| 1 | Authentication System | Backend |
| 2 | User Management | Backend |
| 3 | Team Management | Backend |
| 4 | Player Management | Backend |
| 5 | Tournament Management | Backend |
| 6 | Match Management | Backend |
| 7 | Camera Management | AI/CV |
| 8 | AI Detection Engine | AI/CV |
| 9 | Player Tracking Engine | AI/CV |
| 10 | Ball Tracking Engine | AI/CV |
| 11 | Pose Estimation Engine | AI/CV |
| 12 | Volleyball Action Recognition Engine | AI/CV |
| 13 | Statistics Engine | AI/Backend |
| 14 | Database Management | Backend |
| 15 | REST API | Backend |
| 16 | Live Dashboard | Frontend |
| 17 | Reports | Frontend/Backend |
| 18 | Heat Maps | Frontend/AI |
| 19 | Player Rankings | Frontend/Backend |
| 20 | AI Insights | AI/Frontend |

### AI Insights Include:

- Player of the Match
- Best Server
- Best Attacker
- Best Blocker
- Best Receiver
- Best Setter
- Match MVP Prediction

---

## 1.11 Development Phases

The project will be implemented in 10 sequential phases. Each phase must be fully completed, tested, and committed before moving to the next.

| Phase | Description | Key Deliverables |
|-------|-------------|-----------------|
| **Phase 1** | Project setup and environment configuration | Folder structure, configs, Git repo, virtual environments, Docker setup |
| **Phase 2** | Database design and backend API development | MySQL schema, Flask/FastAPI backend, JWT auth, CRUD endpoints |
| **Phase 3** | Frontend dashboard development | React app, routing, auth, team/player/match pages |
| **Phase 4** | Computer vision pipeline implementation | Video input, frame processing, court detection |
| **Phase 5** | Object detection and tracking | YOLO models, ByteTrack, player/ball detection and tracking |
| **Phase 6** | Pose estimation and action recognition | MediaPipe integration, LSTM/Transformer action models |
| **Phase 7** | Automatic statistics generation | Stats engine, heat maps, distance, jump estimation |
| **Phase 8** | Reporting and analytics | PDF/CSV reports, dashboards, AI insights |
| **Phase 9** | Performance optimization | GPU acceleration, caching, query optimization |
| **Phase 10** | Testing, deployment, and documentation | Unit/integration tests, Docker deployment, user docs |

---

## 1.12 Document Navigation

This specification is organized into 6 volumes:

| Volume | Title | Chapters |
|--------|-------|----------|
| **Volume 1** | Master Blueprint & SRS | Ch 1-8: Overview, Architecture, Requirements, Use Cases, Tech Stack, Roadmap, Risk |
| **Volume 2** | Backend & Database | Database schema, ERD, API contracts, auth, backend architecture |
| **Volume 3** | AI & Computer Vision Engine | Detection, tracking, pose, OCR, action recognition, statistics |
| **Volume 4** | React Frontend & Dashboard | React architecture, all pages, components, UI/UX specs |
| **Volume 5** | AI Developer Implementation Prompts | Module-by-module prompts with I/O specs and acceptance criteria |
| **Volume 6** | Deployment & Operations | Docker, CI/CD, monitoring, security, maintenance |

---

**END OF CHAPTER 1**

---

# CHAPTER 2: SYSTEM ARCHITECTURE

---

## 2.1 Overall System Architecture

The platform follows a modular architecture so that each component can be developed, tested, and upgraded independently. The system is organized as a pipeline where video flows through successive processing stages, each managed by a dedicated module, ultimately producing structured statistics that are stored in a database and served to the frontend via a REST API.

```
                   +---------------------------------------+
                   |           Camera Layer                |
                   |   Webcam / IP Camera / Phone          |
                   +------------------+--------------------+
                                      |
                                      v
                   +---------------------------------------+
                   |      Video Acquisition Module         |
                   |           OpenCV + FFmpeg             |
                   +------------------+--------------------+
                                      |
                                      v
                   +---------------------------------------+
                   |       Computer Vision Pipeline        |
                   |                                       |
                   |   Court Detection                     |
                   |   Player Detection                    |
                   |   Ball Detection                      |
                   |   Jersey OCR                          |
                   |   Pose Estimation                     |
                   |   Tracking                            |
                   +------------------+--------------------+
                                      |
                                      v
                   +---------------------------------------+
                   |      Event Recognition Engine         |
                   |   Serve, Spike, Block, Dig ...        |
                   +------------------+--------------------+
                                      |
                                      v
                   +---------------------------------------+
                   |         Statistics Engine             |
                   |       Automatic Calculations          |
                   +------------------+--------------------+
                                      |
                                      v
                   +---------------------------------------+
                   |          MySQL Database               |
                   +------------------+--------------------+
                                      |
                                      v
                   +---------------------------------------+
                   |         FastAPI Backend               |
                   +------------------+--------------------+
                                      |
                                      v
                   +---------------------------------------+
                   |         React Dashboard               |
                   |      Coach | Admin | Analyst          |
                   +---------------------------------------+
```

Each layer communicates with the next through well-defined interfaces, ensuring that:

- The **Camera Layer** can be swapped or upgraded without affecting the CV pipeline.
- The **CV Pipeline** can be improved or replaced module by module.
- The **Event Recognition Engine** operates independently from detection details.
- The **Statistics Engine** receives normalized events and produces database-ready records.
- The **Backend** serves data to the frontend without knowledge of how it was produced.
- The **Frontend** renders data from the API without coupling to the database or AI systems.

---

## 2.2 Software Layers

The project is divided into seven major layers. Each layer has a distinct responsibility, technology stack, and interface boundary.

### Layer 1 — Video Input Layer

**Purpose:**  
Acquire live or recorded video for analysis.

**Supported Sources:**

| Source | Connection Type | Notes |
|--------|----------------|-------|
| USB Webcam | Direct (USB) | Local camera, plug-and-play |
| Laptop Camera | Direct (built-in) | Integrated webcam |
| Android Phone | IP Webcam (Wi-Fi) | Use IP Webcam app for RTSP stream |
| RTSP Camera | Network (RTSP) | IP cameras, CCTV systems |
| CCTV Camera | Network (RTSP/ONVIF) | Surveillance cameras |
| Video Files | File system | MP4, AVI, MOV, MKV formats |

**Technologies:**

| Technology | Purpose |
|------------|---------|
| OpenCV | Frame capture, video file reading, RTSP stream handling |
| FFmpeg | Video decoding, format conversion, stream re muxing |

### Layer 2 — Computer Vision Layer

This is the heart of the AI system. It processes every frame from the Video Input Layer and extracts structured information about the match.

**Responsibilities:**

Detect:

- Court boundaries and lines
- All players on court
- The volleyball
- The net

Recognize:

- Jersey numbers (via OCR)

Estimate:

- Body pose (33 keypoints per player)

Track:

- Every player (persistent ID across frames)
- The ball (position, velocity, trajectory)

**Technologies:**

| Technology | Purpose |
|------------|---------|
| YOLO (Ultralytics) | Object detection for players and ball |
| ByteTrack | Multi-object tracking with ID assignment |
| MediaPipe | Real-time pose estimation |
| EasyOCR | Jersey number recognition |

### Layer 3 — Event Recognition Layer

This layer converts raw detections into volleyball events. It consumes tracking data, pose data, and ball trajectory data to classify actions.

**Processing Example — Kill Detection:**

```
Player jumps (pose: vertical velocity > threshold)
        |
Right arm swings (pose: shoulder-to-wrist angle change)
        |
Ball velocity increases (ball tracker: speed spike detected)
        |
Ball lands in opponent court (ball position: inside court boundary)
        |
RESULT: Kill event detected
```

**Possible Events:**

| Event | Category | Detection Method |
|-------|----------|-----------------|
| Serve | Serving | Rules + Pose |
| Ace | Serving | Rules (serve + no return) |
| Service Error | Serving | Rules (serve + net/out) |
| Reception | Receiving | Pose + Ball trajectory |
| Set | Setting | Pose (hands above head) |
| Spike | Attacking | Pose (jump + arm swing) |
| Kill | Attacking | Rules (spike + lands in court) |
| Attack Error | Attacking | Rules (spike + out/net) |
| Dig | Defense | Pose (low position + save) |
| Block | Blocking | Pose (arms over net) |
| Free Ball | Defense | Pose (underhand over net) |
| Net Touch | Violation | Rules (player intersects net) |
| Rotation Fault | Violation | Rules (wrong positions at serve) |

### Layer 4 — Statistics Engine

This layer automatically updates player and team statistics every time an event is detected. No manual entry is required.

**Processing Example — Kill Statistics Update:**

```
Kill event detected
        |
Identify responsible player: Player #8
        |
Update Player #8 statistics:
    Kill Points     = Kill Points + 1
    Attack Attempts  = Attack Attempts + 1
    Total Points     = Total Points + 1
        |
Update team total:
    Team Kill Points = Team Kill Points + 1
        |
Store updated record in database
```

### Layer 5 — Database Layer

Stores everything the system produces and consumes.

**Data Stored:**

| Data Type | Description |
|-----------|-------------|
| Users | System user accounts and credentials |
| Teams | Team profiles, rosters, logos |
| Players | Player profiles, positions, physical attributes |
| Matches | Match schedules, results, status |
| Sets | Individual set scores |
| Point Events | Every detected event with timestamp and context |
| Statistics | Aggregated player and team statistics per match |
| Videos | Video file metadata and processing status |
| Heat Maps | Player position data for visualization |
| Reports | Generated report files |

**Database Engine:** MySQL 8.0

### Layer 6 — Backend Layer

Provides APIs for the frontend to consume. Acts as the intermediary between the database, AI pipeline, and user interface.

**Framework:** FastAPI (Python)

**Responsibilities:**

| Responsibility | Description |
|----------------|-------------|
| Authentication | JWT-based login, token refresh, session management |
| CRUD Operations | Create, read, update, delete for all entities |
| AI Communication | Trigger video processing, receive analysis results |
| Database Communication | ORM-based data access with connection pooling |
| Report Generation | Generate PDF and CSV reports on demand |
| Real-time Updates | WebSocket support for live dashboard updates |

### Layer 7 — Frontend Layer

Displays all information to end users through a modern, responsive web interface.

**Displayed Content:**

| Content | Description |
|---------|-------------|
| Live Match | Real-time scoreboard and event feed |
| Statistics | Player and team statistics tables |
| Charts | Visual representations of performance data |
| Heat Maps | Court position overlays per player |
| Reports | Downloadable match and player reports |
| Rankings | Player and team ranking tables |

**Framework:** React (TypeScript)

---

## 2.3 Complete Folder Structure

```
Volleyball_AI_System/
│
├── backend/
│   │
│   ├── app/
│   │   ├── api/                    # API route handlers
│   │   ├── auth/                    # Authentication logic
│   │   ├── config/                  # Application configuration
│   │   ├── database/                # Database connection and session management
│   │   ├── middleware/              # Request/response middleware
│   │   ├── models/                  # SQLAlchemy ORM models
│   │   ├── repositories/            # Data access layer (queries)
│   │   ├── schemas/                 # Pydantic request/response schemas
│   │   ├── services/                # Business logic layer
│   │   ├── utils/                   # Shared utility functions
│   │   └── main.py                  # FastAPI application entry point
│   │
│   ├── requirements.txt             # Python dependencies
│   ├── Dockerfile                   # Backend Docker image
│   └── .env                         # Environment variables
│
├── frontend/
│   │
│   ├── src/
│   │   ├── assets/                  # Static assets (images, icons)
│   │   ├── components/              # Reusable UI components
│   │   ├── layouts/                 # Page layout wrappers
│   │   ├── pages/                   # Route-level page components
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── services/                # API client functions
│   │   ├── routes/                  # React Router configuration
│   │   ├── contexts/                # React context providers
│   │   ├── store/                   # Global state management
│   │   ├── styles/                  # CSS and Tailwind config
│   │   └── utils/                   # Frontend utility functions
│   │
│   ├── package.json                 # Node.js dependencies
│   └── Dockerfile                   # Frontend Docker image
│
├── ai/
│   │
│   ├── court_detection/             # Court boundary detection module
│   ├── player_detection/            # YOLO-based player detection
│   ├── ball_detection/              # YOLO-based ball detection
│   ├── tracking/                    # ByteTrack multi-object tracking
│   ├── jersey_recognition/          # OCR for jersey numbers
│   ├── pose_estimation/             # MediaPipe pose estimation
│   ├── action_recognition/          # Volleyball action classification
│   ├── statistics_engine/           # Automatic statistics calculation
│   ├── heatmaps/                    # Heat map generation
│   ├── training/                    # Model training scripts
│   ├── datasets/                    # Training datasets
│   └── weights/                     # Trained model weight files
│
├── database/
│   │
│   ├── migrations/                  # Alembic database migrations
│   ├── seeders/                     # Database seeding scripts
│   └── backups/                     # Automated backup storage
│
├── docs/                            # Project documentation
├── reports/                         # Generated match reports
├── videos/                          # Uploaded match videos
├── models/                          # Exported model artifacts
├── tests/                           # Test suites (backend + AI)
├── deployment/                      # Deployment configurations
└── scripts/                         # Utility scripts
```

---

## 2.4 AI Processing Pipeline

The AI pipeline is the core analytical engine of the system. It processes video frames through a sequence of stages, each extracting specific information from the visual data.

```
Video Frame (raw input)
        |
        v
+------------------------+
| Court Detection         |  Identify court boundaries, net, attack line
+------------+-----------+
             |
             v
+------------------------+
| Player Detection        |  YOLO identifies all players in frame
+------------+-----------+
             |
             v
+------------------------+
| Ball Detection          |  YOLO identifies volleyball position
+------------+-----------+
             |
             v
+------------------------+
| Player Tracking         |  ByteTrack assigns persistent IDs
+------------+-----------+
             |
             v
+------------------------+
| Ball Tracking           |  Track ball position, speed, trajectory
+------------+-----------+
             |
             v
+------------------------+
| Pose Estimation         |  MediaPipe extracts body keypoints
+------------+-----------+
             |
             v
+------------------------+
| Jersey Recognition      |  EasyOCR reads jersey numbers
+------------+-----------+
             |
             v
+------------------------+
| Event Recognition       |  Classify volleyball actions
+------------+-----------+
             |
             v
+------------------------+
| Statistics Generator    |  Update player and team statistics
+------------+-----------+
             |
             v
+------------------------+
| Database Update         |  Persist all results to MySQL
+------------+-----------+
             |
             v
+------------------------+
| Live Dashboard          |  Push updates to React frontend
+------------------------+
```

**Pipeline Characteristics:**

| Characteristic | Description |
|---------------|-------------|
| Sequential | Each stage processes output from the previous stage |
| Frame-by-frame | Processes each video frame independently through the pipeline |
| Stateful | Tracking and statistics maintain state across frames |
| Configurable | Each stage can be enabled/disabled and tuned independently |
| Resilient | Pipeline continues operating even if individual stages fail |

---

## 2.5 Backend Architecture

The backend follows a layered architecture pattern that separates concerns and ensures maintainability.

```
React Dashboard (Frontend)
        |
        v
+------------------------+
| REST API Layer          |  FastAPI route handlers, input validation
+------------+-----------+
             |
             v
+------------------------+
| Authentication Layer    |  JWT validation, role checking
+------------+-----------+
             |
             v
+------------------------+
| Business Logic Layer   |  Services implementing application rules
+------------+-----------+
             |
             v
+------------------------+
| Data Access Layer      |  Repositories abstracting database queries
+------------+-----------+
             |
             v
+------------------------+
| Database Layer         |  MySQL via SQLAlchemy ORM
+------------------------+
```

**Layer Responsibilities:**

| Layer | Responsibility | Key Components |
|-------|---------------|----------------|
| REST API | HTTP request handling, response formatting | Route handlers, Pydantic schemas |
| Authentication | Identity verification, permission enforcement | JWT tokens, RBAC middleware |
| Business Logic | Application rules, data transformation | Service classes |
| Data Access | Database query abstraction | Repository classes, SQLAlchemy models |
| Database | Data persistence, integrity enforcement | MySQL, migrations, indexes |

---

## 2.6 AI Engine Architecture

The AI subsystem itself is divided into eight independent engines. Each engine has a clear input/output contract and can be developed, tested, and upgraded independently.

### Engine 1 — Court Detection

**Purpose:**  
Detect and calibrate the volleyball court from the video frame.

**Detects:**

| Element | Description |
|---------|-------------|
| Court Boundaries | Four outer lines of the court (18m x 9m) |
| Attack Line | 3-meter line on each side |
| Service Line | Back boundary line |
| Net | Center line dividing the court |
| Center Line | Mid-court divider |

**Output:**  
Homography matrix for mapping pixel coordinates to real-world court coordinates.

### Engine 2 — Player Detection

**Purpose:**  
Detect all players on the court using YOLO object detection.

**Uses:** YOLOv8 (fine-tuned on volleyball data)

**Outputs:**

| Output | Type | Description |
|--------|------|-------------|
| Bounding Box | (x1, y1, x2, y2) | Player location in frame |
| Confidence | Float (0-1) | Detection confidence score |
| Team Color | RGB/Tuple | Dominant jersey color for team assignment |

### Engine 3 — Ball Detection

**Purpose:**  
Detect and locate the volleyball in each frame using a specialized detector.

**Outputs:**

| Output | Type | Description |
|--------|------|-------------|
| Ball Coordinates | (x, y) | Center position of the ball |
| Speed | Float (km/h) | Current ball velocity |
| Direction | Vector | Ball movement direction |

### Engine 4 — Tracking Engine

**Purpose:**  
Assign a persistent unique ID to every detected player and the ball, maintaining identity across frames even during occlusions.

**Example:**

```
Player detected in Frame 1       ->  Assigned ID = 12
Player detected in Frame 4000    ->  Still ID = 12
(Player maintained identity across 4000 frames)
```

**Technology:** ByteTrack

**Output:**  
Each detected object receives a stable track ID, bounding box, and state (new/tracked/lost/removed).

### Engine 5 — OCR Engine

**Purpose:**  
Read jersey numbers from detected players.

**Pipeline:**

```
Player detected
        |
        v
Crop jersey region from frame
        |
        v
Preprocess image (grayscale, threshold, denoise)
        |
        v
Run OCR engine (EasyOCR)
        |
        v
Extract digits, validate range (0-99)
        |
        v
Output: Jersey Number = 7
```

### Engine 6 — Pose Estimation Engine

**Purpose:**  
Detect human body joints and keypoints for each tracked player.

**Outputs:**

| Keypoint | Body Part |
|----------|-----------|
| 0 | Nose |
| 11, 12 | Left/Right Shoulder |
| 13, 14 | Left/Right Elbow |
| 15, 16 | Left/Right Wrist |
| 23, 24 | Left/Right Hip |
| 25, 26 | Left/Right Knee |
| 27, 28 | Left/Right Ankle |

**Technology:** MediaPipe Pose

### Engine 7 — Action Recognition Engine

**Purpose:**  
Classify volleyball actions from tracking data, pose data, and ball movement.

**Consumes:**

| Input | Source |
|-------|--------|
| Player tracking data | Tracking Engine |
| Body pose keypoints | Pose Estimation Engine |
| Ball trajectory and speed | Ball Detection + Tracking |

**Produces:**

| Action | Confidence |
|--------|-----------|
| Serve | 0.92 |
| Spike | 0.88 |
| Reception | 0.85 |
| Dig | 0.79 |
| Block | 0.91 |
| Kill | 0.87 |
| Free Ball | 0.83 |

### Engine 8 — Statistics Engine

**Purpose:**  
Update every player and team statistic automatically when events are detected.

**Processing Example:**

```
Serve Ace detected
        |
Identify responsible player: Player #5
        |
Update Player #5 statistics:
    Service Aces    = Service Aces + 1
    Total Serves    = Total Serves + 1
    Total Points    = Total Points + 1
        |
Update team totals
        |
Write updated records to database
```

---

## 2.7 Security Architecture

### Authentication

| Component | Implementation |
|-----------|---------------|
| Access Token | JWT (JSON Web Token), expires in 24 hours |
| Refresh Token | JWT, expires in 7 days |
| Token Storage | HTTP-only cookies or Authorization header |
| Token Refresh | Automatic refresh before access token expiry |

### Authorization — Role-Based Access Control (RBAC)

| Role | Permissions |
|------|-------------|
| Administrator | Full access: user management, system config, all data |
| Coach | Team data, match analysis, reports, player stats |
| Analyst | Read access to all data, report generation |
| Statistician | Review and correct AI-generated events |

### Password Security

| Component | Implementation |
|-----------|---------------|
| Hashing Algorithm | BCrypt |
| Salt Rounds | 12 |
| Password Policy | Minimum 8 characters, mixed case + numbers |

### API Security

| Measure | Description |
|---------|-------------|
| HTTPS | All API traffic encrypted via TLS |
| Input Validation | Pydantic schema validation on all endpoints |
| Rate Limiting | Maximum 100 requests per minute per user |
| CORS | Configured to allow only frontend origin |
| SQL Injection Prevention | ORM-based queries (SQLAlchemy) |

---

## 2.8 Performance Requirements

The target system should achieve the following performance benchmarks:

| Metric | Target | Notes |
|--------|--------|-------|
| Live Video Processing | Real-time capable | Processing rate depends on hardware and model complexity |
| Input Frame Rate | 30-60 FPS supported | Input can be any frame rate; processing adapts |
| Dashboard Update Latency | Under 2 seconds | From event detection to dashboard display |
| Concurrent Matches | Multiple (future) | Architecture supports multi-court expansion |
| Database Performance | Optimized for large datasets | Proper indexing, connection pooling |
| Camera Disconnect Recovery | Automatic | Pipeline resumes when camera reconnects |

---

## 2.9 Scalability

The architecture is designed to support future expansion in the following dimensions:

| Expansion Area | Description |
|---------------|-------------|
| Multiple Camera Angles | Fusion of multiple views for better tracking accuracy |
| Multi-Court Tournaments | Parallel processing of multiple courts simultaneously |
| Cloud Deployment | Migration from local to cloud infrastructure (AWS/GCP) |
| Mobile Application | Native or responsive mobile interface |
| AI Performance Prediction | Predicting match outcomes using historical data |
| Injury-Risk Analysis | Monitoring player movement patterns for injury prevention |
| Wearable Sensor Integration | Combining video data with accelerometer/gyroscope data |
| Live Streaming Overlays | Real-time statistics overlaid on broadcast video |

---

## 2.10 Development Standards

To keep the project maintainable and professional:

### Version Control

| Component | Tool |
|-----------|------|
| Version Control System | Git |
| Remote Repository | GitHub |

### Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Stable releases, production-ready code |
| `develop` | Integration branch for ongoing development |
| `feature/<module-name>` | Individual feature development |
| `bugfix/<issue-name>` | Bug fixes |

### Coding Standards

| Language | Standard |
|----------|----------|
| Python | PEP 8 |
| JavaScript/React | ESLint + Prettier |

**General Practices:**

- Meaningful function and variable names
- Type hints for Python where appropriate
- Unit tests for core business logic
- Docstrings for all public functions and classes

### Documentation

Every module should include:

| Documentation Item | Description |
|-------------------|-------------|
| Purpose | What the module does |
| Inputs | What data the module receives |
| Outputs | What data the module produces |
| Dependencies | External libraries and internal modules required |
| Error Handling | How errors are caught and reported |
| Test Cases | Expected behavior under normal and edge conditions |

---

## 2.11 Deliverables at the End of Development

By project completion, the platform should include the following deliverables:

| # | Deliverable | Status |
|---|------------|--------|
| 1 | AI-powered real-time player detection | Planned |
| 2 | Ball detection and tracking | Planned |
| 3 | Court detection and calibration | Planned |
| 4 | Jersey number recognition | Planned |
| 5 | Pose estimation | Planned |
| 6 | Volleyball action recognition | Planned |
| 7 | Automatic statistics generation | Planned |
| 8 | Live analytics dashboard | Planned |
| 9 | Team and player management | Planned |
| 10 | Match recording and replay | Planned |
| 11 | Heat maps | Planned |
| 12 | Match reports | Planned |
| 13 | REST API | Planned |
| 14 | Secure authentication | Planned |
| 15 | Database backups | Planned |
| 16 | Deployment-ready architecture | Planned |

---

**END OF CHAPTER 2**

---

# CHAPTER 3: FUNCTIONAL REQUIREMENTS

---

## 3.1 Introduction

This chapter defines every function the system must perform. Each requirement has a unique identifier to make it traceable during development and testing.

**Naming Convention:**

| Prefix | Meaning |
|--------|---------|
| FR-### | Functional Requirement Number |

**Example:**

| ID | Meaning |
|----|---------|
| FR-001 | Functional Requirement Number 1 |

Every requirement defined in this chapter will later be mapped to:

- Database tables
- Backend API endpoints
- Frontend screens
- AI modules
- Test cases
- User acceptance criteria

---

## 3.2 User Roles

The platform shall support the following user roles:

| Role | Description | Access Level |
|------|-------------|-------------|
| Administrator | Full system control | All modules, all operations |
| Coach | View live analytics and reports | Team data, match analysis, reports |
| Analyst | Analyze player and team performance | Read access to all data, report generation |
| Statistician | Validate or correct AI-generated events (optional) | Event review and correction |
| Viewer (Optional) | Read-only access to selected match information | Limited match data |

---

# MODULE 1 — AUTHENTICATION

---

### FR-001 User Login

The system shall allow registered users to log in using:

- Email
- Password

After successful authentication, the system shall:

- Generate a JWT Access Token
- Generate a Refresh Token
- Return user profile data (id, name, role, email)

**Priority:** Must  
**Validation:** Credentials must match stored BCrypt hash. Invalid credentials return 401 Unauthorized.

---

### FR-002 Logout

Users shall be able to log out.

The system shall:

- Invalidate refresh tokens
- End active sessions
- Clear token storage on the client side

**Priority:** Must

---

### FR-003 Forgot Password

The system shall:

- Verify email address exists in the system
- Send a password reset link to the verified email
- Allow the user to set a new password via the reset link
- Invalidate the reset link after use or after 24 hours

**Priority:** Must

---

### FR-004 Change Password

Authenticated users shall be able to change their passwords.

The system shall:

- Require the current password for verification
- Enforce password policy (minimum 8 characters, mixed case + numbers)
- Update the stored BCrypt hash
- Invalidate all existing refresh tokens

**Priority:** Must

---

### FR-005 Role-Based Access

The system shall restrict access based on user role.

| Role | Access |
|------|--------|
| Administrator | Can access everything |
| Coach | Cannot delete users, cannot modify system settings |
| Analyst | Cannot modify data, cannot manage users |
| Statistician | Can only review and correct AI events |
| Viewer | Read-only access to selected data |

**Priority:** Must  
**Enforcement:** Enforced at both API middleware level and frontend route level.

---

# MODULE 2 — USER MANAGEMENT

---

### FR-006 Create User

Administrator shall create users.

**Required Fields:**

| Field | Type | Constraints |
|-------|------|-------------|
| First Name | String | Required, max 50 chars |
| Last Name | String | Required, max 50 chars |
| Email | String | Required, unique, valid format |
| Password | String | Required, min 8 chars |
| Phone | String | Optional |
| Role | Enum | Required: admin, coach, analyst, statistician |

**Priority:** Must  
**Access:** Administrator only

---

### FR-007 Edit User

Administrator may update:

| Field | Editable |
|-------|----------|
| Name | Yes |
| Email | Yes (uniqueness check) |
| Role | Yes |
| Phone | Yes |
| Password | No (separate flow) |

**Priority:** Must  
**Access:** Administrator only

---

### FR-008 Delete User

Administrator shall remove users.

**Behavior:**

- Soft delete (mark as inactive, do not remove from database)
- Inactive users cannot log in
- Associated data is preserved for historical records

**Priority:** Must  
**Access:** Administrator only

---

### FR-009 View Users

Administrator shall view all users.

**Features:**

- Paginated list of all users
- Filter by role, status, date created
- Search by name or email
- Sort by name, email, role, creation date

**Priority:** Must  
**Access:** Administrator only

---

# MODULE 3 — TEAM MANAGEMENT

---

### FR-010 Register Team

Fields:

| Field | Type | Constraints |
|-------|------|-------------|
| Team Name | String | Required, unique, max 100 chars |
| Short Name | String | Required, max 10 chars |
| Logo | Image | Optional, max 2MB |
| Coach | String | Optional |
| Home Ground | String | Optional |
| Country | String | Optional |
| League | String | Optional |

**Priority:** Must  
**Access:** Administrator, Coach

---

### FR-011 Edit Team

Administrator updates team information.

**Editable Fields:** All fields from FR-010

**Priority:** Must  
**Access:** Administrator, Coach

---

### FR-012 Delete Team

Remove team from the system.

**Behavior:**

- Soft delete (mark as inactive)
- Team still appears in historical match records
- Cannot delete team with active players (must remove or reassign first)

**Priority:** Must  
**Access:** Administrator only

---

### FR-013 View Team

Display complete team profile including:

| Content | Description |
|---------|-------------|
| Team Information | Name, logo, coach, league, country |
| Player Roster | List of all players with jersey numbers and positions |
| Match History | All matches played by the team |
| Team Statistics | Aggregate statistics across all matches |

**Priority:** Must  
**Access:** All authenticated users

---

# MODULE 4 — PLAYER MANAGEMENT

---

### FR-014 Register Player

Fields:

| Field | Type | Constraints |
|-------|------|-------------|
| Full Name | String | Required, max 100 chars |
| Jersey Number | Integer | Required, 0-99, unique within team |
| Position | Enum | Required: outside_hitter, opposite, setter, middle_blocker, libero, defensive_specialist |
| Height | Integer | Optional, in centimeters |
| Weight | Integer | Optional, in kilograms |
| Date of Birth | Date | Optional |
| Team | FK | Required, must reference existing team |
| Photo | Image | Optional, max 2MB |

**Priority:** Must  
**Access:** Administrator, Coach

---

### FR-015 Edit Player

Update player profile.

**Editable Fields:** All fields from FR-014

**Priority:** Must  
**Access:** Administrator, Coach

---

### FR-016 Delete Player

Remove player from the system.

**Behavior:**

- Soft delete (mark as inactive)
- Player still appears in historical match records
- Cannot be assigned to new matches while inactive

**Priority:** Must  
**Access:** Administrator only

---

### FR-017 Player Profile

Display complete player profile including:

| Content | Description |
|---------|-------------|
| Personal Information | Name, jersey number, position, height, weight, DOB |
| Career Statistics | Cumulative stats across all matches |
| Match History | List of all matches played with per-match stats |
| Heat Maps | Court coverage visualization per match |
| Performance Graphs | Trend charts showing improvement over time |
| Jump Statistics | Jump count, average height, max height |
| Speed Statistics | Average speed, max speed, distance covered |

**Priority:** Must  
**Access:** All authenticated users

---

# MODULE 5 — TOURNAMENT MANAGEMENT

---

### FR-018 Create Tournament

Fields:

| Field | Type | Constraints |
|-------|------|-------------|
| Tournament Name | String | Required |
| Location | String | Optional |
| Organizer | String | Optional |
| Season | String | Optional (e.g., "2026") |

**Priority:** Should  
**Access:** Administrator

---

### FR-019 Register Teams

Assign teams to a tournament.

**Behavior:**

- Select teams from existing team registry
- Minimum 2 teams required
- Each team can be registered to multiple tournaments

**Priority:** Should  
**Access:** Administrator

---

### FR-020 Tournament Fixtures

Generate fixtures for the tournament.

**Formats Supported:**

- Round-robin (each team plays every other team)
- Single elimination
- Custom schedule (manual fixture creation)

**Priority:** Should  
**Access:** Administrator

---

### FR-021 Tournament Standings

Display rankings based on:

| Criteria | Points |
|----------|--------|
| Match Win | 3 points |
| Match Draw | 1 point |
| Match Loss | 0 points |
| Sets Won | Tiebreaker 1 |
| Points Difference | Tiebreaker 2 |

**Priority:** Should  
**Access:** All authenticated users

---

# MODULE 6 — MATCH MANAGEMENT

---

### FR-022 Create Match

Fields:

| Field | Type | Constraints |
|-------|------|-------------|
| Home Team | FK | Required, must reference existing team |
| Away Team | FK | Required, must reference existing team, different from home team |
| Venue | String | Optional |
| Date | Date | Required, must be valid date |
| Time | Time | Optional |
| Tournament | FK | Optional, must reference existing tournament |
| Sets Format | Enum | Required: best_of_3, best_of_5 |

**Priority:** Must  
**Access:** Administrator, Coach

---

### FR-023 Start Match

Starts the following systems:

| System | Action |
|--------|--------|
| Camera | Begin video capture from configured source |
| AI Pipeline | Begin player detection, ball detection, tracking, event recognition |
| Timer | Start match clock |
| Statistics Engine | Begin automatic statistics calculation |

**Priority:** Must  
**Access:** Administrator, Coach  
**Pre-condition:** Match must be in "scheduled" status

---

### FR-024 Pause Match

Pause the following systems:

| System | Action |
|--------|--------|
| AI Processing | Pause analysis pipeline |
| Timer | Pause match clock |
| Statistics | Pause statistics updates |

**Behavior:**

- Video capture continues (buffered for later processing)
- All state is preserved
- Resume from exact pause point

**Priority:** Must  
**Access:** Administrator, Coach  
**Pre-condition:** Match must be in "live" status

---

### FR-025 Resume Match

Continue analysis from the pause point.

**Behavior:**

- Resume AI processing
- Resume timer
- Resume statistics updates
- No data lost during pause

**Priority:** Must  
**Access:** Administrator, Coach  
**Pre-condition:** Match must be in "paused" status

---

### FR-026 End Match

Automatically upon match completion:

| System | Action |
|--------|--------|
| AI | Stop all processing |
| Statistics | Finalize all statistics |
| Reports | Generate match report |
| Database | Update match status to "completed" |
| Winner | Determine and record match winner |

**Priority:** Must  
**Access:** Administrator, Coach  
**Trigger:** Match ends when winning team reaches required set victories (2 for best-of-3, 3 for best-of-5)

---

# MODULE 7 — CAMERA MANAGEMENT

---

### FR-027 Camera Registration

Register camera sources:

| Source Type | Connection | Configuration |
|-------------|-----------|---------------|
| USB Webcam | Direct (USB) | Device ID |
| IP Camera | Network (RTSP) | IP address, port, credentials |
| RTSP Camera | Network (RTSP) | Stream URL |
| Phone Camera | Wi-Fi (RTSP) | IP Webcam app URL |

**Priority:** Must  
**Access:** Administrator

---

### FR-028 Camera Calibration

Calibrate camera for accurate analysis:

| Calibration Target | Description |
|-------------------|-------------|
| Court | Court boundary lines and dimensions |
| Net | Net position and height |
| Reference Points | Fixed points for coordinate mapping |
| Homography | Perspective transformation matrix |

**Priority:** Must  
**Access:** Administrator  
**Frequency:** Once per camera position (re-calibrate if camera moves)

---

### FR-029 Live Video Feed

Display live video feed in the dashboard.

**Features:**

- Real-time video display
- Overlay detection bounding boxes (optional)
- Overlay tracking IDs (optional)
- Overlay court lines (optional)

**Priority:** Should  
**Access:** All authenticated users

---

### FR-030 Camera Health

Monitor camera status:

| Metric | Description |
|--------|-------------|
| FPS | Current frame rate |
| Resolution | Current video resolution |
| Connection Status | Connected / Disconnected |
| Last Frame Timestamp | Time of last received frame |

**Priority:** Should  
**Access:** Administrator

---

# MODULE 8 — AI PLAYER DETECTION

---

### FR-031 Detect Players

AI shall detect every player visible on the court.

**Output per detection:**

| Field | Type | Description |
|-------|------|-------------|
| Bounding Box | (x1, y1, x2, y2) | Player location in frame |
| Confidence | Float (0-1) | Detection confidence score |
| Coordinates | (x, y) | Normalized court position |

**Priority:** Must  
**Minimum Accuracy:** 85% detection rate  
**Confidence Threshold:** >= 0.5

---

### FR-032 Detect Teams

Classify detected players into teams:

| Classification Method | Description |
|----------------------|-------------|
| Jersey Color | Primary method — dominant color histogram matching |
| Jersey Number | Secondary method — OCR-assisted team assignment |

**Output:** Team assignment (Team A / Team B / Unknown)

**Priority:** Must

---

### FR-033 Detect Referees

Identify officials separately from players.

**Behavior:**

- Detect non-player individuals on or near court
- Classify as "referee" or "official"
- Exclude from player statistics
- Track separately for reference

**Priority:** Should

---

# MODULE 9 — BALL DETECTION

---

### FR-034 Detect Volleyball

Detect the volleyball in each frame.

**Output:**

| Field | Type | Description |
|-------|------|-------------|
| Position | (x, y) | Center coordinates in frame |
| Confidence | Float (0-1) | Detection confidence score |

**Priority:** Must  
**Confidence Threshold:** >= 0.6

---

### FR-035 Ball Tracking

Track ball continuously throughout the rally.

**Behavior:**

- Maintain ball identity across frames
- Handle brief occlusions (player blocking ball from view)
- Predict ball position during occlusion using trajectory interpolation

**Priority:** Must

---

### FR-036 Ball Trajectory

Estimate ball trajectory characteristics:

| Characteristic | Unit | Description |
|---------------|------|-------------|
| Speed | km/h | Current velocity |
| Direction | Vector | Movement direction (x, y components) |
| Flight Path | Array of (x, y, z) | Complete trajectory through air |
| Height | Meters | Current height above court |

**Priority:** Should

---

# MODULE 10 — PLAYER TRACKING

---

### FR-037 Assign Tracking IDs

Every detected player shall receive a unique tracking ID.

**Behavior:**

- ID assigned on first detection
- ID maintained throughout the match
- ID recycled only after player leaves court for extended period

**Priority:** Must

---

### FR-038 Continuous Tracking

Maintain player identity even during:

| Scenario | Challenge |
|----------|-----------|
| Running | Fast movement across frame |
| Jumping | Rapid vertical movement |
| Crossing Paths | Players swap positions |
| Partial Occlusion | Player hidden behind another player |
| Full Occlusion | Player temporarily hidden (maximum 5 seconds) |

**Priority:** Must  
**Target:** Zero ID switches during normal play

---

### FR-039 Playing Time

Automatically calculate:

| Metric | Description |
|--------|-------------|
| Time on Court | Duration player is actively playing |
| Entry Time | When player enters the match |
| Exit Time | When player leaves the match |
| Substitutions | Count and timing of substitutions |

**Priority:** Must

---

# MODULE 11 — JERSEY NUMBER RECOGNITION

---

### FR-040 OCR Detection

Read jersey numbers from detected players.

**Pipeline:**

1. Extract player region from frame
2. Focus on upper torso area
3. Preprocess image (grayscale, threshold, denoise)
4. Run OCR engine
5. Extract numeric characters
6. Validate range (0-99)

**Target Accuracy:** >= 85% for clear views

**Priority:** Should

---

### FR-041 Identity Assignment

Associate tracking ID with registered player.

**Behavior:**

- Match OCR-detected jersey number with team roster
- Confirm player identity using jersey color + number combination
- Once confirmed, use tracking ID for all subsequent references
- Handle ambiguity by maintaining multiple candidate identities until confirmed

**Priority:** Should

---

# MODULE 12 — POSE ESTIMATION

---

### FR-042 Detect Human Skeleton

Estimate body joints for each detected player.

**Keypoints:**

| Keypoint | Body Part |
|----------|-----------|
| 0 | Nose |
| 11, 12 | Left/Right Shoulder |
| 13, 14 | Left/Right Elbow |
| 15, 16 | Left/Right Wrist |
| 23, 24 | Left/Right Hip |
| 25, 26 | Left/Right Knee |
| 27, 28 | Left/Right Ankle |

**Priority:** Must  
**Technology:** MediaPipe Pose

---

### FR-043 Detect Jump

Recognize jumping actions from pose data.

**Detection Criteria:**

- Both ankle keypoints lose ground contact
- Vertical velocity exceeds upward threshold
- Hip center rises significantly above standing height

**Output:** Jump event with timestamp and estimated height

**Priority:** Must

---

### FR-044 Detect Landing

Recognize landing after a jump.

**Detection Criteria:**

- Ankle keypoints regain ground contact
- Vertical velocity changes from upward to downward
- Body stabilizes after impact

**Output:** Landing event with timestamp

**Priority:** Must

---

# MODULE 13 — ACTION RECOGNITION

---

### FR-045 Detect Serve

Detect a serve action.

**Indicators:**

- Player positioned behind service line
- Ball toss detected
- Arm swing motion (serve mechanics)
- Ball trajectory initiated from server position

**Priority:** Must

---

### FR-046 Detect Serve Ace

Detect a serve ace (serve that directly scores).

**Indicators:**

- Serve event detected (FR-045)
- Ball lands in opponent court
- No successful reception by opponent
- Point scored for serving team

**Priority:** Must

---

### FR-047 Detect Reception

Detect a reception (serve receive).

**Indicators:**

- Ball approaching from opponent side
- Player in receiving position
- Ball contacts player platform
- Ball changes direction after contact

**Priority:** Must

---

### FR-048 Detect Set

Detect a set action.

**Indicators:**

- Player contacts ball with fingertips
- Hands positioned above forehead
- Controlled ball placement
- Ball directed toward attacker

**Priority:** Must

---

### FR-049 Detect Spike

Detect a spike (attack) action.

**Indicators:**

- Player jumps (FR-043)
- Arm swing from back to front
- Forceful ball contact
- Ball velocity increases significantly

**Priority:** Must

---

### FR-050 Detect Kill

Detect a kill (successful attack).

**Indicators:**

- Spike event detected (FR-049)
- Ball lands in opponent court
- No successful block or dig
- Point scored for attacking team

**Priority:** Must

---

### FR-051 Detect Block

Detect a block action.

**Indicators:**

- Player(s) at net
- Jump at net (FR-043)
- Arms extended above net height
- Ball contacts player(s) at net
- Ball returned to attacker's side

**Priority:** Must

---

### FR-052 Detect Dig

Detect a dig (defensive save).

**Indicators:**

- Hard-driven ball approaching
- Player in low defensive position
- Ball contacted with forearms or platform
- Ball kept in play after contact

**Priority:** Must

---

### FR-053 Detect Free Ball

Detect a free ball (easy ball over net).

**Indicators:**

- Ball sent over net with minimal force
- Underhand or controlled contact
- No aggressive intent
- Ball trajectory is high and slow

**Priority:** Must

---

### FR-054 Detect Service Error

Detect a service error.

**Indicators:**

- Serve event detected (FR-045)
- Ball hits the net (does not cross)
- Ball lands outside court boundaries
- Point awarded to receiving team

**Priority:** Must

---

### FR-055 Detect Attack Error

Detect an attack error.

**Indicators:**

- Spike event detected (FR-049)
- Ball lands outside court boundaries
- Ball hits the net during attack
- Ball goes into the net
- Point awarded to defending team

**Priority:** Must

---

### FR-056 Detect Net Touch

Detect a net touch violation.

**Indicators:**

- Player body or arm contacts the net
- Contact occurs during active play
- Contact affects play or gives unfair advantage

**Priority:** Should

---

### FR-057 Detect Rotation Fault

Detect a rotation fault.

**Indicators:**

- At the moment of serve, players not in correct rotation order
- Player positions do not match registered rotation
- Wrong player serving

**Priority:** Should

---

# MODULE 14 — STATISTICS ENGINE

---

The system shall automatically calculate player and team statistics without manual input.

## Serving Statistics

### FR-058 Total Serves

Count all serve attempts by the player.

**Calculation:** Count of serve events (FR-045) per player per match

**Priority:** Must

---

### FR-059 Service Aces

Count all service aces by the player.

**Calculation:** Count of serve ace events (FR-046) per player per match

**Priority:** Must

---

### FR-060 Service Errors

Count all service errors by the player.

**Calculation:** Count of service error events (FR-054) per player per match

**Priority:** Must

---

## Attacking Statistics

### FR-061 Attack Attempts

Count all attack attempts by the player.

**Calculation:** Count of spike events (FR-049) per player per match

**Priority:** Must

---

### FR-062 Kills

Count all kills by the player.

**Calculation:** Count of kill events (FR-050) per player per match

**Priority:** Must

---

### FR-063 Attack Errors

Count all attack errors by the player.

**Calculation:** Count of attack error events (FR-055) per player per match

**Priority:** Must

---

### FR-064 Blocked Attacks

Count all attacks blocked by the opponent.

**Calculation:** Count of spike events resulting in opponent block (FR-051) per player per match

**Priority:** Must

---

## Blocking Statistics

### FR-065 Solo Blocks

Count all solo blocks by the player.

**Calculation:** Count of block events (FR-051) with single player involved per player per match

**Priority:** Must

---

### FR-066 Block Assists

Count all block assists by the player.

**Calculation:** Count of block events (FR-051) with two players involved where player is one of them per player per match

**Priority:** Must

---

## Defense Statistics

### FR-067 Digs

Count all digs by the player.

**Calculation:** Count of dig events (FR-052) per player per match

**Priority:** Must

---

### FR-068 Saves

Count all emergency saves by the player.

**Calculation:** Count of successful defensive saves (excluding digs and receptions) per player per match

**Priority:** Must

---

## Receiving Statistics

### FR-069 Reception Attempts

Count all reception attempts by the player.

**Calculation:** Count of reception events (FR-047) per player per match

**Priority:** Must

---

### FR-070 Perfect Receptions

Count all perfect receptions by the player.

**Calculation:** Count of reception events rated as "perfect" (3-point scale) per player per match

**Priority:** Must

---

### FR-071 Reception Errors

Count all reception errors by the player.

**Calculation:** Count of reception events resulting in point for serving team per player per match

**Priority:** Must

---

## Setting Statistics

### FR-072 Assists

Count all assists by the player.

**Calculation:** Count of set events (FR-048) resulting in kills per player per match

**Priority:** Must

---

### FR-073 Setting Errors

Count all setting errors by the player.

**Calculation:** Count of set events resulting in errors per player per match

**Priority:** Must

---

## Movement Statistics

### FR-074 Distance Covered

Calculate total distance covered by the player.

**Calculation:** Sum of frame-to-frame displacement in meters using court coordinate mapping

**Priority:** Should

---

### FR-075 Average Speed

Calculate average movement speed.

**Calculation:** Total distance / playing time

**Unit:** km/h

**Priority:** Should

---

### FR-076 Maximum Speed

Calculate maximum sprint speed.

**Calculation:** Rolling 1-second window maximum of instantaneous speeds

**Unit:** km/h

**Priority:** Should

---

### FR-077 Jump Count

Count total jumps by the player.

**Calculation:** Count of jump detection events (FR-043) per player per match

**Priority:** Should

---

### FR-078 Estimated Jump Height

Estimate jump height.

**Calculation:** Using free-fall physics from flight time:

```
jump_height = 0.5 * 9.81 * (flight_time / 2)^2
```

**Output:** Maximum and average jump height per match

**Unit:** centimeters

**Priority:** Should

---

# MODULE 15 — REPORTING

---

### FR-079 Match Report

Generate comprehensive match report.

**Contents:**

| Section | Description |
|---------|-------------|
| Match Summary | Teams, score, date, venue, winner |
| Set Scores | Points per set |
| Team Statistics | Aggregate team performance |
| Player Statistics | Individual performance for all players |
| Event Timeline | Chronological sequence of key events |
| AI Confidence Scores | Confidence levels for detected events |

**Formats:** PDF, Dashboard view

**Priority:** Must

---

### FR-080 Player Report

Generate individual player performance report.

**Contents:**

| Section | Description |
|---------|-------------|
| Player Profile | Name, jersey, position, team |
| Match Statistics | Stats for the specific match |
| Career Statistics | Cumulative stats across all matches |
| Performance Charts | Visual trend graphs |
| Heat Map | Court coverage visualization |
| Strengths/Weaknesses | AI-generated insights |

**Formats:** PDF, Dashboard view

**Priority:** Should

---

### FR-081 Team Report

Generate aggregate team statistics report.

**Contents:**

| Section | Description |
|---------|-------------|
| Team Overview | Name, roster, league |
| Match Results | All match results |
| Team Statistics | Aggregate performance |
| Player Rankings | Players ranked by various metrics |
| Team Trends | Performance over time |

**Formats:** PDF, Dashboard view

**Priority:** Should

---

### FR-082 Tournament Report

Summarize tournament performance.

**Contents:**

| Section | Description |
|---------|-------------|
| Tournament Overview | Name, teams, duration |
| Standings | Final rankings |
| Match Summaries | Results for all matches |
| Top Performers | Best players across tournament |
| Team Comparisons | Side-by-side team analysis |

**Formats:** PDF, Dashboard view

**Priority:** Could

---

# MODULE 16 — ANALYTICS

---

### FR-083 Heat Maps

Show player court coverage.

**Features:**

- Grid-based heat map (12x6 cells)
- Color gradient (blue -> green -> yellow -> red)
- Filter by match, set, time range
- Overlay on court diagram
- Per-player and per-team views

**Priority:** Should

---

### FR-084 Performance Charts

Display trends over time.

**Chart Types:**

| Chart | Description |
|-------|-------------|
| Line Chart | Statistic value over match timeline |
| Bar Chart | Comparison across players |
| Radar Chart | Multi-dimensional player profile |
| Trend Line | Performance trajectory across matches |

**Priority:** Should

---

### FR-085 Player Comparison

Compare two or more players.

**Features:**

- Side-by-side statistics table
- Overlay radar charts
- Select any statistics for comparison
- Filter by match, date range, position

**Priority:** Should

---

### FR-086 Team Comparison

Compare team statistics.

**Features:**

- Side-by-side team statistics
- Aggregate player performance
- Head-to-head match history
- Tactical comparison

**Priority:** Should

---

### FR-087 Match Timeline

Display a chronological sequence of key events.

**Features:**

- Event list sorted by timestamp
- Color-coded by event type
- Filter by event type, team, player
- Click event to view details
- Jump to video timestamp (when replay available)

**Priority:** Should

---

# MODULE 17 — AI INSIGHTS

---

### FR-088 Player of the Match

Compute an AI-based performance score.

**Scoring Formula:**

```
Performance Score = (Kills * 1.0) + (Aces * 1.5) + (Blocks * 1.2) +
                    (Digs * 0.8) + (Receptions * 0.7) + (Assists * 1.0) -
                    (Errors * 0.5) - (Attack Errors * 0.8)
```

**Output:** Ranked list of players with scores

**Priority:** Should

---

### FR-089 Best Server

Identify the best server based on:

- Service aces
- Service errors (lower is better)
- Total serves
- Serve pressure rating

**Priority:** Should

---

### FR-090 Best Attacker

Identify the best attacker based on:

- Kill count
- Kill percentage
- Attack efficiency
- Blocked attacks (lower is better)

**Priority:** Should

---

### FR-091 Best Blocker

Identify the best blocker based on:

- Solo blocks
- Block assists
- Block errors (lower is better)

**Priority:** Should

---

### FR-092 Best Setter

Identify the best setter based on:

- Assist count
- Assist percentage
- Setting errors (lower is better)

**Priority:** Should

---

### FR-093 Best Defender

Identify the best defender based on:

- Dig count
- Save count
- Reception accuracy
- Court coverage (heat map)

**Priority:** Should

---

### FR-094 Performance Prediction

Estimate likely future performance based on historical match data.

**Features:**

- Trend analysis of player statistics
- Predict next-match kill count, ace count, etc.
- Confidence interval for predictions
- Improvement/decline trajectory

**Priority:** Could

---

# MODULE 18 — NOTIFICATIONS

---

### FR-095 Live Alerts

Notify coaches of significant events during live matches.

**Alert Types:**

| Alert | Trigger |
|-------|---------|
| Scoring Streak | Team scores 3+ consecutive points |
| Player Milestone | Player reaches career milestone (100th kill, etc.) |
| Match Point | Match reaches set/match point |
| Close Set | Set score within 2 points at 23+ |

**Priority:** Should

---

### FR-096 Camera Alerts

Warn when camera issues are detected.

**Alert Types:**

| Alert | Trigger |
|-------|---------|
| Camera Disconnected | Video feed lost |
| Low Resolution | Resolution drops below minimum |
| Low FPS | Frame rate drops below threshold |
| Poor Quality | Image quality degrades (blur, darkness) |

**Priority:** Should

---

### FR-097 AI Confidence Alerts

Flag events with low confidence for optional review.

**Behavior:**

- Events with confidence < 0.6 flagged
- Flagged events queued for statistician review
- Statistician can confirm or correct flagged events
- Corrected events update training data for model improvement

**Priority:** Should

---

# MODULE 19 — SYSTEM ADMINISTRATION

---

### FR-098 System Settings

Configure system parameters:

| Setting Category | Parameters |
|-----------------|------------|
| AI Models | Model paths, device selection (CPU/GPU) |
| Detection Thresholds | Player confidence, ball confidence, IOU threshold |
| Camera Parameters | Resolution, FPS, rotation |
| Report Templates | Logo, header text, footer text |
| System Limits | Max upload size, rate limits, session timeout |

**Priority:** Must  
**Access:** Administrator only

---

### FR-099 Database Backup

Support manual and scheduled backups.

**Features:**

- Manual backup trigger
- Scheduled backup (daily, weekly)
- Backup to local storage
- Backup to cloud storage (future)
- Restore from backup
- Backup history and status

**Priority:** Must  
**Access:** Administrator only

---

### FR-100 Audit Logs

Record key administrative actions.

**Logged Events:**

| Event | Details |
|-------|---------|
| User Management | Create, edit, delete, role change |
| Configuration Changes | All system setting modifications |
| System Events | Login, logout, errors, backups |
| Data Changes | Critical data modifications |

**Log Format:**

| Field | Description |
|-------|-------------|
| Timestamp | When the event occurred |
| User | Who performed the action |
| Action | What was done |
| Target | What was affected |
| Details | Additional context |

**Retention:** 90 days minimum

**Priority:** Must  
**Access:** Administrator only

---

## 3.3 Functional Requirement Traceability

Every requirement (FR-001 to FR-100) will be mapped to:

| Mapping Target | Description |
|---------------|-------------|
| Database Tables | Which tables store the data |
| API Endpoints | Which endpoints serve the data |
| Frontend Screens | Which pages display the data |
| AI Modules | Which AI engines produce the data |
| Test Cases | How the requirement is verified |
| Acceptance Criteria | What defines success |

**Traceability Matrix (Summary):**

| Module | Requirements | Database Tables | API Endpoints | Frontend Pages |
|--------|-------------|-----------------|---------------|----------------|
| 1 - Auth | FR-001 to FR-005 | users | /api/auth/* | Login, Register, Settings |
| 2 - Users | FR-006 to FR-009 | users | /api/users/* | Admin Users |
| 3 - Teams | FR-010 to FR-013 | teams | /api/teams/* | Teams, Team Detail |
| 4 - Players | FR-014 to FR-017 | players | /api/players/* | Players, Player Detail |
| 5 - Tournaments | FR-018 to FR-021 | tournaments | /api/tournaments/* | Tournaments |
| 6 - Matches | FR-022 to FR-026 | matches, match_sets | /api/matches/* | Matches, Match Detail |
| 7 - Camera | FR-027 to FR-030 | videos | /api/videos/* | Camera Settings |
| 8 - Player Detection | FR-031 to FR-033 | — (AI internal) | — | — |
| 9 - Ball Detection | FR-034 to FR-036 | — (AI internal) | — | — |
| 10 - Tracking | FR-037 to FR-039 | — (AI internal) | — | — |
| 11 - Jersey OCR | FR-040 to FR-041 | — (AI internal) | — | — |
| 12 - Pose Estimation | FR-042 to FR-044 | — (AI internal) | — | — |
| 13 - Action Recognition | FR-045 to FR-057 | point_events | — | — |
| 14 - Statistics | FR-058 to FR-078 | player_statistics | /api/statistics/* | Stats pages |
| 15 - Reporting | FR-079 to FR-082 | reports | /api/reports/* | Reports |
| 16 - Analytics | FR-083 to FR-087 | heat_maps | /api/analytics/* | Analytics pages |
| 17 - AI Insights | FR-088 to FR-094 | — (computed) | /api/insights/* | Insights page |
| 18 - Notifications | FR-095 to FR-097 | — (real-time) | WebSocket | Notifications |
| 19 - Administration | FR-098 to FR-100 | system_settings, audit_logs | /api/admin/* | Admin panel |

---

**END OF CHAPTER 3**

---

# CHAPTER 4: NON-FUNCTIONAL REQUIREMENTS

---

## 4.1 Introduction

Non-functional requirements define the quality attributes and operational constraints of the AI-Based Volleyball Analytics Platform.

These requirements ensure that the system is:

- Fast
- Reliable
- Secure
- Accurate
- Scalable
- Maintainable
- Easy to use

Each requirement is assigned a unique identifier:

| Prefix | Meaning |
|--------|---------|
| NFR-### | Non-Functional Requirement Number |

---

## 4.2 Performance Requirements

### NFR-001 Video Processing

The system shall support:

- Live webcam input
- IP camera streams (RTSP)
- Recorded videos (MP4, AVI, MOV, MKV)

**Supported Resolutions:**

| Resolution | Status |
|------------|--------|
| 720p (1280x720) | Supported |
| 1080p (1920x1080) | Supported |
| 4K (3840x2160) | Future Version |

### NFR-002 Frame Processing Rate

The system should be capable of processing video in near real time. The achievable frame rate depends on the available hardware (CPU/GPU), camera resolution, and AI model complexity.

**Target Goals:**

| Hardware Configuration | Expected Processed FPS |
|-----------------------|------------------------|
| Development Laptop (CPU only) | 10–20 FPS |
| Mid-range NVIDIA GPU (e.g., RTX 3060) | 20–40 FPS |
| High-end GPU (e.g., RTX 4080/4090) | Up to real-time (30 FPS input) |

### NFR-003 Dashboard Refresh

The dashboard shall refresh automatically.

**Maximum Delay:** Less than 2 seconds from event detection to dashboard update.

### NFR-004 AI Response Time

After detecting an event, the complete chain shall complete within the target:

```
Event Detected (e.g., Spike)
        │
        ▼
Statistics Updated
        │
        ▼
Dashboard Updated
```

**Target:** Under 2 seconds end-to-end latency.

---

## 4.3 Accuracy Requirements

This section is critical as it defines the AI performance targets that will be validated during testing.

### NFR-005 Player Detection Accuracy

**Target:** 95% or higher  
**Metric:** mAP (Mean Average Precision) @ IoU 0.5

### NFR-006 Ball Detection Accuracy

**Target:** 90% or higher  
**Metric:** mAP @ IoU 0.5

### NFR-007 Tracking Accuracy

**Target:** 90% ID consistency  
**Metric:** MOTA (Multiple Object Tracking Accuracy) and ID Switch count  
Tracking should maintain player identities despite occlusions and movement.

### NFR-008 Jersey Recognition

**Target:** 95% accuracy under good lighting conditions.  
**Note:** Accuracy may decrease with motion blur, occlusion, or poor lighting.

### NFR-009 Pose Estimation

**Target:** 90% keypoint detection accuracy.  
**Metric:** PCK (Percentage of Correct Keypoints) @ threshold 0.2

### NFR-010 Event Recognition

**Target:** 85–90% accuracy during evaluation on a representative test dataset.  
**Coverage:** All 16 volleyball action types (serve, spike, block, dig, etc.)

---

## 4.4 Reliability Requirements

### NFR-011 System Availability

**Target:** 99% availability during scheduled matches.

### NFR-012 Camera Failure Recovery

If a camera disconnects, the system should:

- Detect failure within 5 seconds
- Notify administrator via dashboard alert
- Continue operating where possible (e.g., if multi-camera)
- Resume processing automatically when the camera reconnects

### NFR-013 Automatic Saving

Statistics shall be saved continuously (every 30 seconds) to reduce data loss in case of interruption.

### NFR-014 Crash Recovery

Unexpected shutdowns should not corrupt stored match data. Database transactions must ensure atomicity.

---

## 4.5 Scalability Requirements

The architecture should allow future expansion.

**Examples:**

| Phase | Scope |
|-------|-------|
| Current | 1 match at a time |
| Future | Multiple simultaneous matches |
| Future | Multiple courts |
| Future | Cloud deployment |
| Future | National tournaments |

### NFR-015 Modular AI

Every AI module shall be replaceable independently.

**Example:** Swapping YOLO for another detection model should not require rewriting the entire application.

---

## 4.6 Security Requirements

### NFR-016 Authentication

Users must log in. Authentication uses JWT (JSON Web Tokens).

### NFR-017 Authorization

Role-Based Access Control (RBAC):

| Role | Permissions |
|------|-------------|
| Administrator | Full access |
| Coach | Team data, match analysis, reports |
| Analyst | Read access, report generation |
| Statistician | Event review and correction |

### NFR-018 Password Security

Passwords must never be stored in plain text.  
**Algorithm:** BCrypt with minimum 12 rounds.

### NFR-019 HTTPS

When deployed online, all communication must use HTTPS (TLS 1.2+).

### NFR-020 SQL Injection Protection

The backend shall use parameterized queries or an ORM (SQLAlchemy) to prevent SQL injection.

### NFR-021 API Validation

All incoming requests must be validated before processing using Pydantic schemas.

---

## 4.7 Usability Requirements

### NFR-022 User-Friendly Interface

The interface shall be intuitive. No AI knowledge required to operate the system.

### NFR-023 Dashboard Simplicity

A coach should locate any important statistic within three clicks.

### NFR-024 Responsive Design

Support:

- Desktop
- Laptop
- Tablet

### NFR-025 Dark Mode

Optional dark theme support.

---

## 4.8 Maintainability Requirements

### NFR-026 Modular Code

Each module should be independent:

```
Statistics Engine
    ├── Separate folder
    ├── Separate tests
    ├── Separate documentation
```

### NFR-027 Documentation

Every module shall include:

| Item | Description |
|------|-------------|
| Purpose | What the module does |
| Inputs | Data received |
| Outputs | Data produced |
| Dependencies | External and internal |
| Test Procedures | How to verify |

### NFR-028 Coding Standards

| Language | Standard |
|----------|----------|
| Python | PEP 8 |
| JavaScript/React | ESLint + Prettier |

---

## 4.9 Portability Requirements

| Environment | Status |
|-------------|--------|
| Development (Windows) | Supported |
| Deployment (Linux/Ubuntu) | Supported |
| Docker Containerization | Required for production |

---

## 4.10 Compatibility Requirements

**Supported Browsers:**

| Browser | Version |
|---------|---------|
| Chrome | Latest 2 versions |
| Edge | Latest 2 versions |
| Firefox | Latest 2 versions |
| Safari | Future support |

---

## 4.11 Database Requirements

**Database Engine:** MySQL 8.0+

**Requirements:**

| Requirement | Implementation |
|-------------|----------------|
| ACID Compliance | InnoDB storage engine |
| Automatic Backups | Scheduled mysqldump |
| Foreign Key Constraints | Enforced on all relationships |
| Indexing | Optimized for query performance |
| Connection Pooling | SQLAlchemy pool configuration |

---

## 4.12 Logging Requirements

The system shall log the following events:

| Event Category | Events |
|----------------|--------|
| Authentication | User login, logout, failed attempts |
| Match Control | Match started, paused, resumed, ended |
| Camera | Camera connected, disconnected, quality changes |
| AI Errors | Detection failures, tracking losses, OCR failures |
| Database | Connection errors, query timeouts, deadlocks |
| API | All API requests (method, path, status, latency) |

**Log Format:** Structured JSON for parsing and analysis.

---

## 4.13 Monitoring Requirements

The administrator dashboard shall monitor:

| Metric | Description |
|--------|-------------|
| CPU Usage | Current and historical |
| GPU Usage | If available (NVIDIA SMI) |
| RAM Usage | Current and peak |
| FPS | Current processing frame rate |
| Camera Status | Connected / Disconnected / Degraded |
| AI Status | Running / Paused / Error |
| Database Connection | Active / Idle / Failed |
| API Health | Response times, error rates |

---

## 4.14 Backup Requirements

| Type | Frequency | Storage |
|------|-----------|---------|
| Automatic | Daily | Separate backup directory |
| Manual | Any time | Administrator triggered |
| Retention | 30 days minimum | Configurable |

---

## 4.15 AI Model Requirements

Each model shall include metadata:

| Metadata Field | Description |
|----------------|-------------|
| Version | Semantic version (e.g., 1.2.0) |
| Training Date | When the model was trained |
| Accuracy | Overall accuracy on test set |
| Precision | Per-class precision |
| Recall | Per-class recall |
| F1 Score | Per-class F1 |
| Dataset Version | Reference to dataset used |

---

## 4.16 Dataset Requirements

Training datasets shall include diversity across:

| Category | Requirement |
|----------|-------------|
| Players | Different body types, heights, clothing |
| Ball | Different brands, colors, lighting |
| Court | Indoor, outdoor, different line colors |
| Net | Standard and non-standard nets |
| Camera Angles | Side, corner, elevated, broadcast |
| Lighting | Bright, dim, mixed, shadows |
| Match Types | Indoor, beach (future), male, female, youth, professional |

---

## 4.17 Legal and Ethical Requirements

The system should:

- Respect player privacy (no facial recognition, no biometric data)
- Clearly identify AI-generated insights (not official decisions)
- Avoid making decisions that replace officials or coaches
- Comply with applicable data protection laws (GDPR, local regulations) when personal information is stored
- Provide data export and deletion capabilities for users

---

## 4.18 Future Expandability

The architecture should allow future addition of:

| Feature | Description |
|---------|-------------|
| Multi-Camera Synchronization | Fuse views from multiple angles |
| 3D Player Tracking | Volumetric tracking with depth |
| AI Tactical Recommendations | Suggest rotations, serve targets |
| Wearable Sensor Integration | Combine video with IMU data |
| Mobile Applications | Native iOS/Android apps |
| Cloud Deployment | AWS/GCP/Azure hosting |
| Live Broadcast Overlays | Real-time graphics for streaming |
| Referee Decision Support | Net touch, line call assistance |

---

## 4.19 Quality Assurance

Before release, every module shall pass:

| Test Level | Description |
|------------|-------------|
| Unit Testing | Individual functions and classes |
| Integration Testing | Module interactions, API contracts |
| System Testing | End-to-end workflows |
| User Acceptance Testing (UAT) | Real users validate functionality |
| Performance Testing | Load, stress, and latency benchmarks |

---

## 4.20 Success Criteria

The project will be considered successful if it:

- Detects players and the volleyball reliably
- Tracks players consistently throughout a match
- Recognizes core volleyball actions with acceptable accuracy
- Automatically generates player and team statistics
- Displays live analytics through the dashboard
- Produces downloadable match reports
- Operates robustly during a complete match under expected conditions

---

**END OF CHAPTER 4**

---

# CHAPTER 5: USE CASE ANALYSIS

---

## 5.1 Introduction

This chapter defines the use cases for the AI-Based Volleyball Analytics Platform. Use cases describe the interactions between actors (users and external systems) and the system to achieve specific goals. Each use case is documented with its actors, preconditions, main flow, alternative flows, and postconditions.

---

## 5.2 Actors

| Actor | Description |
|-------|-------------|
| **Administrator** | Full system access; manages users, teams, players, tournaments, system settings, and backups |
| **Coach** | Manages team and players; starts/pauses/ends matches; views live statistics and reports |
| **Analyst** | Analyzes player and team performance; generates custom reports; views heat maps and trends |
| **Statistician** | Reviews and corrects AI-generated events; validates statistics |
| **Viewer** | Read-only access to match information and public statistics |
| **Camera System** | External hardware providing video streams (RTSP, USB, IP Webcam) |
| **AI Pipeline** | Internal automated system that processes video and generates events |

---

## 5.3 Use Case Diagram Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    VOLLEYBALL ANALYTICS PLATFORM                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐          ┌──────────┐          ┌──────────┐                  │
│  │Administrator│◄──────►│  System  │◄──────►│   Coach  │                  │
│  └──────────┘          └──────────┘          └──────────┘                  │
│       │                     │                     │                        │
│       │              ┌──────┴──────┐             │                        │
│       │              │             │             │                        │
│  ┌────▼────┐    ┌─────▼────┐  ┌─────▼────┐  ┌────▼────┐                  │
│  │ Analyst │    │Statist'n │  │  Viewer  │  │ Camera  │                  │
│  └─────────┘    └──────────┘  └──────────┘  │ System  │                  │
│                                            └─────────┘                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5.4 Use Case Specifications

### UC-01: User Login

| Field | Description |
|-------|-------------|
| **Actor** | Administrator, Coach, Analyst, Statistician, Viewer |
| **Description** | User authenticates with email and password to access the system |
| **Preconditions** | User account exists and is active |
| **Main Flow** | 1. User enters email and password<br>2. System validates credentials<br>3. System generates JWT access token and refresh token<br>4. System returns user profile and tokens<br>5. User is redirected to dashboard |
| **Alternative Flows** | **A1: Invalid credentials** – System returns error, allows retry (max 5 attempts)<br>**A2: Account inactive** – System returns account disabled message |
| **Postconditions** | User is authenticated; tokens stored on client |
| **Priority** | Must |

---

### UC-02: User Logout

| Field | Description |
|-------|-------------|
| **Actor** | Administrator, Coach, Analyst, Statistician, Viewer |
| **Description** | User ends their session |
| **Preconditions** | User is logged in |
| **Main Flow** | 1. User clicks logout<br>2. System invalidates refresh token<br>3. System clears client-side tokens<br>4. User redirected to login page |
| **Postconditions** | Session ended; tokens invalidated |
| **Priority** | Must |

---

### UC-03: Forgot Password

| Field | Description |
|-------|-------------|
| **Actor** | Administrator, Coach, Analyst, Statistician, Viewer |
| **Description** | User requests password reset |
| **Preconditions** | User account exists with registered email |
| **Main Flow** | 1. User enters email on forgot password page<br>2. System sends reset link to email<br>3. User clicks link<br>4. User enters new password<br>5. System updates password hash<br>6. System invalidates all refresh tokens |
| **Alternative Flows** | **A1: Email not found** – System shows generic success message (security)<br>**A2: Link expired** – System prompts for new reset request |
| **Postconditions** | Password updated; all sessions invalidated |
| **Priority** | Must |

---

### UC-04: Change Password

| Field | Description |
|-------|-------------|
| **Actor** | Administrator, Coach, Analyst, Statistician, Viewer |
| **Description** | Authenticated user changes their password |
| **Preconditions** | User is logged in |
| **Main Flow** | 1. User navigates to settings<br>2. User enters current password<br>3. User enters new password (twice)<br>4. System validates current password<br>5. System validates new password policy<br>6. System updates password hash<br>7. System invalidates all refresh tokens |
| **Alternative Flows** | **A1: Current password incorrect** – Error message<br>**A2: New password fails policy** – Policy requirements displayed |
| **Postconditions** | Password updated; re-login required |
| **Priority** | Must |

---

### UC-05: Manage Users

| Field | Description |
|-------|-------------|
| **Actor** | Administrator |
| **Description** | Create, edit, view, and deactivate user accounts |
| **Preconditions** | Administrator logged in |
| **Main Flow** | 1. Admin navigates to User Management<br>2. **Create:** Admin clicks "Add User", fills form, submits<br>3. **Edit:** Admin selects user, modifies fields, saves<br>4. **View:** Admin browses paginated, filterable user list<br>5. **Deactivate:** Admin selects user, confirms deactivation |
| **Alternative Flows** | **A1: Duplicate email** – System rejects with error<br>**A2: Self-deactivation** – System prevents admin from deactivating own account |
| **Postconditions** | User database updated |
| **Priority** | Must |

---

### UC-06: Manage Teams

| Field | Description |
|-------|-------------|
| **Actor** | Administrator, Coach |
| **Description** | Create, edit, view, and deactivate teams |
| **Preconditions** | User logged in with appropriate role |
| **Main Flow** | 1. User navigates to Teams<br>2. **Create:** Fill team form (name, short name, logo, coach, venue, league, country)<br>3. **Edit:** Modify any field<br>4. **View:** Team profile with roster, matches, statistics<br>5. **Deactivate:** Soft delete team |
| **Alternative Flows** | **A1: Delete team with active players** – System warns and requires reassignment |
| **Postconditions** | Team data updated |
| **Priority** | Must |

---

### UC-07: Manage Players

| Field | Description |
|-------|-------------|
| **Actor** | Administrator, Coach |
| **Description** | Create, edit, view, and deactivate players |
| **Preconditions** | Team exists |
| **Main Flow** | 1. User navigates to Players (or Team → Players)<br>2. **Create:** Fill player form (name, jersey, position, height, weight, DOB, team, photo)<br>3. **Edit:** Modify any field<br>4. **View:** Player profile with career stats, match history, heat maps, performance graphs<br>5. **Deactivate:** Soft delete player |
| **Alternative Flows** | **A1: Duplicate jersey number in team** – System rejects |
| **Postconditions** | Player data updated |
| **Priority** | Must |

---

### UC-08: Manage Tournaments

| Field | Description |
|-------|-------------|
| **Actor** | Administrator |
| **Description** | Create tournaments, register teams, generate fixtures, view standings |
| **Preconditions** | Teams exist |
| **Main Flow** | 1. Admin creates tournament (name, location, organizer, season)<br>2. Admin registers teams to tournament<br>3. Admin generates fixtures (round-robin, elimination, or manual)<br>4. System displays standings with points, sets won, point difference |
| **Alternative Flows** | **A1: Odd number of teams in round-robin** – System adds bye week |
| **Postconditions** | Tournament structure created |
| **Priority** | Should |

---

### UC-09: Create Match

| Field | Description |
|-------|-------------|
| **Actor** | Administrator, Coach |
| **Description** | Schedule a new match |
| **Preconditions** | Home and away teams exist |
| **Main Flow** | 1. User navigates to Matches → Create<br>2. Fill form: home team, away team, venue, date, time, tournament (optional), sets format (best-of-3/5)<br>3. System creates match in "scheduled" status<br>4. User can assign cameras to match |
| **Alternative Flows** | **A1: Same team selected for both** – System prevents selection |
| **Postconditions** | Match created and visible in match list |
| **Priority** | Must |

---

### UC-10: Start Match

| Field | Description |
|-------|-------------|
| **Actor** | Administrator, Coach |
| **Description** | Begin live match processing |
| **Preconditions** | Match is in "scheduled" status; cameras configured |
| **Main Flow** | 1. User opens Match Detail page<br>2. User clicks "Start Match"<br>3. System starts video capture from assigned camera<br>4. System starts AI pipeline (detection, tracking, event recognition)<br>5. System starts match timer<br>6. System begins real-time statistics calculation<br>6. Match status changes to "live" |
| **Alternative Flows** | **A1: Camera not connected** – System warns but allows start<br>**A2: AI pipeline fails to start** – System shows error, match remains scheduled |
| **Postconditions** | Live processing active; dashboard shows real-time data |
| **Priority** | Must |

---

### UC-11: Pause Match

| Field | Description |
|-------|-------------|
| **Actor** | Administrator, Coach |
| **Description** | Temporarily halt match processing |
| **Preconditions** | Match is in "live" status |
| **Main Flow** | 1. User clicks "Pause Match"<br>2. System pauses AI processing<br>3. System pauses match timer<br>4. System preserves all state<br>5. Match status changes to "paused" |
| **Postconditions** | Processing paused; resume possible |
| **Priority** | Must |

---

### UC-12: Resume Match

| Field | Description |
|-------|-------------|
| **Actor** | Administrator, Coach |
| **Description** | Continue paused match |
| **Preconditions** | Match is in "paused" status |
| **Main Flow** | 1. User clicks "Resume Match"<br>2. System resumes AI processing from pause point<br>3. System resumes match timer<br>4. Match status changes to "live" |
| **Postconditions** | Live processing continues |
| **Priority** | Must |

---

### UC-13: End Match

| Field | Description |
|-------|-------------|
| **Actor** | Administrator, Coach |
| **Description** | Conclude match and finalize statistics |
| **Preconditions** | Match is in "live" or "paused" status |
| **Main Flow** | 1. User clicks "End Match"<br>2. System stops AI processing<br>2. System stops camera capture<br>3. System finalizes all statistics<br>4. System determines winner based on sets<br>5. System generates match report (PDF)<br>6. System updates player career statistics<br>7. Match status changes to "completed" |
| **Alternative Flows** | **A1: Match not complete (fewer sets than required)** – System warns but allows end |
| **Postconditions** | Match finalized; reports available |
| **Priority** | Must |

---

### UC-14: Configure Camera

| Field | Description |
|-------|-------------|
| **Actor** | Administrator |
| **Description** | Register and calibrate camera sources |
| **Preconditions** | Camera hardware available |
| **Main Flow** | 1. Admin navigates to Camera Settings<br>2. **Register:** Add camera (USB, RTSP URL, IP Webcam)<br>3. **Calibrate:** Select court points, net position, reference markers<br>4. **Test:** Preview live feed with overlay<br>5. **Assign:** Link camera to match |
| **Alternative Flows** | **A1: Calibration failed** – System allows manual point entry |
| **Postconditions** | Camera ready for match |
| **Priority** | Must |

---

### UC-15: View Live Dashboard

| Field | Description |
|-------|-------------|
| **Actor** | Coach, Analyst, Administrator |
| **Description** | Watch real-time match statistics and video |
| **Preconditions** | Match is in "live" status |
| **Main Flow** | 1. User opens Live Match page<br>2. System displays live video feed<br>3. System shows real-time scoreboard<br>4. System shows live player statistics table<br>5. System displays event feed (recent actions)<br>6. System auto-refreshes every 2 seconds |
| **Alternative Flows** | **A1: Camera disconnected** – Dashboard shows alert, last frame |
| **Postconditions** | User views live analytics |
| **Priority** | Must |

---

### UC-16: View Match Statistics

| Field | Description |
|-------|-------------|
| **Actor** | Coach, Analyst, Administrator, Viewer |
| **Description** | View detailed statistics for a completed match |
| **Preconditions** | Match is "completed" |
| **Main Flow** | 1. User opens Match Detail → Statistics<br>2. System displays: team stats, player stats, set scores<br>3. User filters by team, player, stat category<br>4. User views heat maps, performance charts |
| **Postconditions** | Statistics displayed |
| **Priority** | Must |

---

### UC-17: View Player Profile

| Field | Description |
|-------|-------------|
| **Actor** | Coach, Analyst, Administrator, Viewer |
| **Description** | View individual player career and match statistics |
| **Preconditions** | Player exists |
| **Main Flow** | 1. User navigates to Players → Select player<br>2. System displays: profile info, career totals, match history<br>3. User selects specific match for per-match stats<br>4. System shows heat maps, performance trends, jump/speed stats |
| **Postconditions** | Player profile displayed |
| **Priority** | Must |

---

### UC-18: Generate Report

| Field | Description |
|-------|-------------|
| **Actor** | Coach, Analyst, Administrator |
| **Description** | Create downloadable PDF/CSV reports |
| **Preconditions** | Match completed |
| **Main Flow** | 1. User opens Reports page<br>2. Selects report type: Match, Player, Team, Tournament<br>3. Selects matches/players/teams to include<br>4. Clicks "Generate"<br>5. System creates report, stores file<br>6. User downloads PDF or CSV |
| **Alternative Flows** | **A1: Report generation fails** – System shows error, allows retry |
| **Postconditions** | Report file available for download |
| **Priority** | Must |

---

### UC-19: Compare Players

| Field | Description |
|-------|-------------|
| **Actor** | Coach, Analyst, Administrator |
| **Description** | Side-by-side comparison of two or more players |
| **Preconditions** | Players exist |
| **Main Flow** | 1. User opens Analytics → Player Comparison<br>2. Selects 2–5 players<br>3. Selects statistics to compare<br>3. System displays: side-by-side table, overlay radar chart, trend lines |
| **Postconditions** | Comparison displayed |
| **Priority** | Should |

---

### UC-20: Review AI Events (Statistician)

| Field | Description |
|-------|-------------|
| **Actor** | Statistician |
| **Description** | Validate or correct AI-detected events |
| **Preconditions** | Match completed or live |
| **Main Flow** | 1. Statistician opens Event Review page<br>2. System shows events with confidence < 0.6 flagged<br>3. For each flagged event: view video clip, confirm/correct event type<br>4. System updates statistics on correction<br>5. Corrected events added to training dataset |
| **Postconditions** | Events validated; statistics corrected |
| **Priority** | Should |

---

### UC-21: Configure System Settings

| Field | Description |
|-------|-------------|
| **Actor** | Administrator |
| **Description** | Configure AI models, detection thresholds, camera parameters, report templates |
| **Preconditions** | Administrator logged in |
| **Main Flow** | 1. Admin opens Settings → System Configuration<br>2. **AI Models:** Select model files, device (CPU/GPU)<br>3. **Thresholds:** Player conf, ball conf, IOU, tracking buffer<br>4. **Camera:** Default resolution, FPS, rotation<br>5. **Reports:** Logo, header, footer templates<br>6. Admin saves; system reloads configuration |
| **Postconditions** | Configuration updated |
| **Priority** | Must |

---

### UC-22: Backup Database

| Field | Description |
|-------|-------------|
| **Actor** | Administrator |
| **Description** | Create and manage database backups |
| **Preconditions** | Administrator logged in |
| **Main Flow** | 1. Admin opens Settings → Backup<br>2. **Manual Backup:** Click "Backup Now"<br>3. **Scheduled:** Enable/disable daily/weekly schedule<br>4. System shows backup history with status and size<br>5. **Restore:** Select backup, confirm restore |
| **Alternative Flows** | **A1: Restore fails** – System shows error, current DB unchanged |
| **Postconditions** | Backup created or restored |
| **Priority** | Must |

---

### UC-23: View Audit Logs

| Field | Description |
|-------|-------------|
| **Actor** | Administrator |
| **Description** | Review system audit trail |
| **Preconditions** | Administrator logged in |
| **Main Flow** | 1. Admin opens Settings → Audit Logs<br>2. System displays paginated log entries<br>3. Filter by: user, action type, date range, target entity<br>4. View details: timestamp, user, action, target, details |
| **Postconditions** | Audit logs displayed |
| **Priority** | Must |

---

### UC-24: AI Video Processing (Automated)

| Field | Description |
|-------|-------------|
| **Actor** | AI Pipeline (System) |
| **Description** | Continuous video analysis during live match |
| **Preconditions** | Match started; camera providing frames |
| **Main Flow** | 1. For each frame:<br>   a. Court detection<br>   b. Player detection (YOLO)<br>   c. Ball detection (YOLO)<br>   d. Player tracking (ByteTrack)<br>   e. Ball tracking<br>   f. Pose estimation (MediaPipe)<br>   g. Jersey OCR<br>   h. Event recognition (rules + LSTM)<br>   i. Statistics update<br>   j. Database write<br>   k. Dashboard push (WebSocket)<br>2. Repeat until match ends |
| **Alternative Flows** | **A1: Frame processing timeout** – Skip frame, log warning<br>**A2: Camera disconnect** – Buffer frames, alert, attempt reconnect |
| **Postconditions** | Events detected, statistics updated, dashboard refreshed |
| **Priority** | Must |

---

### UC-25: Camera Health Monitoring (Automated)

| Field | Description |
|-------|-------------|
| **Actor** | System |
| **Description** | Continuous monitoring of camera feed quality |
| **Preconditions** | Camera configured |
| **Main Flow** | 1. System checks camera every 5 seconds<br>2. Measures: FPS, resolution, frame quality<br>3. If metrics below threshold:<br>   a. Log warning<br>   b. Show dashboard alert<br>   c. Notify admin (email/notification)<br>4. If feed lost:<br>   a. Mark camera disconnected<br>   b. Pause AI processing for that camera<br>   c. Attempt reconnect every 10 seconds |
| **Postconditions** | Camera status known; alerts raised if needed |
| **Priority** | Should |

---

## 5.5 Use Case to Functional Requirement Traceability

| Use Case | Functional Requirements |
|----------|------------------------|
| UC-01 Login | FR-001 |
| UC-02 Logout | FR-002 |
| UC-03 Forgot Password | FR-003 |
| UC-04 Change Password | FR-004 |
| UC-05 Manage Users | FR-005, FR-006, FR-007, FR-008, FR-009 |
| UC-06 Manage Teams | FR-010, FR-011, FR-012, FR-013 |
| UC-07 Manage Players | FR-014, FR-015, FR-016, FR-017 |
| UC-08 Manage Tournaments | FR-018, FR-019, FR-020, FR-021 |
| UC-09 Create Match | FR-022 |
| UC-10 Start Match | FR-023 |
| UC-11 Pause Match | FR-024 |
| UC-12 Resume Match | FR-025 |
| UC-13 End Match | FR-026 |
| UC-14 Configure Camera | FR-027, FR-028, FR-029, FR-030 |
| UC-15 View Live Dashboard | FR-031–FR-094 (real-time) |
| UC-16 View Match Statistics | FR-058–FR-087 |
| UC-17 View Player Profile | FR-017, FR-058–FR-087 |
| UC-18 Generate Report | FR-079–FR-082 |
| UC-19 Compare Players | FR-085 |
| UC-20 Review AI Events | FR-097 |
| UC-21 Configure Settings | FR-098 |
| UC-22 Backup Database | FR-099 |
| UC-23 View Audit Logs | FR-100 |
| UC-24 AI Video Processing | FR-031–FR-078 |
| UC-25 Camera Health Monitoring | FR-096 |

---

## 5.6 Use Case Priority Summary

| Priority | Use Cases |
|----------|-----------|
| **Must** | UC-01, UC-02, UC-03, UC-04, UC-05, UC-06, UC-07, UC-09, UC-10, UC-11, UC-12, UC-13, UC-14, UC-15, UC-16, UC-17, UC-18, UC-21, UC-22, UC-23, UC-24 |
| **Should** | UC-08, UC-19, UC-20, UC-25 |
| **Could** | — |

---

**END OF CHAPTER 5**

---

# CHAPTER 6: DATABASE ARCHITECTURE & ENTITY RELATIONSHIP DESIGN (ERD)

---

## 6.1 Database Philosophy

The database must support:

- Thousands of matches
- Millions of AI detections
- Hundreds of clubs
- Thousands of players
- Multiple leagues
- Multiple seasons
- Future AI models
- Live analytics
- Historical analytics

This means the database must be **normalized, indexed, and designed for future expansion**.

### Database Technology

**Primary Database: PostgreSQL**

| Reason | Detail |
|--------|--------|
| JSON Support | Native JSONB for flexible AI metadata |
| Advanced Indexing | GIN, GiST, BRIN for spatial and array data |
| Partitioning | Native table partitioning for large datasets |
| Scalability | Horizontal scaling via Citus, read replicas |
| ACID Compliance | Full transactional integrity |
| Extensions | PostGIS (future), pgvector (AI embeddings) |

**Cache Layer: Redis**

| Use Case | Detail |
|----------|--------|
| Live Statistics | Real-time scoreboard, player metrics |
| Session Storage | JWT sessions, user preferences |
| AI Event Buffering | Batch writes from AI workers |
| Dashboard Updates | WebSocket message queuing |

**Object Storage (Future)**

| Provider | Use Case |
|----------|----------|
| AWS S3 | Production cloud storage |
| Azure Blob Storage | Azure deployments |
| MinIO | Self-hosted, S3-compatible |

**Stored in Object Storage:**

- Match videos
- Extracted frame images
- AI model artifacts
- Generated reports (PDF/CSV)

---

## 6.2 Database Architecture

```
┌─────────────┐
│  Frontend   │
└──────┬──────┘
       │ HTTPS
       ▼
┌─────────────┐
│ API Gateway │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  Backend Services   │
│  (Microservices)    │
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    ▼             ▼
┌────────┐   ┌────────┐
│PostgreSQL│  │ Redis  │
│ Primary │   │ Cache  │
└────────┘   └────────┘
    │
    ▼
┌──────────────┐
│Object Storage│
│ (Videos,     │
│ Models,      │
│ Reports)     │
└──────────────┘
```

---

## 6.3 Main Database Modules (Logical Domains)

| Domain | Description | Table Count (Est.) |
|--------|-------------|-------------------|
| Authentication | Users, roles, sessions, API keys | 6 |
| Organization | Organizations, clubs, staff profiles | 6 |
| Competition | Seasons, tournaments, venues, matches, lineups | 8 |
| Player Management | Players, positions, contracts, media, transfers | 6 |
| AI Processing | Detections, tracking, pose, ball, jersey, actions, confidence | 7 |
| Statistics | Player/team stats, rankings, heatmaps, movement, jumps | 7 |
| Reporting | Generated reports, exports, templates | 3 |
| System & Monitoring | Audit logs, API logs, AI logs, error logs, notifications | 5 |

**Total: ~45 Tables**

---

## 6.4 Complete Table Specifications

### 6.4.1 Authentication Module

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `users` | Core user accounts | `id`, `email`, `password_hash`, `full_name`, `role_id`, `is_active`, `created_at`, `updated_at` |
| `roles` | Role definitions | `id`, `name`, `description`, `is_system` |
| `permissions` | Granular permissions | `id`, `resource`, `action`, `description` |
| `role_permissions` | Many-to-many role↔permission | `role_id`, `permission_id` |
| `user_sessions` | Active login sessions | `id`, `user_id`, `token_hash`, `ip_address`, `user_agent`, `expires_at`, `created_at` |
| `refresh_tokens` | JWT refresh tokens | `id`, `user_id`, `token_hash`, `expires_at`, `revoked_at`, `created_at` |
| `api_keys` | Service-to-service auth | `id`, `organization_id`, `key_hash`, `name`, `scopes`, `expires_at`, `last_used_at` |

---

### 6.4.2 Organization Module

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `organizations` | Clubs, federations, schools | `id`, `name`, `type`, `country`, `city`, `logo_url`, `settings_json`, `created_at` |
| `clubs` | Volleyball clubs | `id`, `organization_id`, `name`, `short_name`, `logo_url`, `home_venue_id`, `primary_color`, `secondary_color`, `founded_year` |
| `coaches` | Coach profiles | `id`, `user_id`, `club_id`, `certification_level`, `specialization`, `bio` |
| `analysts` | Analyst profiles | `id`, `user_id`, `club_id`, `specialization`, `bio` |
| `statisticians` | Statistician profiles | `id`, `user_id`, `club_id`, `certification`, `bio` |
| `venues` | Match locations | `id`, `organization_id`, `name`, `address`, `capacity`, `court_count`, `indoor` |

---

### 6.4.3 Competition Module

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `seasons` | Competition seasons | `id`, `organization_id`, `name`, `start_date`, `end_date`, `is_active` |
| `tournaments` | Tournament definitions | `id`, `season_id`, `name`, `format`, `venue_id`, `start_date`, `end_date`, `status` |
| `courts` | Court definitions | `id`, `venue_id`, `name`, `number`, `calibration_json` |
| `matches` | Match metadata | `id`, `tournament_id`, `court_id`, `home_team_id`, `away_team_id`, `match_date`, `sets_format`, `status`, `winner_team_id`, `home_score`, `away_score`, `video_id`, `processing_status`, `created_at` |
| `match_sets` | Individual sets | `id`, `match_id`, `set_number`, `home_points`, `away_points`, `duration_seconds`, `status`, `winner_team_id` |
| `lineups` | Starting lineups | `id`, `match_set_id`, `team_id`, `player_id`, `position`, `jersey_number`, `is_libero`, `is_captain`, `rotation_order` |
| `substitutions` | Substitution events | `id`, `match_set_id`, `team_id`, `player_in_id`, `player_out_id`, `timestamp_seconds`, `set_score_home`, `set_score_away` |

---

### 6.4.4 Player Management Module

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `players` | Player profiles | `id`, `club_id`, `first_name`, `last_name`, `date_of_birth`, `height_cm`, `weight_kg`, `gender`, `nationality`, `photo_url`, `is_active`, `created_at` |
| `player_positions` | Position history | `id`, `player_id`, `position`, `is_primary`, `effective_from`, `effective_to` |
| `player_contracts` | Contract history | `id`, `player_id`, `club_id`, `start_date`, `end_date`, `contract_type`, `salary_band` |
| `player_media` | Photos and videos | `id`, `player_id`, `type`, `url`, `description`, `uploaded_at` |
| `player_transfers` | Transfer history | `id`, `player_id`, `from_club_id`, `to_club_id`, `transfer_date`, `transfer_type`, `fee_details` |
| `player_medical` | Future medical data | `id`, `player_id`, `record_type`, `date`, `details_json`, `restricted_access` |

---

### 6.4.5 AI Processing Module

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `detections` | Raw object detections per frame | `id`, `match_id`, `frame_number`, `timestamp_ms`, `object_type`, `bbox`, `confidence`, `model_version` |
| `tracking` | Tracked object history | `id`, `match_id`, `track_id`, `object_type`, `frame_start`, `frame_end`, `positions_json`, `team_assignment` |
| `pose_estimations` | Skeletal keypoints per player per frame | `id`, `match_id`, `track_id`, `frame_number`, `keypoints_json`, `confidence_scores_json`, `model_version` |
| `ball_tracking` | Ball trajectory data | `id`, `match_id`, `track_id`, `frame_number`, `position_3d`, `velocity_3d`, `speed_kmh`, `contact_player_track_id` |
| `jersey_predictions` | OCR results | `id`, `match_id`, `track_id`, `frame_number`, `predicted_number`, `confidence`, `confirmed` |
| `action_predictions` | Recognized volleyball events | `id`, `match_id`, `set_id`, `track_id`, `action_type`, `timestamp_seconds`, `frame_number`, `confidence`, `outcome`, `court_position`, `metadata_json` |
| `confidence_scores` | AI confidence values per event | `id`, `action_prediction_id`, `detection_conf`, `tracking_conf`, `pose_conf`, `overall_conf`, `flags_json` |

---

### 6.4.6 Statistics Module

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `player_statistics` | Career aggregate statistics | `id`, `player_id`, `club_id`, `season_id`, `matches_played`, `sets_played`, `totals_json`, `averages_json`, `updated_at` |
| `player_match_statistics` | Per-match player stats | `id`, `match_id`, `player_id`, `set_id`, `stat_category`, `stat_name`, `value`, `period` |
| `team_statistics` | Career aggregate team stats | `id`, `team_id`, `season_id`, `matches_played`, `wins`, `losses`, `sets_won`, `sets_lost`, `totals_json`, `updated_at` |
| `team_match_statistics` | Per-match team stats | `id`, `match_id`, `team_id`, `set_id`, `stat_category`, `stat_name`, `value` |
| `rankings` | Player and team rankings | `id`, `entity_type`, `entity_id`, `season_id`, `metric`, `value`, `rank`, `calculated_at` |
| `heatmaps` | Court coverage data | `id`, `match_id`, `player_id`, `set_id`, `grid_json`, `zone_aggregates_json`, `total_events`, `resolution` |
| `movement_metrics` | Distance and speed | `id`, `match_id`, `player_id`, `set_id`, `total_distance_m`, `avg_speed_kmh`, `max_speed_kmh`, `sprint_count`, `sprint_distance_m` |
| `jump_metrics` | Jump counts and heights | `id`, `match_id`, `player_id`, `set_id`, `jump_count`, `avg_height_cm`, `max_height_cm`, `attack_jumps`, `block_jumps`, `serve_jumps` |

---

### 6.4.7 Reporting Module

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `reports` | Generated reports | `id`, `match_id`, `report_type`, `format`, `file_url`, `file_size_bytes`, `generated_by`, `status`, `created_at` |
| `report_templates` | Report templates | `id`, `organization_id`, `name`, `template_json`, `is_default` |
| `report_exports` | Export history | `id`, `report_id`, `exported_by`, `format`, `file_url`, `created_at` |

---

### 6.4.8 System & Monitoring Module

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `audit_logs` | Administrative actions | `id`, `user_id`, `action`, `entity_type`, `entity_id`, `details_json`, `ip_address`, `created_at` |
| `api_logs` | API request logs | `id`, `method`, `path`, `status_code`, `user_id`, `ip_address`, `duration_ms`, `request_size`, `response_size`, `created_at` |
| `ai_logs` | AI processing events | `id`, `match_id`, `stage`, `event_type`, `details_json`, `confidence`, `processing_time_ms`, `created_at` |
| `error_logs` | Errors and exceptions | `id`, `service`, `error_type`, `message`, `stack_trace`, `context_json`, `severity`, `resolved`, `created_at` |
| `notifications` | System notifications | `id`, `user_id`, `type`, `title`, `message`, `data_json`, `read`, `created_at` |

---

## 6.5 Core Entity Relationship Diagram

```
organizations (1) ───< (N) clubs
organizations (1) ───< (N) venues
organizations (1) ───< (N) users

clubs (1) ───< (N) teams
clubs (1) ───< (N) players
clubs (1) ───< (N) coaches
clubs (1) ───< (N) analysts
clubs (1) ───< (N) statisticians

teams (1) ───< (N) players
teams (1) ───< (N) matches (home)
teams (1) ───< (N) matches (away)

matches (1) ───< (N) match_sets
matches (1) ───< (N) lineups
matches (1) ───< (N) substitutions
matches (1) ───< (N) detections
matches (1) ───< (N) tracking
matches (1) ───< (N) action_predictions
matches (1) ───< (N) player_match_statistics
matches (1) ───< (N) team_match_statistics
matches (1) ───< (N) heatmaps
matches (1) ───< (N) movement_metrics
matches (1) ───< (N) jump_metrics
matches (1) ───< (N) reports

tournaments (1) ───< (N) matches
seasons (1) ───< (N) tournaments
seasons (1) ───< (N) player_statistics
seasons (1) ───< (N) team_statistics
seasons (1) ───< (N) rankings
```

---

## 6.6 Match Data Flow & Storage Strategy

### End-to-End Data Flow

```
Video Frame (Input)
        │
        ▼
┌────────────────────┐
│  Detection Stage   │ ──► detections table
│  (YOLO)            │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│  Tracking Stage    │ ──► tracking table
│  (ByteTrack)       │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│  Pose Estimation   │ ──► pose_estimations table
│  (MediaPipe)       │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│  Jersey OCR        │ ──► jersey_predictions table
│  (EasyOCR)         │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│  Ball Tracking     │ ──► ball_tracking table
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│  Action Recognition│ ──► action_predictions table
│  (Rules + LSTM)    │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│  Statistics Engine │ ──► player/team_match_statistics,
│                    │      heatmaps, movement_metrics, jump_metrics
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│  Reporting         │ ──► reports table
└────────────────────┘
```

### Storage Strategy by Data Type

| Data Type | Storage | Rationale |
|-----------|---------|-----------|
| Users, matches, statistics, metadata | PostgreSQL | Relational, transactional, queryable |
| Videos, frame images, models, reports | Object Storage (S3/MinIO) | Large blobs, streaming, CDN |
| Live scoreboard, active match state | Redis | Sub-millisecond reads, TTL expiry |
| AI processing logs, events | PostgreSQL + Redis | Durability + real-time access |

---

## 6.7 Data Retention Policies

| Data Category | Default Retention | Configurable By |
|---------------|------------------|-----------------|
| Match metadata | Permanent | — |
| Player statistics | Permanent | — |
| AI events (detections, tracking, poses) | 5 years | Admin |
| Action predictions | Permanent | — |
| Raw videos | 1 year (archive) | Organization policy |
| System logs (api_logs, ai_logs, error_logs) | 180 days | Admin |
| Audit logs | 7 years (compliance) | Admin |
| Notifications | 90 days | Admin |

**Policy Enforcement:** Automated via pg_partman partitioning + cron jobs.

---

## 6.8 Key Indexing Strategy

```sql
-- High-query tables
CREATE INDEX idx_matches_tournament_date ON matches(tournament_id, match_date);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_action_predictions_match ON action_predictions(match_id, timestamp_seconds);
CREATE INDEX idx_tracking_match_track ON tracking(match_id, track_id);
CREATE INDEX idx_detections_match_frame ON detections(match_id, frame_number);
CREATE INDEX idx_player_stats_player_season ON player_statistics(player_id, season_id);
CREATE INDEX idx_heatmaps_match_player ON heatmaps(match_id, player_id);
CREATE INDEX idx_api_logs_created ON api_logs(created_at);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id, created_at);

-- JSONB indexes for flexible queries
CREATE INDEX idx_detections_confidence ON detections USING GIN ((confidence));
CREATE INDEX idx_action_metadata ON action_predictions USING GIN (metadata_json);
CREATE INDEX idx_organizations_settings ON organizations USING GIN (settings_json);
```

---

## 6.9 Why This Database Design?

| Requirement | How Addressed |
|-------------|---------------|
| Professional clubs | Multi-tenant via `organizations` |
| National federations | Tournament + season hierarchy |
| International competitions | Venue + court + calibration model |
| Historical analytics | Aggregate tables + raw event retention |
| AI model retraining | Raw detections + confirmed labels stored |
| Multi-season reporting | Season-aware all statistics tables |
| Future mobile apps | API-first, Redis cache for low latency |
| Third-party API integrations | `api_keys` + webhook-ready events |

---

## 6.10 Production Architecture Recommendation

Because this is now a commercial platform, I recommend restructuring into **independent services** from the beginning:

```
volley-platform/
├── gateway-service/         # API Gateway, auth, rate limiting
├── auth-service/            # Authentication, tokens, users
├── organization-service/    # Organizations, clubs, staff
├── competition-service/     # Seasons, tournaments, venues, matches
├── analytics-service/       # Statistics, rankings, heatmaps
├── ai-inference-service/    # GPU workers, model serving
├── video-service/           # Video upload, processing, streaming
├── notification-service/    # Email, push, WebSocket
├── reporting-service/       # PDF/CSV generation
├── frontend-web/            # Public web app
├── frontend-admin/          # Admin dashboard
├── frontend-coach/          # Coach dashboard
├── mobile-app/              # Future: iOS/Android
├── shared-libraries/        # Common types, utilities
├── infrastructure/          # Terraform, Helm charts
├── ml-training/             # Model training pipelines
├── monitoring/              # Prometheus, Grafana, Alertmanager
└── deployment/              # Docker, Kubernetes, CI/CD
```

**Benefits:**

- Independent deployments and scaling
- Team autonomy (or AI agent autonomy)
- Technology heterogeneity (Python for AI, Go for gateway, etc.)
- Fault isolation
- Clear ownership boundaries

---

**END OF CHAPTER 6**

---

# CHAPTER 7: PRODUCTION SYSTEM ARCHITECTURE

---

## 7.1 Vision

The platform is designed to become an enterprise-grade volleyball analytics ecosystem capable of supporting:

- Professional clubs
- National federations
- Volleyball academies
- Schools and universities
- Tournament organizers
- Broadcasters
- Scouts
- Performance analysts
- Researchers
- AI model developers

The architecture prioritizes:

| Priority | Description |
|----------|-------------|
| **Scalability** | Handle growing users, matches, data volume |
| **High Availability** | Minimize downtime during matches |
| **Modular AI** | Independent evolution of AI components |
| **Cloud Deployment** | Native cloud-ready architecture |
| **Security** | Defense-in-depth, data protection |
| **Performance** | Sub-second dashboard, real-time processing |
| **Future Expansion** | Designed for new features and markets |

---

## 7.2 High-Level Architecture

```
                              USERS
                                   │
                                   ▼
                         ┌─────────────────────┐
                         │   Web Applications  │
                         │  ┌────────────────┐ │
                         │  │ Admin Portal   │ │
                         │  │ Coach Portal   │ │
                         │  │ Analyst Portal │ │
                         │  └────────────────┘ │
                         └──────────┬──────────┘
                                    │
                         HTTPS / WebSocket
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   API Gateway       │
                         │    Service          │
                         └──────────┬──────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────┐           ┌───────────────┐           ┌───────────────┐
│ Auth Service  │           │Competition    │           │ User Service  │
│               │           │ Service       │           │               │
└───────┬───────┘           └───────┬───────┘           └───────┬───────┘
        │                           │                           │
        └───────────────────────────┼───────────────────────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │  Analytics Service  │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ AI Inference Service│
                         └──────────┬──────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────┐           ┌───────────────┐           ┌───────────────┐
│ Video Service │           │  Statistics   │           │  Event Engine │
│               │           │    Engine     │           │               │
└───────┬───────┘           └───────┬───────┘           └───────┬───────┘
        │                           │                           │
        └───────────────────────────┼───────────────────────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   PostgreSQL        │
                         │   Database          │
                         └──────────┬──────────┘
                                    │
                         ┌──────────┴──────────┐
                         ▼                     ▼
                ┌──────────────┐       ┌──────────────┐
                │   Redis      │       │  Object      │
                │   Cache      │       │  Storage     │
                └──────────────┘       └──────────────┘
```

---

## 7.3 Technology Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| React 18+ | Component-based UI |
| TypeScript | Type safety |
| Vite | Fast build tool |
| React Router | Client-side routing |
| React Query | Server state management |
| Zustand | Client state management |
| Tailwind CSS | Utility-first styling |
| Material UI | Selected complex components |
| Recharts / Apache ECharts | Data visualization |

### Backend

| Technology | Purpose |
|------------|---------|
| Python 3.12+ | Primary language |
| FastAPI | High-performance API framework |
| SQLAlchemy 2.0 | Async ORM |
| Alembic | Database migrations |
| Pydantic | Data validation |
| Uvicorn | ASGI server |

### AI Stack

| Technology | Purpose |
|------------|---------|
| OpenCV | Video processing, frame manipulation |
| Ultralytics YOLO | Object detection (players, ball) |
| ByteTrack | Multi-object tracking |
| MediaPipe | Real-time pose estimation |
| EasyOCR | Jersey number recognition |
| PyTorch | Deep learning models (LSTM/Transformer) |
| ONNX Runtime | Optional inference optimization |

### Database & Storage

| Technology | Purpose |
|------------|---------|
| PostgreSQL 16+ | Primary relational database |
| Redis 7+ | Cache, session, real-time data |
| MinIO | Self-hosted object storage (S3-compatible) |
| AWS S3 | Production cloud object storage |

### Infrastructure

| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Docker Compose | Local development |
| Kubernetes | Production orchestration (future) |
| Nginx | Reverse proxy, SSL termination |
| GitHub Actions | CI/CD pipeline |

---

## 7.4 Why Microservices?

```
One Huge Backend  ❌
        │
        ▼
Many Independent Services  ✅
```

**Benefits:**

| Benefit | Impact |
|---------|--------|
| Independent Deployments | Update AI without touching auth |
| Horizontal Scaling | Scale only AI Inference for GPU workloads |
| Fault Isolation | Video service failure doesn't kill dashboard |
| Team Autonomy | Different teams (or AI agents) own services |
| Technology Heterogeneity | Python for AI, Go/Rust for gateway if needed |
| Easier Testing | Test services in isolation |

---

## 7.5 Platform Services

The production platform consists of the following services:

### Service 1 — API Gateway

| Responsibility | Detail |
|----------------|--------|
| Entry Point | Single domain for all clients |
| Authentication Validation | JWT verification, token introspection |
| Rate Limiting | Per-user, per-endpoint limits |
| Request Routing | Path-based routing to services |
| API Versioning | /api/v1/, /api/v2/ support |
| Request/Response Logging | Centralized API logs |
| SSL Termination | HTTPS at edge |

**Example Flow:**

```
Client → api.volleyplatform.com → Gateway → Correct Service
```

---

### Service 2 — Authentication Service

| Responsibility | Detail |
|----------------|--------|
| Login/Registration | Email/password, OAuth (future) |
| JWT Management | Access tokens (15min), Refresh tokens (7d) |
| RBAC | Role-based access control |
| Password Reset | Secure token-based flow |
| Session Management | Track active sessions, force logout |
| API Keys | Service-to-service authentication |

**Database Tables:** `users`, `roles`, `permissions`, `user_sessions`, `refresh_tokens`, `api_keys`

---

### Service 3 — Organization Service

| Domain | Entities |
|--------|----------|
| Organizations | Clubs, federations, schools |
| Clubs | Volleyball clubs with branding |
| Teams | Team rosters, staff |
| Coaches | Coach profiles, certifications |
| Analysts | Analyst profiles |
| Statisticians | Statistician profiles |

---

### Service 4 — Competition Service

| Entity | Description |
|--------|-------------|
| Seasons | Competition periods |
| Tournaments | Tournament definitions, formats |
| Venues | Match locations with courts |
| Matches | Match scheduling, metadata |
| Sets | Individual set scores |
| Fixtures | Generated schedules |
| Standings | Tournament rankings |

---

### Service 5 — Player Service

| Capability | Description |
|------------|-------------|
| Profiles | Name, DOB, height, weight, photo |
| Positions | Position history, primary/secondary |
| Team Membership | Current and historical teams |
| Career History | Matches played, transfers |
| Medical | Future: injury records (restricted) |

---

### Service 6 — Video Service

| Capability | Description |
|------------|-------------|
| Camera Registration | USB, RTSP, IP Webcam, uploaded files |
| Stream Ingestion | Real-time frame acquisition |
| Video Recording | Match recording to object storage |
| Replay | Time-indexed playback |
| Frame Extraction | AI pipeline frame preparation |

**Supported Sources:**

| Source | Protocol |
|--------|----------|
| USB Webcam | Direct (V4L2) |
| RTSP Camera | RTSP/ONVIF |
| IP Camera | RTSP/HTTP |
| Phone Camera | IP Webcam app (RTSP) |
| Uploaded Files | MP4, AVI, MOV, MKV |

---

### Service 7 — AI Inference Service

**Most computationally intensive service — runs independently on GPU nodes.**

**Pipeline:**

```
Frame
   │
   ▼
┌────────────┐
│  YOLO      │  Player + Ball Detection
└─────┬──────┘
      │
      ▼
┌────────────┐
│  ByteTrack │  Multi-object Tracking
└─────┬──────┘
      │
      ▼
┌────────────┐
│  MediaPipe │  Pose Estimation (33 keypoints)
└─────┬──────┘
      │
      ▼
┌────────────┐
│  EasyOCR   │  Jersey Number Recognition
└─────┬──────┘
      │
      ▼
┌────────────┐
│  LSTM/     │  Action Recognition
│  Transformer│
└─────┬──────┘
      │
      ▼
┌────────────┐
│  Statistics│  Statistics Generation
│  Engine    │
└─────┬──────┘
      │
      ▼
┌────────────┐
│  Database  │  Persist Events + Stats
└─────┬──────┘
      │
      ▼
┌────────────┐
│  Dashboard │  WebSocket Push
└────────────┘
```

**Architecture Decision:** AI Inference is separate from API services so heavy GPU workloads never block user requests.

---

### Service 8 — Statistics Service

| Input | Output |
|-------|--------|
| AI Events (kill, ace, dig, etc.) | Live statistics (real-time) |
| Match events | Match statistics |
| Season aggregates | Season/career statistics |
| Player data | Rankings, leaderboards |

**Example Flow:**

```
Spike Event → Player 7 → Kill → Database Update → Redis Cache → Dashboard Refresh
```

---

### Service 9 — Reporting Service

| Format | Description |
|--------|-------------|
| PDF | Match, player, team, tournament reports |
| CSV | Raw data exports for analysis |
| Excel | Formatted analytics exports |
| JSON | API-compatible structured exports |

---

### Service 10 — Notification Service

| Channel | Events |
|---------|--------|
| Email | Alerts, reports, password resets |
| In-App | Dashboard notifications |
| WebSocket | Live alerts during matches |
| Future: SMS/Push | Mobile notifications |

**Alert Types:**

| Alert | Trigger |
|-------|---------|
| Camera Failure | Stream disconnected |
| AI Confidence Low | Event confidence < threshold |
| Scoring Streak | 3+ consecutive points |
| Player Milestone | Career milestones reached |

---

## 7.6 AI Pipeline — Detailed Stage Specification

| Stage | Input | Output | Technology | Model |
|-------|-------|--------|------------|-------|
| 1. Frame Extraction | Video stream | Frames (numpy) | OpenCV/FFmpeg | — |
| 2. Court Detection | Frame | Homography, court mask | OpenCV | Custom |
| 3. Player Detection | Frame | BBoxes, conf, team color | YOLOv8 | Fine-tuned |
| 4. Ball Detection | Frame | BBox, conf, 3D pos | YOLOv8 | Fine-tuned |
| 5. Player Tracking | Detections | Track IDs, trajectories | ByteTrack | — |
| 6. Ball Tracking | Detections | Trajectory, speed, contacts | Kalman filter | — |
| 7. Pose Estimation | Player crops | 33 keypoints + conf | MediaPipe | Pose Landmarker |
| 8. Jersey OCR | Torso crops | Number (0-99) + conf | EasyOCR | — |
| 9. Action Recognition | Tracks + Pose + Ball | Action type, conf, outcome | LSTM/Transformer | Custom |
| 10. Statistics Gen | Events | Player/team stats | Rules engine | — |

**Each stage is an independent module with:**

- Clear input/output contracts
- Unit tests
- Configuration via environment variables
- Health checks and metrics

---

## 7.7 API Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Versioned REST** | `/api/v1/`, `/api/v2/` in URL |
| **Resource-Oriented** | `/players/{id}`, `/matches/{id}/statistics` |
| **Standard HTTP** | GET, POST, PUT, PATCH, DELETE |
| **Consistent Responses** | `{data: ..., meta: ...}` or `{error: ...}` |
| **Pagination** | `page`, `per_page`, `total` in meta |
| **Filtering/Sorting** | Query params: `?filter[team]=1&sort=-created_at` |
| **WebSocket** | `/ws/live/{match_id}` for real-time |

**Core Endpoints:**

| Domain | Base Path |
|--------|-----------|
| Authentication | `/api/v1/auth/` |
| Users | `/api/v1/users/` |
| Organizations | `/api/v1/organizations/` |
| Clubs/Teams | `/api/v1/clubs/`, `/api/v1/teams/` |
| Players | `/api/v1/players/` |
| Competitions | `/api/v1/seasons/`, `/api/v1/tournaments/` |
| Matches | `/api/v1/matches/` |
| Statistics | `/api/v1/statistics/` |
| Analytics | `/api/v1/analytics/` |
| Reports | `/api/v1/reports/` |
| Video | `/api/v1/video/` |
| Admin | `/api/v1/admin/` |

**Future:** GraphQL support can be evaluated if complex queries become common.

---

## 7.8 Internal Service Communication

| Pattern | Use Case | Technology |
|---------|----------|------------|
| **Synchronous (REST)** | Queries, commands requiring immediate response | HTTP/JSON |
| **Asynchronous (Event-Driven)** | AI events → Statistics → Cache → Dashboard | Redis Streams / RabbitMQ (future) |

**Current Release:** REST + Redis Pub/Sub for real-time

**Future Evolution:**

```
AI Detects Kill
       │
       ▼
Publish "kill_detected" Event
       │
       ├──► Statistics Service (updates DB, cache)
       ├──► Notification Service (checks for alerts)
       ├──► Analytics Service (updates rankings)
       └──► Reporting Service (marks match as dirty for regen)
```

**Recommended Future Message Brokers:**

| Broker | Best For |
|--------|----------|
| RabbitMQ | Traditional message queues, reliability |
| Apache Kafka | High-throughput event streaming |
| NATS | Lightweight, low-latency messaging |

---

## 7.9 Caching Strategy (Redis)

| Cache Key Pattern | TTL | Invalidation |
|-------------------|-----|--------------|
| `live:match:{id}:scoreboard` | Match duration | On score change |
| `live:match:{id}:player_stats` | Match duration | On event |
| `leaderboard:{season}:{metric}` | 5 min | Scheduled rebuild |
| `player:profile:{id}` | 1 hour | On profile update |
| `team:roster:{id}` | 30 min | On roster change |
| `session:{token}` | 7 days | On logout/expiry |

**Benefits:**

- Sub-millisecond dashboard reads
- Reduced PostgreSQL load
- Horizontal scaling of read replicas

---

## 7.10 Deployment Environments

| Environment | Infrastructure | Purpose |
|-------------|----------------|---------|
| **Development** | Local Docker Compose | Developer laptops |
| **Staging** | Cloud VM (1-2 nodes) | Integration testing, UAT |
| **Production** | Linux servers + Nginx + Docker | Live traffic |

**Production Options:**

| Option | Description |
|--------|-------------|
| Single VM | All containers on one server (small scale) |
| Multiple VMs | Services distributed (medium scale) |
| Kubernetes | Auto-scaling, self-healing (large scale) |

---

## 7.11 Monitoring & Observability

### Prometheus + Grafana Stack

| Metric Category | Key Metrics |
|-----------------|-------------|
| **API** | Latency (p50, p95, p99), error rate, RPS |
| **System** | CPU, RAM, disk, network |
| **GPU** | Utilization, memory, temperature, power (NVIDIA SMI) |
| **AI Inference** | FPS, inference time per stage, queue depth |
| **Database** | Connections, query latency, cache hit ratio |
| **Business** | Active matches, events/minute, report generation time |

### Alerting Rules (Examples)

| Alert | Condition | Severity |
|-------|-----------|----------|
| API High Latency | p99 > 2s for 5min | Warning |
| AI Inference Down | No frames processed 60s | Critical |
| GPU Memory High | > 90% for 10min | Warning |
| Database Connections | > 80% pool | Warning |
| Camera Disconnected | No frames 30s | Warning |

---

## 7.12 Centralized Logging

**Every service logs structured JSON:**

```json
{
  "timestamp": "2026-07-15T10:30:00Z",
  "service": "ai-inference",
  "level": "INFO",
  "trace_id": "abc123",
  "message": "Frame processed",
  "fields": {
    "frame_number": 1523,
    "detections": 12,
    "tracking_time_ms": 4.2,
    "inference_time_ms": 28.5
  }
}
```

**Log Categories:**

| Category | Services |
|----------|----------|
| Request/Response | All API services |
| AI Processing | ai-inference, video |
| Authentication | auth, gateway |
| Errors | All services |
| Audit | auth, admin actions |
| Performance | ai-inference, statistics |

**Storage:** ELK Stack (Elasticsearch, Logstash, Kibana) or Loki + Grafana

---

## 7.13 Security Architecture

| Layer | Measures |
|-------|----------|
| **Transport** | TLS 1.3 everywhere (Nginx termination) |
| **Authentication** | JWT (RS256), short-lived access, refresh rotation |
| **Authorization** | RBAC at gateway + service-level checks |
| **Passwords** | BCrypt (12 rounds), minimum 12 chars |
| **Input Validation** | Pydantic schemas on all endpoints |
| **Rate Limiting** | Token bucket at gateway (100 req/min/user) |
| **Audit Logging** | All admin actions, data modifications |
| **Secrets** | Environment variables → Vault/Sealed Secrets (production) |
| **CORS** | Restricted to known frontend origins |
| **Security Headers** | CSP, HSTS, X-Frame-Options, etc. |

---

## 7.14 Disaster Recovery

| Component | Strategy |
|-----------|----------|
| **PostgreSQL** | Daily pg_basebackup + WAL archiving, point-in-time recovery |
| **Redis** | AOF persistence + replica (no data loss critical) |
| **Object Storage** | Cross-region replication (S3) or MinIO mirror |
| **Configuration** | GitOps (ArgoCD/Flux) — all config in Git |
| **Restore Testing** | Monthly restore drills to staging |

**RTO/RPO Targets:**

| Tier | RTO | RPO |
|------|-----|-----|
| Match Data (live) | 5 min | 0 (Redis) |
| PostgreSQL | 30 min | 5 min |
| Object Storage | 1 hour | 1 hour |

---

## 7.15 AI Model Management (MLOps Foundation)

| Metadata Field | Required |
|----------------|----------|
| Model Name | ✓ |
| Version (semver) | ✓ |
| Training Date | ✓ |
| Dataset Version | ✓ |
| Architecture | ✓ |
| Hyperparameters | ✓ |
| Precision / Recall / F1 / mAP | ✓ |
| Inference Time (ms) | ✓ |
| GPU Memory Usage | ✓ |
| Deployment Status | ✓ (dev/staging/prod) |
| Rollback Version | ✓ |

**Model Lifecycle:**

```
Training → Evaluation → Registry (dev) → Staging Validation → Production Promotion
                                                              │
                                              ┌───────────────┴───────────────┐
                                              ▼                               ▼
                                        Canary Deploy                   Full Rollout
                                              │                               │
                                              ▼                               ▼
                                        Monitor Metrics              Monitor Metrics
                                              │                               │
                                              ▼                               ▼
                                        Rollback if needed            Keep / Rollback
```

---

## 7.16 Development Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    GITHUB FLOW                              │
└─────────────────────────────────────────────────────────────┘

main ──────────────────────────────────────────────────────────►
   │
   ├── feature/ai-pose-estimation
   │       │
   │       ▼ Commits + Push
   │
   ├── Pull Request Created
   │       │
   │       ▼ GitHub Actions
   │   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
   │   │ Lint    │ │ Type    │ │ Unit    │ │ Build   │
   │   │ Check   │ │ Check   │ │ Tests   │ │ Docker  │
   │   └─────────┘ └─────────┘ └─────────┘ └─────────┘
   │       │
   │       ▼ Code Review (Required)
   │       │
   │       ▼ Merge to main
   │       │
   │       ▼ Build + Push Docker Images
   │       │
   │       ▼ Deploy to Staging
   │       │
   │       ▼ Automated E2E Tests
   │       │
   │       ▼ Manual Acceptance (Optional)
   │       │
   │       ▼ Deploy to Production
```

---

## 7.17 Production Folder Structure

```
volley-platform/
│
├── services/
│   ├── api-gateway/
│   │   ├── Dockerfile
│   │   ├── main.go (or Python)
│   │   └── config/
│   ├── auth-service/
│   ├── organization-service/
│   ├── player-service/
│   ├── competition-service/
│   ├── video-service/
│   ├── ai-inference-service/
│   │   ├── detection/
│   │   ├── tracking/
│   │   ├── pose/
│   │   ├── ocr/
│   │   ├── action_recognition/
│   │   └── statistics/
│   ├── statistics-service/
│   ├── reporting-service/
│   └── notification-service/
│
├── frontend/
│   ├── admin-portal/
│   ├── coach-portal/
│   └── analyst-portal/
│
├── shared/
│   ├── contracts/          # Shared API types (OpenAPI/Proto)
│   ├── sdk/                # Client SDKs
│   ├── utilities/          # Common helpers
│   └── ui-components/      # Shared React components
│
├── infrastructure/
│   ├── docker/
│   ├── kubernetes/
│   ├── nginx/
│   └── monitoring/
│
├── ml/
│   ├── datasets/
│   ├── training/
│   ├── inference/
│   ├── models/
│   └── evaluation/
│
├── documentation/
│   ├── api/
│   ├── architecture/
│   └── operations/
│
├── scripts/
│   ├── deploy.sh
│   ├── backup.sh
│   └── migrate.sh
│
└── tests/
    ├── integration/
    ├── contract/
    └── performance/
```

---

## 7.18 Architectural Recommendation: Dedicated MLOps Layer

**One critical change to make this platform truly enterprise-grade:**

Add a **dedicated Machine Learning Operations (MLOps) layer** — not just treating AI as another service, but managing models like production software with:

- Model versioning and registry
- Automated evaluation pipelines
- Deployment pipelines with canary/rollback
- Data labeling workflows
- Human-in-the-loop validation
- Continuous model improvement loops

**This is how companies building AI products structure their systems.**

---

**END OF CHAPTER 7**

---

# CHAPTER 8: AI & MLOPS ARCHITECTURE

---

## 8.1 Vision

The AI & MLOps architecture transforms computer vision research into production-grade, continuously improving analytics. Rather than treating models as static artifacts, this architecture manages the **entire AI lifecycle** — from data collection through deployment, monitoring, and retraining — with the same rigor applied to application code.

**Core Principles:**

| Principle | Implementation |
|-----------|----------------|
| **Reproducibility** | Every model version tied to dataset version, code version, and training config |
| **Traceability** | Full lineage from raw frame → detection → tracking → action → statistic |
| **Automation** | CI/CD for models: train → evaluate → register → canary → promote |
| **Observability** | Real-time inference metrics, drift detection, data quality monitoring |
| **Governance** | Approval gates, rollback capability, audit trail for every model change |

---

## 8.2 AI Model Lifecycle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AI MODEL LIFECYCLE                                   │
└─────────────────────────────────────────────────────────────────────────────┘

   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
   │  DATA    │───►│ TRAINING │───►│EVALUATION│───►│ REGISTRY │───►│ DEPLOY   │
   │  MGMT    │    │ PIPELINE │    │          │    │ (MLflow) │    │ PIPELINE │
   └──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
       │               │               │               │               │
       ▼               ▼               ▼               ▼               ▼
  ┌──────────┐   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
  │Versioned │   │Experiment│    │Thresholds│    │Model     │    │Canary    │
  │Datasets  │   │Tracking  │    │Enforced  │    │Versioning│    │Rollout   │
  └──────────┘   └──────────┘    └──────────┘    └──────────┘    └──────────┘
       │               │               │               │               │
       │               │               │               │               ▼
       │               │               │               │         ┌──────────┐
       │               │               │               │         │MONITORING│
       │               │               │               │         │& DRIFT   │
       │               │               │               │         │DETECTION │
       │               │               │               │         └────┬─────┘
       └───────────────┴───────────────┴───────────────┴──────────────┘
                                           │
                                           ▼
                                  ┌──────────────┐
                                  │  RETRAINING  │
                                  │   TRIGGER    │
                                  └──────────────┘
```

---

## 8.3 Dataset Management

### 8.3.1 Dataset Versioning Strategy

| Dataset | Version Format | Storage |
|---------|---------------|---------|
| Raw Video | `v{major}.{minor}` (e.g., `v1.3`) | Object Storage (S3/MinIO) |
| Annotations | Same as video + annotation hash | PostgreSQL + Object Storage |
| Train/Val/Test Splits | `split_{hash}` | Object Storage (manifest JSON) |
| Augmented Data | Derived, not versioned separately | Generated on-the-fly |

### 8.3.2 Annotation Workflow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    HUMAN-IN-THE-LOOP ANNOTATION WORKFLOW                    │
└─────────────────────────────────────────────────────────────────────────────┘

Raw Video
    │
    ▼
┌──────────────────┐
│ Auto-Annotation  │  AI pre-labels frames (YOLO + Tracking + Action)
│ (AI Assist)      │  Confidence > 0.9 → auto-accept
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Review Queue     │  Low-confidence frames → Statistician/Analyst
│ (Label Studio)   │  Corrections create "gold standard" labels
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Consensus /      │  Multiple annotators → majority vote or expert review
│ Arbitration      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Gold Dataset     │  Versioned, immutable, used for evaluation only
│ Commit           │
└──────────────────┘
```

### 8.3.3 Dataset Quality Gates

| Gate | Criteria | Action on Failure |
|------|----------|-------------------|
| **Class Balance** | No class < 5% of samples | Alert, request more data |
| **Annotation Agreement** | Cohen's Kappa > 0.85 | Reject batch, re-annotate |
| **Temporal Consistency** | Track IDs stable across frames | Flag for review |
| **Domain Coverage** | Min 10 venues, 20 lighting conditions | Block promotion |

---

## 8.4 Training Pipeline Architecture

### 8.4.1 Pipeline Components

```yaml
# Example: training/pipelines/player_detection.yaml
pipeline:
  name: "player_detection_v2"
  version: "2.1.0"
  
  dataset:
    source: "s3://volley-datasets/player_detection/v2.1/"
    train_split: 0.7
    val_split: 0.2
    test_split: 0.1
    stratification: ["venue", "lighting", "team_color"]
  
  model:
    architecture: "yolov8m"
    pretrained: "yolov8m.pt"
    input_size: 640
    classes: ["player"]
  
  training:
    epochs: 100
    batch_size: 16
    optimizer: "AdamW"
    lr: 0.001
    lr_scheduler: "cosine"
    weight_decay: 0.0005
    augmentations:
      - mosaic: 1.0
      - mixup: 0.1
      - hsv_h: 0.015
      - hsv_s: 0.7
      - hsv_v: 0.4
      - flip_lr: 0.5
      - degrees: 10
      - translate: 0.1
      - scale: 0.5
      - shear: 2.0
  
  evaluation:
    metrics: ["mAP@0.5", "mAP@0.5:0.95", "precision", "recall", "F1"]
    iou_thresholds: [0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95]
    confidence_threshold: 0.25
    test_time_augmentation: true
  
  hardware:
    gpu: "nvidia-a10g"
    gpu_count: 2
    mixed_precision: true
  
  tracking:
    mlflow_experiment: "player_detection"
    tags:
      - "task:detection"
      - "sport:volleyball"
      - "object:player"
```

### 8.4.2 Model-Specific Pipelines

| Model | Pipeline File | Key Characteristics |
|-------|---------------|---------------------|
| Player Detection | `player_detection.yaml` | YOLOv8, single-class, high recall |
| Ball Detection | `ball_detection.yaml` | YOLOv8, small object, high precision |
| Action Recognition | `action_recognition.yaml` | LSTM/Transformer, sequence classification |
| Pose Estimation | `pose_estimation.yaml` | MediaPipe (pre-trained), fine-tune heads |

### 8.4.3 Experiment Tracking (MLflow)

```
MLflow Experiment: "player_detection"
│
├── Run: "yolov8m_v2.1.0_20260715_143022"
│   ├── Parameters: {epochs: 100, lr: 0.001, batch: 16, ...}
│   ├── Metrics: {mAP@0.5: 0.942, mAP@0.5:0.95: 0.721, ...}
│   ├── Artifacts: 
│   │   ├── model.onnx
│   │   ├── model.pt
│   │   ├── confusion_matrix.png
│   │   ├── pr_curve.png
│   │   └── training_curves.png
│   └── Tags: {git_commit: "abc123", dataset_version: "v2.1", ...}
│
├── Run: "yolov8l_v2.1.0_20260715_164511"
│   └── ...
```

---

## 8.5 Model Registry & Versioning

### 8.5.1 Model Registry Schema (MLflow)

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Model identifier (e.g., `player_detection`) |
| `version` | integer | Auto-incremented |
| `stage` | enum | `None` → `Staging` → `Production` → `Archived` |
| `run_id` | string | MLflow run that produced this model |
| `artifact_uri` | string | S3/MinIO path to model artifacts |
| `metrics` | json | Evaluation metrics snapshot |
| `params` | json | Training hyperparameters |
| `dataset_version` | string | Version of dataset used |
| `git_commit` | string | Source code commit hash |
| `created_by` | string | User/service that created it |
| `created_at` | timestamp | Creation time |
| `description` | string | Human-readable notes |

### 8.5.2 Stage Promotion Gates

| Stage | Entry Criteria | Exit Criteria |
|-------|---------------|---------------|
| **Development** | Training complete, basic metrics logged | — |
| **Staging** | mAP@0.5 ≥ threshold, no regression vs. production | Automated eval on holdout test set passes |
| **Production** | Staging validation passed, canary deployed 5% traffic | 24h stable, error rate < threshold |
| **Archived** | Replaced by newer version | — |

### 8.5.3 Model Promotion Workflow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        MODEL PROMOTION WORKFLOW                             │
└─────────────────────────────────────────────────────────────────────────────┘

Developer
    │
    ▼
┌─────────────────────┐
│ Train New Model     │  MLflow auto-logs params, metrics, artifacts
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Register to MLflow  │  stage="None" (Development)
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Automated Eval Job  │  Runs on holdout test set + benchmark videos
└─────────┬───────────┘
          │
    ┌─────┴─────┐
    │           │
   PASS        FAIL
    │           │
    ▼           ▼
┌─────────┐ ┌─────────────────┐
│Promote  │ │ Notify Dev,     │
│to       │ │ block promotion │
│Staging  │ └─────────────────┘
└────┬────┘
     │
     ▼
┌─────────────────────┐
│ Canary Deploy       │  5% traffic to new model
│ (5% traffic)        │  A/B metrics comparison
└─────────┬───────────┘
          │
    ┌─────┴─────┐
    │           │
   PASS        FAIL
    │           │
    ▼           ▼
┌─────────┐ ┌─────────────────┐
│Promote  │ │ Auto-Rollback   │
│to       │ │ (100% old model)│
│Production│ └─────────────────┘
└─────────┘
```

---

## 8.6 Inference Optimization

### 8.6.1 Model Export Formats

| Format | Use Case | Optimization |
|--------|----------|--------------|
| **PyTorch (.pt)** | Training, development | Native |
| **ONNX** | Cross-platform inference | ONNX Runtime |
| **TensorRT** | NVIDIA GPU production | FP16/INT8 quantization |
| **OpenVINO** | Intel CPU/VPU | Model optimizer |
| **Core ML** | Apple Silicon (future mobile) | coremltools |

### 8.6.2 Optimization Pipeline

```
PyTorch Model (.pt)
      │
      ▼
┌─────────────────┐
│ Export to ONNX  │  torch.onnx.export()
│ (opset 17)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ ONNX Simplify   │  onnxsim - remove redundant ops
└────────┬────────┘
         │
         ▼
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌────────┐
│TensorRT│ │ONNX    │
│FP16/INT8│ │Runtime │
│Engine  │ │CPU/GPU │
└────────┘ └────────┘
```

### 8.6.3 Inference Performance Targets

| Model | Target (GPU) | Target (CPU) | Batch Size |
|-------|--------------|--------------|------------|
| Player Detection (YOLOv8m) | < 15ms | < 80ms | 1-4 |
| Ball Detection (YOLOv8s) | < 8ms | < 50ms | 1-4 |
| Pose Estimation (MediaPipe) | < 5ms | < 30ms | 1 |
| Action Recognition (LSTM) | < 10ms | < 40ms | 1 (seq=30) |
| **Full Pipeline** | **< 40ms** | **< 200ms** | 1 frame |

---

## 8.7 GPU Utilization & Resource Management

### 8.7.1 GPU Allocation Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         GPU RESOURCE POOL                                   │
└─────────────────────────────────────────────────────────────────────────────┘

Physical GPUs: 4x NVIDIA A10G (24GB each)
                 │
    ┌────────────┼────────────┐
    ▼            ▼            ▼
┌────────┐ ┌────────┐ ┌────────┐
│ GPU 0  │ │ GPU 1  │ │ GPU 2  │
│ ─────  │ │ ─────  │ │ ─────  │
│Train:  │ │Train:  │ │Infer:  │
│ yolo   │ │ action │ │ match1 │
│ det    │ │ rec    │ │ match2 │
└────────┘ └────────┘ └────────┘
    │            │            │
    │            │            ▼
    │            │       ┌────────┐
    │            │       │ GPU 3  │
    │            │       │ ─────  │
    │            │       │Infer:  │
    │            │       │ match3 │
    │            │       │ match4 │
    │            │       └────────┘
    ▼            ▼
┌────────────────────────────────────┐
│         Training Queue             │
│  (Slurm / Kubernetes Jobs)         │
└────────────────────────────────────┘
```

### 8.7.2 Multi-Process Service (MPS) for Inference

```yaml
# kubernetes/ai-inference-deployment.yaml
resources:
  limits:
    nvidia.com/gpu: 1
  requests:
    nvidia.com/gpu: 1
env:
  - name: CUDA_MPS_ACTIVE_THREAD_PERCENTAGE
    value: "100"  # Allow multiple processes per GPU
  - name: CUDA_MPS_LOG_DIRECTORY
    value: "/tmp/nvidia-mps"
```

### 8.7.3 Dynamic Batch Processing

| Scenario | Batch Size | Latency Target |
|----------|------------|----------------|
| Live match (1 camera) | 1 | < 40ms |
| Live match (2 cameras) | 2 | < 50ms |
| Batch processing (offline) | 8-16 | Throughput optimized |

---

## 8.8 Monitoring & Drift Detection

### 8.8.1 Inference Metrics (Prometheus)

| Metric | Type | Description | Alert Threshold |
|--------|------|-------------|-----------------|
| `ai_inference_duration_seconds` | Histogram | End-to-end frame processing time | p99 > 200ms |
| `ai_detection_count` | Counter | Total detections per class | — |
| `ai_tracking_id_switches` | Counter | ID switches per match | > 5/min |
| `ai_action_confidence` | Histogram | Action prediction confidence | mean < 0.7 |
| `ai_model_inference_errors` | Counter | Failed inferences | > 0.1% |
| `gpu_utilization_percent` | Gauge | GPU compute utilization | < 30% or > 95% |
| `gpu_memory_used_bytes` | Gauge | VRAM usage | > 90% |

### 8.8.2 Data Drift Detection

| Drift Type | Detection Method | Frequency |
|------------|------------------|-----------|
| **Covariate Shift** | Input distribution (brightness, resolution, camera angle) | Per match |
| **Concept Drift** | Prediction confidence distribution | Daily |
| **Label Drift** | Human correction rate (statistician reviews) | Weekly |
| **Domain Shift** | Venue/league not in training data | On new venue |

**Implementation:**
```python
# Pseudocode: Drift detection per match
def detect_drift(match_id: int, predictions: List[Prediction]) -> DriftReport:
    # 1. Compute feature statistics (brightness, resolution, detection sizes)
    current_stats = compute_feature_stats(predictions)
    
    # 2. Compare to training baseline (stored in model registry)
    baseline = load_baseline_stats(model_version)
    
    # 3. Statistical tests
    drift_score = ks_test(current_stats, baseline)
    
    # 4. Alert if significant
    if drift_score > THRESHOLD:
        alert_ops_team(match_id, drift_score)
    
    return DriftReport(score=drift_score, details=...)
```

### 8.8.3 Continuous Model Improvement Loop

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CONTINUOUS IMPROVEMENT LOOP                              │
└─────────────────────────────────────────────────────────────────────────────┘

Live Matches
    │
    ▼
┌─────────────────┐
│ Collect:        │  • Low-confidence predictions
│  • Errors       │  • Statistician corrections
│  • Drift alerts │  • New venues/conditions
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Curate:         │  • Add to annotation queue
│  • Prioritize   │  • Weight by impact (match importance)
│  • Balance      │  • Ensure class balance
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Annotate:       │  • AI-assisted labeling
│  • Review       │  • Consensus for difficult cases
│  • Gold set     │  • Version as new dataset
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Retrain:        │  • Triggered when:
│  • Scheduled    │    - N new samples accumulated
│  • On-demand    │    - Drift threshold exceeded
│  • A/B test     │    - Performance regression
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Evaluate &      │  • Must beat production on holdout + new data
│ Promote         │  • Canary → Production
└─────────────────┘
```

---

## 8.9 Data Labeling Workflow

### 8.9.1 Labeling Tools

| Task | Tool | Reason |
|------|------|--------|
| Object Detection | Label Studio / CVAT | Polygon/bbox, team collaboration |
| Tracking | Label Studio + interpolation | Temporal consistency |
| Pose Estimation | MediaPipe auto + Label Studio correct | 33 keypoints, skeleton UI |
| Action Recognition | Custom timeline UI | Temporal segments + class |
| Jersey OCR | Crop + text annotation | Small region, high precision |

### 8.9.2 Annotation Quality Assurance

| QA Step | Method | Frequency |
|---------|--------|-----------|
| **Inter-Annotator Agreement** | Cohen's Kappa / IoU | Every batch |
| **Gold Standard Review** | Expert reviews 10% random sample | Every batch |
| **Temporal Consistency** | Track ID stability check | Automated per video |
| **Model-Assisted QA** | Model predictions vs. human labels | Continuous |

### 8.9.3 Annotation Guidelines (Excerpts)

**Player Detection:**
- Bbox tightly around visible body (exclude extremities if occluded > 50%)
- Class: `player` (team determined by color clustering post-detection)
- Confidence: annotator certainty (1-5)

**Ball Detection:**
- Bbox around ball (min 10x10px, max 50x50px)
- If motion blur: annotate center of streak
- Occluded: mark `occluded=true`, estimate position

**Action Recognition:**
- Segment: start_frame to end_frame (inclusive)
- Class: one of 16 action types
- Outcome: point / side_out / error / neutral
- Player: jersey number (or track_id if unknown)

---

## 8.10 Human-in-the-Loop Validation

### 8.10.1 Statistician Review Interface

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        EVENT REVIEW QUEUE                                   │
└─────────────────────────────────────────────────────────────────────────────┘

Filter: [Confidence < 0.6] [Action: Spike] [Match: Final 2026] [Team: All] ▼

┌─────────────────────────────────────────────────────────────────────────────┐
│  ▸ Event #1247  |  Match: Thunder vs Eagles  |  Set 2, 14:23  |  Conf: 0.52 │
│  ─────────────────────────────────────────────────────────────────────────  │
│  AI Prediction: SPIKE (Kill)  |  Player: #8 (Track: 23)  |  Team: Thunder  │
│                                                                              │
│  [VIDEO CLIP: 3 sec before → 2 sec after]  ▶️  ⏸️  🔁  ⏪ 10s  ⏩ 10s       │
│                                                                              │
│  Overlay: ☑ Detections  ☑ Tracking  ☑ Pose  ☑ Court  ☑ Ball Trajectory     │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  Your Decision:                                                            │
│  ○ Confirm: Spike → Kill                                                   │
│  ○ Correct:  Spike → Attack Error    ○ Reception Error    ○ Block         │
│  ○ Correct:  Set                             ○ Free Ball                   │
│  ○ Not an event (false positive)                                           │
│                                                                              │
│  Notes: _________________________________________________________________  │
│                                                                              │
│  [Submit]  [Skip]  [Flag for Expert Review]                                │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.10.2 Correction Flow

```
Statistician Correction
        │
        ▼
┌─────────────────────┐
│ Update Database     │  action_predictions.confirmed = true
│                     │  action_predictions.corrected_type = ...
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Recalculate Stats   │  Statistics service reprocesses match
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Add to Gold Dataset │  If confidence < 0.7 OR corrected
│ (auto-versioned)    │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Trigger Retrain?    │  Check: new_gold_samples > threshold?
└─────────┬───────────┘
          │
       YES/NO
          │
          ▼
    ┌─────┴─────┐
    │           │
   YES          NO
    │           │
    ▼           ▼
┌────────┐ ┌────────────────┐
│ Queue  │ │ Continue       │
│Retrain │ │ Monitoring     │
└────────┘ └────────────────┘
```

---

## 8.11 CI/CD for AI Models

### 8.11.1 Pipeline Stages

```yaml
# .github/workflows/ai-model-ci.yml
name: AI Model CI/CD

on:
  push:
    paths:
      - 'ml/training/**'
      - 'ml/models/**'
  workflow_dispatch:
    inputs:
      model:
        type: choice
        options: [player_detection, ball_detection, action_recognition]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Lint (ruff, black)
      - name: Unit tests (pytest)
      - name: Type check (mypy)

  train:
    needs: lint-and-test
    runs-on: [self-hosted, gpu, a10g]
    timeout-minutes: 480
    steps:
      - uses: actions/checkout@v4
      - name: Pull dataset (DVC)
      - name: Train model
        run: python ml/training/train.py --model ${{ inputs.model }}
      - name: Evaluate on holdout
      - name: Log to MLflow
      - name: Upload artifacts

  evaluate:
    needs: train
    runs-on: ubuntu-latest
    steps:
      - name: Download model artifacts
      - name: Run evaluation suite
        # mAP, per-class metrics, latency, fairness checks
      - name: Compare to production baseline
      - name: Gate: fail if regression

  promote-staging:
    needs: evaluate
    if: success()
    runs-on: ubuntu-latest
    steps:
      - name: Transition MLflow model to Staging
      - name: Deploy canary to staging env
      - name: Run staging validation (smoke tests)

  promote-production:
    needs: promote-staging
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - name: Wait for 24h canary stability
      - name: Transition to Production
      - name: Deploy to production (blue/green)
      - name: Notify team
```

---

## 8.12 MLOps Infrastructure Requirements

| Component | Tool | Purpose |
|-----------|------|---------|
| **Experiment Tracking** | MLflow | Params, metrics, artifacts, models |
| **Model Registry** | MLflow Model Registry | Versioning, staging, promotion |
| **Dataset Versioning** | DVC + S3/MinIO | Data lineage, reproducibility |
| **Pipeline Orchestration** | Prefect / Airflow | Training, evaluation, deployment DAGs |
| **Feature Store** | Feast (future) | Shared features across models |
| **Monitoring** | Prometheus + Grafana + Evidently | Drift, performance, data quality |
| **Labeling** | Label Studio | Collaborative annotation |
| **Compute** | Kubernetes + NVIDIA GPU Operator | Scalable training/inference |
| **Artifact Storage** | MinIO (S3-compatible) | Models, datasets, evaluation reports |

---

## 8.13 Security & Compliance for AI

| Concern | Mitigation |
|---------|------------|
| **Model IP Protection** | Encrypted model artifacts, access-controlled registry |
| **Data Privacy** | No PII in training data (jersey numbers only), face blur in videos |
| **Bias Monitoring** | Per-demographic accuracy tracking (gender, age group, venue) |
| **Audit Trail** | Immutable log of every model version, dataset, promotion decision |
| **Adversarial Robustness** | Periodic adversarial evaluation (FGSM, PGD attacks) |

---

## 8.14 Summary: AI & MLOps Deliverables

| Deliverable | Description |
|-------------|-------------|
| **Dataset Catalog** | Versioned, documented, quality-gated datasets |
| **Training Pipelines** | Reproducible, parameterized, tracked in MLflow |
| **Model Registry** | Centralized, versioned, staged model store |
| **Inference Service** | Optimized (ONNX/TensorRT), batched, monitored |
| **Drift Detection** | Automated, alerting, triggers retraining |
| **Labeling Platform** | AI-assisted, QA-gated, gold-standard creation |
| **CI/CD for AI** | Train → Evaluate → Canary → Promote → Monitor |
| **GPU Management** | MPS, dynamic batching, queue-based scheduling |
| **Human-in-the-Loop** | Statistician review UI, correction → gold data |

---

**END OF CHAPTER 8**

---

# CHAPTER 9: VOLLEYBALL DOMAIN ENGINE

---

## 9.1 Vision

The Volleyball Domain Engine is the **business brain** of the platform. It bridges the gap between raw computer vision outputs (detections, poses, trajectories) and meaningful volleyball intelligence (events, statistics, analytics, insights).

While the AI layer answers *"What did the camera see?"*, the Domain Engine answers *"What happened in the volleyball match?"*

**Core Principle:** Separate **observation** (AI) from **interpretation** (Domain Rules).

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DOMAIN ENGINE ARCHITECTURE                          │
└─────────────────────────────────────────────────────────────────────────────┘

AI Detection Layer
      │
      ▼  Raw Observations
┌────────────────────┐
│ • Player positions │
│ • Ball trajectory  │
│ • Body poses       │
│ • Jersey numbers   │
│ • Timestamps       │
└────────┬───────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ VOLLEYBALL DOMAIN ENGINE                                                    │
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│ │ RULES ENGINE    │  │ STATE MACHINES  │  │ STATISTICS ENG. │              │
│ │ • Event defs    │  │ • Rally state   │  │ • Counters      │              │
│ │ • Validation    │  │ • Rotation      │  │ • Formulas      │              │
│ │ • Confidence    │  │ • Substitutions │  │ • Aggregations  │              │
│ └─────────────────┘  └─────────────────┘  └─────────────────┘              │
└────────┬────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ DOMAIN OUTPUTS                                                               │
│ • Validated Events (Kill, Ace, Dig, Block, etc.)                           │
│ • Live Statistics (per player, per team, per match)                        │
│ • Match Timeline (chronological event stream)                              │
│ • Analytics (Heatmaps, Zones, Efficiency Ratings)                          │
│ • AI Insights (MVP, Best Server, Predictions)                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 9.2 Why Separate the Domain Engine?

| Problem with Mixed AI + Rules | Domain Engine Solution |
|------------------------------|------------------------|
| Rule changes require retraining | Rules updated in config, no retraining |
| Hard to test edge cases | Pure functions, unit-testable |
| League-specific rules (NCAA vs FIVB) | Swappable rule sets |
| AI confidence misused as truth | Confidence → Review queue → Ground truth |
| Statistics logic scattered | Single source of truth for formulas |

---

## 9.3 Core Components

### 9.3.1 Event Definition Registry

Every volleyball action is explicitly defined with:

```yaml
# domain/events/serve.yaml
event:
  id: "serve"
  category: "serving"
  aliases: ["service"]
  
  trigger:
    # AI observation pattern that suggests this event
    ai_pattern:
      - ball_speed_increase > threshold
      - server_position: behind_endline
      - server_arm_motion: overhead
      - ball_trajectory: over_net
      
  validation_rules:
    - must_have: server_track_id
    - must_have: ball_contact_frame
    - server_team == serving_team
    - ball_crosses_net
    
  outcomes:
    - ace
    - service_error
    - reception
    - reception_error
    
  statistics_impact:
    server:
      total_serves: +1
      aces: +1 (if outcome == ace)
      service_errors: +1 (if outcome == service_error)
    receiver:
      reception_attempts: +1 (if outcome in [reception, reception_error])
      
  confidence_threshold: 0.6
  review_threshold: 0.75
```

### 9.3.2 Complete Event Catalog

| Event ID | Category | Trigger Pattern | Primary Actor | Outcomes |
|----------|----------|-----------------|---------------|----------|
| `serve` | Serving | Ball launched from behind endline | Server | ace, service_error, reception, reception_error |
| `reception` | Receiving | First contact on serve | Receiver | perfect, good, poor, error |
| `set` | Setting | Overhead contact, ball directed to attacker | Setter | assist, setting_error |
| `spike` | Attacking | Jump + overhead swing + high velocity | Attacker | kill, attack_error, blocked |
| `kill` | Attacking | Spike → ball lands in opponent court | Attacker | point |
| `attack_error` | Attacking | Spike → out/net/antenna | Attacker | side_out |
| `block` | Blocking | Jump at net, hands above net, ball contact | Blocker(s) | solo_block, block_assist, block_error |
| `dig` | Defense | Hard-driven ball saved, kept in play | Digger | dig, save |
| `free_ball` | Defense | Easy ball passed over net | Any | free_ball |
| `net_touch` | Violation | Player touches net during play | Violator | side_out |
| `rotation_fault` | Violation | Wrong rotation at serve moment | Team | side_out |
| `substitution` | Admin | Player exchange during dead ball | Coach | — |
| `timeout` | Admin | Team timeout called | Coach | — |

---

## 9.4 Rally State Machine

The heart of the domain engine is the **Rally State Machine** — a deterministic finite automaton that tracks the complete lifecycle of every rally.

### 9.4.1 States

```python
class RallyState(Enum):
    PRE_SERVE = "pre_serve"           # Before serve, rotation validated
    SERVE_IN_FLIGHT = "serve_in_flight"  # Ball served, traveling
    RECEPTION = "reception"           # Receiving team first contact
    PLAY_IN_PROGRESS = "play_in_progress"  # Normal rally
    BALL_OUT_OF_PLAY = "ball_out_of_play"  # Point scored, rally ended
    BETWEEN_RALLIES = "between_rallies"    # Score updated, preparing next serve
    SET_OVER = "set_over"             # Set point reached
    MATCH_OVER = "match_over"         # Match point reached
```

### 9.4.2 Transitions

| From State | Event | To State | Side Effects |
|------------|-------|----------|--------------|
| `PRE_SERVE` | `serve` (valid) | `SERVE_IN_FLIGHT` | Start rally timer |
| `SERVE_IN_FLIGHT` | `ace` | `BALL_OUT_OF_PLAY` | Point to server, rotation |
| `SERVE_IN_FLIGHT` | `service_error` | `BALL_OUT_OF_PLAY` | Point to receiver, rotation |
| `SERVE_IN_FLIGHT` | `reception` | `RECEPTION` | — |
| `RECEPTION` | `set` | `PLAY_IN_PROGRESS` | — |
| `PLAY_IN_PROGRESS` | `spike` → `kill` | `BALL_OUT_OF_PLAY` | Point to attacker |
| `PLAY_IN_PROGRESS` | `spike` → `attack_error` | `BALL_OUT_OF_PLAY` | Point to opponent |
| `PLAY_IN_PROGRESS` | `block` → `kill` | `BALL_OUT_OF_PLAY` | Point to blocker |
| `PLAY_IN_PROGRESS` | `dig` | `PLAY_IN_PROGRESS` | Continue rally |
| `BALL_OUT_OF_PLAY` | `update_score` | `BETWEEN_RALLIES` | Check set/match end |
| `BETWEEN_RALLIES` | `next_serve` | `PRE_SERVE` | Increment rally count |

### 9.4.3 Rally Data Structure

```python
@dataclass
class Rally:
    rally_id: str
    match_id: str
    set_number: int
    rally_number: int
    serving_team_id: int
    server_player_id: int
    receiving_team_id: int
    state: RallyState
    start_time: datetime
    end_time: Optional[datetime]
    duration_seconds: float
    events: List[ValidatedEvent]
    point_winner_team_id: Optional[int]
    point_winner_player_id: Optional[int]
    rotation_serving: List[PlayerRotation]  # 6 players in order
    rotation_receiving: List[PlayerRotation]
```

---

## 9.5 Rotation Tracking Engine

### 9.5.1 Rotation Rules (FIVB Standard)

| Position | Zone | Front/Back | Rotation Order |
|----------|------|------------|----------------|
| 1 | Right Back | Back Row | 1 → 6 → 5 → 4 → 3 → 2 → 1 |
| 2 | Right Front | Front Row | (Clockwise after side-out) |
| 3 | Middle Front | Front Row | |
| 4 | Left Front | Front Row | |
| 5 | Left Back | Back Row | |
| 6 | Middle Back | Back Row | |

### 9.5.2 Rotation Validation

```python
def validate_rotation_at_serve(
    serving_team_rotation: List[PlayerRotation],
    receiving_team_rotation: List[PlayerRotation],
    server_player_id: int
) -> ValidationResult:
    """
    Validates:
    1. Server is in position 1 (Right Back)
    2. No overlap violations (front/back, left/right)
    3. Libero not in front row (if applicable)
    """
    # Check server position
    server_pos = find_position(serving_team_rotation, server_player_id)
    if server_pos != 1:
        return ValidationResult(valid=False, violation="rotation_fault", 
            detail=f"Server {server_player_id} in position {server_pos}, expected 1")
    
    # Check overlap rules
    for team_rotation in [serving_team_rotation, receiving_team_rotation]:
        if has_overlap_violation(team_rotation):
            return ValidationResult(valid=False, violation="rotation_fault",
                detail="Overlap violation detected")
    
    return ValidationResult(valid=True)
```

### 9.5.3 Substitution Management

```python
@dataclass
class Substitution:
    substitution_id: str
    match_id: str
    set_number: int
    team_id: int
    player_in_id: int
    player_out_id: int
    rally_number: int
    score_at_sub: Tuple[int, int]  # (home, away)
    timestamp: datetime
    type: SubstitutionType  # NORMAL, LIBERO, EXCEPTIONAL, RECOVERY

# Rules:
# - Max 6 substitutions per set per team (FIVB)
# - Libero replacements unlimited, not counted
# - Exceptional substitution for injury
# - Players can only re-enter for same player they replaced
```

---

## 9.6 Scorekeeping Engine

### 9.6.1 Point Awarding Logic

```python
def award_point(rally: Rally, winning_team_id: int, winning_player_id: Optional[int],
                point_type: PointType) -> ScoreUpdate:
    """
    PointType: ATTACK_POINT, SERVE_POINT, BLOCK_POINT, OPPONENT_ERROR, PENALTY
    """
    # Update set score
    set_score = update_set_score(rally.set_number, winning_team_id)
    
    # Check set end
    set_winner = check_set_win(set_score)
    if set_winner:
        # Update match score
        match_score = update_match_score(set_winner)
        
        # Check match end
        match_winner = check_match_win(match_score)
        
        return ScoreUpdate(
            set_score=set_score,
            set_winner=set_winner,
            match_score=match_score,
            match_winner=match_winner,
            rotation_change=should_rotate(winning_team_id, rally.serving_team_id)
        )
    
    return ScoreUpdate(set_score=set_score, rotation_change=False)
```

### 9.6.2 Set/Match Format Rules

| Format | Sets to Win | Points per Set (1-N) | Points Final Set | Win by |
|--------|-------------|---------------------|------------------|--------|
| Best of 3 | 2 | 25 | 15 | 2 |
| Best of 5 | 3 | 25 | 15 | 2 |
| Custom | Configurable | Configurable | Configurable | Configurable |

---

## 9.7 Statistics Engine

### 9.7.1 Statistics Formula Registry

Every statistic is defined as a **pure function** mapping events → numeric values.

```python
# domain/statistics/formulas.py

STATISTICS_FORMULAS = {
    # Serving
    "serve_pct": lambda stats: (stats.total_serves - stats.service_errors) / stats.total_serves * 100,
    "ace_pct": lambda stats: stats.aces / stats.total_serves * 100,
    "service_error_rate": lambda stats: stats.service_errors / stats.total_serves * 100,
    
    # Attacking
    "kill_pct": lambda stats: stats.kills / stats.attack_attempts * 100,
    "hitting_efficiency": lambda stats: (stats.kills - stats.attack_errors - stats.blocked_attacks) / stats.attack_attempts * 100,
    "attack_error_rate": lambda stats: stats.attack_errors / stats.attack_attempts * 100,
    
    # Blocking
    "blocks_per_set": lambda stats: (stats.solo_blocks + stats.block_assists) / stats.sets_played,
    "block_efficiency": lambda stats: (stats.solo_blocks + stats.block_assists) / (stats.block_attempts or 1) * 100,
    
    # Receiving
    "reception_pct": lambda stats: (stats.perfect_receptions + stats.good_receptions) / stats.reception_attempts * 100,
    "reception_error_rate": lambda stats: stats.reception_errors / stats.reception_attempts * 100,
    
    # Setting
    "assist_pct": lambda stats: stats.assists / stats.set_attempts * 100,
    "setting_error_rate": lambda stats: stats.setting_errors / stats.set_attempts * 100,
    
    # Defense
    "digs_per_set": lambda stats: stats.digs / stats.sets_played,
    
    # Composite
    "player_efficiency_rating": lambda stats: (
        stats.kills * 1.0 + stats.aces * 1.5 + stats.solo_blocks * 1.2 + 
        stats.block_assists * 0.8 + stats.digs * 0.7 + stats.assists * 1.0 -
        stats.service_errors * 0.5 - stats.attack_errors * 0.8 - stats.reception_errors * 0.5
    )
}
```

### 9.7.2 Per-Match Statistics Structure

```python
@dataclass
class PlayerMatchStatistics:
    player_id: int
    match_id: int
    sets_played: int
    
    # Serving
    total_serves: int = 0
    aces: int = 0
    service_errors: int = 0
    
    # Attacking
    attack_attempts: int = 0
    kills: int = 0
    attack_errors: int = 0
    blocked_attacks: int = 0
    
    # Blocking
    solo_blocks: int = 0
    block_assists: int = 0
    block_errors: int = 0
    
    # Defense
    digs: int = 0
    saves: int = 0
    
    # Receiving
    reception_attempts: int = 0
    perfect_receptions: int = 0
    good_receptions: int = 0
    poor_receptions: int = 0
    reception_errors: int = 0
    
    # Setting
    set_attempts: int = 0
    assists: int = 0
    setting_errors: int = 0
    
    # Movement (from tracking)
    distance_covered_m: float = 0.0
    avg_speed_kmh: float = 0.0
    max_speed_kmh: float = 0.0
    jump_count: int = 0
    max_jump_height_cm: float = 0.0
    avg_jump_height_cm: float = 0.0
    
    # Playing time
    playing_time_seconds: float = 0.0
    
    # Computed properties
    @property
    def kill_pct(self) -> float:
        return self.kills / self.attack_attempts * 100 if self.attack_attempts > 0 else 0.0
    
    @property
    def hitting_efficiency(self) -> float:
        return (self.kills - self.attack_errors - self.blocked_attacks) / self.attack_attempts * 100 if self.attack_attempts > 0 else 0.0
```

### 9.7.3 Real-Time Statistics Updates

```python
class StatisticsEngine:
    def __init__(self):
        self.formulas = STATISTICS_FORMULAS
        self.event_handlers = self._build_event_handlers()
    
    def process_event(self, event: ValidatedEvent, match_context: MatchContext) -> StatUpdate:
        """Process a single validated event and return stat deltas."""
        handler = self.event_handlers.get(event.event_type)
        if handler:
            return handler(event, match_context)
        return StatUpdate()  # No change
    
    def _build_event_handlers(self) -> Dict[str, Callable]:
        return {
            "serve": self._handle_serve,
            "ace": self._handle_ace,
            "service_error": self._handle_service_error,
            "reception": self._handle_reception,
            "set": self._handle_set,
            "spike": self._handle_spike,
            "kill": self._handle_kill,
            "attack_error": self._handle_attack_error,
            "blocked_attack": self._handle_blocked_attack,
            "block": self._handle_block,
            "dig": self._handle_dig,
            "free_ball": self._handle_free_ball,
            "net_touch": self._handle_net_touch,
            "rotation_fault": self._handle_rotation_fault,
        }
```

---

## 9.8 Analytics Engines

### 9.8.1 Heatmap Engine

```python
class HeatmapEngine:
    GRID_COLS = 12
    GRID_ROWS = 6  # 18m x 9m court → 1.5m x 1.5m cells
    
    def generate(self, events: List[ValidatedEvent], player_id: int, 
                 match_id: int, set_id: Optional[int] = None) -> HeatmapData:
        grid = np.zeros((self.GRID_ROWS, self.GRID_COLS), dtype=int)
        
        for event in events:
            if event.player_id == player_id:
                x, y = event.court_position  # Normalized 0-1
                col = min(int(x * self.GRID_COLS), self.GRID_COLS - 1)
                row = min(int(y * self.GRID_ROWS), self.GRID_ROWS - 1)
                grid[row, col] += 1
        
        return HeatmapData(
            grid=grid.tolist(),
            total_events=grid.sum(),
            zones=self._aggregate_to_zones(grid)
        )
    
    def _aggregate_to_zones(self, grid: np.ndarray) -> Dict[str, int]:
        """Aggregate to volleyball-specific zones."""
        # Zone 1: Right Back, Zone 2: Right Front, Zone 3: Middle Front
        # Zone 4: Left Front, Zone 5: Left Back, Zone 6: Middle Back
        # Net zones: 7-9 (front row attack zones)
        return {
            "zone_1": grid[5, 0:2].sum(),  # Right Back
            "zone_2": grid[2, 0:2].sum(),  # Right Front
            "zone_3": grid[2, 4:8].sum(),  # Middle Front
            "zone_4": grid[2, 10:12].sum(), # Left Front
            "zone_5": grid[5, 10:12].sum(), # Left Back
            "zone_6": grid[5, 4:8].sum(),   # Middle Back
        }
```

### 9.8.2 Attack Zone Analysis

```python
class AttackZoneAnalyzer:
    """Analyzes where attacks originate and where they land."""
    
    ATTACK_ZONES = {
        "zone_1": "Right Back (Pipe/Back Row)",
        "zone_2": "Right Front (Outside/Opposite)",
        "zone_3": "Middle Front (Quick/Middle)",
        "zone_4": "Left Front (Outside)",
        "zone_5": "Left Back (Back Row)",
        "zone_6": "Middle Back (Back Row)",
    }
    
    LANDING_ZONES = {
        "deep_corner": "Deep corner (zones 1, 5)",
        "short_corner": "Short corner (zones 1, 5 near net)",
        "line": "Down the line (zones 1, 4, 5)",
        "cross_court": "Cross court (zones 2, 3, 4)",
        "middle": "Middle of court (zone 6)",
        "out": "Out of bounds",
        "blocked": "Blocked by opponent",
    }
```

### 9.8.3 Team Analytics Engine

```python
class TeamAnalyticsEngine:
    def analyze(self, match_id: int, team_id: int) -> TeamAnalytics:
        match_stats = self._get_match_stats(match_id, team_id)
        
        return TeamAnalytics(
            # Offensive
            attack_efficiency=match_stats.hitting_efficiency,
            kill_percentage=match_stats.kill_pct,
            sideout_percentage=self._calc_sideout_pct(match_id, team_id),
            first_ball_kill_pct=self._calc_first_ball_kill_pct(match_id, team_id),
            
            # Setting
            setter_distribution=self._calc_setter_distribution(match_id, team_id),
            assist_to_error_ratio=match_stats.assists / max(match_stats.setting_errors, 1),
            
            # Serving
            serve_efficiency=match_stats.serve_pct,
            ace_per_set=match_stats.aces / match_stats.sets_played,
            service_error_rate=match_stats.service_error_rate,
            serve_placement=self._analyze_serve_placement(match_id, team_id),
            
            # Blocking
            blocks_per_set=match_stats.blocks_per_set,
            block_efficiency=match_stats.block_efficiency,
            solo_to_assist_ratio=match_stats.solo_blocks / max(match_stats.block_assists, 1),
            
            # Defense
            digs_per_set=match_stats.digs_per_set,
            reception_quality=self._calc_reception_quality_distribution(match_id, team_id),
            
            # Rotation
            rotation_efficiency=self._calc_rotation_efficiency(match_id, team_id),
            point_scoring_by_rotation=self._points_by_rotation(match_id, team_id),
        )
```

---

## 9.9 Player Rating Engine

### 9.9.1 Configurable Weighted Rating

```python
@dataclass
class RatingWeights:
    """Configurable weights for player rating calculation."""
    kills: float = 30.0
    blocks: float = 20.0
    assists: float = 15.0
    digs: float = 15.0
    aces: float = 10.0
    reception_quality: float = 10.0  # Perfect=3, Good=2, Poor=1
    service_errors: float = -5.0
    attack_errors: float = -8.0
    reception_errors: float = -5.0
    setting_errors: float = -5.0
    net_touches: float = -10.0
    rotation_faults: float = -10.0

class PlayerRatingEngine:
    def __init__(self, weights: Optional[RatingWeights] = None):
        self.weights = weights or RatingWeights()
    
    def calculate(self, stats: PlayerMatchStatistics) -> float:
        score = (
            stats.kills * self.weights.kills +
            (stats.solo_blocks + stats.block_assists) * self.weights.blocks +
            stats.assists * self.weights.assists +
            stats.digs * self.weights.digs +
            stats.aces * self.weights.aces +
            (stats.perfect_receptions * 3 + stats.good_receptions * 2 + stats.poor_receptions * 1) * 
                self.weights.reception_quality / 6.0 +
            stats.service_errors * self.weights.service_errors +
            stats.attack_errors * self.weights.attack_errors +
            stats.reception_errors * self.weights.reception_errors +
            stats.setting_errors * self.weights.setting_errors
        )
        return round(score, 2)
    
    def calculate_season_rating(self, player_id: int, season_id: int) -> float:
        """Aggregate match ratings with recency weighting."""
        matches = self._get_player_matches(player_id, season_id)
        if not matches:
            return 0.0
        
        # Weight recent matches more heavily (exponential decay)
        total_weight = 0.0
        weighted_sum = 0.0
        
        for i, match in enumerate(reversed(matches)):  # Most recent first
            weight = math.exp(-i * 0.1)  # Decay factor
            match_rating = self.calculate(match.statistics)
            weighted_sum += match_rating * weight
            total_weight += weight
        
        return round(weighted_sum / total_weight, 2)
```

---

## 9.10 Match Timeline Engine

```python
@dataclass
class TimelineEvent:
    timestamp: datetime
    rally_number: int
    set_number: int
    event_type: str
    description: str  # Human-readable: "Smith #8 Kill (Zone 4)"
    player_id: Optional[int]
    team_id: int
    outcome: str  # point, side_out, error, neutral
    score_before: Tuple[int, int]
    score_after: Tuple[int, int]
    video_timestamp_ms: int  # For replay sync
    confidence: float

class MatchTimelineEngine:
    def generate(self, match: Match, events: List[ValidatedEvent]) -> List[TimelineEvent]:
        timeline = []
        
        for event in sorted(events, key=lambda e: e.timestamp_seconds):
            desc = self._format_description(event)
            score_before, score_after = self._calculate_score_delta(event, match)
            
            timeline.append(TimelineEvent(
                timestamp=event.timestamp,
                rally_number=event.rally_number,
                set_number=event.set_number,
                event_type=event.event_type,
                description=desc,
                player_id=event.player_id,
                team_id=event.team_id,
                outcome=event.outcome,
                score_before=score_before,
                score_after=score_after,
                video_timestamp_ms=int(event.timestamp_seconds * 1000),
                confidence=event.confidence
            ))
        
        return timeline
    
    def _format_description(self, event: ValidatedEvent) -> str:
        player = f"{event.player_last_name} #{event.jersey_number}" if event.player_id else "Unknown"
        
        templates = {
            "serve": f"{player} serves",
            "ace": f"{player} ACE!",
            "service_error": f"{player} service error",
            "reception": f"{player} reception ({event.reception_quality})",
            "set": f"{player} sets",
            "spike": f"{player} attacks",
            "kill": f"{player} KILL!",
            "attack_error": f"{player} attack error",
            "block": f"{player} block",
            "dig": f"{player} dig",
            "free_ball": f"{player} free ball",
        }
        
        return templates.get(event.event_type, f"{player}: {event.event_type}")
```

---

## 9.11 Video-Replay Integration

```python
@dataclass
class VideoClip:
    match_id: int
    start_time_ms: int
    end_time_ms: int
    event_id: str
    description: str
    tags: List[str]  # ["kill", "zone_4", "player_8"]

class ReplayService:
    def __init__(self, video_storage: ObjectStorage, timeline_engine: MatchTimelineEngine):
        self.storage = video_storage
        self.timeline = timeline_engine
    
    def get_clips_for_event(self, event: ValidatedEvent, 
                           pre_seconds: int = 3, post_seconds: int = 2) -> List[VideoClip]:
        """Generate video clips around an event."""
        start_ms = max(0, int(event.timestamp_seconds * 1000) - pre_seconds * 1000)
        end_ms = int(event.timestamp_seconds * 1000) + post_seconds * 1000
        
        clip = VideoClip(
            match_id=event.match_id,
            start_time_ms=start_ms,
            end_time_ms=end_ms,
            event_id=event.event_id,
            description=self._format_clip_title(event),
            tags=self._generate_tags(event)
        )
        return [clip]
    
    def get_player_highlights(self, match_id: int, player_id: int,
                              event_types: Optional[List[str]] = None) -> List[VideoClip]:
        """Compile all highlights for a player in a match."""
        events = self._get_player_events(match_id, player_id, event_types)
        clips = []
        for event in events:
            clips.extend(self.get_clips_for_event(event))
        return clips
    
    def get_team_highlights(self, match_id: int, team_id: int,
                           event_types: Optional[List[str]] = None) -> List[VideoClip]:
        """Compile team highlights (e.g., all kills, all blocks)."""
        events = self._get_team_events(match_id, team_id, event_types)
        clips = []
        for event in events:
            clips.extend(self.get_clips_for_event(event))
        return clips
```

---

## 9.12 Event Confidence & Review Workflow

```python
@dataclass
class EventConfidencePolicy:
    """Configurable confidence thresholds."""
    auto_accept: float = 0.85      # Above: accept without review
    review_queue: float = 0.60     # Between: send to statistician
    auto_reject: float = 0.40      # Below: discard (log only)
    
    # Per-event overrides
    event_overrides: Dict[str, Dict[str, float]] = field(default_factory=lambda: {
        "ace": {"auto_accept": 0.80, "review_queue": 0.55},
        "kill": {"auto_accept": 0.80, "review_queue": 0.55},
        "block": {"auto_accept": 0.75, "review_queue": 0.50},
        "dig": {"auto_accept": 0.70, "review_queue": 0.45},
        "rotation_fault": {"auto_accept": 0.95, "review_queue": 0.80},
    })

class ConfidenceWorkflow:
    def __init__(self, policy: EventConfidencePolicy):
        self.policy = policy
    
    def route_event(self, event: ValidatedEvent) -> EventRoute:
        thresholds = self.policy.event_overrides.get(
            event.event_type, 
            {"auto_accept": self.policy.auto_accept, "review_queue": self.policy.review_queue}
        )
        
        if event.confidence >= thresholds["auto_accept"]:
            return EventRoute.AUTO_ACCEPT
        elif event.confidence >= thresholds["review_queue"]:
            return EventRoute.STATISTICIAN_REVIEW
        else:
            return EventRoute.AUTO_REJECT
```

---

## 9.13 Volleyball Knowledge Base (Configurable Rules)

```python
@dataclass
class VolleyballRulesConfig:
    """Centralized volleyball rules configuration."""
    
    # Court dimensions
    court_length_m: float = 18.0
    court_width_m: float = 9.0
    net_height_m_men: float = 2.43
    net_height_m_women: float = 2.24
    attack_line_distance_m: float = 3.0
    
    # Scoring
    points_per_set: int = 25
    points_final_set: int = 15
    win_by: int = 2
    sets_best_of: int = 5  # 3 or 5
    
    # Team
    players_on_court: int = 6
    max_substitutions_per_set: int = 6
    libero_allowed: bool = True
    libero_replacements_unlimited: bool = True
    
    # Rotation
    rotation_order: List[int] = [1, 6, 5, 4, 3, 2]  # Clockwise
    overlap_rules_enabled: bool = True
    
    # Event definitions
    reception_quality_scale: List[str] = ["perfect", "good", "poor", "error"]
    
    # Timeouts
    timeouts_per_set: int = 2
    timeout_duration_seconds: int = 30
    
    # Technical timeouts (FIVB)
    technical_timeout_points: List[int] = [8, 16]

# League-specific overrides
LEAGUE_CONFIGS = {
    "fivb": VolleyballRulesConfig(),
    "ncaa_women": VolleyballRulesConfig(
        points_per_set=25, points_final_set=15, sets_best_of=5,
        substitution_rules="12 per set",  # Different from FIVB
    ),
    "high_school": VolleyballRulesConfig(
        sets_best_of=3,
        max_substitutions_per_set=18,  # Unlimited essentially
    ),
    "beach": VolleyballRulesConfig(
        court_length_m=16.0, court_width_m=8.0,
        players_on_court=2, max_substitutions_per_set=0,
        libero_allowed=False, rotation_order=[1, 2],
    ),
}
```

---

## 9.14 Business Rule Engine Implementation

```python
class BusinessRuleEngine:
    """
    Centralized rule engine — single source of truth for all volleyball logic.
    """
    
    def __init__(self, config: VolleyballRulesConfig):
        self.config = config
        self.event_definitions = self._load_event_definitions()
        self.statistics_formulas = self._load_statistics_formulas()
    
    def validate_event(self, event: RawEvent, context: MatchContext) -> ValidationResult:
        """Apply all validation rules for an event."""
        definition = self.event_definitions[event.event_type]
        
        # Run all validation rules
        for rule in definition.validation_rules:
            result = rule.validate(event, context, self.config)
            if not result.valid:
                return result
        
        return ValidationResult(valid=True)
    
    def calculate_statistics(self, events: List[ValidatedEvent], 
                            player_id: int) -> PlayerStatistics:
        """Apply all statistics formulas."""
        stats = PlayerStatistics()
        
        for event in events:
            if event.player_id == player_id:
                formula = self.statistics_formulas.get(event.event_type)
                if formula:
                    formula.apply(event, stats)
        
        return stats
    
    def get_event_definition(self, event_type: str) -> EventDefinition:
        return self.event_definitions[event_type]
    
    def get_scoring_rules(self) -> ScoringRules:
        return ScoringRules(
            points_per_set=self.config.points_per_set,
            points_final_set=self.config.points_final_set,
            win_by=self.config.win_by,
            sets_best_of=self.config.sets_best_of,
        )
```

---

## 9.15 Multi-Variant Support

| Variant | Key Differences | Configuration |
|---------|-----------------|---------------|
| **Indoor (FIVB)** | 6v6, 18x9m, libero, 25pt sets | `fivb` |
| **NCAA Women** | 6v6, 12 subs/set, challenge system | `ncaa_women` |
| **NCAA Men** | 6v6, 15 subs/set | `ncaa_men` |
| **High School** | 3v3 or 6v6, unlimited subs | `high_school` |
| **Beach** | 2v2, 16x8m, no libero, no rotation | `beach` |
| **Sitting** | 6v6, 10x6m, lower net, floor contact allowed | `sitting` |
| **Youth/Junior** | Lower net, smaller court, modified rules | `youth` |

**Adding a new variant:** Create new `VolleyballRulesConfig` — no code changes.

---

## 9.16 Long-Term Vision

The Volleyball Domain Engine should evolve into a **reusable sport intelligence platform**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    VOLLEYBALL INTELLIGENCE PLATFORM                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Indoor     │  │    Beach     │  │   Sitting    │  │    Youth     │   │
│  │  (FIVB/NCAA) │  │   (FIVB)     │  │  (Paralymp)  │  │  (Modified)  │   │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘   │
│         │                 │                 │                 │            │
│         └─────────────────┼─────────────────┼─────────────────┘            │
│                           ▼                                                 │
│              ┌─────────────────────────────┐                              │
│              │   SHARED DOMAIN ENGINE      │                              │
│              │  • Event Definitions        │                              │
│              │  • State Machines           │                              │
│              │  • Statistics Formulas      │                              │
│              │  • Rating Algorithms        │                              │
│              │  • Analytics Engines        │                              │
│              │  • Rule Configurations      │                              │
│              └──────────────┬──────────────┘                              │
│                             │                                             │
│              ┌──────────────┴──────────────┐                              │
│              │      AI OBSERVATION LAYER   │                              │
│              │  • Detection                │                              │
│              │  • Tracking                 │                              │
│              │  • Pose                     │                              │
│              │  • Recognition              │                              │
│              └─────────────────────────────┘                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

**END OF CHAPTER 9**

---

# CHAPTER 10: VIDEO INTELLIGENCE PIPELINE (VIP)

---

## 10.1 Purpose

The Video Intelligence Pipeline (VIP) is responsible for transforming raw video into structured volleyball intelligence. It is the first stage of the AI platform and serves as the foundation for all downstream processing, including player tracking, action recognition, statistics generation, and analytics.

**Primary Responsibilities:**

- Video acquisition from multiple sources
- Camera management and registration
- Frame extraction and timestamping
- Camera calibration and court mapping
- Multi-camera synchronization
- Video preprocessing and frame buffering
- Frame distribution to AI inference modules
- Timestamp synchronization across sources
- Replay support and video storage

---

## 10.2 Pipeline Overview

```
                    Camera(s)
                         │
                         ▼
              ┌────────────────────┐
              │ Video Acquisition  │
              │      Layer         │
              └────────┬───────────┘
                       │
                       ▼
              ┌────────────────────┐
              │ Stream             │
              │ Synchronization    │
              └────────┬───────────┘
                       │
                       ▼
              ┌────────────────────┐
              │ Frame Extraction   │
              │      Engine        │
              └────────┬───────────┘
                       │
                       ▼
              ┌────────────────────┐
              │ Video Preprocessing│
              │      Layer         │
              └────────┬───────────┘
                       │
                       ▼
              ┌────────────────────┐
              │ Court Calibration  │
              │      Engine        │
              └────────┬───────────┘
                       │
                       ▼
              ┌────────────────────┐
              │ AI Inference       │
              │    Dispatcher      │
              └────────┬───────────┘
                       │
           ┌───────────┼───────────┐
           ▼           ▼           ▼
    ┌────────────┐ ┌──────────┐ ┌────────────┐
    │ Player     │ │ Ball     │ │ Tracking   │
    │ Detection  │ │ Detection│ │            │
    └────────────┘ └──────────┘ └────────────┘
           │           │           │
           ▼           ▼           ▼
    ┌────────────┐ ┌──────────┐ ┌────────────┐
    │ Pose       │ │ OCR      │ │ Action     │
    │ Estimation │ │          │ │ Recognition│
    └────────────┘ └──────────┘ └────────────┘
           │           │           │
           └───────────┼───────────┘
                       ▼
              ┌────────────────────┐
              │ Volleyball Domain  │
              │     Engine         │
              └────────┬───────────┘
                       │
                       ▼
              ┌────────────────────┐
              │ Statistics Engine  │
              └────────┬───────────┘
                       │
                       ▼
              ┌────────────────────┐
              │ Dashboard + DB +   │
              │      Replay        │
              └────────────────────┘
```

---

## 10.3 Camera Management System

### 10.3.1 Supported Input Sources

| Source Type | Examples | Use Case |
|-------------|----------|----------|
| **USB Cameras** | Logitech C920, Brio, generic webcams, laptop cameras | Development, testing, low-cost deployment |
| **RTSP Cameras** | Professional IP cameras (`rtsp://camera-ip/live`) | Production matches, fixed installations |
| **IP Cameras** | Wireless/Ethernet cameras (ONVIF, proprietary) | Schools, clubs, tournament venues |
| **Video Files** | MP4, AVI, MOV, MKV | Post-match analysis, training, archival |
| **Broadcast Feeds** (Future) | SDI/NDI/HLS professional streams | Live broadcast integration |

### 10.3.2 Camera Registration Metadata

Every camera must be registered with the following metadata:

| Field | Type | Description |
|-------|------|-------------|
| `camera_id` | UUID | Unique system identifier |
| `camera_name` | String | Human-readable name (e.g., "Court Main", "Side View") |
| `location` | Enum | `court_main`, `side_left`, `side_right`, `overhead`, `behind_server` |
| `source_type` | Enum | `usb`, `rtsp`, `ip_camera`, `file`, `broadcast` |
| `connection_string` | String | USB device index, RTSP URL, or file path |
| `resolution_width` | Integer | Frame width in pixels |
| `resolution_height` | Integer | Frame height in pixels |
| `target_fps` | Integer | Desired frame rate |
| `lens_type` | Enum | `standard`, `wide_angle`, `fisheye` |
| `status` | Enum | `online`, `offline`, `degraded`, `calibrating` |
| `calibration_profile_id` | UUID | Reference to calibration profile |
| `created_at` | Timestamp | Registration timestamp |
| `updated_at` | Timestamp | Last metadata update |

---

## 10.4 Multi-Camera Architecture

### 10.4.1 Deployment Tiers

| Tier | Cameras | Configuration | Target Users |
|------|---------|---------------|--------------|
| **Entry** | 1 | Full court view (centered, elevated) | Schools, training, amateur clubs |
| **Standard** | 2 | Camera 1: Full court \| Camera 2: Side view (attack zone) | Production baseline, regional clubs |
| **Professional** | 4 | Court + Side Left + Side Right + Overhead/Behind Server | National federations, pro leagues |
| **Broadcast** | 8+ | All professional angles + robotic cams | International tournaments, TV |

### 10.4.2 Camera Roles

| Role | Purpose | AI Modules Used |
|------|---------|-----------------|
| **Court Main** | Primary detection, tracking, statistics | All modules |
| **Side Left** | Attack zone detail, block analysis | Player detection, ball, pose, action |
| **Side Right** | Opposite attack zone, serve receive | Player detection, ball, pose, action |
| **Overhead** | Court mapping, rotation validation, occlusion recovery | Court detection, tracking fusion |
| **Behind Server** | Serve analysis, ball toss tracking | Ball detection, pose, action |

---

## 10.5 Camera Calibration Engine

### 10.5.1 Calibration Objectives

| Objective | Method | Output |
|-----------|--------|--------|
| **Court Boundary Detection** | Line detection (Hough) + court template matching | 4 corner points in image coordinates |
| **Net Position** | Horizontal line detection at court center | Net line segment (image coords) |
| **Lens Distortion Correction** | Chessboard calibration (OpenCV) | Distortion coefficients (k1, k2, p1, p2, k3) |
| **Homography Estimation** | Point correspondences (court corners → real court) | 3×3 homography matrix (image ↔ court) |
| **Camera Pose Estimation** | PnP solve with known court 3D points | Rotation + translation vectors |
| **Scale Calibration** | Known court dimensions (18m × 9m) | Pixels-per-meter ratio |

### 10.5.2 Calibration Profile

```python
@dataclass
class CalibrationProfile:
    profile_id: UUID
    camera_id: UUID
    created_at: datetime
    
    # Image → Court mapping
    homography_matrix: np.ndarray  # 3x3
    inverse_homography: np.ndarray
    
    # Distortion
    camera_matrix: np.ndarray      # 3x3 intrinsic
    dist_coeffs: np.ndarray        # k1, k2, p1, p2, k3
    
    # Court reference
    court_corners_image: List[Tuple[int, int]]  # 4 corners
    court_corners_real: List[Tuple[float, float]]  # (0,0), (18,0), (18,9), (0,9)
    net_line_image: Tuple[Tuple[int, int], Tuple[int, int]]
    
    # Scale
    pixels_per_meter_x: float
    pixels_per_meter_y: float
    
    # Quality
    reprojection_error: float
    calibration_quality: CalibrationQuality  # EXCELLENT, GOOD, ACCEPTABLE, POOR
```

### 10.5.3 Recalibration Triggers

| Trigger | Action |
|---------|--------|
| Camera moved/bumped | Auto-detect via frame difference + court corner drift |
| Lighting change (day → night) | Re-detect lines, update if significant shift |
| Manual request | Admin-initiated full recalibration |
| Periodic (weekly) | Scheduled validation, auto-update if within tolerance |

---

## 10.6 Court Mapping & Coordinate Systems

### 10.6.1 Coordinate Spaces

| Space | Origin | Axes | Units | Use Case |
|-------|--------|------|-------|----------|
| **Image** | Top-left | x: right, y: down | Pixels | Raw detections |
| **Court (Normalized)** | Bottom-left | x: right (0-18), y: up (0-9) | Meters | Statistics, analytics |
| **Court (Zones)** | Bottom-left | Zone 1-6 (FIVB) | Zone index | Heatmaps, rotation |
| **3D World** | Court center | x: right, y: up, z: height | Meters | Ball trajectory, 3D pose |

### 10.6.2 Zone Mapping (FIVB Standard)

```
COURT COORDINATES (18m × 9m)

y=9m  ┌─────────────────────────────────────────┐
      │  ZONE 2 (RF)  │  ZONE 3 (MF)  │ ZONE 4 (LF) │  ← Front Row (y > 4.5)
      │               │               │              │
      ├───────────────┼───────────────┼──────────────┤
      │  ZONE 1 (RB)  │  ZONE 6 (MB)  │ ZONE 5 (LB) │  ← Back Row (y ≤ 4.5)
      │               │               │              │
y=0m  └─────────────────────────────────────────┘
       x=0m                          x=18m
```

### 10.6.3 Coordinate Transformation

```python
class CoordinateTransformer:
    def __init__(self, calibration: CalibrationProfile):
        self.H = calibration.homography_matrix
        self.H_inv = calibration.inverse_homography
    
    def image_to_court(self, point: Tuple[float, float]) -> Tuple[float, float]:
        """Image pixels → Court meters."""
        pt = np.array([point[0], point[1], 1.0])
        court_pt = self.H @ pt
        return (court_pt[0] / court_pt[2], court_pt[1] / court_pt[2])
    
    def court_to_image(self, point: Tuple[float, float]) -> Tuple[float, float]:
        """Court meters → Image pixels."""
        pt = np.array([point[0], point[1], 1.0])
        img_pt = self.H_inv @ pt
        return (img_pt[0] / img_pt[2], img_pt[1] / img_pt[2])
    
    def image_to_zone(self, point: Tuple[float, float]) -> int:
        """Image pixels → Zone (1-6)."""
        court_x, court_y = self.image_to_court(point)
        
        if court_y > 4.5:  # Front row
            if court_x < 6: return 2
            elif court_x < 12: return 3
            else: return 4
        else:  # Back row
            if court_x < 6: return 1
            elif court_x < 12: return 6
            else: return 5
```

---

## 10.7 Video Acquisition Layer

### 10.7.1 Responsibilities

| Responsibility | Implementation |
|----------------|----------------|
| **Stream Connection** | OpenCV `VideoCapture`, FFmpeg for RTSP, GStreamer for hardware |
| **Stream Validation** | Verify resolution, FPS, codec, codec compatibility |
| **Health Monitoring** | Frame drop detection, latency measurement, connectivity watchdog |
| **Auto-Reconnection** | Exponential backoff (1s, 2s, 4s, 8s, max 30s) |
| **Timestamp Assignment** | Monotonic clock + frame sequence number |
| **Metadata Extraction** | Resolution, FPS, codec, duration (for files) |

### 10.7.2 Frame Metadata Structure

```python
@dataclass
class FrameMetadata:
    frame_id: UUID
    camera_id: UUID
    sequence_number: int
    timestamp_capture: datetime      # Camera timestamp (if available)
    timestamp_received: datetime     # System receipt timestamp
    timestamp_monotonic: float       # Monotonic time for ordering
    resolution: Tuple[int, int]
    fps_actual: float
    exposure_ms: Optional[float]
    gain_db: Optional[float]
    is_keyframe: bool
    quality_score: float             # 0-1: blur, brightness, contrast
```

---

## 10.8 Frame Extraction Engine

### 10.8.1 Extraction Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| **Real-time** | Extract every frame at camera FPS | Live matches |
| **Fixed Rate** | Resample to target FPS (e.g., 30 → 15) | Reduce compute load |
| **Keyframe Only** | Extract only I-frames | Fast scrubbing, preview |
| **Event-triggered** | Extract ±N seconds around AI events | Replay clips |

### 10.8.2 Frame Structure

```python
@dataclass
class VideoFrame:
    metadata: FrameMetadata
    image_bgr: np.ndarray           # Raw BGR image (H×W×3)
    image_rgb: Optional[np.ndarray] # RGB for AI modules
    preprocessed: Optional[np.ndarray]  # Normalized tensor for inference
    
    # Lazy properties (computed on demand)
    @property
    def image_gray(self) -> np.ndarray: ...
    @property
    def image_hsv(self) -> np.ndarray: ...
```

---

## 10.9 Frame Buffering & Queue Management

### 10.9.1 Buffer Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FRAME BUFFER ARCHITECTURE                           │
└─────────────────────────────────────────────────────────────────────────────┘

Camera Stream
      │
      ▼
┌─────────────────┐
│ Ingress Queue   │  Capacity: 30-60 frames (1-2 seconds)
│ (MPSC)          │  Drops oldest if full (configurable)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Preprocessing   │  Resize, normalize, distort-correct
│ Worker Pool     │  Parallel (CPU cores)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ AI Dispatch     │  Fan-out to inference queues
│ Queue (MPSC)    │  Per-model queues
└────────┬────────┘
         │
    ┌────┴────┬────────┬────────┐
    ▼         ▼        ▼        ▼
┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐
│Player │ │ Ball  │ │ Pose  │ │ Action│
│Detect │ │Detect │ │Estimat│ │Recog  │
└───────┘ └───────┘ └───────┘ └───────┘
```

### 10.9.2 Buffer Policies

| Policy | Behavior | When to Use |
|--------|----------|-------------|
| **Drop Oldest** | New frames evict oldest unprocessed | Live (latency critical) |
| **Drop Newest** | Reject new frames when full | Batch (completeness critical) |
| **Backpressure** | Block camera read until space | Synchronized multi-camera |
| **Adaptive** | Switch based on queue depth | Production default |

---

## 10.10 Video Preprocessing Pipeline

### 10.10.1 Standard Preprocessing Stages

| Stage | Operation | Parameters | AI Modules Benefited |
|-------|-----------|------------|---------------------|
| **1. Undistort** | `cv2.undistort()` with camera matrix | Calibration profile | All (geometric accuracy) |
| **2. Resize** | Letterbox to model input (640×640) | Maintain aspect, pad gray | YOLO, Pose |
| **3. Normalize** | Pixel values → [0,1] or [-1,1] | Model-specific (ImageNet/YOLO) | All deep learning |
| **4. Color Convert** | BGR → RGB | — | MediaPipe, PyTorch |
| **5. Enhance** (Optional) | CLAHE, gamma correction | Low-light venues | Detection, OCR |
| **6. Tensor Convert** | HWC → CHW, add batch dim | `torch.from_numpy()` | All PyTorch models |

### 10.10.2 Preprocessing Configuration

```python
@dataclass
class PreprocessingConfig:
    target_size: Tuple[int, int] = (640, 640)
    letterbox: bool = True
    letterbox_color: Tuple[int, int, int] = (114, 114, 114)
    normalize_mean: Tuple[float, float, float] = (0.0, 0.0, 0.0)
    normalize_std: Tuple[float, float, float] = (1.0, 1.0, 1.0)
    to_rgb: bool = True
    apply_clahe: bool = False
    clahe_clip_limit: float = 2.0
    clahe_tile_grid: Tuple[int, int] = (8, 8)
```

---

## 10.11 AI Inference Dispatcher

### 10.11.1 Dispatcher Responsibilities

| Responsibility | Detail |
|----------------|--------|
| **Frame Routing** | Send preprocessed frames to correct model queues |
| **Batching** | Aggregate frames for batch inference (where supported) |
| **Load Balancing** | Distribute across multiple GPU workers |
| **Priority Queue** | Live frames > Batch frames > Replay frames |
| **Timeout Handling** | Drop frames exceeding max latency budget |
| **Metrics Collection** | Queue depth, inference time, throughput per model |

### 10.11.2 Dispatcher Workflow

```python
class AIInferenceDispatcher:
    def __init__(self, model_queues: Dict[str, asyncio.Queue], 
                 gpu_workers: int = 2):
        self.queues = model_queues
        self.workers = gpu_workers
        self.stats = DispatcherStats()
    
    async def dispatch(self, frame: VideoFrame, priority: FramePriority = FramePriority.LIVE):
        """Dispatch frame to all model queues."""
        # Prepare inputs for each model
        inputs = self._prepare_inputs(frame)
        
        # Fan-out to model queues with priority
        for model_name, queue in self.queues.items():
            await queue.put(InferenceRequest(
                request_id=uuid4(),
                frame_id=frame.metadata.frame_id,
                camera_id=frame.metadata.camera_id,
                timestamp=frame.metadata.timestamp_monotonic,
                input_tensor=inputs[model_name],
                priority=priority,
                metadata={"preprocessing_time_ms": inputs["prep_time_ms"]}
            ))
        
        self.stats.frames_dispatched += 1
    
    def _prepare_inputs(self, frame: VideoFrame) -> Dict[str, torch.Tensor]:
        """Prepare model-specific input tensors from preprocessed frame."""
        return {
            "player_detection": frame.preprocessed,
            "ball_detection": frame.preprocessed,  # Same input, different model
            "pose_estimation": frame.preprocessed_crop_player,  # Cropped
            "action_recognition": frame.sequence_buffer,  # 30-frame sequence
        }
```

---

## 10.12 Frame Synchronization (Multi-Camera)

### 10.12.1 Synchronization Strategies

| Strategy | Accuracy | Complexity | Use Case |
|----------|----------|------------|----------|
| **Hardware Sync** | < 1ms | High (genlock, PTP) | Professional broadcast |
| **Software NTP** | 1-10ms | Low | Standard deployment |
| **Visual Sync** | 5-20ms | Medium | Post-hoc alignment |
| **Audio Sync** | 10-50ms | Medium | Clapperboard, whistle |

### 10.12.2 Synchronized Frame Group

```python
@dataclass
class SynchronizedFrameGroup:
    sync_timestamp: float           # Master timeline timestamp
    frames: Dict[str, VideoFrame]   # camera_id → frame
    sync_quality: SyncQuality       # GOOD, ACCEPTABLE, POOR
    max_offset_ms: float            # Max time diff between cameras
    
    def is_usable(self) -> bool:
        return self.sync_quality in (SyncQuality.GOOD, SyncQuality.ACCEPTABLE)
```

### 10.12.3 Sync Algorithm (Software)

```python
class FrameSynchronizer:
    def __init__(self, cameras: List[CameraConfig], max_buffer_seconds: float = 2.0):
        self.buffers = {cam.camera_id: deque(maxlen=int(cam.fps * max_buffer_seconds)) 
                        for cam in cameras}
        self.master_clock = MasterClock()
    
    def add_frame(self, camera_id: str, frame: VideoFrame):
        self.buffers[camera_id].append(frame)
    
    def get_synced_group(self, target_time: float, tolerance_ms: float = 33) -> Optional[SynchronizedFrameGroup]:
        """Find closest frames across all cameras to target_time."""
        candidates = {}
        
        for cam_id, buffer in self.buffers.items():
            # Binary search for closest timestamp
            idx = self._find_closest(buffer, target_time)
            if idx is not None:
                frame = buffer[idx]
                if abs(frame.metadata.timestamp_monotonic - target_time) * 1000 <= tolerance_ms:
                    candidates[cam_id] = frame
        
        if len(candidates) == len(self.buffers):
            offsets = [f.metadata.timestamp_monotonic for f in candidates.values()]
            max_offset = (max(offsets) - min(offsets)) * 1000
            quality = SyncQuality.GOOD if max_offset < 16 else SyncQuality.ACCEPTABLE
            return SynchronizedFrameGroup(
                sync_timestamp=target_time,
                frames=candidates,
                sync_quality=quality,
                max_offset_ms=max_offset
            )
        return None
```

---

## 10.13 Occlusion Handling & Lost Object Recovery

### 10.13.1 Occlusion Strategies

| Scenario | Detection | Recovery Method |
|----------|-----------|-----------------|
| **Player ↔ Player** | IoU overlap > 0.5, track ID proximity | Kalman prediction + appearance features (jersey color histogram) |
| **Player ↔ Net Post** | Bbox touches net line | Maintain track, predict re-emergence |
| **Ball ↔ Player** | Ball center inside player bbox | Predict ball exit trajectory from pre-occlusion velocity |
| **Full Occlusion** | Track lost > N frames | Freeze track state, search nearby on reappearance |

### 10.13.2 Lost Object Recovery

```python
class LostObjectRecovery:
    def __init__(self, max_lost_frames: int = 30, search_radius_m: float = 2.0):
        self.max_lost = max_lost_frames
        self.search_radius = search_radius_m
    
    def handle_lost_track(self, track: Track, current_frame: int) -> TrackAction:
        frames_lost = current_frame - track.last_frame
        
        if frames_lost <= self.max_lost:
            # Predict position using Kalman filter
            predicted_pos = track.kalman.predict()
            return TrackAction.COAST(predicted_pos)
        else:
            # Try reassociation with new detections
            candidates = self._find_candidates(track, current_frame)
            if candidates:
                best = self._best_match(track, candidates)
                if best.confidence > 0.7:
                    return TrackAction.REASSOCIATE(best.detection_id)
            return TrackAction.TERMINATE
    
    def _find_candidates(self, track: Track, frame: int) -> List[Detection]:
        """Find nearby detections matching track appearance."""
        predicted = track.kalman.predict()
        return [
            d for d in self.get_detections(frame)
            if distance(d.position, predicted) < self.search_radius
            and color_similarity(d.color_hist, track.color_hist) > 0.6
        ]
```

---

## 10.14 Video Replay System

### 10.14.1 Replay Clip Generation

```python
@dataclass
class ReplayClip:
    clip_id: UUID
    match_id: int
    event_id: str
    camera_id: str
    start_timestamp_ms: int
    end_timestamp_ms: int
    start_frame_number: int
    end_frame_number: int
    storage_path: str  # S3/MinIO path
    thumbnail_path: Optional[str]
    tags: List[str]  # ["kill", "zone_4", "player_8", "set_2"]
    created_at: datetime

class ReplayService:
    def __init__(self, video_storage: ObjectStorage, 
                 pre_seconds: int = 3, post_seconds: int = 2):
        self.storage = video_storage
        self.pre = pre_seconds
        self.post = post_seconds
    
    async def create_clip(self, event: ValidatedEvent, 
                         camera_id: str, video_path: str) -> ReplayClip:
        """Extract clip around event from stored video."""
        start_ms = max(0, int(event.timestamp_seconds * 1000) - self.pre * 1000)
        end_ms = int(event.timestamp_seconds * 1000) + self.post * 1000
        
        # Use FFmpeg for efficient extraction
        clip_path = await self._extract_segment(
            video_path, start_ms, end_ms, event.event_id
        )
        
        return ReplayClip(
            clip_id=uuid4(),
            match_id=event.match_id,
            event_id=event.event_id,
            camera_id=camera_id,
            start_timestamp_ms=start_ms,
            end_timestamp_ms=end_ms,
            storage_path=clip_path,
            tags=self._generate_tags(event)
        )
    
    def _generate_tags(self, event: ValidatedEvent) -> List[str]:
        tags = [event.event_type]
        if event.court_zone:
            tags.append(f"zone_{event.court_zone}")
        if event.player_id:
            tags.append(f"player_{event.player_id}")
        if event.set_number:
            tags.append(f"set_{event.set_number}")
        return tags
```

### 10.14.2 Live Replay (During Match)

```python
class LiveReplayBuffer:
    """Circular buffer for instant replay during live matches."""
    
    def __init__(self, camera_id: str, buffer_duration_seconds: int = 60):
        self.camera_id = camera_id
        self.buffer_seconds = buffer_duration_seconds
        self.segments: List[VideoSegment] = []  # 5-second segments
        self.current_segment: Optional[VideoSegment] = None
    
    async def add_frame(self, frame: VideoFrame):
        """Append frame to current segment; rotate on duration."""
        if not self.current_segment or self.current_segment.duration > 5.0:
            await self._finalize_segment()
            self.current_segment = VideoSegment(
                segment_id=uuid4(),
                camera_id=self.camera_id,
                start_time=frame.metadata.timestamp_received
            )
        self.current_segment.add_frame(frame)
    
    async def get_replay(self, event_time: datetime, 
                        pre_seconds: int, post_seconds: int) -> bytes:
        """Assemble replay from relevant segments."""
        relevant = self._find_segments(event_time, pre_seconds, post_seconds)
        return await self._concatenate_segments(relevant)
```

---

## 10.15 Video Storage Strategy

### 10.15.1 Storage Layout

```
object-storage/
└── volley-platform/
    ├── videos/
    │   ├── 2026/
    │   │   ├── league_a/
    │   │   │   ├── match_20260715_001/
    │   │   │   │   ├── camera_court_main.mp4
    │   │   │   │   ├── camera_side_left.mp4
    │   │   │   │   ├── camera_side_right.mp4
    │   │   │   │   └── metadata.json
    │   │   │   └── match_20260715_002/
    │   │   └── tournament_b/
    ├── clips/
    │   ├── 2026/
    │   │   ├── match_20260715_001/
    │   │   │   ├── evt_001_kill_player8.mp4
    │   │   │   ├── evt_045_ace_player3.mp4
    │   │   │   └── index.json
    ├── frames/              # Optional: keyframes for fast scrubbing
    │   ├── match_20260715_001/
    │   │   ├── camera_court_main/
    │   │   │   ├── frame_000001.jpg
    │   │   │   └── frame_000002.jpg
```

### 10.15.2 Metadata Indexing

```json
// metadata.json (per match)
{
  "match_id": 1001,
  "date": "2026-07-15",
  "venue": "City Arena",
  "cameras": [
    {
      "camera_id": "cam_001",
      "role": "court_main",
      "file": "camera_court_main.mp4",
      "duration_seconds": 5400,
      "resolution": "1920x1080",
      "fps": 30,
      "codec": "h264",
      "calibration_profile": "cal_prof_001"
    }
  ],
  "total_events": 342,
  "storage_size_gb": 12.4
}
```

---

## 10.16 Live Streaming & Broadcast Support

### 10.16.1 Stream Outputs

| Output | Protocol | Latency | Use Case |
|--------|----------|---------|----------|
| **Raw Stream Passthrough** | RTMP/HLS | < 2s | OBS, YouTube, Twitch |
| **Annotated Stream** | RTMP/WebRTC | < 500ms | Coach tablet, arena display |
| **Statistics Overlay** | WebSocket + Canvas | Real-time | Broadcast graphics |
| **Multi-view Mosaic** | RTMP | < 1s | Production gallery |

### 10.16.2 Broadcast Graphics Data Feed

```python
@dataclass
class BroadcastGraphicsData:
    timestamp_ms: int
    match_state: MatchState
    score: Tuple[int, int]  # (home, away)
    set_scores: List[Tuple[int, int]]
    serving_team: str
    current_server: Optional[PlayerInfo]
    recent_events: List[EventSummary]  # Last 5 events
    player_stats: Dict[int, LiveStats]  # On-court players
    serve_speed_kmh: Optional[float]
    rally_count: int
```

---

## 10.17 Video Compression & Codecs

### 10.17.1 Recommended Codecs

| Purpose | Codec | Container | Rationale |
|---------|-------|-----------|-----------|
| **Acquisition** | H.264 / H.265 | MP4 | Hardware encoding, wide support |
| **AI Processing** | Raw frames (no codec) | — | Maximum quality for inference |
| **Storage (Long-term)** | H.265 (HEVC) | MP4 | 50% size reduction vs H.264 |
| **Clips/Replay** | H.264 | MP4 | Universal playback |
| **Live Stream** | H.264 / AV1 | RTMP / WebRTC | Browser compatibility |

### 10.17.2 Encoding Parameters

```python
ENCODING_PRESETS = {
    "acquisition": {
        "codec": "h264_nvenc",      # Hardware encode (NVIDIA)
        "preset": "p4",             # Balanced speed/quality
        "bitrate": "8M",            # 8 Mbps for 1080p30
        "gop": 30,                  # Keyframe every second
        "bframes": 2
    },
    "storage": {
        "codec": "hevc_nvenc",
        "preset": "p5",
        "bitrate": "4M",            # 4 Mbps HEVC ≈ 8 Mbps H.264
        "gop": 60,
        "bframes": 3
    },
    "clip": {
        "codec": "libx264",
        "preset": "fast",
        "crf": 20,                  # Constant quality
        "gop": 15
    }
}
```

---

## 10.18 Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Camera Startup** | < 5 seconds | Cold start to first frame |
| **Stream Recovery** | < 10 seconds | Disconnect → resume |
| **Frame Ingestion Latency** | < 10ms | Capture → buffer |
| **Preprocessing Latency** | < 5ms/frame | Undistort + resize + normalize |
| **AI Pipeline Latency** | < 2 seconds | Frame → validated event |
| **Dashboard Update Latency** | < 2 seconds | Event → dashboard |
| **Replay Clip Generation** | < 10 seconds | Event → clip ready |
| **Multi-camera Sync Accuracy** | < 33ms (1 frame @ 30fps) | Max inter-camera offset |
| **Buffer Utilization** | < 80% | Steady state |

---

## 10.19 Monitoring & Observability

### 10.19.1 Key Metrics (Prometheus)

| Metric | Type | Labels | Alert Threshold |
|--------|------|--------|-----------------|
| `vip_camera_connected` | Gauge | camera_id | == 0 for > 30s |
| `vip_frames_received_total` | Counter | camera_id | — |
| `vip_frames_dropped_total` | Counter | camera_id, reason | > 1% of received |
| `vip_ingestion_latency_ms` | Histogram | camera_id | p99 > 50ms |
| `vip_preprocessing_latency_ms` | Histogram | stage | p99 > 10ms |
| `vip_buffer_utilization` | Gauge | buffer_name | > 80% |
| `vip_sync_quality` | Gauge | camera_pair | == POOR |
| `vip_clip_generation_duration_ms` | Histogram | — | p99 > 30000ms |
| `vip_storage_free_bytes` | Gauge | — | < 10GB |

---

## 10.20 Fault Tolerance & Resilience

### 10.20.1 Failure Scenarios

| Failure | Detection | Mitigation |
|---------|-----------|------------|
| **Camera Disconnect** | No frames for 2s | Alert, reconnect loop, continue other cameras |
| **Camera Degraded** | FPS < 50% target, quality < 0.5 | Alert, reduce processing rate, flag for review |
| **AI Worker Crash** | Heartbeat timeout | Restart worker, redistribute queue |
| **GPU OOM** | CUDA out of memory | Reduce batch size, clear cache, alert |
| **Storage Full** | Disk > 90% | Auto-purge old clips, alert admin |
| **Network Partition** | API timeouts | Queue locally, sync when restored |

### 10.20.2 Graceful Degradation

```
Full System (4 cameras, all AI)
       │
       ├─ Camera 2 fails ──────────────────► 3 cameras, all AI (alert)
       │
       ├─ GPU 1 fails ─────────────────────► Reduce batch size, queue builds (alert)
       │
       ├─ Both GPUs fail ──────────────────► CPU inference fallback (slow, alert)
       │
       └─ Storage full ─────────────────────► Pause clip generation, keep live stats
```

---

## 10.21 Security

| Layer | Measures |
|-------|----------|
| **Transport** | TLS 1.3 for all RTSP/WebSocket/API; SRTP for streams |
| **Authentication** | Camera credentials in Vault; JWT for API |
| **Authorization** | Role-based camera access (Admin: all, Coach: team cameras) |
| **Storage** | Encrypted at rest (AES-256); signed URLs for clip access |
| **Audit** | All camera access, clip downloads, config changes logged |
| **Network** | Cameras on isolated VLAN; no direct internet exposure |

---

## 10.22 Future Enhancements

| Enhancement | Description | Prerequisites |
|-------------|-------------|---------------|
| **Automatic Camera Switching** | AI selects best view for each rally | Multi-camera sync, action recognition |
| **3D Player Reconstruction** | Volumetric tracking from 4+ views | Calibrated multi-camera, stereo matching |
| **Ball Trajectory Prediction** | Predict landing zone from early flight | High-speed camera, physics model |
| **Multi-view Event Fusion** | Combine detections across cameras | Synchronized frames, consensus algorithm |
| **Drone Camera Integration** | Overhead dynamic view | Drone RTSP, obstacle avoidance |
| **Edge AI Processing** | Jetson/Edge TPU on-camera inference | Model optimization (INT8), edge SDK |
| **Cloud-assisted Inference** | Burst to cloud GPU for peaks | Low-latency network, hybrid queue |
| **Broadcast Graphics Overlays** | Real-time lower-thirds, stats | WebSocket data feed, CasparCG/HTML |
| **Real-time Highlight Clipping** | Auto-generate social clips | Event detection, clip service |
| **Adaptive Bitrate Streaming** | ABR for live viewers | HLS/DASH, multi-quality encoding |

---

**END OF CHAPTER 10**

---

# CHAPTER 11: DATA ENGINEERING & EVENT PROCESSING ARCHITECTURE

---

## 11.1 Vision

The Data Engineering & Event Processing Architecture is the **nervous system** of the platform. It connects every AI observation, domain decision, statistical update, and user interaction into a coherent, auditable, and replayable stream of structured events.

**Core Principle:** Every significant action on the court becomes a **structured, versioned, queryable event** — not just a database row.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      EVENT PROCESSING PLATFORM                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  AI Observations          Domain Engine            Statistics            │
│  ┌─────────────┐          ┌─────────────┐         ┌─────────────┐        │
│  │ • Detection │          │ • Validation│         │ • Counters  │        │
│  │ • Tracking  │─────────►│ • Rules     │────────►│ • Formulas  │        │
│  │ • Pose      │  Events  │ • State     │  Events │ • Aggregates│        │
│  │ • OCR       │          │ • Confidence│         │ • Rankings  │        │
│  └─────────────┘          └─────────────┘         └─────────────┘        │
│        │                        │                      │                  │
│        └────────────────────────┼──────────────────────┘                  │
│                                 ▼                                         │
│                    ┌─────────────────────────┐                            │
│                    │   EVENT STREAM (Kafka)  │                            │
│                    │   ┌─────────────────┐   │                            │
│                    │   │ Validation      │   │                            │
│                    │   │ Enrichment      │   │                            │
│                    │   │ Partitioning    │   │                            │
│                    │   │ Ordering        │   │                            │
│                    │   └─────────────────┘   │                            │
│                    └───────────┬─────────────┘                            │
│                                 │                                         │
│         ┌───────────────────────┼───────────────────────┐                │
│         ▼                       ▼                       ▼                │
│  ┌─────────────┐        ┌─────────────┐        ┌─────────────┐          │
│  │ PostgreSQL  │        │   Redis     │        │  Analytics  │          │
│  │ (Persistent)│        │  (Real-time)│        │  (Warehouse)│          │
│  │             │        │             │        │             │          │
│  │ • Events    │        │ • Live score│        │ • Columnar  │          │
│  │ • Stats     │        │ • Leaderboards│       │ • BI queries│          │
│  │ • Matches   │        │ • Session   │        │ • ML features│         │
│  │ • Audit     │        │   cache     │        │ • Exports   │          │
│  └─────────────┘        └─────────────┘        └─────────────┘          │
│         │                       │                       │                │
│         └───────────────────────┼───────────────────────┘                │
│                                 ▼                                         │
│                    ┌─────────────────────────┐                            │
│                    │   API GATEWAY           │                            │
│                    │   • REST /v1            │                            │
│                    │   • WebSocket           │                            │
│                    │   • GraphQL (future)    │                            │
│                    └─────────────────────────┘                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 11.2 Event Model

### 11.2.1 Base Event Schema

Every event in the system follows a unified envelope:

```json
{
  "event_id": "evt_20260715_001245_abc123",
  "event_type": "VOLLEYBALL_ACTION",
  "event_version": "1.0",
  "timestamp": "2026-07-15T14:32:17.420Z",
  "source": {
    "service": "ai-inference",
    "instance": "ai-worker-3",
    "model_versions": {
      "player_detection": "yolov8m_v2.1.0",
      "action_recognition": "transformer_v1.3.0"
    }
  },
  "correlation_id": "rally_20260715_001245_18",
  "causation_id": "evt_20260715_001240_xyz789",
  "payload": {
    "match_id": 1001,
    "set_number": 2,
    "rally_number": 18,
    "action": "KILL",
    "player_id": 108,
    "team_id": 12,
    "court_position": {"x": 14.2, "y": 2.1, "zone": 4},
    "confidence": 0.96,
    "video_reference": {
      "camera_id": "cam_court_main",
      "frame_number": 24830,
      "timestamp_ms": 1237420
    }
  },
  "metadata": {
    "processing_time_ms": 28,
    "validation_status": "AUTO_ACCEPTED",
    "review_required": false
  }
}
```

### 11.2.2 Event Types

| Category | Event Types | Description |
|----------|-------------|-------------|
| **Observation** | `PLAYER_DETECTED`, `BALL_DETECTED`, `POSE_ESTIMATED`, `JERSEY_OCR` | Raw AI outputs |
| **Tracking** | `TRACK_CREATED`, `TRACK_UPDATED`, `TRACK_LOST`, `TRACK_REASSOCIATED` | ByteTrack lifecycle |
| **Action** | `SERVE`, `RECEPTION`, `SET`, `SPIKE`, `KILL`, `BLOCK`, `DIG`, `FREE_BALL`, `ACE`, `SERVICE_ERROR`, `ATTACK_ERROR`, `BLOCKED_ATTACK`, `NET_TOUCH`, `ROTATION_FAULT` | Validated volleyball actions |
| **State** | `RALLY_STARTED`, `RALLY_ENDED`, `POINT_AWARDED`, `ROTATION_CHANGED`, `SUBSTITUTION`, `TIMEOUT`, `SET_STARTED`, `SET_ENDED`, `MATCH_ENDED` | Rally/match lifecycle |
| **Statistics** | `STAT_UPDATED`, `STAT_RECALCULATED`, `RANKING_CHANGED` | Derived metrics |
| **System** | `CAMERA_CONNECTED`, `CAMERA_DISCONNECTED`, `MODEL_DEPLOYED`, `ALERT_RAISED` | Platform events |

---

## 11.3 Event Stream Platform

### 11.3.1 Technology Choice

| Requirement | Selected Technology | Rationale |
|-------------|---------------------|-----------|
| **Durability** | Apache Kafka | Replicated log, retention policies |
| **Ordering** | Kafka partitions by `match_id` | Per-match ordering guarantee |
| **Replay** | Kafka consumer groups + offset reset | Full historical replay |
| **Schema** | Confluent Schema Registry (Avro/Protobuf) | Contract enforcement, evolution |
| **Streaming** | Kafka Streams / Flink (future) | Real-time transformations |

### 11.3.2 Topic Design

```
volleyball-events
├── observations.raw          # Raw AI outputs (high volume, short retention)
├── observations.validated    # Validated + enriched (medium retention)
├── actions.volleyball        # Validated volleyball actions (permanent)
├── state.rally               # Rally lifecycle events (permanent)
├── statistics.derived        # Computed stats (permanent)
├── system.platform           # Platform events (1 year)
└── audit.security            # Security events (7 years)

# Per-match replay topics (created on-demand)
├── match.{match_id}.live     # Real-time events for WebSocket push
├── match.{match_id}.replay   # Full event log for replay
└── match.{match_id}.clips    # Clip generation triggers
```

### 11.3.3 Partitioning Strategy

```python
def partition_key(event: Event) -> str:
    """Ensure all events for a match go to same partition for ordering."""
    return event.payload.get("match_id") or event.correlation_id
```

**Partition Count:** 100 (supports 100 concurrent matches with ordering)

### 11.3.4 Retention Policies

| Topic | Retention | Cleanup Policy | Compaction |
|-------|-----------|----------------|------------|
| `observations.raw` | 7 days | Delete | No |
| `observations.validated` | 90 days | Delete | No |
| `actions.volleyball` | Permanent | Compact | Yes (by event_id) |
| `state.rally` | Permanent | Compact | Yes (by rally_id) |
| `statistics.derived` | Permanent | Compact | Yes (by stat_key) |
| `match.{id}.live` | Match + 24h | Delete | No |
| `audit.security` | 7 years | Delete | No |

---

## 11.4 Event Processing Pipeline

### 11.4.1 Pipeline Stages

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        EVENT PROCESSING PIPELINE                            │
└─────────────────────────────────────────────────────────────────────────────┘

Raw AI Output (Kafka: observations.raw)
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STAGE 1: VALIDATION & ENRICHMENT                                            │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ • Schema validation (Avro)                                              │ │
│ │ • Required field checks                                                 │ │
│ │ • Timestamp sanity (not future, not too old)                            │ │
│ │ • Confidence range [0, 1]                                               │ │
│ │ • Enrich: match context, player names, team colors                      │ │
│ │ • Tag: processing_node, processing_version                              │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STAGE 2: DOMAIN VALIDATION (Volleyball Domain Engine)                       │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ • Rules engine validation                                               │ │
│ │ • Rally state machine transition                                        │ │
│ │ • Rotation legality check                                               │ │
│ │ • Confidence routing (AUTO_ACCEPT / REVIEW / REJECT)                    │ │
│ │ • Output: ValidatedAction event                                         │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STAGE 3: STATE UPDATE & STATISTICS                                          │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ • Update rally state                                                    │ │
│ │ • Apply statistics formulas                                             │ │
│ │ • Update player/team aggregates                                         │ │
│ │ • Check set/match end conditions                                        │ │
│ │ • Output: StatUpdate, StateChange events                                │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STAGE 4: PERSISTENCE & CACHE                                                │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ • Write to PostgreSQL (events, stats, match state)                      │ │
│ │ • Update Redis (live scoreboard, leaderboards, session cache)           │ │
│ │ • Write to Kafka (validated events for replay)                          │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STAGE 5: REAL-TIME NOTIFICATION                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ • WebSocket push to live dashboards                                     │ │
│ │ • Alert evaluation (thresholds, milestones)                             │ │
│ │ • Clip generation trigger                                               │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
```

### 11.4.2 Processing Guarantees

| Guarantee | Implementation |
|-----------|----------------|
| **At-least-once** | Kafka consumer commits after DB write |
| **Exactly-once (stats)** | Idempotent stat updates via `event_id` deduplication |
| **Ordering** | Single partition per match; in-order processing |
| **No data loss** | Kafka replication factor 3; acks=all |
| **Replayability** | Consumer group offset reset to earliest |

---

## 11.5 Event Sourcing & Audit

### 11.5.1 Event Store Schema (PostgreSQL)

```sql
CREATE TABLE events (
    event_id          UUID PRIMARY KEY,
    event_type        VARCHAR(100) NOT NULL,
    event_version     VARCHAR(20) NOT NULL,
    timestamp         TIMESTAMPTZ NOT NULL,
    source_service    VARCHAR(100) NOT NULL,
    source_instance   VARCHAR(100),
    correlation_id    UUID,
    causation_id      UUID,
    payload           JSONB NOT NULL,
    metadata          JSONB DEFAULT '{}',
    created_at        TIMESTAMPTZ DEFAULT NOW(),
    
    -- Indexes
    INDEX idx_events_correlation (correlation_id),
    INDEX idx_events_match_time ( (payload->>'match_id'), timestamp ),
    INDEX idx_events_type_time (event_type, timestamp),
    INDEX idx_events_player_time ( (payload->>'player_id'), timestamp )
);

-- Partition by month for performance
CREATE TABLE events_2026_07 PARTITION OF events
    FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');
```

### 11.5.2 Snapshot Projections (Materialized Views)

```sql
-- Live match scoreboard (refreshed every event)
CREATE MATERIALIZED VIEW live_scoreboard AS
SELECT 
    match_id,
    home_score, away_score,
    current_set, set_score_home, set_score_away,
    serving_team, server_player,
    last_event_type, last_event_time,
    rally_count
FROM match_state
WHERE status = 'LIVE';

-- Player season aggregates (refreshed nightly)
CREATE MATERIALIZED VIEW player_season_stats AS
SELECT 
    player_id, season_id,
    SUM(kills) as total_kills,
    SUM(attack_attempts) as total_attempts,
    AVG(hitting_efficiency) as avg_efficiency,
    -- ... 50+ columns
FROM player_match_statistics
GROUP BY player_id, season_id;
```

---

## 11.6 Real-Time Analytics Layer

### 11.6.1 Redis Data Structures

| Key Pattern | Type | TTL | Purpose |
|-------------|------|-----|---------|
| `live:match:{id}:scoreboard` | Hash | Match + 1h | Current score, set state, server |
| `live:match:{id}:player_stats` | Hash | Match + 1h | Per-player live counters |
| `live:match:{id}:rally` | String | Rally duration | Current rally events (JSON array) |
| `leaderboard:{season}:{metric}` | Sorted Set | 5 min | Top-N players by metric |
| `session:{token}` | Hash | 24h | User session data |
| `cache:player:{id}:profile` | String | 1h | Player profile for dashboard |
| `queue:clip_generation` | List | — | Clip generation jobs |

### 11.6.2 Live Dashboard WebSocket Protocol

```typescript
// Client → Server
{ "type": "SUBSCRIBE", "payload": { "match_id": 1001, "channels": ["scoreboard", "events", "stats"] } }

// Server → Client (push)
{ "type": "EVENT", "channel": "events", "payload": { ...ValidatedActionEvent } }
{ "type": "STAT_UPDATE", "channel": "stats", "payload": { "player_id": 108, "kills": 15, "kill_pct": 42.3 } }
{ "type": "SCOREBOARD", "channel": "scoreboard", "payload": { "home": 24, "away": 22, "set": 2 } }
{ "type": "ALERT", "channel": "alerts", "payload": { "level": "INFO", "message": "Player #8 reaches 100 career kills!" } }
```

---

## 11.7 Analytics & Data Warehouse

### 11.7.1 Columnar Store (ClickHouse / Apache Iceberg)

| Table | Grain | Partition | Use Case |
|-------|-------|-----------|----------|
| `fact_events` | Event | Month / match_id | Full event replay, ad-hoc queries |
| `fact_rallies` | Rally | Month | Rally analytics, duration, sequences |
| `fact_player_match_stats` | Player-Match | Month | Player performance dashboards |
| `fact_team_match_stats` | Team-Match | Month | Team comparison reports |
| `dim_player` | Player | — | Player attributes, SCD Type 2 |
| `dim_match` | Match | — | Match metadata, venue, tournament |
| `dim_team` | Team | — | Team hierarchy, league |

### 11.7.2 Example Analytical Queries

```sql
-- Attack efficiency by rotation across season
SELECT 
    rotation_position,
    COUNT(*) as attacks,
    SUM(kills) / SUM(attempts) * 100 as kill_pct,
    SUM(attack_errors) / SUM(attempts) * 100 as error_pct
FROM fact_player_match_stats
JOIN dim_match ON fact.match_id = dim_match.match_id
WHERE season_id = 2026 AND team_id = 12
GROUP BY rotation_position
ORDER BY rotation_position;

-- Serve placement heatmap for opponent scouting
SELECT 
    court_zone,
    COUNT(*) as serves,
    SUM(aces) / COUNT(*) * 100 as ace_pct,
    SUM(service_errors) / COUNT(*) * 100 as error_pct
FROM fact_events
WHERE event_type = 'SERVE' AND match_id IN (SELECT match_id FROM dim_match WHERE opponent_team_id = 99)
GROUP BY court_zone;
```

---

## 11.8 Data Quality & Governance

### 11.8.1 Data Contracts (Schema Registry)

```yaml
# schemas/volleyball_action.v1.avsc
{
  "type": "record",
  "name": "VolleyballAction",
  "namespace": "com.volleyball.events",
  "doc": "Validated volleyball action event",
  "fields": [
    {"name": "event_id", "type": "string", "doc": "Globally unique event ID"},
    {"name": "match_id", "type": "int", "doc": "Match identifier"},
    {"name": "action", "type": {"type": "enum", "name": "ActionType", "symbols": 
      ["SERVE", "ACE", "RECEPTION", "SET", "SPIKE", "KILL", "BLOCK", "DIG", 
       "FREE_BALL", "SERVICE_ERROR", "ATTACK_ERROR", "BLOCKED_ATTACK", "NET_TOUCH", "ROTATION_FAULT"]}},
    {"name": "confidence", "type": "float", "doc": "AI confidence [0,1]"},
    {"name": "validation_status", "type": {"type": "enum", "name": "ValidationStatus", "symbols": 
      ["AUTO_ACCEPTED", "STATISTICIAN_REVIEWED", "CORRECTED", "REJECTED"]}},
    {"name": "corrected_by", "type": ["null", "int"], "default": null}
  ]
}
```

### 11.8.2 Quality Checks (Great Expectations / dbt Tests)

| Check | Frequency | Alert |
|-------|-----------|-------|
| No null `match_id` in `fact_events` | Per batch | Critical |
| `confidence` in [0, 1] | Per event | Warning |
| `event_timestamp` not > now + 1min | Per event | Warning |
| Rally event count matches `rally_number` sequence | Per match | Critical |
| Stat aggregates match event-derived values | Nightly | Critical |
| Schema compatibility (backward) | Per deployment | Blocking |

---

## 11.9 Event Replay & Time Travel

### 11.9.1 Replay Capabilities

| Replay Type | Trigger | Scope | Duration |
|-------------|---------|-------|----------|
| **Full Match Replay** | Admin action | All events for match | Minutes |
| **Statistics Recalculation** | Rule change / bug fix | Stats derived from events | Seconds |
| **Model Evaluation** | New model version | Events + ground truth | Batch job |
| **Debug Replay** | Developer | Single rally + context | Seconds |
| **Audit Replay** | Compliance | All events + metadata | Export |

### 11.9.2 Replay Implementation

```python
class EventReplayer:
    def __init__(self, event_store: EventStore, domain_engine: DomainEngine):
        self.store = event_store
        self.engine = domain_engine
    
    async def replay_match(self, match_id: int, 
                          from_rally: int = 1,
                          to_rally: Optional[int] = None,
                          new_rule_set: Optional[RuleSet] = None) -> ReplayResult:
        """Re-process events through domain engine with optional new rules."""
        events = await self.store.get_match_events(match_id, from_rally, to_rally)
        
        # Reset state
        match_state = MatchState(match_id)
        
        results = []
        for event in events:
            # Apply validation with potentially new rules
            validated = self.engine.validate(event, match_state, new_rule_set)
            if validated:
                match_state.apply(validated)
                results.append(validated)
        
        return ReplayResult(
            events_processed=len(events),
            events_accepted=len(results),
            state_diffs=self._compute_diffs(match_state)
        )
```

---

## 11.10 Data Lineage & Traceability

### 11.10.1 Lineage Graph

```
Video Frame (camera_001, frame_24830)
    │
    ├──► Detection: Player #8 (track_23, conf=0.94)
    │       │
    │       ├──► Tracking: track_23 → track_23 (conf=0.91)
    │       │
    │       ├──► Pose: 33 keypoints (conf=0.88)
    │       │
    │       ├──► OCR: Jersey "8" (conf=0.85)
    │       │
    │       └──► Action: SPIKE (conf=0.92)
    │               │
    │               ├──► Validation: KILL (rules: ball in court, no block)
    │               │       │
    │               │       ├──► Statistics: kill+=1, attempt+=1, points+=1
    │               │       │
    │               │       ├──► Redis: live stats update
    │               │       │
    │               │       ├──► PostgreSQL: event + stat persisted
    │               │       │
    │               │       ├──► WebSocket: dashboard push
    │               │       │
    │               │       └──► Clip Trigger: 3s pre / 2s post
    │               │
    │               └──► Audit: event_id=evt_1245, correlation=rally_18
```

### 11.10.2 Trace Context Propagation

```python
# Every service adds to trace context
@dataclass
class TraceContext:
    trace_id: str           # Original request (match processing)
    span_id: str            # Current operation
    parent_span_id: str     # Caller
    baggage: Dict[str, str] # match_id, rally_number, player_id, etc.

# Propagated via Kafka headers, HTTP headers, gRPC metadata
kafka_headers = [
    ("trace_id", trace.trace_id),
    ("span_id", trace.span_id),
    ("parent_span_id", trace.parent_span_id),
    ("match_id", str(trace.baggage.get("match_id"))),
    ("rally_number", str(trace.baggage.get("rally_number")))
]
```

---

## 11.11 Security & Compliance

### 11.11.1 Data Classification

| Data Type | Classification | Encryption | Access |
|-----------|----------------|------------|--------|
| Video streams | CONFIDENTIAL | TLS + at-rest AES-256 | Role-based |
| Player PII (name, DOB) | RESTRICTED | AES-256 + field-level | Admin only |
| AI events | INTERNAL | At-rest AES-256 | All authenticated |
| Statistics | PUBLIC (aggregated) | At-rest AES-256 | All authenticated |
| Audit logs | RESTRICTED | AES-256 + WORM | Admin + Compliance |

### 11.11.2 GDPR / Privacy

- **Right to Erasure:** Soft-delete player profile; anonymize events (replace `player_id` with hash)
- **Data Portability:** Export all player data in JSON/CSV
- **Consent:** Track consent version per player; re-consent on policy change
- **Retention:** Configurable per data class; automated purge jobs

---

## 11.12 Operational Tooling

### 11.12.1 CLI Commands

```bash
# Replay match with new rules
volley replay match 1001 --rule-set fivb_v2026 --dry-run

# Export match events for analysis
volley export match 1001 --format parquet --output s3://bucket/analysis/

# Check event pipeline health
volley health events --match 1001 --lag-threshold 100

# Regenerate statistics from events
volley stats recalc match 1001 --force

# View event lineage
volley lineage event evt_abc123 --depth 5
```

### 11.12.2 Admin Dashboard Panels

| Panel | Metrics |
|-------|---------|
| **Event Throughput** | Events/sec by type, partition lag |
| **Validation Funnel** | Raw → Validated → Accepted → Rejected rates |
| **Processing Latency** | P50/P95/P99 per stage |
| **Data Quality** | Null rates, schema violations, confidence distribution |
| **Replay Queue** | Pending, processing, completed, failed |

---

## 11.13 Migration & Versioning Strategy

### 11.13.1 Event Schema Evolution

| Change Type | Compatibility | Action |
|-------------|---------------|--------|
| Add optional field | Backward | Deploy producer first |
| Add required field | Breaking | Dual-write, migrate consumers, cutover |
| Remove field | Forward | Mark deprecated, remove after consumers updated |
| Change field type | Breaking | New field with new type, deprecate old |
| Rename field | Breaking | Add new, dual-write, migrate |

### 11.13.2 Migration Playbook

```bash
# 1. Deploy new schema to Schema Registry (backward compatible)
# 2. Deploy new producer (writes new schema)
# 3. Deploy new consumers (read new schema)
# 4. Run migration job for historical data (if needed)
# 5. Verify data quality
# 6. Remove old schema version
```

---

## 11.14 Summary: Data Engineering Deliverables

| Deliverable | Description |
|-------------|-------------|
| **Event Schema Registry** | Avro/Protobuf schemas for all event types |
| **Kafka Cluster** | 3+ brokers, topic design, retention, compaction |
| **Stream Processor** | Validation → Domain → Stats → Persistence pipeline |
| **Event Store** | PostgreSQL partitioned event table + materialized views |
| **Real-time Cache** | Redis structures for live dashboards |
| **Analytics Warehouse** | Columnar store for historical analysis |
| **Replay Engine** | Full match replay, stat recalculation, model evaluation |
| **Data Quality Framework** | Schema validation, Great Expectations tests, alerts |
| **Lineage System** | Frame → detection → action → stat → dashboard traceability |
| **Governance** | Data contracts, privacy, retention, access control |
| **Operational Tooling** | CLI, dashboards, runbooks, migration playbooks |

---

**END OF CHAPTER 11**

---

# CHAPTER 12: FRONTEND ARCHITECTURE & USER EXPERIENCE (UX)

---

## 12.1 Vision

The frontend architecture delivers a **unified, responsive, and accessible** user experience across all platform portals. Every interface is built from a shared component library, powered by a type-safe API layer, and designed for real-time volleyball intelligence — from live match analysis to deep historical analytics.

**Core Principles:**

| Principle | Implementation |
|-----------|----------------|
| **Single Source of Truth** | Shared UI components, design tokens, and API contracts |
| **Real-Time First** | WebSocket-driven live updates; no polling for match data |
| **Role-Adaptive** | Portal-specific layouts, permissions, and workflows |
| **Accessibility by Default** | WCAG 2.1 AA compliance built into component library |
| **Performance Budgeted** | Measured, monitored, and enforced per page |

---

## 12.2 Portal Architecture

The platform consists of **five distinct portals**, each tailored to its primary user role:

| Portal | Primary Users | Key Workflows |
|--------|---------------|---------------|
| **Public Website** | Prospects, public | Marketing, login, public match info |
| **Admin Portal** | System Admins | User management, system config, org management, audit logs |
| **Coach Portal** | Coaches, Assistant Coaches | Live match, team/player stats, heatmaps, video replay, reports |
| **Analyst Portal** | Performance Analysts | Deep analytics, comparisons, trends, scouting, custom reports |
| **AI Review Portal** | Statisticians | Event review queue, video + overlay, correction workflow |

### 12.2.1 Shared vs. Portal-Specific Code

```
frontend/
├── apps/
│   ├── public-website/      # Next.js (static + SSR)
│   ├── admin-portal/        # Vite + React (SPA, auth required)
│   ├── coach-portal/        # Vite + React (SPA, auth + WebSocket)
│   ├── analyst-portal/      # Vite + React (SPA, heavy charts)
│   └── ai-review-portal/    # Vite + React (SPA, video + annotations)
│
├── shared/
│   ├── ui/                  # Design system components (Button, Card, Table, etc.)
│   ├── charts/              # Recharts/ECharts wrappers (Bar, Line, Radar, Heatmap)
│   ├── forms/               # React Hook Form + Zod schemas
│   ├── layouts/             # Page shells (SidebarLayout, DashboardLayout, etc.)
│   ├── hooks/               # Shared React hooks (useWebSocket, useAuth, etc.)
│   ├── api/                 # Generated API client (TanStack Query + OpenAPI)
│   ├── auth/                # Auth context, token management, RBAC hooks
│   ├── video/               # Video player, clip player, replay controls
│   ├── analytics/           # Analytics components (Leaderboard, TrendChart, etc.)
│   └── utilities/           # Formatters, validators, constants, helpers
│
└── assets/
    ├── fonts/
    ├── icons/
    └── themes/
```

---

## 12.3 Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Framework** | React 18 + TypeScript | Mature ecosystem, strict typing |
| **Build** | Vite 5 | Fast HMR, optimized production builds |
| **Routing** | React Router 6 | Nested routes, data loading |
| **State (Server)** | TanStack Query (React Query) | Caching, deduping, background refetch |
| **State (Client)** | Zustand | Lightweight, TypeScript-friendly global state |
| **Forms** | React Hook Form + Zod | Performant, schema-validated forms |
| **Styling** | Tailwind CSS + CSS Variables | Design token integration, dark mode |
| **Charts** | Apache ECharts (via echarts-for-react) | Performant, customizable, heatmap support |
| **Video** | Video.js + VHS plugin | HLS/DASH, clip seeking, annotations |
| **WebSocket** | Native WebSocket + custom hook | Low-level control, reconnection logic |
| **API Client** | Orval (OpenAPI → TanStack Query) | Type-safe generated client from spec |
| **Testing** | Vitest + React Testing Library + Playwright | Unit, integration, E2E |
| **Storybook** | Storybook 8 | Component documentation, visual testing |
| **Lint/Format** | ESLint (Airbnb) + Prettier + TypeScript strict | Consistency, catch bugs early |

---

## 12.4 Design System

### 12.4.1 Design Tokens (CSS Variables)

```css
/* themes/light.css */
:root {
  /* Colors */
  --color-primary-50: #eff6ff;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  
  --color-success-500: #22c55e;
  --color-warning-500: #f59e0b;
  --color-error-500: #ef4444;
  
  --color-neutral-50: #f8fafc;
  --color-neutral-100: #f1f5f9;
  --color-neutral-500: #64748b;
  --color-neutral-900: #0f172a;
  
  /* Team colors (dynamic, injected at runtime) */
  --color-team-a: var(--team-a-primary, #3b82f6);
  --color-team-b: var(--team-b-primary, #ef4444);
  
  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  
  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  
  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  
  /* Animation */
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 350ms;
  --ease-out: cubic-bezier(0.4, 0, 0.2, 1);
}

/* themes/dark.css */
[data-theme="dark"] {
  --color-neutral-50: #0f172a;
  --color-neutral-100: #1e293b;
  --color-neutral-500: #94a3b8;
  --color-neutral-900: #f8fafc;
  /* ... override all neutral colors */
}
```

### 12.4.2 Component Library Structure

```
shared/ui/
├── primitives/
│   ├── Box.tsx
│   ├── Text.tsx
│   ├── Button.tsx
│   ├── Icon.tsx
│   ├── Badge.tsx
│   └── Avatar.tsx
├── forms/
│   ├── Input.tsx
│   ├── Select.tsx
│   ├── DatePicker.tsx
│   ├── Checkbox.tsx
│   ├── RadioGroup.tsx
│   ├── Switch.tsx
│   └── FormField.tsx       # Wrapper with label, error, hint
├── feedback/
│   ├── Alert.tsx
│   ├── Toast.tsx
│   ├── Modal.tsx
│   ├── Drawer.tsx
│   ├── Tooltip.tsx
│   ├── Popover.tsx
│   ├── Skeleton.tsx
│   └── Spinner.tsx
├── navigation/
│   ├── Sidebar.tsx
│   ├── TopBar.tsx
│   ├── Breadcrumbs.tsx
│   ├── Tabs.tsx
│   └── Pagination.tsx
├── data-display/
│   ├── Table.tsx
│   ├── Card.tsx
│   ├── StatCard.tsx
│   ├── List.tsx
│   ├── Timeline.tsx
│   └── EmptyState.tsx
└── volleyball/
    ├── Scoreboard.tsx
    ├── PlayerCard.tsx
    ├── Heatmap.tsx
    ├── RotationVisualizer.tsx
    ├── RallyTimeline.tsx
    ├── VideoPlayer.tsx
    ├── ClipPlayer.tsx
    └── EventReviewCard.tsx
```

---

## 12.5 Portal Specifications

### 12.5.1 Coach Portal

**Primary Route:** `/coach`

**Layout:** Persistent sidebar + top bar + WebSocket status indicator

**Pages:**

| Route | Purpose | Key Components |
|-------|---------|----------------|
| `/dashboard` | Season overview | Team stats cards, recent matches, upcoming matches, top players |
| `/teams/:teamId` | Team roster & stats | Player grid, team analytics, match history |
| `/players/:playerId` | Player profile | Career stats, match logs, heatmaps, video highlights |
| `/matches/:matchId/live` | **Live match center** | Scoreboard, rally timeline, live events feed, video, heatmaps |
| `/matches/:matchId/replay` | Post-match replay | Timeline scrubber, event filter, clip library, video sync |
| `/matches/:matchId/report` | Match report viewer | PDF preview, download, share |
| `/analytics/team` | Team analytics | Offensive/defensive/serving dashboards, rotation analysis |
| `/analytics/player-comparison` | Compare players | Multi-select, radar charts, stat tables |
| `/settings` | Preferences | Notification config, display options |

**Live Match Center (Critical Page):**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ LIVE  |  Set 2  |  Thunder  24  -  22  Storm  |  Rally 18  |  ▢ ▢ ▢  WS  ●  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────┐  ┌────────────────────────────────────────────────┐  │
│  │  VIDEO FEED      │  │  LIVE STATS                                    │  │
│  │  [Camera: Court] │  │  ┌─────────┬─────────┬─────────┬─────────┐     │  │
│  │  ██████████████  │  │  │ Player  │  Kills  │  Digs   │ Blocks  │     │  │
│  │  ██████████████  │  │  ├─────────┼─────────┼─────────┼─────────┤     │  │
│  │  ██████████████  │  │  │ #8 Smith│   15    │   8     │   3     │     │  │
│  │  ██████████████  │  │  │ #3 Jones│   10    │   5     │   2     │     │  │
│  │  [▶] [⏸] [⏹]    │  │  │ #12 Lee │   7     │   12    │   1     │     │  │
│  └──────────────────┘  │  └─────────┴─────────┴─────────┴─────────┘     │  │
│                        │                                               │  │
│                        │  [HEATMAP]  [ZONES]  [RALLIES]  [CLIPS]       │  │
│                        └────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ RALLY TIMELINE                    [FILTER: KILL ▼ BLOCK ▼ DIG ▼]  │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │ 14:32  ● KILL     Smith #8 (Zone 4)  24-22  ▶                       │   │
│  │ 14:28  ○ DIG      Lee #12 (Zone 6)                    ▶             │   │
│  │ 14:25  ○ SET      Chen #5 (Zone 3)                      ▶           │   │
│  │ 14:22  ● RECEPTION  Kim #2 (Perfect)                     ▶          │   │
│  │ 14:18  ● SERVE      Martinez #9 (Ace)                      ▶        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 12.5.2 Analyst Portal

**Primary Route:** `/analyst`

**Pages:**

| Route | Purpose |
|-------|---------|
| `/dashboard` | Season KPIs, leaderboards, trend alerts |
| `/teams/:teamId/analytics` | Deep team analytics (offensive, defensive, serving, rotation) |
| `/players/:playerId/analytics` | Player deep-dive (trends, efficiency, zones, comparisons) |
| `/comparisons` | Multi-entity comparison (players, teams, seasons) |
| `/scouting/opponent/:teamId` | Opponent scouting reports |
| `/reports/builder` | Drag-drop custom report builder |
| `/reports/library` | Saved reports, scheduled exports |

**Key Components:**

- **TrendChart** — Multi-season line charts with confidence bands
- **RadarChart** — Multi-dimensional player profiles (attack, block, serve, receive, defense)
- **ZoneHeatmap** — Attack/serve/reception placement with efficiency overlay
- **RotationMatrix** — Points scored/conceded by rotation
- **LeaderboardTable** — Sortable, filterable, exportable
- **ReportBuilder** — Section picker, chart selector, schedule export

---

### 12.5.3 Admin Portal

**Primary Route:** `/admin`

**Pages:**

| Route | Purpose |
|-------|---------|
| `/users` | User management (CRUD, roles, status, impersonate) |
| `/organizations` | Org hierarchy, clubs, venues, branding |
| `/teams` | Team CRUD, rosters, logos |
| `/players` | Player CRUD, transfers, medical (restricted) |
| `/matches` | Match scheduling, status, camera assignment |
| `/tournaments` | Tournament management, fixtures, standings |
| `/ai/models` | Model registry, version promotion, deployment status |
| `/system/settings` | Global config, thresholds, formulas, integrations |
| `/audit` | Audit log viewer (filterable, exportable) |
| `/monitoring` | System health, event throughput, GPU usage, storage |

---

### 12.5.4 AI Review Portal

**Primary Route:** `/review`

**Pages:**

| Route | Purpose |
|-------|---------|
| `/queue` | **Main review queue** — filterable by confidence, match, event type, team |
| `/event/:eventId` | **Event review workspace** — video + overlay + decision UI |
| `/history` | Review history, auditor stats, corrections |
| `/guidelines` | Annotation guidelines, rule reference |

**Event Review Workspace (Critical Page):**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ EVENT REVIEW  |  Match: Thunder vs Storm  |  Set 2, Rally 18  |  Conf: 52% │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────┐  ┌────────────────────────────────────┐  │
│  │ VIDEO CLIP (3s pre / 2s post)│  │ AI PREDICTION                      │  │
│  │ ████████████████████████████ │  │ ┌────────────────────────────────┐ │  │
│  │ ████████████████████████████ │  │ │ Event: SPIKE → KILL            │ │  │
│  │ ████████████████████████████ │  │ │ Player: #8 Smith (Track 23)    │ │  │
│  │ ████████████████████████████ │  │ │ Team: Thunder                  │ │  │
│  │ ████████████████████████████ │  │ │ Confidence: 0.52               │ │  │
│  │ [◀10s] [⏪] [⏸] [⏩] [10s▶]  │  │ │ Outcome: POINT                 │ │  │
│  │ ████████████████████████████ │  │ └────────────────────────────────┘ │  │
│  │ Timeline: ████████░░░░░░░░░  │  │                                    │  │
│  │          ▲                   │  │ OVERLAYS: ☑ Detections ☑ Tracking  │  │
│  │        Frame 24830           │  │         ☑ Pose     ☑ Court  ☑ Ball │  │
│  └──────────────────────────────┘  └────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ YOUR DECISION                                                        │   │
│  │  ○ Confirm: Spike → Kill                                             │   │
│  │  ○ Correct:  Spike → Attack Error    ○ Reception Error    ○ Block   │   │
│  │  ○ Correct:  Set                       ○ Free Ball                  │   │
│  │  ○ Not an event (false positive)                                     │   │
│  │                                                                      │   │
│  │  Notes: __________________________________________________________  │   │
│  │                                                                      │   │
│  │  [SUBMIT]  [SKIP]  [FLAG FOR EXPERT]                                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 12.6 Real-Time Architecture (Frontend)

### 12.6.1 WebSocket Connection Manager

```typescript
// shared/hooks/useMatchWebSocket.ts
export function useMatchWebSocket(matchId: number, channels: Channel[]) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const ws = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  
  const connect = useCallback(() => {
    const url = `${WS_BASE_URL}/ws/match/${matchId}?token=${user.accessToken}`;
    ws.current = new WebSocket(url);
    
    ws.current.onopen = () => {
      reconnectAttempts.current = 0;
      ws.current?.send(JSON.stringify({ 
        type: 'SUBSCRIBE', 
        payload: { channels } 
      }));
    };
    
    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      handleMessage(message, queryClient);
    };
    
    ws.current.onclose = () => {
      if (reconnectAttempts.current < maxReconnectAttempts) {
        setTimeout(connect, Math.min(1000 * 2 ** reconnectAttempts.current, 30000));
        reconnectAttempts.current++;
      }
    };
  }, [matchId, channels, user]);
  
  useEffect(() => {
    connect();
    return () => ws.current?.close();
  }, [connect]);
  
  return { send: (msg) => ws.current?.send(JSON.stringify(msg)) };
}

function handleMessage(message: WSMessage, queryClient: QueryClient) {
  switch (message.type) {
    case 'EVENT':
      queryClient.setQueryData(['match', message.payload.matchId, 'events'], 
        (old: Event[]) => [...(old || []), message.payload]);
      break;
    case 'STAT_UPDATE':
      queryClient.setQueryData(['player', message.payload.playerId, 'liveStats'],
        (old: PlayerStats) => ({ ...old, ...message.payload.delta }));
      break;
    case 'SCOREBOARD':
      queryClient.setQueryData(['match', message.payload.matchId, 'scoreboard'],
        message.payload);
      break;
    case 'ALERT':
      toast(message.payload.message, { type: message.payload.level });
      break;
  }
}
```

### 12.6.2 Optimistic Updates

```typescript
// Example: Coach submits a timeout
async function requestTimeout(matchId: number, teamId: number) {
  // 1. Optimistic update
  queryClient.setQueryData(['match', matchId, 'scoreboard'], (old) => ({
    ...old,
    timeouts: { ...old.timeouts, [teamId]: old.timeouts[teamId] - 1 },
    pendingActions: [...old.pendingActions, { type: 'TIMEOUT', teamId }]
  }));
  
  try {
    // 2. API call
    await api.post(`/matches/${matchId}/timeout`, { teamId });
    // 3. Server confirms via WebSocket → replaces optimistic state
  } catch (error) {
    // 4. Rollback on error
    queryClient.invalidateQueries({ queryKey: ['match', matchId, 'scoreboard'] });
    toast.error('Timeout request failed');
  }
}
```

---

## 12.7 Video & Replay Components

### 12.7.1 VideoPlayer Props

```typescript
interface VideoPlayerProps {
  src: string;                    // HLS manifest (.m3u8) or MP4
  poster?: string;
  startTime?: number;             // Seconds
  endTime?: number;
  overlays?: Overlay[];           // Detections, tracking, court, events
  onEventSeek?: (event: TimelineEvent) => void;
  onClipCreate?: (clip: ClipRequest) => void;
  keyboardShortcuts?: boolean;
  playbackRates?: number[];
  thumbnailPreview?: boolean;     // Hover timeline for preview
}

interface Overlay {
  type: 'detection' | 'tracking' | 'court' | 'pose' | 'event';
  data: any;
  visible: boolean;
  color?: string;
  opacity?: number;
}
```

### 12.7.2 ClipPlayer for Review

```typescript
interface ClipPlayerProps {
  clip: ReplayClip;
  loop?: boolean;
  showTimeline?: boolean;
  onAnnotationAdd?: (annotation: VideoAnnotation) => void;
  annotations?: VideoAnnotation[];
  speedControls?: boolean;
  frameStep?: boolean;
}
```

---

## 12.8 Analytics Components

### 12.8.1 Chart Components

```typescript
// shared/charts/TrendChart.tsx
interface TrendChartProps {
  data: TimeSeriesPoint[];
  xKey: string;
  yKeys: string[];
  yLabels: Record<string, string>;
  colors?: Record<string, string>;
  annotations?: ChartAnnotation[];
  zoomable?: boolean;
  tooltipFormatter?: (point: TimeSeriesPoint) => ReactNode;
}

// shared/charts/RadarChart.tsx
interface RadarChartProps {
  data: RadarPoint[];
  dimensions: RadarDimension[];  // { key, label, max }
  compareData?: RadarPoint[];    // For player comparison
  showAverage?: boolean;
}

// shared/charts/Heatmap.tsx
interface HeatmapProps {
  grid: number[][];
  zones?: ZoneDefinition[];
  colorScale: 'blue-red' | 'viridis' | 'plasma';
  onCellClick?: (zone: string, value: number) => void;
  showValues?: boolean;
}
```

---

## 12.9 Search & Navigation

### 12.9.1 Global Search (Cmd+K / Ctrl+K)

```typescript
// shared/hooks/useGlobalSearch.ts
export function useGlobalSearch(query: string) {
  return useQuery({
    queryKey: ['global-search', query],
    queryFn: () => api.search.global({ q: query, limit: 10 }),
    enabled: query.length >= 2,
    staleTime: 30_000,
  });
}

/* Results grouped by type:
{
  players: [{ id, name, team, jersey, avatar }],
  teams: [{ id, name, logo, league }],
  matches: [{ id, date, home, away, score, status }],
  reports: [{ id, title, type, date }],
  organizations: [{ id, name, type }]
}
*/
```

### 12.9.2 Keyboard Navigation

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Open global search |
| `Cmd/Ctrl + Shift + M` | Jump to live match |
| `G` then `D` | Go to dashboard |
| `G` then `T` | Go to teams |
| `G` then `P` | Go to players |
| `G` then `A` | Go to analytics |
| `?` | Show shortcuts help |
| `Esc` | Close modal/drawer/search |
| `←` / `→` | Navigate timeline (video/replay) |
| `Space` | Play/pause video |

---

## 12.10 Notification System

### 12.9.1 Notification Center

```typescript
// shared/api/notifications.ts
interface Notification {
  id: string;
  type: 'camera_alert' | 'ai_alert' | 'match_event' | 'system_warning' | 'report_ready';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  read: boolean;
  createdAt: string;
  actionUrl?: string;        // Deep link to relevant page
  metadata?: Record<string, any>;
}
```

**UI:** Bell icon in top bar → dropdown with filter tabs (All, Unread, High Priority) → click navigates to `actionUrl`.

---

## 12.11 Theming & Branding

### 12.11.1 Organization Branding

```typescript
interface OrganizationBranding {
  orgId: number;
  primaryColor: string;      // Hex, applied to --color-team-a
  secondaryColor: string;    // Applied to --color-team-b
  logoUrl: string;           // SVG preferred
  faviconUrl?: string;
  logoDarkUrl?: string;      // For dark mode
}
```

**Injection:** Loaded at app init → CSS variables updated → all components re-render with brand colors.

---

## 12.12 Internationalization (i18n)

### 12.12.1 Structure

```
frontend/
├── shared/
│   └── locales/
│       ├── en.json
│       ├── es.json
│       ├── fr.json
│       ├── de.json
│       └── pt.json
```

### 12.12.2 Usage

```typescript
// Using react-i18next
import { useTranslation } from 'react-i18next';

function KillCount({ count }: { count: number }) {
  const { t } = useTranslation('analytics');
  return <span>{t('killCount', { count })}</span>;
}

/* en.json:
{
  "analytics": {
    "killCount": "{{count}} kill {{count === 1 ? '' : 's'}}"
  }
}
*/
```

### 12.12.3 Supported Formats

| Format | Library | Example |
|--------|---------|---------|
| **Date** | `date-fns` + locale | `MM/dd/yyyy` (US), `dd/MM/yyyy` (EU) |
| **Time** | 12h / 24h toggle | `3:30 PM` / `15:30` |
| **Number** | `Intl.NumberFormat` | `1,234.5` / `1.234,5` |
| **Measurement** | Metric / Imperial | `180 cm` / `5'11"` |

---

## 12.13 Accessibility (a11y)

### 12.13.1 WCAG 2.1 AA Checklist

| Criterion | Implementation |
|-----------|----------------|
| **1.4.3 Contrast** | Design tokens enforce 4.5:1 (text), 3:1 (UI) |
| **2.1.1 Keyboard** | All interactive elements reachable, visible focus rings |
| **2.4.3 Focus Order** | Logical tab order; skip links for main content |
| **2.4.7 Focus Visible** | `focus-visible` polyfill + custom focus styles |
| **3.2.1 On Focus** | No unexpected navigation on focus |
| **4.1.2 Name/Role/Value** | Semantic HTML + ARIA labels where needed |
| **1.3.1 Info/Relationships** | Proper heading hierarchy, table headers, form labels |

### 12.13.2 Testing

```bash
# Automated a11y testing in CI
npm run test:a11y  # Runs axe-core on all Storybook stories

# Manual testing checklist
- [ ] Navigate entire app with keyboard only
- [ ] Test with screen reader (NVDA/JAWS/VoiceOver)
- [ ] Verify color contrast in both themes
- [ ] Test zoom up to 200%
- [ ] Validate with axe DevTools
```

---

## 12.14 Performance Budgets

| Metric | Budget | Measurement |
|--------|--------|-------------|
| **Initial Load (LCP)** | < 3.0s | WebPageTest (3G, mobile) |
| **TTI (Time to Interactive)** | < 3.5s | Lighthouse CI |
| **Dashboard Navigation** | < 500ms | Client-side transition |
| **Live Update Latency** | < 2s | Event → WebSocket → DOM |
| **Search Suggestions** | < 300ms | Keystroke → results |
| **Bundle Size (gzipped)** | < 200 KB | `vite build --mode analyze` |
| **Chart Render (1000 pts)** | < 100ms | React Profiler |
| **Video Player Init** | < 1s | `loadstart` → `canplay` |

### 12.14.1 Optimization Strategies

- **Code Splitting:** Route-level + component-level (`React.lazy`)
- **Tree Shaking:** ES modules, sideEffects: false
- **Image Optimization:** WebP/AVIF, responsive sizes, lazy load
- **Font Loading:** `font-display: swap`, preload critical fonts
- **Caching:** Service worker (Workbox) for static assets
- **Virtualization:** `react-window` for large tables/lists
- **Memoization:** `React.memo`, `useMemo`, `useCallback` for expensive components

---

## 12.15 State Management Architecture

### 12.15.1 Store Structure (Zustand)

```typescript
// shared/store/authStore.ts
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  permissions: Permission[];
  login: (credentials: LoginInput) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

// shared/store/uiStore.ts
interface UIState {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  activeMatchId: number | null;
  notifications: Notification[];
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  addNotification: (notification: Notification) => void;
}
```

### 12.15.2 Server State (TanStack Query)

```typescript
// shared/api/queries.ts
export const queryKeys = {
  // Auth
  me: () => ['auth', 'me'] as const,
  
  // Organizations
  organizations: (params?: ListParams) => ['organizations', params] as const,
  organization: (id: number) => ['organizations', id] as const,
  
  // Teams
  teams: (params?: TeamListParams) => ['teams', params] as const,
  team: (id: number) => ['teams', id] as const,
  teamRoster: (teamId: number, seasonId?: number) => 
    ['teams', teamId, 'roster', seasonId] as const,
  
  // Players
  players: (params?: PlayerListParams) => ['players', params] as const,
  player: (id: number) => ['players', id] as const,
  playerStats: (playerId: number, matchId?: number) => 
    ['players', playerId, 'stats', matchId] as const,
  playerHeatmap: (playerId: number, matchId: number, setId?: number) =>
    ['players', playerId, 'heatmap', matchId, setId] as const,
  
  // Matches
  matches: (params?: MatchListParams) => ['matches', params] as const,
  match: (id: number) => ['matches', id] as const,
  matchLive: (id: number) => ['matches', id, 'live'] as const,
  matchEvents: (id: number, filters?: EventFilters) => 
    ['matches', id, 'events', filters] as const,
  matchTimeline: (id: number) => ['matches', id, 'timeline'] as const,
  
  // Analytics
  leaderboard: (seasonId: number, metric: string, limit?: number) =>
    ['analytics', 'leaderboard', seasonId, metric, limit] as const,
  teamAnalytics: (teamId: number, seasonId: number) =>
    ['analytics', 'team', teamId, seasonId] as const,
  playerComparison: (playerIds: number[], seasonId: number) =>
    ['analytics', 'comparison', playerIds.sort(), seasonId] as const,
  
  // Reports
  reports: (params?: ReportListParams) => ['reports', params] as const,
  report: (id: number) => ['reports', id] as const,
};
```

---

## 12.16 Error Handling & Resilience

### 12.16.1 Error Boundaries

```tsx
// shared/ui/ErrorBoundary.tsx
class ErrorBoundary extends React.Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    logErrorToService(error, info.componentStack);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <Alert severity="error" title="Something went wrong">
          <Text>We're sorry, but this component encountered an error.</Text>
          <Button onClick={() => this.setState({ hasError: false })}>
            Try Again
          </Button>
        </Alert>
      );
    }
    return this.props.children;
  }
}

// Usage: wrap each portal page
<ErrorBoundary>
  <CoachPortal />
</ErrorBoundary>
```

### 12.16.2 API Error Handling

```typescript
// shared/api/errorHandler.ts
export function handleApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const data = error.response?.data;
    
    switch (status) {
      case 400: return { code: 'VALIDATION_ERROR', message: data?.message || 'Invalid input', details: data?.errors };
      case 401: return { code: 'UNAUTHORIZED', message: 'Session expired. Please log in.' };
      case 403: return { code: 'FORBIDDEN', message: 'You do not have permission for this action.' };
      case 404: return { code: 'NOT_FOUND', message: 'Resource not found.' };
      case 409: return { code: 'CONFLICT', message: data?.message || 'Resource conflict.' };
      case 422: return { code: 'UNPROCESSABLE', message: data?.message || 'Validation failed.' };
      case 429: return { code: 'RATE_LIMITED', message: 'Too many requests. Please wait.' };
      case 500: return { code: 'SERVER_ERROR', message: 'Server error. Please try again later.' };
      default: return { code: 'UNKNOWN', message: 'An unexpected error occurred.' };
    }
  }
  return { code: 'NETWORK_ERROR', message: 'Network error. Check your connection.' };
}
```

---

## 12.17 Testing Strategy

| Layer | Tool | Coverage Target |
|-------|------|-----------------|
| **Unit (Components)** | Vitest + React Testing Library | 80% |
| **Unit (Hooks/Utils)** | Vitest | 90% |
| **Integration** | Vitest + MSW (Mock Service Worker) | 70% |
| **E2E (Critical Paths)** | Playwright | 100% of critical flows |
| **Visual Regression** | Storybook + Chromatic | All shared UI components |
| **Accessibility** | axe-core (CI) | 0 violations on shared components |

### 12.17.1 Critical E2E Flows

```typescript
// e2e/coach-live-match.spec.ts
test('Coach can watch live match and create clip', async ({ page }) => {
  await page.goto('/coach/matches/1001/live');
  await expect(page.locator('[data-testid=scoreboard]')).toBeVisible();
  await expect(page.locator('[data-testid=video-player]')).toBeVisible();
  
  // Wait for kill event
  await page.waitForSelector('[data-testid=event-kill]', { timeout: 30000 });
  
  // Click clip button on event
  await page.click('[data-testid=event-kill] >> [data-testid=create-clip]');
  
  // Verify clip created
  await expect(page.locator('[data-testid=clip-toast]')).toBeVisible();
});
```

---

## 12.18 Deployment & CI/CD

### 12.18.1 Build Pipeline

```yaml
# .github/workflows/frontend.yml
name: Frontend CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test:unit
      - run: npm run test:a11y
  
  build:
    needs: lint-and-test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci && npm run build
      - uses: actions/upload-artifact@v4
        with: { name: dist, path: dist/ }
  
  storybook:
    needs: lint-and-test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build-storybook
      - uses: chromatic/action@v1
  
  deploy-staging:
    needs: [build, storybook]
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with: { name: dist }
      - run: deploy-to-staging.sh
  
  deploy-production:
    needs: [build, storybook]
    if: github.ref == 'refs/heads/main'
    environment: production
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with: { name: dist }
      - run: deploy-to-production.sh
```

---

## 12.19 Future UX Enhancements

| Enhancement | Description | Priority |
|-------------|-------------|----------|
| **AI Assistant** | Natural language queries: "Show me all kills by #8 in zone 4" | Medium |
| **Voice Commands** | "Clip that", "Replay last rally" during live match | Low |
| **Gesture Video Control** | Swipe to scrub, pinch to zoom on tablet | Medium |
| **AR/VR Tactical View** | 3D court visualization with player paths | Future |
| **Offline Mobile Mode** | Cached stats, sync when online | Medium |
| **Custom Dashboards** | Drag-drop widget builder per user | Medium |
| **Personalized Feeds** | "My players", "My teams" notifications | Medium |
| **Collaborative Analysis** | Real-time annotations shared between staff | Future |

---

## 12.20 Frontend Deliverables Summary

| Deliverable | Description |
|-------------|-------------|
| **Design System** | Tokens, 50+ components, Storybook documentation |
| **5 Portals** | Public, Admin, Coach, Analyst, AI Review |
| **Real-Time Engine** | WebSocket manager, optimistic updates, cache sync |
| **Video Suite** | Player, Clip Player, Annotated Replay, Highlight Builder |
| **Analytics Components** | 15+ chart types, heatmaps, radar, zone analysis |
| **Search & Navigation** | Global Cmd+K, keyboard shortcuts, deep linking |
| **Notification Center** | Real-time, filterable, actionable |
| **Theme System** | Light/Dark, org branding, CSS variables |
| **i18n Ready** | 5 languages, locale-aware formats |
| **Accessibility** | WCAG 2.1 AA, automated + manual testing |
| **Performance** | Budgets enforced in CI, <3s LCP target |
| **Testing Suite** | Unit, integration, E2E, visual, a11y |
| **CI/CD Pipeline** | Lint → Test → Build → Storybook → Deploy |

---

**END OF CHAPTER 12**

---

# CHAPTER 13: API ARCHITECTURE & INTEGRATION SPECIFICATION

---

## 13.1 Vision

The API layer is the **contract layer** of the platform — the single source of truth for how frontend, backend, AI services, and third-party integrations communicate. Every capability of the platform is exposed through a versioned, documented, and governed REST + WebSocket API.

**Design Goals:**

| Goal | Implementation |
|------|----------------|
| **Contract-First** | OpenAPI 3.1 spec drives code generation |
| **Type Safety** | End-to-end TypeScript from spec to client |
| **Versioning** | URL versioning + semantic versioning policy |
| **Security** | JWT + RBAC, rate limiting, audit logging |
| **Observability** | Request tracing, structured logging, metrics |
| **Performance** | Pagination, filtering, caching, compression |

---

## 13.2 API Standards

### 13.2.1 REST Conventions

| Convention | Standard |
|------------|----------|
| **Base URL** | `https://api.volleyplatform.com/api/v1` |
| **Versioning** | URL path (`/api/v1/`, `/api/v2/`) |
| **Format** | JSON (`application/json`) |
| **Character Encoding** | UTF-8 |
| **Date/Time** | ISO 8601 UTC (`2026-07-15T14:32:17.420Z`) |
| **Identifiers** | UUID v4 for resources, integers for legacy IDs |
| **Collections** | Plural nouns (`/players`, `/matches`) |
| **Resources** | Singular with ID (`/players/{id}`) |
| **Sub-resources** | Nested under parent (`/matches/{id}/events`) |
| **Actions** | POST to verb-named endpoint (`/matches/{id}/start`) |

### 13.2.2 HTTP Methods

| Method | Purpose | Idempotent |
|--------|---------|------------|
| `GET` | Retrieve resource(s) | Yes |
| `POST` | Create resource, execute action | No |
| `PUT` | Full replacement | Yes |
| `PATCH` | Partial update | No |
| `DELETE` | Remove resource | Yes |

### 13.2.3 Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| `200` | OK | Successful GET, PUT, PATCH |
| `201` | Created | Successful POST |
| `204` | No Content | Successful DELETE |
| `400` | Bad Request | Invalid input, validation errors |
| `401` | Unauthorized | Missing/invalid token |
| `403` | Forbidden | Insufficient permissions |
| `404` | Not Found | Resource doesn't exist |
| `409` | Conflict | Duplicate, state conflict |
| `422` | Unprocessable | Semantic validation failure |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Error | Unexpected server error |
| `503` | Unavailable | Service down for maintenance |

---

## 13.3 Request/Response Envelope

### 13.3.1 Success Response

```json
{
  "status": "success",
  "data": { },
  "meta": {
    "timestamp": "2026-07-15T14:32:17.420Z",
    "request_id": "req_abc123",
    "version": "v1.2.0"
  }
}
```

### 13.3.2 Paginated Response

```json
{
  "status": "success",
  "data": [ ],
  "meta": {
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 150,
      "total_pages": 8,
      "has_next": true,
      "has_prev": false
    },
    "timestamp": "2026-07-15T14:32:17.420Z",
    "request_id": "req_abc123"
  }
}
```

### 13.3.3 Error Response

```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Input validation failed",
    "details": [
      { "field": "email", "code": "INVALID_FORMAT", "message": "Invalid email format" }
    ]
  },
  "meta": {
    "timestamp": "2026-07-15T14:32:17.420Z",
    "request_id": "req_abc123"
  }
}
```

---

## 13.4 Authentication & Authorization

### 13.4.1 JWT Bearer Token

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token Claims:**

```json
{
  "sub": "user_123",
  "email": "coach@club.com",
  "role": "coach",
  "org_id": 42,
  "permissions": ["matches:read", "players:write", "stats:read"],
  "iat": 1700000000,
  "exp": 1700086400
}
```

### 13.4.2 Role-Based Access Control (RBAC)

| Role | Description | Default Permissions |
|------|-------------|---------------------|
| `admin` | Platform administrator | All permissions |
| `org_admin` | Organization administrator | Manage org resources |
| `coach` | Team coach | Team/player/match stats, live match |
| `analyst` | Performance analyst | Read-only analytics, reports |
| `statistician` | Event reviewer | Event review, corrections |
| `viewer` | Read-only access | Public match data |

### 13.4.3 Permission Format

```
{resource}:{action}
Examples: matches:read, players:write, stats:read, events:review
```

---

## 13.5 API Catalog

### 13.5.1 Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/login` | Email/password login → tokens |
| `POST` | `/auth/register` | Register new user |
| `POST` | `/auth/refresh` | Refresh access token |
| `POST` | `/auth/logout` | Invalidate refresh token |
| `POST` | `/auth/forgot-password` | Request password reset |
| `POST` | `/auth/reset-password` | Reset with token |
| `GET` | `/auth/me` | Current user profile |
| `PUT` | `/auth/me` | Update profile |
| `PUT` | `/auth/password` | Change password |

### 13.5.2 Organizations & Clubs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/organizations` | List organizations (admin) |
| `POST` | `/organizations` | Create organization |
| `GET` | `/organizations/{id}` | Get organization |
| `PUT` | `/organizations/{id}` | Update organization |
| `GET` | `/organizations/{id}/clubs` | List clubs in org |
| `POST` | `/organizations/{id}/clubs` | Create club |
| `GET` | `/clubs/{id}` | Get club details |
| `PUT` | `/clubs/{id}` | Update club |
| `GET` | `/clubs/{id}/branding` | Get branding config |
| `PUT` | `/clubs/{id}/branding` | Update branding |

### 13.5.3 Users & Roles

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/users` | List users (paginated, filterable) |
| `POST` | `/users` | Create user (admin) |
| `GET` | `/users/{id}` | Get user profile |
| `PUT` | `/users/{id}` | Update user |
| `PUT` | `/users/{id}/role` | Change user role |
| `PUT` | `/users/{id}/status` | Activate/deactivate |
| `GET` | `/users/{id}/permissions` | Get effective permissions |

### 13.5.4 Teams & Players

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/teams` | List teams (filter: org, club, season) |
| `POST` | `/teams` | Create team |
| `GET` | `/teams/{id}` | Team details + roster summary |
| `PUT` | `/teams/{id}` | Update team |
| `DELETE` | `/teams/{id}` | Delete team (soft) |
| `GET` | `/teams/{id}/roster` | Full roster with positions |
| `POST` | `/teams/{id}/roster` | Add player to roster |
| `DELETE` | `/teams/{id}/roster/{playerId}` | Remove from roster |
| `GET` | `/players` | List players (filter: team, position, search) |
| `POST` | `/players` | Create player |
| `GET` | `/players/{id}` | Player profile + career stats |
| `PUT` | `/players/{id}` | Update player |
| `DELETE` | `/players/{id}` | Deactivate player |
| `GET` | `/players/{id}/career-stats` | Aggregated career statistics |
| `GET` | `/players/{id}/season-stats` | Per-season breakdown |
| `GET` | `/players/{id}/match-logs` | Per-match statistics |

### 13.5.5 Competitions (Seasons, Tournaments, Matches)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/seasons` | List seasons |
| `POST` | `/seasons` | Create season |
| `GET` | `/seasons/{id}` | Season details |
| `GET` | `/tournaments` | List tournaments |
| `POST` | `/tournaments` | Create tournament |
| `GET` | `/tournaments/{id}` | Tournament details |
| `POST` | `/tournaments/{id}/fixtures` | Generate fixtures |
| `GET` | `/tournaments/{id}/standings` | Current standings |
| `GET` | `/matches` | List matches (filter: team, tournament, status, date) |
| `POST` | `/matches` | Create match |
| `GET` | `/matches/{id}` | Match details |
| `PUT` | `/matches/{id}` | Update match |
| `POST` | `/matches/{id}/start` | Start match (live) |
| `POST` | `/matches/{id}/pause` | Pause match |
| `POST` | `/matches/{id}/resume` | Resume match |
| `POST` | `/matches/{id}/end` | End match |
| `GET` | `/matches/{id}/sets` | Set scores |
| `GET` | `/matches/{id}/lineups` | Starting lineups + rotations |
| `POST` | `/matches/{id}/lineups` | Set lineup |
| `POST` | `/matches/{id}/substitutions` | Record substitution |
| `POST` | `/matches/{id}/timeouts` | Record timeout |

### 13.5.6 Match Events & Live Data

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/matches/{id}/events` | All events (filter: type, player, rally) |
| `GET` | `/matches/{id}/events/live` | WebSocket endpoint for live events |
| `GET` | `/matches/{id}/rallies` | Rally summaries |
| `GET` | `/matches/{id}/timeline` | Chronological event timeline |
| `GET` | `/matches/{id}/scoreboard` | Live scoreboard state |

### 13.5.7 Statistics & Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/statistics/players/{id}` | Player stats (query: season, match, per-game) |
| `GET` | `/statistics/teams/{id}` | Team aggregate stats |
| `GET` | `/statistics/matches/{id}` | Match statistics (both teams) |
| `GET` | `/statistics/leaderboards` | Top-N by metric (filter: season, team, position) |
| `GET` | `/analytics/players/{id}` | Deep analytics (trends, zones, efficiency) |
| `GET` | `/analytics/teams/{id}` | Team analytics (offensive, defensive, serving) |
| `GET` | `/analytics/comparison` | Multi-entity comparison |
| `GET` | `/analytics/heatmaps` | Player/team heatmaps |
| `GET` | `/analytics/attack-zones` | Attack placement analysis |
| `GET` | `/analytics/serve-placement` | Serve placement analysis |
| `GET` | `/analytics/rotation-efficiency` | Points by rotation |

### 13.5.8 Video & Replay

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/matches/{id}/video` | Video metadata + HLS manifest |
| `POST` | `/matches/{id}/clips` | Create clip from event |
| `GET` | `/matches/{id}/clips` | List clips (filter: event, player, type) |
| `GET` | `/clips/{id}` | Clip metadata + playback URL |
| `DELETE` | `/clips/{id}` | Delete clip |
| `GET` | `/matches/{id}/replay` | Replay session (timeline + video sync) |

### 13.5.9 AI Review

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/ai/review/queue` | Low-confidence events (filter: match, type, confidence) |
| `GET` | `/ai/review/events/{id}` | Event review detail (video + overlays) |
| `POST` | `/ai/review/events/{id}/confirm` | Confirm AI prediction |
| `POST` | `/ai/review/events/{id}/correct` | Correct event type/outcome |
| `POST` | `/ai/review/events/{id}/reject` | Reject as false positive |
| `GET` | `/ai/review/history` | Review history (auditor, date, action) |

### 13.5.10 Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/reports` | List reports (filter: type, match, team, player) |
| `POST` | `/reports/generate` | Generate report (async) |
| `GET` | `/reports/{id}` | Report status + download URL |
| `GET` | `/reports/{id}/download` | Download PDF/CSV/Excel |
| `DELETE` | `/reports/{id}` | Delete report |
| `POST` | `/reports/templates` | Create custom template |
| `GET` | `/reports/templates` | List templates |

### 13.5.11 Cameras & Video Sources

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/cameras` | List cameras |
| `POST` | `/cameras` | Register camera |
| `GET` | `/cameras/{id}` | Camera details |
| `PUT` | `/cameras/{id}` | Update camera |
| `POST` | `/cameras/{id}/calibrate` | Trigger calibration |
| `GET` | `/cameras/{id}/health` | Stream health status |
| `GET` | `/cameras/{id}/stream` | Stream proxy (authenticated) |

### 13.5.12 AI Configuration

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/ai/models` | List deployed models |
| `POST` | `/ai/models` | Deploy new model version |
| `PUT` | `/ai/models/{id}/promote` | Promote to production |
| `GET` | `/ai/config` | Current inference config |
| `PUT` | `/ai/config` | Update thresholds, device, batch size |
| `GET` | `/ai/health` | Inference service health |

### 13.5.13 System & Administration

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/admin/dashboard` | System overview (matches, users, AI, storage) |
| `GET` | `/admin/audit-logs` | Audit log (filter: user, action, date) |
| `GET` | `/admin/event-pipeline` | Event throughput, lag, errors |
| `POST` | `/admin/backup` | Trigger backup |
| `GET` | `/admin/backups` | Backup history |
| `POST` | `/admin/maintenance` | Toggle maintenance mode |
| `GET` | `/health` | Liveness probe |
| `GET` | `/ready` | Readiness probe |

---

## 13.6 Query Parameters Standard

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `page` | integer | Page number (1-indexed) | 1 |
| `per_page` | integer | Items per page (max 100) | 20 |
| `sort` | string | Sort field + direction (`-created_at`, `name`) | — |
| `filter[{field}]` | string | Exact match filter | — |
| `filter[{field}][op]` | string | Operator: `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `in`, `like` | `eq` |
| `search` | string | Full-text search across relevant fields | — |
| `include` | string | Comma-separated relations to eager-load | — |
| `fields` | string | Comma-separated fields to return | All |

**Examples:**

```
GET /players?page=2&per_page=50&sort=-created_at&filter[team_id]=12&search=smith
GET /matches?filter[status]=live&filter[tournament_id]=5&include=home_team,away_team
GET /events?filter[match_id]=1001&filter[type]=kill,block&filter[timestamp][gte]=2026-07-15T14:00:00Z
```

---

## 13.7 WebSocket API

### 13.7.1 Connection

```
wss://api.volleyplatform.com/api/v1/ws/match/{matchId}?token={access_token}
```

### 13.7.2 Client → Server Messages

```typescript
// Subscribe to channels
{ "type": "SUBSCRIBE", "payload": { "channels": ["scoreboard", "events", "stats", "alerts"] } }

// Unsubscribe
{ "type": "UNSUBSCRIBE", "payload": { "channels": ["events"] } }

// Ping (heartbeat)
{ "type": "PING" }

// Coach actions (optimistic)
{ "type": "COACH_ACTION", "payload": { "action": "TIMEOUT", "team_id": 12 } }
```

### 13.7.3 Server → Client Messages

```typescript
// Scoreboard update
{ "type": "SCOREBOARD", "channel": "scoreboard", "payload": { "home": 24, "away": 22, "set": 2, "serving_team": "home" } }

// New validated event
{ "type": "EVENT", "channel": "events", "payload": { "event_id": "evt_123", "type": "KILL", "player_id": 108, "team_id": 12, "timestamp": "2026-07-15T14:32:17.420Z", "confidence": 0.96, "court_zone": 4 } }

// Live stat delta
{ "type": "STAT_UPDATE", "channel": "stats", "payload": { "player_id": 108, "delta": { "kills": 1, "attack_attempts": 1 }, "totals": { "kills": 15, "attack_attempts": 28 } } }

// Alert
{ "type": "ALERT", "channel": "alerts", "payload": { "level": "INFO", "message": "Player #8 reaches 100 career kills!" } }

// Camera status
{ "type": "CAMERA_STATUS", "channel": "system", "payload": { "camera_id": "cam_001", "status": "disconnected", "last_frame": "2026-07-15T14:32:15.000Z" } }

// Pong response
{ "type": "PONG" }
```

---

## 13.8 File Upload API

### 13.8.1 Direct Upload (Presigned URL)

```http
POST /api/v1/uploads/presign
Content-Type: application/json

{ "filename": "match_1001.mp4", "content_type": "video/mp4", "size_bytes": 2147483648 }
```

**Response:**

```json
{
  "upload_url": "https://storage.volleyplatform.com/...?X-Amz-Signature=...",
  "fields": { "key": "uploads/match_1001.mp4", "policy": "...", "signature": "..." },
  "expires_at": "2026-07-15T15:32:17.000Z",
  "asset_id": "asset_abc123"
}
```

### 13.8.2 Multipart Upload (Large Files)

```http
POST /api/v1/uploads/multipart/initiate
{ "filename": "match_1001.mp4", "total_size": 5368709120, "part_size": 52428800 }

→ { "upload_id": "upid_123", "part_count": 102, "presigned_parts": [ { "part_number": 1, "url": "..." }, ... ] }

# Complete
POST /api/v1/uploads/multipart/complete
{ "upload_id": "upid_123", "parts": [{ "part_number": 1, "etag": "..." }, ...] }
```

---

## 13.9 Rate Limiting

| Tier | Limit | Scope |
|------|-------|-------|
| **Anonymous** | 60 req/min | IP |
| **Authenticated** | 600 req/min | User |
| **Coach/Analyst** | 1200 req/min | User |
| **Admin** | 3000 req/min | User |
| **Video Upload** | 5 concurrent | User |
| **WebSocket** | 1 connection/match | User |

**Headers:**

```
X-RateLimit-Limit: 600
X-RateLimit-Remaining: 598
X-RateLimit-Reset: 1700086800
Retry-After: 45  (on 429)
```

---

## 13.10 Versioning & Deprecation

### 13.10.1 Version Policy

| Version | Status | Sunset Date |
|---------|--------|-------------|
| `v1` | Current | TBD |
| `v2` | Planned | — |

**Rules:**

- Breaking changes → new major version (`/api/v2/`)
- Additive changes → same version, documented in changelog
- Deprecated endpoints → `Sunset` header + 6-month notice
- Clients must specify version in URL

### 13.10.2 Sunset Header

```
Sunset: Sat, 01 Jan 2027 00:00:00 GMT
Link: <https://api.volleyplatform.com/api/v2/players>; rel="successor-version"
```

---

## 13.11 OpenAPI Documentation

### 13.11.1 Specification

- **Format:** OpenAPI 3.1 (YAML)
- **Location:** `/docs/openapi.yaml` (served at `/api/docs`)
- **UI:** Swagger UI at `/api/docs`, Redoc at `/api/redoc`
- **Generation:** Auto-generated from code annotations (FastAPI) + manual overrides

### 13.11.2 Code Generation

```bash
# Generate TypeScript client
npm run api:generate

# Output: shared/api/generated/
# - client.ts (TanStack Query hooks)
# - types.ts (Zod schemas + TypeScript types)
# - schemas.ts (raw OpenAPI schemas)
```

---

## 13.12 Integration Patterns

### 13.12.1 Third-Party Webhooks

```http
POST /api/v1/webhooks
{
  "url": "https://club-system.com/volley/webhook",
  "events": ["match.started", "match.ended", "player.milestone"],
  "secret": "whsec_abc123"
}
```

**Payload:**

```json
{
  "event": "match.ended",
  "timestamp": "2026-07-15T16:45:00Z",
  "payload": { "match_id": 1001, "winner_team_id": 12, "final_score": "3-1" },
  "signature": "sha256=abc123..."
}
```

### 13.12.2 SDK Availability

| Language | Package | Status |
|----------|---------|--------|
| **TypeScript** | `@volleyplatform/sdk` | ✅ Primary |
| **Python** | `volleyplatform-python` | 🔄 Planned |
| **Go** | `github.com/volleyplatform/go-sdk` | 🔄 Planned |

---

## 13.13 Error Code Registry

| Code | HTTP | Description | Resolution |
|------|------|-------------|------------|
| `VALIDATION_ERROR` | 400 | Request body invalid | Check `details` array |
| `UNAUTHORIZED` | 401 | Token missing/expired | Re-authenticate |
| `FORBIDDEN` | 403 | Insufficient role/permission | Contact admin |
| `NOT_FOUND` | 404 | Resource doesn't exist | Verify ID |
| `CONFLICT` | 409 | Duplicate/state conflict | Check unique constraints |
| `UNPROCESSABLE` | 422 | Semantic validation failed | Check business rules |
| `RATE_LIMITED` | 429 | Too many requests | Wait, retry with backoff |
| `SERVER_ERROR` | 500 | Unexpected error | Retry, contact support |
| `SERVICE_UNAVAILABLE` | 503 | Maintenance mode | Wait for maintenance end |

---

## 13.14 API Deliverables

| Deliverable | Description |
|-------------|-------------|
| **OpenAPI Spec** | Complete, versioned, hosted at `/api/docs` |
| **TypeScript Client** | Generated TanStack Query hooks + Zod schemas |
| **Postman Collection** | Ready-to-use for testing |
| **Webhook Docs** | Event catalog, signatures, retry policy |
| **Rate Limit Policy** | Documented per tier |
| **Changelog** | Semantic versioning, breaking change notices |
| **SDK** | TypeScript SDK with full type safety |

---

**END OF CHAPTER 13**

---

# CHAPTER 14: DEVOPS, INFRASTRUCTURE & CLOUD DEPLOYMENT ARCHITECTURE

---

## 14.1 Vision

The DevOps, Infrastructure & Cloud Deployment Architecture ensures the Volleyball Analytics Platform can be reliably deployed, operated, and scaled from single-club installations to national federation deployments. It transforms the architectural blueprint into runnable, observable, and maintainable production systems.

**Core Principles:**

| Principle | Implementation |
|-----------|----------------|
| **Infrastructure as Code** | All infrastructure defined in Git, deployed via CI/CD |
| **Immutable Deployments** | Containers built once, promoted through environments |
| **Observability First** | Metrics, logs, traces baked into every service |
| **Security by Default** | Least privilege, encryption, secrets management |
| **Automated Recovery** | Self-healing, auto-scaling, chaos engineering |
| **GPU-Native** | First-class support for AI inference workloads |

---

## 14.2 Target Environments

| Environment | Purpose | Infrastructure | Data |
|-------------|---------|----------------|------|
| **Development** | Local development | Docker Compose (laptop) | Synthetic / subset |
| **CI/CD** | Automated testing | Ephemeral Kubernetes (GitHub Actions) | Test fixtures |
| **Staging** | Pre-production validation | Single-node K8s (cloud VM) | Anonymized production subset |
| **Production** | Live traffic | Multi-node K8s (managed) | Real data |
| **Disaster Recovery** | Failover | Standby cluster (different region) | Replicated |

---

## 14.3 Container Strategy

### 14.3.1 Base Images

| Service Type | Base Image | Size Target | Security |
|--------------|------------|-------------|----------|
| **Python (API, AI)** | `python:3.11-slim` | < 200 MB | Non-root, distroless where possible |
| **Node (Frontend build)** | `node:20-alpine` | < 100 MB | Multi-stage build |
| **Nginx (Frontend serve)** | `nginx:alpine` | < 25 MB | Read-only rootfs |
| **PostgreSQL** | `postgres:16-alpine` | — | Official image |
| **Redis** | `redis:7-alpine` | — | Official image |
| **MinIO** | `minio/minio:latest` | — | Official image |

### 14.3.2 Multi-Stage Build Pattern

```dockerfile
# Example: AI Inference Service
FROM python:3.11-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

FROM python:3.11-slim AS runtime
WORKDIR /app
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH
COPY . .
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser
EXPOSE 8000
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 14.3.3 Image Scanning & Signing

| Stage | Tool | Action |
|-------|------|--------|
| **Build** | Trivy / Grype | Scan for CVEs, fail on HIGH/CRITICAL |
| **Registry Push** | Cosign | Sign image with keyless signing |
| **Deploy** | Kyverno / Admission Controller | Verify signature, block unsigned |

---

## 14.4 Kubernetes Architecture

### 14.4.1 Cluster Topology

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        MANAGED KUBERNETES CLUSTER (EKS/GKE/AKS)             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │  SYSTEM NODES   │  │  GENERAL NODES  │  │   GPU NODES     │             │
│  │  (t3.medium)    │  │  (t3.large)     │  │  (g5.xlarge/    │             │
│  │  ─────────────  │  │  ─────────────  │  │   g5.2xlarge)   │             │
│  │ • API Gateway   │  │ • Auth Service  │  │  ─────────────  │             │
│  │ • DNS/Ingress   │  │ • User Service  │  │ • AI Inference  │             │
│  │ • Cert Manager  │  │ • Org Service   │  │ • Video Proc    │             │
│  │ • Monitoring    │  │ • Competition   │  │ • Training Jobs │             │
│  │ • Logging       │  │ • Statistics    │  │                 │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    MANAGED SERVICES (Cloud Provider)                │   │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐           │   │
│  │  │ PostgreSQL│ │   Redis   │ │   MinIO   │ │  Object   │           │   │
│  │  │ (RDS/     │ │ (Elasti-  │ │  (S3/     │ │  Storage  │           │   │
│  │  │ CloudSQL) │ │  Cache)   │ │  MinIO)   │ │           │           │   │
│  │  └───────────┘ └───────────┘ └───────────┘ └───────────┘           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 14.4.2 Node Groups & Taints

| Node Group | Instance Type | Taints | Labels | Purpose |
|------------|---------------|--------|--------|---------|
| `system` | t3.medium | — | `workload=system` | Platform services |
| `general` | t3.large | — | `workload=general` | API, business logic |
| `gpu-inference` | g5.xlarge | `nvidia.com/gpu=present:NoSchedule` | `workload=ai-inference` | Real-time inference |
| `gpu-training` | g5.2xlarge | `nvidia.com/gpu=present:NoSchedule` | `workload=ai-training` | Batch training |
| `video-processing` | c5.2xlarge | — | `workload=video` | Transcoding, extraction |

---

## 14.5 Namespace Strategy

```yaml
# Namespace per environment + logical separation
namespaces:
  - name: platform-system      # Ingress, cert-manager, monitoring, logging
  - name: platform-data        # PostgreSQL, Redis, MinIO (if self-hosted)
  - name: ai-platform          # AI inference, training jobs, model registry
  - name: video-platform       # Video ingestion, processing, storage
  - name: application-dev      # Dev environment apps
  - name: application-staging  # Staging environment apps
  - name: application-prod     # Production apps
  - name: monitoring           # Prometheus, Grafana, Alertmanager
  - name: logging              # Loki, Promtail, Grafana
  - name: ci-cd                # GitHub Actions runners, ArgoCD
```

---

## 14.6 GitOps Deployment (ArgoCD)

### 14.6.1 Repository Structure

```
infra/
├── apps/                          # ArgoCD Application definitions
│   ├── platform-system.yaml
│   ├── platform-data.yaml
│   ├── ai-platform.yaml
│   ├── video-platform.yaml
│   ├── application-dev.yaml
│   ├── application-staging.yaml
│   └── application-prod.yaml
│
├── clusters/
│   ├── dev/
│   ├── staging/
│   └── prod/
│
├── components/                    # Reusable Kustomize components
│   ├── ingress-nginx/
│   ├── cert-manager/
│   ├── prometheus-stack/
│   ├── loki-stack/
│   ├── postgresql/
│   ├── redis/
│   ├── minio/
│   └── nvidia-gpu-operator/
│
└── apps/                          # Application manifests (kustomize)
    ├── auth-service/
    ├── player-service/
    ├── competition-service/
    ├── statistics-service/
    ├── ai-inference-service/
    ├── video-service/
    ├── frontend-admin/
    ├── frontend-coach/
    └── frontend-analyst/
```

### 14.6.2 ArgoCD Application Example

```yaml
# apps/application-prod.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: volley-platform-prod
  namespace: argocd
  finalizers:
    - resources-finalizer.argocd.argoproj.io
spec:
  project: production
  source:
    repoURL: https://github.com/volleyplatform/infra.git
    targetRevision: main
    path: clusters/prod
  destination:
    server: https://kubernetes.default.svc
    namespace: application-prod
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
      allowEmpty: false
    syncOptions:
      - CreateNamespace=true
      - PrunePropagationPolicy=foreground
      - PruneLast=true
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
```

---

## 14.7 CI/CD Pipeline (GitHub Actions)

### 14.7.1 Pipeline Stages

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  # Stage 1: Code Quality
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - uses: actions/setup-python@v5
        with: { python-version: '3.11', cache: 'pip' }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test:unit
      - run: npm run test:a11y
      - run: pip install -r requirements.txt
      - run: pip install -r requirements-dev.txt
      - run: python -m pytest tests/unit -v
      - run: python -m mypy src/

  # Stage 2: Build & Scan
  build-and-scan:
    needs: lint-and-test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker images
        run: |
          docker build -t ghcr.io/volleyplatform/auth-service:${{ github.sha }} ./services/auth-service
          docker build -t ghcr.io/volleyplatform/ai-inference:${{ github.sha }} ./services/ai-inference
      - name: Scan images
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'ghcr.io/volleyplatform/*:${{ github.sha }}'
          severity: 'HIGH,CRITICAL'
          exit-code: '1'
      - name: Sign images
        uses: sigstore/cosign-installer@v3
      - run: cosign sign --yes ghcr.io/volleyplatform/*:${{ github.sha }}
      - name: Push to registry
        run: |
          docker push ghcr.io/volleyplatform/auth-service:${{ github.sha }}
          docker push ghcr.io/volleyplatform/ai-inference:${{ github.sha }}

  # Stage 3: Deploy to Staging
  deploy-staging:
    needs: build-and-scan
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - name: Update image tags in staging kustomization
        run: |
          cd infra/clusters/staging
          kustomize edit set image ghcr.io/volleyplatform/auth-service=ghcr.io/volleyplatform/auth-service:${{ github.sha }}
          kustomize edit set image ghcr.io/volleyplatform/ai-inference=ghcr.io/volleyplatform/ai-inference:${{ github.sha }}
          git config user.name "github-actions"
          git config user.email "actions@github.com"
          git commit -am "Update images to ${{ github.sha }}"
          git push

  # Stage 4: Deploy to Production
  deploy-production:
    needs: build-and-scan
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - name: Update image tags in production kustomization
        run: |
          cd infra/clusters/prod
          kustomize edit set image ghcr.io/volleyplatform/auth-service=ghcr.io/volleyplatform/auth-service:${{ github.sha }}
          kustomize edit set image ghcr.io/volleyplatform/ai-inference=ghcr.io/volleyplatform/ai-inference:${{ github.sha }}
          git config user.name "github-actions"
          git config user.email "actions@github.com"
          git commit -am "Release ${{ github.sha }}"
          git push
```

### 14.7.2 Promotion Strategy

| Trigger | Source Branch | Target Environment | Approval |
|---------|---------------|-------------------|----------|
| Push | `develop` | Staging | Automatic |
| Push | `main` | Production | Manual (GitHub Environment) |
| Tag `v*` | `v*` | Production | Manual + Changelog |

---

## 14.8 Infrastructure as Code (Terraform)

### 14.8.1 Module Structure

```
infra/terraform/
├── modules/
│   ├── vpc/
│   ├── eks/
│   ├── rds-postgresql/
│   ├── elasticache-redis/
│   ├── s3-minio/
│   ├── cloudfront/
│   ├── route53/
│   ├── acm/
│   ├── iam-roles/
│   ├── kms/
│   └── cloudwatch/
│
├── environments/
│   ├── dev/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── terraform.tfvars
│   ├── staging/
│   │   ├── main.tf
│   ├── prod/
│       ├── main.tf
│
└── backend.tf                    # S3 backend + DynamoDB locking
```

### 14.8.2 Example: EKS Module

```hcl
# modules/eks/main.tf
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 19.0"

  cluster_name    = var.cluster_name
  cluster_version = "1.28"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  eks_managed_node_groups = {
    system = {
      name           = "system"
      instance_types = ["t3.medium"]
      capacity_type  = "ON_DEMAND"
      min_size       = 2
      max_size       = 4
      desired_size   = 2
      labels = {
        workload = "system"
      }
      taints = []
    }
    general = {
      name           = "general"
      instance_types = ["t3.large"]
      capacity_type  = "ON_DEMAND"
      min_size       = 2
      max_size       = 10
      desired_size   = 3
      labels = {
        workload = "general"
      }
    }
    gpu_inference = {
      name           = "gpu-inference"
      instance_types = ["g5.xlarge"]
      capacity_type  = "ON_DEMAND"
      min_size       = 0
      max_size       = 8
      desired_size   = 1
      labels = {
        workload = "ai-inference"
      }
      taints = [{
        key    = "nvidia.com/gpu"
        value  = "present"
        effect = "NO_SCHEDULE"
      }]
    }
  }

  enable_irsa = true
}
```

---

## 14.9 Secrets Management

### 14.9.1 Strategy

| Secret Type | Storage | Rotation | Access |
|-------------|---------|----------|--------|
| **Database Credentials** | AWS Secrets Manager / Vault | 90 days | IRSA / Service Account |
| **API Keys (External)** | AWS Secrets Manager | Manual | IRSA |
| **JWT Signing Keys** | AWS KMS + Secrets Manager | 365 days | Service Account |
| **TLS Certificates** | cert-manager (Let's Encrypt) | Auto (90 days) | cert-manager |
| **Docker Registry Creds** | Kubernetes Secret (IRSA) | — | Service Account |
| **MLflow/MLOps Tokens** | Vault | 30 days | Service Account |

### 14.9.2 External Secrets Operator

```yaml
# Kubernetes ExternalSecret example
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: postgres-credentials
  namespace: platform-data
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: aws-secrets-manager
    kind: ClusterSecretStore
  target:
    name: postgres-credentials
    creationPolicy: Owner
  data:
    - secretKey: username
      remoteRef:
        key: prod/postgres
        property: username
    - secretKey: password
      remoteRef:
        key: prod/postgres
        property: password
```

---

## 14.10 Monitoring & Observability Stack

### 14.10.1 Prometheus + Grafana (kube-prometheus-stack)

| Component | Purpose | Retention |
|-----------|---------|-----------|
| **Prometheus** | Metrics collection | 15d (local), 13m (Thanos) |
| **Alertmanager** | Alert routing, deduplication | — |
| **Grafana** | Dashboards, alerting UI | — |
| **Node Exporter** | Host metrics | 15d |
| **Kube State Metrics** | Kubernetes object metrics | 15d |
| **DCGM Exporter** | GPU metrics (DCGM) | 15d |

### 14.10.2 Key Dashboards

| Dashboard | Key Panels |
|-----------|------------|
| **Cluster Overview** | CPU, Memory, Pods, Nodes, GPU Utilization |
| **API Gateway** | RPS, Latency (p50/p95/p99), Error Rate, Saturation |
| **AI Inference** | Queue Depth, Inference Latency, GPU Mem/Util, Batch Size |
| **Video Pipeline** | Ingest FPS, Processing Latency, Queue Length, Storage |
| **Database** | Connections, Query Latency, Cache Hit Ratio, Replication Lag |
| **Business** | Active Matches, Events/sec, Stat Updates/sec, Report Generation |

### 14.10.3 Critical Alerts

| Alert | Condition | Severity | Runbook |
|-------|-----------|----------|---------|
| `APIHighLatency` | p99 > 2s for 5m | Critical | Scale API, check DB |
| `AIInferenceDown` | No frames processed 2m | Critical | Restart GPU pods, check queue |
| `GPUMemoryHigh` | > 90% for 10m | Warning | Scale GPU nodes, reduce batch |
| `CameraDisconnected` | No frames 30s | Warning | Check camera, network |
| `DiskSpaceLow` | < 10% free | Critical | Cleanup, expand volume |
| `PostgreSQLReplicationLag` | > 30s | Warning | Check replica, network |
| `CertificateExpiring` | < 14 days | Warning | Verify cert-manager |

---

## 14.11 Logging Stack (Loki + Promtail + Grafana)

### 14.11.1 Log Flow

```
Application (stdout) → Promtail (DaemonSet) → Loki → Grafana
                              │
                              └── Labels: namespace, pod, container, app, match_id
```

### 14.11.2 Log Labels (Structured)

```json
{
  "timestamp": "2026-07-15T14:32:17.420Z",
  "level": "INFO",
  "service": "ai-inference",
  "trace_id": "abc123",
  "span_id": "def456",
  "match_id": "1001",
  "rally_number": 18,
  "event_type": "KILL",
  "player_id": 108,
  "confidence": 0.96,
  "inference_time_ms": 28,
  "message": "Event validated: KILL by player 108"
}
```

### 14.11.3 Retention

| Log Type | Retention | Storage |
|----------|-----------|---------|
| **Application** | 30 days | Loki (local) |
| **Audit** | 7 years | Loki + S3 archive |
| **AI Inference** | 90 days | Loki + S3 archive |
| **Access/NGINX** | 90 days | Loki |

---

## 14.12 Distributed Tracing (Tempo + OpenTelemetry)

### 14.12.1 Trace Context Propagation

```
Client → API Gateway → Auth Service → Competition Service → AI Inference
              │                │                  │                  │
              └────────────────┴──────────────────┴──────────────────┘
                                    │
                          Trace Context (W3C)
                          traceparent: 00-abc123-def456-01
```

### 14.12.2 Key Spans

| Span | Service | Attributes |
|------|---------|------------|
| `HTTP GET /matches/1001` | API Gateway | match_id, user_id, org_id |
| `Validate JWT` | Auth Service | user_id, roles, permissions |
| `Get Match State` | Competition | match_id, set, rally |
| `AI Inference` | AI Inference | model_version, batch_size, gpu_time_ms |
| `Validate Event` | Domain Engine | event_type, confidence, outcome |
| `Update Statistics` | Statistics | player_id, delta_kills, delta_attempts |
| `Persist Event` | Event Processor | event_id, correlation_id |
| `WebSocket Push` | API Gateway | channel, subscriber_count |

---

## 14.13 Backup & Disaster Recovery

### 14.13.1 Backup Strategy

| Component | Method | Frequency | Retention | RPO | RTO |
|-----------|--------|-----------|-----------|-----|-----|
| **PostgreSQL** | pgBackRest (S3) | Continuous (WAL) + Daily base | 30d daily, 12m monthly | < 1 min | < 30 min |
| **Redis** | RDB + AOF to S3 | Every 6h | 7d | 6h | 15 min |
| **MinIO** | Cross-region replication | Continuous | 90d | 0 | < 1h |
| **Kubernetes Etcd** | Velero | Daily | 30d | 24h | 2h |
| **MLflow/Model Registry** | S3 versioning | Continuous | Permanent | 0 | < 1h |

### 14.13.2 DR Architecture

```
┌─────────────────────┐         ┌─────────────────────┐
│   PRIMARY REGION    │         │   DR REGION         │
│  (us-east-1)        │  Async  │  (us-west-2)        │
│                     │  Repl   │                     │
│ ┌─────────────────┐ │         │ ┌─────────────────┐ │
│ │ EKS Cluster     │ │────────►│ │ EKS Cluster     │ │
│ │ (Active)        │ │         │ │ (Standby)       │ │
│ └─────────────────┘ │         │ └─────────────────┘ │
│ ┌─────────────────┐ │         │ ┌─────────────────┐ │
│ │ RDS (Primary)   │ │────────►│ │ RDS (Read Rep)  │ │
│ └─────────────────┘ │         │ └─────────────────┘ │
│ ┌─────────────────┐ │         │ ┌─────────────────┐ │
│ │ ElastiCache     │ │────────►│ │ ElastiCache     │ │
│ │ (Primary)       │ │         │ │ (Replica)       │ │
│ └─────────────────┘ │         │ └─────────────────┘ │
│ ┌─────────────────┐ │         │ ┌─────────────────┐ │
│ │ S3 (Primary)    │ │────────►│ │ S3 (Replica)    │ │
│ └─────────────────┘ │         │ └─────────────────┘ │
└─────────────────────┘         └─────────────────────┘
```

### 14.13.3 Failover Procedure

| Step | Action | Automation |
|------|--------|------------|
| 1 | Detect primary region failure (health checks) | Automated (Route 53) |
| 2 | Promote RDS read replica to primary | Manual (5 min) |
| 2 | Promote ElastiCache replica | Manual (2 min) |
| 3 | Update DNS to DR region ALB | Automated (Route 53 failover) |
| 4 | Scale up DR EKS node groups | Automated (Cluster Autoscaler) |
| 5 | Verify application health | Automated (ArgoCD sync) |
| 6 | Notify stakeholders | Automated (PagerDuty/Slack) |

**RTO Target:** < 15 minutes  
**RPO Target:** < 1 minute (PostgreSQL), 0 (S3/MinIO)

---

## 14.14 Security Hardening

### 14.14.1 Network Policies

```yaml
# Example: Deny all ingress by default, allow specific
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: ai-inference-ingress
  namespace: ai-platform
spec:
  podSelector:
    matchLabels:
      app: ai-inference
  policyTypes:
    - Ingress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              name: application-prod
        - podSelector:
            matchLabels:
              app: statistics-service
      ports:
        - protocol: TCP
          port: 8000
```

### 14.14.2 Pod Security Standards

```yaml
# Restricted PSA profile for production namespaces
apiVersion: v1
kind: Namespace
metadata:
  name: application-prod
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
```

### 14.14.3 Image Security

| Control | Implementation |
|---------|----------------|
| **Admission Control** | Kyverno: verify cosign signature, block latest tag |
| **Runtime Security** | Falco: detect anomalous syscalls, file access, network |
| **Vulnerability Scan** | Trivy in CI, scheduled cluster scan weekly |
| **SBOM** | Syft generates SPDX/JSON on build, stored in registry |

---

## 14.15 Cost Optimization

| Strategy | Implementation | Savings |
|----------|----------------|---------|
| **Spot Instances** | GPU training nodes (90% discount) | 70% |
| **Right-Sizing** | VPA recommendations, monthly review | 20-30% |
| **Scale to Zero** | KEDA for batch workloads (training, reports) | 50% off-peak |
| **GPU Sharing** | NVIDIA MPS / MIG for inference | 2-4x density |
| **Storage Tiering** | S3 IA/Glacier for clips > 90d | 60% |
| **Reserved Instances** | System nodes, RDS (1-3yr) | 30-40% |

---

## 14.16 Scaling Strategy

### 14.16.1 Horizontal Pod Autoscaler (HPA)

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

### 14.16.2 Cluster Autoscaler

| Node Group | Min | Max | Scale-Up Trigger | Scale-Down Delay |
|------------|-----|-----|------------------|------------------|
| `general` | 2 | 20 | Pod unschedulable 30s | 10 min |
| `gpu-inference` | 1 | 10 | GPU pod pending 60s | 15 min |
| `gpu-training` | 0 | 4 | Training job queued 5m | 30 min |
| `video-processing` | 1 | 6 | Queue depth > 10 | 10 min |

---

## 14.17 Compliance & Governance

| Requirement | Implementation |
|-------------|----------------|
| **SOC 2 Type II** | Audit logs, access controls, encryption, monitoring |
| **GDPR** | Data subject API, right to erasure, DPA, DPIA |
| **Data Residency** | Region-locked deployments, no cross-region replication without consent |
| **ISO 27001** | ISMS aligned, risk register, asset inventory |
| **PCI DSS** | Not applicable (no payment processing) |

---

## 14.18 Operational Runbooks

| Runbook | Trigger | Key Steps |
|---------|---------|-----------|
| **Match Day Checklist** | Pre-match | Camera health, GPU capacity, DB connections, alert silence |
| **GPU OOM Recovery** | `AIInferenceDown` alert | 1. Check logs 2. Restart pods 3. Reduce batch size 4. Scale up |
| **Camera Failover** | `CameraDisconnected` alert | 1. Verify network 2. Restart stream 3. Alert coach 4. Log incident |
| **Database Failover** | `PostgreSQLReplicationLag` critical | 1. Verify replica health 2. Promote 2. Update DNS 3. Verify app |
| **Model Rollback** | Regression detected in canary | 1. ArgoCD rollback 2. Verify metrics 3. Notify ML team |
| **Storage Cleanup** | `DiskSpaceLow` warning | 1. Delete temp files 2. Archive old clips 3. Expand volume |

---

## 14.19 DevOps Deliverables Summary

| Deliverable | Description |
|-------------|-------------|
| **Terraform Modules** | VPC, EKS, RDS, ElastiCache, S3, IAM, KMS |
| **Kubernetes Manifests** | Base + overlays (dev/staging/prod) via Kustomize |
| **ArgoCD Applications** | Full GitOps deployment definitions |
| **Helm Charts** | Platform services (Prometheus, Loki, Cert-Manager, etc.) |
| **CI/CD Pipelines** | GitHub Actions: lint → test → build → scan → sign → deploy |
| **Monitoring Stack** | Prometheus, Grafana, Alertmanager, Loki, Tempo |
| **Runbooks** | 15+ operational procedures |
| **Disaster Recovery** | Documented, tested quarterly |
| **Cost Dashboard** | Per-environment, per-service, per-team |
| **Security Baselines** | Kyverno policies, Falco rules, Trivy scans |

---

**END OF CHAPTER 14**

**END OF VOLUME 1**

---

# CHAPTER 15: ARCHITECTURE SUMMARY & IMPLEMENTATION ROADMAP

---

## 15.1 Vision

The Volleyball Analytics Platform is designed as a scalable, modular, AI-powered software ecosystem that combines computer vision, event-driven processing, cloud-native deployment, and modern web technologies to automate volleyball performance analysis.

Its architecture supports deployments ranging from individual schools and amateur clubs to national federations and international competitions while remaining adaptable to future technological advances.

**Target Users:**

- Schools and universities
- Volleyball clubs (amateur to professional)
- National federations
- Tournament organizers
- Coaches and assistant coaches
- Performance analysts
- Scouts and recruiters
- Sports researchers

---

## 15.2 Architecture Overview

The complete platform consists of interconnected architectural layers:

```
                     Users
                        │
                        ▼
        Frontend Applications (Web Portal)
                        │
                        ▼
                 API Gateway
                        │
        ┌─────────┬─────────┬─────────┐
        ▼         ▼         ▼
 Authentication  Match    Statistics
    Service      Service    Service
        │
        ▼
   AI Processing Services
        │
        ▼
 Video Intelligence Pipeline
        │
        ▼
 Volleyball Domain Engine
        │
        ▼
 Event Processing Engine
        │
        ▼
 PostgreSQL + Redis + Object Storage
        │
        ▼
 Reports • Dashboards • Analytics
```

---

## 15.3 Key Architectural Principles

| Principle | Description |
|-----------|-------------|
| **Modular Design** | Each subsystem has a clearly defined responsibility and can evolve independently. |
| **Scalability** | The architecture supports increasing numbers of users, matches, cameras, and organizations without fundamental redesign. |
| **AI-First Design** | Artificial intelligence is integrated into the platform's core workflow rather than being treated as an optional feature. |
| **Event-Driven Processing** | Every meaningful volleyball action becomes a structured event that drives statistics, analytics, and reporting. |
| **API-First Development** | Every system interaction occurs through well-defined APIs, enabling independent frontend, backend, AI, and mobile development. |
| **Security by Design** | Security is incorporated throughout authentication, authorization, infrastructure, and data management. |
| **Cloud Readiness** | The architecture supports deployment on-premises, in the cloud, or as a hybrid solution. |

---

## 15.4 Technology Stack Summary

| Layer | Primary Technologies |
|-------|---------------------|
| Frontend | React, TypeScript, Tailwind CSS |
| Backend | Python (FastAPI) or Node.js (Express/NestJS) |
| AI Frameworks | PyTorch, OpenCV, Ultralytics YOLO |
| Tracking | ByteTrack or BoT-SORT |
| Pose Estimation | MediaPipe or RTMPose |
| OCR | PaddleOCR or EasyOCR |
| Database | PostgreSQL |
| Cache | Redis |
| Object Storage | Amazon S3 / Azure Blob / Google Cloud Storage / MinIO |
| API | REST + WebSockets |
| Authentication | JWT + RBAC |
| Containers | Docker |
| Orchestration | Kubernetes |
| CI/CD | GitHub Actions |
| Monitoring | Prometheus + Grafana |

*Alternative technologies may be adopted in future versions if they better satisfy performance, maintainability, or operational requirements.*

---

## 15.5 Implementation Roadmap

The implementation should progress through defined milestones:

### Milestone 1 — Platform Foundation (Weeks 1-6)
- Authentication & authorization
- Database schema & migrations
- User management (CRUD)
- Teams & players management
- Competitions & seasons
- Basic API & admin portal

### Milestone 2 — Match Management (Weeks 7-12)
- Fixture generation & scheduling
- Live scoring & match state machine
- Statistics database & aggregation
- Basic reporting (PDF/CSV)

### Milestone 3 — Computer Vision Core (Weeks 13-20)
- Court detection & calibration
- Player detection (YOLO fine-tuning)
- Ball detection (specialized model)
- Multi-object tracking (ByteTrack/BoT-SORT)
- Camera calibration & multi-camera sync

### Milestone 4 — AI Understanding (Weeks 21-30)
- Pose estimation (MediaPipe/RTMPose)
- Jersey number OCR (PaddleOCR/EasyOCR)
- Volleyball action recognition (LSTM/Transformer)
- Event validation & confidence routing
- Human-in-the-loop review UI

### Milestone 5 — Automatic Statistics & Analytics (Weeks 31-38)
- Event → statistics mapping engine
- Real-time dashboard (WebSocket)
- Heatmaps, zone analysis, player ratings
- Report generation (match, player, team, tournament)
- Leaderboards & trend analysis

### Milestone 6 — Production Deployment (Weeks 39-46)
- Kubernetes infrastructure (Terraform)
- GitOps deployment (ArgoCD)
- Monitoring stack (Prometheus/Grafana/Loki/Tempo)
- CI/CD pipelines (GitHub Actions)
- Security hardening & compliance
- Load testing & DR validation

---

## 15.6 Risk Assessment & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Limited training data | High | High | Collect diverse datasets; synthetic augmentation; transfer learning |
| Fast ball movement | High | High | High-FPS cameras (≥60); motion blur reduction; trajectory interpolation |
| Player occlusion | High | High | Multi-camera fusion; appearance features; Kalman prediction |
| Lighting variation | Medium | High | Dataset diversity; domain randomization; adaptive preprocessing |
| GPU cost/availability | Medium | Medium | Model optimization (ONNX/TensorRT); CPU fallback; spot instances |
| Network interruptions | Medium | Medium | Local buffering; retry with backoff; offline queue |

---

## 15.7 Quality Objectives

| Metric | Target |
|--------|--------|
| Player detection mAP@0.5 | ≥ 95% |
| Ball detection mAP@0.5 | ≥ 90% |
| Tracking ID consistency (MOTA) | ≥ 90% |
| Jersey OCR accuracy (clear view) | ≥ 95% |
| Action recognition accuracy | 85-90% |
| End-to-end latency (frame → event) | < 2 seconds |
| Dashboard update latency | < 2 seconds |
| System uptime (production) | ≥ 99.5% |
| API p99 latency | < 500ms |

---

## 15.8 Expansion Roadmap (Post-Launch)

### AI Features
- Tactical formation analysis
- Automatic highlight generation
- Performance prediction
- Injury risk estimation
- Strategy recommendations

### Platform Features
- Native mobile applications (iOS/Android)
- Public statistics portal
- Coach collaboration tools
- League administration
- Federation dashboards

### Analytics
- Cross-season comparisons
- Opponent scouting reports
- Recruitment analytics
- Team ranking algorithms
- Player development tracking

### Integrations
- Wearable sensors (IMU, heart rate)
- Smart scoreboards
- Live streaming platforms
- Tournament management systems
- Third-party coaching tools

---

## 15.9 Expected Outcomes

When fully implemented, the platform will enable:

- **Real-time AI-assisted match analysis** — events detected and displayed within seconds
- **Automatic player statistics** — zero manual entry for standard volleyball metrics
- **Comprehensive team analytics** — offensive, defensive, serving, rotation efficiency
- **Historical performance analysis** — multi-season trends, player development curves
- **Video-assisted coaching** — click any stat to see synchronized replay
- **Centralized competition management** — fixtures, standings, scheduling
- **Data-driven decision making** — evidence-based lineup, strategy, recruitment

---

## 15.10 Transition to Volume 2

**Volume 1** (this document) defines *what* the platform is and *how* it should be architected.

**Volume 2 — AI Engineering & Computer Vision Implementation** focuses on *how* the AI components will be engineered and implemented.

### Volume 2 Topics:

| Chapter | Focus |
|---------|-------|
| 1 | Dataset Engineering — collection, annotation, versioning, quality gates |
| 2 | Model Architecture — YOLO variants, tracking, pose, OCR, action recognition |
| 3 | Training Pipelines — distributed training, hyperparameter tuning, experiment tracking |
| 4 | Inference Optimization — ONNX, TensorRT, quantization, batching, GPU sharing |
| 5 | Volleyball-Specific CV Algorithms — court geometry, ball physics, action rules |
| 6 | MLOps for Production — model registry, canary deployment, drift detection, retraining triggers |
| 7 | Evaluation & Benchmarking — test sets, metrics, regression testing, A/B testing |

---

## 15.11 Final Architecture Statement

The Volleyball Analytics Platform is designed as a **scalable, modular, AI-powered software ecosystem** that combines computer vision, event-driven processing, cloud-native deployment, and modern web technologies to automate volleyball performance analysis.

Its architecture supports deployments ranging from individual schools and amateur clubs to national federations and international competitions while remaining adaptable to future technological advances.

---

## 15.12 Closing Statement

Volume 1 establishes the architectural foundation upon which every subsequent phase of development will build.

By defining clear architectural boundaries, standardized interfaces, scalable infrastructure, and AI-centered workflows, it minimizes ambiguity during implementation and provides a common reference for software engineers, AI engineers, DevOps engineers, QA teams, and product stakeholders.

The next phase transitions from architecture to implementation, where the theoretical design becomes working software through the development of computer vision models, AI pipelines, backend services, frontend applications, and production deployment.

**Volume 1 Status: COMPLETE**

---

*This document contains 15 chapters and serves as a comprehensive architecture specification for a production-ready AI-powered volleyball analytics platform. It provides a solid foundation for implementation while remaining flexible enough to support future expansion into a commercial SaaS product.*

---

**Next: Volume 2 — AI Engineering & Computer Vision Implementation**
