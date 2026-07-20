# VOLUME 2: AI ENGINEERING & COMPUTER VISION IMPLEMENTATION SPECIFICATION (AECVIS)

**Version:** 1.0  
**Date:** July 15, 2026  
**Status:** Active Development

---

# CHAPTER 16: DATABASE ARCHITECTURE & DATA MODEL

---

## 16.1 Purpose

The Database Architecture provides the persistent storage layer for all operational, analytical, and AI-generated data within the Volleyball Analytics Platform.

Its objectives are to:

- Store all platform data reliably
- Maintain data consistency and integrity
- Support real-time operations
- Enable historical analysis
- Scale to millions of records
- Support AI model development and continuous improvement

---

## 16.2 Database Architecture Overview

The platform adopts a polyglot persistence approach, using different storage technologies according to workload.

```
                         Applications
                              │
                              ▼
                       Backend Services
                              │
────────────────────────────────────────────
      PostgreSQL      Redis      Object Storage
────────────────────────────────────────────
       Structured     Cache     Videos/Files
          Data
```

Each storage system is optimized for a specific purpose.

---

## 16.3 Storage Technologies

| Technology | Primary Purpose |
|------------|----------------|
| **PostgreSQL** | Core relational data (matches, players, stats, users) |
| **Redis** | Live sessions, caching, queues, real-time data |
| **Object Storage** | Match videos, AI datasets, reports, images, models |
| **Future Time-Series DB** | Sensor and telemetry data |

---

## 16.4 Core Database Domains

The database is organized into logical domains:

| Domain | Description |
|--------|-------------|
| **User Management** | Users, roles, permissions, authentication |
| **Organizations** | Clubs, schools, federations, academies |
| **Teams** | Team rosters, staff, branding |
| **Players** | Profiles, attributes, biometrics |
| **Competitions** | Leagues, tournaments, seasons |
| **Matches** | Schedules, lineups, sets, rallies |
| **Video Management** | Uploaded/recorded videos, metadata |
| **AI Processing** | Detections, tracking, pose, actions |
| **Statistics** | Player, team, match, season stats |
| **Analytics** | Ratings, insights, recommendations |
| **Reporting** | Generated reports, exports |
| **System Admin** | Audit logs, config, model registry |

Each domain is modular with clear relationships.

---

## 16.5 Core Entity Relationships

```
Organization
      │
      ▼
Team
      │
      ▼
Player
      │
      ▼
Match Participation
      │
      ▼
Match
      │
      ▼
Events
      │
      ▼
Statistics
      │
      ▼
Analytics
```

This hierarchy forms the backbone of the data model.

---

## 16.6 Organizations

An organization represents a club, school, federation, academy, or league.

### 16.6.1 Attributes

| Field | Type | Constraints |
|-------|------|-------------|
| `organization_id` | UUID | PK |
| `name` | VARCHAR(200) | NOT NULL |
| `type` | ENUM | club, school, federation, academy, league |
| `country` | CHAR(2) | ISO 3166-1 |
| `region` | VARCHAR(100) | |
| `logo_url` | VARCHAR(500) | |
| `contact_email` | VARCHAR(200) | |
| `contact_phone` | VARCHAR(50) | |
| `status` | ENUM | active, inactive, suspended |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() |

### 16.6.2 Relationships

- **1 : N** → Teams
- **1 : N** → Users (members)

---

## 16.7 Teams

### 16.7.1 Attributes

| Field | Type | Constraints |
|-------|------|-------------|
| `team_id` | UUID | PK |
| `organization_id` | UUID | FK → Organization, NOT NULL |
| `name` | VARCHAR(200) | NOT NULL |
| `short_name` | VARCHAR(20) | |
| `gender` | ENUM | men, women, coed |
| `age_category` | VARCHAR(20) | u12, u14, u16, u18, u21, senior |
| `competition_level` | VARCHAR(50) | amateur, semi-pro, professional |
| `logo_url` | VARCHAR(500) | |
| `primary_color` | CHAR(7) | HEX |
| `secondary_color` | CHAR(7) | HEX |
| `coach_id` | UUID | FK → User |
| `assistant_coach_id` | UUID | FK → User |
| `status` | ENUM | active, inactive |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() |

### 16.7.2 Relationships

