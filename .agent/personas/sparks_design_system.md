# Sparks Design System — Protocol & Doctrine

> **Core Concept**: "Familiar Systems. Cosmic Character."
> **Tags**: #design #ui #ux #aesthetics #sparks

---

## The Core Tension

- **Utility is the spine.**
- **Character is the nervous system.**
- **Nothing decorative is allowed to be purposeless.**

---

## The 5 Constitutional Design Laws

1. **Structure Always Wins**
   - If hierarchy, flow, or readability is threatened, expression is cut immediately. No amount of "wow" justifies confusion.

2. **Personality Lives in Safe Zones**
   - Expression is allowed only in: typography rhythm, accent colors (cosmic blues / purples), spacing cadence, subtle interaction feedback.
   - Navigation and data tables remain boringly perfect.

3. **Expression Must Earn Its Keep**
   - A visual detail stays only if it improves recognition, orientation, or emotional comfort — not aesthetic novelty.

4. **Familiarity Beats Novelty**
   - New users should feel oriented in seconds. Returning users should feel ownership.
   - "I know where everything is" > "This looks cool."

5. **Calm Is the Default State**
   - Motion, color, and interaction are used like seasoning — not like sauce. The interface should never feel rushed, loud, or anxious.

---

## Cosmic System: Visual Signature

- **Dominant**: Neutral grays, off-whites, deep charcoals.
- **Accents**: Cosmic blues, muted purples, indigo / nebula tones. Used sparingly — think night sky through a clean window, not a galaxy wallpaper.
- **Typography**: Clear, modern sans-serif (Inter / SF-like). Weight contrast and line height carry personality, not novelty fonts.
- **Motion**: Hover, focus, and transitions feel tactile, not playful. Nothing bounces, nothing wiggles.

For detailed color and typography decisions, refer to the [`frontend-design` skill](../skills/ui-ux-design/frontend-design/SKILL.md).

---

## Agent-Ready Design Gate

Any design decision must pass all three:

1. Does this improve orientation or ease of use?
2. Does this maintain calm and hierarchy?
3. Does this subtly reinforce familiarity or confidence?

If even one is "no" → reject.

---

## Execution Stack (Sparks-Specific)

### Step 1: Theme Foundation (`index.css`)

- Define CSS variables for colors using **OKLCH**.
- Define `--radius` for consistent rounding.
- Import Tailwind and animations.
- Rule: No bold primary colors. Use sophisticated, slightly desaturated tones.

### Step 2: Component Strategy

- Base: **Shadcn/ui**
- Typography: Google Fonts (Inter, Outfit, Roboto)
- Space: Generous padding/margins — breathing room is a design element.

### Step 3: Interaction Design

- Every click needs a reaction (hover state, active state).
- Physics: Use **framer-motion** for entrances and layout shifts.
- Speed: Interactions must feel instantaneous (<100ms perception threshold).

### Step 4: PRD First

Always generate `src/prd.md` before writing code:

- Mission Statement
- Visual Tone (Playful? Serious? Cosmic?)
- Color Strategy
- Typography System

---

## Technical Notes

- **Input IDs**: Always use kebab-case IDs for state persistence.
- **Assets**: Explicitly import images/media — no lazy references.
