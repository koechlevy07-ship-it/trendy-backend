# VOLUME 2: AI ENGINEERING & COMPUTER VISION IMPLEMENTATION SPECIFICATION (AECVIS)

**Version:** 1.0  
**Date:** July 15, 2026  
**Status:** Active Development

---

# CHAPTER 9: JERSEY NUMBER RECOGNITION (OCR)

---

## 9.1 Purpose

The Jersey Number Recognition module is responsible for identifying each player by reading the jersey number visible during the match.

Its objectives are to:

- Detect the jersey number region
- Recognize jersey numbers accurately
- Associate numbers with tracked players
- Match recognized numbers with team rosters
- Maintain player identities throughout the match
- Improve statistics accuracy

---

## 9.2 Role Within the AI Pipeline

The OCR module operates after player detection and tracking.

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
Jersey Number Recognition (OCR)
   │
   ▼
Player Identity Resolution
   │
   ▼
Pose Estimation
   │
   ▼
Action Recognition
```

This ensures that each tracked player can be linked to a real athlete.

---

## 9.3 Functional Requirements

The OCR module shall:

- Detect jersey number regions
- Recognize one- and two-digit jersey numbers
- Handle partially visible numbers
- Verify numbers across multiple frames
- Associate numbers with tracking IDs
- Match numbers with official team rosters
- Produce confidence scores for every recognition

---

## 9.4 OCR Workflow

```
Tracked Player
      │
      ▼
Locate Jersey Region
      │
      ▼
Extract Jersey Image
      │
      ▼
Image Enhancement
      │
      ▼
OCR Recognition
      │
      ▼
Confidence Validation
      │
      ▼
Roster Matching
      │
      ▼
Confirmed Player Identity
```

---

## 9.5 Jersey Region Detection

The AI should first identify the portion of the player image containing the jersey number.

The detected region should:

- Exclude unnecessary background
- Focus on the torso
- Adjust for player orientation
- Support both front and back jersey numbers where visible

### 9.5.1 Region Extraction

```python
def extract_jersey_region(player_bbox: np.ndarray, frame: np.ndarray, 
                          pose_keypoints: Optional[np.ndarray] = None) -> np.ndarray:
    """
    Extract jersey number region from player bounding box.
    
    Strategy:
    1. If pose available: use shoulder/hip keypoints to locate torso
    2. Fallback: top 40% of player bbox (typical jersey area)
    3. Expand slightly for perspective/rotation
    """
    x1, y1, x2, y2 = player_bbox
    h, w = y2 - y1, x2 - x1
    
    if pose_keypoints is not None:
        # Use shoulder (11,12) and hip (23,24) keypoints
        shoulders = pose_keypoints[[11, 12]]
        hips = pose_keypoints[[23, 24]]
        if np.all(shoulders[:, 2] > 0.5) and np.all(hips[:, 2] > 0.5):
            y_top = int(np.min(shoulders[:, 1]))
            y_bot = int(np.max(hips[:, 1]))
            x_center = int(np.mean([shoulders[:, 0].mean(), hips[:, 0].mean()]))
            torso_w = int((y_bot - y_top) * 0.8)
            x1 = max(0, x_center - torso_w // 2)
            x2 = min(frame.shape[1], x_center + torso_w // 2)
            return frame[y_top:y_bot, x1:x2]
    
    # Fallback: upper 40% of bbox
    torso_h = int(h * 0.4)
    return frame[y1:y1+torso_h, x1:x2]
```

---

## 9.6 Image Enhancement

Before OCR, the jersey image undergoes preprocessing to maximize recognition accuracy.

### 9.6.1 Enhancement Pipeline

```python
def enhance_jersey_image(image: np.ndarray) -> np.ndarray:
    """
    Preprocess jersey crop for OCR.
    """
    # 1. Resize for consistent OCR input (height ~64px)
    h, w = image.shape[:2]
    target_h = 64
    scale = target_h / h
    image = cv2.resize(image, (int(w * scale), target_h), 
                       interpolation=cv2.INTER_CUBIC)
    
    # 2. Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # 3. Contrast enhancement (CLAHE)
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    enhanced = clahe.apply(gray)
    
    # 3. Noise reduction
    denoised = cv2.fastNlMeansDenoising(enhanced, h=10)
    
    # 4. Sharpening
    kernel = np.array([[-1,-1,-1], [-1,9,-1], [-1,-1,-1]])
    sharpened = cv2.filter2D(denoised, -1, kernel)
    
    # 5. Binarization (adaptive)
    binary = cv2.adaptiveThreshold(
        sharpened, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY, 11, 2
    )
    
    # 6. Morphological cleanup
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))
    cleaned = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel)
    
    return cleaned
