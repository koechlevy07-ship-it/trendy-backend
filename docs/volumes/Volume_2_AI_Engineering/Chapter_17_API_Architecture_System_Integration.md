# VOLUME 2: AI ENGINEERING & COMPUTER VISION IMPLEMENTATION SPECIFICATION (AECVIS)

**Version:** 1.0  
**Date:** July 15, 2026  
**Status:** Active Development

---

# CHAPTER 17: API ARCHITECTURE & SYSTEM INTEGRATION

---

## 17.1 Purpose

The API Architecture & System Integration layer provides standardized communication mechanisms between all components of the Volleyball Analytics Platform.

Its objectives are to:

- Enable secure communication
- Support real-time data exchange
- Integrate AI modules
- Connect frontend and backend systems
- Support third-party integrations
- Ensure scalability and maintainability

---

## 17.2 API Architecture Overview

The platform exposes APIs through a centralized API Gateway.

```
                Web Dashboard
                     │
                Mobile App
                     │
             Tournament Portal
                     │
              Third-Party Systems
                     │
                     ▼
                API Gateway
                     │
────────────────────────────────────────────
 Authentication Service
 Match Management Service
 AI Processing Service
 Statistics Service
 Analytics Service
 Reporting Service
 Notification Service
 User Management Service
────────────────────────────────────────────
                     │
                 Databases
```

Clients communicate only with the API Gateway, not directly with internal services.

---

## 17.3 API Design Principles

All APIs follow these principles:

| Principle | Implementation |
|-----------|----------------|
| **RESTful Resource Design** | Resource-oriented URLs, standard HTTP methods |
| **Consistent Naming** | Plural nouns, kebab-case paths |
| **Stateless Communication** | No server-side session state |
| **Secure Authentication** | JWT Bearer tokens |
| **Versioned Endpoints** | `/api/v1/`, `/api/v2/` |
| **Predictable Responses** | Standardized envelope |
| **Standard HTTP Status Codes** | RFC 7231 compliant |
| **Comprehensive Documentation** | OpenAPI 3.1 / Swagger UI |

---

## 17.4 API Categories

### 17.4.1 Authentication APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/login` | Email/password login → JWT |
| `POST` | `/api/v1/auth/register` | Register new user |
| `POST` | `/api/v1/auth/refresh` | Refresh access token |
| `POST` | `/api/v1/auth/logout` | Invalidate refresh token |
| `POST` | `/api/v1/auth/forgot-password` | Request password reset |
| `POST` | `/api/v1/auth/reset-password` | Reset with token |
| `GET` | `/api/v1/auth/me` | Current user profile |
| `PUT` | `/api/v1/auth/me` | Update profile |
| `PUT` | `/api/v1/auth/password` | Change password |

### 17.4.2 User Management APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/users` | List users (paginated, filterable) |
| `POST` | `/api/v1/users` | Create user (admin) |
| `GET` | `/api/v1/users/{id}` | Get user profile |
| `PUT` | `/api/v1/users/{id}` | Update user |
| `PUT` | `/api/v1/users/{id}/role` | Change role |
| `PUT` | `/api/v1/users/{id}/status` | Activate/deactivate |

### 17.4.3 Organization & Team APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/organizations` | List organizations |
| `POST` | `/api/v1/organizations` | Create organization |
| `GET` | `/api/v1/organizations/{id}` | Get organization |
| `PUT` | `/api/v1/organizations/{id}` | Update organization |
| `GET` | `/api/v1/organizations/{id}/teams` | List teams |
| `POST` | `/api/v1/organizations/{id}/teams` | Create team |
| `GET` | `/api/v1/teams` | List teams (filter: org, season) |
| `POST` | `/api/v1/teams` | Create team |
| `GET` | `/api/v1/teams/{id}` | Team details |
| `PUT` | `/api/v1/teams/{id}` | Update team |
| `GET` | `/api/v1/teams/{id}/roster` | Team roster with stats |

### 17.4.4 Player APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/players` | List players (filter: team, position, search) |
| `POST` | `/api/v1/players` | Create player |
| `GET` | `/api/v1/players/{id}` | Player profile |
| `PUT` | `/api/v1/players/{id}` | Update player |
| `GET` | `/api/v1/players/{id}/career-stats` | Career aggregates |
| `GET` | `/api/v1/players/{id}/season-stats/{season_id}` | Per-season breakdown |
| `GET` | `/api/v1/players/{id}/match-logs` | Per-match logs |
| `GET` | `/api/v1/players/{id}/heatmaps` | Zone heatmaps |

