# VOLUME 3 – SOFTWARE DEVELOPMENT BLUEPRINT & IMPLEMENTATION GUIDE
# CHAPTER 5
# Database Architecture & Domain Model Foundation

**Version:** 1.0  
**Status:** Ready for AI Developer Implementation

---

## AI DEVELOPER MASTER EXECUTION PROMPT

### ROLE

You are the Lead Software Architect, Senior Database Architect, Senior Backend Engineer, and System Designer responsible for implementing ONLY this chapter.

Your responsibility is to design and implement the production-ready database architecture for the Volleyball Analytics Platform.

This chapter establishes the complete data model that will support all current and future platform features, including AI-powered analytics, live match tracking, reporting, and multi-organization deployments.

### EXECUTION RULES

**Before implementation:**
- Read this chapter completely.
- Design the database before creating tables.
- Follow normalization principles where appropriate.
- Use PostgreSQL as the primary database.
- Use SQLAlchemy ORM models.
- Create Alembic migrations.
- Document every table and relationship.
- Validate the schema.
- Stop after this chapter.

**EXECUTION BOUNDARY**

Implement ONLY the database architecture described in this chapter.

Do NOT implement:
- Authentication logic
- API endpoints
- Frontend
- AI processing
- Match statistics generation
- Business workflows

Focus solely on the database structure and supporting ORM models.

**After completion:**
- Generate the Chapter Completion Report.
- Stop.
- Wait for Chapter 6.

---

## 5.1 Chapter Objective

The objective of this chapter is to establish a scalable and extensible relational database that serves as the single source of truth for the Volleyball Analytics Platform.

The schema shall support:

- Multiple organizations
- Multiple leagues
- Multiple seasons
- Multiple competitions
- Teams
- Players
- Coaches
- Officials
- Venues
- Matches
- Events
- Statistics
- AI detections
- Video recordings
- Users
- Roles
- Permissions
- Reports
- Notifications
- Future sports expansion

---

## 5.2 Database Design Principles

The database shall be designed according to these principles:

| Principle | Description |
|-----------|-------------|
| **Data Integrity** | Enforce constraints at the database level |
| **Referential Integrity** | Foreign keys for all relationships |
| **Normalization** | Up to 3NF where practical; denormalize for read performance where justified |
| **Scalability** | Partitioning strategy for high-volume tables (events, statistics, AI inferences) |
| **Extensibility** | JSONB columns for flexible metadata; polymorphic associations where needed |
| **Auditability** | Created/updated timestamps, created_by/updated_by, soft deletes, audit log |
| **Performance** | Strategic indexes, composite indexes for query patterns, partial indexes |
| **Security** | Row-level security (RLS) ready; column-level encryption for PII |
| **Maintainability** | Naming conventions, comprehensive comments, migration versioning |

---

## 5.3 Core Domain Model

The platform shall be organized around the following core domains:

| Domain | Description |
|--------|-------------|
| **Organizations** | Multi-tenant isolation; root of ownership hierarchy |
| **Users** | People with platform access |
| **Roles** | Named collections of permissions |
| **Permissions** | Fine-grained action/resource authorizations |
| **Teams** | Competitive units belonging to organizations |
| **Players** | Athletes rostered to teams |
| **Coaches** | Coaching staff assigned to teams |
| **Competitions** | Leagues, tournaments, cups |
| **Seasons** | Temporal containers for competitions |
| **Venues** | Physical locations with courts |
| **Matches** | Scheduled competitive encounters |
| **Match Events** | Point-by-point timeline (serves, attacks, blocks, etc.) |
| **Statistics** | Aggregated team and player metrics |
| **AI Analytics** | ML model inferences tied to video frames |
| **Video Recordings** | Match video metadata and storage references |
| **Reports** | Generated analytics documents |
| **Notifications** | User-facing alerts and messages |
| **Audit Log** | Immutable system activity trail |

Each domain shall be represented by dedicated ORM models and repositories.

---

## 5.4 Entity Definitions

The AI developer shall define ORM models for the following 19 entities:

