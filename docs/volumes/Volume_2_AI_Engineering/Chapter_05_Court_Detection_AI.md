# VOLUME 2: AI ENGINEERING & COMPUTER VISION IMPLEMENTATION SPECIFICATION (AECVIS)

**Version:** 1.0  
**Date:** July 15, 2026  
**Status:** Active Development

---

# CHAPTER 5: COURT DETECTION AI

---

## 5.1 Purpose

This chapter defines the implementation of the Court Detection AI module — the first stage of the perception pipeline.

Its objectives are to:

- Detect court boundaries, lines, and net in video frames
- Compute homography for pixel-to-court coordinate transformation
- Enable accurate player/ball positioning in real-world coordinates
- Support multi-camera calibration and fusion
- Provide stable output for downstream modules (tracking, action recognition, analytics)

---

## 5.2 Court Geometry

### 5.2.1 Standard Indoor Court (FIVB)

| Dimension | Value |
|-----------|-------|
| Length | 18.0 m |
| Width | 9.0 m |
| Attack Line Distance | 3.0 m from center line |
| Service Zone | 9.0 m wide behind end line |
| Net Height (Men) | 2.43 m |
| Net Height (Women) | 2.24 m |
| Antenna Height | 2.55 m (top of antenna) |
| Line Width | 5 cm |

### 5.2.2 Court Coordinate System

```
Court Coordinates (meters, origin at bottom-left corner)

y=9.0  ┌─────────────────────────────────────────────┐
       │  Zone 2 (RF)  │  Zone 3 (MF)  │  Zone 4 (LF) │  Front Row
       │               │               │              │
y=4.5  ├───────────────┼───────────────┼──────────────┤  ← Center Line (y=4.5)
       │  Zone 1 (RB)  │  Zone 6 (MB)  │  Zone 5 (LB) │  Back Row
       │               │               │              │
y=0.0  └─────────────────────────────────────────────┘
       x=0.0                                         x=18.0
```

| Zone | Name | Position |
|------|------|----------|
| 1 | Right Back (RB) | x∈[0,6), y∈[0,4.5) |
| 2 | Right Front (RF) | x∈[0,6), y∈[4.5,9] |
| 3 | Middle Front (MF) | x∈[6,12), y∈[4.5,9] |
| 4 | Left Front (LF) | x∈[12,18], y∈[4.5,9] |
| 5 | Left Back (LB) | x∈[12,18], y∈[0,4.5) |
| 6 | Middle Back (MB) | x∈[6,12), y∈[0,4.5) |

---

## 5.3 Court Detection Pipeline

```
Input Frame
    │
    ▼
Preprocessing (resize, normalize, undistort)
    │
    ▼
Line Detection (Hough + CNN)
    │
    ▼
Corner Detection (line intersection)
    │
    ▼
Court Model Fitting (RANSAC + refinement)
    │
    ▼
Net Detection (horizontal line + height)
    │
    ▼
Homography Estimation (DLT + refinement)
    │
    ▼
Output: Court Model + Homography + Confidence
```

---

## 5.4 Line Detection

### 5.4.1 Hybrid Approach

| Stage | Method | Purpose |
|-------|--------|---------|
| **Candidate Generation** | Edge detection (Canny) + Hough Transform | Find all line candidates |
| **Classification** | CNN (ResNet-18) on line patches | Classify: boundary, attack, center, net, noise |
| **Filtering** | Geometric constraints (parallel, perpendicular, length) | Remove false positives |
| **Refinement** | Sub-pixel fitting (LSQ) | Sub-pixel accuracy |

### 5.4.2 Line Classes

| Class ID | Name | Expected Count | Geometry |
|----------|------|----------------|----------|
| 0 | Long boundary (length) | 2 | Horizontal, y≈0, y≈9 |
| 1 | Short boundary (width) | 2 | Vertical, x≈0, x≈18 |
| 2 | Attack line | 2 | Horizontal, y≈4.5±3 |
| 3 | Center line | 1 | Horizontal, y≈4.5 |
| 4 | Net line | 1 | Horizontal, y≈4.5 (with height) |
| 5 | Service zone lines | 4 | Extensions behind end lines |
| 6 | Antennae | 2 | Vertical at net edges |

---

## 5.5 Corner Detection

