# VOLUME 2: AI ENGINEERING & COMPUTER VISION IMPLEMENTATION SPECIFICATION (AECVIS)

**Version:** 1.0  
**Date:** July 15, 2026  
**Status:** Active Development

---

# CHAPTER 10: HUMAN POSE ESTIMATION AI

---

## 10.1 Purpose

The Human Pose Estimation AI module detects and tracks the body joints of each player throughout the match.

Its objectives are to:

- Detect body keypoints
- Estimate player skeletons
- Track joints over time
- Estimate player posture
- Support volleyball action recognition
- Provide biomechanical insights

---

## 10.2 Role Within the AI Pipeline

Pose estimation receives identified and tracked players as input.

```
Camera
    │
    ▼
Court Detection
    │
    ▼
Player Detection
    │
    ▼
Object Tracking
    │
    ▼
Jersey Recognition
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

Pose estimation converts player images into structured body movement data.

---

## 10.3 Functional Requirements

| Requirement | Target |
|-------------|--------|
| **Keypoint Detection** | 33 keypoints per player |
| **PCK@0.2** | ≥ 0.90 on validation set |
| **Inference Latency** | < 15ms/frame on GPU |
| **Multi-Player** | Up to 14 simultaneous |
| **Occlusion Handling** | Visible keypoints only |
| **Temporal Consistency** | Smooth trajectories |

The Pose Estimation AI shall:

- Detect body keypoints
- Estimate player skeletons
- Track joints over time
- Handle multiple players simultaneously
- Operate in real time
- Support partially visible players
- Produce confidence scores for each keypoint

---

## 10.4 Human Body Model

### 10.4.1 Keypoint Definition (33 Landmarks)

Based on MediaPipe Pose topology:

| Index | Name | Category |
|-------|------|----------|
| 0 | Nose | Head |
| 1 | Left eye inner | Head |
| 2 | Left eye | Head |
| 3 | Left eye outer | Head |
| 4 | Right eye inner | Head |
| 5 | Right eye | Head |
| 6 | Right eye outer | Head |
| 7 | Left ear | Head |
| 8 | Right ear | Head |
| 9 | Mouth left | Head |
| 10 | Mouth right | Head |
| 11 | Left shoulder | Torso |
| 12 | Right shoulder | Torso |
| 13 | Left elbow | Arm |
| 14 | Right elbow | Arm |
| 15 | Left wrist | Arm |
| 16 | Right wrist | Arm |
| 17 | Left pinky | Hand |
| 18 | Right pinky | Hand |
| 19 | Left index | Hand |
| 20 | Right index | Hand |
| 21 | Left thumb | Hand |
| 22 | Right thumb | Hand |
| 23 | Left hip | Torso |
| 24 | Right hip | Torso |
| 25 | Left knee | Leg |
| 26 | Right knee | Leg |
| 27 | Left ankle | Leg |
| 28 | Right ankle | Leg |
| 29 | Left heel | Foot |
| 30 | Right heel | Foot |
| 31 | Left foot index | Foot |
| 32 | Right foot index | Foot |

### 10.4.2 Skeleton Connectivity

```
Nose (0)
    │
    ├─► Left eye (1) ─ Left ear (7)
    ├─► Right eye (4) ─ Right ear (8)
    │
    ├─► Left shoulder (11) ─ Left elbow (13) ─ Left wrist (15)
    │                                    ├─► Left pinky (17)
    │                                    ├─► Left index (19)
    │                                    └─► Left thumb (21)
    │
    ├─► Right shoulder (12) ─ Right elbow (14) ─ Right wrist (16)
    │                                     ├─► Right pinky (18)
    │                                     ├─► Right index (20)
    │                                     └─► Right thumb (22)
    │
    ├─► Left hip (23) ─ Left knee (25) ─ Left ankle (27)
    │                            ├─► Left heel (29)
    │                            └─► Left foot index (31)
    │
    └─► Right hip (24) ─ Right knee (26) ─ Right ankle (28)
                                 ├─► Right heel (30)
                                 └─► Right foot index (32)
