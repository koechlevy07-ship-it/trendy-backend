# VOLUME 2: AI ENGINEERING & COMPUTER VISION IMPLEMENTATION SPECIFICATION (AECVIS)

**Version:** 1.0  
**Date:** July 15, 2026  
**Status:** Active Development

---

# CHAPTER 11: VOLLEYBALL ACTION RECOGNITION AI

---

## 11.1 Purpose

The Volleyball Action Recognition AI module identifies and classifies volleyball-specific actions performed by players during a match.

Its objectives are to:

- Recognize volleyball actions automatically
- Determine which player performed each action
- Identify action timing
- Support automatic statistics generation
- Enable tactical analysis
- Operate continuously in real time

---

## 11.2 Role Within the AI Pipeline

Action Recognition combines information from nearly every previous AI module.

```
Court Detection
      │
Player Detection
      │
Ball Detection
      │
Object Tracking
      │
Jersey Recognition
      │
Pose Estimation
      │
      ▼
Action Recognition
      │
      ▼
Statistics Engine
```

Rather than relying on a single source, it interprets the match using spatial, temporal, and contextual information.

---

## 11.3 Inputs

The Action Recognition AI receives:

| Input | Source | Purpose |
|-------|--------|---------|
| Player identities | Jersey OCR + Tracking | Attribute actions to players |
| Player trajectories | Player Tracking | Movement patterns, zones |
| Ball trajectory | Ball Tracking | Contact points, speed, direction |
| Player poses | Pose Estimation | Body posture, joint angles |
| Court coordinates | Court Detection | Zone mapping, spatial context |
| Team information | Roster + Tracking | Team-level attribution |
| Time sequence data | Frame timestamps | Temporal ordering, duration |

These combined inputs allow the system to understand interactions between players and the ball.

---

## 11.4 Functional Requirements

| Requirement | Target |
|-------------|--------|
| **Action Classes** | 29 volleyball action types |
| **Classification Accuracy** | ≥ 85% (macro F1) |
| **Temporal Accuracy** | ±1 frame for boundaries |
| **Inference Latency** | < 20ms/frame (GPU) |
| **Concurrent Actions** | Up to 6 simultaneous |
| **Temporal Resolution** | 30-frame sequence (1 sec @ 30 FPS) |

The module shall:
- Recognize volleyball actions
- Associate actions with players
- Determine action start and end times
- Assign confidence scores
- Support real-time inference
- Handle multiple simultaneous actions
- Maintain chronological event ordering

---

## 11.5 Action Recognition Pipeline

```
Player Pose (33 keypoints × 30 frames)
      │
Ball Trajectory (3D position × 30 frames)
      │
Player Trajectories (court coords × 30 frames)
      │
Court Zone + Team Context
      │
      ▼
Temporal Encoder (Bi-LSTM / Transformer)
      │
      ▼
Action Classifier (30-frame window)
      │
      ▼
Rule-Based Validation
      │
      ▼
Confidence Calibration
      │
      ▼
Action Event
```

---

## 11.6 Volleyball Action Taxonomy (29 Classes)

