# VOLUME 3: IMPLEMENTATION BLUEPRINT

**Version:** 1.0  
**Date:** July 15, 2026  
**Status:** Active Development

---

# CHAPTER 8: TESTING STRATEGY

---

## 8.1 Purpose

This chapter defines the comprehensive testing strategy for the Volleyball Analytics Platform to ensure reliability, performance, and quality across all system components.

---

## 8.2 Testing Philosophy

| Principle | Implementation |
|-----------|----------------|
| **Test Pyramid** | 70% Unit, 20% Integration, 10% E2E |
| **Shift Left** | Testing in CI/CD pipeline |
| **Risk-Based** | Critical paths tested first |
| **Automation First** | All tests automated in CI/CD |
| **Continuous Testing** | Tests run on every commit |

---

## 8.3 Test Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        TEST PYRAMID                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   E2E Tests (10%)          Cypress / Playwright                │
│   ████████████████████    Critical user journeys               │
│                                                                 │
│   Integration Tests (20%)  pytest + TestContainers             │
│   ████████████████████    Service integration, API contracts   │
│                                                                 │
│   Unit Tests (70%)         pytest / Vitest                     │
│   ████████████████████    Units, functions, components         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8.4 Unit Testing

### 8.4.1 Backend (Python/pytest)

```python
# backend/tests/unit/test_auth.py
import pytest
from datetime import datetime, timedelta
from app.core.security import (
    create_access_token,
    create_refresh_token,
    verify_password,
    get_password_hash,
    decode_token,
)
from app.schemas.auth import TokenPayload

class TestAuthSecurity:
    """Tests for authentication security functions."""
    
    def test_password_hashing(self):
        """Test password hashing and verification."""
        password = "securePassword123!"
        hashed = get_password_hash(password)
        
        assert hashed != password
        assert verify_password(password, hashed) is True
        assert verify_password("wrong_password", hashed) is False
    
    def test_access_token_creation(self):
        """Test JWT access token creation and validation."""
        data = {"sub": "user123", "email": "test@example.com", "role": "coach"}
        token = create_access_token(data)
        
        assert isinstance(token, str)
        assert len(token) > 0
        
        payload = decode_token(token)
        assert payload["sub"] == "user123"
        assert payload["email"] == "test@example.com"
        assert payload["role"] == "coach"
    
    def test_token_expiration(self):
        """Test token expiration handling."""
        data = {"sub": "user123"}
        token = create_access_token(data, expires_delta=timedelta(minutes=1))
        
        import time
        time.sleep(2)
        
        with pytest.raises(Exception):
            decode_token(token)
    
    def test_refresh_token(self):
        """Test refresh token creation and validation."""
        data = {"sub": "user123"}
        refresh_token = create_refresh_token(data)
        
        payload = decode_token(refresh_token)
        assert payload["type"] == "refresh"
        assert payload["sub"] == "test-user-id"
```

### 8.4.2 API Endpoint Tests

```python
# backend/tests/unit/test_matches.py
import pytest
from httpx import AsyncClient
from unittest.mock import AsyncMock, patch

@pytest.mark.asyncio
async def test_create_match(async_client: AsyncClient, auth_headers):
    """Test match creation endpoint."""
    match_data = {
        "home_team_id": "team-1",
        "away_team_id": "team-2",
        "match_date": "2024-01-15",
        "sets_format": "best_of_5",
    }
    
    response = await async_client.post(
        "/api/v1/matches",
        json=match_data,
        headers=auth_headers
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["home_team_id"] == "team-1"
    assert data["away_team_id"] == "team-2"
    assert data["status"] == "scheduled"

@pytest.mark.asyncio
async def test_get_match_stats(async_client: AsyncClient, auth_headers, sample_match):
    """Test match statistics endpoint."""
    response = await async_client.get(
        f"/api/v1/statistics/matches/{sample_match.id}",
        headers=auth_headers
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "home_team_stats" in data
    assert "away_team_stats" in data
```

### 8.4.3 Frontend (TypeScript/Vitest)

```typescript
// frontend/src/components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/common/Button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('shows loading state', () => {
    render(<Button loading>Click me</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

```typescript
// frontend/src/hooks/__tests__/useAuth.test.ts
import { renderHook, act } from '@testing-library/react'
import { useAuth } from '@/hooks/useAuth'
import { AuthProvider } from '@/providers/AuthProvider'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
)

