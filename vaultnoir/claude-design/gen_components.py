"""Component previews and guidelines for the vaultnoir Claude Design system."""
import sys
from pathlib import Path

S = Path(sys.argv[1]) / "project" / "components"

HEAD = """<div id="root" class="vwnr" style="min-height:0;padding:16px;background:var(--vwnr-bg)"></div>
<script>
const h = React.createElement, N = window.vaultnoir;
const { useState } = React;
function Demo() {
%s
}
ReactDOM.createRoot(document.getElementById("root")).render(h(Demo));
</script>
"""

POSTER = """const art = (i) => h("div", { style: { width: "100%", height: "100%", background: `linear-gradient(160deg, var(--vwnr-cat-${(i % 5) + 1}), var(--vwnr-media) 75%)` } });"""

C = {
    "TopBar": ("Navigation", 80, 960, "The 56px top bar: brand, pinned pages ordered by use, All pages, tools and the status pulse.",
        """When to use: once per app, at the top of every page.

- Pinned pages are ordered by how often this viewer opens them (`usePageOrder`); the home page (Browse) is always first.
- Pages that don't fit move into **All pages**, which lists every page with its G+letter key. Labels never collapse to icons.
- The right end holds tools (theme, finder) and the status pulse (`vwnr-pulse`: a live dot and short counts in mono).
- The consumer supplies `pages` (id, label, icon, key, count), `current`, `onGo`, and the `end` content.""",
        """const pages = [
  { id: "browse", label: "Browse", icon: h(N.IconHome, { size: 16 }), key: "B" },
  { id: "titles", label: "Titles", icon: h(N.IconFilm, { size: 16 }), key: "T", count: 29990 },
  { id: "pictures", label: "Pictures", icon: h(N.IconPicture, { size: 16 }), key: "P" },
  { id: "cast", label: "Cast", icon: h(N.IconCast, { size: 16 }), key: "C" },
  { id: "lyrics", label: "Lyrics", icon: h(N.IconLyrics, { size: 16 }), key: "L" },
  { id: "music", label: "Music", icon: h(N.IconWave, { size: 16 }), key: "M" },
  { id: "moments", label: "Moments", icon: h(N.IconPlay, { size: 16 }), key: "O" },
  { id: "oracle", label: "Tech oracle", icon: h(N.IconOracle, { size: 16 }), key: "R" },
];
const [cur, setCur] = useState("browse");
return h("div", { style: { margin: -16 } }, h(N.TopBar, { brand: [h(N.IconAsk, { size: 22, key: "i" }), "Catalog"], pages, current: cur, onGo: setCur,
  end: h("span", { className: "vwnr-pulse" }, h(N.Dot), h("span", { className: "vwnr-num" }, "29,990"), " titles") }));"""),
    "Toolbar": ("Search", 150, 960, "The row under the top bar: the word search, the Ask bar and the page's filters, with the Read as chips below.",
        """When to use: one per page that lists things.

- **Search** (left, magnifier) matches words: names, titles, ids. `/` focuses it.
- **AskBar** (right, circles icon) takes a sentence. Its tooltip says how to use it in one or two lines. Enter or blur commits. `A` focuses it.
- The page parses the sentence with its own vocabulary: what it recognises becomes filters, the leftover is searched by meaning, and words in "quotes" are kept as written.
- **ReadAs** shows how the sentence was read: a solid chip per filter (click to drop it) and a dashed chip for what goes to the meaning search.
- The Ask bar never replaces the word search; both stay visible side by side.
- The "Best match" sort appears only while a question is active.""",
        """const [q, setQ] = useState(""), [ask, setAsk] = useState("90s heist in Paris, french");
const [parts, setParts] = useState([{ key: "d", label: "1990s" }, { key: "l", label: "French" }, { key: "x", label: "heist in Paris", kind: "look" }]);
return h("div", { style: { margin: -16 } }, h(N.Toolbar, {
  below: h(N.ReadAs, { parts, onDrop: (k) => setParts(parts.filter((p) => p.key !== k)) }) },
  h(N.Search, { value: q, onChange: setQ, placeholder: "Title, person or id" }),
  h(N.AskBar, { value: ask, onChange: setAsk, onCommit: () => {}, onClear: () => { setAsk(""); setParts([]); }, active: parts.length > 0,
    placeholder: "Ask… “90s heist in Paris, french”",
    tip: "Ask in plain words. Year or decade, genre, language and kind become filters; the rest is searched by meaning. Words in \\"quotes\\" are searched as written." }),
  h(N.Chip, { on: true }, "Films"), h(N.Chip, null, "Series"),
  h("div", { className: "vwnr-toolbar-end" }, h("span", { className: "vwnr-small vwnr-muted" }, "Best match"))));"""),
    "Button": ("Actions", 110, None, "Buttons: 34px (28px small), 8px radius; primary takes the accent fill and its label colour.",
        """When to use: **primary** for the one main action of a view; default (surface + line) for the rest; **ghost** for quiet actions in toolbars; **danger** for hide or remove.

- One primary per view.
- The label says exactly what happens ("Hide title", "More like this").
- An icon goes before the label, at 16px.
- `on` marks a toggled tool.
- `IconButton` is a square 34px (28px small) with a required `label`, used as its tooltip and accessible name.""",
        """return h("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" } },
  h(N.Button, { variant: "primary" }, "Save"), h(N.Button, null, "Secondary"), h(N.Button, { variant: "ghost" }, "Ghost"),
  h(N.Button, { variant: "danger", icon: h(N.IconHide, { size: 16 }) }, "Hide title"), h(N.Button, { on: true }, "On"),
  h(N.Button, { size: "sm" }, "Small"), h(N.Button, { disabled: true }, "Disabled"),
  h(N.Button, { variant: "primary", icon: h(N.IconSimilar, { size: 16 }) }, "More like this"),
  h(N.IconButton, { label: "Favourite" }, h(N.IconHeart)), h(N.IconButton, { label: "Similar", on: true }, h(N.IconSimilar)));"""),
    "Chip": ("Actions", 100, None, "Chips toggle filters: 30px, 8px radius; on is surface-3 with an inset line.",
        """When to use: filters and quick toggles in a toolbar, and look presets.

- `on` (aria-pressed) shows the chosen ones.
- `outline` is for a chip that sits alone.
- `dashed` is for a part searched by meaning (Read as).
- `accent` is for the one chip that carries the active question.
- **Seg** groups mutually exclusive chips in a 3px track.""",
        """const [v, setV] = useState("films"), [on, setOn] = useState({ fr: true });
return h("div", { style: { display: "grid", gap: 10 } },
  h("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
    ["fr", "en", "4k", "owned"].map((k) => h(N.Chip, { key: k, on: !!on[k], onClick: () => setOn({ ...on, [k]: !on[k] }) }, { fr: "French", en: "English", "4k": "4K", owned: "Owned" }[k])),
    h(N.Chip, { tone: "outline" }, "Outline"), h(N.Chip, { tone: "accent" }, "Accent"), h(N.Chip, { tone: "dashed", size: "sm" }, "heist in Paris")),
  h(N.Seg, { label: "Kind", value: v, onChange: setV, options: [{ value: "films", label: "Films" }, { value: "series", label: "Series" }, { value: "all", label: "All" }] }));"""),
    "Rating": ("Actions", 70, None, "The review keys: four buttons, 4 3 2 1, each showing its key; the page names the labels.",
        """When to use: review queues (Moments, pictures, scenes) where you rate many items quickly.

- The keys 4 3 2 1 work anywhere on the page (`useShortcuts` with `rate`), except while typing in a field.
- The chosen button takes the accent fill.
- Labels are the page's own words, best first (Great / Good / Meh / No).""",
        """const [r, setR] = useState(3);
return h(N.Rating, { value: r, labels: ["Great", "Good", "Meh", "No"], onRate: setR });"""),
    "Card": ("Display", 440, None, "Result cards in an auto-fill grid: poster, still or square media, title, meta, corner tags; no hover scrub.",
        """When to use: every grid of titles, pictures, people or clips.

- The grid fills columns of at least `--vwnr-card-min` (the card-size slider moves it from 180 to 220) with 12px gaps.
- Media shapes: `poster` (2:3), `wide` (16:9, stills and clips) and `square` (people).
- The tag (top left) and score (top right) are mono, on a media scrim. The score is the match in % while a question is active.
- Actions (more like this, favourite) appear on hover or focus.
- A selected card gets a 2px accent ring. Arrow keys move between cards (`useGridKeys`) and Enter opens one.
- **No hover scrub**: cards never flip through frames on hover.""",
        POSTER + """
const t = [["Heat", "1995 · Crime · 2h 50m", "91%"], ["Ronin", "1998 · Thriller", "88%"], ["La Haine", "1995 · Drama · fr", "84%"], ["Rififi", "1955 · Crime · fr", "73%"]];
const [sel, setSel] = useState(1);
return h("div", { style: { margin: -16 } }, h(N.Grid, { cardMin: 180, label: "Titles" }, t.map(([a, b, c], i) => h(N.Card, { key: a, shape: "poster", media: art(i), title: a, meta: b,
  tag: i === 0 ? "4K" : null, score: c, selected: i === sel, onOpen: () => setSel(i),
  actions: h(N.IconButton, { label: "More like this", size: "sm" }, h(N.IconSimilar, { size: 16 })) }))));"""),
    "Badge": ("Display", 70, None, "Badges, counts and the live dot: small mono pills that carry a state or a number.",
        """When to use: a state on a row or card (Owned, Missing, Synced) or a count beside a label.

- A tone always comes with a word: colour alone never carries meaning.
- `Count` is the number beside a nav link.
- `Dot` is the live indicator: it pulses; `off` stops it.""",
        """return h("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" } },
  h(N.Badge, null, "12"), h(N.Badge, { tone: "accent" }, "New"), h(N.Badge, { tone: "success" }, "Owned"), h(N.Badge, { tone: "warning" }, "Partial"),
  h(N.Badge, { tone: "danger" }, "Missing"), h(N.Badge, { tone: "info" }, "Synced"), h("span", { className: "vwnr-count" }, "29,990"), h(N.Dot), h(N.Dot, { off: true }));"""),
    "KeySheet": ("Display", 230, None, "The keyboard sheet: every shortcut with its keys, opened with ?.",
        """When to use: once per app, opened with `?`.

The standard keys:
- **Ctrl K**: finder
- **/**: search
- **A**: Ask
- **G + letter**: go to a page
- **arrows**: move between cards
- **Enter**: open
- **4 3 2 1**: rate
- **?**: this sheet

Pages add their own keys below these. Keys are ignored while you type in a field.""",
        """return h(N.KeySheet, { rows: [
  { keys: ["Ctrl", "K"], what: "Find anything" }, { keys: ["/"], what: "Search" }, { keys: ["A"], what: "Ask" },
  { keys: ["G", "T"], what: "Go to Titles (G + the page's letter)" }, { keys: ["←", "→", "↑", "↓"], what: "Move between cards" },
  { keys: ["Enter"], what: "Open" }, { keys: ["4", "3", "2", "1"], what: "Rate" }, { keys: ["?"], what: "This sheet" }] });"""),
    "Stats": ("Display", 110, None, "Stat tiles: a label and a mono number, for the summary at the top of a page.",
        """When to use: a page summary (how many titles, stills, cast), never as decoration.

Numbers are tabular mono at 20px; labels are 12px muted.""",
        """return h(N.Stats, { items: [{ label: "Titles", value: "29,990" }, { label: "Stills", value: "193,788" }, { label: "Lyrics", value: "1,029" }, { label: "Cast", value: "209,795" }] });"""),
    "Tabs": ("Display", 70, None, "Tabs: 40px, the chosen one underlined in the accent.",
        """When to use: switching views inside a detail page (Overview, Cast, Pictures, Similar).

Tabs are not page navigation, which lives in the top bar.""",
        """const [v, setV] = useState("overview");
return h("div", { style: { margin: -16 } }, h(N.Tabs, { value: v, onChange: setV, tabs: [{ value: "overview", label: "Overview" }, { value: "cast", label: "Cast" }, { value: "pictures", label: "Pictures" }, { value: "similar", label: "Similar" }] }));"""),
    "Alert": ("Feedback", 150, None, "Inline alerts: what went wrong, the gateway's own message in mono, and Retry.",
        """When to use: an error or a notice about the view you are looking at, placed where the content would be.

- **Danger** is for failures. It has role alert and a Retry button when retrying can help.
- **Warning** is for partial results, such as an index still being built.
- **Info** is for neutral notes.
- Background events (a download finished) go to **Toasts** instead.""",
        """return h("div", { style: { display: "grid", gap: 10 } },
  h(N.Alert, { title: "The gateway did not answer.", detail: "GET /v1/catalog/search: 503 Service Unavailable", onRetry: () => {} }),
  h(N.Alert, { tone: "warning", title: "Stills are still being embedded: scene search covers 41% of episodes." }),
  h(N.Alert, { tone: "info", title: "Hidden titles are not shown. Turn on Show hidden in Options." }));"""),
    "Empty": ("Feedback", 170, None, "Empty states: one line saying why, and one action.",
        """When to use: a list or search with nothing to show.

- Say why in the person's terms, naming what they asked ("Nothing matches 'boat chase in the snow' among French films of the 1990s").
- Offer the one action that helps, such as clearing the question.
- No illustration.""",
        """return h(N.Empty, { action: h(N.Button, null, "Clear the Ask") }, "Nothing matches “boat chase in the snow” among French films of the 1990s.");"""),
    "SkeletonGrid": ("Feedback", 300, None, "Loading: skeleton cards at their final size; Spinner only for actions under a second.",
        """When to use: while a grid loads.

- Skeletons take the final shape and size of what loads, so nothing jumps when it arrives.
- `Spinner` is only for a short action (saving, under about a second), beside its label.""",
        """return h("div", { style: { margin: -16 } }, h(N.SkeletonGrid, { n: 4, shape: "poster" }));"""),
    "Toasts": ("Feedback", 140, None, "Toasts: background events, bottom right, dismissable.",
        """When to use: something finished or failed outside the current view (a download finished, a job failed).

- Errors about the current view use **Alert** instead.
- Toasts leave on their own after a few seconds, and can be dismissed earlier.""",
        """const [items, setItems] = useState([{ id: 1, text: "The stills download finished: 545,187 pictures.", tone: "success" }, { id: 2, text: "Profiles download stopped: TMDB answered 429.", tone: "error" }]);
return h("div", { className: "vwnr-toasts", style: { position: "static" } }, items.map((t) => h("div", { key: t.id, className: "vwnr-toast " + t.tone },
  h("span", { style: { flex: 1 } }, t.text), h(N.IconButton, { label: "Dismiss", size: "sm", onClick: () => setItems(items.filter((x) => x.id !== t.id)) }, h(N.IconX, { size: 14 })))));"""),
    "Field": ("Forms", 190, None, "Fields: a 12px label over a 38px input; switches for on/off settings; the card-size slider.",
        """When to use: settings and edit forms.

- Labels sit above the input in sentence case.
- A switch states the setting it turns on ("Show hidden titles").
- The focus border is the focus colour, never the accent.""",
        """const [on, setOn] = useState(true), [size, setSize] = useState(200);
return h("div", { style: { display: "grid", gap: 12, maxWidth: 420 } },
  h(N.Field, { label: "Name" }, h(N.Input, { placeholder: "Aaron Pierre" })),
  h(N.Switch, { checked: on, onChange: setOn }, "Show hidden titles"),
  h("label", { style: { display: "flex", gap: 8, alignItems: "center" } }, h("span", { className: "vwnr-small vwnr-muted" }, "Card size"), h(N.CardSize, { value: size, onChange: setSize })));"""),
}

for name, (group, height, width, summary, guide, body) in C.items():
    d = S / name
    d.mkdir(parents=True, exist_ok=True)
    marker = f'<!-- @dsCard group="{group}" height={height}' + (f" width={width}" if width else "") + " -->\n"
    (d / "preview.html").write_text(marker + HEAD % body, encoding="utf-8", newline="\n")
    (d / "README.md").write_text(f"# {name}\n\n{summary}\n\n{guide}\n", encoding="utf-8", newline="\n")
print(len(C), "components")
