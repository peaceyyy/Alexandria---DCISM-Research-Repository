# Protocol 15: Container Sandboxing

> **Source**: Harvested from `ykdojo/claude-code-tips` (Dec 2025)
> **Use Case**: Long-running, risky, or autonomous tasks

---

## Core Philosophy

> "Running with dangerous permissions is like running without a safety net. Use a container."

Containerization provides:

- **Isolation**: Mistakes don't escape the sandbox
- **Reproducibility**: Same environment every time
- **Disposability**: Nuke and restart cleanly

---

## When to Use

| Scenario | Container? |
|----------|-----------|
| Risky automated scripts | ✅ Yes |
| GraphRAG reindexing | 🟡 Optional |
| Multi-model orchestration | ✅ Yes |
| Normal development | ❌ No |
| Research with unknown APIs | ✅ Yes |

---

## Architecture Pattern

```
┌─────────────────────────────────────────┐
│  Host Machine                           │
│  ┌───────────────────────────────────┐  │
│  │  Docker Container                 │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │  AI Agent (autonomous)      │  │  │
│  │  │  - Full permissions         │  │  │
│  │  │  - Can't escape sandbox     │  │  │
│  │  └─────────────────────────────┘  │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │  tmux (orchestration layer) │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Host AI ←── Controls container via     │
│              tmux send-keys / capture   │
└─────────────────────────────────────────┘
```

---

## Implementation

### Basic Dockerfile

```dockerfile
FROM ubuntu:22.04
RUN apt-get update && apt-get install -y \
    python3 python3-pip git tmux curl
# Add AI CLI tools as needed
WORKDIR /workspace
```

### Orchestration via tmux

```bash
# Start container with tmux
docker run -it --name sandbox my-ai-container

# From host, send commands:
docker exec sandbox tmux send-keys "python script.py" Enter

# Capture output:
docker exec sandbox tmux capture-pane -p
```

---

## Multi-Model Orchestration

Use containers to run different AI CLIs:

- Primary AI orchestrates
- Secondary AI (Gemini, Codex, etc.) runs in container
- Primary sends tasks via tmux → captures results

**Pattern**: Hub-and-spoke with container isolation.

---

## Safety Rules

1. **Mount only necessary volumes** - Don't mount home directory
2. **Network isolation** - Use `--network none` for risky tasks
3. **Resource limits** - Set `--memory` and `--cpus` limits
4. **Log everything** - Container logs are your audit trail

---

## Integration

- Works with: Protocol 86 (Exponential Backoff for monitoring)
- Complements: Protocol 85 (Token Hygiene — containers can run while you start fresh)

---

## Tags

# container #docker #sandboxing #automation #harvested

---

## Tagging

# protocol #framework #process #15-container-sandboxing