| Category | Action ID | Name | Description |
|----------|-----------|------|-------------|
| **Serving** | 0 | `serve` | Standard serve |
| | 1 | `jump_serve` | Jump serve (topspin) |
| | 2 | `float_serve` | Float serve |
| | 3 | `jump_float_serve` | Jump float serve |
| | 4 | `ace` | Serve lands untouched |
| | 5 | `service_error` | Serve fault (net/out) |
| **Receiving** | 6 | `reception` | First contact on serve |
| | 7 | `perfect_reception` | High-quality pass (target zone) |
| | 8 | `positive_reception` | Playable pass |
| | 9 | `poor_reception` | Scrambled but playable |
| | 10 | `reception_error` | Shanked/aced |
| **Setting** | 11 | `set` | Overhead placement |
| | 12 | `assist` | Set leading to kill |
| | 13 | `jump_set` | Set while airborne |
| | 14 | `back_set` | Set behind setter |
| | 15 | `setting_error` | Double/carry/lift |
| | 16 | `overpass` | Ball goes over on 2nd contact |
| **Attacking** | 17 | `spike` | Jump attack |
| | 18 | `tip` | Soft touch over block |
| | 19 | `roll_shot` | Off-speed attack |
| | 20 | `kill` | Attack scores point |
| | 21 | `attack_error` | Out/net/blocked out |
| | 22 | `blocked_attack` | Returned by block |
| **Blocking** | 23 | `block` | Jump at net, hands up |
| | 24 | `solo_block` | Single blocker scores |
| | 25 | `block_assist` | Multi-blocker scores |
| | 26 | `block_touch` | Touched, not point |
| | 27 | `block_error` | Net touch/penetration |
| **Defense** | 28 | `dig` | Hard-driven ball saved |
| | 29 | `save` | Emergency keep-in-play |
| | 30 | `emergency_save` | Pancake, sprawl |
| **Other** | 31 | `free_ball` | Easy ball over net |
| | 32 | `overpass` | 2nd contact goes over |
| | 33 | `double_contact` | Illegal double touch |
| | 34 | `lift` | Illegal carry |

**Total: 34 action classes** (configurable subset per deployment)

---

## 11.7 Temporal Action Recognition

### 11.7.1 Sequence-Based Classification

Many volleyball actions span multiple frames. The AI analyzes fixed-length temporal windows:

| Action | Typical Duration | Frames @ 30 FPS |
|--------|-----------------|-----------------|
| Serve | 0.8–1.5 sec | 24–45 |
| Reception | 0.3–0.6 sec | 9–18 |
| Set | 0.4–0.8 sec | 12–24 |
| Spike | 0.5–1.0 sec | 15–30 |
| Block | 0.4–0.7 sec | 12–21 |
| Dig | 0.2–0.5 sec | 6–15 |

**Window Size:** 30 frames (1 second @ 30 FPS), stride 5 frames

### 11.7.2 Temporal Encoder

```python
class TemporalActionEncoder(nn.Module):
    def __init__(self, input_dim=256, hidden_dim=256, num_layers=2):
        super().__init__()
        self.encoder = nn.LSTM(
            input_size=input_dim,
            hidden_size=hidden_dim,
            num_layers=num_layers,
            bidirectional=True,
            batch_first=True,
            dropout=0.2
        )
        self.classifier = nn.Linear(hidden_dim * 2, num_actions)
    
    def forward(self, seq):  # [B, T, D]
        out, _ = self.encoder(seq)
        return self.classifier(out[:, -1])  # Last timestep
```

### 11.7.3 Input Features per Frame (256-dim)

| Feature Group | Dimensions | Description |
|---------------|------------|-------------|
| **Player Pose** | 99 | 33 keypoints × 3 (x, y, conf) |
| **Ball State** | 7 | Position (3), velocity (3), speed |
| **Player Traj** | 12 | 4 players × (dx, dy, speed) |
| **Court Context** | 12 | Zone, side, rotation, score |
| **Interaction** | 10 | Ball-player distances, contacts |
| **Team/Role** | 8 | One-hot: team, position, rotation |
| **Total** | **256** | Concatenated |

---

## 11.8 Ball–Player Interaction Detection

### 11.8.1 Contact Detection Rules

| Contact Type | Velocity Change | Direction Change | Proximity |
|--------------|----------------|------------------|-----------|
| **Serve** | High (+) | Large | Behind endline |
| **Reception** | High (-) | Large | Near endline |
| **Set** | Medium (+) | Medium | Hands above head |
| **Spike** | High (+) | Large | Jump + arm swing |
| **Block** | High (-) | Reversal | Net zone, hands up |
| **Dig** | High (-) | Large | Low posture |
| **Set (contact)** | Low | Small | Hands above head |

### 11.8.2 Contact Detection Algorithm

