---
name: Vital Red Direct
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#5c403c'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#916f6b'
  outline-variant: '#e6bdb8'
  surface-tint: '#bf0715'
  primary: '#b70011'
  on-primary: '#ffffff'
  primary-container: '#dc2626'
  on-primary-container: '#fff6f5'
  inverse-primary: '#ffb4ab'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#b21618'
  on-tertiary: '#ffffff'
  tertiary-container: '#d6332d'
  on-tertiary-container: '#fff7f6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb4ab'
  on-primary-fixed: '#410002'
  on-primary-fixed-variant: '#93000b'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdad6'
  tertiary-fixed-dim: '#ffb4ab'
  on-tertiary-fixed: '#410002'
  on-tertiary-fixed-variant: '#93000b'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '800'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  blood-badge:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '800'
    lineHeight: 24px
    letterSpacing: -0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

This design system is engineered for life-critical urgency, deep institutional reliability, and accessible clarity. Designed for a Blood Donor Finder and emergency blood matching portal, every interaction prioritizes speed-to-action, psychological reassurance, and immediate comprehension under cognitive distress.

The overarching design aesthetic blends **Corporate Clinical Precision** with **High-Contrast Humanism**:
- **Trustworthy & Authoritative:** Avoids frivolous gamification or decorative clutter. Information hierarchy mirrors acute care and clinical dashboard architectures.
- **Urgent without Panic:** Vivid blood crimsons drive decisive actions and indicate shortages, while tranquil emeralds confirm verified status and rapid donor availability.
- **Utilitarian Speed:** Surfaces, touch targets, and typography enforce zero friction during emergency broadcasts, location triangulation, and blood requisition flows.

## Colors

The palette balances intense operational vitality with clinical cleanliness to guarantee immediate legibility across varied ambient environments (e.g., ambulances, outdoor triage, glaring hospital lighting).

### Primary: Crimson Vitality (`#DC2626`, `#B91C1C`, `#991B1B`)
- **Use:** Emergency broadcasts, high-priority Requisition CTAs, universal blood group indicators, critical shortfall bars, and destructive/urgent triggers.
- **Roles:**
  - `primary-base`: `#DC2626` (Active buttons, urgent markers)
  - `primary-hover`: `#B91C1C` (Hover/focus states)
  - `primary-dark`: `#991B1B` (Header accents, key urgency callouts)
  - `primary-subtle`: `#FEF2F2` (Emergency container surfaces, error alert fills)

### Secondary: Verified & Life-Affirming Green (`#10B981`, `#059669`, `#047857`)
- **Use:** Verified donor badges, "Available Now" real-time status pings, successful match notifications, and positive donor health checkpoints.
- **Roles:**
  - `secondary-base`: `#10B981` (Status dots, positive metrics)
  - `secondary-active`: `#059669` (Success CTAs, verified badges)
  - `secondary-subtle`: `#ECFDF5` (Tag backgrounds, matched donor cards)

### Neutral & Surface Hierarchy
- **Canvas (`#FFFFFF`):** Base backdrop for clinical clarity and pure white screen contrast.
- **Surface Elevation 1 (`#F8FAFC`):** Card panels, filter trays, list backgrounds.
- **Surface Elevation 2 (`#F1F5F9`):** Input fills, table headers, neutral active tags.
- **Borders (`#E2E8F0`):** Subtle structural boundaries framing critical cards.
- **Text Heavy (`#0F172A`):** Maximum contrast headline and primary text tokens.
- **Text Muted (`#64748B`):** Supporting metadata, timestamps, and secondary captions.

## Typography

The typography system pairs **Plus Jakarta Sans** for prominent, urgent headlines and blood group identifications with **Inter** for dense, tabular clinical data, metrics, and donor cards.

- **Plus Jakarta Sans (Display / Badges):** Chosen for its geometric foundation, tall x-height, and robust presence. Numbers and uppercase blood types (`O-`, `A+`, `AB+`) achieve immediate cognitive capture without optical confusion.
- **Inter (Interface & Body):** Employs contextual alternates and tabular figures (`tnum`) by default for all dynamic countdowns, distance calculations, and medical logs, eliminating visual jitter during live updates.
- **Numeric & Blood Group Scale:** Blood types utilize the dedicated `blood-badge` token to maintain legibility even when rendered inside small badge containers or on geospatial maps.

## Layout & Spacing

A strict **8pt mathematical rhythm** governs layout pacing, ensuring high-density healthcare data retains ample breathing room and structured rhythm.

