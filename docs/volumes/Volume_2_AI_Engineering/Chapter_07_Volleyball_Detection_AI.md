# VOLUME 2: AI ENGINEERING & COMPUTER VISION IMPLEMENTATION SPECIFICATION (AECVIS)

**Version:** 1.0  
**Date:** July 15, 2026  
**Status:** Active Development

---

# CHAPTER 7: VOLLEYBALL DETECTION AI

---

## 7.1 Purpose

The Volleyball Detection AI module is responsible for detecting and localizing the volleyball in every video frame.

Its objectives are to:

- Detect the ball accurately
- Locate the ball within the frame
- Estimate ball position
- Handle high-speed movement
- Support real-time processing
- Provide reliable input to the tracking and action recognition modules

---

## 7.2 Role Within the AI Pipeline

The Volleyball Detection AI operates alongside Player Detection AI.

```
Camera
    │
    ▼
Court Detection
    │
    ├───────────────┐
    ▼               ▼
Player Detection   Ball Detection
    │               │
    └──────┬────────┘
           ▼
      Object Tracking
           │
           ▼
      Pose Estimation
           │
           ▼
   Action Recognition
```

Player and ball detections are merged during tracking to create a complete understanding of the match.

---

## 7.3 Functional Requirements

The Volleyball Detection AI shall:

- Detect the volleyball in each frame
- Estimate its image coordinates
- Support real-time processing
- Handle motion blur
- Detect partially visible balls
- Operate under varying lighting conditions
- Provide a confidence score for each detection
- Supply detections to the tracking system

---

## 7.4 Characteristics of the Volleyball

Compared with players, the volleyball presents unique challenges:

| Property | Impact on Detection |
|----------|---------------------|
| Small object | Occupies few pixels |
| High speed | Motion blur |
| Rapid direction changes | Difficult tracking |
| Frequent occlusion | Temporary disappearance |
| Similar colors | False detections |
| Rotational movement | Changing appearance |

These characteristics influence dataset design and model selection.

---

## 7.5 Detection Pipeline

```
Video Frame
      │
      ▼
Image Preprocessing
      │
      ▼
Ball Detection Model
      │
      ▼
Candidate Detections
      │
      ▼
Confidence Filtering
      │
      ▼
Duplicate Removal
      ▼
Final Ball Detection
```

The detector should produce one primary ball detection per frame whenever the ball is visible.

---

## 7.6 Image Preprocessing

To improve small-object detection, preprocessing may include:

- Contrast enhancement
- Noise reduction
- Resolution adjustment
- Image sharpening where appropriate

Preprocessing should improve visibility without introducing artifacts.

---

## 7.7 Ball Localization

For each detected volleyball, the system should estimate:

- Bounding box
- Center point
- Radius (if applicable)
- Image coordinates
- Detection confidence

Example output:

```
Ball
├── Bounding Box
├── Center (x, y)
├── Confidence
└── Timestamp
```

---

## 7.8 Motion Blur Handling

Fast serves and spikes often produce motion blur.

The detector should remain robust by:

- Training on blurred examples
- Using temporal information from neighboring frames
- Combining detection with tracking

Motion blur should not automatically result in lost detections.

---

## 7.9 Small Object Detection

Because the volleyball occupies a small portion of the frame, the model should prioritize:

- Fine spatial detail
- High-resolution feature maps
- Diverse ball sizes during training

The dataset should include examples of the ball at varying distances from the camera.

---

## 7.10 Occlusion Handling

The volleyball may be hidden by:

- Players
- The net
- The referee
- Camera motion

When the ball becomes temporarily invisible:

- The system should rely on tracking predictions.
- Resume direct detection once the ball reappears.
- Avoid generating false detections during complete occlusion.

---

## 7.11 Ball Confidence Scoring

Each detection should include a confidence value.

Example:

| Frame | Confidence |
|-------|------------|
| 2451  | 0.98       |
| 2452  | 0.96       |
| 2453  | 0.91       |

Confidence values assist downstream modules in deciding whether to trust or verify a detection.

---

## 7.12 Ball Position Estimation

The system should estimate:

- Image position
- Court position (after coordinate transformation)
- Height estimate (future enhancement)
- Relative movement between frames

Court coordinates enable tactical and statistical analysis.

---

## 7.13 Ball Trajectory Initialization

Each successful detection contributes to the ball's trajectory.

```
Frame 100
    ↓
Frame 101
    ↓
Frame 102
    ↓
Frame 103
    ↓
Trajectory
```

The trajectory is refined by the tracking module.

---

## 7.14 False Detection Reduction

Possible false positives include:

- Bright ceiling lights
- White shoes
- White jerseys
- Reflections
- Court markings

The detector should use contextual information to reduce incorrect detections.

---

## 7.15 Ball Reacquisition

After temporary loss, the AI should:

- Predict the expected location
- Search the surrounding region
- Resume tracking upon confident detection

This reduces interruptions during rallies.

---

## 7.16 Multi-Camera Support

Future deployments may use multiple synchronized cameras.

Benefits include:

- Reduced occlusions
- Improved ball localization
- Better trajectory estimation
- More reliable action recognition

The architecture should support merging detections from multiple views.

---

## 7.17 Environmental Robustness

The detector should operate across:

- Different lighting conditions
- Different court colors
- Various volleyball designs
- Different camera qualities
- Indoor venues
- Future outdoor deployments

Dataset diversity is key to achieving robustness.

---

## 7.18 Performance Metrics

The Volleyball Detection AI should be evaluated using:

- Precision
- Recall
- Mean Average Precision (mAP)
- Detection latency
- False positive rate
- False negative rate
- Detection stability

Performance should be measured on validation datasets that reflect real match conditions.

---

## 7.19 Output Specification

Each ball detection should produce:

```
Ball Detection
├── Detection ID
├── Bounding Box
├── Center Point
├── Image Coordinates
├── Court Coordinates
├── Confidence Score
└── Timestamp
```

This output feeds directly into the tracking module.

---

## 7.20 Integration with Tracking

The tracking system uses ball detections to:

- Maintain ball identity
- Predict movement
- Handle temporary occlusions
- Estimate trajectories
- Support action recognition

Reliable detections improve overall system stability.

---

## 7.21 Failure Scenarios

Potential challenges include:

| Challenge | Mitigation |
|-----------|------------|
| Motion blur | Temporal modeling and training on blurred samples |
| Ball hidden by players | Predictive tracking and reacquisition |
| Similar-colored objects | Context-aware filtering and diverse training data |
| Fast camera movement | Camera stabilization and recalibration |
| Ball leaving the frame | Predict exit and monitor re-entry |

---

## 7.22 Model Improvement Strategy

The Volleyball Detection AI should improve through:

- Expanded datasets
- Better annotations
- Diverse venues
- Hard-example mining
- Hyperparameter tuning
- Continuous retraining
- Validation against unseen matches

Every new model version should be evaluated before deployment.

---

## 7.23 Future Enhancements

Future versions may support:

- 3D ball trajectory estimation
- Ball spin estimation
- Ball velocity estimation
- Ball acceleration analysis
- Automatic serve speed measurement
- Impact point estimation
- Multi-camera trajectory reconstruction

---

## 7.24 Chapter Summary

The Volleyball Detection AI module identifies and localizes the volleyball throughout the match, despite challenges such as high speed, motion blur, and frequent occlusion. Accurate ball detection is essential for understanding rallies, recognizing volleyball actions, and generating reliable statistics.

By providing precise ball locations and standardized outputs, this module forms a critical bridge between visual perception and higher-level match intelligence.

---

## Transition to Chapter 8

With both court and players and ball detected, the next module stitches detections into persistent identities.

**Chapter 8 — Player Tracking AI** will cover:

- ByteTrack/BoT-SORT integration
- Track initialization and termination
- Occlusion handling and re-identification
- Jersey number association
- Track quality metrics
- Multi-camera track fusion

*Tracking transforms frame-level detections into continuous player identities — the prerequisite for action recognition, statistics, and player-centric analytics.*

**END OF CHAPTER 7**

*Next: Chapter 8 — Player Tracking AI*