### 17.4.5 Match APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/matches` | List matches (filter: team, tournament, status, date) |
| `POST` | `/api/v1/matches` | Create match |
| `GET` | `/api/v1/matches/{id}` | Match details |
| `PUT` | `/api/v1/matches/{id}` | Update match |
| `POST` | `/api/v1/matches/{id}/start` | Start live match |
| `POST` | `/api/v1/matches/{id}/pause` | Pause match |
| `POST` | `/api/v1/matches/{id}/resume` | Resume match |
| `POST` | `/api/v1/matches/{id}/end` | End match |
| `GET` | `/api/v1/matches/{id}/sets` | Set scores |
| `GET` | `/api/v1/matches/{id}/lineups` | Starting lineups |
| `POST` | `/api/v1/matches/{id}/lineups` | Set lineup |
| `POST` | `/api/v1/matches/{id}/substitutions` | Record substitution |
| `POST` | `/api/v1/matches/{id}/timeouts` | Record timeout |

### 17.4.6 Statistics APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/statistics/players/{id}` | Player stats (query: season, match, per-game) |
| `GET` | `/api/v1/statistics/teams/{id}` | Team aggregate stats |
| `GET` | `/api/v1/statistics/matches/{id}` | Match statistics (both teams) |
| `GET` | `/api/v1/statistics/leaderboards` | Top-N by metric (filter: season, team, position) |
| `GET` | `/api/v1/statistics/comparison` | Multi-player comparison |
| `GET` | `/api/v1/statistics/trends` | Performance trends over time |

### 17.4.7 Analytics APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/analytics/players/{id}` | Deep analytics (trends, zones, efficiency) |
| `GET` | `/api/v1/analytics/teams/{id}` | Team analytics (offensive, defensive, serving) |
| `GET` | `/api/v1/analytics/comparison` | Multi-entity comparison |
| `GET` | `/api/v1/analytics/heatmaps` | Player/team heatmaps |
| `GET` | `/api/v1/analytics/attack-zones` | Attack placement analysis |
| `GET` | `/api/v1/analytics/serve-placement` | Serve placement analysis |
| `GET` | `/api/v1/analytics/rotation-efficiency` | Points by rotation |

### 17.4.8 Reporting APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/reports` | List reports (filter: type, match, team, player) |
| `POST` | `/api/v1/reports/generate` | Generate report (async) |
| `GET` | `/api/v1/reports/{id}` | Report status + download URL |
| `GET` | `/api/v1/reports/{id}/download` | Download PDF/CSV/JSON |
| `DELETE` | `/api/v1/reports/{id}` | Delete report |
| `POST` | `/api/v1/reports/templates` | Create custom template |
| `GET` | `/api/v1/reports/templates` | List templates |

### 17.4.9 Video & Camera APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/videos` | List videos |
| `POST` | `/api/v1/videos/upload` | Upload video (presigned URL) |
| `GET` | `/api/v1/videos/{id}` | Video details |
| `POST` | `/api/v1/videos/{id}/process` | Start AI processing |
| `GET` | `/api/v1/videos/{id}/status` | Processing status |
| `GET` | `/api/v1/cameras` | List cameras |
| `POST` | `/api/v1/cameras` | Register camera |
| `PUT` | `/api/v1/cameras/{id}/calibrate` | Trigger calibration |

### 17.4.10 AI Configuration APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/ai/models` | List deployed models |
| `POST` | `/api/v1/ai/models` | Deploy new model version |
| `PUT` | `/api/v1/ai/models/{id}/promote` | Promote to production |
| `GET` | `/api/v1/ai/config` | Current inference config |
| `PUT` | `/api/v1/ai/config` | Update thresholds, device |
| `GET` | `/api/v1/ai/health` | Inference service health |

### 17.4.11 Admin APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/admin/users` | List all users |
| `PUT` | `/api/v1/admin/users/{id}/role` | Change user role |
| `PUT` | `/api/v1/admin/users/{id}/status` | Activate/deactivate |
| `GET` | `/api/v1/admin/system-stats` | System statistics |
| `POST` | `/api/v1/admin/backup` | Trigger database backup |

---

## 17.5 REST API Standards