### 5.5.1 Method

| Approach | Detail |
|----------|--------|
| **Intersection** | Compute line-line intersections from classified lines |
| **Validation** | Check: 4 corners form rectangle ≈ 18×9 aspect ratio |
| **Refinement** | Harris corner / sub-pixel on image patches around intersections |
| **Fallback** | CNN keypoint detector (court corners as 4 keypoints) |

### 5.5.2 Output

```python
@dataclass
class CourtCorners:
    tl: Tuple[float, float]  # Top-left (x=0, y=9)
    tr: Tuple[float, float]  # Top-right (x=18, y=9)
    br: Tuple[float, float]  # Bottom-right (x=18, y=0)
    bl: Tuple[float, float]  # Bottom-left (x=0, y=0)
    confidence: float
    image_coords: bool  # True if pixels, False if court meters
```

---

## 5.6 Court Model Fitting

### 5.6.1 RANSAC-Based Rectangle Fitting

```python
def fit_court_model(lines: List[Line], corners: List[Point]) -> CourtModel:
    """
    1. Cluster lines by orientation (horizontal/vertical)
    2. RANSAC to find best rectangle fitting line endpoints
    3. Enforce constraints:
       - Opposite sides parallel
       - Adjacent sides perpendicular
       - Aspect ratio ≈ 2.0 (18:9)
       - Area within expected range
    4. Refine with non-linear least squares
    """
    pass
```

### 5.6.2 Validation Criteria

| Check | Threshold |
|-------|-----------|
| Aspect ratio | 1.95 - 2.05 |
| Corner angles | 88° - 92° |
| Line completeness | ≥ 70% of expected lines detected |
| Reprojection error | < 3 pixels (RMS) |

---

## 5.7 Net Detection

### 5.7.1 Detection Strategy

| Method | Detail |
|--------|--------|
| **Primary** | Horizontal line at court center (y≈4.5) with vertical extent |
| **Secondary** | Texture analysis (net mesh pattern) |
| **Height estimation** | Known net height (2.43m/2.24m) + camera calibration |

### 5.7.2 Net Model

```python
@dataclass
class NetDetection:
    line: LineSegment          # In image coordinates
    court_y: float             # Should be ≈ 4.5m
    height_pixels: int         # Vertical extent in image
    antennae: Optional[Tuple[Point, Point]]  # Left/right antenna tips
    height_m: float            # 2.43 (men) or 2.24 (women)
    confidence: float
```

---

## 5.8 Homography Estimation

### 5.8.1 Direct Linear Transform (DLT)

```python
def compute_homography(image_corners: np.ndarray, court_corners: np.ndarray) -> np.ndarray:
    """
    Solve: H * [x_img, y_img, 1]^T = [x_court, y_court, 1]^T
    
    Input:
        image_corners: 4x2 (tl, tr, br, bl) in pixels
        court_corners: 4x2 (0,9), (18,9), (18,0), (0,0) in meters
    
    Output:
        H: 3x3 homography matrix
    """
    # DLT with normalization (Hartley & Zisserman)
    pass
```

### 5.8.2 Refinement

| Step | Method |
|------|--------|
| **Initial** | DLT on 4 corners |
| **Refinement** | Levenberg-Marquardt on all line correspondences |
| **Validation** | Reproject court lines → image; measure RMS error |
| **Fallback** | If error > 5px, use RANSAC with more correspondences |

### 5.8.3 Coordinate Transformation

```python
def image_to_court(H: np.ndarray, pt: Tuple[float, float]) -> Tuple[float, float]:
    """Pixel (x, y) → Court (x, y) in meters."""
    pt_h = np.array([pt[0], pt[1], 1.0])
    court_h = H @ pt_h
    return (court_h[0] / court_h[2], court_h[1] / court_h[2])

def court_to_image(H_inv: np.ndarray, pt: Tuple[float, float]) -> Tuple[float, float]:
    """Court (x, y) in meters → Pixel (x, y)."""
    pt_h = np.array([pt[0], pt[1], 1.0])
    img_h = H_inv @ pt_h
    return (img_h[0] / img_h[2], img_h[1] / img_h[2])
```

---

## 5.9 Zone Mapping

### 5.9.1 Court Zone Grid

