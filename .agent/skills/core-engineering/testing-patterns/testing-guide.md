# Testing Strategy Guide

A comprehensive guide for testing strategies including Unit Testing, Integration Testing, E2E Testing, and React Component Testing.

---

## Table of Contents

1. [Testing Pyramid](#1-testing-pyramid)
2. [Unit Testing (Python)](#2-unit-testing-python)
3. [Integration Testing (FastAPI)](#3-integration-testing-fastapi)
4. [React Component Testing](#4-react-component-testing)
5. [E2E Testing with Playwright](#5-e2e-testing-with-playwright)
6. [Test Organization](#6-test-organization)

---

## 1. Testing Pyramid

### Distribution

| Layer       | Percentage | Speed   | Scope                 |
| ----------- | ---------- | ------- | --------------------- |
| Unit        | 70%        | ms      | Single function/class |
| Integration | 20%        | seconds | Multiple components   |
| E2E         | 10%        | minutes | Full system           |

### What Belongs Where

**Unit Tests:**

- Pure functions (streak calculation, date utilities)
- Pydantic validators
- Business logic with mocked dependencies

**Integration Tests:**

- API endpoints with real database
- Repository operations
- Service layer with real dependencies

**E2E Tests:**

- Critical user journeys only
- Full frontend + backend interaction
- Visual regression testing

---

## 2. Unit Testing (Python)

### Structure

```python
# tests/unit/test_streak_calculator.py
import pytest
from datetime import date
from app.services.streak import calculate_streak

class TestStreakCalculation:
    def test_returns_zero_for_empty_completions(self):
        result = calculate_streak([])
        assert result == 0

    def test_returns_one_for_single_completion_today(self):
        result = calculate_streak([date.today()])
        assert result == 1

    def test_counts_consecutive_days(self):
        completions = [date(2025, 1, 1), date(2025, 1, 2), date(2025, 1, 3)]
        result = calculate_streak(completions)
        assert result == 3

    def test_breaks_on_gap(self):
        completions = [date(2025, 1, 1), date(2025, 1, 3)]  # Gap on Jan 2
        result = calculate_streak(completions)
        assert result == 1  # Only Jan 3 counts
```

### Parametrized Tests

```python
@pytest.mark.parametrize("completions,expected", [
    ([], 0),
    ([date(2025, 1, 1)], 1),
    ([date(2025, 1, 1), date(2025, 1, 2)], 2),
    ([date(2025, 1, 1), date(2025, 1, 3)], 1),  # Gap breaks streak
])
def test_streak_calculation(completions, expected):
    assert calculate_streak(completions) == expected
```

### Mocking

```python
from unittest.mock import Mock, patch

def test_service_calls_repository():
    mock_repo = Mock()
    mock_repo.get_by_id.return_value = Habit(id=1, name="Exercise")

    service = HabitService(repository=mock_repo)
    result = service.get_habit(1)

    mock_repo.get_by_id.assert_called_once_with(1)
    assert result.name == "Exercise"
```

---

## 3. Integration Testing (FastAPI)

### Test Setup

```python
# tests/conftest.py
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, StaticPool
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base, get_db

@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database for each test."""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    SessionLocal = sessionmaker(bind=engine)

    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(engine)

@pytest.fixture(scope="function")
def client(db_session):
    """Create test client with overridden database."""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()
```

### API Tests

```python
# tests/integration/test_api_habits.py

class TestHabitAPI:
    def test_create_habit_returns_201(self, client):
        response = client.post(
            "/api/habits",
            json={"name": "Exercise", "description": "Daily workout"}
        )

        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Exercise"
        assert "id" in data

    def test_create_habit_without_name_returns_422(self, client):
        response = client.post("/api/habits", json={})

        assert response.status_code == 422

    def test_get_habit_returns_habit(self, client, db_session):
        # Setup: Create habit in database
        habit = Habit(name="Test", created_at=datetime.utcnow())
        db_session.add(habit)
        db_session.commit()

        # Test
        response = client.get(f"/api/habits/{habit.id}")

        assert response.status_code == 200
        assert response.json()["name"] == "Test"

    def test_get_nonexistent_habit_returns_404(self, client):
        response = client.get("/api/habits/99999")

        assert response.status_code == 404
```

### Database Isolation with Transactions

```python
@pytest.fixture
def db_session():
    """Rollback after each test for isolation."""
    connection = engine.connect()
    transaction = connection.begin()
    session = Session(bind=connection)

    yield session

    session.close()
    transaction.rollback()
    connection.close()
```

---

## 4. React Component Testing

### Setup with Vitest

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
  },
});

// src/test/setup.js
import "@testing-library/jest-dom";
```

### Component Tests

```javascript
// src/features/habits/__tests__/HabitCard.test.jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HabitCard } from "../components/HabitCard";

describe("HabitCard", () => {
  const mockHabit = {
    id: 1,
    name: "Exercise",
    currentStreak: 5,
    completedToday: false,
  };

  it("renders habit name", () => {
    render(<HabitCard habit={mockHabit} />);

    expect(screen.getByText("Exercise")).toBeInTheDocument();
  });

  it("displays current streak", () => {
    render(<HabitCard habit={mockHabit} />);

    expect(screen.getByText(/5.*streak/i)).toBeInTheDocument();
  });

  it("calls onComplete when button clicked", async () => {
    const onComplete = vi.fn();
    render(<HabitCard habit={mockHabit} onComplete={onComplete} />);

    await userEvent.click(screen.getByRole("button", { name: /complete/i }));

    expect(onComplete).toHaveBeenCalledWith(1);
  });

  it("shows completed state", () => {
    const completedHabit = { ...mockHabit, completedToday: true };
    render(<HabitCard habit={completedHabit} />);

    expect(screen.getByRole("button")).toBeDisabled();
  });
});
```

### Testing with Providers

```javascript
// src/test/utils.jsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

export function renderWithProviders(ui) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>,
  );
}
```

### Query Priority (Use in Order)

1. `getByRole` - Accessible name (best)
2. `getByLabelText` - Form labels
3. `getByText` - Text content
4. `getByTestId` - Last resort

```javascript
// Preferred
screen.getByRole("button", { name: /submit/i });
screen.getByLabelText("Email");

// Avoid
screen.getByTestId("submit-button"); // Only when necessary
```

---

## 5. E2E Testing with Playwright

### Playwright MCP Server Setup

```bash
# Add Playwright MCP to Claude Code
claude mcp add playwright npx @playwright/mcp@latest
```

### Configuration

```javascript
// playwright.config.js
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
});
```

### Page Object Model

```javascript
// tests/e2e/pages/DashboardPage.js
export class DashboardPage {
  constructor(page) {
    this.page = page;
    this.addHabitButton = page.getByRole("button", { name: /add habit/i });
    this.habitList = page.getByTestId("habit-list");
  }