| Convention | Standard |
|-----------|----------|
| **Base URL** | `https://api.volleyplatform.com/api/v1` |
| **Versioning** | URL path (`/api/v1/`, `/api/v2/`) |
| **Format** | JSON (`application/json`) |
| **Encoding** | UTF-8 |
| **Date/Time** | ISO 8601 UTC (`2026-07-15T14:32:17.420Z`) |
| **IDs** | UUID v4 (`550e8400-e29b-41d4-a716-446655440000`) |
| **Pagination** | `page`, `per_page` (max 100) |
| **Filtering** | `filter[field]=value`, `filter[field][op]=gte` |
| **Sorting** | `sort=-created_at,name` |
| **Field Selection** | `fields=id,name,email` |

---

## 17.6 Standard Response Format

### 17.6.1 Success Response
```json
{
  "status": "success",
  "data": { },
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 150,
    "total_pages": 8,
    "timestamp": "2026-07-15T14:32:17.420Z",
    "request_id": "req_abc123"
  }
}
```

### 17.6.2 Error Response
```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "jersey_number": "Must be between 0 and 99"
    }
  },
  "meta": {
    "timestamp": "2026-07-15T14:32:17.420Z",
    "request_id": "req_abc123"
  }
}
```

---

## 17.7 HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| `200` | OK | Successful GET, PUT, PATCH |
| `201` | Created | Successful POST |
| `204` | No Content | Successful DELETE |
| `400` | Bad Request | Invalid input |
| `401` | Unauthorized | Missing/invalid token |
| `403` | Forbidden | Insufficient permissions |
| `404` | Not Found | Resource doesn't exist |
| `409` | Conflict | Duplicate/state conflict |
| `422` | Unprocessable Entity | Semantic validation failed |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Unexpected error |
| `503` | Service Unavailable | Maintenance mode |

---

## 17.8 Real-Time Communication

### 17.8.1 WebSocket Protocol

```
wss://api.volleyplatform.com/api/v1/ws/match/{matchId}?token={access_token}
```

### 17.8.2 Client → Server Messages
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

### 17.8.3 Server → Client Messages
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

## 17.9 Event Streaming

### 17.9.1 Kafka Topic Design

```
volleyball-events
├── observations.raw          # Raw AI outputs (short retention)
├── observations.validated    # Validated + enriched
├── actions.volleyball        # Validated volleyball actions
├── state.rally               # Rally lifecycle events
├── statistics.derived        # Computed stats
├── system.platform           # Platform events
└── audit.security            # Security events

# Per-match replay topics
├── match.{match_id}.live
├── match.{match_id}.replay
└── match.{match_id}.clips
```

### 17.9.2 Partitioning Strategy

```python
def partition_key(event: Event) -> str:
    """Ensure all events for a match go to same partition for ordering."""
    return event.payload.get("match_id") or event.correlation_id
```

**Partition Count:** 100 (supports 100 concurrent matches with ordering)

### 17.9.3 Retention Policies

| Topic | Retention | Cleanup | Compaction |
|-------|-----------|---------|------------|
| `observations.raw` | 7 days | Delete | No |
| `observations.validated` | 90 days | Delete | No |
| `actions.volleyball` | Permanent | Compact | Yes (by event_id) |
| `state.rally` | Permanent | Compact | Yes (by rally_id) |
| `statistics.derived` | Permanent | Compact | Yes (by stat_key) |
| `match.{id}.live` | Match + 24h | Delete | No |
| `audit.security` | 7 years | Delete | No |

---

## 17.10 Authentication

### 17.10.1 JWT Bearer Token

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 17.10.2 Token Claims

```json
{
  "sub": "user_123",
  "email": "coach@team.com",
  "role": "coach",
  "org_id": 42,
  "permissions": ["matches:read", "players:write", "stats:read"],
  "iat": 1700000000,
  "exp": 1700086400
}
```

### 17.10.3 Token Lifecycle

| Token Type | Lifetime | Storage |
|-----------|----------|---------|
| Access Token | 15 minutes | Memory (not localStorage) |
| Refresh Token | 7 days | HttpOnly Secure Cookie |
| API Key | Configurable | Secure Vault |

---

## 17.11 Authorization (RBAC)

| Role | Permissions |
|------|-------------|
| `admin` | Full platform access |
| `org_admin` | Manage organization resources |
| `coach` | Team data, match management, live match, reports |
| `analyst` | Read-only analytics, report generation |
| `statistician` | Event review, correction, validation |
| `viewer` | Public match data, read-only stats |

**Permission Format:** `{resource}:{action}` (e.g., `matches:read`, `players:write`)

---

## 17.12 AI Service Integration

### 17.12.1 Internal AI API (Service-to-Service)