```

---

## 10.5 Pose Estimation Pipeline

```
Tracked Player (bbox + track_id)
         │
         ▼
Player Crop (from frame)
         │
         ▼
Pose Model Inference
         │
         ▼
Keypoints (33 × [x, y, visibility])
         │
         ▼
Skeleton Assembly
         │
         ▼
Temporal Smoothing
         │
         ▼
Pose Result
```

### 10.5.1 Pipeline Stages

| Stage | Operation | Output |
|-------|-----------|--------|
| **Crop** | Extract player from frame using tracking bbox | 256×256 or 384×288 |
| **Preprocess** | Normalize, pad, letterbox | Tensor (C, H, W) |
| **Inference** | Pose model forward pass | 33 × (x, y, conf) |
| **Postprocess** | Map to original frame coords | Keypoints in image space |
| **Smooth** | Temporal filter (EMA/Kalman) | Smoothed keypoints |
| **Court Mapping** | Homography to court coords | Keypoints in meters |

---

## 10.6 Model Architecture

### 10.6.1 Model Options

| Model | Params | Input | PCK@0.2 | Speed (A10G) | Use Case |
|-------|--------|-------|---------|--------------|----------|
| **MediaPipe Pose** | ~2.5M | 256×256 | 0.85 | 3ms | Mobile/Edge |
| **RTMPose-S** | 3.5M | 256×192 | 0.88 | 4ms | **Production** |
| **RTMPose-M** | 8.5M | 256×192 | 0.91 | 8ms | High accuracy |
| **RTMPose-L** | 24M | 384×288 | 0.93 | 18ms | Server |
| **ViTPose-B** | 86M | 256×192 | 0.92 | 15ms | Research |
| **HRNet-W32** | 28M | 256×192 | 0.90 | 12ms | Alternative |

**Recommendation:** **RTMPose-S** (best speed/accuracy trade-off for real-time)

### 10.6.2 RTMPose Architecture

```
Input (256×192×3)
    │
    ▼
Stem (3× conv 3×3, stride 2)
    │
    ▼
Stage 1: 3× ResBlock (64 ch)
    │
    ▼
Stage 2: 4× ResBlock (128 ch)
    │
    ▼
Stage 3: 6× ResBlock (256 ch)
    │
    ▼
Stage 4: 3× ResBlock (512 ch)
    │
    ▼
SimCC Head (SimCC: 2× classification)
    │
    ▼
Keypoints (x, y) + Heatmaps (optional)
```

---

## 10.7 Training Pipeline

### 10.7.1 Dataset Requirements

| Split | Images | Source |
|-------|--------|--------|
| Train | 50,000+ | MPII, COCO, Volleyball-specific |
| Val | 5,000 | 10 matches, 5 venues |
| Test | 3,000 | 5 matches, 3 venues (held-out) |

### 10.7.2 Volleyball-Specific Augmentation

```yaml
# configs/training/pose_estimation.yaml
model:
  architecture: "rtm_pose_s"
  pretrained: "rtmpose_s.pth"
  num_keypoints: 33
  input_size: [256, 192]

training:
  epochs: 100
  batch_size: 64
  imgsz: [256, 192]
  device: "0,1,2,3"
  optimizer: "AdamW"
  lr0: 0.001
  lr_scheduler: "cosine"
  weight_decay: 0.0001

augmentation:
  # Standard
  mosaic: 0.5
  mixup: 0.1
  degrees: 15.0
  translate: 0.1
  scale: 0.5
  flip_lr: 0.5
  
  # Photometric
  hsv_h: 0.015
  hsv_s: 0.7
  hsv_v: 0.4
  
  # Pose-specific
  keypoint_dropout: 0.1    # Random keypoint dropout
  rotation: 30.0           # ±30° rotation
  shear: 2.0
  cutout: 0.1              # Simulate occlusion
  blur: 0.1                # Motion blur
```

### 10.7.3 Loss Function

```python
# SimCC loss (classification-based coordinate regression)
loss = (
    kl_div_loss(simcc_x_pred, simcc_x_target) +
    kl_div_loss(simcc_y_pred, simcc_y_target)
) / 2

