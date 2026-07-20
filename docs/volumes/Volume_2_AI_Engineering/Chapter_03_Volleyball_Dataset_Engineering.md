# VOLUME 2: AI ENGINEERING & COMPUTER VISION IMPLEMENTATION SPECIFICATION (AECVIS)

**Version:** 1.0  
**Date:** July 15, 2026  
**Status:** Active Development

---

# CHAPTER 3: VOLLEYBALL DATASET ENGINEERING

---

## 3.1 Purpose

This chapter defines the standards, processes, and workflows for collecting, organizing, validating, storing, and maintaining the datasets used to train and evaluate the AI components of the Volleyball Analytics Platform.

The objectives are to:

- Build high-quality datasets
- Ensure data diversity
- Standardize data collection
- Support reproducible AI training
- Enable continuous dataset growth
- Minimize dataset bias

---

## 3.2 Dataset Philosophy

The dataset should represent **real volleyball environments** rather than ideal laboratory conditions.

Training data should include variation in:

| Variation Type | Examples |
|----------------|----------|
| **Venue Type** | Indoor courts, outdoor courts (future) |
| **Competition Level** | School, university, club, professional |
| **Camera Quality** | Webcam, IP camera, broadcast, phone |
| **Lighting** | Bright, dim, natural, mixed |
| **Player Demographics** | Different heights, body types, handedness |
| **Visual Appearance** | Jersey colors, court surfaces, net designs |

**Goal:** Improve the AI's ability to generalize to new environments.

---

## 3.3 Dataset Categories

The platform requires several specialized datasets:

| Dataset | Purpose | Primary Annotation Type |
|---------|---------|------------------------|
| **Court Dataset** | Court boundary, net, line detection | Polygons, keypoints, homography |
| **Player Dataset** | Player detection | Bounding boxes, class (player) |
| **Ball Dataset** | Volleyball detection | Bounding boxes (small object) |
| **Jersey Dataset** | OCR number recognition | Cropped torso + text label |
| **Pose Dataset** | Body keypoint estimation | 33 keypoints per player |
| **Action Dataset** | Volleyball action classification | Temporal segments + action labels |
| **Event Dataset** | Event generation | Rally context + outcome |
| **Tracking Dataset** | Player/ball identity over time | Track IDs, trajectories |

*Each dataset may evolve independently as the platform matures.*

---

## 3.4 Data Sources

### Source 1 — Self-Recorded Matches (Primary)

| Source Type | Examples |
|-------------|----------|
| **University Matches** | NCAA, U Sports, intramural |
| **Club Matches** | Regional, national leagues |
| **School Tournaments** | High school, junior high |
| **Training Sessions** | Drills, scrimmages |

**Advantages:**
- Full control over recording conditions
- Easier annotation (known context)
- Clear permissions & consent
- Consistent quality standards

### Source 2 — Publicly Available Videos

| Source | Considerations |
|--------|----------------|
| YouTube, broadcast clips, federation archives | **Must verify:** copyright, licensing, TOS compliance. Use only where legally permitted. |
| Research datasets (e.g., Volleyball-12, custom public sets) | Verify license (CC-BY, MIT, etc.) |

### Source 3 — Partner Organizations (Future)

| Partner Type | Value |
|--------------|-------|
| Volleyball clubs | Regular match footage |
| Universities/academies | Structured training sessions |
| Federations | Tournament footage, multiple venues |

### Source 4 — Synthetic Data (Future)

| Use Case | Approach |
|----------|----------|
| Rare events (rotation faults, net touches) | Blender/Unity simulation |
| Extreme lighting | Domain randomization |
| Occlusion scenarios | Procedural crowd generation |

*Synthetic data complements, never replaces, real match footage.*

---

## 3.5 Camera Standards

### 3.5.1 Recording Characteristics

