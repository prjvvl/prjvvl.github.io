---
title: "A Design Bible for AI Coding Agents"
description: "A reference of concrete, opinionated web UI rules (tokens, accessibility, mobile, and component-by-component patterns) for making sure AI-generated sites stop looking like AI-generated sites."
date: 2026-09-13
tags: ["design", "ai-agents", "guide"]
draft: false
---

Default HTML has almost no opinion about how it looks, on purpose: a browser can't guess your brand. Left to fill that gap, most AI coding agents (and most humans in a hurry) reach for the same average: a purple-to-cyan gradient hero, three identical cards, Inter font, `rounded-2xl` on every surface, everything centered. None of it is technically wrong. It's just recognizable, and recognizable reads as unfinished.

This post is the reference I want loaded into context, mine or any agent's, before touching a UI. Not "make it look nice," but actual numbers: what ratio to scale type by, what a button needs to be accessible, when a card is the wrong component. Two sites that follow it won't end up with the same palette, but they'll both read as *considered* instead of generated.

---

## Start with tokens, not components

The single biggest tell of unsystematic UI is arbitrary values: a `13px` here, a `22px` there, a radius picked per-component instead of from a scale. Define these five things before writing a single component, and reuse them everywhere.

### Type scale

- Pick one **modular ratio** and stick to it: **1.25** (major third) for dense product UI, **1.333** (perfect fourth) for marketing/editorial pages where headlines need more separation from body copy.
- Base size: **16px minimum** for body text. Smaller forces mobile zoom and reads as an afterthought.
- Build **6–8 steps** off the base (e.g. 12/14/16/18/24/32/48/64px). Fewer leaves no room for hierarchy; more becomes noise.
- Line-height: **1.1–1.3** for headings, **1.5–1.6** for body text. Tight leading looks intentional on short display lines; body copy needs the extra room to stay scannable.
- Constrain paragraph width to **45–75 characters** (`max-width: 66ch` is a good default); longer lines fatigue the eye, shorter ones break reading rhythm.
- **One font family for UI, at most two total** (body + a display face for headings). Three or more competing fonts is a reliable AI-slop tell.
- Font-weight: 400 for body, 500–600 for emphasis/labels, 700 reserved for headings. Avoid 300/200 weights on body text: they fail legibility at small sizes.

### Spacing scale

- Base unit **4px**, with layout-level spacing snapping to **8px multiples**: 4/8/12/16/24/32/48/64/96. The 4px half-step covers fine component padding; 8px keeps macro rhythm consistent.
- Never use an off-scale value. If a spacing number doesn't appear in your scale, that's the bug, not the exception.
- Use the **small steps (4–16px)** within a component (icon-to-label, input padding) and the **large steps (32–96px)** between sections. The jump in magnitude is what reads as structure, not the presence of a border.

### Color system

- Structure each hue as a **scale, not a single value**: subtle backgrounds at the low end, component fills and borders in the middle, a solid brand fill around step 9, and high-contrast text at the top. One hex code can't serve backgrounds, borders, *and* text without a contrast failure somewhere.
- Give **success / error / warning / info** their own independent scales: don't just tint the brand color, or status colors collide with brand accents.
- Contrast is not optional:

  | Content | Minimum (AA) |
  |---|---|
  | Normal text | 4.5:1 |
  | Large text (≥24px, or ≥18.66px bold) | 3:1 |
  | UI components / focus indicators | 3:1 |

- **Dark mode is not inverted light mode.** Desaturate and lighten brand hues (fully saturated color vibrates on a dark background), shift pure black/white to near-neutrals, and rebuild the surface/border/text ramps independently per theme.

### Radius & elevation

- One small radius scale, reused everywhere: **0** (square), **4px** (inputs, small controls), **8–12px** (cards, modals), **9999px** (pills, avatars). A radius picked per component is as visible a tell as arbitrary spacing.
- **Shadows for temporary/floating elevation** (dropdowns, modals, tooltips: things that can be dismissed or move). **Borders or a subtle background-lightness shift for static elevation** (cards, panels: permanent layout).
- Box-shadow effectively disappears on a dark background: a dark shadow on a dark surface has no contrast to show. Replace it with a 1px lighter border and/or a small lightness step between surface levels.