- **N : 1** → Organization
- **1 : N** → Players
- **1 : N** → Matches (home + away)

---

## 16.8 Players

### 16.8.1 Attributes

| Field | Type | Constraints |
|-------|------|-------------|
| `player_id` | UUID | PK |
| `team_id` | UUID | FK → Team, NOT NULL |
| `jersey_number` | SMALLINT | 0-99, NOT NULL |
| `first_name` | VARCHAR(100) | NOT NULL |
| `last_name` | VARCHAR(100) | NOT NULL |
| `preferred_position` | ENUM | OH, MB, OPP, S, L, DS |
| `height_cm` | SMALLINT | |
| `weight_kg` | SMALLINT | |
| `date_of_birth` | DATE | |
| `nationality` | CHAR(3) | ISO 3166-1 alpha-3 |
| `dominant_hand` | ENUM | left, right |
| `photo_url` | VARCHAR(500) | |
| `is_libero` | BOOLEAN | DEFAULT FALSE |
| `is_captain` | BOOLEAN | DEFAULT FALSE |
| `status` | ENUM | active, inactive, injured, transferred |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() |

### 16.8.2 Unique Constraint

```sql
UNIQUE (team_id, jersey_number)
```

---

## 16.9 Matches

### 16.9.1 Attributes

| Field | Type | Constraints |
|-------|------|-------------|
| `match_id` | UUID | PK |
| `tournament_id` | UUID | FK → Tournament |
| `court_id` | UUID | FK → Court |
| `home_team_id` | UUID | FK → Team, NOT NULL |
| `away_team_id` | UUID | FK → Team, NOT NULL |
| `match_date` | DATE | NOT NULL |
| `start_time` | TIME | |
| `end_time` | TIME | |
| `sets_format` | ENUM | best_of_3, best_of_5 |
| `status` | ENUM | scheduled, live, paused, completed, cancelled |
| `winner_team_id` | UUID | FK → Team |
| `home_sets_won` | SMALLINT | DEFAULT 0 |
| `away_sets_won` | SMALLINT | DEFAULT 0 |
| `video_id` | UUID | FK → Video |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() |

### 16.9.2 Relationships

- **1 : N** → Sets
- **1 : N** → Events
- **1 : N** → Videos
- **1 : N** → Statistics

---

## 16.10 Sets

### 16.10.1 Attributes

| Field | Type | Constraints |
|-------|------|-------------|
| `set_id` | UUID | PK |
| `match_id` | UUID | FK → Match, NOT NULL |
| `set_number` | SMALLINT | 1-5, NOT NULL |
| `home_points` | SMALLINT | DEFAULT 0 |
| `away_points` | SMALLINT | DEFAULT 0 |
| `duration_seconds` | INTEGER | |
| `status` | ENUM | pending, in_progress, completed |
| `winner_team_id` | UUID | FK → Team |

### 16.10.2 Relationships

- **1 : N** → Rallies
- **1 : N** → Lineups

---

## 16.11 Rallies

### 16.11.1 Attributes

| Field | Type | Constraints |
|-------|------|-------------|
| `rally_id` | UUID | PK |
| `match_id` | UUID | FK → Match, NOT NULL |
| `set_id` | UUID | FK → Set, NOT NULL |
| `rally_number` | INTEGER | NOT NULL |
| `serving_team_id` | UUID | FK → Team |
| `receiving_team_id` | UUID | FK → Team |
| `start_timestamp` | TIMESTAMPTZ | NOT NULL |
| `end_timestamp` | TIMESTAMPTZ | |
| `duration_ms` | INTEGER | |
| `winning_team_id` | UUID | FK → Team |
| `point_type` | ENUM | kill, ace, block, opponent_error, service_error |
| `video_start_frame` | INTEGER | |
| `video_end_frame` | INTEGER | |

---

## 16.12 Events

Events are atomic AI-recognized actions.

### 16.12.1 Attributes