```python
def court_to_zone(x: float, y: float) -> int:
    """Map court coordinates (meters) to zone 1-6."""
    if y >= 4.5:  # Front row
        if x < 6.0: return 2
        elif x < 12.0: return 3
        else: return 4
    else:  # Back row
        if x < 6.0: return 1
        elif x < 12.0: return 6
        else: return 5
```

### 5.9.2 Heatmap Grid

| Resolution | Cell Size | Use Case |
|------------|-----------|----------|
| 12×6 | 1.5m × 1.5m | Standard heatmaps |
| 24×12 | 0.75m × 0.75m | High-res analytics |
| 36×18 | 0.5m × 0.5m | Research grade |

---

## 5.10 Multi-Camera Calibration

### 5.10.1 Synchronization

| Requirement | Specification |
|-------------|---------------|
| **Temporal** | Frame timestamps synchronized ≤ 16ms (1 frame @ 60 FPS) |
| **Spatial** | All cameras share same court coordinate system |
| **Extrinsic** | Relative pose between cameras (if overlapping FOV) |

### 5.10.2 Fusion Pipeline

```
Camera 1: H1 → Court coords
Camera 2: H2 → Court coords
                │
                ▼
      Fuse in Court Space (meters)
                │
                ▼
        Unified Player/Ball Tracks
                │
                ▼
          Project to Any View
```

### 5.10.3 Cross-View Consistency

| Check | Method |
|-------|--------|
| **Player position** | Same player → same court coords across views |
| **Ball trajectory** | 3D path consistent from multiple views |
| **Timestamp alignment** | Serve/whistle events align across cameras |

---

## 5.11 Court Occupancy & Analytics

### 5.11.1 Occupancy Grid

```python
class CourtOccupancy:
    def __init__(self, grid_cols=12, grid_rows=6):
        self.grid = np.zeros((grid_rows, grid_cols), dtype=int)
        self.cell_w = 18.0 / grid_cols
        self.cell_h = 9.0 / grid_rows
    
    def add_position(self, x: float, y: float, weight: float = 1.0):
        col = min(int(x / self.cell_w), self.grid_cols - 1)
        row = min(int(y / self.cell_h), self.grid_rows - 1)
        self.grid[row, col] += weight
    
    def get_heatmap(self) -> np.ndarray:
        return self.grid / self.grid.max() if self.grid.max() > 0 else self.grid
```

### 5.11.2 Derived Metrics

| Metric | Formula |
|--------|---------|
| **Zone Time %** | Frames in zone / total frames |
| **Distance Covered** | Σ√((xᵢ-xᵢ₋₁)² + (yᵢ-yᵢ₋₁)²) |
| **Court Balance** | Entropy of zone distribution |
| **Transition Count** | Zone changes per rally |

---

## 5.12 Performance Evaluation

### 5.12.1 Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Corner Detection Accuracy** | ≤ 3px RMS | vs. manual corners |
| **Line Detection F1** | ≥ 0.95 | vs. manual lines |
| **Homography Reprojection Error** | < 3px RMS | Court lines → image |
| **Net Detection Rate** | ≥ 98% | Frames with net / total |
| **Processing Latency** | < 30ms/frame | On target GPU |
| **Frame-to-Frame Stability** | < 1px jitter | Static camera |

### 5.12.2 Test Scenarios

| Scenario | Weight |
|---------|--------|
| Standard indoor, good lighting | 30% |
| Dim lighting / shadows | 20% |
| Camera angle variation | 20% |
| Partial court occlusion | 15% |
| Multi-camera sync | 15% |

---

## 5.13 Implementation Specification

### 5.13.1 Module Interface

```python
# inference/court_detection.py

class CourtDetector:
    def __init__(self, config: CourtDetectorConfig):
        self.config = config
        self.line_detector = LineDetector(config.line_detection)
        self.corner_refiner = CornerRefiner(config.corner_refinement)
        self.net_detector = NetDetector(config.net_detection)
        self.homography_estimator = HomographyEstimator(config.homography)
    
    def process_frame(self, frame: np.ndarray, camera_calibration: Optional[Calibration] = None) -> CourtResult:
        """
        Input: BGR frame (H×W×3)
        Output: CourtResult with corners, lines, net, homography, confidence
        """
        pass

@dataclass
class CourtResult:
    corners: CourtCorners
    lines: List[LineDetection]
    net: Optional[NetDetection]
    homography: np.ndarray          # 3x3 image → court
    homography_inv: np.ndarray      # 3x3 court → image
    confidence: float
    processing_time_ms: float
```

