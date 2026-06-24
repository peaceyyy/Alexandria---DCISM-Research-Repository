# Anti-Vibe Coding Checklist

> **Purpose:** Comprehensive reference for identifying and avoiding common vibe coding pitfalls in UI/UX design and development.

---

## Executive Summary

"Vibe coding" enables rapid prototyping and creative freedom, but often introduces predictable anti-patterns. This checklist synthesizes research from multiple sources to help you maintain quality while preserving creative flow.

**Use this when:**

- Building new UI components or features
- Reviewing existing interfaces for quality
- Onboarding new team members to design standards
- Conducting design/code reviews

---

## Quick Reference Checklist

### Technical Foundation

- [ ] Using established libraries instead of reinventing the wheel

### Design Consistency

- [ ] Design system or style guide exists and is followed
- [ ] Visual rules are locked (spacing, colors, typography, components)
- [ ] Design created before code implementation
- [ ] All UI states considered (empty, error, loading, success)
- [ ] Consistent component behavior across the application

### User Experience

- [ ] User research conducted (not designing on assumptions)
- [ ] Clear visual hierarchy guides user attention
- [ ] Interface is not cluttered or overwhelming
- [ ] Onboarding is engaging and customizable
- [ ] Interactive feedback provided for all user actions
- [ ] Accessible to users with disabilities (WCAG compliance)
- [ ] Responsive across all device sizes
- [ ] Performance is optimized (fast loading times)

### Code Vibe & Maintainability

- [ ] Variable names are human-readable (no `data`, `obj`, `item`)
- [ ] Comments explain "why", not "what" (no robotic redundancy)
- [ ] Code has vertical breathing room (logical paragraphs)
- [ ] No premature optimization ("clever" code)
- [ ] Respects existing file context/style

---

## Part 1: Technical Anti-Patterns

### 1.1 Reinventing the Wheel

**The Problem:** Building everything from scratch instead of using libraries.

**Why It Matters:**

- Wastes development time
- Introduces bugs in solved problems
- Harder to maintain custom solutions
  p
  **The Fix:**

- **Authentication:** Use NextAuth, Clerk, or Supabase Auth
- **Payments:** Use Stripe, PayPal, or Paddle SDKs
- **API Calls:** Use Axios or native fetch with proper error handling
- **Forms:** Use React Hook Form or Formik
- **UI Components:** Use shadcn/ui, Radix UI, or Material UI

**When to Build Custom:**

- Core differentiating features
- Unique business logic
- Performance-critical components

---

## Part 2: Design Anti-Patterns

### 2.1 Starting with Code Before Design

**The Problem:** Jumping into code without a design blueprint.

**Why It Matters:**

- Results in messy, generic-looking apps
- Harder to maintain visual consistency
- Requires expensive refactoring later

**The Fix:**

1. **Design-first workflow:**
   - Sketch wireframes (Figma, Excalidraw, or paper)
   - Define visual rules (colors, spacing, typography)
   - Create component library
   - Then start coding

2. **Lock down visual rules early:**

   ```css
   /* Define design tokens first */
   :root {
     --color-primary: #3b82f6;
     --color-secondary: #8b5cf6;
     --spacing-unit: 8px;
     --font-heading: "Inter", sans-serif;
     --font-body: "Inter", sans-serif;
     --radius-sm: 4px;
     --radius-md: 8px;
   }
   ```

3. **Consider all UI states:**
   - Empty state (no data yet)
   - Loading state (fetching data)
   - Error state (something went wrong)
   - Success state (ideal scenario)

---

### 2.2 Inconsistent Design Language

**The Problem:** Every screen looks different - mismatched fonts, colors, spacing, components.

**Why It Matters:**

- Breaks user trust and professionalism
- Increases cognitive load
- Makes app harder to navigate
- Signals lack of attention to detail

**The Fix:**

**Create a Design System:**

```typescript
// components/ui/Button.tsx
const buttonVariants = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  secondary: 'bg-secondary text-white hover:bg-secondary-dark',
  outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
};

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
};

export function Button({ variant = 'primary', size = 'md', children }) {
  return (
    <button className={`${buttonVariants[variant]} ${buttonSizes[size]} rounded-md transition`}>
      {children}
    </button>
  );
}
```

**Consistency Checklist:**

- [ ] All buttons use the same component
- [ ] Spacing follows 8px grid system
- [ ] Colors come from defined palette
- [ ] Typography uses max 2-3 font families
- [ ] Icons are from a single icon set
- [ ] Component behavior is predictable

---

### 2.3 Poor Visual Hierarchy

**The Problem:** All elements demand equal attention, critical features get lost.

**Why It Matters:**

- Users can't quickly scan the interface
- Important actions are missed
- Increases time to complete tasks

**The Fix:**