```python
def detect_ball_contact(ball_traj: BallTrajectory, 
                        player_tracks: List[PlayerTrack],
                        frame_idx: int) -> List[ContactEvent]:
    contacts = []
    
    # Velocity discontinuity
    if frame_idx > 0:
        v_before = ball_traj.velocities[frame_idx - 1]
        v_after = ball_traj.velocities[frame_idx]
        delta_v = np.linalg.norm(v_after - v_before)
        
        # Direction change
        angle = angle_between(ball_traj.velocities[frame_idx - 1],
                              ball_traj.velocities[frame_idx])
        
        if delta_v > CONTACT_V_THRESHOLD or angle > CONTACT_ANGLE_THRESHOLD:
            # Find closest player
            ball_pos = ball_traj.positions[frame_idx]
            for track in player_tracks:
                if track.is_active(frame_idx):
                    dist = distance(ball_pos, track.court_position)
                    if dist < CONTACT_DISTANCE_THRESHOLD:
                        contacts.append(ContactEvent(
                            frame=frame_idx,
                            player_id=track.track_id,
                            contact_type=classify_contact(delta_v, angle),
                            ball_speed=ball_traj.speeds[frame_idx]
                        ))
    return contacts
```

---

## 11.9 Contextual Disambiguation

### 11.9.1 Ambiguity Resolution

| Pose | Possible Actions | Disambiguation Cues |
|------|------------------|---------------------|
| Hands above head | Set, Block, Serve toss | Ball trajectory, net proximity, team |
| Jump + arm swing | Serve, Spike | Court position, ball height, team |
| Low posture | Dig, Reception | Ball direction, speed, court zone |
| Hands together | Set, Forearm pass | Ball height, contact point |

### 11.9.2 Context Features

| Context | Source | Weight |
|---------|--------|--------|
| **Ball trajectory** | Ball tracking | 0.35 |
| **Court zone** | Court coordinates | 0.20 |
| **Team possession** | Rally state | 0.15 |
| **Rally phase** | Rally event seq | 0.15 |
| **Player role** | Position + rotation | 0.10 |
| **Rule constraints** | Volleyball rules | 0.05 |

---

## 11.10 Multi-Player Interactions

| Interaction | Participants | Detection |
|-------------|--------------|-----------|
| **Block vs Spike** | 1–3 blockers + 1 attacker | Net proximity + opposing velocities |
| **Set → Spike** | Setter + Attacker | Ball trajectory + timing |
| **Reception → Set** | Receiver + Setter | Ball path + player roles |
| **Double Block** | 2 blockers | Adjacent tracks at net |
| **Triple Block** | 3 blockers | Three tracks at net |
| **Cover** | Attacker + defenders | Post-spike positioning |

---

## 11.11 Action Confidence Scoring

### 11.11.1 Confidence Components

| Component | Weight | Description |
|-----------|--------|-------------|
| **ML Classifier** | 0.50 | Transformer/LSTM output probability |
| **Rule Validation** | 0.20 | Volleyball rule compliance |
| **Context Consistency** | 0.15 | Zone, possession, rally phase match |
| **Temporal Consistency** | 0.10 | Smooth action boundaries |
| **Detection Quality** | 0.05 | Input detection confidences |

### 11.11.2 Confidence Thresholds

| Confidence | Action |
|------------|--------|
| **≥ 0.85** | Auto-accept; update stats |
| **0.70–0.85** | Accept; flag for review |
| **0.55–0.70** | Queue for statistician review |
| **< 0.55** | Discard; log as uncertain |

---

## 11.12 Action Timeline & Output

### 11.12.1 Action Event Format

```json
{
  "action_id": "act_20260715_143217_001",
  "match_id": 1001,
  "rally_number": 18,
  "sequence_number": 3,
  "action_type": "KILL",
  "player": {
    "track_id": 101,
    "player_id": "player_008",
    "name": "Jane Doe",
    "team": "home",
    "jersey": 7,
    "position": "Outside Hitter"
  },
  "team_id": 12,
  "start_frame": 24830,
  "end_frame": 24855,
  "start_timestamp": "2026-07-15T14:32:17.420Z",
  "end_timestamp": "2026-07-15T14:32:17.670Z",
  "duration_ms": 250,
  "court_zone": 4,
  "confidence": 0.96,
  "related_ball_track": "ball_001",
  "contact_frame": 24842,
  "contact_type": "spike",
  "metadata": {
    "jump_height_cm": 68,
    "ball_speed_kmh": 87,
    "contact_height_m": 3.1,
    "approach_angle": 45
  }
}
```