| Field | Type | Constraints |
|-------|------|-------------|
| `event_id` | UUID | PK |
| `match_id` | UUID | FK → Match, NOT NULL |
| `set_id` | UUID | FK → Set |
| `rally_id` | UUID | FK → Rally |
| `player_id` | UUID | FK → Player |
| `team_id` | UUID | FK → Team |
| `event_type` | VARCHAR(50) | NOT NULL (serve, spike, kill, block, dig, etc.) |
| `action_subtype` | VARCHAR(50) | (float_serve, jump_serve, etc.) |
| `timestamp` | TIMESTAMPTZ | NOT NULL |
| `frame_number` | INTEGER | |
| `confidence` | REAL | 0.0-1.0 |
| `court_x` | REAL | Meters (court coords) |
| `court_y` | REAL | Meters (court coords) |
| `outcome` | ENUM | point, side_out, error, neutral |
| `metadata` | JSONB | Extensible (speed, height, zone) |

---

## 16.13 Player Statistics

### 16.13.1 Per-Match Statistics

| Field | Type |
|-------|------|
| `stat_id` | UUID PK |
| `player_id` | UUID FK |
| `match_id` | UUID FK |
| `set_id` | UUID FK (nullable) |
| `serves_total` | INT |
| `service_aces` | INT |
| `service_errors` | INT |
| `attack_attempts` | INT |
| `kills` | INT |
| `attack_errors` | INT |
| `blocked_attacks` | INT |
| `solo_blocks` | INT |
| `block_assists` | INT |
| `block_errors` | INT |
| `digs` | INT |
| `saves` | INT |
| `reception_attempts` | INT |
| `perfect_receptions` | INT |
| `positive_receptions` | INT |
| `poor_receptions` | INT |
| `reception_errors` | INT |
| `set_attempts` | INT |
| `assists` | INT |
| `setting_errors` | INT |
| `playing_time_seconds` | REAL |
| `distance_covered_m` | REAL |
| `jump_count` | INT |
| `avg_jump_height_cm` | REAL |
| `max_jump_height_cm` | REAL |
| `created_at` | TIMESTAMPTZ |

### 16.13.2 Career Aggregates (Materialized View)

```sql
CREATE MATERIALIZED VIEW player_career_stats AS
SELECT 
  player_id,
  SUM(kills) AS career_kills,
  SUM(attack_attempts) AS career_attempts,
  AVG(attack_efficiency) AS avg_efficiency,
  -- ... etc
FROM player_match_statistics
GROUP BY player_id;
```

---

## 16.14 Team Statistics

| Field | Type |
|-------|------|
| `team_stat_id` | UUID PK |
| `team_id` | UUID FK |
| `match_id` | UUID FK |
| `total_kills` | INT |
| `total_aces` | INT |
| `total_blocks` | INT (solo + assists) |
| `total_digs` | INT |
| `total_errors` | INT |
| `attack_efficiency` | REAL |
| `serve_efficiency` | REAL |
| `reception_efficiency` | REAL |
| `set_won` | BOOLEAN |

---

## 16.15 Video Management

| Field | Type | Constraints |
|-------|------|-------------|
| `video_id` | UUID | PK |
| `match_id` | UUID | FK → Match |
| `camera_id` | UUID | FK → Camera |
| `file_path` | VARCHAR(500) | Object storage path |
| `file_size_bytes` | BIGINT | |
| `duration_seconds` | REAL | |
| `resolution_width` | INT | |
| `resolution_height` | INT | |
| `fps` | REAL | |
| `codec` | VARCHAR(20) | h264, hevc, etc. |
| `processing_status` | ENUM | pending, processing, completed, failed |
| `uploaded_at` | TIMESTAMPTZ | DEFAULT NOW() |

---

## 16.16 AI Detection Records

Raw object detections per frame.

| Field | Type |
|-------|------|
| `detection_id` | UUID PK |
| `match_id` | UUID FK |
| `frame_number` | INTEGER |
| `timestamp_ms` | BIGINT |
| `object_type` | VARCHAR (player, ball, net, referee) |
| `bbox_x` | REAL (normalized 0-1) |
| `bbox_y` | REAL |
| `bbox_w` | REAL |
| `bbox_h` | REAL |
| `confidence` | REAL |
| `model_version` | VARCHAR |
| `track_id` | UUID (nullable) |

---

## 16.17 Tracking Records

Persistent tracks from ByteTrack/BoT-SORT.

| Field | Type |
|-------|------|
| `track_id` | UUID PK |
| `match_id` | UUID FK |
| `track_id_internal` | INTEGER (ByteTrack ID) |
| `object_type` | VARCHAR (player, ball) |
| `team_assignment` | VARCHAR (home, away, neutral) |
| `frame_start` | INTEGER |
| `frame_end` | INTEGER |
| `positions` | JSONB (array of {frame, x, y, confidence}) |
| `jersey_number` | SMALLINT (nullable) |
| `player_id` | UUID FK (nullable, after OCR) |