describe('useAuth', () => {
  it('provides authentication state', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })
    
    expect(result.current.user).toBeNull()
    expect(result.current.isLoading).toBe(true)
  })

  it('handles login', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })
    
    await act(async () => {
      await result.current.login('test@example.com', 'password')
    })
    
    expect(result.current.user).toBeDefined()
    expect(result.current.isAuthenticated).toBe(true)
  })
})
```

---

## 8.5 Integration Testing

### 8.5.1 API Integration Tests

```python
# backend/tests/integration/test_match_flow.py
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_full_match_lifecycle(async_client: AsyncClient, auth_headers):
    """Test complete match lifecycle: create -> start -> score -> end."""
    
    # 1. Create match
    match_data = {
        "home_team_id": "team-1",
        "away_team_id": "team-2",
        "match_date": "2024-01-15",
        "sets_format": "best_of_5",
    }
    
    response = await test_client.post(
        "/api/v1/matches",
        json=match_data,
        headers=auth_headers
    )
    assert response.status_code == 201
    match_id = response.json()["id"]
    
    # 2. Start match
    response = await test_client.post(
        f"/api/v1/matches/{match_id}/start",
        headers=auth_headers
    )
    assert response.status_code == 200
    assert response.json()["status"] == "live"
    
    # 2. Record events via WebSocket (simulated)
    # ... WebSocket event simulation ...
    
    # 3. End match
    response = await test_client.post(
        f"/api/v1/matches/{match_id}/end",
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "completed"
    assert data["winner_team_id"] is not None
```

### 8.5.2 Database Integration Tests

```python
# backend/tests/integration/test_database.py
import pytest
from sqlalchemy.ext.asyncio import AsyncSession

@pytest.mark.asyncio
async def test_player_crud(db_session: AsyncSession):
    """Test player CRUD operations."""
    from app.models.player import Player
    from app.models.team import Team
    
    # Create team
    team = Team(name="Test Team", short_name="TT", gender="men")
    db_session.add(team)
    await db_session.flush()
    
    # Create player
    player = Player(
        team_id=team.id,
        first_name="John",
        last_name="Doe",
        jersey_number=10,
        position="OH",
    )
    db_session.add(player)
    await db_session.flush()
    
    # Verify
    assert player.id is not None
    assert player.team_id == team.id
    
    # Test unique constraint
    from sqlalchemy.exc import IntegrityError
    duplicate = Player(
        team_id=team.id,
        first_name="Jane",
        last_name="Doe",
        jersey_number=10,  # Same number
        position="OH",
    )
    db_session.add(player2)
    
    with pytest.raises(Exception):  # IntegrityError
        await db_session.flush()
```

---

## 8.6 E2E Testing

### 8.6.1 Cypress/Playwright Configuration

```typescript
// frontend/cypress.config.ts
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(message)
          return null
        }
      })
    },
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
}
```

### 8.6.2 E2E Test Scenarios

```typescript
// cypress/e2e/match_flow.cy.ts
describe('Match Flow', () => {
  beforeEach(() => {
    cy.login('coach@test.com', 'password')
    cy.visit('/matches')
  })

  it('should create and complete a match', () => {
    // Create match
    cy.get('[data-cy=create-match]').click()
    cy.get('[data-cy=home-team]').select('Team A')
    cy.get('[data-cy=away-team]').select('Team B')
    cy.get('[data-cy=submit]').click()
    
    // Start match
    cy.get('[data-cy=start-match]').click()
    cy.contains('Live').should('be.visible')
    
    // Record events
    cy.get('[data-cy=record-kill]').click()
    cy.contains('Kill recorded').should('be.visible')
    
    // End match
    cy.get('[data-cy=end-match]').click()
    cy.contains('Completed').should('be.visible')
  })

  it('should handle substitutions', () => {
    cy.visit('/matches/live/123')
    cy.get('[data-cy=substitution-btn]').click()
    cy.get('[data-cy=player-in]').select('Player A')
    cy.get('[data-cy=player-out]').select('Player B')
    cy.get('[data-cy=confirm-sub').click()
    cy.contains('Substitution recorded').should('be.visible')
  })
})
```

### 8.6.3 AI Model Testing

```python
# ai-engine/tests/test_inference.py
import pytest
import numpy as np
from inference.pipeline import InferencePipeline
from inference.config import InferenceConfig

@pytest.fixture
def inference_pipeline():
    config = InferenceConfig(
        player_model_path="models/detection/yolov8s_test.pt",
        ball_model_path="models/detection/ball_test.pt",
    )
    pipeline = InferencePipeline(config)
    return pipeline

@pytest.mark.asyncio
async def test_player_detection(inference_pipeline):
    """Test player detection accuracy."""
    # Load test frame
    frame = cv2.imread("tests/fixtures/test_frame.jpg")
    
    detections = await pipeline.player_detector.detect(test_frame)
    
    assert len(detections) > 0
    for det in detections:
        assert det["confidence"] > 0.5
        assert len(det["bbox"]) == 4