  async goto() {
    await this.page.goto("/");
  }

  async addHabit(name) {
    await this.addHabitButton.click();
    await this.page.getByLabel("Habit name").fill(name);
    await this.page.getByRole("button", { name: /save/i }).click();
  }

  async completeHabit(name) {
    const habitCard = this.page.getByTestId(`habit-${name}`);
    await habitCard.getByRole("button", { name: /complete/i }).click();
  }

  async getHabitStreak(name) {
    const habitCard = this.page.getByTestId(`habit-${name}`);
    return habitCard.getByTestId("streak-count").textContent();
  }
}
```

### E2E Tests

```javascript
// tests/e2e/habits.spec.js
import { test, expect } from "@playwright/test";
import { DashboardPage } from "./pages/DashboardPage";

test.describe("Habit Tracking", () => {
  test("user can create and complete a habit", async ({ page }) => {
    const dashboard = new DashboardPage(page);

    await dashboard.goto();
    await dashboard.addHabit("Exercise");

    // Verify habit appears
    await expect(page.getByText("Exercise")).toBeVisible();

    // Complete the habit
    await dashboard.completeHabit("Exercise");

    // Verify streak updated
    await expect(page.getByTestId("streak-count")).toHaveText("1");
  });

  test("streak increments on consecutive days", async ({ page }) => {
    // Test with seeded data for multi-day scenarios
  });
});
```

### Visual Testing

```javascript
test("dashboard matches snapshot", async ({ page }) => {
  await page.goto("/");

  // Wait for data to load
  await expect(page.getByTestId("habit-list")).toBeVisible();

  // Compare screenshot
  await expect(page).toHaveScreenshot("dashboard.png", {
    mask: [page.locator(".timestamp")], // Mask dynamic content
  });
});
```

### Running E2E Tests

```bash
# Run all E2E tests
npx playwright test

# Run with UI mode (debugging)
npx playwright test --ui

# Run specific test file
npx playwright test habits.spec.js

# Update snapshots
npx playwright test --update-snapshots
```

---

## 6. Test Organization

### Directory Structure

```
tests/
├── conftest.py                 # Shared fixtures
├── pytest.ini                  # Pytest configuration
├── unit/
│   ├── conftest.py             # Unit test fixtures
│   ├── test_streak.py
│   └── test_validators.py
├── integration/
│   ├── conftest.py             # Integration fixtures (db, client)
│   ├── test_api_habits.py
│   └── test_api_completions.py
└── e2e/
    ├── playwright.config.js
    ├── pages/
    │   └── DashboardPage.js
    └── habits.spec.js

frontend/
└── src/
    ├── features/
    │   └── habits/
    │       └── __tests__/
    │           ├── HabitCard.test.jsx
    │           └── useHabits.test.js
    └── test/
        ├── setup.js
        └── utils.jsx
```

### Pytest Markers

```ini
# pytest.ini
[pytest]
markers =
    unit: Unit tests (fast, no I/O)
    integration: Integration tests (database, API)
    slow: Slow running tests
```

```python
@pytest.mark.unit
def test_calculate_streak():
    pass
```
