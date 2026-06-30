# Next.js 16 Frontend Conventions for Alexandria

Last reviewed: 2026-06-30  
Applies to: Next.js `16.2.9`, React `19.2.4`, App Router

## Source hierarchy

1. Installed version-matched docs: `Alexandria/node_modules/next/dist/docs/`
2. [Next.js 16.2.9 documentation index](https://nextjs.org/docs/llms.txt)
3. The focused official pages linked below

The installed docs take precedence if online examples drift from `16.2.9`.

## Server and Client Components

App Router layouts and pages are Server Components by default.

Keep these on the server:

- repository result pages and paper-detail pages;
- data fetching and authorization checks;
- non-interactive shell, headings, metadata, and research-card markup;
- code that uses secrets or server-only dependencies.

Use a Client Component only where the UI needs state, event handlers, lifecycle logic, custom hooks, or browser APIs. For Alexandria, likely client islands are:

- search input behavior;
- filter controls and the mobile filter sheet;
- FAQ accordion;
- theme toggle;
- dialogs, popovers, selects, and tooltips.

Place `"use client"` at the narrowest useful boundary. Everything imported by that module joins its client bundle, so do not mark the entire app shell as client-side merely because it contains an interactive search or toggle.

Props crossing from a Server Component into a Client Component must be serializable.

Source: [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)

## Styling

The repository already has the documented Tailwind setup:

```css
@import "tailwindcss";
```

Use:

- global CSS for resets, font variables, and Alexandria design tokens;
- Tailwind utilities for most component styling;
- CSS Modules only for unusually intricate component-local styling that becomes less readable as utilities.

Keep global CSS imported from the root layout.

Source: [CSS in Next.js](https://nextjs.org/docs/app/getting-started/css)

## Fonts

Use `next/font` for Inter and Khula. It self-hosts font assets, avoids browser requests to Google, and reduces layout shift.

- Inter: default UI and reading font.
- Khula: landing wordmark and large branded CTA only.
- Prefer a variable font when the family provides one.
- Apply font variables at the root layout, then expose them through Tailwind's `@theme inline`.

Source: [Font optimization](https://nextjs.org/docs/app/getting-started/fonts)

## Third-party UI components

Interactive primitives are Client Components. Keep their wrappers small and compose server-rendered content through props or `children` where practical. Do not turn result lists or paper-detail content into Client Components solely to host one dialog, accordion, or filter control.