**Use Size, Color, and Contrast Strategically:**

```tsx
// Primary action stands out
<div className="flex gap-3">
  <Button variant="primary" size="lg">
    Save Changes
  </Button>
  <Button variant="outline" size="md">
    Cancel
  </Button>
  <Button variant="ghost" size="sm">
    Reset
  </Button>
</div>
```

**Hierarchy Principles:**

1. **Size:** Larger = more important
2. **Color:** Vibrant colors for primary actions, muted for secondary
3. **Position:** Top-left gets most attention (F-pattern reading)
4. **Whitespace:** More space around important elements
5. **Typography:** Heading hierarchy (H1 > H2 > H3 > body)

---

### 2.4 Copying Styles Without Intent

**The Problem:** Mimicking popular designs without understanding why they work.

**Why It Matters:**

- Results in generic, soulless interfaces
- Doesn't serve your specific users
- Misses opportunities for differentiation

**The Fix:**

1. **Understand the "why" behind design choices:**
   - Why does Linear use dark mode? (Focus, reduced eye strain for developers)
   - Why does Stripe use lots of whitespace? (Clarity, trust, professionalism)
   - Why does Notion use subtle animations? (Delight, feedback, polish)

2. **Adapt, don't copy:**
   - Identify principles (e.g., "clear hierarchy")
   - Apply to your context (e.g., "our users need quick scanning")
   - Create your own implementation

---

### 2.5 "AI Slop" Aesthetics (The Template Clone)

**The Problem:** Defaulting to omnipresent purple/neon gradients, glowing borders, and generic bento-box layouts just because AI generated them easily.

**Why It Matters:**

- Strips your application of unique brand identity
- Users instantly recognize the "AI template" look, damaging credibility
- Makes the product feel homogeneous and cheap

**The Fix:**

- **Be an Author, not an Editor:** Provide the LLM with a highly opinionated design system upfront (specific color palette, non-standard typography)
- **Ban AI Defaults:** Avoid the standard "dark mode with purple accents" unless it strictly aligns with your defined brand
- **Custom Assets:** Use dedicated SVG icons (e.g., Lucide, Radix) instead of relying on default system emojis

---

## Part 3: UX Anti-Patterns

### 3.1 Designing on Assumptions, Not User Research

**The Problem:** Building features based on what you think users need.

**Why It Matters:**

- Features miss the mark
- Wastes development resources
- Users abandon the product

**The Fix:**

**Conduct User Research:**

1. **User Interviews (5-10 users):**
   - What problems are you trying to solve?
   - How do you currently solve them?
   - What frustrates you about existing solutions?

2. **Surveys (broader audience):**
   - Validate assumptions at scale
   - Prioritize features by demand
   - Identify user segments

3. **Usability Testing:**
   - Watch users interact with prototypes
   - Identify friction points
   - Iterate based on observations

**Continuous Feedback Loop:**

- In-app feedback widgets
- Analytics to track behavior
- Regular user interviews
- A/B testing for major changes

---

### 3.2 Poor or Non-Existent Onboarding

**The Problem:** Assuming users will figure it out, or forcing everyone through the same rigid flow.

**Why It Matters:**

- High churn in first session
- Users never see product value
- First impressions are everything

**The Fix:**

**Modular, Adaptive Onboarding:**

```tsx
// Allow users to skip what they know
<Onboarding>
  <Step id="welcome" skippable={false}>
    <WelcomeMessage />
  </Step>
  <Step id="profile-setup" skippable={true}>
    <ProfileForm />
  </Step>
  <Step id="tutorial" skippable={true}>
    <InteractiveTutorial />
  </Step>
</Onboarding>
```

**Best Practices:**

- **Time to First Value:** Get users to their first "win" in < 2 minutes
- **Contextual Tooltips:** Teach features when users need them, not upfront
- **Progress Indicators:** Show how far through onboarding they are
- **Role-Based Flows:** Different onboarding for different user types
- **Empty States:** Guide users on what to do when there's no data yet

---

### 3.3 Lack of Interactive Feedback

**The Problem:** Users don't know if their actions succeeded or failed.

**Why It Matters:**

- Creates uncertainty and frustration
- Users repeat actions unnecessarily
- Breaks trust in the system

**The Fix:**

**Provide Immediate Feedback:**

```tsx
// Button states
<Button
  onClick={handleSave}
  disabled={isSaving}
  className={isSaving ? "opacity-50 cursor-not-allowed" : ""}
>
  {isSaving ? (
    <>
      <Spinner className="mr-2" />
      Saving...
    </>
  ) : (
    "Save Changes"
  )}
</Button>;

// Toast notifications
toast.success("Changes saved successfully!");
toast.error("Failed to save. Please try again.");

// Form validation
<Input
  error={errors.email}
  helperText={errors.email ? "Please enter a valid email" : ""}
/>;
```