### Grid Architecture
- **Desktop (1024px+):** 12-column responsive fluid grid with 1280px max-width container. 24px (`1.5rem`) gutters and 32px (`2rem`) page margins.
- **Tablet (768px - 1023px):** 8-column layout with 20px gutters and 24px margins. Filters collapse into a persistent, accessible drawer.
- **Mobile (320px - 767px):** 4-column layout with 16px (`1rem`) gutters and 16px margins. Emergency actions stick to the bottom screen safe area.

### Density & Touch Targets
- All primary interactive elements (Emergency Requisition, Blood Type Selectors, Call Donor buttons) observe a minimum target area of **48px x 48px** to guarantee accurate tapping during physical agitation or transit.
- Compact data density applies to desktop tabular registries, while mobile interfaces expand spacing around critical taps to prevent accidental activations.

## Elevation & Depth

To sustain a clinical, crisp environment, the elevation model rejects heavy murky drop shadows in favor of **low-contrast borders paired with focused, ambient depth**.

- **Level 0 (Flat):** Used for base page surfaces (`#FFFFFF`) and embedded list row items.
- **Level 1 (Card & Containers):** Framed with a 1px solid border in `#E2E8F0` and an ultra-soft shadow: `0px 1px 3px rgba(15, 23, 42, 0.05), 0px 1px 2px rgba(15, 23, 42, 0.02)`.
- **Level 2 (Interactive Cards / Floating Controls):** Filter toolbars, active donor profile cards, and dropdown sheets: `0px 4px 12px -2px rgba(15, 23, 42, 0.08), 0px 2px 6px -1px rgba(15, 23, 42, 0.04)`.
- **Level 3 (Urgent Banners & Modals):** Critical shortage alerts and emergency blood request confirmations: `0px 12px 28px -4px rgba(220, 38, 38, 0.12), 0px 6px 14px -2px rgba(15, 23, 42, 0.08)`. Tinted with crimson to anchor emergency context.

## Shapes

The design system adopts a **Rounded (`roundedness: 2`)** aesthetic, striking the optimal balance between clinical sterility and humane empathy. 

- **Base Corner Radius (8px / `0.5rem`):** Standard for form inputs, interactive donor profile cards, modal frames, and emergency blood shortage alerts.
- **Outer Shells & Dialogs (`1rem`):** Applied to full-bleed emergency drawers and floating match cards.
- **Status Pills & Blood Indicators (`9999px`):** Full pill rounding is strictly reserved for blood type selectors (`A+`, `O-`), availability beacons (`Available Now`), and live distance tags (`2.4 km away`).

## Components

### Buttons
- **Primary Urgent ("Request Blood Now"):** Solid `#DC2626` background, `#FFFFFF` text, `label-lg` styling. Subtle crimson glow on hover (`#B91C1C`), 48px standard height, minimum 16px horizontal padding.
- **Secondary Life-Support ("Call Donor / Dispatch"):** Solid `#10B981` background, `#FFFFFF` text, hover `#059669`.
- **Outline / Ghost:** 1.5px border `#E2E8F0`, text `#0F172A`, hover background `#F8FAFC`.

### Blood Type Selector Chips
- Standardized 48x48px circular or pill-shaped toggle buttons.
- **Default State:** `#F8FAFC` background, 1px border `#E2E8F0`, text `#0F172A` in `blood-badge` font.
- **Selected Urgent State:** `#DC2626` background, border `#991B1B`, text `#FFFFFF` with high-contrast indicator dot.

### Donor Profile Cards
- Structured container using Surface Elevation 1 (`#F8FAFC`), bordered with `#E2E8F0`.
- Left-aligned blood type avatar in crimson or slate depending on verified inventory match.
- Prominent status indicator using `#10B981` for "Available Now" (pulsing indicator icon) and `#64748B` for "On Standby".
- Live distance matrix ("2.1 km • ~8 mins away") formatted with tabular figures.

### Urgent Blood Shortage Alerts
- Background `#FEF2F2`, 1.5px border `#FCA5A5`, accent bar `#DC2626` on left boundary (4px width).
- Embedded high-contrast warning icon, clear descriptive impact message, and a quick-action "Mobilize Donors" text button.

### Form Inputs & Radius Filters
- 44px field height, `#FFFFFF` background, `#CBD5E1` border, 8px radius.
- Interactive dual-range slider with emerald track fill for distance filtering (0 - 50 km).
- Focused state features a crisp double-ring: 2px offset white with 2px solid `#DC2626`.