---

## 11.13 Rally Understanding

### 11.13.1 Rally State Machine

```
RALLY_START
    │
    ▼
SERVE (serve/ace/service_error)
    │
    ▼
RECEPTION (reception/perfect/poor/error)
    │
    ▼
FIRST_CONTACT (set/overpass)
    │
    ▼
ATTACK (spike/tip/roll_shot/kill/attack_error/blocked)
    │
    ├── POINT (kill/ace/block) ──► RALLY_END
    │
    ├── DEFENSE (dig/save/free_ball) ──▼
    │       ▼
    │    TRANSITION (set/counter) ──▶ BACK TO ATTACK
    │
    └── BLOCK (block/block_touch/error)
            │
            ├── POINT (block point) ──► RALLY_END
            └── CONTINUE ──► DEFENSE
```

### 11.13.2 Rally Analytics

```python
@dataclass
class RallyAnalysis:
    rally_number: int
    serving_team: str
    sequence: List[ActionEvent]
    duration_seconds: float
    total_contacts: int
    point_winner: str
    point_type: str  # KILL, ACE, BLOCK, OPP_ERROR, SERVICE_ERROR
    efficiency: float  # Points per rally
    sideout: bool
    break_point: bool
```

---

## 11.14 Rule-Aware Recognition

### 11.14.1 Embedded Volleyball Rules

| Rule | Implementation |
|------|----------------|
| **3 contacts max** | Track contact count per team per rally; flag 4th as error |
| **Block ≠ contact** | Block touch doesn't count toward 3 |
| **Double contact** | Flag consecutive contacts by same player (non-block) |
| **Lift/Carry** | Detect prolonged ball control during set |
| **Net touch** | Player bbox intersects net line during play |
| **Rotation order** | Validate server position at serve moment |
| **Libero restrictions** | No attack above net, no set from front zone |

### 11.14.2 Rule-Based Validation

```python
def validate_action(action: ActionEvent, rally_state: RallyState) -> ValidationResult:
    errors = []
    warnings = []
    
    # 3-contact rule
    if action.is_attack and rally_state.team_contacts[action.team] > 3:
        errors.append("Exceeds 3 contacts")
    
    # Block doesn't count
    if action.type == "block":
        rally_state.team_contacts[action.team] -= 1  # Don't count
    
    # Double contact
    if action.type == "set" and rally_state.last_contact_by == action.player:
        errors.append("Double contact")
    
    # Net touch
    if action.player_bbox_intersects_net:
        errors.append("Net touch violation")
    
    return ValidationResult(valid=len(errors)==0, errors=errors, warnings=warnings)
```

---

## 11.15 Ambiguity Handling

### 11.15.1 Uncertainty Categories

| Category | Trigger | Handling |
|----------|---------|----------|
| **Simultaneous contact** | Two players contact ball within 2 frames | Flag `simultaneous=true`; statistician review |
| **Heavy occlusion** | Player/ball bbox IoU > 0.7 for >5 frames | Mark `occluded=true`; lower confidence |
| **Poor camera angle** | Extreme perspective (e.g., behind net) | Flag `poor_view=true`; defer to other camera |
| **Unclear contact** | Ball velocity change < threshold | Flag `ambiguous_contact=true`; queue for review |

### 11.15.2 Uncertainty Output

```json
{
  "action_id": "act_...",
  "action_type": "SPIKE",
  "confidence": 0.68,
  "uncertainty_flags": ["occluded", "ambiguous_contact"],
  "review_required": true,
  "review_reason": "Ball contact occurred during heavy net occlusion; statistician review needed"
}
```

---

## 11.16 Integration with Statistics Engine

### 11.16.1 Action → Statistics Mapping