| Entity | Table Name | Description |
|--------|------------|-------------|
| `Organization` | `organizations` | Root tenant entity |
| `User` | `users` | Platform users |
| `Role` | `roles` | Role definitions |
| `Permission` | `permissions` | Atomic permissions |
| `Team` | `teams` | Competitive teams |
| `Player` | `players` | Athletes |
| `Coach` | `coaches` | Coaching staff |
| `Official` | `officials` | Referees, scorers, line judges |
| `Season` | `seasons` | Temporal competition containers |
| `Competition` | `competitions` | Leagues, tournaments |
| `Venue` | `venues` | Physical locations |
| `Court` | `courts` | Individual courts within venues |
| `Match` | `matches` | Scheduled matches |
| `MatchEvent` | `match_events` | Point-level event timeline |
| `TeamStatistic` | `team_statistics` | Aggregated team metrics per match/set |
| `PlayerStatistic` | `player_statistics` | Aggregated player metrics per match/set |
| `AIInference` | `ai_inferences` | ML model outputs per frame |
| `Camera` | `cameras` | Camera devices |
| `VideoRecording` | `video_recordings` | Video metadata and storage refs |
| `Report` | `reports` | Generated analytics reports |
| `Notification` | `notifications` | User notifications |
| `AuditLog` | `audit_logs` | Immutable audit trail |

---

## 5.5 Relationship Design

### 5.5.1 Ownership Hierarchy

```
Organization (1) ─────< (N) User
Organization (1) ─────< (N) Team
Organization (1) ─────< (N) Venue
Organization (1) ─────< (N) Season
Organization (1) ─────< (N) Competition
```

### 5.5.2 Team Composition

```
Team (1) ─────< (N) Player (via PlayerTeam roster)
Team (1) ─────< (N) Coach (via CoachTeam assignment)
Team (1) ─────< (N) Match (as home_team or away_team)
```

### 5.5.3 Competition Structure

```
Season (1) ─────< (N) Competition
Competition (1) ─────< (N) Match
Competition (N) ─────< (M) Team (via CompetitionTeam)
```

### 5.5.4 Match Execution

```
Match (1) ─────< (N) MatchEvent
Match (1) ─────< (N) TeamStatistic (per set)
Match (1) ─────< (N) PlayerStatistic (per set)
Match (1) ─────< (N) VideoRecording
Match (1) ─────< (N) Report
Match (N) ─────< (M) Official (via MatchOfficial)
```

### 5.5.5 AI & Video Pipeline

```
VideoRecording (1) ─────< (N) AIInference
Camera (1) ─────< (N) VideoRecording
Venue (1) ─────< (N) Camera
```

### 5.5.6 User Access Control

```
User (N) ─────< (M) Role (via UserRole)
Role (N) ─────< (M) Permission (via RolePermission)
Organization (1) ─────< (N) UserRole (scoped to org)
```

---

## 5.6 Common Model Fields

Every primary entity shall include, where applicable:

```python
# Base columns present on all tables
id: UUID (primary key, gen_random_uuid())
created_at: DateTime(timezone=True, default=now())
updated_at: DateTime(timezone=True, default=now(), onupdate=now())
created_by: UUID (FK to users.id, nullable)
updated_by: UUID (FK to users.id, nullable)
is_active: Boolean (default=True)
is_deleted: Boolean (default=False)  # Soft delete
deleted_at: DateTime(timezone=True, nullable=True)
```

**Naming Conventions:**
- Tables: `snake_case`, plural
- Columns: `snake_case`
- Primary Keys: `id` (UUID)
- Foreign Keys: `{table}_id`
- Indexes: `ix_{table}_{column(s)}`
- Unique Constraints: `uq_{table}_{column(s)}`
- Foreign Keys: `fk_{table}_{ref_table}`

---

## 5.7 Alembic Migration Strategy

### 5.7.1 Initial Migration

Create the initial migration establishing the base schema:

```bash
alembic revision --autogenerate -m "Initial schema: core domain models"
alembic upgrade head
```

### 5.7.2 Requirements

- **Reproducible**: Migration must run cleanly on empty database
- **Upgrade Path**: All `upgrade()` operations idempotent where possible
- **Downgrade Path**: All `downgrade()` operations reverse cleanly
- **Version Tracking**: Alembic version table tracks applied migrations
- **Future Changes**: All schema modifications via new migrations only

### 5.7.3 Migration Structure

