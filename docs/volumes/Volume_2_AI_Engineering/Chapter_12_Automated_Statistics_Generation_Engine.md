# VOLUME 2: AI ENGINEERING & COMPUTER VISION IMPLEMENTATION SPECIFICATION (AECVIS)

**Version:** 1.0  
**Date:** July 15, 2026  
**Status:** Active Development

---

# CHAPTER 12: AUTOMATED STATISTICS GENERATION ENGINE

---

## 12.1 Purpose

The Automated Statistics Generation Engine is responsible for converting recognized volleyball events into official player, team, set, and match statistics.

Its objectives are to:

- Generate statistics automatically
- Eliminate manual data entry
- Produce live statistics during the match
- Maintain statistical accuracy
- Store historical statistics
- Support analytics and reporting

---

## 12.2 Role Within the AI Pipeline

The Statistics Engine receives validated volleyball events from the Action Recognition AI.

```
Action Recognition
        │
        ▼
Event Validation
        │
        ▼
Statistics Engine
        │
        ├──────────► Player Statistics
        │
        ├──────────► Team Statistics
        │
        ├──────────► Match Statistics
        │
        └──────────► Database
```

This engine is the single source of truth for all statistical data.

---

## 12.3 Functional Requirements

| Requirement | Target |
|-------------|--------|
| **Event Processing Latency** | < 100ms per event |
| **Concurrent Matches** | 10+ simultaneous |
| **Real-time Update Latency** | < 500ms to dashboard |
| **Data Consistency** | ACID transactions |
| **Historical Retention** | Permanent (configurable) |
| **Correction Support** | Full audit trail |

The Statistics Engine shall:

- Process every recognized event
- Update statistics in real time
- Maintain player statistics
- Maintain team statistics
- Maintain match statistics
- Preserve historical records
- Support corrections when necessary
- Expose statistics through APIs

---

## 12.4 Event Processing Workflow

```
Recognized Action
        │
        ▼
Rule Validation
        │
        ▼
Statistics Calculation
        │
        ▼
Database Update (Transaction)
        │
        ▼
Cache Invalidation
        │
        ▼
WebSocket Push → Dashboard
        │
        ▼
Reports & Analytics
```

---

## 12.5 Supported Statistics

The engine generates statistics across all volleyball categories:

### 12.5.1 Serving

| Statistic | Formula / Update Trigger |
|-----------|-------------------------|
| **Total Serves** | Count of `serve` events |
| **Service Aces** | Count of `ace` events |
| **Service Errors** | Count of `service_error` events |
| **Service Success Rate** | `(Total Serves - Service Errors) / Total Serves` |

### 12.5.2 Receiving

| Statistic | Formula / Update Trigger |
|-----------|-------------------------|
| **Reception Attempts** | Count of `reception` events |
| **Perfect Receptions** | Count of `perfect_reception` events |
| **Positive Receptions** | Count of `positive_reception` events |
| **Poor Receptions** | Count of `poor_reception` events |
| **Reception Errors** | Count of `reception_error` events |
| **Reception Percentage** | `(Perfect + Positive) / Reception Attempts` |

### 12.5.3 Setting

| Statistic | Formula / Update Trigger |
|-----------|-------------------------|
| **Total Sets** | Count of `set` events |
| **Assists** | Count of `assist` events |
| **Setting Errors** | Count of `setting_error` events |
| **Successful Set %** | `Assists / Total Sets` |

### 12.5.4 Attacking

| Statistic | Formula / Update Trigger |
|-----------|-------------------------|
| **Attack Attempts** | Count of `spike` + `tip` + `roll_shot` |
| **Kills** | Count of `kill` events |
| **Attack Errors** | Count of `attack_error` events |
| **Blocked Attacks** | Count of `blocked_attack` events |
| **Attack Efficiency** | `(Kills - Attack Errors - Blocked) / Attack Attempts` |

### 12.5.5 Blocking