# Optional: Keypoint visibility loss (BCE)
visibility_loss = BCEWithLogitsLoss(vis_pred, vis_target)
total_loss = simcc_loss + 0.1 * visibility_loss
```

---

## 10.8 Inference Pipeline

### 10.7.1 Per-Player Crop & Inference

```python
def estimate_poses(frame: np.ndarray, 
                   tracks: List[PlayerTrack],
                   court_homography: np.ndarray) -> List[PoseResult]:
    
    results = []
    for track in tracks:
        if track.state != TrackState.TRACKED:
            continue
            
        # 1. Crop player
        crop = extract_player_crop(frame, track.bbox)
        
        # 2. Preprocess
        input_tensor = preprocess(crop)  # Resize, normalize, tensor
        
        # 3. Inference
        keypoints = pose_model.predict(input_tensor)  # 33 × (x, y, conf)
        
        # 4. Map to original frame coordinates
        keypoints = map_keypoints_to_frame(keypoints, track.bbox, crop.shape)
        
        # 5. Temporal smoothing
        smoothed = temporal_smoother.smooth(track.track_id, keypoints)
        
        # 6. Court coordinate mapping
        court_keypoints = map_to_court(smoothed, court_homography)
        
        results.append(PoseResult(
            track_id=track.track_id,
            player_identity=track.identity,
            keypoints=smoothed,
            court_keypoints=court_keypoints,
            confidence=np.mean([kp.conf for kp in smoothed if kp.conf > 0.5]),
            timestamp_ms=track.timestamp_ms
        ))
    
    return results
```

---

## 10.8 Keypoint Output Format

```python
@dataclass
class Keypoint:
    index: int                    # 0-32
    name: str                     # e.g., "left_wrist"
    x: float                      # Image x (pixels)
    y: float                      # Image y (pixels)
    x_court: Optional[float]      # Court x (meters)
    y_court: Optional[float]      # Court y (meters)
    confidence: float             # 0.0–1.0
    visibility: int               # 0=hidden, 1=occluded, 2=visible

@dataclass
class PoseResult:
    track_id: int
    player_identity: Optional[PlayerIdentity]
    keypoints: List[Keypoint]     # 33 keypoints
    skeleton: List[Tuple[int, int]]  # Bone connections
    body_orientation: BodyOrientation
    jump_state: JumpState         # GROUND / TAKEOFF / AIRBORNE / LANDING
    court_position: Tuple[float, float]  # Center of mass (meters)
    timestamp_ms: int
    processing_time_ms: float
```

---

## 10.9 Body Orientation Estimation

```python
@dataclass
class BodyOrientation:
    facing_direction: float       # Degrees, 0=court +x, 90=court +y
    torso_rotation: float         # Degrees, relative to hips
    lean_angle: float             # Degrees from vertical
    is_facing_net: bool
```

### 10.9.1 Estimation Method

```python
def estimate_orientation(keypoints: List[Keypoint]) -> BodyOrientation:
    # Shoulders vector
    ls = kp(11); rs = kp(12)
    shoulder_vec = np.array([rs.x - ls.x, rs.y - ls.y])
    
    # Hips vector
    lh = kp(23); rh = kp(24)
    hip_vec = np.array([rh.x - lh.x, rh.y - lh.y])
    
    # Torso facing = perpendicular to shoulders
    facing = atan2(shoulder_vec[1], shoulder_vec[0]) + pi/2
    
    # Torso rotation relative to hips
    hip_angle = atan2(hip_vec[1], hip_vec[0])
    shoulder_angle = atan2(shoulder_vec[1], shoulder_vec[0])
    torso_rot = normalize_angle(shoulder_angle - hip_angle)
    
    # Lean angle
    mid_shoulder = (ls + rs) / 2
    mid_hip = (lh + rh) / 2
    lean_vec = mid_shoulder - mid_hip
    lean = atan2(lean_vec[0], -lean_vec[1])  # From vertical
    
    return BodyOrientation(
        facing_direction=rad2deg(facing),
        torso_rotation=rad2deg(torso_rot),
        lean_angle=rad2deg(lean),
        is_facing_net=facing_net(facing, team)
    )