```
alembic/
├── env.py
├── script.py.mako
├── versions/
│   ├── 001_initial_schema.py
│   ├── 002_add_indexes.py
│   └── ...
```

---

## 5.8 Repository Layer Preparation

For each domain model, prepare a repository interface following the Repository pattern:

```python
# Base repository protocol
class RepositoryProtocol(Protocol[T]):
    async def get(self, id: UUID) -> Optional[T]: ...
    async def get_all(self, *, skip: int = 0, limit: int = 100) -> List[T]: ...
    async def create(self, obj: T) -> T: ...
    async def update(self, obj: T) -> T: ...
    async def delete(self, id: UUID) -> bool: ...
    async def exists(self, id: UUID) -> bool: ...

# Concrete base implementation
class BaseRepository(Generic[T]):
    def __init__(self, session: AsyncSession, model: Type[T]):
        self.session = session
        self.model = model
    # ... CRUD implementations
```

**Repository scaffolding for each domain:**
- `OrganizationRepository`
- `UserRepository`
- `RoleRepository`
- `PermissionRepository`
- `TeamRepository`
- `PlayerRepository`
- `CoachRepository`
- `OfficialRepository`
- `SeasonRepository`
- `CompetitionRepository`
- `VenueRepository`
- `CourtRepository`
- `MatchRepository`
- `MatchEventRepository`
- `TeamStatisticRepository`
- `PlayerStatisticRepository`
- `AIInferenceRepository`
- `CameraRepository`
- `VideoRecordingRepository`
- `ReportRepository`
- `NotificationRepository`
- `AuditLogRepository`

---

## 5.9 Database Validation

Validate the following after migration:

| Check | Method |
|-------|--------|
| Table creation | `\dt` in psql / SQLAlchemy `inspect(engine).get_table_names()` |
| Relationships | Foreign key constraints exist; `relationship()` loads correctly |
| Constraints | `NOT NULL`, `UNIQUE`, `CHECK` constraints enforced |
| Indexes | `\di` in psql; verify composite indexes for query patterns |
| Migration execution | `alembic upgrade head` succeeds |
| Rollback capability | `alembic downgrade -1` succeeds |
| ORM compilation | `Base.metadata.create_all()` without errors |

**Document assumptions:**
- PostgreSQL 15+ (UUID, JSONB, CITEXT, RLS support)
- Timezone-aware timestamps (`TIMESTAMPTZ`)
- Soft delete via `is_deleted` + `deleted_at` (application-level filtering)
- Multi-tenancy via `organization_id` on all owned entities (RLS-ready)

---

## 5.10 Acceptance Criteria

The AI developer shall verify that:

- [ ] All 20 core entities are defined as SQLAlchemy models
- [ ] Relationships are correctly established with `relationship()` and `ForeignKey`
- [ ] ORM models compile successfully (`Base.metadata.create_all()`)
- [ ] Alembic initial migration executes successfully (`alembic upgrade head`)
- [ ] Database schema is documented (this chapter + inline model docstrings)
- [ ] Repository scaffolding exists for all 20 domains
- [ ] No business logic or API endpoints are introduced

---

## Definition of Done

This chapter is complete when:

1. ✅ Foundational database schema exists
2. ✅ ORM models are implemented
3. ✅ Relationships are validated
4. ✅ Initial migration succeeds
5. ✅ Repository scaffolding is in place
6. ✅ Documentation is updated

The project is now ready for the next layer of implementation.

---

## Recommended Git Commit

```bash
git add -A
git commit -m "feat(database): establish core domain model and initial schema

- Add 20 SQLAlchemy ORM models for core domains
- Define all relationships with foreign keys
- Create Alembic initial migration (001)
- Scaffold repository layer for all domains
- Add base model with common fields (UUID, timestamps, soft delete)
- Configure naming conventions and indexes
"
```

---

## Chapter 5 Summary

This chapter establishes the data backbone of the Volleyball Analytics Platform. By defining the core entities, relationships, and migration strategy, it provides a stable and extensible foundation for all future backend modules, including authentication, player management, match management, AI analytics, statistics generation, reporting, and multi-organization support. Future chapters will build upon this schema rather than redefining it, ensuring long-term consistency and scalability.

---

**END OF CHAPTER 5**

*Next: Chapter 6 — Authentication & Authorization*