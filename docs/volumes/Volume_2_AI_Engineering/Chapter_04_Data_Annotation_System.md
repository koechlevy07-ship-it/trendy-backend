# VOLUME 2: AI ENGINEERING & COMPUTER VISION IMPLEMENTATION SPECIFICATION (AECVIS)

**Version:** 1.0  
**Date:** July 15, 2026  
**Status:** Active Development

---

# CHAPTER 4: DATA ANNOTATION SYSTEM

---

## 4.1 Purpose

This chapter defines the standards, workflows, and quality assurance processes for annotating volleyball datasets used to train the AI models.

Its objectives are to:

- Standardize annotations
- Ensure annotation consistency
- Improve training data quality
- Support multiple AI tasks
- Enable collaborative annotation
- Maintain traceability and version control

---

## 4.2 Annotation Philosophy

Annotations should represent the ground truth as accurately as possible.

Every annotation should be:

| Principle | Implementation |
|-----------|----------------|
| **Accurate** | Precisely reflect visual reality |
| **Consistent** | Same rules applied across all annotators |
| **Complete** | No missing labels for visible objects |
| **Reproducible** | Same input → same annotation by different annotators |
| **Reviewable** | Full audit trail of changes |
| **Version Controlled** | Every change tracked with author, timestamp, reason |

Annotators must follow documented guidelines rather than personal interpretation.

---

## 4.3 AI Tasks Requiring Annotation

Different AI models require different annotation types:

| AI Component | Annotation Type | Format |
|--------------|----------------|--------|
| Court Detection | Court boundaries, lines, net | Polygons, keypoints, homography |
| Player Detection | Bounding boxes | YOLO format (x, y, w, h, class) |
| Ball Detection | Bounding boxes | YOLO format (small object) |
| Player Tracking | Track IDs across frames | Track ID + bbox per frame |
| Jersey Recognition | Cropped torso + text | Crop + text label (0-99) |
| Pose Estimation | Body keypoints | 33 keypoints (x, y, visibility) |
| Action Recognition | Temporal segments + labels | Start/end frame + action class |
| Event Detection | Structured events | Rally context + outcome |

---

## 4.4 Annotation Workflow

Every annotation passes through a structured pipeline:

```
Raw Video
    │
    ▼
Frame Extraction (configurable FPS)
    │
    ▼
Initial Annotation (Annotator)
    │
    ▼
Quality Review (Reviewer)
    │
    ▼
Corrections (Annotator → Reviewer loop)
    │
    ▼
Approval (QA Lead)
    │
    ▼
Dataset Release (Version Tag)
```

**Rule:** No annotation enters the training dataset without review and approval.

---

## 4.5 Court Annotation

### 4.5.1 Required Elements

| Element | Type | Purpose |
|---------|------|---------|
| Outer boundaries | Polygon (4 corners) | Court detection, homography |
| Attack lines (3m) | Line segments | Zone mapping |
| Center line | Line segment | Side assignment |
| Service zones | Polygons | Serve analysis |
| Net location | Line segment + height | Net detection, ball trajectory |
| Antennae (if visible) | Vertical lines | Boundary validation |

### 4.5.2 Annotation Format

```json
{
  "court": {
    "corners": [[x1,y1], [x2,y2], [x3,y3], [x4,y4]],  // TL, TR, BR, BL
    "attack_lines": [[[x1,y1],[x2,y2]], [[x3,y3],[x4,y4]]],
    "center_line": [[x1,y1],[x2,y2]],
    "net": {"line": [[x1,y1],[x2,y2]], "height_m": 2.43},
    "service_zones": [
      {"polygon": [[...]], "zone": "right_back"},
      {"polygon": [[...]], "zone": "left_back"}
    ],
    "homography_matrix": [[...]]  // 3x3 if computed
  }
}
```

### 4.5.3 Annotation Rules

- **Corners:** Click at line intersections (outer edge of lines)
- **Lines:** Follow visible line center; include full line segment
- **Net:** Annotate visible portion; mark antennae if visible
- **Occlusions:** Mark visible segments; interpolate if >50% visible
- **Coordinate System:** Image coordinates (pixels) from top-left (0,0)

---

## 4.6 Player Detection Annotation

### 4.6.1 Bounding Box Standards

