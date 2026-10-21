# vaultsqware: Tokens & Palettes

All colours, fonts and spacing are defined by these tokens. Never use a raw hex
value in a consuming project.

## 1. Console — obsidian

The operational main surface. Each step is a real elevation level, not decoration.

| Token | Hex | Usage |
|---|---|---|
| `--vwsq-console-bg` | `#0A0C11` | App root canvas |
| `--vwsq-console-surface` | `#11141B` | Default container |
| `--vwsq-console-sunken` | `#070810` | Output consoles, wells, code blocks |
| `--vwsq-console-raised` | `#191D27` | Cards, form panels |
| `--vwsq-console-elevated` | `#242935` | Modals, popovers, drag states |
| `--vwsq-console-active` | `#323847` | Pressed / selected surfaces |
| `--vwsq-console-hover` | `#1F2430` | Hover fill |
| `--vwsq-console-text` | `#BAC2D2` | Primary text |
| `--vwsq-console-text-secondary` | `rgba(186,194,210,.72)` | Secondary text |
| `--vwsq-console-text-dim` | `rgba(186,194,210,.46)` | Labels, metadata |
| `--vwsq-console-text-bright` | `#E6EAF2` | Headings, emphasis |
| `--vwsq-console-border` | `rgba(255,255,255,.06)` | Panel separators |
| `--vwsq-console-border-strong` | `rgba(255,255,255,.12)` | Input borders |

## 2. Warm — bone

The rail, nav and railings. Paper you choose from.

| Token | Hex | Usage |
|---|---|---|
| `--vwsq-warm-bg` | `#EDECE8` | Rail canvas |
| `--vwsq-warm-raised` | `#F8F7F4` | Elevated paper, inputs |
| `--vwsq-warm-muted` | `#DEDCD6` | Tertiary, disabled |
| `--vwsq-warm-sunken` | `#E4E2DD` | Wells, active nav slot |
| `--vwsq-warm-ink` | `#0F1116` | Primary text on warm |
| `--vwsq-warm-ink-secondary` | `rgba(15,17,22,.66)` | Secondary text |
| `--vwsq-warm-ink-dim` | `rgba(15,17,22,.42)` | Metadata |
| `--vwsq-warm-border` | `rgba(15,17,22,.10)` | Dividers |
| `--vwsq-warm-border-strong` | `rgba(15,17,22,.18)` | Region edges |

## 3. Accents

### Iris — primary

Run, active command, focus of intent.

| Step | Hex | | Step | Hex |
|---|---|---|---|---|
| `--vwsq-iris-050` | `#EEF0FE` | | `--vwsq-iris-500` | `#6E7BF2` ← base |
| `--vwsq-iris-100` | `#DDE0FD` | | `--vwsq-iris-600` | `#5866DC` |
| `--vwsq-iris-200` | `#BAC0FB` | | `--vwsq-iris-700` | `#4551B8` |
| `--vwsq-iris-300` | `#98A1F7` | | `--vwsq-iris-800` | `#343E8F` |
| `--vwsq-iris-400` | `#8189F5` | | `--vwsq-iris-900` | `#252D66` |

Plus `--vwsq-iris-soft` (14% fill), `--vwsq-iris-softer` (7%), `--vwsq-iris-glow` (32%).

### Coral — secondary

Focus rings, links, warm counterweight inside the console region.

| Step | Hex | | Step | Hex |
|---|---|---|---|---|
| `--vwsq-coral-050` | `#FFF0EB` | | `--vwsq-coral-500` | `#FF8A6B` ← base |
| `--vwsq-coral-100` | `#FFE0D6` | | `--vwsq-coral-600` | `#E86F4F` |
| `--vwsq-coral-200` | `#FFC4B0` | | `--vwsq-coral-700` | `#C4573A` |
| `--vwsq-coral-300` | `#FFA88B` | | `--vwsq-coral-800` | `#9B4029` |
| `--vwsq-coral-400` | `#FF9679` | | `--vwsq-coral-900` | `#722D1B` |

Plus `--vwsq-coral-soft` (14%), `--vwsq-coral-glow` (34%).

## 4. Signals

Hardware-LED semantics. Each has a `-soft` companion at 14% for fills.

| Token | Hex | Meaning |
|---|---|---|
| `--vwsq-signal-online` | `#56D98D` | Success, operational, exit 0 |
| `--vwsq-signal-relay` | `#5AB8F0` | Info, neutral processing |
| `--vwsq-signal-warning` | `#E9B054` | Warning, intermediate failure |
| `--vwsq-signal-alert` | `#F45D6B` | Destructive, crash, non-zero exit |
| `--vwsq-signal-sync` | `#A585F5` | Syncing, queued, background job |
| `--vwsq-signal-idle` | `#6B7385` | Dormant, never run |

## 5. Typography

- `--vwsq-font-sans`: `"Manrope", "Segoe UI", ui-sans-serif, system-ui, sans-serif` (the main font)
- `--vwsq-font-mono`: `"Victor Mono", ui-monospace, SFMono-Regular, monospace`
- `--vwsq-font-display`: `"Monofett", var(--vwsq-font-mono)` (identity only, used sparingly)

Mono is used heavily — labels, badges, metadata, status text, durations, any
technical readout — not only for code.

## 6. Geometry

| Token | Value | Applies to |
|---|---|---|
| `--vwsq-radius-card` | `28px` | Cards |
| `--vwsq-radius-panel` | `16px` | Panels, modals |
| `--vwsq-radius-pill` | `20px` | Chips, pills |
| `--vwsq-radius-control` | `4px` | Buttons, inputs |

Spacing follows an 8px grid: `--vwsq-space-1` through `-6` (4/8/12/16/24/32px).
Layout constants: `--vwsq-titlebar-h` 32px, `--vwsq-rail-w` 300px.

## 7. Motion

| Token | Value | Applies to |
|---|---|---|
| `--vwsq-motion-snap` | `90ms` | Hover, press — user-driven, snappy |
| `--vwsq-motion-ui` | `160ms` | Panels, modals |
| `--vwsq-motion-enter` | `400ms cubic-bezier(.16,1,.3,1)` | List entrance |

Passive animation (LEDs, spinners) stays slow and relaxed — `ledPulse` is 4s.
All motion respects `prefers-reduced-motion`.

## 8. Focus

`--vwsq-focus-ring` is `2px solid` coral at `2px` offset. Coral rather than iris
so the ring stays legible on top of iris-filled primary buttons.
