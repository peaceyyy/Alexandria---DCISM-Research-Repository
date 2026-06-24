# Logging with structlog Guide

A concise reference guide for structured logging with structlog.

---

## Table of Contents

1. [Why structlog](#1-why-structlog)
2. [Configuration](#2-configuration)
3. [FastAPI Integration](#3-fastapi-integration)
4. [Context Binding](#4-context-binding)
5. [Exception Logging](#5-exception-logging)
6. [Testing with structlog](#6-testing-with-structlog)

---

## 1. Why structlog

### Advantages Over Standard Logging

| Feature       | Standard logging          | structlog                    |
| ------------- | ------------------------- | ---------------------------- |
| Output format | Plain text                | Structured key-value pairs   |
| Context       | Manual per-call           | Bound loggers carry context  |
| Configuration | Complex hierarchy         | Declarative processor chains |
| JSON output   | Requires custom formatter | Built-in                     |
| Performance   | Good                      | Excellent with caching       |

### Key Benefits

- **Structured data**: Logs as key-value pairs for easy parsing
- **Bound loggers**: Add context once, appears in all subsequent logs
- **Processor pipelines**: Transform logs through composable functions
- **Environment-aware**: Pretty console for dev, JSON for production

---

## 2. Configuration

### Basic Setup

```python
# app/logging_config.py
import logging
import structlog

def configure_logging(json_format: bool = False):
    """Configure structlog for the application."""

    shared_processors = [
        structlog.contextvars.merge_contextvars,
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
    ]

    if json_format:
        # Production: JSON output
        processors = shared_processors + [
            structlog.processors.dict_tracebacks,
            structlog.processors.JSONRenderer(),
        ]
    else:
        # Development: Pretty console output
        processors = shared_processors + [
            structlog.processors.format_exc_info,
            structlog.dev.ConsoleRenderer(colors=True),
        ]

    structlog.configure(
        processors=processors,
        wrapper_class=structlog.make_filtering_bound_logger(logging.INFO),
        context_class=dict,
        logger_factory=structlog.PrintLoggerFactory(),
        cache_logger_on_first_use=True,
    )
```

### Environment-Based Configuration

```python
import os
import sys

def configure_logging():
    # Auto-detect: JSON for production/CI, console for development
    use_json = (
        os.environ.get("LOG_JSON", "false").lower() == "true"
        or os.environ.get("CI", "false").lower() == "true"
        or not sys.stderr.isatty()
    )
    configure_logging(json_format=use_json)
```

### Initialize in FastAPI

```python
# app/main.py
from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.logging_config import configure_logging

@asynccontextmanager
async def lifespan(app: FastAPI):
    configure_logging()
    yield

app = FastAPI(lifespan=lifespan)
```

---

## 3. FastAPI Integration

### Request Logging Middleware

```python
# app/middleware.py
import time
import uuid
import structlog
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request

logger = structlog.get_logger()

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Clear context and bind request info
        structlog.contextvars.clear_contextvars()

        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))

        structlog.contextvars.bind_contextvars(
            request_id=request_id,
            method=request.method,
            path=request.url.path,
        )

        start_time = time.perf_counter()

        try:
            response = await call_next(request)
            duration_ms = (time.perf_counter() - start_time) * 1000

            logger.info(
                "Request completed",
                status_code=response.status_code,
                duration_ms=round(duration_ms, 2),
            )

            response.headers["X-Request-ID"] = request_id
            return response

        except Exception as exc:
            duration_ms = (time.perf_counter() - start_time) * 1000
            logger.exception(
                "Request failed",
                duration_ms=round(duration_ms, 2),
            )
            raise
```

### Add Middleware to App

```python
# app/main.py
from app.middleware import LoggingMiddleware

app.add_middleware(LoggingMiddleware)
```

---

## 4. Context Binding

### Request-Scoped Context

```python
import structlog

# In middleware or early in request handling
structlog.contextvars.bind_contextvars(
    request_id="abc-123",
    user_id=42,
    path="/api/habits",
)

# All subsequent logs include this context automatically
logger = structlog.get_logger()
logger.info("Processing request")  # Includes request_id, user_id, path
logger.info("Fetching data")       # Same context
```

### Temporary Context

```python
# Add temporary context for a code block
with structlog.contextvars.bound_contextvars(operation="streak_calculation"):
    logger.info("Starting calculation")
    # ... do work
    logger.info("Calculation complete")
# Context is restored after the block
```

### Per-Logger Binding

```python
# Create a logger with bound context
logger = structlog.get_logger().bind(
    component="habit_service",
    version="1.0",
)

logger.info("Service started")  # Includes component, version
```

---

## 5. Exception Logging

### Logging Exceptions

```python
logger = structlog.get_logger()

try:
    risky_operation()
except Exception:
    # Option 1: exc_info=True
    logger.error("Operation failed", exc_info=True)

    # Option 2: .exception() method (same as error with exc_info=True)
    logger.exception("Operation failed")
```

### Structured Exception Output

For JSON logging, configure `dict_tracebacks` processor:

```python
structlog.processors.dict_tracebacks
```

This produces JSON-serializable exception data instead of multiline strings.

---

## 6. Testing with structlog

### Using capture_logs

```python
import structlog
from structlog.testing import capture_logs

def test_logs_habit_creation():
    with capture_logs() as captured:
        # Call function that logs
        create_habit("Exercise")

    assert captured == [
        {
            "event": "Habit created",
            "habit_name": "Exercise",
            "log_level": "info",
        }
    ]
```

### Pytest Fixture

```python
# tests/conftest.py
import pytest
import structlog
from structlog.testing import LogCapture

@pytest.fixture
def log_output():
    return LogCapture()

@pytest.fixture(autouse=True)
def configure_structlog(log_output):
    structlog.configure(processors=[log_output])
    yield
    structlog.reset_defaults()
```

```python
# tests/test_service.py
def test_service_logs_correctly(log_output):
    do_something()

    assert log_output.entries == [
        {"event": "something happened", "log_level": "info"}
    ]
```