| Rule | Specification |
|------|---------------|
| **Tightness** | Tight to visible body; 2-5px padding |
| **Coverage** | Head to feet; include arms if extended |
| **Partial Visibility** | Annotate if ≥30% body visible |
| **Occlusion** | Box around visible portion; mark `occluded=true` |
| **Spectators/Coaches** | **Do not annotate** (class = `spectator` if needed) |

### 4.6.2 YOLO Format

```
# class_id x_center y_center width height (normalized 0-1)
0 0.523 0.412 0.189 0.342
```

### 4.6.3 Class Definitions

| Class ID | Name | Description |
|----------|------|-------------|
| 0 | `player` | Active player on court |
| 1 | `referee` | Referee (future use) |
| 2 | `spectator` | Non-participant (for filtering) |

---

## 4.7 Ball Annotation

### 4.7.1 Special Considerations

| Challenge | Handling |
|-----------|----------|
| **Small size** | Often 5-20 pixels; tight box |
| **Motion blur** | Box around blur streak; mark `blurred=true` |
| **Partial visibility** | Box around visible portion; `occluded=true` |
| **Behind net** | Annotate if >20% visible |

### 4.7.2 Annotation Format

```
# class_id x_center y_center width height blurred occluded
1 0.641 0.287 0.021 0.019 false false
```

| Class ID | Name |
|----------|------|
| 1 | `ball` |

### 4.7.3 Quality Rules

- **Minimum size:** 4×4 pixels (reject smaller)
- **Confidence:** Only annotate if visible with ≥80% confidence
- **Frame consistency:** Ball position should follow physics (no teleporting)

---

## 4.8 Player Tracking Annotation

### 4.8.1 Tracking ID Assignment

| Rule | Specification |
|------|---------------|
| **Uniqueness** | Each player = unique ID per sequence |
| **Persistence** | Same ID across frames within rally |
| **Re-entry** | Reuse ID if identity confirmed (≥80% confidence) |
| **ID Range** | 1-99 per team per match |
| **Team Separation** | Team A: 1-50, Team B: 51-99 (or separate namespaces) |

### 4.8.2 Track Format

```json
{
  "track_id": 101,
  "team": "home",
  "jersey_number": 8,
  "frames": [
    {"frame": 12450, "bbox": [0.52, 0.41, 0.19, 0.34], "occluded": false},
    {"frame": 12451, "bbox": [0.53, 0.42, 0.18, 0.35], "occluded": false}
  ],
  "start_frame": 12450,
  "end_frame": 12890,
  "identity_confirmed": true
}
```

### 4.8.3 Identity Re-association Rules

| Scenario | Action |
|----------|--------|
| **Player exits frame** | Keep ID; predict re-entry position |
| **Full occlusion ≤ 2 sec** | Maintain ID via Kalman prediction |
| **Full occlusion > 2 sec** | Mark `identity_confirmed=false`; re-associate on reappearance |
| **ID switch detected** | Flag for review; correct in next version |

---

## 4.9 Jersey Number Annotation

### 4.9.1 Pipeline

```
Player Detection → Torso Crop → OCR → Number Validation → Tracking Association
```

### 4.9.2 Annotation Format

```csv
# track_id, frame_number, jersey_number, confidence, visibility
101, 12450, 8, 0.94, full
101, 12451, 8, 0.91, full
102, 12450, 12, 0.78, partial
103, 12450, , 0.00, hidden
```

| Field | Rules |
|-------|-------|
| `jersey_number` | Integer 0-99; empty if unknown |
| `confidence` | OCR confidence (0-1) |
| `visibility` | `full` / `partial` / `hidden` |

### 4.9.3 Temporal Smoothing

- Apply majority vote over track history (window = 15 frames)
- Final number = mode of high-confidence readings
- Mark `verified=true` when consensus ≥ 3 frames

---

## 4.10 Pose Annotation

### 4.10.1 Keypoint Definition (33 Landmarks)

| Index | Name | Index | Name |
|-------|------|-------|------|
| 0 | Nose | 17 | Left pinky |
| 1 | Left eye inner | 18 | Right pinky |
| 2 | Left eye | 19 | Left index |
| 3 | Left eye outer | 20 | Right index |
| 4 | Right eye inner | 21 | Left thumb |
| 5 | Right eye | 22 | Right thumb |
| 6 | Right eye outer | 23 | Left hip |
| 7 | Left ear | 24 | Right hip |
| 8 | Right ear | 25 | Left knee |
| 9 | Mouth left | 26 | Right knee |
| 10 | Mouth right | 27 | Left ankle |
| 11 | Left shoulder | 28 | Right ankle |
| 12 | Right shoulder | 29 | Left heel |
| 13 | Left elbow | 30 | Right heel |
| 14 | Right elbow | 31 | Left foot index |
| 15 | Left wrist | 32 | Right foot index |
| 16 | Right wrist | | |