| Statistic | Formula / Update Trigger |
|-----------|-------------------------|
| **Solo Blocks** | Count of `solo_block` events |
| **Block Assists** | Count of `block_assist` events |
| **Block Touches** | Count of `block_touch` events |
| **Blocking Errors** | Count of `block_error` events |

### 12.5.6 Defense

| Statistic | Formula / Update Trigger |
|-----------|-------------------------|
| **Digs** | Count of `dig` events |
| **Saves** | Count of `save` events |
| **Emergency Saves** | Count of `emergency_save` events |
| **Pancake Saves** | Count of `pancake_save` events |

### 12.5.7 Participation & Movement

| Statistic | Source |
|-----------|--------|
| **Playing Time** | Track entry/exit + substitutions |
| **Rotations Played** | Rotation engine |
| **Sets Played** | Match state |
| **Matches Played** | Match completion |
| **Distance Covered** | Tracking trajectory integration |
| **Average Speed** | Distance / Playing Time |
| **Max Speed** | Peak instantaneous speed |
| **Jump Count** | Jump detection events |
| **Avg Jump Height** | Pose estimation jump analysis |

---

## 12.6 Player Statistics Model

### 12.6.1 Data Structure

```python
@dataclass
class PlayerStatistics:
    player_id: str
    match_id: int
    set_number: Optional[int] = None  # None = cumulative match
    
    # Serving
    total_serves: int = 0
    service_aces: int = 0
    service_errors: int = 0
    
    # Receiving
    reception_attempts: int = 0
    perfect_receptions: int = 0
    positive_receptions: int = 0
    poor_receptions: int = 0
    reception_errors: int = 0
    
    # Setting
    set_attempts: int = 0
    assists: int = 0
    setting_errors: int = 0
    
    # Attacking
    attack_attempts: int = 0
    kills: int = 0
    attack_errors: int = 0
    blocked_attacks: int = 0
    
    # Blocking
    solo_blocks: int = 0
    block_assists: int = 0
    block_touches: int = 0
    block_errors: int = 0
    
    # Defense
    digs: int = 0
    saves: int = 0
    emergency_saves: int = 0
    pancake_saves: int = 0
    
    # Participation
    playing_time_seconds: float = 0.0
    sets_played: int = 0
    rotations_played: int = 0
    
    # Movement
    distance_covered_m: float = 0.0
    avg_speed_kmh: float = 0.0
    max_speed_kmh: float = 0.0
    jump_count: int = 0
    avg_jump_height_cm: float = 0.0
    max_jump_height_cm: float = 0.0
    
    # Derived (computed on read)
    @property
    def serve_pct(self) -> float:
        return (self.total_serves - self.service_errors) / self.total_serves * 100 if self.total_serves > 0 else 0.0
    
    @property
    def attack_efficiency(self) -> float:
        return (self.kills - self.attack_errors - self.blocked_attacks) / self.attack_attempts * 100 if self.attack_attempts > 0 else 0.0
```

---

## 12.7 Team Statistics

### 12.7.1 Aggregation Model

```python
@dataclass
class TeamStatistics:
    team_id: str
    match_id: int
    set_number: Optional[int] = None
    
    # Aggregated from players
    total_kills: int = 0
    total_aces: int = 0
    total_blocks: int = 0
    total_digs: int = 0
    total_errors: int = 0
    
    # Derived
    attack_efficiency: float = 0.0
    serve_efficiency: float = 0.0
    reception_efficiency: float = 0.0
    
    # Set-level
    sets_won: int = 0
    sets_lost: int = 0
    points_scored: int = 0
    points_conceded: int = 0
```

### 12.7.2 Derived Team Metrics

