# vaultnoir components

Classes live in `components.css` and the React wrappers in `react/index.tsx`. Put the `vwnr` class on `<html>` or the
app root so the base rules apply.

| Component | Classes | React | Notes |
|---|---|---|---|
| Top bar | `vwnr-topbar`, `vwnr-brand`, `vwnr-nav`, `vwnr-topbar-end`, `vwnr-pulse` | `TopBar`, `usePageOrder` | 56 px. Pages are ordered by this viewer's use with the home page first; those that don't fit go into "All pages" (measured, never icons only). |
| All pages / menus | `vwnr-menu`, `vwnr-menu-item`, `vwnr-menu-sep`, `vwnr-menu-label` | (inside `TopBar`) | Shows each page's G+letter keys. Escape or a click outside closes it. |
| Toolbar | `vwnr-toolbar`, `vwnr-toolbar-row`, `vwnr-toolbar-end` | `Toolbar` | One per page, under the top bar. |
| Word search | `vwnr-search` | `Search` | `/` focuses it. |
| Ask bar | `vwnr-search ask` (+ `on` while a question is active) | `AskBar` | Circles icon and a how-to tooltip. Enter or blur commits it. Each app brings its own parser (Panopticam's `ask.ts` is the model). |
| Read as | `vwnr-readas` | `ReadAs` | One chip per part read. Clicking a chip drops that part; dashed chips are what gets searched by meaning. |
| Buttons | `vwnr-btn` + `primary`, `ghost`, `danger`, `on`, `sm`; `vwnr-icon-btn` | `Button`, `IconButton` | 34 / 28 px, radius 8. The primary button takes the accent fill and its label colour. |
| Chips | `vwnr-chip` + `on`, `sm`, `outline`, `dashed`, `accent`; `vwnr-seg` | `Chip`, `Seg` | 30 px (26 inside `seg`). Uses `aria-pressed`. |
| Badges, counts, dots | `vwnr-badge` (+ tone), `vwnr-count`, `vwnr-dot` (`off`, `success`) | `Badge`, `Count`, `Dot` | Pills. The dot pulses (live). |
| Keys | `vwnr-kbd`, `vwnr-keys`, `vwnr-keysheet` | `Kbd`, `Keys`, `KeySheet`, `useShortcuts` | G+letter, Ctrl+K, `/`, `A`, `?`, 4 3 2 1. Ignored while you type in a field. |
| Fields | `vwnr-input`, `vwnr-select`, `vwnr-field`, `vwnr-switch`, `vwnr-range` | `Input`, `Field`, `Switch`, `CardSize` | Inputs are 38 px. `CardSize` sets `--vwnr-card-min`. |
| Tooltip | `vwnr-tip` | `Tooltip` | Shown on hover or focus; Escape hides it. Max 340 px. |
| Grid and cards | `vwnr-grid`, `vwnr-card`, `vwnr-card-media` (`poster`, `square`), `-body`, `-title`, `-meta`, `-tag`, `-score`, `-actions` | `Grid`, `Card`, `useGridKeys` | Auto-fill grid. Selected cards get a 2 px accent ring. Actions show on hover or focus. **No hover scrub.** |
| Rows | `vwnr-table`, `vwnr-list`, `vwnr-list-item`, `vwnr-thumb` | | 36 px rows. A selected row is surface-3. |
| Panels | `vwnr-panel`, `vwnr-section-head`, `vwnr-stats`, `vwnr-tabs`/`vwnr-tab`, `vwnr-side`, `vwnr-modal(-scrim)`, `vwnr-progress` | `Stats`, `Tabs` | |
| Rating | `vwnr-rating` | `Rating` | Four buttons, each labelled with its key (4 3 2 1). The page names the labels. |
| Loading | `vwnr-skeleton` (`line`, `card`), `vwnr-spinner` | `SkeletonGrid`, `Spinner` | Skeletons appear at final size. Use a spinner only for actions under 1 s. |
| Empty | `vwnr-empty` | `Empty` | One line saying why, plus one action. |
| Error / notice | `vwnr-alert` (+ `warning`, `info`) | `Alert` | Shown inline with the gateway's message and a Retry button. |
| Toasts | `vwnr-toasts`, `vwnr-toast` (`error`, `success`) | `Toasts` | For background events only, bottom right. |
| Theme | `data-theme`, `data-accent` on `<html>` | `useTheme` | `system` follows the OS setting. |