```

---

## 10.10 Jump Detection

### 10.10.1 Jump State Machine

```
GROUND
    │  vertical_velocity > threshold
    ▼
TAKEOFF
    │  vertical_velocity < 0
    ▼
AIRBORNE
    │  feet_contact_ground
    ▼
LANDING
    │  stable
    ▼
GROUND
```

### 10.10.2 Detection Algorithm

```python
def detect_jump(track: PlayerTrack, keypoints: List[Keypoint]) -> JumpEvent:
    """
    Detect jump from ankle/hip vertical velocity.
    """
    left_ankle = kp(27); right_ankle = kp(28)
    left_hip = kp(23); right_hip = kp(24)
    
    # Vertical velocity of hip center
    hip_center_y = (left_hip.y_court + right_hip.y_court) / 2
    vel_y = (hip_center_y - track.prev_hip_y) / dt
    
    # Ankle ground contact
    left_contact = left_ankle.y_court < ANKLE_GROUND_THRESHOLD
    right_contact = right_ankle.y_court < ANKLE_GROUND_THRESHOLD
    feet_contact = left_contact or right_contact
    
    # State transitions
    if track.jump_state == JumpState.GROUND:
        if vel_y > TAKEOFF_VELOCITY_THRESHOLD:
            return JumpEvent(type=JumpPhase.TAKEOFF, height_estimate=0)
    
    elif track.jump_state == JumpState.TAKEOFF:
        if vel_y < 0:
            return JumpEvent(type=JumpPhase.AIRBORNE)
    
    elif track.jump_state == JumpState.AIRBORNE:
        if feet_contact and vel_y < LANDING_VELOCITY_THRESHOLD:
            flight_time = (current_frame - track.takeoff_frame) * dt
            height = 0.5 * 9.81 * (flight_time / 2) ** 2
            return JumpEvent(
                type=JumpPhase.LANDING,
                height_cm=height * 100,
                flight_time=flight_time
            )
    
    elif track.jump_state == JumpState.LANDING:
        if stable_landing():
            return JumpEvent(type=JumpPhase.GROUND)
    
    return None
```

---

## 10.11 Arm & Leg Movement Analysis

### 10.11.1 Arm Swing Features

```python
@dataclass
class ArmSwingFeatures:
    left_shoulder_to_wrist: np.ndarray  # Vector
    right_shoulder_to_wrist: np.ndarray
    elbow_angle_left: float
    elbow_angle_right: float
    wrist_velocity: Tuple[np.ndarray, np.ndarray]
    swing_phase: SwingPhase           # PREPARATION / ACCELERATION / CONTACT / FOLLOW_THROUGH
    arm_extension: float              # 0=folded, 1=full
    contact_height: float             # Wrist height at ball contact
```

### 10.11.2 Leg Movement Features

```python
@dataclass
class LegMovementFeatures:
    knee_angle_left: float
    knee_angle_right: float
    hip_angle_left: float
    hip_angle_right: float
    foot_placement: Tuple[np.ndarray, np.ndarray]
    knee_flexion_velocity: Tuple[float, float]
    center_of_mass: Tuple[float, float]
    weight_distribution: float        # 0=left, 1=right
```

---

## 10.12 Pose Sequences for Action Recognition

```python
@dataclass
class PoseSequence:
    track_id: int
    frames: List[PoseResult]      # Typically 30 frames (1 sec @ 30 FPS)
    action_label: Optional[str]   # SERVE, SPIKE, BLOCK, DIG, etc.
    start_frame: int
    end_frame: int
    court_zone: int
```

### 10.12.1 Sequence Extraction

```python
def extract_sequences(tracks: List[PlayerTrack], 
                      sequence_length: int = 30,
                      stride: int = 5) -> List[PoseSequence]:
    """
    Extract overlapping pose sequences for action recognition.
    """
    sequences = []
    for track in tracks:
        if len(track.pose_history) >= sequence_length:
            for i in range(0, len(track.pose_history) - sequence_length, stride):
                seq = PoseSequence(
                    track_id=track.track_id,
                    frames=track.pose_history[i:i+sequence_length],
                    start_frame=track.pose_history[i].frame_id,
                    end_frame=track.pose_history[i+sequence_length-1].frame_id
                )
                sequences.append(seq)
    return sequences