```

---

## 9.7 Number Recognition

### 9.7.1 OCR Engine Selection

| Engine | Pros | Cons | Decision |
|--------|------|------|----------|
| **PaddleOCR** | High accuracy, lightweight, multi-language | Chinese origin | **Primary** |
| **EasyOCR** | Good accuracy, simple API | Slower | Fallback |
| **Tesseract** | Mature, open-source | Struggles with rotated/small text | Legacy |
| **Custom CNN+CTC** | Tailored to jersey fonts | Development effort | Future |

**Primary:** PaddleOCR (PP-OCRv3) with PP-OCRv3_mobile for speed  
**Fallback:** EasyOCR (English model)

### 9.7.2 Recognition Scope

| Number Type | Range | Examples |
|-------------|-------|----------|
| Single-digit | 0–9 | 0, 1, 2, 7, 9 |
| Double-digit | 10–99 | 10, 11, 12, 14, 18, 23, 99 |

### 9.7.3 OCR Configuration (PaddleOCR)

```python
from paddleocr import PaddleOCR

ocr = PaddleOCR(
    use_angle_cls=True,      # Text orientation classification
    lang='en',               # English numbers
    use_gpu=True,
    det_model_dir='models/ocr/det_mobile',
    rec_model_dir='models/ocr/rec_mobile',
    cls_model_dir='models/ocr/cls_mobile',
    det_db_thresh=0.3,
    det_db_box_thresh=0.5,
    det_db_unclip_ratio=1.5,
    rec_batch_num=6,
    max_text_length=2,       # Max 2 digits
    use_space_char=False,
    drop_score=0.5           # Minimum confidence
)
```

### 9.7.4 OCR Output Format

```python
@dataclass
class OCRResult:
    track_id: int
    frame_id: int
    timestamp_ms: int
    jersey_number: Optional[int]      # None if unrecognized
    raw_text: str                     # Raw OCR output
    confidence: float                 # 0.0–1.0
    bbox_in_frame: Tuple[int, int, int, int]  # x1, y1, x2, y2
    enhancement_applied: bool
    processing_time_ms: float
```

---

## 9.8 Confidence Scoring

### 9.8.1 Per-Frame Confidence

Each recognition includes a confidence score (0.0–1.0) from the OCR engine.

| Confidence | Action |
|------------|--------|
| **≥ 0.9** | Strong candidate |
| **0.7–0.9** | Moderate; add to temporal buffer |
| **0.5–0.7** | Weak; queue for multi-frame verification |
| **< 0.5** | Discard; treat as unknown |

### 9.8.2 Temporal Confidence Aggregation

```python
def aggregate_jersey_confidence(track_id: int, 
                                 recent_results: List[OCRResult],
                                 window: int = 15) -> Tuple[Optional[int], float]:
    """
    Aggregate jersey number confidence over temporal window.
    Returns: (best_number, aggregated_confidence)
    """
    valid = [r for r in recent_results[-window:] if r.jersey_number is not None]
    if not valid:
        return None, 0.0
    
    # Weight by confidence and recency
    weights = []
    numbers = []
    for i, r in enumerate(valid):
        recency_weight = (i + 1) / len(valid)  # More recent = higher weight
        conf_weight = r.confidence
        weights.append(recency_weight * conf_weight)
        numbers.append(r.jersey_number)
    
    # Weighted mode
    unique_nums = set(numbers)
    best_num = max(unique_nums, key=lambda n: sum(w for n, w in zip(numbers, weights) if n == n))
    best_conf = sum(w for n, w in zip(numbers, weights) if n == best_num) / sum(weights)
    
    return best_num, best_conf