| Parameter | Recommendation |
|-----------|----------------|
| **Stability** | Tripod/mount; no handheld |
| **Coverage** | Full court (18m × 9m) visible |
| **Obstruction** | Minimal (no poles, nets in foreground) |
| **Frame Rate** | ≥ 30 FPS (≥ 60 FPS preferred for ball) |
| **Resolution** | ≥ 1920×1080 (4K if available) |
| **Lighting** | Uniform, no strobing |

| Frame Rate | Storage (1h @ 1080p H.264) | Use Case |
|------------|----------------------------|----------|
| 30 FPS | ~3-5 GB | Standard |
| 60 FPS | ~6-10 GB | Ball tracking, action detail |
| 120 FPS | ~12-20 GB | High-speed analysis |

---

## 3.6 Camera Positions

### Position A — End Court (Primary)

```
                         ┌─────────────────────────────────────┐
                         │                                     │
                         │           COURT (18m × 9m)          │
                         │                                     │
                         │                                     │
                         └─────────────────────────────────────┘
                                           │
                                           ▼
                                    [ CAMERA ]
```

| Purpose | Details |
|---------|---------|
| **Full-court analysis** | Team positioning, transitions |
| **Tactical evaluation** | Rotations, formations |
| **Heat maps** | Player coverage zones |

### Position B — Side Court (Complementary)

```
                         ┌─────────────────────────────────────┐
                         │                                     │
                    [ CAMERA ]                                  │
                         │                                     │
                         │           COURT (side view)         │
                         │                                     │
                         └─────────────────────────────────────┘
```

| Purpose | Details |
|---------|---------|
| **Jump analysis** | Vertical trajectory, timing |
| **Attack mechanics** | Arm swing, approach |
| **Blocking** | Penetration, timing |
| **Ball trajectory** | 3D path reconstruction |

### Position C — Elevated/Overhead (Future)

| Purpose | Details |
|---------|---------|
| **Tactical analysis** | Team shape, spacing |
| **Formation analysis** | Rotation visualization |
| **Heat maps** | Accurate 2D court mapping |

---

## 3.7 Match Diversity

The dataset should span:

| Dimension | Categories |
|-----------|------------|
| **Gender** | Men's, Women's |
| **Age Group** | Youth (U12-U18), Junior, Senior, Masters |
| **Skill Level** | Recreational, Club, Collegiate, Professional |
| **League/Format** | Indoor 6v6, Beach 2v2 (future), Sitting (future) |
| **Playing Style** | Fast offense, defensive, balanced |
| **Tournament Type** | League, knockout, round-robin, friendly |

---

## 3.8 Environmental Diversity

| Factor | Variants |
|--------|----------|
| **Lighting** | Bright LED, fluorescent, natural daylight, mixed, dim |
| **Court Surface** | Wood, synthetic, Taraflex, concrete (outdoor) |
| **Court Lines** | White, yellow, colored (contrast variations) |
| **Wall/Background** | Plain, bannered, glass, spectator stands |
| **Net Type** | Standard, antenna-equipped, beach net |
| **Time of Day** | Morning, afternoon, evening, night |

---

## 3.9 Player Diversity

| Attribute | Target Coverage |
|-----------|-----------------|
| **Height** | 150 cm – 210+ cm |
| **Body Type** | Ectomorph, mesomorph, endomorph |
| **Skin Tone** | Full Fitzpatrick scale |
| **Handedness** | Right, left, ambidextrous |
| **Hairstyle** | Short, long, tied, braided, covered |
| **Jersey Design** | Solid, striped, patterned, sponsor logos |
| **Protective Gear** | Knee pads, sleeves, ankle braces, finger tape |

---

## 3.10 Match Metadata

Every recorded match requires structured metadata:

| Field | Type | Description |
|-------|------|-------------|
| `match_id` | UUID | Unique identifier |
| `date` | ISO date | Recording date |
| `competition` | String | Tournament/league name |
| `venue` | String | Arena name, city, country |
| `camera_setup` | JSON | Camera positions, models, settings |
| `resolution` | String | e.g., `1920x1080` |
| `frame_rate` | Integer | FPS |
| `duration_seconds` | Float | Total recording duration |
| `teams` | Array | `[{id, name, side: home/away}]` |
| `sets_played` | Integer | |
| `final_score` | String | e.g., "3-1 (25-21, 23-25, 25-19, 25-22)" |