| Metric | Formula |
|--------|---------|
| **Attack Efficiency** | `(Team Kills - Team Attack Errors - Team Blocked) / Team Attack Attempts` |
| **Serve Efficiency** | `(Team Aces - Team Service Errors) / Team Total Serves` |
| **Reception Efficiency** | `(Perfect + Positive) / Team Reception Attempts` |
| **Sideout %** | `Team Points Won Receiving / Opponent Serves` |
| **Break Point %** | `Team Points Won Serving / Team Serves` |

---

## 12.8 Live Statistic Updates

### 12.8.1 Update Pipeline

```python
async def process_action_event(action: ActionEvent, stats_engine: StatisticsEngine):
    """
    Process a single action event through the statistics pipeline.
    """
    # 1. Validate
    if not await stats_engine.validate_action(action):
        return await stats_engine.queue_for_review(action)
    
    # 2. Calculate deltas
    deltas = stats_engine.calculate_deltas(action)
    
    # 3. Transactional update
    async with stats_engine.db.transaction():
        await stats_engine.apply_deltas(action.player_id, deltas)
        await stats_engine.update_team_aggregates(action.team_id, deltas)
        await stats_engine.update_match_state(action)
    
    # 4. Invalidate caches
    await stats_engine.invalidate_caches(action.player_id, action.team_id, action.match_id)
    
    # 5. Push to live dashboards
    await stats_engine.push_live_update(action)
```

### 12.8.2 WebSocket Push Format

```json
{
  "type": "STAT_UPDATE",
  "match_id": 1001,
  "timestamp": "2026-07-15T14:32:17.670Z",
  "updates": [
    {
      "entity_type": "player",
      "entity_id": "player_008",
      "stats": {
        "kills": 15,
        "attack_attempts": 28,
        "attack_efficiency": 42.9
      }
    },
    {
      "entity_type": "team",
      "entity_id": "team_home",
      "stats": {
        "total_kills": 42,
        "attack_efficiency": 38.5
      }
    }
  ]
}
```

---

## 12.9 Rally-Based Statistics

### 12.9.1 Rally Context

```python
@dataclass
class RallyStatistics:
    rally_number: int
    serving_team: str
    receiving_team: str
    sequence: List[ActionEvent]
    point_winner: Optional[str]
    point_type: PointType  # KILL, ACE, BLOCK, OPP_ERROR, SERVICE_ERROR
    duration_seconds: float
    contacts_per_team: Dict[str, int]
    
    # Derived
    @property
    def was_sideout(self) -> bool:
        return self.point_winner == self.receiving_team
    
    @property
    def was_break_point(self) -> bool:
        return self.point_winner == self.serving_team
```

### 12.9.2 Rally-Level Metrics

| Metric | Description |
|--------|-------------|
| **Sideout %** | `Sideouts / Receiving Opportunities` |
| **Break Point %** | `Break Points / Serving Opportunities` |
| **First Ball Kill %** | `First Ball Kills / Serve Receptions` |
| **Transition Efficiency** | `Counter-attack Kills / Defensive Contacts` |

---

## 12.10 Rule Engine

### 12.10.1 Validation Rules

```python
class StatisticsRuleEngine:
    """
    Validates action events against volleyball rules before applying statistics.
    """
    
    def validate(self, action: ActionEvent, rally_state: RallyState) -> ValidationResult:
        errors = []
        warnings = []
        
        # 3-contact rule
        if action.is_attack:
            if rally_state.team_contacts[action.team] > 3:
                errors.append("Exceeds 3 contacts")
        
        # Block doesn't count toward 3 contacts
        if action.action_type == "block":
            rally_state.team_contacts[action.team] -= 1
        
        # Double contact
        if action.action_type == "set" and rally_state.last_contact_by == action.player_id:
            errors.append("Double contact")
        
        # Net touch
        if action.player_intersects_net:
            errors.append("Net touch violation")
        
        # Rotation order at serve
        if action.action_type == "serve":
            if not rally_state.is_valid_server(action.player_id):
                errors.append("Rotation fault")
        
        # Libero restrictions
        if action.player_role == "libero":
            if action.action_type in ["spike", "block", "jump_serve"]:
                errors.append("Libero violation")
        
        return ValidationResult(
            valid=len(errors) == 0,
            errors=errors,
            warnings=warnings
        )
```

