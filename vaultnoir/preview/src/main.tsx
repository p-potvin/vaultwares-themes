import { StrictMode, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "../../vaultnoir.css";
import "../../components.css";
import {
  ACCENTS, Alert, AskBar, Badge, Button, Card, CardSize, Chip, Dot, Empty, Field, Grid, IconAsk, IconCast,
  IconFilm, IconGrid, IconHeart, IconHistory, IconHome, IconLyrics, IconMoon, IconMusic, IconOracle, IconPicture,
  IconPlay, IconSimilar, IconSun, IconUsers, IconWave, IconButton, Input, KeySheet, Rating, ReadAs, Search, Seg,
  SkeletonGrid, Spinner, Stats, Switch, Tabs, Toasts, Toolbar, TopBar, useGridKeys, usePageOrder, useShortcuts,
  useTheme, type Accent, type Page, type ReadPart, type Theme, type ToastItem,
} from "../../react";
import * as Icons from "../../icons/react";

const PAGES: Page[] = [
  { id: "browse", label: "Browse", icon: <IconHome size={16} />, key: "B" },
  { id: "titles", label: "Titles", icon: <IconFilm size={16} />, key: "T", count: 29990 },
  { id: "pictures", label: "Pictures", icon: <IconPicture size={16} />, key: "P" },
  { id: "cast", label: "Cast", icon: <IconCast size={16} />, key: "C" },
  { id: "people", label: "People", icon: <IconUsers size={16} />, key: "E" },
  { id: "lyrics", label: "Lyrics", icon: <IconLyrics size={16} />, key: "L" },
  { id: "music", label: "Music", icon: <IconWave size={16} />, key: "M" },
  { id: "moments", label: "Moments", icon: <IconPlay size={16} />, key: "O" },
  { id: "oracle", label: "Tech oracle", icon: <IconOracle size={16} />, key: "R" },
  { id: "edits", label: "Edits", icon: <IconHistory size={16} />, key: "D" },
];

const TITLES = [
  ["Heat", "1995 · Crime · 2h 50m", "91"], ["Ronin", "1998 · Thriller · 2h 2m", "88"], ["La Haine", "1995 · Drama · fr", "84"],
  ["Inception", "2010 · Sci-fi · 2h 28m", "80"], ["Lupin", "2021 · Series · fr · 3 seasons", "79"], ["Thief", "1981 · Crime", "77"],
  ["The Score", "2001 · Crime", "75"], ["Rififi", "1955 · Crime · fr", "73"], ["Le Cercle rouge", "1970 · Crime · fr", "72"],
  ["Collateral", "2004 · Thriller", "70"], ["Sicario", "2015 · Thriller", "69"], ["Drive", "2011 · Drama", "66"],
];

function poster(i: number) {
  // Placeholder art from the categorical tokens, so the preview needs no images.
  const a = `var(--vwnr-cat-${(i % 5) + 1})`;
  return <div style={{ width: "100%", height: "100%", background: `linear-gradient(160deg, ${a}, var(--vwnr-media) 75%)` }} />;
}

function App() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [accent, setAccent] = useState<Accent>("red");
  useTheme(theme, accent);
  const [page, setPage] = useState("browse");
  const ordered = usePageOrder(PAGES, "browse", page, "vwnr.preview.pages");
  const [q, setQ] = useState("");
  const [ask, setAsk] = useState("90s heist in Paris, french");
  const [parts, setParts] = useState<ReadPart[]>([
    { key: "decade", label: "1990s" }, { key: "lang", label: "French" }, { key: "look", label: "heist in Paris", kind: "look" },
  ]);
  const [size, setSize] = useState(200);
  const [sel, setSel] = useState(1);
  const [rate, setRate] = useState<1 | 2 | 3 | 4 | undefined>(3);
  const [tab, setTab] = useState("states");
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [sw, setSw] = useState(true);
  const searchRef = useRef<HTMLInputElement>(null);
  const askRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  useGridKeys(gridRef);
  const go = useMemo(() => Object.fromEntries(PAGES.map((p) => [p.key!.toLowerCase(), () => setPage(p.id)])), []);
  useShortcuts({
    go, find: () => toast("Finder (Ctrl K)"), search: () => searchRef.current?.focus(), ask: () => askRef.current?.focus(),
    help: () => setTab("keys"), rate: setRate,
  });
  function toast(text: string, tone?: ToastItem["tone"]) {
    const id = Date.now();
    setToasts((t) => [...t, { id, text, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }

  return (
    <>
      <TopBar brand={<><IconAsk size={22} />vaultnoir</>} pages={ordered} current={page} onGo={setPage}
        end={<>
          <Seg label="Theme" value={theme} onChange={setTheme} options={[
            { value: "dark", label: <><IconMoon size={14} /><span className="vwnr-sr">Dark</span></> },
            { value: "light", label: <><IconSun size={14} /><span className="vwnr-sr">Light</span></> }, { value: "system", label: "Auto" },
          ]} />
          <div className="vwnr-seg" role="group" aria-label="Accent">
            {ACCENTS.map((a) => (
              <button key={a} type="button" className="vwnr-chip" aria-pressed={a === accent} title={a} onClick={() => setAccent(a)}
                style={{ padding: "0 8px" }}>
                <i style={{ width: 12, height: 12, borderRadius: 6, display: "inline-block", background: `var(--vwnr-cat-${ACCENTS.indexOf(a) + 1})` }} />
              </button>
            ))}
          </div>
          <span className="vwnr-pulse"><Dot /> <span className="vwnr-num">29,990</span> titles</span>
        </>} />

      <Toolbar below={<ReadAs parts={parts} onDrop={(k) => setParts((p) => p.filter((x) => x.key !== k))}
        end={<Button size="sm" variant="ghost" icon={<Icons.IconBell size={14} />}>Alert me</Button>} />}>
        <Search value={q} onChange={setQ} placeholder="Title, person or id" inputRef={searchRef} />
        <AskBar value={ask} onChange={setAsk} inputRef={askRef} active={parts.length > 0}
          onCommit={() => toast("Ask committed")} onClear={() => { setAsk(""); setParts([]); }}
          placeholder={"Ask… “90s heist in Paris, french”"}
          tip={<><b>Ask in plain words.</b> Year or decade, genre, language, kind (film / series) become filters; the rest is
            searched by meaning. Words in "quotes" are searched as written.</>} />
        <Chip on>Films</Chip><Chip>Series</Chip><Chip>Owned</Chip>
        <div className="vwnr-toolbar-end">
          <span className="vwnr-small vwnr-muted">Best match</span>
          <CardSize value={size} onChange={setSize} />
        </div>
      </Toolbar>

      <div ref={gridRef}>
        <Grid cardMin={size} label="Titles">
          {TITLES.map(([t, m, s], i) => (
            <Card key={t} shape="poster" media={poster(i)} title={t} meta={m} selected={i === sel}
              tag={i % 3 === 0 ? "4K" : undefined} score={<span className="vwnr-num">{s}%</span>}
              actions={<><IconButton label="More like this" size="sm"><IconSimilar size={16} /></IconButton>
                <IconButton label="Favourite" size="sm"><IconHeart size={16} /></IconButton></>}
              onOpen={() => setSel(i)} />
          ))}
        </Grid>
      </div>

      <Tabs value={tab} onChange={setTab} tabs={[
        { value: "states", label: "States" }, { value: "controls", label: "Controls" }, { value: "keys", label: "Keys" },
        { value: "icons", label: "Icons" }, { value: "type", label: "Type & colour" },
      ]} />
      <div style={{ padding: 16, display: "grid", gap: 16 }}>
        {tab === "states" && <>
          <Alert title="The gateway did not answer." detail="GET /v1/catalog/search: 503 Service Unavailable" onRetry={() => toast("Retrying…")} />
          <Alert tone="warning" title="Stills are still being embedded: scene search covers 41% of episodes." />
          <Empty action={<Button onClick={() => { setAsk(""); setParts([]); }}>Clear the Ask</Button>}>
            Nothing matches “boat chase in the snow” among French films of the 1990s.
          </Empty>
          <SkeletonGrid n={6} shape="poster" />
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}><Spinner /> <span className="vwnr-muted">Saving…</span></div>
        </>}
        {tab === "controls" && <>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <Button variant="primary" onClick={() => toast("Saved", "success")}>Save</Button>
            <Button>Secondary</Button><Button variant="ghost">Ghost</Button><Button variant="danger">Hide title</Button>
            <Button on>On</Button><Button size="sm">Small</Button><Button disabled>Disabled</Button>
            <Button variant="primary" icon={<IconSimilar size={16} />}>More like this</Button>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <Badge>12</Badge><Badge tone="accent">New</Badge><Badge tone="success">Owned</Badge><Badge tone="warning">Partial</Badge>
            <Badge tone="danger">Missing</Badge><Badge tone="info">Synced</Badge>
            <Chip tone="outline">Outline</Chip><Chip tone="accent">Accent</Chip><Chip size="sm">Small</Chip>
          </div>
          <div style={{ display: "grid", gap: 12, maxWidth: 420 }}>
            <Field label="Name"><Input placeholder="Aaron Pierre" /></Field>
            <Switch checked={sw} onChange={setSw}>Show hidden titles</Switch>
            <Rating value={rate} labels={["Great", "Good", "Meh", "No"]} onRate={setRate} />
          </div>
          <Stats items={[{ label: "Titles", value: "29,990" }, { label: "Stills", value: "193,788" }, { label: "Lyrics", value: "1,029" }, { label: "Cast", value: "209,795" }]} />
          <Button onClick={() => toast("The stills download finished.")}>Show a toast</Button>
        </>}
        {tab === "keys" && <KeySheet rows={[
          { keys: ["Ctrl", "K"], what: "Find anything" }, { keys: ["/"], what: "Search" }, { keys: ["A"], what: "Ask" },
          { keys: ["G", "T"], what: "Go to Titles (G + the page's letter)" }, { keys: ["←", "→", "↑", "↓"], what: "Move between cards" },
          { keys: ["Enter"], what: "Open" }, { keys: ["4", "3", "2", "1"], what: "Rate" }, { keys: ["?"], what: "This sheet" },
        ]} />}
        {tab === "icons" && <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 8 }}>
          {Object.entries(Icons).map(([name, I]) => (
            <div key={name} className="vwnr-panel" style={{ display: "grid", justifyItems: "center", gap: 6, padding: 10 }}>
              <I size={20} /><span className="vwnr-small vwnr-muted">{name.replace(/^Icon/, "")}</span>
            </div>
          ))}
        </div>}
        {tab === "type" && <div style={{ display: "grid", gap: 10 }}>
          <h1>Heading 29</h1><h2>Heading 24</h2><h3>Heading 20</h3><h4>Heading 17</h4>
          <p style={{ margin: 0 }}>Body 14 / 1.45. <span className="vwnr-muted">Muted text.</span> <span className="vwnr-accent">Accent text.</span> <a className="vwnr-link" href="#/">A link</a>. <span className="vwnr-num">1,234,567</span> <code>tt0113277</code></p>
          <div style={{ display: "flex", gap: 6 }}>
            {[1, 2, 3, 4, 5].map((i) => <div key={i} style={{ width: 48, height: 28, borderRadius: 6, background: `var(--vwnr-ramp-${i})` }} title={`ramp-${i}`} />)}
            <span style={{ width: 12 }} />
            {[1, 2, 3, 4, 5].map((i) => <div key={i} style={{ width: 28, height: 28, borderRadius: 6, background: `var(--vwnr-cat-${i})` }} title={`cat-${i}`} />)}
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {["bg", "surface", "surface-2", "surface-3", "line", "line-2"].map((k) => (
              <div key={k} style={{ width: 70, height: 40, borderRadius: 6, background: `var(--vwnr-${k})`, border: "1px solid var(--vwnr-line-2)" }} title={k} />
            ))}
            <IconMusic /><IconGrid />
          </div>
        </div>}
      </div>
      <Toasts items={toasts} onDismiss={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />
    </>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