@pytest.mark.asyncio
async def test_action_recognition():
    """Test action recognition accuracy."""
    from inference.action_recognition import ActionRecognizer
    
    recognizer = ActionRecognizer(
        model_path="models/action/transformer_v1.0.0.pt",
        device="cuda:0"
    )
    
    # Test sequence of poses
    sequence = np.random.rand(30, 128).astype(np.float32)  # 30 frames
    result = await recognizer.predict(sequence)
    
    assert result.action in ACTION_LIST
    assert 0 <= action.confidence <= 1.0
```

---

## 8.7 Performance Testing

### 8.7.1 Load Testing

```yaml
# k6/load-test.js
import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  stages: [
    { duration: '2m', target: 10 },   // Ramp up
    { duration: '5m', target: 50 },   // Stay at 50 users
    { duration: '2m', target: 100 },  // Spike to 100
    { duration: '2m', target: 50 },   // Ramp down
    { duration: '1m', target: 0 },    // Cool down
  },
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests < 500ms
    http_req_failed: ['rate<0.01'],   // Error rate < 1%
  },
}

export default function() {
  const res = http.get('https://api.volleyball.ai/api/v1/matches')
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  })
  sleep(1)
}
```

### 8.7.2 AI Inference Benchmarking

```python
# ai-engine/tests/benchmark.py
import time
import torch
from inference.pipeline import InferencePipeline

def benchmark_inference():
    """Benchmark inference pipeline performance."""
    config = InferenceConfig()
    pipeline = InferencePipeline(config)
    
    # Warmup
    frame = np.random.randint(0, 255, (720, 1280, 3), dtype=np.uint8)
    for _ in range(10):
        pipeline.process_frame(np.random.rand(720, 1280, 3), 0, 0, "test")
    
    # Benchmark
    times = []
    for _ in range(100):
        frame = np.random.randint(0, 255, (720, 1280, 3), dtype=np.uint8)
        start = time.perf_counter()
        pipeline.process_frame(frame, 0, 0, "bench")
        times.append(time.perf_counter() - start)
    
    print(f"Avg: {np.mean(times)*1000:.1f}ms")
    print(f"P95: {np.percentile(times, 95)*1000:.1f}ms")
    print(f"P99: {np.percentile(times, 99)*1000:.1f}ms")
    print(f"Throughput: {1/np.mean(times):.1f} FPS")

if __name__ == "__main__":
    benchmark_inference()
```

---

## 8.8 CI/CD Pipeline Testing

### 8.8.1 GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Install Poetry
        run: pip install poetry
      - name: Install dependencies
        run: poetry install --with dev,test
      - name: Lint (Ruff)
        run: poetry run ruff check .
      - name: Type Check (MyPy)
        run: poetry run mypy .
      - name: Format Check (Black)
        run: poetry run black --check .

  test-backend:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: volley_test
          POSTGRES_USER: volley
          POSTGRES_PASSWORD: volley
        ports: [5432:5432]
        options: --health-cmd pg_isready --health-interval 10s --health-timeout 5s --health-retries 5
      redis:
        image: redis:7-alpine
        ports: [6379:6379]
    
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v5
        with: { python-version: '3.11', cache: 'poetry' }
      - name: Install dependencies
        run: poetry install --with dev,test
      - name: Run tests
        run: poetry run pytest -v --cov=app --cov-report=xml
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./backend/coverage.xml

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test -- --coverage
      - run: npm run test:e2e

  test-ai:
    runs-on: ubuntu-latest
    # GPU runner needed
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v5
        with: { python-version: '3.11' }
      - run: pip install poetry && poetry install --with dev,test
      - run: poetry run pytest ai-engine/tests -v --cov=inference

  docker-build:
    needs: [lint-and-typecheck, test-backend, test-frontend, test-ai]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build images
        run: |
          docker build -t volley-backend:${{ github.sha }} ./backend
          docker build -t volley-frontend:${{ github.sha }} ./frontend
          docker build -t volley-ai:${{ github.sha }} ./ai-engine
      - name: Push to registry
        if: github.ref == 'refs/heads/main'
        run: |
          echo ${{ secrets.GHCR_TOKEN }} | docker login ghcr.io -u ${{ github.actor }} --password-stdin
          docker push ghcr.io/${{ github.repository }}/backend:${{ github.sha }}
          docker push ghcr.io/${{ github.repository }}/frontend:${{ github.sha }}
          docker push ghcr.io/${{ github.repository }}/ai-engine:${{ github.sha }}

  deploy-staging:
    needs: docker-build
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to staging
        run: kubectl apply -k infrastructure/kubernetes/overlays/staging

  deploy-production:
    needs: docker-build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy to production
        run: kubectl apply -k infrastructure/kubernetes/overlays/prod
```