### Motion

- Duration tiers: **100–150ms** for hover/toggle-scale feedback, **200ms** as the standard transition default, **300–400ms** for modals and panel slides. Past ~200ms on a micro-interaction starts to feel sluggish.
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)` for most transitions, ease-out for things entering, ease-in for things leaving. Linear easing reads as robotic.
- Wrap non-essential motion in `@media (prefers-reduced-motion: reduce)` and collapse durations toward zero. This is an accessibility requirement (vestibular safety), not a nice-to-have.

---

## Accessibility is not a pass at the end

- **Touch targets**: 24×24px is the WCAG AA floor (with adequate spacing if smaller); use **44×44px** for primary mobile actions (Apple HIG / Material's 48dp comfort zone). Undersized targets are the single most common mobile usability complaint.
- **Focus-visible is mandatory** on every interactive element. If you override the browser default, the replacement needs its own 3:1 contrast and real visible area. Never ship `outline: none` with nothing in its place.
- **Semantic HTML over div-soup**: `header`, `nav`, `main`, `aside`, `footer` as landmarks; one `h1` per page; headings nest in order, never skipping a level. Use `button` for actions and `a href` for navigation: a `div` with an `onClick` has no keyboard semantics at all.
- **Full keyboard reachability**: logical tab order matching visual order, a skip-to-content link as the first focusable element, no keyboard traps (especially in modals).
- **Alt text on every meaningful image**; `alt=""` (not a missing attribute) on purely decorative ones.
- Never convey state (error, success, required) through color alone; pair it with an icon or text.

---

## Responsive strategy, not just breakpoints

- **Mobile-first**: base styles for 320–480px, layer up with `min-width` queries.
- A breakpoint set doesn't need more than four steps: **mobile** ≤480px, **tablet** 481–768px, **small desktop** 769–1024px, **large desktop** ≥1025px, plus a max-width container (~1440–1536px) so text doesn't stretch across a wide monitor.
- `px` for the breakpoints themselves; `rem`/`em`/`%` for everything that should scale with the user's font-size or zoom setting. A hardcoded fixed-pixel container width is the most common cause of mobile overflow.
- What actually has to change at small widths, not just shrink: nav collapses to a hamburger/drawer; multi-column grids collapse to one column; data tables become stacked cards or gain a sticky first column with horizontal scroll (never just shrink the font to fit); body text never drops below 16px on mobile.
- Always reserve space for images/embeds with explicit `width`/`height` or `aspect-ratio`: unsized media is the most common cause of layout shift on load.

### Mobile has its own rules beyond "it's responsive"

- Put primary actions in the **thumb zone** (the bottom third of the screen) rather than top-right. A sticky bottom action bar beats a top nav for the one thing you want a mobile user to do.
- `env(safe-area-inset-*)` plus `viewport-fit=cover` in the viewport meta tag, or fixed bars sit under the notch/home indicator on iOS. Never disable zoom with `user-scalable=no`: that's an accessibility violation, not a design choice.
- Inputs need `font-size: 16px` or larger, or Safari auto-zooms the page on focus.
- Match input `type`/`inputmode` to the data: `email`, `tel`, `number`/`inputmode="numeric"`, `url`; each surfaces the matching mobile keyboard.
- Use `dvh`, not `vh`, for full-height mobile layouts. `100vh` is pinned to the tallest browser-chrome state and clips content whenever the address bar is actually visible.
- No interaction should depend on `:hover`; touch has no hover state to trigger it.
- Don't fight standard gestures (swipe-back, pull-to-refresh, carousel swipe).

---

## Icons

- **Icon + text is the default** for primary actions. Icon-only is fine only for actions with genuinely universal meaning (search, close, back, play, hamburger); if a first-time user might hesitate, add the label.
- An icon-only button still needs an accessible name (`aria-label` on the button, never on the SVG) plus a visible tooltip for sighted mouse/keyboard users. Unlabeled icon buttons are one of the most common accessibility failures on real sites.
- Purely decorative icons next to already-labeled text get `aria-hidden="true"` so screen readers don't announce redundant noise.
- **Never use emoji as functional UI icons.** They render inconsistently across OS/browser, don't match your icon set's stroke weight, and can't be hidden from assistive tech cleanly.
- One icon set, one style (outline *or* filled, one stroke width), never mixed on the same page.
- Size icons relative to adjacent text (roughly 1–1.25× the text size) and keep the same size for the same UI role everywhere. Mismatched icon sizes across a page are as visible a tell as mismatched spacing.

---

## Component patterns

### Navigation

- Don't default to "logo + four links + CTA button" pulled from a generic SaaS template; derive nav items from what the site actually contains.
- Height 64–80px desktop, 56–64px mobile. A sticky header is fine, but give it a border/shadow on scroll so it doesn't float ambiguously.
- Collapse to a hamburger only below ~768px: hiding navigation on desktop measurably hurts content discoverability. Label the icon "Menu" if there's room; it lifts engagement over the icon alone.
- Every item needs hover, focus-visible, active, and current-page states, with tab order matching visual order. A mobile menu must trap focus while open, close on Escape, and return focus to its trigger on close.

### Hero

- Avoid the default: centered headline + subtext + two centered buttons over a gradient blob. It's the statistical average of training data; break at least one axis (alignment, imagery, or copy specificity) on purpose.
- State a concrete value proposition in the product's own language. No "revolutionize your workflow."
- One primary CTA (solid button); a secondary action, if present, is visually subordinate, never a second button of equal weight.
- Real product screenshots or diagrams beat stock photography or abstract blobs with no relation to the product.
- If text sits over an image or gradient, add a scrim so it holds 4.5:1 contrast everywhere, not just where you tested it.

### Buttons

- Two or three variants, reused everywhere: primary (solid), secondary (outline/ghost), destructive (red-toned). Never invent a one-off style per section.
- Sizes roughly 32/40/44–48px tall; minimum 44×44px touch target on mobile.
- Every button needs default, hover, focus-visible, active, disabled, and loading states. Disabled means reduced opacity *and* `cursor: not-allowed`, not grayed text with nothing else changed. Loading means a spinner and a disabled state, so double-submit isn't possible.
- Only one primary (solid) button per view: if everything is emphasized, nothing is.
- `button` for actions, `a` for navigation. Never a clickable `div`.
- Label buttons with the actual result ("Create account," "Export CSV"), not "Submit."

### Forms & inputs

- Every input gets a real `<label>` linked via `for`/`id`. Placeholder text is not a label: it disappears the moment the user types.
- Stack fields in a single column on mobile; group related fields with `fieldset`/`legend`.
- **Validate on blur**, not on every keystroke: keystroke-level validation feels premature and accusatory before the user has even finished typing. Also re-validate the whole form on submit and move focus to the first invalid field.
- Show errors inline under the field (text + icon, not color alone), and if there are several, add a summary at the top that links to each field, announced via `role="alert"`.
- Only disable submit *during* an in-flight request: disabling it pre-emptively while the form is incomplete hides the reason why from the user.

### Cards

- Use a card to group heterogeneous content (image + title + meta + action) that needs a visual boundary. For homogeneous content (a settings list, a single stat), use a list row or table instead. Wrapping *everything* in a bordered box is the single most common "AI slop" tell.
- Never nest a card inside a card, and don't wrap an entire page section in one giant card.
- If the whole card is clickable, make it one link; don't nest independent buttons/links inside a clickable card.

### Tables & data display

- Decide the responsive strategy up front, deliberately: horizontal scroll with a frozen first column (many columns, data integrity matters), a row-to-card transform (few records, read individually), or column priority hiding with a "more" disclosure. Bare `overflow-x: auto` with no scroll affordance isn't a strategy.
- Sticky header past ~10 rows; sticky first column on wide comparison tables.
- Real `<table>`/`<th scope>` markup: a div-based table breaks screen readers and in-page search.
- Truncate long cell text with a tooltip on hover/focus, never a silent clip with no way to see the full value.

### Modals & dialogs

- Reserve for focused, blocking tasks: a destructive-action confirmation, a short required input, a critical warning. Not upsells or anything mid-checkout; low-value modals train users to reflexively dismiss all of them.
- Required, non-negotiable behavior: trap focus while open, close on Escape, close on backdrop click (except costly-to-dismiss confirmations), and return focus to the trigger on close. `role="dialog"`, `aria-modal="true"`, `aria-labelledby` on the title.
- Never stack modals; open a step within the same modal instead.
- A true alert dialog (must respond, no outside-click dismiss) is a different component from a general dismissible dialog; don't use one for both.

### Toasts, alerts & banners

- Match the container to scope and persistence: **toast**, transient, per-event (saved, copied); **inline alert**, persistent, scoped to a field or section, stays until resolved; **banner**, page-wide persistent state (outage, trial ending).
- Routine toasts get `role="status"`/`aria-live="polite"`; reserve `role="alert"`/`aria-live="assertive"` for genuinely time-critical errors.
- Never auto-dismiss an error toast. Any auto-dismissing toast needs a generous timeout (5s+) and pauses on hover/focus.
- Toasts report the outcome of an action; they don't replace inline field validation.

### Empty states

- Never render a bare "No data found" centered on a blank page. Pair the explanation with a concrete next action: "Create your first project," "Invite a teammate," "Clear filters."
- Distinguish zero-data (first use → onboarding CTA), zero-results (filtered search → adjust-filters action), and error (→ retry). One generic message for all three throws away useful context.

### Loading states

- Nothing for the first ~300ms (avoids flicker on fast responses). A small inline spinner from ~300ms–1s when the final layout is unknown. A skeleton shaped like the real content past ~1s when the layout *is* known (feeds, tables, card grids).
- Skeletons for layout-based content; spinners for short, layout-agnostic actions (submit, auth, save). A skeleton that's just one generic gray rectangle repeated everywhere doesn't help: it should mirror real line lengths, avatar shapes, image blocks.
- Never leave a skeleton indefinitely; pair it with a timeout that surfaces a retry/error state.

### Pagination

- Numbered pagination for goal-directed or bookmarkable content (admin tables, search results, catalogs) where users need to backtrack, compare, or share a specific page.
- Infinite scroll only for pure discovery feeds where backtracking doesn't matter (social feeds, image grids); it breaks bookmarking and footer access everywhere else.
- "Load more" is the middle ground: explicit control, no page jump.
- Always show position context, such as "Page 3 of 12" or "Showing 21–40 of 214," regardless of which pattern is used.

### Footer

- Skip the single-row copyright line with three social icons. Include real secondary navigation (link columns, contact info, legal links) collapsing to stacked (optionally accordioned) groups on mobile.
- Match footer typography and color to the rest of the site; a footer that looks like a bolted-on dark band is its own tell.

---

## What separates "looks fine" from "feels finished"

- **Core Web Vitals**, measured, not assumed: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 at the 75th percentile.
- One clear `h1`, a scannable heading structure, the value proposition and primary action above the fold.
- No lorem ipsum, no placeholder-feeling copy. Real headlines and numbers, or none at all: filler is the fastest way a page reads as unfinished.
- Every link resolves; every contact method is real. Users judge credibility in under 20 seconds, and a dead link is the fastest way to lose that judgment.
- One palette, one type scale, one spacing scale, one component set, reused everywhere. Drift across pages of the same site reads as templated, not designed.
- Judge a build by its edge cases, not its happy path: does it have a real 404 page, real error states, working forms, accurate metadata and favicon, not just a good-looking first screen.

---

## The AI-slop checklist

If you catch yourself doing any of these, stop and reconsider:

- Purple-to-cyan gradients, especially on text
- Glassmorphism with a neon glow border
- Emoji standing in for icons
- Three or six identical cards in a row, same icon-title-paragraph shape
- Bouncy hover scale/translate on every interactive element, not just the ones that need it
- Inter + `rounded-2xl` + soft shadow applied uniformly to every surface, regardless of role
- Everything centered, everything the same size and weight
- A generic stock-photo hero with no relation to the actual product
- `rounded-full` on buttons that aren't pills or tags
- A bare "No data found" with no next action

---

Treat every number above as the default to start from, not a law: a project with its own established system should keep it. But a deviation should be a deliberate choice, not the accidental result of skipping the system altogether.
