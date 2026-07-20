# VOLUME 2: AI ENGINEERING & COMPUTER VISION IMPLEMENTATION SPECIFICATION (AECVIS)

**Version:** 1.0  
**Date:** July 15, 2026  
**Status:** Active Development

---

# CHAPTER 8: PLAYER TRACKING AI

---

## 8.1 Purpose

The Player Tracking AI module assigns and maintains persistent identities for all detected players throughout a volleyball match, transforming frame-level detections into continuous trajectories.

Its objectives are to:

- Assign and maintain persistent Track IDs for every player
- Track player movement across frames with court-coordinate precision
- Handle occlusions, crossings, and temporary disappearances
- Generate smooth, accurate movement trajectories
- Provide stable input for pose estimation, action recognition, and statistics
- Operate at real-time frame rates (≥30 FPS)

---

## 8.2 Role Within the AI Pipeline

```
Court Detection
       │
       ▼
Player Detection  ──► Ball Detection
       │                │
       └───────┬────────┘
               ▼
       Player Tracking  ◄── Ball Tracking
               │
               ▼
       Pose Estimation
               │
               ▼
      Action Recognition
               │
               ▼
      Statistics Engine
```

Tracking bridges frame-level perception and temporal understanding.

---

## 8.3 Functional Requirements

| Requirement | Target |
|-------------|--------|
| **Identity Preservation (MOTA)** | ≥ 0.90 |
| **ID Switch Rate** | < 2 per 1000 frames |
| **Track Fragmentation** | < 5% of tracks |
| **Occlusion Recovery** | ≤ 30 frames (1 second) |
| **Inference Latency** | < 10ms/frame (GPU) |
| **Max Simultaneous Tracks** | 14 (12 players + 2 officials) |
| **Track Initialization** | ≤ 3 detections |

---

## 8.4 Tracking Algorithm: ByteTrack

### 8.4.1 Algorithm Selection

| Algorithm | Pros | Cons | Decision |
|-----------|------|------|----------|
| **ByteTrack** | High MOTA, uses low-conf detections, fast | Simple association | **Primary** |
| **BoT-SORT** | Better ReID, camera motion compensation | Slower, complex | Fallback |
| **DeepSORT** | Appearance features | Slow, heavy | Legacy |
| **OC-SORT** | Better occlusion handling | Newer, less tested | Evaluation |

**Primary:** ByteTrack (v2.0+) with Kalman filter + IoU association  
**Fallback:** BoT-SORT for challenging multi-camera scenarios

### 8.4.2 ByteTrack Configuration

```yaml
# configs/tracking/bytetrack.yaml
bytetrack:
  # Detection thresholds
  track_thresh: 0.5        # High-conf detections → track
  track_buffer: 30         # Frames to keep lost track alive
  match_thresh: 0.8        # IoU threshold for association
  min_box_area: 100        # Ignore tiny detections
  mot20: false             # Not MOT20 dataset
  
  # Low-confidence detection handling
  low_conf_thresh: 0.1     # Low-conf detections for recovery
  low_conf_match_thresh: 0.5
  
  # Kalman filter
  kalman:
    dt: 0.0333             # 30 FPS
    process_noise: 0.01
    measurement_noise: 0.1
    
  # Association
  association:
    iou_weight: 1.0
    use_reid: false        # ByteTrack doesn't use ReID
    max_dist: 0.7          # Max IoU distance for match
```

---

## 8.5 Track Lifecycle

### 8.5.1 Track States

```
NEW (tentative)
    │  3 consecutive detections
    ▼
TRACKED (confirmed)
    │  detection matched
    ▼
TEMPORARILY_LOST (no match ≤ buffer)
    │  detection matched
    ▼
TRACKED
    │
    │  lost > buffer frames
    ▼
REMOVED
```

### 8.5.2 Track Data Structure

```python
@dataclass
class PlayerTrack:
    track_id: int
    state: TrackState          # NEW, TRACKED, LOST, REMOVED
    team: Optional[str]        # "home" / "away" / None
    jersey_number: Optional[int]
    bbox: Tuple[float, float, float, float]  # xywh normalized
    court_position: Tuple[float, float]      # meters
    confidence: float
    frame_id: int
    timestamp_ms: int
    
    # Kalman filter state
    kalman_state: np.ndarray   # [x, y, vx, vy]
    kalman_covariance: np.ndarray
    
    # History
    trajectory: List[Tuple[float, float, int]]  # (x, y, frame_id)
    team_confidence: float
    age: int                   # Frames since creation
    hits: int                  # Consecutive detections
    time_since_update: int     # Frames since last match
```

---

## 8.6 Data Association

### 8.6.1 Association Pipeline

```
Frame N-1 Tracks          Frame N Detections
       │                         │
       ▼                         ▼
┌─────────────────────────────────────┐
│        IOU Distance Matrix          │
│    (1 - IoU) for each pair          │
└─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────┐
│       Hungarian Algorithm           │
│     (Minimize total cost)           │
└─────────────────────────────────────┘
                    │
         ┌──────────┴──────────┐
         ▼                     ▼
    Matched Pairs          Unmatched
    (Track ← Det)         Tracks / Dets
         │                     │
         ▼                     ▼
   Update Kalman          Create New / 
   Predict Next           Age Out
```