### 12.10.2 Configurable Rules

```yaml
# configs/rules/volleyball_rules.yaml
rules:
  max_contacts_per_team: 3
  block_counts_as_contact: false
  double_contact_check: true
  net_touch_check: true
  rotation_check: true
  libero_restrictions:
    no_attack_above_net: true
    no_block: true
    no_serve: true
    no_front_row_set: true
  set_points: 25
  final_set_points: 15
  win_by: 2
```

---

## 12.11 Statistical Formulas

### 12.11.1 Centralized Formula Registry

```python
class StatisticsFormulas:
    """Centralized formula definitions for consistency."""
    
    @staticmethod
    def attack_efficiency(kills: int, errors: int, blocked: int, attempts: int) -> float:
        if attempts == 0:
            return 0.0
        return (kills - errors - blocked) / attempts * 100
    
    @staticmethod
    def hitting_percentage(kills: int, errors: int, attempts: int) -> float:
        if attempts == 0:
            return 0.0
        return (kills - errors) / attempts * 100
    
    @staticmethod
    def kill_percentage(kills: int, attempts: int) -> float:
        if attempts == 0:
            return 0.0
        return kills / attempts * 100
    
    @staticmethod
    def serve_percentage(serves: int, errors: int) -> float:
        if serves == 0:
            return 0.0
        return (serves - errors) / serves * 100
    
    @staticmethod
    def reception_percentage(perfect: int, positive: int, attempts: int) -> float:
        if attempts == 0:
            return 0.0
        return (perfect + positive) / attempts * 100
    
    @staticmethod
    def reception_error_rate(errors: int, attempts: int) -> float:
        if attempts == 0:
            return 0.0
        return errors / attempts * 100
    
    @staticmethod
    def assist_percentage(assists: int, attempts: int) -> float:
        if attempts == 0:
            return 0.0
        return assists / attempts * 100
    
    @staticmethod
    def blocks_per_set(blocks: int, sets: int) -> float:
        if sets == 0:
            return 0.0
        return blocks / sets
    
    @staticmethod
    def digs_per_set(digs: int, sets: int) -> float:
        if sets == 0:
            return 0.0
        return digs / sets
```

---

## 12.12 Playing Time Calculation

### 12.12.1 Time Tracking

```python
class PlayingTimeCalculator:
    def __init__(self):
        self.player_sessions: Dict[str, PlayingSession] = {}
    
    def on_substitution(self, event: SubstitutionEvent):
        """Player exits."""
        if event.player_out_id in self.player_sessions:
            session = self.player_sessions[event.player_out_id]
            session.end_time = event.timestamp
            session.duration = session.end_time - session.start_time
    
    def on_player_entry(self, event: SubstitutionEvent):
        """Player enters."""
        self.player_sessions[event.player_in_id] = PlayingSession(
            player_id=event.player_in_id,
            start_time=event.timestamp
        )
    
    def on_set_end(self, match_id: int):
        """Finalize all active players at set end."""
        for session in self.player_sessions.values():
            if session.end_time is None:
                session.end_time = datetime.now()
                session.duration = session.end_time - session.start_time
    
    def get_playing_time(self, player_id: str) -> timedelta:
        return self.player_sessions.get(player_id, PlayingSession()).duration
```

---

## 12.13 Distance & Speed Calculation

### 12.13.1 Movement Integration