---

## 8.8 Test Coverage Requirements

| Component | Minimum Coverage | Target |
|-----------|------------------|--------|
| Backend Core | 85% | 90% |
| API Endpoints | 80% | 85% |
| Business Logic | 85% | 90% |
| Frontend Components | 70% | 80% |
| Frontend Hooks | 80% | 85% |
| AI Models | 70% | 80% |
| AI Inference | 75% | 80% |

---

## 8.8 Quality Gates

| Gate | Criteria | Action on Failure |
|------|----------|-------------------|
| **Lint** | Zero errors | Block PR |
| **Type Check** | Zero errors | Block PR |
| **Unit Tests** | ≥ 80% coverage | Block PR |
| **Integration Tests** | All pass | Block PR |
| **E2E Tests** | Critical paths pass | Block PR |
| **Security Scan** | No HIGH/CRITICAL | Block PR |
| **Performance** | p95 < 500ms | Warning only |
| **Docker Build** | Success | Block PR |

---

## 8.9 Test Data Management

### 8.10 Test Data Strategy

```python
# tests/fixtures/factories.py
import factory
from faker import Faker
from app.models.user import User
from app.models.team import Team
from app.models.player import Player
from app.models.match import Match

fake = Faker()

class UserFactory(factory.Factory):
    class Meta:
        model = User
    
    email = factory.Sequence(lambda n: f"user{n}@example.com")
    username = factory.Sequence(lambda n: f"user{n}")
    full_name = factory.LazyAttribute(lambda o: f"{fake.first_name()} {fake.last_name()}")
    hashed_password = "$2b$12$dummy_hash"
    role = "coach"
    is_active = True

class TeamFactory(factory.Factory):
    class Meta:
        model = Team
    
    name = factory.Sequence(lambda n: f"Team {n}")
    short_name = factory.Sequence(lambda n: f"T{n}")
    gender = factory.Iterator(["men", "women"])
    competition_level = "professional"

class PlayerFactory(factory.Factory):
    class Meta:
        model = Player
    
    first_name = factory.LazyAttribute(lambda _: fake.first_name())
    last_name = factory.Sequence(lambda n: f"Player{n}")
    jersey_number = factory.Sequence(lambda n: n % 99 + 1)
    position = factory.Iterator(["OH", "MB", "OPP", "S", "L", "DS"])
```

---

## 8.10 Test Execution Commands

```bash
# Makefile targets
.PHONY: test test-unit test-integration test-e2e test-ai lint typecheck

test: test-unit test-integration

test-unit:
	cd backend && poetry run pytest tests/unit -v --cov=app --cov-report=term-missing
	cd frontend && npm run test:unit

test-integration:
	cd backend && poetry run pytest tests/integration -v
	cd frontend && npm run test:e2e

test-ai:
	cd ai-engine && poetry run pytest tests/ -v --tb=short

test-e2e:
	cd frontend && npm run test:e2e

test-all: test lint typecheck test-unit test-integration test-e2e test-ai

# Coverage report
coverage:
	cd backend && poetry run pytest --cov=app --cov-report=html
	cd frontend && npm run test:coverage

# CI simulation
ci: lint typecheck test-all
```

---

## 8.11 Monitoring Test Health

### 8.10.1 Test Metrics Dashboard

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Test Duration | < 10 min | > 15 min |
| Flaky Tests | 0 | > 0 |
| Coverage Drop | < 5% | > 5% drop |
| Flaky Tests | 0 | > 0 |
| E2E Pass Rate | 100% | < 100% |

---

## 8.11 Chapter Summary

This chapter defines a comprehensive testing strategy ensuring:

- **Unit Tests** (70%): Fast, isolated, deterministic
- **Integration Tests** (20%): Real dependencies, DB/Redis/API
- **E2E Tests** (10%): Critical user journeys
- **AI Testing**: Model accuracy, latency, drift detection
- **Performance**: Load testing with k6
- **CI/CD Integration**: Automated gates in pipeline
- **Quality Gates**: Coverage, linting, security, performance

---

## Chapter Completion Checklist

- [x] Unit testing framework (pytest/Vitest)
- [x] Integration testing (DB, Redis, API)
- [x] E2E testing (Playwright/Cypress)
- [x] AI model testing (accuracy, latency)
- [x] Performance testing (k6)
- [x] CI/CD pipeline with quality gates
- [x] Test data management (factories, fixtures)
- [x] Coverage requirements defined
- [x] Quality gates configured
- [x] Documentation and runbooks

---

**END OF CHAPTER 8**

*Next: Chapter 9 — Deployment & Operations Guide*

---

**END OF CHAPTER 8**

*Volume 3 - Chapter 8 Complete*