```

---

## 9.9 Multi-Frame Verification

### 9.9.1 Verification Pipeline

```
Frame N      → OCR: "7" (conf: 0.92)  → Buffer: [7×0.92]
Frame N+1    → OCR: "7" (conf: 0.89)  → Buffer: [7×0.92, 7×0.89]
Frame N+2    → OCR: "7" (conf: 0.95)  → Buffer: [7×0.92, 7×0.89, 7×0.95]
                                  ↓
                        Majority Vote + Weighted Confidence
                                  ↓
                        Confirmed: Jersey #7 (conf: 0.92)
```

### 9.9.2 Confirmation Rules

| Condition | Threshold |
|-----------|-----------|
| **Minimum frames** | 3 consistent recognitions |
| **Minimum confidence** | Mean ≥ 0.75 |
| **Consistency** | ≥ 80% same number in window |
| **Max gap** | ≤ 5 frames without recognition |

```python
def is_confirmed(buffer: List[OCRResult]) -> bool:
    if len(buffer) < 3:
        return False
    numbers = [r.jersey_number for r in buffer]
    confs = [r.confidence for r in buffer]
    majority = max(set(numbers), key=numbers.count)
    consistency = numbers.count(majority) / len(numbers)
    mean_conf = np.mean(confs)
    return consistency >= 0.8 and mean_conf >= 0.75
```

---

## 9.9 Partial Visibility Handling

| Scenario | Strategy |
|----------|----------|
| **Arm covering number** | Wait for clear frames; don't guess |
| **Net occlusion** | Use temporal buffer; don't force recognition |
| **Folded/wrinkled jersey** | Image enhancement + temporal smoothing |
| **Rotation (side view)** | Skip; wait for frontal view |
| **Low resolution** | Upscale (ESRGAN) + OCR; lower confidence |

**Rule:** Never guess. Return `None` with low confidence rather than risk wrong identity.

---

## 9.11 Team Roster Integration

### 9.11.1 Pre-Match Roster Loading

```python
@dataclass
class RosterEntry:
    jersey_number: int
    player_name: str
    position: str          # OH, MB, OPP, S, L, DS
    team_id: str
    player_id: str         # Global unique ID
    is_libero: bool
    is_captain: bool

def load_rosters(match_id: int) -> Tuple[Dict[int, RosterEntry], Dict[int, RosterEntry]]:
    """
    Returns: (home_roster, away_roster) keyed by jersey number
    """
    pass
```

### 9.11.2 Roster Matching

```python
def match_jersey_to_roster(jersey_number: int, 
                           team: str,
                           home_roster: Dict[int, RosterEntry],
                           away_roster: Dict[int, RosterEntry]) -> Optional[RosterEntry]:
    roster = home_roster if team == "home" else away_roster
    
    # Exact match
    if jersey_number in roster:
        return roster[jersey_number]
    
    # Fuzzy match (if OCR uncertainty)
    # Not recommended for production; log for review
    return None
```

---

## 9.12 Player Identity Resolution

### 9.12.1 Identity Linking

```python
@dataclass
class PlayerIdentity:
    track_id: int
    player_id: str           # Global unique ID from roster
    player_name: str
    jersey_number: int
    team: str
    position: str
    confidence: float
    confirmed_at_frame: int
    confirmed_at_timestamp: str