*Metadata stored alongside video in DVC-tracked manifest.*

---

## 3.11 Video Segmentation

Rather than training on full matches, recordings are segmented:

| Segment Type | Duration | Use Case |
|--------------|----------|----------|
| **Individual Rallies** | 5-30s | Action recognition, event generation |
| **Serve Sequences** | 3-10s | Serve/reception analysis |
| **Attack Sequences** | 2-8s | Spike, block, dig training |
| **Defensive Sequences** | 3-15s | Dig, reception, free ball |
| **Timeout/Substitution** | 30-120s | Admin event detection |

**Tooling:** Auto-segmentation via rally detection + manual review.

---

## 3.12 Frame Extraction

| Policy | Detail |
|--------|--------|
| **Resolution** | Preserve native (or 1280×720 for training) |
| **Timestamps** | Frame-accurate (PTS/DTS) |
| **Camera ID** | Embedded in filename/metadata |
| **Match Reference** | `match_id` + `rally_number` + `frame_index` |
| **Sampling Rate** | Every frame (30 FPS) or every N frames (e.g., 2 = 15 FPS) |

**Naming Convention:**
```
{dataset}/{match_id}/rally_{rally:04d}/frame_{frame:06d}.jpg
```

---

## 3.13 Dataset Organization

```
datasets/
├── court/
│   ├── images/
│   ├── annotations/
│   ├── metadata.json
│   └── versions/
├── player/
│   ├── images/
│   ├── labels/          # YOLO format .txt
│   ├── metadata.json
│   └── versions/
├── ball/
│   ├── images/
│   ├── labels/
│   ├── metadata.json
│   └── versions/
├── tracking/
│   ├── sequences/
│   ├── tracks/          # Track ID → frame → bbox
│   ├── metadata.json
│   └── versions/
├── jersey/
│   ├── crops/           # Torso crops for OCR
│   ├── labels.csv       # track_id, frame, jersey_number
│   ├── metadata.json
│   └── versions/
├── pose/
│   ├── images/
│   ├── keypoints/       # 33 keypoints per player per frame
│   ├── metadata.json
│   └── versions/
├── actions/
│   ├── clips/           # 30-frame sequences
│   ├── labels.csv       # clip_id, action, player_id, outcome
│   ├── metadata.json
│   └── versions/
└── events/
    ├── matches/
    ├── events.jsonl     # Full event stream per match
    ├── metadata.json
    └── versions/
```

---

## 3.14 Data Quality Assurance

### 3.14.1 Quality Checks (Automated + Manual)

| Check | Method | Threshold |
|-------|--------|-----------|
| **Label Correctness** | Spot-check 5% sample | ≥ 99% accuracy |
| **Annotation Completeness** | Schema validation | 100% required fields |
| **Image Quality** | Blur detection (Laplacian variance) | Variance > 100 |
| **Timestamp Consistency** | Frame sequence monotonic | 0 gaps |
| **Metadata Completeness** | Required fields present | 100% |
| **Duplicate Detection** | Perceptual hashing (pHash) | 0 duplicates |

### 3.14.2 Annotation QA Pipeline

```
Raw Annotations
      │
      ▼
Schema Validation (auto)
      │
      ▼
Inter-Annotator Agreement (sample)
      │
      ▼
Expert Review (flagged samples)
      │
      ▼
Gold Standard Commit
      │
      ▼
Version Tag
```

---

## 3.15 Dataset Balancing

| Risk | Mitigation |
|------|------------|
| **Camera Angle Bias** | Stratified sampling across angles |
| **Team/Jersey Bias** | Minimum N samples per team |
| **Action Class Imbalance** | Oversample rare actions; focal loss |
| **Venue Overrepresentation** | Max % per venue |
| **Lighting Skew** | Stratify by lighting condition |

