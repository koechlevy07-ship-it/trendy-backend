# VOLUME 3: IMPLEMENTATION BLUEPRINT

**Version:** 1.0  
**Date:** July 15, 2026  
**Status:** Active Development  

---

# CHAPTER 5: DATABASE SCHEMA & ENTITY DESIGN

---

## 5.1 Purpose

This chapter defines the complete database architecture and domain model for the Volleyball Analytics Platform. Every subsequent module—authentication, team management, match processing, AI inference, statistics generation, and reporting—depends on this data model. The schema is designed for:

- **Data integrity** through constraints, foreign keys, and check constraints
- **Query performance** via strategic indexing and partitioning
- **Scalability** via partitioning, read replicas, and connection pooling
- **Extensibility** via JSONB columns for flexible metadata
- **Auditability** via triggers, audit tables, and soft deletes

---

## 5.1 Design Principles

| Principle | Application |
|-----------|-------------|
| **Normalization** | 3NF for core entities; JSONB for flexible attributes |
| **Referential Integrity** | FK constraints on all relationships; CASCADE where appropriate |
| **Soft Deletes** | `deleted_at` timestamp; filtered by default views |
| **Optimistic Locking** | `version` column on mutable entities |
| **Audit Trail** | `created_at`, `updated_at`, `created_by`, `updated_by` on all tables |
| **Partitioning** | Time-based partitioning for high-volume tables (`events`, `statistics`) |

---

## 5.2 Entity Relationship Diagram (Conceptual)

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│ Organization│       │    Team     │       │   Player    │
│─────────────│       │─────────────│       │─────────────│
│ id (PK)     │◄──────│ id (PK)     │◄──────│ id (PK)     │
│ name        │       │ org_id (FK) │       │ team_id (FK)│
│ type        │       │ name        │       │ jersey_num  │
│ country     │       │ short_name  │       │ position    │
│ created_at  │       │ gender      │       │ height_cm   │
└─────────────┘       │ age_category│       │ height_in   │
                      │ logo_url    │       │ weight_kg   │
                      │ is_active   │       │ birth_date  │
                      └─────────────┘       │ nationality │
                                            │ is_libero   │
                                            │ is_captain  │
                                            │ is_active   │
                                            └─────────────┘
                                                  │
                                                  ▼
                                     ┌─────────────────────┐
                                     │  PlayerStatistics   │
                                     │─────────────────────│
                                     │ id (PK)             │
                                     │ player_id (FK)      │
                                     │ match_id (FK)       │
                                     │ set_id (FK)         │
                                     │ team_id (FK)        │
                                     │ kills, errors,      │
                                     │ blocks, digs, etc.  │
                                     └─────────────────────┘
```

---

## 5.2 Core Domain Models

### 5.2.1 Organization (Multi-tenancy Root)

```sql
-- organizations: Multi-tenancy root entity
CREATE TABLE organizations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(200) NOT NULL,
    slug            VARCHAR(100) NOT NULL UNIQUE,
    type            VARCHAR(50) NOT NULL,          -- club, school, federation, league
    country_code    CHAR(2) NOT NULL,              -- ISO 3166-1 alpha-2
    region          VARCHAR(100),                  -- state/province
    city            VARCHAR(100),
    address         TEXT,
    phone           VARCHAR(50),
    email           VARCHAR(255),
    website         VARCHAR(500),
    logo_url        VARCHAR(500),
    primary_color   VARCHAR(7)  DEFAULT '#3B82F6', -- hex color
    secondary_color VARCHAR(7)  DEFAULT '#1E40AF',
    settings        JSONB        DEFAULT '{}',     -- feature flags, branding
    is_active       BOOLEAN       DEFAULT TRUE,
    created_at      TIMESTAMPTZ   DEFAULT NOW(),
    updated_at      TIMESTAMPTZ   DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ   NULL,
    version         INT           DEFAULT 1        -- optimistic locking
);

CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_country ON organizations(country_code);
CREATE INDEX idx_organizations_active ON organizations(is_active) WHERE is_active = TRUE;
```

---

### 5.2.2 Team (Core Competitive Unit)

```sql
CREATE TABLE teams (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id     UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name                VARCHAR(200) NOT NULL,
    short_name          VARCHAR(20) NOT NULL,        -- e.g., "THU", "LAD"
    slug                VARCHAR(50) NOT NULL,        -- URL-friendly
    gender              VARCHAR(10) NOT NULL,        -- 'men', 'women', 'coed', 'mixed'
    age_category        VARCHAR(20) NOT NULL,        -- 'u12', 'u14', 'u16', 'u18', 'u21', 'senior', 'master'
    competition_level   VARCHAR(30) DEFAULT 'amateur', -- 'youth', 'amateur', 'semi_pro', 'professional'
    league_id           UUID REFERENCES leagues(id) ON DELETE SET NULL,
    coach_user_id       UUID REFERENCES users(id) ON DELETE SET NULL,
    assistant_coach_id  UUID REFERENCES users(id) ON DELETE SET NULL,
    captain_player_id   UUID REFERENCES players(id) ON DELETE SET NULL,
    primary_color       VARCHAR(7)  DEFAULT '#3B82F6',   -- hex
    secondary_color     VARCHAR(7)  DEFAULT '#1E40AF',   -- hex
    logo_url            VARCHAR(500),
    founded_year        SMALLINT,
    home_venue_id       UUID REFERENCES venues(id) ON DELETE SET NULL,
    is_active           BOOLEAN DEFAULT TRUE,
    is_national_team    BOOLEAN DEFAULT FALSE,
    metadata            JSONB DEFAULT '{}',
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ,
    version             INT         DEFAULT 1
);

CREATE INDEX idx_teams_org ON teams(organization_id);
CREATE INDEX idx_teams_slug ON teams(slug);
CREATE INDEX idx_teams_active ON teams(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_teams_org_active ON teams(organization_id, is_active);
```

---

### 5.3 Player (Athlete Profile)

```sql
CREATE TABLE players (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id             UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id             UUID REFERENCES users(id) ON DELETE SET NULL,  -- linked auth account
    
    -- Identity
    first_name          VARCHAR(100) NOT NULL,
    last_name           VARCHAR(100) NOT NULL,
    full_name           GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
    date_of_birth       DATE,
    gender              VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    nationality         VARCHAR(3),                    -- ISO 3166-1 alpha-3
    
    -- Physical attributes
    height_cm           SMALLINT CHECK (height_cm BETWEEN 100 AND 250),
    weight_kg           NUMERIC(5,1) CHECK (weight_kg BETWEEN 30 AND 200),
    dominant_hand       VARCHAR(10) CHECK (dominant_hand IN ('left', 'right', 'ambidextrous')),
    
    -- Volleyball-specific
    jersey_number       SMALLINT NOT NULL CHECK (jersey_number BETWEEN 0 AND 99),
    position            VARCHAR(2) CHECK (position IN ('OH','MB','OP','S','L','DS')), -- OH, MB, OPP, S, L, DS
    is_libero           BOOLEAN DEFAULT FALSE,
    is_captain          BOOLEAN DEFAULT FALSE,
    is_captain_alt      BOOLEAN DEFAULT FALSE,
    
    -- Physical measurements
    height_cm           SMALLINT CHECK (height_cm BETWEEN 100 AND 250),
    weight_kg           NUMERIC(5,2) CHECK (weight_kg BETWEEN 30 AND 150),
    spike_height_cm     SMALLINT,     -- spike reach
    block_height_cm     SMALLINT,     -- block reach
    vertical_jump_cm    SMALLINT,
    
    -- Status
    is_active           BOOLEAN DEFAULT TRUE,
    is_libero           BOOLEAN DEFAULT FALSE,
    is_captain          BOOLEAN DEFAULT FALSE,
    is_injured          BOOLEAN DEFAULT FALSE,
    injury_notes        TEXT,
    status              VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'injured', 'suspended', 'transferred', 'retired')),
    
    -- Biographical
    date_of_birth       DATE,
    nationality         VARCHAR(3),           -- ISO 3166-1 alpha-3
    birth_city          VARCHAR(100),
    birth_country       VARCHAR(3),
    dominant_hand       VARCHAR(10) CHECK (dominant_hand IN ('left', 'right', 'ambidextrous')),
    
    -- Media
    photo_url           VARCHAR(500),
    bio                 TEXT,
    
    -- System
    is_active           BOOLEAN DEFAULT TRUE,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ,
    version             INT DEFAULT 1,
    
    CONSTRAINT uq_team_jersey UNIQUE (team_id, jersey_number),
    CONSTRAINT valid_jersey CHECK (jersey_number BETWEEN 0 AND 99)
);