```

### 9.12.2 Resolution Logic

```python
def resolve_identity(track: PlayerTrack, 
                     ocr_result: OCRResult,
                     rosters: Tuple[Dict, Dict]) -> Optional[PlayerIdentity]:
    """
    Link track to roster entry via OCR.
    """
    if ocr_result.jersey_number is None:
        return None
    
    # Match to roster
    roster_entry = match_jersey_to_roster(
        ocr_result.jersey_number, 
        track.team,
        rosters[0], rosters[1]
    )
    
    if roster_entry is None:
        return None
    
    # Verify track team matches roster team
    if track.team != roster_entry.team_id:
        logger.warning(f"Team mismatch: track={track.team}, roster={roster_entry.team_id}")
    
    return PlayerIdentity(
        track_id=track.track_id,
        player_id=roster_entry.player_id,
        player_name=roster_entry.player_name,
        jersey_number=ocr_result.jersey_number,
        team=track.team,
        position=roster_entry.position,
        confidence=ocr_result.confidence,
        confirmed_at_frame=ocr_result.frame_id,
        confirmed_at_timestamp=ocr_result.timestamp_ms
    )
```

---

## 9.13 Identity Persistence

Once confirmed, identity remains stable:

| Rule | Specification |
|------|---------------|
| **Confirmation** | Requires 3-frame confirmation (per §9.9) |
| **Persistence** | Identity locked for track lifetime |
| **Correction** | Only if new evidence confidence > current + 0.2 |
| **Logging** | All changes logged with timestamp, old/new values |

```python
class IdentityManager:
    def __init__(self):
        self.identities: Dict[int, PlayerIdentity] = {}  # track_id → identity
        self.corrections: List[IdentityCorrection] = []
    
    def update(self, track_id: int, new_identity: Optional[PlayerIdentity]) -> bool:
        current = self.identities.get(track_id)
        if current is None:
            self.identities[track_id] = new_identity
            return True
        
        if new_identity is None:
            return False
        
        # Allow correction only if significantly more confident
        if new_identity.confidence > current.confidence + 0.2:
            self.corrections.append(IdentityCorrection(
                track_id=track_id,
                old=current,
                new=new_identity,
                timestamp=datetime.now()
            ))
            self.identities[track_id] = new_identity
            return True
        return False
```

---

## 9.14 Handling Substitutions

### 9.14.1 Substitution Detection

```python
def detect_substitution(prev_lineup: Set[int], 
                        current_tracks: List[PlayerTrack],
                        ocr_results: List[OCRResult]) -> List[SubstitutionEvent]:
    """
    Detect when a tracked player leaves and new jersey appears.
    """
    active_jerseys = {ocr.jersey_number for ocr in ocr_results if ocr.jersey_number}
    prev_jerseys = {id.player_id for id in active_lineup}
    
    exited = prev_jerseys - active_jerseys
    entered = active_jerseys - prev_jerseys
    
    events = []
    for jersey in exited:
        events.append(SubstitutionEvent(type="OUT", jersey=jersey))
    for jersey in entered:
        events.append(SubstitutionEvent(type="IN", jersey=jersey))
    return events
```

### 9.14.2 Substitution Handling

| Event | Action |
|-------|--------|
| **Player OUT** | Freeze statistics; mark track as substituted |
| **Player IN** | Create new track; link to roster; start fresh statistics |
| **Libero swap** | Special handling: unlimited, no substitution count |

---

## 9.15 OCR Error Handling

| Challenge | Mitigation |
|-----------|------------|
| **Motion blur** | Temporal smoothing; skip blurred frames |
| **Wrinkled jersey** | CLAHE + morphological cleanup |
| **Similar digits (5/6, 8/9)** | Context: only valid roster numbers |
| **Low resolution** | Super-resolution upscale (ESRGAN) + OCR |
| **Poor lighting** | CLAHE + adaptive threshold |
| **Rotated text** | Perspective correction from pose keypoints |

---

## 9.16 Identity Correction

### 9.16.1 Correction Trigger

```python
def should_correct_identity(current: PlayerIdentity, 
                            candidate: PlayerIdentity) -> bool:
    """
    Allow correction only if:
    1. New evidence significantly more confident
    2. Or current identity was never fully confirmed
    3. Or roster correction (official update)
    """
    if not candidate.confirmed:
        return False
    if not current.confirmed:
        return True
    if candidate.confidence > current.confidence + 0.2:
        return True
    return False