```python
def calculate_movement_metrics(track: PlayerTrack, 
                               homography: np.ndarray) -> MovementMetrics:
    """
    Calculate movement from court-coordinate trajectory.
    """
    positions = track.trajectory  # List of (x, y, frame_id) in meters
    if len(positions) < 2:
        return MovementMetrics()
    
    total_distance = 0.0
    speeds = []
    
    for i in range(1, len(positions)):
        p1 = np.array(positions[i-1][:2])
        p2 = np.array(positions[i][:2])
        dist = np.linalg.norm(p2 - p1)
        total_distance += dist
        
        dt = (positions[i][2] - positions[i-1][2]) / 30.0  # seconds at 30 FPS
        if dt > 0:
            speeds.append(dist / dt * 3.6)  # km/h
    
    return MovementMetrics(
        total_distance_m=total_distance,
        avg_speed_kmh=np.mean(speeds) if speeds else 0.0,
        max_speed_kmh=np.max(speeds) if speeds else 0.0,
        distance_per_set=total_distance  # Simplified
    )
```

---

## 12.14 Jump Statistics

### 12.14.1 Jump Aggregation

```python
@dataclass
class JumpStatistics:
    total_jumps: int = 0
    attack_jumps: int = 0
    block_jumps: int = 0
    serve_jumps: int = 0
    max_height_cm: float = 0.0
    avg_height_cm: float = 0.0
    jump_fatigue_index: float = 0.0  # Height decay over match
    
    @property
    def height_consistency(self) -> float:
        if self.total_jumps < 2:
            return 0.0
        heights = self._all_heights()
        return 1.0 - (np.std(heights) / np.mean(heights))
```

### 12.14.2 Jump Classification

| Jump Type | Trigger |
|-----------|---------|
| **Attack Jump** | Spike action + jump detected |
| **Block Jump** | Block action + jump detected |
| **Serve Jump** | Jump serve action + jump detected |
| **Other** | Jump without associated action |

---

## 12.15 Heat Map Statistics

### 12.15.1 Grid-Based Heatmaps

```python
class HeatmapGenerator:
    GRID_COLS = 12
    GRID_ROWS = 6  # 1.5m × 1.5m cells on 18×9m court
    
    def generate(self, events: List[ActionEvent], 
                 player_id: str, set_number: Optional[int] = None) -> HeatmapData:
        grid = np.zeros((self.GRID_ROWS, self.GRID_COLS), dtype=int)
        
        for event in events:
            if event.player_id != player_id:
                continue
            if set_number and event.set_number != set_number:
                continue
            
            x, y = event.court_position
            col = min(int(x / 1.5), self.GRID_COLS - 1)
            row = min(int(y / 1.5), self.GRID_ROWS - 1)
            grid[row, col] += 1
        
        return HeatmapData(
            player_id=player_id,
            grid=grid.tolist(),
            total_events=grid.sum(),
            zones=self._aggregate_zones(grid)
        )
    
    def _aggregate_zones(self, grid: np.ndarray) -> Dict[str, int]:
        """Aggregate to 6 volleyball zones."""
        return {
            "zone_1": int(grid[5, :2].sum()),      # Right Back
            "zone_2": int(grid[2, :2].sum()),      # Right Front
            "zone_3": int(grid[2, 4:8].sum()),     # Middle Front
            "zone_4": int(grid[2, 10:].sum()),     # Left Front
            "zone_5": int(grid[5, 10:].sum()),     # Left Back
            "zone_6": int(grid[5, 4:8].sum()),     # Middle Back
        }
```

---

## 12.16 Match Rating

### 12.16.1 Configurable Rating Formula