```

---

## 10.13 Multi-Player Pose Estimation

### 10.13.1 Parallel Inference

```python
async def estimate_all_poses(frame: np.ndarray, 
                             tracks: List[PlayerTrack],
                             homography: np.ndarray) -> List[PoseResult]:
    """
    Batch inference for multiple players.
    """
    # Collect crops
    crops = [extract_crop(frame, t.bbox) for t in tracks if t.state == TRACKED]
    
    # Batch inference
    batch_tensor = torch.stack([preprocess(c) for c in crops])
    keypoints_batch = pose_model(batch_tensor)
    
    # Post-process each
    results = []
    for i, track in enumerate([t for t in tracks if t.state == TRACKED]):
        kps = postprocess(keypoints_batch[i], track.bbox)
        results.append(build_pose_result(track, kps))
    
    return results
```

### 10.13.2 Temporal Smoothing per Track

```python
class PoseTemporalSmoother:
    def __init__(self, window: int = 5, alpha: float = 0.7):
        self.buffers: Dict[int, List[Keypoint]] = defaultdict(list)
        self.window = window
        self.alpha = alpha
    
    def smooth(self, track_id: int, keypoints: List[Keypoint]) -> List[Keypoint]:
        buffer = self.buffers[track_id]
        buffer.append(keypoints)
        if len(buffer) > self.window:
            buffer.pop(0)
        
        if len(buffer) < 2:
            return keypoints
        
        # Exponential moving average per keypoint
        smoothed = []
        for i in range(33):
            prev = buffer[-2][i]
            curr = keypoints[i]
            if curr.confidence > 0.5 and prev.confidence > 0.5:
                smoothed_kp = Keypoint(
                    index=i,
                    name=curr.name,
                    x=self.alpha * curr.x + (1-self.alpha) * prev.x,
                    y=self.alpha * curr.y + (1-self.alpha) * prev.y,
                    confidence=max(curr.confidence, prev.confidence),
                    visibility=curr.visibility
                )
            else:
                smoothed_kp = curr
            smoothed.append(smoothed_kp)
        return smoothed
```

---

## 10.14 Occlusion Handling

### 10.14.1 Occlusion Strategies

| Occlusion Type | Strategy |
|----------------|----------|
| **Self-occlusion** (arm in front) | Infer from temporal history; mark `visibility=1` |
| **Player-player** | Use track history + kinematic constraints |
| **Net/pole** | Interpolate from adjacent frames |
| **Frame edge** | Predict from velocity; mark low confidence |
| **Complete loss** | Freeze last valid pose; max 15 frames |

### 10.14.2 Inference Rules

| Visibility | Value | Meaning |
|------------|-------|---------|
| **2** | Fully visible | Direct detection |
| **1** | Partially occluded | Inferred/temporal |
| **0** | Not visible | No information |

---

## 10.15 Performance Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **PCK@0.2** | ≥ 0.90 | Percentage of Correct Keypoints |
| **AUC** | ≥ 0.95 | Area under PCK curve |
| **MPJPE** | ≤ 50mm | Mean Per Joint Position Error |
| **P-MPJPE** | ≤ 40mm | Procrustes-aligned MPJPE |
| **Inference Latency** | < 15ms | Per player on A10G |
| **Throughput** | ≥ 30 FPS | 14 players batched |
| **Temporal Jitter** | < 5px | Frame-to-frame keypoint stability |

---

## 10.16 Model Export & Optimization

### 10.16.1 Export Formats

| Format | Latency (A10G) | Use Case |
|--------|----------------|----------|
| PyTorch | 12ms | Development |
| ONNX | 8ms | Cross-platform |
| TensorRT FP16 | 4ms | **Production** |
| TensorRT INT8 | 2ms | High-throughput |

### 10.16.2 TensorRT Export

```bash
# Export to ONNX
python -m torch.onnx.export(rtm_pose_s, dummy_input, "rtmpose.onnx", opset=17)