| Action | Stat Updates |
|--------|--------------|
| `serve` | `serves += 1` |
| `ace` | `aces += 1`, `points += 1` |
| `service_error` | `service_errors += 1`, `opp_points += 1` |
| `reception` | `reception_attempts += 1` |
| `perfect_reception` | `perfect_receptions += 1` |
| `reception_error` | `reception_errors += 1`, `opp_points += 1` |
| `set` | `set_attempts += 1` |
| `assist` | `assists += 1` |
| `setting_error` | `setting_errors += 1` |
| `spike` | `attack_attempts += 1` |
| `kill` | `kills += 1`, `points += 1` |
| `attack_error` | `attack_errors += 1`, `opp_points += 1` |
| `blocked_attack` | `blocked_attacks += 1` |
| `block` | `block_attempts += 1` |
| `solo_block` | `solo_blocks += 1`, `points += 1` |
| `block_assist` | `block_assists += 1`, `points += 1` |
| `dig` | `digs += 1` |
| `save` | `saves += 1` |
| `free_ball` | `free_balls += 1` |

### 11.16.2 Integration Code

```python
def process_action(action: ActionEvent, stats_engine: StatisticsEngine):
    if action.confidence < 0.7:
        stats_engine.queue_for_review(action)
        return
    
    if not stats_engine.validate_action(action):
        stats_engine.flag_inconsistency(action)
        return
    
    stats_engine.apply_action(action)
    stats_engine.update_live_dashboard()
```

---

## 11.17 Performance Metrics

| Metric | Target | Evaluation Method |
|--------|--------|-------------------|
| **Action Accuracy** | ≥ 85% | Macro F1 on test set |
| **Per-Class F1** | ≥ 80% | Per-class evaluation |
| **Temporal Accuracy** | ±1 frame | Boundary alignment |
| **Event Latency** | < 500ms | Frame → Dashboard |
| **False Action Rate** | < 2% | Per match |
| **Missed Action Rate** | < 5% | vs. statistician log |

### 11.17.1 Evaluation Protocol

| Phase | Dataset | Metrics |
|-------|---------|---------|
| **Validation** | 50 matches (unseen venues) | Per-class F1, confusion matrix |
| **Live Shadow** | 20 live matches | Real-time latency, stat diff vs. human |
| **A/B Test** | 10 matches | Coach preference, stat accuracy |

---

## 11.18 Future Enhancements

| Feature | Description |
|---------|-------------|
| **Tactical Pattern Recognition** | Detect 5-1, 6-2, 4-2 systems automatically |
| **Auto Play Classification** | "Quick attack", "Pipe", "Slide", "X-play" |
| **Opponent Scouting** | Serve placement patterns, attack tendencies |
| **AI Coaching Feedback** | "Middle blocker late on slide", "Setter dump rate low" |
| **Skill Technique Scoring** | Arm swing mechanics, footwork efficiency |
| **Opponent Tendency Analysis** | Serve zones by rotation, attack zones by player |

---

## 11.19 Chapter Summary

The Volleyball Action Recognition AI module interprets player movements and ball interactions to identify volleyball-specific actions such as serves, receptions, sets, spikes, blocks, digs, and kills. By combining temporal analysis, player pose, ball trajectory, court position, and volleyball rules, it transforms low-level computer vision outputs into meaningful match events.

**Key Decisions:**
- **34 action classes** covering all volleyball events
- **30-frame temporal window** (Bi-LSTM/Transformer encoder)
- **Multi-modal fusion**: pose + ball + trajectory + court context
- **Rule-aware validation** prevents illegal sequences
- **Confidence calibration** with review queue for uncertain events
- **Rally state machine** for contextual understanding
- **Direct statistics integration** with validation gates

*This module represents the core intelligence of the platform, enabling fully automated statistics generation and advanced tactical analysis without manual input.*

---

## Transition to Chapter 12

With actions recognized, the next module generates structured events and maintains rally state.

**Chapter 12 — Event Generation Engine** will cover:

- Event schema and canonical format
- Rally state machine
- Point/side-out determination
- Scorekeeping logic
- Real-time event streaming
- Event validation and correction

*Event generation transforms recognized actions into the canonical event stream that drives statistics, dashboards, and replays.*

---

**END OF CHAPTER 11**

*Next: Chapter 12 — Event Generation Engine*