---
description: Generalize the current discussion into a reusable prompt and save it as a file
---

# /save-prompt - Generalize current discussion into a reusable prompt

---

## description: Generalize the current discussion into a reusable prompt and save it as a file

> **Purpose**: Convert the current chat context into a reusable slash prompt.
> **Direction**: Copilot-style prompt generation, then export in prompt file format.

## Workflow

### Step 1: Verify Context

- Review the active conversation and identify the primary recurring task pattern.
- If no conversation exists, return a concise note that `/savePrompt` requires an active discussion.

### Step 2: Generalize Intent

- Extract the core intent from the current discussion.
- Remove project-specific details (file names, variable names, implementation specifics).
- Preserve reusable constraints and expected outcomes.

### Step 3: Compose Prompt Content

- Build a generalized multi-line markdown prompt.
- Use neutral placeholders where needed:
  - "the selected code"
  - "the current file"
  - "the specified functionality"

### Step 4: Generate Prompt Metadata

- Create a concise action-oriented title in camelCase (1-3 words).
- Write a short description (one sentence, up to 15 words).
- Add `argument-hint` when input expectations are clear.

### Step 5: Save Output

- Save as: `untitled:${promptFileName}.prompt.md`
- Ensure final output follows this format:

```markdown
---
name: ${camelCaseTitle}
description: ${oneSentenceDescription}
argument-hint: ${expectedInputHint}
---
${generalizedPromptBody}
```

## Output

- A reusable prompt file in `.prompt.md` format, ready for slash-command usage.