**Tooling:** Custom sampler in training pipeline; DVC metrics track balance.

---

## 3.16 Dataset Versioning

### 3.16.1 Version Format

```
v{major}.{minor}.{patch}
```

| Increment | Trigger |
|-----------|---------|
| **Major** | New annotation schema, breaking change |
| **Minor** | Significant data addition (>10%), new classes |
| **Patch** | Bug fixes, quality corrections, small additions |

### 3.16.2 Release Manifest

```yaml
# datasets/versions/v2.3.0.yaml
version: "2.3.0"
date: "2026-07-15"
base_version: "v2.2.1"
changes:
  - added: 1200 player images (3 new venues)
  - added: 450 ball annotations (high-speed)
  - fixed: 23 jersey OCR labels corrected
  - removed: 12 duplicate images
stats:
  total_images: 45230
  train/val/test: 36184/4523/4523
  classes: {player: 1, ball: 1}
  annotator_agreement: 0.94
quality_gates:
  - schema_validation: pass
  - spot_check_accuracy: 0.992
  - class_balance_cv: 0.12
```

---

## 3.17 Data Security

| Measure | Implementation |
|---------|----------------|
| **Access Control** | IAM roles; least privilege for annotators |
| **Encryption at Rest** | AES-256 (S3 SSE-S3 / MinIO SSE) |
| **Encryption in Transit** | TLS 1.3 |
| **Audit Logging** | All access, modifications logged |
| **PII Protection** | No facial recognition; jersey-only IDs; blur faces if captured |
| **Backup** | Cross-region replication (S3 CRR / MinIO mirror) |
| **Retention** | Raw video: 1 year; Annotations: permanent |

---

## 3.18 Dataset Expansion Strategy

| Phase | Target | Sources |
|-------|--------|---------|
| **Phase 1 (MVP)** | 50 matches, 5 venues | University + club partners |
| **Phase 2** | 200 matches, 20 venues | Regional leagues, federation |
| **Phase 3** | 1000+ matches, 50+ venues | National federations, broadcast partners |
| **Continuous** | Monthly increments | Automated recording pipeline |

**Automation Goal:** New match → auto-segment → annotation queue → review → dataset commit (CI/CD).

---

## 3.19 Dataset Readiness Gates

A dataset version is **train-ready** only if:

| Gate | Criterion |
|------|-----------|
| **Schema** | All annotations validate against schema |
| **Completeness** | 100% required annotations present |
| **Quality** | Spot-check accuracy ≥ 99% |
| **Balance** | Class CV < 0.2; venue CV < 0.3 |
| **Metadata** | 100% matches have complete manifests |
| **Documentation** | README + annotation guide + version notes |
| **Version Tag** | Semantic version assigned in DVC/Git |

---

## 3.20 Chapter Summary

This chapter establishes the engineering standards for collecting, organizing, validating, and maintaining volleyball datasets.

**Key Principles:**
- Treat datasets as first-class versioned artifacts
- Prioritize diversity over volume
- Automate quality gates
- Version everything (data, annotations, models)
- Secure and audit all data

*High-quality datasets are the foundation of reliable computer vision systems. By treating dataset engineering as a structured process rather than an afterthought, the platform is better positioned to achieve robust performance across diverse real-world volleyball environments.*

---

## Transition to Chapter 4

With the dataset collection strategy defined, the next step is to create the annotations that allow AI models to learn from the data.

**Chapter 4 — Data Annotation System** will define:

- Annotation standards (bounding boxes, keypoints, polygons, tracking IDs)
- Annotation workflows (AI-assisted → human review → gold standard)
- Quality control (inter-annotator agreement, expert arbitration)
- Tools (CVAT, Label Studio, custom UIs)
- Team collaboration & versioning
- Review and approval processes

*This chapter forms the bridge between raw volleyball footage and trainable AI datasets, ensuring every model receives consistent, high-quality supervision during training.*

---

**END OF CHAPTER 3**

*Next: Chapter 4 — Data Annotation System*