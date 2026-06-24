---
name: web-design-guidelines
description: Review UI code for Web Interface Guidelines compliance. Use when asked to "review my UI", "check accessibility", "audit design", "review UX", or "check my site against best practices".
metadata:
  author: vercel
  version: "1.0.0"
  argument-hint: "file-or-pattern"
---

# Web Interface Guidelines

Review files for compliance with Web Interface Guidelines.

## How It Works

1. Fetch the latest guidelines from the source URL below
2. Read the specified files (or prompt user for files/pattern)
3. Check against all rules in the fetched guidelines
4. Output findings in the terse `file:line` format

## Guidelines Source

Fetch fresh guidelines before each review:

```
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

Use WebFetch to retrieve the latest rules. The fetched content contains all the rules and output format instructions.

## Usage

When a user provides a file or pattern argument:

1. Fetch guidelines from the source URL above
2. Read the specified files
3. Apply all rules from the fetched guidelines
4. Output findings using the format specified in the guidelines

If no files specified, ask the user which files to review.

---

## Related Skills

| Skill                                              | When to Use                                                                |
| -------------------------------------------------- | -------------------------------------------------------------------------- |
| **[frontend-design](../frontend-design/SKILL.md)** | Before coding - Learn design principles (color, typography, UX psychology) |
| **web-design-guidelines** (this)                   | After coding - Audit for accessibility, performance, and best practices    |

## Design Workflow

````
1. DESIGN   → Read frontend-design principles
2. CODE     → Implement the design
3. AUDIT    → Run web-design-guidelines review ← YOU ARE HERE
4. FIX      → Address findings from audit

---

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

---

## Part 1: Technical Anti-Patterns

### 1.1 Reinventing the Wheel

**The Problem:** Building everything from scratch instead of using libraries.

**Why It Matters:**

- Wastes development time
- Introduces bugs in solved problems
- Harder to maintain custom solutions

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
````

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

## Sources

This checklist synthesizes research from:

1. "10 Lessons from Vibe Coding My First SaaS" (Technical patterns)
2. "5 Mistakes People Make When Vibe Coding Apps" (Design-first principles)
3. "7 UI/UX Mistakes That SCREAM You're a Beginner" (UX anti-patterns)
4. SaaS UI/UX Best Practices (Industry standards)```