```python
@dataclass
class RatingWeights:
    kills: float = 30.0
    blocks: float = 20.0      # solo + assist
    assists: float = 15.0
    digs: float = 15.0
    aces: float = 10.0
    reception_quality: float = 10.0  # perfect=3, good=2, poor=1
    service_errors: float = -5.0
    attack_errors: float = -8.0
    reception_errors: float = -5.0
    setting_errors: float = -5.0
    net_touches: float = -10.0
    rotation_faults: float = -10.0

def calculate_match_rating(stats: PlayerStatistics, 
                           weights: RatingWeights) -> float:
    rec_quality = (stats.perfect_receptions * 3 + 
                   stats.positive_receptions * 2 + 
                   stats.poor_receptions * 1)
    
    score = (
        stats.kills * weights.kills +
        (stats.solo_blocks + stats.block_assists) * weights.blocks +
        stats.assists * weights.assists +
        stats.digs * weights.digs +
        stats.aces * weights.aces +
        rec_quality * weights.reception_quality / 6.0 +
        stats.service_errors * weights.service_errors +
        stats.attack_errors * weights.attack_errors +
        stats.reception_errors * weights.reception_errors +
        stats.setting_errors * weights.setting_errors
    )
    return round(score, 2)
```

### 12.16.2 Season Rating (Recency Weighted)

```python
def calculate_season_rating(player_id: str, season_id: int) -> float:
    matches = get_player_matches(player_id, season_id)
    if not matches:
        return 0.0
    
    total_weight = 0.0
    weighted_sum = 0.0
    
    for i, match in enumerate(reversed(matches)):  # Most recent first
        weight = math.exp(-i * 0.1)  # Exponential decay
        match_rating = calculate_match_rating(match.stats, RatingWeights())
        weighted_sum += match_rating * weight
        total_weight += weight
    
    return round(weighted_sum / total_weight, 2)
```

---

## 12.17 Error Handling & Corrections

### 12.17.1 Correction Pipeline

```python
async def apply_correction(correction: StatisticCorrection, 
                           stats_engine: StatisticsEngine):
    """
    Apply a statistic correction with full audit trail.
    """
    async with stats_engine.db.transaction():
        # 1. Reverse original
        await stats_engine.apply_deltas(
            correction.player_id, 
            {k: -v for k, v in correction.original_deltas.items()}
        )
        
        # 2. Apply corrected
        await stats_engine.apply_deltas(
            correction.player_id, 
            correction.corrected_deltas
        )
        
        # 3. Update team aggregates
        await stats_engine.recompute_team_aggregates(
            correction.match_id, correction.team_id
        )
        
        # 4. Audit log
        await stats_engine.audit_log.log(StatCorrectionLog(
            correction_id=correction.id,
            player_id=correction.player_id,
            original_deltas=correction.original_deltas,
            corrected_deltas=correction.corrected_deltas,
            corrected_by=correction.corrected_by,
            reason=correction.reason,
            timestamp=datetime.utcnow()
        ))
        
        # 5. Invalidate & push
        await stats_engine.invalidate_and_push(correction.match_id)
```

### 12.17.2 Audit Trail

```sql
CREATE TABLE stat_corrections (
    id UUID PRIMARY KEY,
    match_id INT,
    player_id UUID,
    original_deltas JSONB,
    corrected_deltas JSONB,
    corrected_by UUID,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 12.18 Historical Statistics

### 12.18.1 Storage Tiers

| Tier | Data | Retention | Storage |
|------|------|-----------|---------|
| **Live** | Current match stats | Match + 1h | Redis |
| **Recent** | Last 30 days | 30 days | PostgreSQL |
| **Season** | Aggregated season stats | 5 years | PostgreSQL (partitioned) |
| **Career** | Career aggregates | Permanent | PostgreSQL |
| **Archive** | Raw events + stats | 7 years | S3/MinIO (cold) |

### 12.18.2 Aggregation Pipeline

```python
async def aggregate_season_stats(season_id: int):
    """Nightly job to recompute season aggregates."""
    for player in get_active_players(season_id):
        matches = get_player_matches(player.id, season_id)
        
        career_stats = aggregate_career_stats(player.id, matches)
        season_stats = aggregate_season_stats(player.id, matches)
        
        await db.upsert_player_stats(player.id, season_id, season_stats)
        await db.upsert_player_career(player.id, career_stats)
        
        # Team aggregates
        for team in get_player_teams(player.id, season_id):
            await recompute_team_season_stats(team.id, season_id)
