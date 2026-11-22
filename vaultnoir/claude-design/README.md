# vaultnoir in Claude Design

The published copy: https://claude.ai/artifact/UeYNyrWs3qE7AB8P74RYPZ (private to the operator until shared).

What it holds and how it was built (Sun, 22 Nov 2026):

| Claude Design file | Built from |
|---|---|
| `project/tokens.json` | `gen_tokens.py` from `../tokens.json`. Same values, tokens named `vwnr-*` so the page's compiled `tokens.css` matches our variables. Other accents are listed as `sky-*`, `violet-*` and so on. |
| `project/components/bundle.css` | `gen_tokens.py`: `../vaultnoir.css` (without its imports) + the four other `data-accent` blocks + `../components.css` |
| `project/components/bundle.js` | `build.mjs` (esbuild through `../preview/node_modules`): `../react/index.tsx` as one IIFE assigning `window.vaultnoir`, with React from the page's globals |
| `project/components/<Comp>/preview.html` + `README.md` | `gen_components.py` (15 components) |
| `project/components/Cover/preview.html` | `cover.html` |
| `project/README.md` | `README.ds.md` |
| `project/fonts/*.woff2` | `../fonts/` |
| Icons group (61 uploads) | `../icons/svg/*.svg` with `currentColor` replaced by `#8d93a0`; `icons.README.md` |

To refresh: put the files at `project/<path>` in a folder, run the three builders, check them with `harness.html` (serve the folder, then open `harness.html?theme=dark|light`), and publish only the changed files to the same URL. Send the index (`project/design-system.json`) last, after reading it back.
