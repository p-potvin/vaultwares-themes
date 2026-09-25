# vaultsqware (vaultwares²): Design System

## Overview

vaultsqware is a sibling palette to [vaultwares-revisited](../vaultwares-revisited/README.md),
created so internal tooling stops oversaturating the aubergine + gold brand
surface. It is structurally identical to the Redesign and differs only in hue.

Snapshot taken: Fri, 31 Jul 2026 19:47

## The one thing that carries over unchanged

Console and warm are **simultaneous regions**, not day/night modes.

| Region | Role | Share |
|---|---|---|
| **console** (obsidian) | The operational surface. Where commands run, output streams, work happens. | ~85% |
| **warm** (bone) | The rail, nav, railings. Where you choose rather than act. | ~15% |

An app using this palette shows both at once. There is no theme toggle.

## What changed from revisited

| | vaultwares-revisited | vaultsqware |
|---|---|---|
| Console base | `#0b0813` deep aubergine | `#0A0C11` blue-slate obsidian |
| Warm base | `#F5F1E8` parchment | `#EDECE8` bone |
| Primary accent | `#D6A441` gold | `#6E7BF2` iris |
| Secondary accent | `#B07CFF` violet | `#FF8A6B` coral |
| Reads as | institutional, brand-forward | instrument panel, tooling-forward |

Signals keep their meanings but shift slightly cooler. Geometry, spacing rhythm,
motion and typography are inherited from the Redesign unmodified.

## Files

- [TOKENS.md](./TOKENS.md) — every variable, with usage
- [COMPONENTS.md](./COMPONENTS.md) — shells, cards, LEDs, scrollbars
- [vaultsqware.css](./vaultsqware.css) — tokens, region shells, surfaces, LED, scrollbars (synced from vw-gui, Fri, 25 Sep 2026)
- [components.css](./components.css) — every app component (`vwsq-*` classes): vw-gui's set generalised, plus tabs, table, alert, progress, menu, tooltip…
- [react/](./react/index.tsx) — typed React wrappers over those classes, re-exporting every icon
- [icons/](./icons/README.md) — 164 gapped-edge icons: `build.py` generates `svg/`, `sprite.svg`, `react/index.tsx`, `qt/vwsq_icons.qrc`, `icons.json`; `qt/vwsq_icon.py` is the Qt6 helper
- [fonts/](./fonts/fonts.css) — Quicksand, Victor Mono, Monofett (SIL OFL), packaged locally

The published design system (brand book, live component cards, icon assets):
https://claude.ai/artifact/Kc9zVRhZSw2HkJ7tnAiuQk

## Status

vw-gui's `css/vaultwares-square.css` had moved ahead of this snapshot (local
fonts, spine ramp, seam lighting); `vaultsqware.css` is now synced to it and
this folder is again the source of truth. vw-gui's `css/app.css` components
live on here as `components.css`.

## Usage

```html
<link rel="stylesheet" href="vaultsqware/vaultsqware.css" />
<link rel="stylesheet" href="vaultsqware/components.css" />
```

```html
<body class="vwsq-app vwsq-console-shell">
  <div class="vwsq-shell">
    <nav class="vwsq-warm-rail vwsq-rail">…</nav>
    <main class="vwsq-main">…</main>
  </div>
</body>
```

```tsx
import { AppShell, Button, IconPlay } from "vaultsqware/react";
```

Never use a raw hex outside `vaultsqware.css`. Reference `--vwsq-*` tokens.