---

## 16.18 Pose Estimation Records

| Field | Type |
|-------|------|
| `pose_id` | UUID PK |
| `match_id` | UUID FK |
| `track_id` | UUID FK |
| `frame_number` | INTEGER |
| `keypoints` | JSONB (33 × {x, y, z, visibility, confidence}) |
| `model_version` | VARCHAR |
| `processing_time_ms` | REAL |

---

## 16.19 Action Recognition Records

Primary input for Statistics Engine.

| Field | Type |
|-------|------|
| `action_id` | UUID PK |
| `match_id` | UUID FK |
| `set_id` | UUID FK |
| `rally_id` | UUID FK |
| `player_id` | UUID FK |
| `team_id` | UUID FK |
| `action_type` | VARCHAR (serve, spike, kill, block, dig, etc.) |
| `outcome` | ENUM (point, side_out, error, neutral) |
| `start_frame` | INTEGER |
| `end_frame` | INTEGER |
| `start_timestamp` | TIMESTAMPTZ |
| `end_timestamp` | TIMESTAMPTZ |
| `confidence` | REAL |
| `court_zone` | SMALLINT (1-6) |
| `ball_track_id` | UUID (nullable) |
| `metadata` | JSONB |

---

## 16.20 Analytics Records

Outputs from AI Decision Engine.

| Field | Type |
|-------|------|
| `analysis_id` | UUID PK |
| `match_id` | UUID FK |
| `player_id` | UUID FK (nullable) |
| `team_id` | UUID FK (nullable) |
| `analysis_type` | VARCHAR (rating, prediction, insight, recommendation) |
| `payload` | JSONB |
| `confidence` | REAL |
| `model_version` | VARCHAR |
| `generated_at` | TIMESTAMPTZ |

---

## 16.21 Reports

| Field | Type |
|-------|------|
| `report_id` | UUID PK |
| `match_id` | UUID FK (nullable) |
| `report_type` | ENUM (match, player, team, tournament, season) |
| `format` | ENUM (pdf, csv, xlsx, json) |
| `file_path` | VARCHAR (object storage URI) |
| `file_size_bytes` | BIGINT |
| `generated_by` | UUID FK (User or System) |
| `status` | ENUM (generating, ready, failed) |
| `created_at` | TIMESTAMPTZ |

---

## 16.22 Audit Logs

| Field | Type |
|-------|------|
| `log_id` | UUID PK |
| `user_id` | UUID FK |
| `action` | VARCHAR (create, update, delete, login, etc.) |
| `entity_type` | VARCHAR (match, player, team, etc.) |
| `entity_id` | UUID |
| `details` | JSONB |
| `ip_address` | INET |
| `timestamp` | TIMESTAMPTZ DEFAULT NOW() |

---

## 16.23 Relationship Summary

| Parent | Child | Cardinality |
|--------|-------|-------------|
| Organization | Team | 1 : N |
| Team | Player | 1 : N |
| Match | Set | 1 : N |
| Set | Rally | 1 : N |
| Rally | Event | 1 : N |
| Player | Statistic | 1 : N |
| Match | Video | 1 : N |
| Match | Event | 1 : N |
| Track | Detection | 1 : N |
| PlayerTrack | Pose | 1 : N |

**Foreign keys and referential integrity enforced at DB level.**

---

## 16.24 Indexing Strategy

```sql
-- High-frequency query indexes
CREATE INDEX idx_events_match_timestamp ON events (match_id, timestamp);
CREATE INDEX idx_events_player ON events (player_id);
CREATE INDEX idx_events_type ON events (event_type);
CREATE INDEX idx_tracks_match_track ON tracks (match_id, track_id);
CREATE INDEX idx_detections_match_frame ON detections (match_id, frame_number);
CREATE INDEX idx_player_stats_match ON player_stats (player_id, match_id);
CREATE INDEX idx_team_stats_match ON team_stats (team_id, match_id);
CREATE INDEX idx_videos_match ON videos (match_id);
CREATE INDEX idx_detections_confidence ON detections (confidence);
CREATE INDEX idx_actions_match_rally ON actions (match_id, rally_id);
CREATE INDEX idx_rallies_match ON rallies (match_id, set_id);
CREATE INDEX idx_actions_timestamp ON actions (timestamp);
CREATE INDEX idx_detections_frame ON detections (match_id, frame_number);

-- JSONB indexes for flexible queries
CREATE INDEX idx_action_metadata ON actions USING GIN (metadata);
CREATE INDEX idx_detection_metadata ON detections USING GIN (metadata);
CREATE INDEX idx_analytics_payload ON analytics USING GIN (payload);
```

