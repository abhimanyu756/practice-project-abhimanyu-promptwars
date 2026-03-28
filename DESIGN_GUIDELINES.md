# MedBridge AI — Design Guidelines

## 1. Philosophy

**Apple-inspired restraint.** Every element earns its place. No decoration without function.

**Medical-grade clarity.** In a crisis, information must be instantly scannable. Glassmorphism creates visual hierarchy — it never obscures content.

**Dark-first.** A single, optimized dark theme reduces eye strain in high-stress environments and maximizes contrast for critical alerts.

**Motion with purpose.** Animations confirm actions and guide attention. They are never decorative. In medical contexts, restraint is safety.

---

## 2. Design Tokens

### 2.1 Color Palette

| Token | Value | Usage |
|---|---|---|
| `--color-bg-primary` | `#000000` | Page background |
| `--color-bg-secondary` | `#161618` | Raised surfaces |
| `--color-bg-tertiary` | `#212124` | Cards inside panels |
| `--color-text-primary` | `#FFFFFF` | Headings, primary labels |
| `--color-text-secondary` | `#A0A0A6` | Descriptions, secondary info |
| `--color-text-tertiary` | `#797980` | Captions, disabled text |
| `--color-critical` | `#FF3B30` | Life-threatening alerts |
| `--color-warning` | `#FF9500` | Significant concerns |
| `--color-success` | `#34C759` | Safe / confirmed states |
| `--color-info` | `#0A84FF` | Interactive elements, links, focus |

**Glass surface tokens:**

| Token | Value | Usage |
|---|---|---|
| `--glass-bg` | `rgba(255, 255, 255, 0.08)` | Glass panel fill |
| `--glass-border` | `rgba(255, 255, 255, 0.15)` | Glass panel border |
| `--glass-blur` | `blur(20px) saturate(180%)` | Frosted glass effect |

**Contrast ratios (on `#000000`):**
- `#FFFFFF` → 21:1 (AAA)
- `#A0A0A6` → 7.1:1 (AAA)
- `#FF3B30` → 4.6:1 (AA Large) — always paired with text label
- `#0A84FF` → 4.8:1 (AA Large) — used for interactive, not body text

### 2.2 Typography

**Font stack:**
```
-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text",
system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif
```

**Monospace:**
```
"SF Mono", ui-monospace, "Cascadia Mono", Consolas, monospace
```

**Type scale (8pt grid aligned):**

| Style | Size | Line Height | Weight | Tracking | Token |
|---|---|---|---|---|---|
| Display | 48px | 56px | 700 | -1.5px | `.text-display` |
| H1 | 32px | 40px | 600 | -0.8px | `h1` |
| H2 | 24px | 32px | 600 | -0.4px | `h2` |
| H3 | 20px | 28px | 500 | -0.2px | `h3` |
| Body | 16px | 24px | 400 | 0px | `p`, `.text-body` |
| Caption | 13px | 18px | 400 | 0.1px | `.text-caption` |
| Overline | 11px | 16px | 600 | 1.5px | `.text-overline` (uppercase) |

### 2.3 Spacing (8pt Grid)