### 8.6.2 Association Costs

| Factor | Weight | Details |
|--------|--------|---------|
| **IoU** | 1.0 | Primary; 1 - IoU(bbox1, bbox2) |
| **Center Distance** | 0.3 | Normalized Euclidean in court coords |
| **Team Consistency** | 0.2 | Penalty if team assignment flips |
| **Jersey Match** | 0.5 | Bonus if OCR numbers agree |

---

## 8.7 Occlusion Handling

### 8.7.1 Occlusion Types

| Type | Duration | Strategy |
|------|----------|----------|
| **Partial** | 1-5 frames | Box shrinks; mark `occluded=true` |
| **Full (crossing)** | 5-15 frames | Kalman coast; maintain ID |
| **Full (net play)** | 15-30 frames | Strong prediction; appearance features |
| **Complete loss** | > 30 frames | Age out; re-identify on reappearance |

### 8.7.2 Occlusion Recovery

```python
def handle_occlusion(track: PlayerTrack, detections: List[Detection]) -> PlayerTrack:
    track.time_since_update += 1
    
    # Predict position
    predicted = track.kalman.predict()
    track.court_position = predicted[:2]
    
    # Search nearby detections
    candidates = find_nearby_detections(
        predicted, detections, 
        max_distance=2.0  # meters
    )
    
    if candidates:
        best = select_best_match(track, candidates)
        if best:
            track = update_track(track, best)
            track.time_since_update = 0
    
    return track
```

### 8.7.3 Appearance Features (Future)

| Feature | Use Case |
|---------|----------|
| **Jersey Color Histogram** | Team + player distinction |
| **Jersey Number (OCR)** | Strong identity cue |
| **Body Shape/Height** | Distinguish similar players |
| **ReID Embedding** | Cross-camera, long-term |

---

## 8.8 Identity Preservation

### 8.8.1 ID Switch Prevention

| Scenario | Prevention |
|----------|------------|
| **Crossing paths** | Trajectory prediction + IoU continuity |
| **Similar jerseys** | Team color + OCR number + position |
| **Net occlusion** | Kalman prediction through net |
| **Bench entry/exit** | Zone-based track termination |

### 8.8.2 Identity Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **ID Switches** | < 2/1000 frames | TrackEval |
| **IDF1** | ≥ 0.85 | TrackEval |
| **Track Fragmentation** | < 5% | TrackEval |
| **MOTA** | ≥ 0.90 | TrackEval |

---

## 8.9 Track Confidence & Quality

```python
@dataclass
class TrackQuality:
    track_id: int
    detection_rate: float      # Detections / total frames
    avg_confidence: float      # Mean detection confidence
    occlusion_ratio: float     # Frames occluded / total
    id_switches: int           # Count of ID changes
    fragmentation: int         # Number of track fragments
    avg_position_error: float  # Meters (if ground truth)
    smoothness: float          # Trajectory jerk metric
```

---

## 8.10 Ball Tracking

### 8.10.1 Ball Track Specifics

| Aspect | Difference from Players |
|--------|------------------------|
| **Single object** | Only one ball per rally |
| **High speed** | Kalman process noise higher |
| **Frequent occlusion** | Behind players, net |
| **Contact events** | Velocity discontinuities |
| **Trajectory physics** | Parabolic + spin effects |

### 8.10.2 Ball Track Structure

```python
@dataclass
class BallTrack:
    track_id: int = 1  # Always 1
    state: TrackState
    detections: List[BallDetection]
    kalman_3d: KalmanFilter  # [x, y, z, vx, vy, vz]
    trajectory_3d: List[Tuple[float, float, float]]
    velocities: List[Tuple[float, float, float]]  # m/s
    contacts: List[ContactEvent]
    speed_kmh: List[float]
    last_update: int
```

---

## 8.10 Multi-Camera Track Fusion

### 8.10.1 Fusion Strategy

```
Camera 1 Tracks  ──┐
Camera 2 Tracks  ──┼──► Fuse in Court Space (meters) ──► Unified Tracks
Camera 3 Tracks  ──┘
```

### 8.10.2 Fusion Algorithm

```python
def fuse_tracks(camera_tracks: Dict[str, List[PlayerTrack]]) -> List[PlayerTrack]:
    """
    1. Project all tracks to court coordinates (meters)
    2. Cluster tracks within distance threshold (0.5m)
    3. For each cluster:
       - Weight by camera confidence
       - Average positions
       - Merge trajectories
       - Resolve ID conflicts (prefer higher confidence)
    4. Output unified track with multi-camera metadata
    """
    pass
```

---

## 8.11 Trajectory Output

### 8.11.1 Trajectory Format