**Feedback Types:**

- **Hover states:** Show elements are interactive
- **Loading states:** Indicate processing
- **Success states:** Confirm completion
- **Error states:** Explain what went wrong
- **Disabled states:** Show why action is unavailable

---

### 3.4 Neglecting Accessibility

**The Problem:** Designing only for able-bodied users with perfect vision.

**Why It Matters:**

- Excludes 15-20% of potential users
- Legal compliance issues (WCAG)
- Reduces overall usability for everyone

**The Fix:**

**Accessibility Checklist:**

```tsx
// Semantic HTML
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/dashboard">Dashboard</a></li>
  </ul>
</nav>

// Keyboard navigation
<button
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
  tabIndex={0}
>
  Action
</button>

// Color contrast (minimum 4.5:1 for text)
<p className="text-gray-900 bg-white"> {/* Good contrast */}
  Readable text
</p>

// Alt text for images
<img src="/chart.png" alt="Revenue growth chart showing 25% increase" />

// Form labels
<label htmlFor="email">Email Address</label>
<input id="email" type="email" required />
```

**WCAG Quick Wins:**

- [ ] All interactive elements are keyboard accessible
- [ ] Color is not the only way to convey information
- [ ] Text has sufficient contrast (4.5:1 minimum)
- [ ] Images have descriptive alt text
- [ ] Forms have proper labels
- [ ] Focus indicators are visible
- [ ] Screen reader tested

---

### 3.5 Ignoring Mobile Responsiveness

**The Problem:** Designing only for desktop, or treating mobile as an afterthought.

**Why It Matters:**

- 60%+ of web traffic is mobile
- Poor mobile experience = high bounce rate
- Google penalizes non-responsive sites

**The Fix:**

**Mobile-First Approach:**

```css
/* Start with mobile styles */
.container {
  padding: 1rem;
  font-size: 14px;
}

/* Add desktop enhancements */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
    font-size: 16px;
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 3rem;
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

**Responsive Checklist:**

- [ ] Touch targets are at least 44x44px
- [ ] Text is readable without zooming (16px minimum)
- [ ] Navigation works on small screens (hamburger menu)
- [ ] Forms are easy to fill on mobile
- [ ] Images scale appropriately
- [ ] No horizontal scrolling
- [ ] Tested on real devices (not just browser resize)

---

### 3.6 Hostile "AI-Generated" Interactions (Hovers & Scroll-Jacking)

**The Problem:** Accepting complex, forced animations (like "molasses scrolling") and "dumb hover effects" (menus fading out, non-clickable elements moving like buttons) just because the AI built them for free.

**Why It Matters:**

- **Scroll-jacking** frustrates users and hides content if they scroll too fast
- Hiding core functionality behind hover effects completely breaks mobile usability
- **"Head fakes"** (elements that look clickable but aren't) destroy user trust

**The Fix:**

- **Respect the Scroll:** Never hijack the native browser scroll. Use micro-animations _only_ to reinforce product value, never to show off CSS capabilities
- **The Hover Rule:** Hover effects should _only_ indicate clickability (e.g., subtle glow or 1-shade color shift). Never hide functionality behind hovers
- **Manual QA:** Rigorously test the generated UI to find and remove "head fakes" and confusing layout shifts on hover

---

## Part 4: SaaS-Specific Best Practices

### 4.1 Performance Optimization

**Why It Matters:**

- Every 100ms delay = 1% conversion loss
- Slow apps feel broken
- Google ranks faster sites higher

**The Fix:**

```typescript
// Code splitting
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// Image optimization
<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority // for above-the-fold images
  loading="lazy" // for below-the-fold
/>

// API response caching
export const revalidate = 3600; // Cache for 1 hour

// Database query optimization
const users = await db.user.findMany({
  select: { id: true, name: true }, // Only fetch needed fields
  take: 20, // Pagination
  where: { active: true } // Filter at DB level
});
```

---

## Part 5: Code Vibe & Maintainability (The Human Element)

### 5.1 The "Robotic" Feel

**The Problem:** Code that feels like it was generated by a machine—sterile, redundant, and lacking soul.

**Why It Matters:**

- Harder for humans to intuitively grasp
- Increases cognitive load with noise
- "Generic" variable names hide intent

**The Fix:**

- **Idiomatic Naming:** Use `userProfile` instead of `data`. Use `isValid` instead of `flag`.
- **Delete Redundant Comments:**
  - _Bad:_ `// const i = 0; // Initialize i`
  - _Good:_ `// Reset the retry counter for the new attempt`
- **Vertical Breathing Room:** Group logical steps with blank lines. Don't write 50-line blocks of dense code.

---

### 5.2 Premature Optimization vs. Intuition