### 16.24.1 Partitioning Strategy

```sql
-- Partition events by month for performance
CREATE TABLE events (
  ...
) PARTITION BY RANGE (timestamp);

CREATE TABLE events_2026_07 PARTITION OF events
  FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');
```

---

## 16.25 Data Integrity

| Constraint | Enforcement |
|------------|-------------|
| Primary Keys | UUID, NOT NULL |
| Foreign Keys | ON DELETE RESTRICT / CASCADE |
| Unique Constraints | `UNIQUE (team_id, jersey_number)` |
| NOT NULL | Required fields |
| Check Constraints | `jersey_number BETWEEN 0 AND 99` |
| Triggers | Auto-update aggregates on event insert |

---

## 16.26 Data Retention

| Data Type | Retention | Storage Tier |
|-----------|-----------|--------------|
| Match Statistics | Permanent | PostgreSQL |
| Player Career Stats | Permanent | PostgreSQL |
| AI Events (raw) | 5 years | Partitioned PG |
| Action Predictions | Permanent | PostgreSQL |
| Raw Videos | Org policy (1-5 yrs) | Object Storage |
| AI Processing Frames | 30 days | Object Storage |
| Audit Logs | 7 years | PostgreSQL (partitioned) |
| Model Artifacts | Permanent | Object Storage (versioned) |

---

## 16.27 Backup & Recovery

| Component | Method | Frequency | Retention | RPO | RTO |
|-----------|--------|-----------|-----------|-----|-----|
| **PostgreSQL** | pgBackRest (S3) | Continuous WAL + Daily base | 30d daily, 12m monthly | < 1 min | < 30 min |
| **Redis** | RDB + AOF to S3 | Every 6h | 7d | 6h | 15 min |
| **Object Storage** | Cross-region replication | Continuous | 90d | 0 | < 1h |
| **Kubernetes/Etcd** | Velero | Daily | 30d | 24h | 2h |
| **MLflow/Registry** | S3 versioning | Continuous | Permanent | 0 | < 1h |

**DR Architecture:** Active (us-east-1) → Standby (us-west-2) with Route 53 failover.

---

## 16.28 Performance Optimization

| Technique | Application |
|-----------|-------------|
| **Table Partitioning** | `events` by month, `detections` by match |
| **Read Replicas** | Analytics queries offloaded |
| **Materialized Views** | `player_career_stats`, `team_season_stats` |
| **Connection Pooling** | PgBouncer (100-200 connections) |
| **Query Optimization** | `EXPLAIN ANALYZE` on slow queries |
| **Columnar Analytics** | ClickHouse / Apache Iceberg for OLAP |

---

## 16.29 Future Enhancements

| Capability | Description |
|------------|-------------|
| **Multi-Tenant Architecture** | Row-level security for leagues/clubs |
| **Data Warehouse** | ClickHouse / Apache Iceberg for OLAP |
| **Feature Store** | Feast for ML feature serving |
| **Graph Database** | Neo4j for tactical relationships |
| **Data Lake** | Delta Lake / Iceberg for video + AI datasets |
| **Vector Database** | pgvector / Pinecone for embedding search |

---

## 16.30 Chapter Summary

The Database Architecture & Data Model establishes the long-term foundation for the Volleyball Analytics Platform by defining how operational data, AI outputs, statistics, videos, and analytical insights are stored, related, and managed. Through a scalable relational design complemented by specialized storage systems, the platform can efficiently support real-time match processing, historical analysis, and future AI innovation.

This data architecture ensures that every event—from a single serve to years of player performance history—can be stored, queried, analyzed, and reported with accuracy, consistency, and scalability.

---

**END OF CHAPTER 16**

*Next: Chapter 17 — Model Evaluation*