| Token | Value |
|---|---|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-10` | 40px |
| `--space-12` | 48px |
| `--space-16` | 64px |

### 2.4 Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 8px | Small inputs, buttons |
| `--radius-md` | 10px | Cards |
| `--radius-lg` | 12px | Panels, larger cards |
| `--radius-xl` | 16px | Dropzones, hero sections |
| `--radius-2xl` | 24px | Main glass panels |
| `--radius-full` | 9999px | Pills, badges |

### 2.5 Shadows

| Token | Value | Usage |
|---|---|---|
| `--shadow-sm` | `0 1px 3px rgba(0,0,0,0.12)` | Subtle lift |
| `--shadow-md` | `0 8px 32px rgba(0,0,0,0.12)` | Standard panels |
| `--shadow-lg` | `0 16px 48px rgba(0,0,0,0.2)` | Floating overlays |
| `--shadow-glow` | `0 4px 20px rgba(10,132,255,0.4)` | Primary button glow |

### 2.6 Animation

**Easing curves:**

| Token | Value | Usage |
|---|---|---|
| `--ease-standard` | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | Default transitions |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Subtle spring for entries |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Exit animations |

**Durations:**

| Token | Value | Usage |
|---|---|---|
| `--duration-fast` | 150ms | Hover states, color shifts |
| `--duration-normal` | 250ms | Standard transitions |
| `--duration-slow` | 400ms | Panel entries, page transitions |

---

## 3. Glass Component Patterns

### 3.1 `.glass-panel` — Primary Container
The main frosted glass surface. Uses `backdrop-filter` for the blur effect.

**Rule: Never nest `.glass-panel` inside another `.glass-panel`.** Compound blur causes visual artifacts and performance degradation.

### 3.2 `.glass-card` — Secondary Container
Used inside `.glass-panel` for data cards. Uses a **solid semi-transparent background** (`rgba(0,0,0,0.3)`) without its own `backdrop-filter` to avoid double-blur.

### 3.3 `.glass-card--alert` — Critical Alert Card
Same as `.glass-card` but with a tinted critical background and colored border. Used for life-threatening warnings.

### 3.4 Buttons
- `.btn--primary` — Gradient blue with glow shadow. Primary actions only.
- `.btn--outline` — Transparent with border. Secondary actions.
- All buttons: min-height 44px for touch accessibility.

### 3.5 `.dropzone` — File Upload Area
Dashed border, large padding, center-aligned content. States:
- Default: dashed white border at 20% opacity
- Hover: border turns info blue, subtle background tint
- Active (drag-over): success green border
- Filled: success green with checkmark

### 3.6 `.badge` — Status Indicators
Pill-shaped badges for severity levels. Each variant uses its severity color at 15% opacity for background, full color for text and border. The success badge includes a pulsing dot animation.

---

## 4. Accessibility Requirements

### 4.1 Contrast
- All primary text meets **WCAG AAA** (7:1 minimum).
- Secondary text meets WCAG AA (4.5:1). For AAA contexts, use `--color-text-secondary-high: #C8C8CC`.
- Severity colors are never used alone — always paired with text labels and icons.

### 4.2 Focus Indicators
All interactive elements display a visible focus ring:
```css
outline: 2px solid var(--color-info);
outline-offset: 2px;
```

### 4.3 Keyboard Navigation
- All interactive elements are reachable via Tab.
- Custom interactive elements (dropzone) use `role="button"`, `tabIndex={0}`, and handle Enter/Space key events.
- Skip-to-content link is the first focusable element.

### 4.4 Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 4.5 High Contrast Mode
```css
@media (prefers-contrast: more) {
  /* Glass effects replaced with solid backgrounds */
  /* Borders thickened to 2px */
  /* All secondary text upgraded to #C8C8CC */
}
```

### 4.6 Touch Targets
Minimum 44x44px on all interactive elements (WCAG 2.5.5).

### 4.7 Semantic HTML
- `<main>` with `role="main"` and descriptive `aria-label`
- `<header>` for branding
- `<section>` with `aria-labelledby` pointing to a heading
- `<h1>`-`<h3>` in correct hierarchy (never skip levels)

---

## 5. Layout System

### Container
Max-width 900px, centered, horizontal padding 24px (mobile: 16px).

### Stack
Vertical flexbox with configurable gap:
- `.stack--sm` — 8px gap
- `.stack--md` — 16px gap
- `.stack--lg` — 24px gap

### Grid
- `.grid-2` — 2 columns, collapses to 1 column below 640px
- Gap: 24px

### Row
- `.row` — Horizontal flex with gap
- `.row--responsive` — Stacks vertically below 640px

---

## 6. Component Composition Guide

Maps each element from the 3-phase UI to design system classes:

### Input Phase
```
main.container.stack.stack--lg
  header (centered)
    h1.text-display.text-gradient → "MedBridge AI"
    p.text-body.text-secondary → Subtitle
  section.glass-panel.animate-fade-in-up
    .stack.stack--md
      label.text-overline → "Upload Evidence"
      .dropzone → File upload area
      label.text-overline → "Describe Emergency"
      textarea.input → Text input
      button.btn.btn--primary → "Process with Gemini AI"
```

### Loading Phase
```
section.glass-panel.text-center
  .spinner
  p.loading-text → "Synthesizing..."
  p.text-caption.text-tertiary → Sub-message
```

### Output Phase
```
section.glass-panel.animate-fade-in-up
  .dashboard-header
    h2 → "Verified Medical Payload"
    .badge.badge--success → "Ready for Dispatch"
  .grid-2
    .glass-card.glass-card--alert → Critical Warning
    .glass-card → Visual Extraction
    .glass-card (full-width) → Action Plan
  .row.row--responsive
    button.btn.btn--outline → "Start Over"
    button.btn.btn--primary → "Dispatch Alert Data"
```
