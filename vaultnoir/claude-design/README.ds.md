# vaultnoir

vaultnoir is Panopticam's UI turned into a VaultWares design system. It is meant for tools that show a lot of media and are used all day: the catalog desktop app first, then Panopticam, the shared-tube admin and other tools. The source of truth is `vaultwares-themes/vaultnoir` on GitHub. This system mirrors it.

## Content fundamentals

- **Terse and plain.** Use short labels in sentence case: "More like this", "Hide title", "Show hidden titles". Say what a control does, then do exactly that.
- **Tooltips teach in one or two lines.** The Ask bar's tooltip is the model: *Ask in plain words. Year or decade, genre, language and kind become filters; the rest is searched by meaning. Words in "quotes" are searched as written.*
- **Numbers are data.** Counts, durations, ids and scores use the mono face with tabular figures (`29,990`, `2h 50m`, `tt0113277`, `91%`).
- **Errors say what failed and show the gateway's own message**, for example "The gateway did not answer." followed by `GET /v1/catalog/search: 503`. Offer Retry when retrying can help. Never apologise.
- **Empty states give the reason in the person's terms**, naming what they asked, plus one action.
- **Two languages.** Copy is written in English and Quebec French from the start.

## Visual foundations

**One surface, one accent.** vaultnoir has no warm rail and no second region: the whole app sits on one near-black surface (`vwnr-bg` `#0a0b0e`, rising through `vwnr-surface` to `vwnr-surface-3`). A light mode uses the same token names. One accent carries every highlight; it is red by default (`vwnr-accent` `#ff3b4e`, Panopticam's signal).

**Themes and accents.**
- `data-theme="dark|light"` on `<html>` picks the mode; dark comes first.
- `data-accent="red|sky|violet|pink|amber"` swaps the accent. Each accent has its own mark, text, fill and label values in both modes (the `sky-*`, `violet-*`, `pink-*` and `amber-*` tokens).
- `bundle.css` carries the switch, so an app only sets the attribute.

**Contrast.** Every pair is computed, not eyeballed:
- Text is at least 4.5:1 on `vwnr-surface-3`, the darkest ground text sits on.
- Accent marks and the focus ring are at least 3:1.
- The primary fill takes a white label when a small darkening reaches 4.5:1 (red becomes `#ea0013`). Otherwise it takes a near-black label (sky, amber).
- `vwnr-faint` is only for hints and icons, never for text someone must read.

**Type.** Inter Tight for the UI, JetBrains Mono for data, both packaged as files.
- Body text is 14px with 1.45 line height, on a 1.2 scale (12, 14, 17, 20, 24, 29).
- Headings are weight 600 with slight negative tracking.
- Menu labels are 11px uppercase with 0.06em tracking.

**Geometry.**
- Buttons are 34px high (`vwnr-control`), inputs and the two searches 38px, chips 30px, rows 36px, and the top bar 56px.
- Radii: 8 for buttons and chips, 9 for inputs, 10 for menus and alerts, 12 for cards and panels, pills for badges.
- Spacing follows a 4px base: 4, 8, 12, 16, 20, 24, 32.
- Click targets are never under 32px.

**Density.** Panopticam's: cards in an auto-fill grid at 180 to 220px (a slider sets `vwnr-card-min`) with 12px gaps. Pictures dominate; text stays to a title and one meta line.

**Motion.** Quick: 120 to 150ms ease-out on hover, focus, chips, menus and toasts.
- No page transitions and no animated list reordering.
- **No hover scrub**: cards never flip through frames on hover.
- With reduced motion, everything stops, including the live dot's pulse and the skeleton shimmer.

**States.**
- Loading shows skeletons at final size; a spinner is used only for actions under a second.
- Empty states give one line saying why, plus one action.
- Errors appear inline, with Retry.
- Toasts are only for background events.
- Selection is a 2px accent ring on cards and `vwnr-surface-3` on rows.
- The focus ring is 2px `vwnr-focus` with a 2px offset.

**Layout.** The app is desktop-first, with breakpoints at 800, 1200 and 1600px and a minimum window of 800 x 560.
- The top bar's pinned pages follow this viewer's use, with the home page always first.
- What doesn't fit goes into "All pages"; nothing collapses to icons.

**Signals.** `vwnr-success`, `vwnr-danger`, `vwnr-warning` and `vwnr-info` always come with a word or an icon.

**Charts.** Categories use the five accents (`vwnr-cat-1..5`); sequential data uses the active accent's ramp (`vwnr-ramp-1..5`).

## The search pattern

Every list page has a toolbar under the top bar holding two searches side by side:

1. **Search** (magnifier) matches words. `/` focuses it.
2. **Ask** (the circles icon, Panopticam's eye) takes a sentence. `A` focuses it, and Enter or blur commits it. The page parses the sentence with its own words: years, genres, languages and kinds become filters, and the leftover is searched by meaning.

Below them, **Read as** shows how the sentence was understood: a solid chip per filter (click to drop it) and a dashed chip for the part searched by meaning. The Ask bar never replaces the word search. "Best match" sorting appears only while a question is active.

## Keyboard

| Keys | What |
|---|---|
| Ctrl K | Find anything |
| / | Search |
| A | Ask |
| G then a letter | Go to a page (each page names its letter) |
| Arrows, Enter | Move between cards, open one |
| 4 3 2 1 | Rate (review queues) |
| ? | The key sheet |

Keys are ignored while you type in a field.

## Iconography

The icons are Panopticam's hand-drawn set, extended for the catalog (lyrics, sound wave, cast, oracle, picture, poster and more): 61 icons in all, in the **Icons** group.
- They are drawn on a 20px grid with a 1.6 stroke, round caps and joins, outline only.
- They're used at 16, 18 and 20px.
- They are filled only for "on" variants (`StarFilled`, `HeartFilled`).
- In code they take `currentColor` and inherit the text colour.
- The circles icon (`Ask`) is the system's emblem, and the brand mark in the top bar.

## Using it

- Load `tokens.css`, the fonts, `bundle.css`, React 18 or later, and `bundle.js`. Then `window.vaultnoir` holds every component and icon: `TopBar`, `Toolbar`, `Search`, `AskBar`, `ReadAs`, `Grid`, `Card`, `Rating` and the others.
- Wrap the app in an element with the `vwnr` class.
- Set `data-theme` and `data-accent` on `<html>`, or call `useTheme(theme, accent)`.
- In a codebase, import from `vaultwares-themes/vaultnoir/react` instead. Its typed React wrappers are the same components.
- Never write a raw hex: use the `vwnr-*` tokens.

## Out of scope (v1)

No Qt or Python port, and no right-to-left layout. Phone widths and print are allowed but not designed yet (print is a minimal stylesheet).
