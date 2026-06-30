# Component Library Recommendation

Last reviewed: 2026-06-30  
Status: recommendation only; no library has been installed

## Recommendation

Use **shadcn/ui with Radix Primitives**, added component-by-component and restyled with Alexandria's tokens.

This pairing fits the product because:

- shadcn/ui adds source code to the repository instead of imposing an opaque package theme;
- Radix supplies accessible keyboard behavior, focus management, and ARIA patterns for complex controls;
- both work with Tailwind and permit complete visual control;
- Alexandria can retain its flat, sharp, dark research-index character rather than looking like a generic rounded dashboard;
- adoption can be incremental, which keeps the initial dependency and client-JavaScript surface small.

Official sources:

- [shadcn/ui installation for an existing Next.js project](https://ui.shadcn.com/docs/installation/next)
- [shadcn/ui theming](https://ui.shadcn.com/docs/theming)
- [Radix Primitives introduction](https://www.radix-ui.com/primitives/docs/overview/introduction)
- [Radix accessibility](https://www.radix-ui.com/primitives/docs/overview/accessibility)
- [Radix styling](https://www.radix-ui.com/primitives/docs/guides/styling)

## Why not adopt a fully styled suite

Material UI, Chakra UI, Mantine, and similar suites can ship screens quickly, but their default visual language is stronger than Alexandria needs. Reversing their surface elevation, spacing, radii, and component personality would create more styling work and increase the chance of design drift.

## Alternatives considered

### Base UI directly

[Base UI](https://base-ui.com/react/overview/about) is headless, accessible, composable, and Tailwind-compatible. It is a strong second choice when the team wants primitive-level control without shadcn's generated wrappers. The tradeoff is more in-house component assembly and styling.

### React Aria Components

[React Aria Components](https://react-spectrum.adobe.com/react-aria/getting-started.html) offers excellent accessibility, internationalization, and interaction behavior with unstyled components. Choose it if accessibility across many input modes or future internationalization becomes the dominant requirement. Its composition and styling model is more involved than the team's current needs.

## Component adoption map

Adopt only behavior-heavy primitives:

| Alexandria need | Suggested component |
| --- | --- |
| FAQ rail | Accordion |
| Mobile filters | Sheet |
| Year/category/advisor filters | Checkbox, Label, Select, Popover |
| Search suggestions | Command inside Popover |
| Theme control | Switch or Dropdown Menu |
| Submission/auth prompts | Dialog or Alert Dialog |
| Loading results | Skeleton |
| Compact explanations | Tooltip |
| Dividers | Separator |

Keep these custom:

- app shell and responsive three-column grid;
- research result rows/cards;
- selected-paper reading layout;
- landing hero, wordmark, and wave treatment;
- metadata lines and thesis tags.

Those elements carry Alexandria's identity and do not need a library abstraction.

## Theme adaptation

Map shadcn semantic tokens to the established design:

| shadcn token | Alexandria value/role |
| --- | --- |
| `background` | `#14181C` |
| `foreground` | `#FFFFFF` |
| `primary` | `#1752F0` |
| `primary-foreground` | `#FFFFFF` |
| `accent` | restrained hover/selection surface derived from `#1DA0C9` |
| `muted-foreground` | `#969696` or an accessible lighter variant at small sizes |
| `border` | `rgba(217, 217, 217, 0.15)` |
| `ring` | `#1752F0` |
| `radius` | small base radius; override search/toggles locally as pills |

Do not copy a stock shadcn theme unchanged. Its semantic token system is useful; its demo appearance is not the design source of truth.

## Future setup, when approved

Run from `Alexandria/` in PowerShell:

```powershell
npx.cmd shadcn@latest init
```

During initialization:

- keep React Server Components enabled;
- keep CSS variables enabled;
- point global CSS to `app/globals.css`;
- keep the existing `@/*` alias;
- choose the Radix-backed component base if prompted;
- start with a neutral base, then replace generated values with Alexandria's semantic tokens.

Add only the first components needed rather than installing the full catalog. The official CLI pattern is:

```powershell
npx.cmd shadcn@latest add accordion sheet checkbox input separator skeleton
```

Treat generated files as project code: review them, simplify them, and keep their client boundaries narrow.