| Service | Endpoint | Description |
|---------|----------|-------------|
| AI Inference | `POST /internal/ai/detect` | Frame → detections |
| AI Inference | `POST /internal/ai/track` | Detections → tracks |
| AI Inference | `POST /internal/ai/pose` | Crop → keypoints |
| AI Inference | `POST /internal/ai/action` | Sequence → action |
| AI Inference | `POST /internal/ai/ocr` | Crop → jersey number |
| Model Registry | `GET /internal/ai/models` | List available models |
| Model Registry | `POST /internal/ai/models` | Register new model |

### 17.12.2 AI Request/Response Contract

```json
// Request: Detect
{
  "frame_id": "frm_abc123",
  "image_base64": "...",
  "camera_id": "cam_001",
  "timestamp_ms": 1234567890,
  "court_homography": [[1,0,0],[0,1,0],[0,0,1]]
}

// Response: Detections
{
  "frame_id": "frm_abc123",
  "detections": [
    {"type": "player", "bbox": [0.1,0.2,0.3,0.4], "confidence": 0.94, "team": "home"},
    {"type": "ball", "bbox": [0.5,0.3,0.02,0.02], "confidence": 0.88}
  ],
  "processing_time_ms": 18
}
```

---

## 17.13 Database Integration

### 17.13.1 Repository Pattern

Services interact with databases through repositories, not direct SQL in controllers.

```python
# services/statistics_service.py
class StatisticsService:
    def __init__(self, player_repo: PlayerRepository, 
                 match_repo: MatchRepository,
                 stats_repo: StatisticsRepository):
        self.players = player_repo
        self.matches = match_repo
        self.stats = stats_repo
    
    async def process_action(self, action: ActionEvent):
        async with self.db.transaction():
            deltas = self.calculate_deltas(action)
            await self.stats.apply_deltas(action.player_id, deltas)
            await self.stats.update_team_aggregates(action.team_id, deltas)
```

---

## 17.14 Third-Party Integrations

### 17.14.1 Webhook Registration

```http
POST /api/v1/webhooks
{
  "url": "https://club-system.com/volley/webhook",
  "events": ["match.started", "match.ended", "player.milestone"],
  "secret": "whsec_abc123"
}
```

### 17.14.2 Webhook Payload

```json
{
  "event": "match.ended",
  "timestamp": "2026-07-15T16:45:00Z",
  "payload": {
    "match_id": 1001,
    "winner_team_id": 12,
    "final_score": "3-1"
  },
  "signature": "sha256=abc123..."
}
```

### 17.14.3 SDK Availability

| Language | Package | Status |
|----------|---------|--------|
| **TypeScript** | `@volleyplatform/sdk` | ✅ Primary |
| **Python** | `volleyplatform-python` | 🔄 Planned |
| **Go** | `github.com/volleyplatform/go-sdk` | 🔄 Planned |

---

## 17.15 Notification Integration

### 17.15.1 Notification API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/notifications` | List notifications (filterable) |
| `PUT` | `/api/v1/notifications/{id}/read` | Mark as read |
| `PUT` | `/api/v1/notifications/read-all` | Mark all read |
| `GET` | `/api/v1/notifications/preferences` | Get preferences |
| `PUT` | `/api/v1/notifications/preferences` | Update preferences |

### 17.15.2 Notification Types

| Type | Channel | Description |
|------|---------|-------------|
| `camera_alert` | In-app, Push, Email | Camera disconnected |
| `ai_confidence_low` | In-app | Event below confidence threshold |
| `match_event` | In-app, Push | Score, ace, kill, etc. |
| `report_ready` | In-app, Email | Report generated |
| `system_warning` | In-app, Email | System alerts |

---

## 17.16 File Upload APIs

### 17.16.1 Direct Upload (Presigned URL)

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

### 17.16.2 Multipart Upload (Large Files)

```http
POST /api/v1/uploads/multipart/initiate
{ "filename": "match_1001.mp4", "total_size": 5368709120, "part_size": 52428800 }

→ { "upload_id": "upid_123", "part_count": 102, "presigned_parts": [...] }

# Complete
POST /api/v1/uploads/multipart/complete
{ "upload_id": "upid_123", "parts": [{ "part_number": 1, "etag": "..." }, ...] }
```

---

## 17.17 Search APIs

### 17.17.1 Global Search

```http
GET /api/v1/search?q=Koech&limit=10
```

**Response:**
```json
{
  "players": [{ "id": 101, "name": "Jane Koech", "team": "Thunder", "jersey": 7 }],
  "teams": [{ "id": 12, "name": "Koech Warriors", "league": "Premier" }],
  "matches": [{ "id": 1001, "date": "2026-07-15", "home": "Thunder", "away": "Eagles" }],
  "reports": [{ "id": 55, "title": "Koech Season Summary", "date": "2026-07-01" }],
  "organizations": [{ "id": 3, "name": "Koech Academy" }]
}
```