# TensorRT FP16
trtexec --onnx=rtmpose.onnx --saveEngine=rtmpose_fp16.engine --fp16 --workspace=4096

# INT8 (requires calibration)
trtexec --onnx=rtmpose.onnx --saveEngine=rtmpose_int8.engine \
        --int8 --calib=calib_data --workspace=4096
```

---

## 10.17 Integration with Downstream Modules

| Module | Consumes |
|--------|----------|
| **Action Recognition** | Pose sequences (30 frames) |
| **Jump Statistics** | Jump events, height, flight time |
| **Biomechanical Analysis** | Joint angles, velocities, symmetry |
| **Statistics Engine** | Jump counts, contact heights |
| **Tactical Analysis** | Body orientation, facing direction |

---

## 10.18 Testing & Validation

### 10.18.1 Unit Tests

```python
def test_keypoint_accuracy():
    """PCK@0.2 ≥ 0.90 on validation set."""
    detector = PoseEstimator(default_config)
    pck_scores = []
    for frame, gt_kps in pose_val_dataset:
        pred = detector.estimate(frame, tracks)
        for track_id, gt_kps in gt_kps.items():
            pred_kps = get_pred_kps(pred, track_id)
            pck = compute_pck(pred_kps, gt_kps, threshold=0.2)
            pck_scores.append(pck)
    assert np.mean(pck_scores) >= 0.90

def test_jump_detection():
    """Jump detection precision/recall ≥ 0.85."""
    detector = PoseEstimator(default_config)
    # Test on annotated jump sequences
    pass

def test_temporal_smoothing():
    """Smoothing reduces jitter without lag."""
    smoother = PoseTemporalSmoother()
    jittery = add_jitter(ground_truth, sigma=5)
    smoothed = smoother.smooth(track_id=1, keypoints=jittery)
    assert rmse(smoothed, ground_truth) < rmse(jittery, ground_truth) * 0.5
```

---

## 10.18 Deployment Considerations

| Aspect | Recommendation |
|--------|----------------|
| **Batch Size** | 4–8 players per inference |
| **Input Size** | 256×192 (RTMPose-S) |
| **GPU Memory** | ~1.5GB per instance |
| **CPU Fallback** | MediaPipe Pose (3ms, lower accuracy) |
| **Scaling** | KEDA HPA based on track count |

---

## 10.19 Future Enhancements

| Feature | Description |
|---------|-------------|
| **3D Pose Estimation** | Multi-camera triangulation or monocular depth |
| **Joint Force Estimation** | Inverse dynamics from acceleration |
| **Fatigue Indicators** | Pose degradation over time |
| **Technique Scoring** | Ideal vs. actual joint angles |
| **Injury Risk** | Knee valgus, landing asymmetry |
| **Skill Assessment** | Automated technique grading |

---

## 10.20 Chapter Summary

Human Pose Estimation AI transforms tracked player images into structured skeletal representations, enabling detailed analysis of posture, movement, and biomechanics.

**Key Decisions:**
- **RTMPose-S** with SimCC head for speed/accuracy balance
- **33 keypoints** (MediaPipe topology) with SimCC regression
- **Temporal EMA smoothing** per track for stability
- **Body orientation** from shoulder/hip vectors
- **Jump detection** via hip/ankle vertical velocity
- **Arm/leg feature extraction** for action recognition
- **TensorRT FP16** for production inference

*Pose estimation provides the biomechanical foundation for understanding volleyball actions — from serve mechanics to spike dynamics to defensive positioning.*

---

## Transition to Chapter 11

With pose sequences available, the next module recognizes volleyball actions.

**Chapter 11 — Volleyball Action Recognition** will cover:

- Action taxonomy (29 volleyball actions)
- Sequence classification (LSTM/Transformer)
- Rule-based + ML hybrid approach
- Temporal boundary detection
- Multi-player action attribution
- Confidence calibration

*Action recognition transforms pose sequences into semantic volleyball events — the bridge between biomechanics and match intelligence.*

---

**END OF CHAPTER 10**

*Next: Chapter 11 — Volleyball Action Recognition*