```

### 9.16.2 Correction Logging

```python
@dataclass
class IdentityCorrection:
    track_id: int
    old_identity: PlayerIdentity
    new_identity: PlayerIdentity
    reason: str  # "higher_confidence", "roster_update", "manual_override"
    corrected_by: str  # "auto" / "statistician"
    timestamp: datetime
```

All corrections are immutable audit entries.

---

## 9.17 OCR Output Specification

```json
{
  "track_id": 101,
  "jersey_number": 7,
  "player_name": "Jane Doe",
  "team": "home",
  "playing_position": "Outside Hitter",
  "confidence_score": 0.96,
  "timestamp": "2026-07-15T14:32:17.420Z",
  "frame_id": 24830,
  "status": "CONFIRMED",
  "verification_frames": 5,
  "mean_confidence": 0.94
}
```

---

## 9.18 Performance Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Character Accuracy** | ≥ 98% | Per-digit on test set |
| **Full Number Accuracy** | ≥ 95% | Exact match on clear frames |
| **Identity Confirmation Rate** | ≥ 95% | Tracks confirmed by end of match |
| **False Recognition Rate** | < 1% | Wrong number assigned |
| **Recognition Latency** | < 50ms/frame | P95 on target GPU |
| **Multi-frame Consistency** | ≥ 95% | Same number across window |

---

## 9.19 Integration with Other Modules

| Module | Consumes |
|--------|----------|
| **Pose Estimation** | Player identity for role-specific pose analysis |
| **Action Recognition** | Player identity for action attribution |
| **Statistics Engine** | Player identity for stat attribution |
| **Heat Map Generator** | Player identity for personalized heat maps |
| **Tactical Analysis** | Player identity for role-based analysis |
| **Match Reports** | Player names for readable output |
| **Performance Dashboard** | Player identity for individual dashboards |

---

## 9.20 Security and Privacy

| Requirement | Implementation |
|-------------|----------------|
| **Access Control** | Role-based access to roster/identity data |
| **Audit Logging** | All identity changes logged |
| **Data Protection** | Encrypt PII at rest; TLS in transit |
| **Consent Management** | Track player consent for analytics |
| **Retention Policy** | Identity data retained per league policy |
| **Right to Erasure** | API for player data deletion |

---

## 9.21 Future Enhancements

| Feature | Description |
|---------|-------------|
| **Name Recognition** | Read player names from jersey back |
| **Sponsor Logo Recognition** | Commercial analytics |
| **Captain/ Libero Badge** | Detect role indicators |
| **Automatic Roster Import** | Federation API integration |
| **Face Recognition** | Where legally permitted + consent |
| **Multi-language OCR** | International competitions |

---

## 9.22 Chapter Summary

The Jersey Number Recognition (OCR) module connects tracked players to their real identities by detecting and recognizing jersey numbers and matching them to official team rosters. Through multi-frame verification, confidence scoring, and robust identity management, it ensures that every action, statistic, and movement is accurately attributed to the correct athlete.

**Key Decisions:**
- **PaddleOCR** (PP-OCRv3) with image enhancement pipeline
- **Temporal smoothing** over 15-frame window with weighted voting
- **Roster-based validation** — only valid jersey numbers accepted
- **Identity persistence** with correction threshold (Δconf > 0.2)
- **Substitution handling** via jersey entry/exit detection
- **Audit trail** for all identity changes

*Reliable player identification is essential for trustworthy analytics, match reports, and long-term performance tracking.*

---

## Transition to Chapter 10

With player identities established, the next module estimates body pose for action understanding.

**Chapter 10 — Pose Estimation** will cover:

- Keypoint detection architecture (MediaPipe, RTMPose)
- 33 keypoint skeleton
- Temporal smoothing
- Occlusion handling
- Action-relevant keypoint subsets
- Integration with tracking and action recognition

*Pose estimation provides the biomechanical foundation for understanding volleyball actions — from serve mechanics to spike dynamics to defensive positioning.*

---

**END OF CHAPTER 9**

*Next: Chapter 10 — Pose Estimation*