---

## 17.18 API Versioning

| Version | Status | Sunset Date |
|---------|--------|-------------|
| `v1` | Current | TBD |
| `v2` | Planned | — |

**Rules:**
- Breaking changes → new major version (`/api/v2/`)
- Additive changes → same version, documented in changelog
- Deprecated endpoints → `Sunset` header + 6-month notice
- Clients must specify version in URL

### 17.18.2 Sunset Header
```
Sunset: Sat, 01 Jan 2027 00:00:00 GMT
Link: <https://api.volleyplatform.com/api/v2/players>; rel="successor-version"
```

---

## 17.19 Error Handling

### 17.19.1 Error Code Registry

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

### 17.19.2 Rate Limit Headers

```
X-RateLimit-Limit: 600
X-RateLimit-Remaining: 598
X-RateLimit-Reset: 1700086800
Retry-After: 45  (on 429)
```

---

## 17.20 API Documentation

### 17.20.1 OpenAPI Specification

- **Format:** OpenAPI 3.1 (YAML)
- **Location:** `/docs/openapi.yaml` (served at `/api/docs`)
- **UI:** Swagger UI at `/api/docs`, Redoc at `/api/redoc`
- **Generation:** Auto-generated from code annotations + manual overrides

### 17.20.2 Code Generation

```bash
# Generate TypeScript client
npm run api:generate

# Output: shared/api/generated/
# - client.ts (TanStack Query hooks)
# - types.ts (Zod schemas + TypeScript types)
# - schemas.ts (raw OpenAPI schemas)
```

---

## 17.21 API Testing

| Test Type | Tool | Coverage Target |
|-----------|------|-----------------|
| Unit | pytest + httpx | 80% |
| Integration | pytest + testcontainers | 70% |
| Contract | Pact | All public endpoints |
| E2E | Playwright | Critical flows |
| Load | Locust / k6 | 1000 concurrent users |
| Security | OWASP ZAP | Auth, injection, authz |

---

## 17.22 Performance Requirements

| Metric | Target |
|--------|--------|
| **API Latency (p95)** | < 200ms |
| **API Latency (p99)** | < 500ms |
| **WebSocket Latency** | < 50ms |
| **Throughput** | 10,000 req/sec |
| **Concurrent Connections** | 10,000+ WebSockets |
| **Event → Dashboard** | < 200ms |

---

## 17.22 Security Considerations

| Layer | Measures |
|-------|----------|
| **Transport** | TLS 1.3 everywhere (Nginx termination) |
| **Authentication** | JWT (RS256), short-lived access, refresh rotation |
| **Authorization** | RBAC at gateway + service-level checks |
| **Input Validation** | Pydantic schemas on all endpoints |
| **Rate Limiting** | Token bucket at gateway (100 req/min/user) |
| **Audit Logging** | All admin actions, data modifications |
| **Secrets** | Vault / Sealed Secrets (no plaintext in code) |
| **CORS** | Restricted to known frontend origins |
| **Security Headers** | CSP, HSTS, X-Frame-Options, X-Content-Type-Options |

---

## 17.23 Future Enhancements

| Enhancement | Description |
|-------------|-------------|
| **GraphQL Gateway** | Flexible queries for complex dashboards |
| **Public Developer API** | Third-party app ecosystem |
| **Mobile SDKs** | iOS/Android native SDKs |
| **Webhook Retry Policy** | Exponential backoff, dead letter queue |
| **API Monetization** | Usage-based billing for third parties |
| **Federated API Gateway** | Multi-region API gateway |

---

## 17.24 Chapter Summary

The API Architecture & System Integration layer provides the communication backbone for the Volleyball Analytics Platform.

**Key Deliverables:**
- **REST API** — 130+ endpoints across 11 categories
- **WebSocket API** — Real-time live match updates
- **Event Streaming** — Kafka-based event backbone
- **Authentication** — JWT + RBAC with fine-grained permissions
- **AI Integration** — Internal service contracts for CV pipeline
- **File Upload** — Presigned URLs + multipart for large videos
- **Search** — Global multi-entity search
- **Documentation** — Auto-generated OpenAPI 3.1 + TypeScript SDK
- **Testing** — Unit, integration, contract, E2E, load, security
- **Governance** — Versioning, deprecation policy, model governance

---

**END OF CHAPTER 17**

*Next: Chapter 18 — Model Evaluation*