CREATE INDEX idx_players_team ON players(team_id);
CREATE INDEX idx_players_active ON players(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_players_name ON players(last_name, first_name);
CREATE INDEX idx_players_dob ON players(date_of_birth);
```

---

## 5.4 Match & Competition Models

### 5.3.1 Competition Hierarchy

```sql
-- League/Competition container
CREATE TABLE leagues (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name            VARCHAR(200) NOT NULL,
    slug            VARCHAR(100) NOT NULL,
    season_name     VARCHAR(100) NOT NULL,           -- e.g., "2024-2025 Season"
    season_start    DATE NOT NULL,
    season_end      DATE NOT NULL,
    format          VARCHAR(50) DEFAULT 'round_robin', -- 'round_robin', 'knockout', 'swiss', 'pool_play'
    gender          VARCHAR(10),                     -- 'men', 'women', 'mixed'
    age_category    VARCHAR(20),                     -- u12, u18, senior, etc.
    level           VARCHAR(30),                     -- 'local', 'regional', 'national', 'international'
    max_teams       SMALLINT DEFAULT 16,
    promotion_spots SMALLINT DEFAULT 0,
    relegation_spots SMALLINT DEFAULT 0,
    rules_json      JSONB DEFAULT '{}',              -- tiebreakers, scoring, etc.
    status          VARCHAR(30) DEFAULT 'draft',     -- draft, registration, active, completed, cancelled
    start_date      DATE,
    end_date        DATE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Team participation in a league season
CREATE TABLE league_teams (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    league_id       UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
    team_id         UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    seed            SMALLINT,                        -- seeding for playoffs
    group_name      VARCHAR(50),                     -- pool/group name
    seed_number     SMALLINT,                        -- seeding for bracket
    status          VARCHAR(20) DEFAULT 'registered', -- invited, confirmed, withdrawn
    joined_at       TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (league_id, team_id)
);

CREATE INDEX idx_league_teams_league ON league_teams(league_id);
CREATE INDEX idx_league_teams_team ON league_teams(team_id);
```

### 5.4.2 Match & Set Structure

```sql
-- Core match entity
CREATE TABLE matches (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    league_id           UUID REFERENCES leagues(id) ON DELETE CASCADE,
    tournament_id       UUID REFERENCES tournaments(id) ON DELETE SET NULL,
    season_id           UUID REFERENCES seasons(id) ON DELETE SET NULL,
    round_id            UUID REFERENCES rounds(id) ON DELETE SET NULL,
    
    -- Teams
    home_team_id        UUID NOT NULL REFERENCES teams(id),
    away_team_id        UUID NOT NULL REFERENCES teams(id),
    
    -- Schedule
    scheduled_at        TIMESTAMPTZ NOT NULL,
    actual_start_at     TIMESTAMPTZ,
    actual_end_at       TIMESTAMPTZ,
    estimated_duration_minutes SMALLINT DEFAULT 90,
    
    -- Venue
    venue_id            UUID REFERENCES venues(id) ON DELETE SET NULL,
    court_number        SMALLINT DEFAULT 1,
    
    -- Format
    match_format        VARCHAR(20) DEFAULT 'best_of_5',  -- best_of_3, best_of_5, best_of_3
    sets_to_win         SMALLINT DEFAULT 3,                -- sets needed to win match
    points_per_set      SMALLINT DEFAULT 25,
    final_set_points    SMALLINT DEFAULT 15,
    
    -- Status & Timing
    status              VARCHAR(30) DEFAULT 'scheduled' CHECK (status IN (
        'scheduled', 'warmup', 'live', 'paused', 'interval', 'completed', 'cancelled', 'postponed', 'forfeited'
    )),
    scheduled_at        TIMESTAMPTZ NOT NULL,
    started_at          TIMESTAMPTZ,
    ended_at            TIMESTAMPTZ,
    duration_seconds    INTEGER DEFAULT 0,
    
    -- Score
    home_score          SMALLINT DEFAULT 0,
    away_score          SMALLINT DEFAULT 0,
    sets_won_home       SMALLINT DEFAULT 0,
    sets_won_away       SMALLINT DEFAULT 0,
    
    -- Officials
    referee_1_id        UUID REFERENCES users(id),
    referee_2_id        UUID REFERENCES users(id),
    scorer_id           UUID REFERENCES users(id),
    line_judge_1_id     UUID REFERENCES users(id),
    line_judge_2_id     UUID REFERENCES users(id),
    
    -- Conditions
    weather_conditions  VARCHAR(100),
    temperature_c       SMALLINT,
    humidity_pct        SMALLINT,
    attendance          INTEGER,
    
    -- Streaming/Recording
    stream_url          VARCHAR(500),
    recording_url       VARCHAR(500),
    is_live_stream      BOOLEAN DEFAULT FALSE,
    
    -- System
    status              VARCHAR(30) DEFAULT 'scheduled' CHECK (status IN (
        'draft', 'scheduled', 'warmup', 'live', 'paused', 'completed', 'cancelled', 'postponed', 'forfeited'
    )),
    current_set         SMALLINT DEFAULT 1,
    current_set_status  VARCHAR(20) DEFAULT 'not_started',
    current_server_team_id UUID REFERENCES teams(id),
    current_rotation_home SMALLINT,
    current_rotation_away SMALLINT,
    
    created_by          UUID REFERENCES users(id),
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW(),
    completed_at        TIMESTAMPTZ,
    deleted_at          TIMESTAMPTZ
);

-- Individual sets within a match
CREATE TABLE sets (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id            UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    set_number          SMALLINT NOT NULL,                    -- 1, 2, 3, 4, 5
    set_number_display  SMALLINT NOT NULL,                    -- displayed number (1, 2, 3, 4, 5)
    home_points         SMALLINT DEFAULT 0,
    away_points         SMALLINT DEFAULT 0,
    status              VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    winner_team_id      UUID REFERENCES teams(id) ON DELETE SET NULL,
    started_at          TIMESTAMPTZ,
    ended_at            TIMESTAMPTZ,
    duration_seconds    INTEGER DEFAULT 0,
    home_points         SMALLINT DEFAULT 0,
    away_points         SMALLINT DEFAULT 0,
    duration_seconds    INTEGER DEFAULT 0,
    rally_count         INTEGER DEFAULT 0,
    longest_rally       SMALLINT,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT unique_set_number UNIQUE (match_id, set_number)
);

-- Points/rallies within a set
CREATE TABLE rallies (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    set_id              UUID NOT NULL REFERENCES sets(id) ON DELETE CASCADE,
    rally_number        SMALLINT NOT NULL,
    rally_sequence      INTEGER NOT NULL,          -- sequential across match
    rally_type          VARCHAR(30),               -- 'serve', 'rally', 'timeout', 'substitution', 'challenge'
    started_at          TIMESTAMPTZ NOT NULL,
    ended_at            TIMESTAMPTZ,
    duration_ms         INTEGER,
    serving_team_id     UUID REFERENCES teams(id),
    receiving_team_id   UUID REFERENCES teams(id),
    server_player_id    UUID REFERENCES players(id),
    rally_type          VARCHAR(30),               -- 'serve', 'rally', 'timeout', 'substitution', 'challenge'
    outcome             VARCHAR(30),               -- 'point_home', 'point_away', 'replay', 'cancelled'
    point_winner_team_id UUID REFERENCES teams(id),
    point_player_id     UUID REFERENCES players(id),  -- who scored
    action_type         VARCHAR(50),               -- 'kill', 'ace', 'block', 'dig', 'error', etc.
    action_player_id    UUID REFERENCES players(id),
    action_team_id      UUID REFERENCES teams(id),
    ball_speed_kmh      SMALLINT,
    court_zone          VARCHAR(10),               -- zone 1-6
    is_challenge        BOOLEAN DEFAULT FALSE,
    challenge_result    VARCHAR(20),               -- 'upheld', 'overturned', 'inconclusive'
    video_timestamp_ms  INTEGER,                   -- offset in video
    metadata            JSONB DEFAULT '{}',
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_rallies_set ON rallies(set_id);
CREATE INDEX idx_rallies_match ON rallies(match_id);
```

---

## 5.5 Events & Actions (Granular Timeline)

```sql
-- Granular event log for every action in a match
CREATE TABLE events (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id            UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    set_id              UUID REFERENCES sets(id) ON DELETE CASCADE,
    rally_id            UUID REFERENCES rallies(id) ON DELETE SET NULL,
    rally_number        SMALLINT,
    sequence_number     INTEGER NOT NULL,            -- absolute sequence in match
    
    -- What happened
    event_type          VARCHAR(50) NOT NULL,        -- 'serve', 'kill', 'ace', 'error', 'block', 'dig', etc.
    event_category      VARCHAR(30),                 -- 'serve', 'attack', 'block', 'dig', 'set', 'substitution', 'timeout', 'challenge'
    action_subtype      VARCHAR(50),                 -- 'jump_serve', 'float_serve', 'quick_set', 'pipe', etc.
    
    -- Participants
    player_id           UUID REFERENCES players(id),
    team_id             UUID NOT NULL REFERENCES teams(id),
    opponent_team_id    UUID,                        -- opposing team
    opponent_player_id  UUID,                        -- opponent player involved
    
    -- Spatial
    court_zone          VARCHAR(10),                 -- zone 1-9 (attack zones)
    court_x             NUMERIC(4,2),                -- 0-18 meters
    court_y             NUMERIC(4,2),                -- 0-9 meters
    height_cm           SMALLINT,                    -- contact height in cm
    
    -- Ball physics
    ball_speed_kmh      SMALLINT,
    spin_type           VARCHAR(20),                 -- 'topspin', 'float', 'jump_serve', 'jump_float'
    trajectory          VARCHAR(20),                 -- 'cross_court', 'line', 'middle', 'deep', 'short'
    
    -- Outcome
    outcome             VARCHAR(20),                 -- 'point', 'error', 'continuation', 'replay'
    points_awarded      SMALLINT DEFAULT 0,          -- 1 for point, -1 for error
    scoring_team_id     UUID REFERENCES teams(id),
    scoring_player_id   UUID REFERENCES players(id),
    
    -- Context
    rally_number        SMALLINT,
    rally_sequence      INT,                         -- sequence within rally
    rally_duration_ms   INTEGER,
    contacts_in_rally   SMALLINT,
    
    -- Set/Match context
    set_number          SMALLINT,
    home_score_before   SMALLINT DEFAULT 0,
    away_score_before   SMALLINT DEFAULT 0,
    home_score_after    SMALLINT DEFAULT 0,
    away_score_after    SMALLINT DEFAULT 0,
    set_number          SMALLINT,
    rally_number_in_set SMALLINT,
    
    -- Context
    rotation_home       SMALLINT,                    -- rotation position 1-6
    rotation_away       SMALLINT,
    is_libero_action    BOOLEAN DEFAULT FALSE,
    is_challenge        BOOLEAN DEFAULT FALSE,
    challenge_result    VARCHAR(20),                 -- upheld, overturned, inconclusive
    video_review_id     UUID,
    
    -- Metadata
    source              VARCHAR(20) DEFAULT 'ai',    -- 'manual', 'ai', 'scout', 'broadcast'
    confidence          REAL DEFAULT 1.0,
    verified_by         UUID REFERENCES users(id),
    verified_at         TIMESTAMPTZ,
    metadata            JSONB DEFAULT '{}',
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    created_by          UUID REFERENCES users(id)
);

CREATE INDEX idx_events_match ON events(match_id);
CREATE INDEX idx_events_team ON events(team_id);
CREATE INDEX idx_events_player ON events(player_id);
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_timestamp ON events(created_at);
CREATE INDEX idx_events_rally ON events(rally_id);
```

---

## 5.6 Statistics & Aggregations (Materialized/Pre-computed)

```sql
-- Player season aggregates
CREATE MATERIALIZED VIEW mv_player_season_stats AS
SELECT 
    p.id AS player_id,
    p.team_id,
    p.jersey_number,
    p.first_name,
    p.last_name,
    p.position,
    COUNT(DISTINCT ms.match_id) AS matches_played,
    SUM(ms.sets_played) AS sets_played,
    SUM(ms.playing_time_seconds) AS playing_time_seconds,
    SUM(ms.kills) AS kills,
    SUM(s.attack_attempts) AS attack_attempts,
    SUM(s.kills) AS kills,
    SUM(s.attack_errors) AS attack_errors,
    SUM(s.blocked_attacks) AS blocked_attacks,
    SUM(s.assists) AS assists,
    SUM(s.service_aces) AS service_aces,
    SUM(s.service_errors) AS service_errors,
    SUM(s.reception_attempts) AS reception_attempts,
    SUM(s.perfect_receptions) AS perfect_receptions,
    SUM(s.reception_errors) AS reception_errors,
    SUM(s.digs) AS digs,
    SUM(s.solo_blocks + s.block_assists) AS total_blocks,
    SUM(s.digs AS sets_played,
    -- Derived
    CASE WHEN SUM(s.attack_attempts) > 0 
         THEN ROUND((SUM(kills) - SUM(attack_errors) - SUM(blocked_attacks)) * 100.0 / SUM(attack_attempts), 2)
         ELSE 0 END AS attack_efficiency,
    CASE WHEN total_serves > 0 THEN ROUND((SUM(service_aces)::numeric / total_serves) * 100, 1) ELSE 0 END AS serve_percentage,
    ROUND(100.0 * kills / NULLIF(attack_attempts, 0), 1) AS kill_pct,
    CASE WHEN total_serves > 0 THEN ROUND((service_aces::numeric / total_serves) * 100, 1) ELSE 0 END AS ace_rate
FROM player_match_statistics pms
JOIN matches m ON ms.match_id = m.id
WHERE p.team_id = $1
  AND (ms.match_id = $2 OR $2 IS NULL)
GROUP BY p.id, p.team_id, p.jersey_number, p.first_name, p.last_name, p.position
ORDER BY p.jersey_number;
```

```sql
-- Indexes for common query patterns
CREATE INDEX idx_pms_player_match ON player_match_statistics(player_id, match_id);
CREATE INDEX idx_pms_player ON player_match_statistics(player_id);
CREATE INDEX idx_pms_match ON player_match_statistics(match_id);
CREATE INDEX idx_matches_date ON matches(match_date);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_matches_teams ON matches(home_team_id, away_team_id);
```

---

## 5.5 Indexing Strategy Summary

| Table | Index | Purpose |
|-------|-------|---------|
| `players` | `(team_id, jersey_number)` UNIQUE | Unique jersey per team |
| `players` | `(team_id, is_active)` | Active roster queries |
| `players` | `(last_name, first_name)` | Name search |
| `matches` | `(status, match_date)` | Schedule queries |
| `matches` | `(home_team_id, away_team_id, status)` | H2H queries |
| `sets` | `(match_id, set_number)` UNIQUE | Set lookup |
| `rallies` | `(match_id, rally_number)` | Rally sequence |
| `events` | `(match_id, created_at)` | Timeline queries |
| `events` | `(team_id, event_type, created_at)` | Team event feed |
| `player_match_stats` | `(player_id, match_id)` UNIQUE | Stat lookup |
| `events` | `(match_id, created_at)` | Timeline queries |
| `events` | `(team_id, event_type, created_at)` | Team analytics |
| `rallies` | `(match_id, rally_number)` | Rally sequence |

---

## 5.6 Partitioning Strategy (High-Volume Tables)

```sql
-- Partition events by month for performance
CREATE TABLE events (
    -- ... columns ...
) PARTITION BY RANGE (created_at);

-- Monthly partitions (auto-maintained via pg_partman)
CREATE TABLE events_2026_01 PARTITION OF events
    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

-- Player match stats partitioned by month
CREATE TABLE player_match_statistics (
    -- columns...
) PARTITION BY RANGE (match_date);

-- Partition by month
CREATE TABLE pms_2026_01 PARTITION OF player_match_statistics
    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
```

---

## 5.12 Migration Strategy (Alembic)

```python
# alembic/env.py
from alembic import context
from app.core.config import settings
from app.core.database import Base
from app.models import models  # imports all models

config = context.config
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)
target_metadata = Base.metadata

def run_migrations_online():
    connectable = create_async_engine(settings.DATABASE_URL)
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()
```

```bash
# Generate migration
alembic revision --autogenerate -m "add_player_injury_table"

# Apply
alembic upgrade head

# Downgrade
alembic downgrade -1
```

---

## 5.13 Seed Data (Reference Data)

```sql
-- Seed reference data
INSERT INTO positions (code, name, abbreviation, description, sort_order) VALUES
('OH', 'Outside Hitter', 'OH', 'Left-side attacker', 1),
('MB', 'Middle Blocker', 'MB', 'Middle blocker', 2),
('OPP', 'Opposite', 'OPP', 'Right-side attacker', 3),
('S', 'Setter', 'S', 'Setter', 4),
('L', 'Libero', 'L', 'Defensive specialist', 5),
('DS', 'Defensive Specialist', 'DS', 'Back-row defender', 6);

INSERT INTO competition_levels (code, name, sort_order) VALUES
('youth', 'Youth', 1),
('high_school', 'High School', 2),
('collegiate', 'Collegiate', 3),
('semi_pro', 'Semi-Professional', 4),
('professional', 'Professional', 5),
('international', 'International', 6);

INSERT INTO venues (name, city, country_code, capacity, court_count, address, latitude, longitude)
VALUES 
('National Volleyball Center', 'Colorado Springs', 'USA', 5000, 12, '1 Olympic Plaza', 38.8339, -104.8214),
('Spiker Arena', 'Los Angeles', 'USA', 8000, 8, '1111 Figueroa St', 34.0431, -118.2673);
```

---

## 5.14 Chapter Summary

This chapter establishes the **single source of truth** for all Volleyball Analytics Platform data. Key decisions:

| Decision | Rationale |
|----------|-----------|
| **UUID PKs** | Global uniqueness, distributed inserts, no collisions |
| **JSONB for flexible data** | Metadata, match conditions, video metadata |
| **Partitioning** | Time-based partitioning for events/stats |
| **Materialized Views** | Pre-computed stats for dashboards |
| **Soft Deletes** | `deleted_at` pattern preserves history |
| **Optimistic Locking** | `version` column prevents lost updates |
| **Audit Fields** | `created_at`, `updated_at`, `created_by`, `updated_by` on all tables |
| **Soft Deletes** | `deleted_at` preserves history |
| **Partitioning** | Time-based partitioning for high-volume tables |

---

**Next:** Chapter 6 — Authentication & Authorization (building on this data foundation)

---

**END OF CHAPTER 5**