### 5.13.2 Configuration

```yaml
# configs/court_detection.yaml
line_detection:
  canny_low: 50
  canny_high: 150
  hough_rho: 1
  hough_theta: 0.017  # 1 degree
  hough_threshold: 80
  min_line_length: 100
  max_line_gap: 20
  cnn_classifier_path: "models/court/line_classifier_v1.2.onnx"

corner_refinement:
  patch_size: 32
  max_iterations: 10
  epsilon: 0.01

net_detection:
  expected_y_ratio: 0.5
  texture_analysis: true
  min_height_pixels: 20

homography:
  method: "dlt_ransac"
  ransac_iterations: 1000
  ransac_threshold: 3.0
  refine_lm: true
```

---

## 5.14 Testing & Validation

### 5.13.1 Unit Tests

```python
# tests/test_court_detection.py

def test_corner_detection_accuracy():
    """Corner detection within 3px on validation set."""
    detector = CourtDetector(default_config)
    for frame, gt_corners in validation_dataset:
        result = detector.process_frame(frame)
        error = compute_corner_rmse(result.corners, gt_corners)
        assert error < 3.0

def test_homography_reprojection():
    """Court lines reproject to within 3px."""
    for frame, gt_homography in validation_dataset:
        result = detector.process_frame(frame)
        error = compute_reprojection_error(result.homography, gt_homography)
        assert error < 3.0

def test_multi_camera_consistency():
    """Same court position from different cameras maps to same court coords."""
    for cam1_frame, cam2_frame, sync_info in multi_cam_dataset:
        result1 = detector1.process_frame(cam1_frame)
        result2 = detector2.process_frame(cam2_frame)
        # Project same image point from both cameras
        assert court_distance(result1, result2) < 0.15  # 15cm
```

---

## 5.14 Deployment Considerations

| Aspect | Recommendation |
|--------|----------------|
| **Initialization** | Run on first N frames; cache homography |
| **Re-calibration** | Trigger if camera moves (frame diff > threshold) |
| **Fallback** | If detection fails, use last valid homography (max 30s) |
| **GPU/CPU** | Line detection on CPU; CNN classifier on GPU |
| **Batch Processing** | Process frames in batches of 4-8 for throughput |

---

## 5.15 Future Enhancements

| Feature | Description |
|---------|-------------|
| **3D Court Reconstruction** | Multiple views → full 3D court model |
| **Dynamic Line Detection** | Detect temporary lines (practice markings) |
| **Net Height Estimation** | Auto-detect men's/women's net height |
| **Antenna Tip Detection** | Precise boundary for ball in/out |
| **Court Wear Detection** | Detect faded lines, suggest recalibration |

---

## 5.16 Chapter Summary

Court detection is the geometric foundation of the entire AI pipeline. This chapter specifies:

- **Court geometry** — FIVB standard 18×9m with 6 zones
- **Detection pipeline** — Edge → Hough → CNN classify → RANSAC fit → DLT homography
- **Net detection** — Center-line + texture + height
- **Multi-camera fusion** — Common court coordinate space
- **Zone mapping** — 6-zone system for analytics
- **Evaluation metrics** — <3px reprojection, >95% line F1
- **Implementation interface** — `CourtDetector` class with typed I/O

*Accurate court detection enables every downstream module: player positions in meters, ball trajectories, heat maps, and tactical analytics all depend on this geometric grounding.*

---

## Transition to Chapter 6

With the court established, the next perception module identifies the actors on it.

**Chapter 6 — Player Detection AI** will cover:

- YOLOv8 fine-tuning for volleyball players
- Small-object challenges (ball, distant players)
- Team color classification
- Multi-scale detection
- Inference optimization (TensorRT, ONNX)
- Evaluation on diverse venues

*The player detector transforms court-relative geometry into semantic object detections — the first step toward understanding who is doing what on the court.*

---

**END OF CHAPTER 5**

*Next: Chapter 6 — Player Detection AI*