```json
{
  "track_id": 101,
  "player_id": "player_008",
  "team": "home",
  "jersey_number": 8,
  "trajectory": [
    {"frame": 24800, "timestamp": "14:32:17.120", "x": 9.2, "y": 4.1, "zone": 4},
    {"frame": 24801, "timestamp": "14:32:17.153", "x": 9.4, "y": 4.2, "zone": 4},
    {"frame": 24802, "timestamp": "14:32:17.186", "x": 9.7, "y": 4.3, "zone": 4}
  ],
  "metrics": {
    "distance_m": 45.2,
    "avg_speed_kmh": 4.8,
    "max_speed_kmh": 12.3,
    "zones_visited": [4, 3, 6, 1],
    "time_in_zone": {"4": 12.3, "3": 8.7, "6": 4.2, "1": 3.1}
  }
}
```

---

## 8.12 Performance Metrics

| Metric | Definition | Target |
|--------|------------|--------|
| **MOTA** | Multiple Object Tracking Accuracy | ≥ 0.90 |
| **MOTP** | Multiple Object Tracking Precision | ≥ 0.85 |
| **IDF1** | ID F1 Score | ≥ 0.85 |
| **ID Switches** | Per 1000 frames | < 2 |
| **FP Rate** | False positives / frame | < 0.05 |
| **FN Rate** | Missed detections / frame | < 0.05 |
| **Latency** | Frame → Track update | < 10ms |

---

## 8.13 Module Interface

### 8.13.1 Input

```python
@dataclass
class TrackingInput:
    frame: np.ndarray
    frame_id: int
    timestamp_ms: int
    player_detections: List[PlayerDetection]
    ball_detection: Optional[BallDetection]
    court_homography: np.ndarray  # image → court
    camera_calibration: CameraCalibration
```

### 8.13.2 Output

```python
@dataclass
class TrackingOutput:
    frame_id: int
    timestamp_ms: int
    player_tracks: List[PlayerTrack]
    ball_track: Optional[BallTrack]
    events: List[TrackEvent]  # NEW_TRACK, LOST_TRACK, RECOVERED, ID_SWITCH
    processing_time_ms: float
```

---

## 8.14 Testing & Validation

### 8.14.1 Unit Tests

```python
def test_track_initialization():
    tracker = PlayerTracker(default_config)
    det = create_detection(bbox=[0.5, 0.4, 0.1, 0.2], conf=0.9)
    tracks = tracker.update([det], frame_id=1, H=np.eye(3))
    assert len(tracks) == 1
    assert tracks[0].state == TrackState.NEW
    assert tracks[0].hits == 1

def test_occlusion_recovery():
    tracker = PlayerTracker(default_config)
    # Establish track
    for i in range(5):
        tracker.update([create_detection(track_id=101)], i, H)
    # Simulate occlusion
    for i in range(10):
        tracker.update([], i+5, H)
    # Reappear
    track = tracker.update([create_detection(track_id=101)], 15, H)
    assert track.track_id == 101
    assert track.state == TrackState.TRACKED

def test_id_switch_prevention():
    # Two players cross paths
    pass
```

---

## 8.15 Deployment Considerations

| Aspect | Recommendation |
|--------|----------------|
| **Format** | ONNX/TensorRT for Kalman (CPU) |
| **Concurrency** | Single-threaded per camera |
| **Memory** | ~50MB (14 tracks × history) |
| **Scaling** | One tracker instance per camera |
| **State Sync** | Redis for multi-camera fusion |

---

## 8.15 Future Enhancements

| Feature | Description |
|---------|-------------|
| **BoT-SORT Integration** | ReID embeddings for long-term re-ID |
| **3D Multi-Camera Fusion** | Volumetric tracking |
| **Player Role Inference** | Setter, libero, OH, MB, OPP from trajectory |
| **Formation Recognition** | 5-1, 6-2, 4-2 systems auto-detection |
| **Fatigue Tracking** | Speed/acceleration decay over sets |
| **Cross-Match Identity** | Season-long player profiles |

---

## 8.16 Chapter Summary

Player Tracking AI transforms independent detections into continuous player identities — the prerequisite for action recognition, statistics, and player-centric analytics.

**Key Decisions:**
- **ByteTrack** for speed and low-confidence utilization
- **Kalman filter** with court-coordinate state space
- **IoU + team + jersey** association cost
- **30-frame buffer** for occlusion recovery
- **Court-coordinate trajectories** for analytics

*Output: Per-frame `List[PlayerTrack]` with court positions, velocities, and IDs → feeds Pose Estimation, Action Recognition, Statistics Engine, Heat Maps.*

---

## Transition to Chapter 9

With players and ball tracked, the next module reads identity from the jersey.

**Chapter 9 — Jersey Number Recognition (OCR)** will cover:

- Torso crop extraction
- OCR engine selection (PaddleOCR/EasyOCR)
- Temporal smoothing via track history
- Confidence thresholds and fallback
- Integration with track identity

*Jersey OCR closes the loop between anonymous Track IDs and known player identities — enabling named statistics and personalized analytics.*

---

**END OF CHAPTER 8**

*Next: Chapter 9 — Jersey Number Recognition (OCR)*