### 4.10.2 Annotation Format

```json
{
  "track_id": 101,
  "frame": 12450,
  "keypoints": [
    {"x": 642, "y": 321, "visibility": 1.0},  // nose
    {"x": 638, "y": 318, "visibility": 0.9},  // left eye inner
    ...
    {"x": 598, "y": 687, "visibility": 0.3}   // right foot index (occluded)
  ],
  "bbox": [598, 298, 120, 412]
}
```

| Visibility | Meaning |
|------------|---------|
| 1.0 | Clearly visible |
| 0.5 | Partially visible / inferred |
| 0.0 | Not visible (occluded/out of frame) |

### 4.10.3 Annotation Rules

- **Primary:** Annotate visible joints; interpolate if confident
- **Occlusion:** Mark `visibility=0.0` for hidden joints
- **Symmetry:** Use anatomical constraints (e.g., shoulders level)
- **Consistency:** Adjacent frames should have smooth trajectories

---

## 4.11 Volleyball Action Annotation

### 4.11.1 Action Taxonomy

| Action ID | Name | Category | Description |
|-----------|------|----------|-------------|
| 0 | `serve` | Serving | Ball put in play |
| 1 | `ace` | Serving | Serve lands untouched |
| 2 | `service_error` | Serving | Serve fault |
| 3 | `reception` | Receiving | First contact on serve |
| 4 | `perfect_reception` | Receiving | High-quality pass |
| 5 | `good_reception` | Receiving | Playable pass |
| 6 | `poor_reception` | Receiving | Scrambled but playable |
| 7 | `reception_error` | Receiving | Shanked/aced |
| 8 | `set` | Setting | Overhead placement |
| 9 | `assist` | Setting | Set leading to kill |
| 10 | `setting_error` | Setting | Double/carry/lift |
| 11 | `overpass` | Setting | Ball goes over on 2nd |
| 12 | `spike` | Attacking | Jump attack |
| 13 | `kill` | Attacking | Successful spike |
| 14 | `attack_error` | Attacking | Out/net/blocked out |
| 15 | `blocked_attack` | Attacking | Returned by block |
| 16 | `tip` | Attacking | Soft touch |
| 17 | `roll_shot` | Attacking | Off-speed attack |
| 18 | `block` | Blocking | Jump at net |
| 19 | `solo_block` | Blocking | 1 player block point |
| 20 | `block_assist` | Blocking | 2+ player block point |
| 21 | `block_touch` | Blocking | Ball touched, not point |
| 22 | `block_error` | Blocking | Net touch/penetration |
| 23 | `dig` | Defense | Hard-driven save |
| 24 | `save` | Defense | Emergency keep-in-play |
| 25 | `free_ball` | Defense | Easy ball over net |
| 26 | `net_touch` | Violation | Body/net contact |
| 27 | `rotation_fault` | Violation | Wrong rotation at serve |
| 28 | `substitution` | Admin | Player exchange |
| 29 | `timeout` | Admin | Team timeout |

### 4.11.2 Action Annotation Format

```json
{
  "action_id": "act_20260715_001245",
  "match_id": 1001,
  "rally_number": 18,
  "sequence_number": 3,
  "action_type": "spike",
  "player_id": 101,
  "team_id": 12,
  "start_frame": 24830,
  "end_frame": 24855,
  "start_timestamp": "2026-07-15T14:32:17.420Z",
  "end_timestamp": "2026-07-15T14:32:17.670Z",
  "court_zone": 4,
  "outcome": "kill",
  "confidence": 0.92,
  "metadata": {
    "jump_height_cm": 72,
    "ball_speed_kmh": 87,
    "contact_height_m": 3.1
  }
}
```

### 4.11.3 Temporal Boundaries

| Action | Start Trigger | End Trigger |
|--------|---------------|-------------|
| `serve` | Ball toss release | Ball crosses net plane |
| `reception` | Ball contact by receiver | Ball leaves receiver's platform |
| `set` | Ball contact by setter | Ball leaves setter's hands |
| `spike` | Jump takeoff | Ball contact or landing |
| `block` | Jump takeoff | Landing or ball contact |
| `dig` | Ball contact by defender | Ball leaves defender's platform |