```

---

## 12.19 Output Specification

### 12.19.1 API Response Format

```json
{
  "status": "success",
  "data": {
    "player_statistics": {
      "player_id": "player_008",
      "match_id": 1001,
      "serving": {
        "total_serves": 12,
        "aces": 2,
        "errors": 1,
        "serve_pct": 91.7
      },
      "attacking": {
        "attempts": 28,
        "kills": 15,
        "errors": 3,
        "blocked": 2,
        "kill_pct": 53.6,
        "efficiency": 35.7
      },
      "blocking": {
        "solo": 1,
        "assists": 2,
        "errors": 0
      },
      "defense": {
        "digs": 8,
        "saves": 1
      },
      "movement": {
        "distance_m": 3420,
        "avg_speed_kmh": 4.2,
        "max_speed_kmh": 18.5
      }
    }
  },
  "meta": {
    "timestamp": "2026-07-15T14:32:17.670Z",
    "version": "v1.2.0"
  }
}
```

---

## 12.20 Integration with Other Modules

| Module | Consumes |
|--------|----------|
| **Live Dashboard** | Real-time stat updates via WebSocket |
| **Match Reports** | Post-match PDF/CSV generation |
| **Player Profiles** | Career/season aggregates |
| **Team Profiles** | Aggregate team analytics |
| **Tournament Management** | Standings, leaderboards |
| **AI Insights** | Rating engine, predictions |
| **Performance Prediction** | Trend analysis input |
| **Coach Analytics** | Custom queries, exports |
| **Public API** | Fan-facing statistics |

---

## 12.21 Performance Requirements

| Metric | Target |
|--------|--------|
| **Event → Dashboard Latency** | < 500ms |
| **Event Processing Throughput** | 1000 events/sec |
| **Concurrent Matches** | 20+ |
| **Query Latency (P95)** | < 100ms |
| **Uptime** | 99.9% |
| **Data Durability** | Zero loss (synchronous replication) |

---

## 12.22 Future Enhancements

| Enhancement | Description |
|-------------|-------------|
| **Advanced Efficiency Metrics** | Weighted by situation (clutch, transition) |
| **Lineup Impact Analysis** | +/- statistics per rotation |
| **Clutch Performance** | High-leverage moment stats |
| **Momentum Tracking** | Point streak detection |
| **Fatigue-Adjusted Stats** | Per-set degradation curves |
| **Personalized Benchmarks** | Player vs. historical self |
| **AI Tactical Summaries** | Auto-generated match narratives |
| **Interactive Visualizations** | Drill-down dashboards |

---

## 12.23 Chapter Summary

The Automated Statistics Generation Engine converts validated volleyball events into official statistics for players, teams, sets, and matches. By applying configurable volleyball rules, calculating derived metrics, and maintaining historical records, it enables fully automated analytics without manual scorekeeping.

**Key Decisions:**
- **Centralized formula registry** for consistency
- **Transactional event processing** with audit trail
- **Configurable rule engine** for volleyball rules
- **Rally-based context** for contextual statistics
- **Real-time WebSocket push** for live dashboards
- **Correction pipeline** with full audit trail
- **Multi-tier storage** (Redis → PostgreSQL → S3)
- **Configurable rating weights** for match/season ratings

*This engine is the operational heart of the Volleyball Analytics Platform, ensuring that every recognized action contributes accurately to live dashboards, reports, and long-term performance analysis.*

---

## Transition to Chapter 13

With statistics generated, the next module provides AI-driven insights and predictions.

**Chapter 13 — AI Decision Engine** will cover:

- Player rating algorithms
- Match prediction models
- Tactical recommendation engine
- Anomaly detection
- Automated coaching insights
- Performance trend analysis

*The Decision Engine transforms raw statistics into actionable intelligence for coaches, analysts, and players.*

---

**END OF CHAPTER 12**

*Next: Chapter 13 — AI Decision Engine*