**The Problem:** "Clever" one-liners, regex golf, or obscure performance tweaks that save 0.01ms but cost 1 hour of reading time.

**Why It Matters:**

- Maintenance nightmare
- "Clever" often means "Brittle"
- Intuition and flow are more valuable than micro-optimizations

**The Fix:**

- **Dumb Code is Better:** If it takes >10s to understand, rewrite it.
- **Flow > Cycle Count:** Prioritize how the code _reads_ over how fast it _runs_ (unless it's a proven bottleneck).
- **Match the Room:** Don't introduce `async/await` in a file full of `Promises` just because it's newer. Respect the existing patterns.

---

## Usage Guidelines

### When to Use This Checklist

**During Development:**

- Before starting a new feature (review relevant sections)
- During code reviews (spot-check against checklist)
- When stuck or unsure (reference best practices)

**During Audits:**

- Post-launch quality review
- Before major releases
- When onboarding new team members

**Continuous Improvement:**

- Monthly review of one section
- Update based on new learnings
- Share findings with team

### How to Integrate

1. **Lightweight Awareness** (Optional)
   - Add brief reminder to `designing-ui` skill
   - Don't enforce during creative phase

2. **QA Workflow** (Optional)
   - Create `/vibe-check` command
   - Run after UI implementation
   - Generate actionable reports

---

## 🤖 AI Slop Signals

> These are lightweight structural checks for code that *works* but carries signs of uncurated AI generation. The goal is not to auto-fix — it is to surface patterns that will quietly hurt the project later and hand the decision to you.
>
> **Audit posture**: Flag and explain. Never silently change. Human decides.

---

### Signal 1: Phantom Dependencies

**The question**: Is the code importing something that isn't actually installed?

**What to look for**:
- `import` statements for packages not listed in `package.json` / `requirements.txt` / `pyproject.toml`
- Imports that resolve fine locally but would break in a fresh install (relying on a transitive dep)

**Why it matters**: AI generators confidently hallucinate library names or assume packages that aren't there. This is a silent time bomb — everything works on your machine until it doesn't.

**Flag format**:
```
⚠️ Phantom Dep: `[package-name]` is imported in [file] but not listed in [manifest].
   → Install it explicitly, or remove the import if it was hallucinated.
   → Your call.
```

---

### Signal 2: Clone Clusters (Copy-Paste Logic)

**The question**: Is the same logic appearing in 3+ places?

**What to look for**:
- Near-identical functions or components with only minor variable name differences
- The same conditional logic (e.g., a null check, a date formatter) repeated across files
- Identical CSS class patterns duplicated across multiple component files

**Why it matters**: AI generation loves to be "complete" by duplicating. Each clone is a future bug waiting to diverge. When one gets fixed, the others won't.

**Flag format**:
```
⚠️ Clone Cluster: [logic description] appears ~[N] times in [files].
   → Worth abstracting into a shared util/hook/component if this area will change.
   → Your call — only worth the effort if this logic is likely to evolve.
```

---

### Signal 3: Over-Abstraction (Single-Use Utilities)

**The question**: Does this file or function exist *only* to be called once?

**What to look for**:
- A dedicated `utils/` file for a helper that is imported exactly once
- A wrapper component that adds no logic — just re-renders one child
- An interface or type that is defined and used only in one file

**Why it matters**: AI generators love to feel "architectural." They create structure for its own sake. Single-use abstractions add file count, cognitive overhead, and import chains — without providing any reuse benefit.

**Flag format**:
```
⚠️ Over-Abstraction: `[function/file name]` is only called in one place ([file]).
   → Is it likely to be reused? If not, inline it to reduce indirection.
   → Your call.
```

---

### Signal 4: Stylometric Predictability ("AI Tell")

**The question**: Does the code read like it was written by the same robot?

**What to look for**:
- Every function follows the exact same naming pattern (`handleX`, `processX`, `manageX` for everything)
- Every component has an identical structure: props → state → effect → return JSX, with no variation
- Comments that narrate what the code does instead of why (e.g., `// Loop through items` above `items.forEach(...)`)
- Hyper-symmetrical code — every branch returns the same shape, every list has the same length

**Why it matters**: This pattern signals low curation, not necessarily broken code. But it makes the codebase feel machine-authored, harder to read for humans, and harder to extend without the AI.

**Flag format**:
```
ℹ️ AI Tell: [specific pattern] in [files] reads as templated generation.
   → No immediate action needed. Flag for style review if this area grows.
   → Your call.
```

---

### Quick Reference: Slop Signal Checklist

- [ ] No phantom imports (all deps are in the manifest)
- [ ] No 3+ near-identical logic blocks that should be shared
- [ ] No single-use utility files with no reuse plan
- [ ] Code reads like a human wrote it, not a completion engine

---