---

## 4.12 Event Annotation

### 4.12.1 Event Structure

Events are higher-level outcomes derived from action sequences:

```json
{
  "event_id": "evt_20260715_001245",
  "match_id": 1001,
  "set_number": 2,
  "rally_number": 18,
  "event_type": "POINT",
  "scoring_team_id": 12,
  "point_type": "KILL",
  "responsible_player_id": 101,
  "sequence": [
    {"action": "serve", "player": 203, "team": 15},
    {"action": "reception", "player": 101, "quality": "perfect"},
    {"action": "set", "player": 105},
    {"action": "spike", "player": 101, "outcome": "kill"}
  ],
  "timestamp": "2026-07-15T14:32:17.670Z",
  "score_before": {"home": 23, "away": 21},
  "score_after": {"home": 24, "away": 21}
}
```

### 4.12.2 Event Types

| Event Type | Trigger | Score Impact |
|------------|---------|--------------|
| `POINT` | Kill, ace, block point, opponent error | +1 scoring team |
| `SIDE_OUT` | Service error, reception error | No point, serve changes |
| `VIOLATION` | Net touch, rotation fault, etc. | +1 opponent |
| `SUBSTITUTION` | Coach request | None |
| `TIMEOUT` | Coach request | None |
| `SET_END` | Team reaches 25 (15) with 2-pt lead | Set complete |
| `MATCH_END` | Team wins required sets | Match complete |

---

## 4.13 Temporal Annotation

### 4.13.1 Frame-Level Precision

| Field | Format | Description |
|-------|--------|-------------|
| `start_frame` | Integer | First frame of action/event |
| `end_frame` | Integer | Last frame (inclusive) |
| `start_timestamp` | ISO 8601 | UTC timestamp of start_frame |
| `end_timestamp` | ISO 8601 | UTC timestamp of end_frame |
| `duration_ms` | Integer | `(end_frame - start_frame) * (1000 / fps)` |

### 4.13.2 Synchronization

| Requirement | Specification |
|-------------|---------------|
| **Frame Accuracy** | ±1 frame for action boundaries |
| **Cross-Camera Sync** | ≤ 33ms (1 frame @ 30 FPS) between cameras |
| **Timestamp Source** | Camera PTS or system clock (NTP-synced) |
| **Drift Correction** | Periodic re-sync via whistle/serve events |

---

## 4.14 Occlusion Guidelines

| Scenario | Rule |
|----------|------|
| **Player behind player** | Continue tracking visible player; mark occluded player `occluded=true`; maintain track ID |
| **Ball behind player** | Annotate ball if >20% visible; predict trajectory during full occlusion |
| **Ball behind net** | Annotate if visible through net; mark `behind_net=true` |
| **Player off-court** | End track; new track on re-entry with same ID if confirmed |
| **Crowded net (block)** | Annotate all visible players; use pose to separate |

**Principle:** Consistency over completeness. Better a slightly incomplete annotation than a guessed one.

---

## 4.15 Difficult Scenario Rules

| Scenario | Rule | Example |
|----------|------|---------|
| **Motion blur** | Box around blur streak; `blurred=true` | Fast spike, serve |
| **Fast ball** | Interpolate position from adjacent frames | Serve > 100 km/h |
| **Partial visibility** | Box around visible; `occluded=true` | Player behind block |
| **Reflections** | Ignore court reflections; annotate real object | Polished floor |
| **Shadows** | Annotate object, not shadow | Late afternoon sun |
| **Similar jerseys** | Use number + tracking + pose to distinguish | Both teams red |
| **Camera shake** | Stabilize frames before annotation | Handheld recording |

**Documentation:** Maintain an **Annotation Handbook** with visual examples for each scenario.

---

## 4.16 Annotation Quality Assurance

### 4.16.1 Review Checklist

| Check | Method | Threshold |
|-------|--------|-----------|
| **Label Correctness** | Expert spot-check (5% sample) | ≥ 99% accuracy |
| **Bbox Tightness** | IoU with expert box | IoU ≥ 0.85 |
| **Track Consistency** | ID switches per 1000 frames | < 2 |
| **Timestamp Accuracy** | Frame boundary alignment | ±1 frame |
| **Action Label Validity** | Rules-engine validation | 100% valid transitions |
| **Metadata Completeness** | Required fields present | 100% |

