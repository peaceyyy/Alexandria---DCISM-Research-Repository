# Tailwind CSS 4 Design Tokens for Alexandria

Last reviewed: 2026-06-30

## Tailwind 4 rule

Tailwind 4 theme variables are defined in CSS with `@theme`; a JavaScript `tailwind.config` is not required for Alexandria's token layer.

- Use `:root` for semantic CSS variables.
- Use `@theme inline` to expose those variables as Tailwind utilities.
- Use the `--color-*`, `--font-*`, `--radius-*`, and related namespaces so Tailwind generates the corresponding utilities.

Official source: [Tailwind theme variables](https://tailwindcss.com/docs/theme)

## Recommended token bridge

This is a reference shape, not an instruction to overwrite `globals.css` verbatim:

```css
:root {
  --background: #14181c;
  --foreground: #ffffff;
  --muted-foreground: #969696;
  --border: rgb(217 217 217 / 15%);
  --primary: #1752f0;
  --primary-foreground: #ffffff;
  --accent: #1da0c9;
  --accent-foreground: #ffffff;
  --ring: #1752f0;
  --radius: 0.4375rem;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-ring: var(--ring);
  --font-sans: var(--font-inter);
  --font-display: var(--font-khula);
}
```

## Alexandria-specific constraints

- Preserve `#14181C` as the dark-first application background.
- Reserve blue for brand, primary action, focus, and selected state.
- Reserve cyan for thin selected/filter accents.
- Prefer sharp corners; the global radius should remain small.
- Keep normal cards flat and border-led. Do not inherit large shadows or oversized radii from example component themes.
- Use the pill radius intentionally for search and toggles, not as a universal component style.
- Minimum production text sizes and touch targets remain governed by `docs/DESIGN.md`.