### 4.16.2 QA Metrics

| Metric | Target |
|--------|--------|
| Annotation completion rate | 100% per batch |
| Review acceptance rate | ≥ 95% |
| Correction rate (post-review) | < 5% |
| Inter-annotator agreement (IoU) | ≥ 0.90 |
| Average review time | < 2 min/frame |

---

## 4.17 Annotation Versioning

### 4.17.1 Version Format

```
v{major}.{minor}.{patch}
```

| Increment | Trigger |
|-----------|---------|
| **Major** | Schema change, new annotation type |
| **Minor** | Significant data addition/removal |
| **Patch** | Corrections, typo fixes, small additions |

### 4.17.2 Version Metadata

```yaml
version: "v2.1.0"
date: "2026-07-15"
base_version: "v2.0.3"
changes:
  - added: 1500 player bboxes (3 new venues)
  - corrected: 42 jersey numbers after review
  - fixed: 8 track ID switches in match 1045
  - schema: added `jersey_confidence` field
reviewed_by: "qa_lead_001"
approved: true
```

---

## 4.18 Annotation Team Roles

| Role | Responsibilities |
|------|------------------|
| **Annotator** | Initial labeling per guidelines |
| **Reviewer** | Quality check, corrections, feedback |
| **Quality Assurance Lead** | Final approval, metrics, process improvement |
| **Dataset Manager** | Version control, release coordination, storage |

Separating these responsibilities improves data quality.

---

## 4.19 Annotation Documentation

Every dataset includes documentation describing:

| Item | Description |
|------|-------------|
| **Label Definitions** | Exact meaning of each class |
| **Annotation Rules** | Edge cases, occlusion, partial visibility |
| **Class Names** | Exact strings used in annotations |
| **Known Limitations** | Ambiguities, dataset biases |
| **Version History** | Changelog per version |

This ensures future contributors interpret labels consistently.

---

## 4.20 Supported Annotation Formats

The platform supports widely used formats for interoperability:

| Task | Formats |
|------|---------|
| Object Detection | YOLO (.txt), COCO JSON, Pascal VOC XML |
| Instance Segmentation | COCO JSON, Mask R-CNN format |
| Keypoint Estimation | COCO Keypoints, MediaPipe format |
| Multi-Object Tracking | MOT Challenge format, TAO format |

Export format varies by model training requirements.

---

## 4.21 Future Annotation Enhancements

| Capability | Description |
|------------|-------------|
| **AI-assisted Pre-annotation** | Model generates initial labels; human corrects |
| **Automatic Tracking Initialization** | Track IDs auto-propagated across frames |
| **Active Learning Workflows** | Model flags uncertain samples for human review |
| **Semi-supervised Annotation** | Leverage unlabeled data with consistency constraints |
| **Collaborative Web UI** | Multi-annotator platform with real-time sync |
| **Annotation Analytics Dashboard** | Quality metrics, annotator performance, bottlenecks |

These features significantly reduce manual effort as the dataset grows.

---

## 4.22 Chapter Summary

This chapter establishes the standards and workflows required to produce high-quality annotations for volleyball AI models.

**Key Principles:**
- Consistent labeling rules across all annotators
- Structured review process (no unreviewed data in training)
- Version control for every annotation change
- Quality gates before dataset release

*Accurate annotations are essential for reliable computer vision systems. By enforcing consistent labeling rules, structured review processes, and version control, the platform creates a dependable foundation for model training and evaluation.*

---

## Transition to Chapter 5

With the dataset collected and annotations completed, the first AI model can now be engineered.

**Chapter 5 — Court Detection AI** will cover:

- Court geometry & FIVB standards
- Court line detection (edge → Hough → CNN classify)
- Net detection
- Camera calibration & homography estimation
- Coordinate transformation (image ↔ court meters)
- Zone mapping (6-zone system)
- Multi-camera calibration
- Performance evaluation

*Court detection is the first stage of the AI perception pipeline. Every subsequent AI module — player detection, ball tracking, heat maps, and tactical analytics — depends on an accurate understanding of the playing area. Establishing a reliable court model is therefore essential for the success of the entire platform.*

---

**END OF CHAPTER 4**

*Next: Chapter 5 — Court Detection AI*