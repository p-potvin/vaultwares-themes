/* vaultnoir React wrappers over the vwnr-* classes (React 19; Preact through preact/compat).
   Import the CSS once: vaultnoir/vaultnoir.css then vaultnoir/components.css. */

import {
  useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState,
  type ButtonHTMLAttributes, type CSSProperties, type InputHTMLAttributes, type ReactNode, type Ref, type RefObject,
} from "react";
import { createPortal } from "react-dom";
import {
  IconAlert, IconAsk, IconCheck, IconInfo, IconMenu, IconSearch, IconX,
} from "../icons/react";

export * from "../icons/react";

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

/* ---- theme ---------------------------------------------------------------- */

export type Theme = "dark" | "light" | "system";
export type Accent = "red" | "sky" | "violet" | "pink" | "amber";
export const ACCENTS: Accent[] = ["red", "sky", "violet", "pink", "amber"];

/** Sets data-theme / data-accent on <html>; "system" follows prefers-color-scheme. */
export function useTheme(theme: Theme, accent: Accent) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("vwnr");
    root.dataset.accent = accent;
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const apply = () => { root.dataset.theme = theme === "system" ? (mq.matches ? "light" : "dark") : theme; };
    apply();
    if (theme !== "system") return undefined;
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme, accent]);
}

/* ---- persistence (per viewer, never required) ----------------------------- */

function load<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : fallback; } catch { return fallback; }
}
function save(key: string, v: unknown) {
  try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* storage off: fine */ }
}

/* ---- buttons, chips, badges ------------------------------------------------ */

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "primary" | "ghost" | "danger"; size?: "md" | "sm"; on?: boolean; icon?: ReactNode;
};
export function Button({ variant = "default", size = "md", on, icon, className, children, ...rest }: BtnProps) {
  return (
    <button type="button" {...rest}
      className={cx("vwnr-btn", variant !== "default" && variant, size === "sm" && "sm", on && "on", className)}>
      {icon}{children}
    </button>
  );
}

export function IconButton({ label, on, size = "md", className, children, ...rest }:
  ButtonHTMLAttributes<HTMLButtonElement> & { label: string; on?: boolean; size?: "md" | "sm" }) {
  return (
    <button type="button" aria-label={label} title={label} {...rest}
      className={cx("vwnr-icon-btn", on && "on", size === "sm" && "sm", className)}>{children}</button>
  );
}

export function Chip({ on, size = "md", tone, className, children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & {
  on?: boolean; size?: "md" | "sm"; tone?: "outline" | "dashed" | "accent";
}) {
  return (
    <button type="button" aria-pressed={on ?? undefined} {...rest}
      className={cx("vwnr-chip", size === "sm" && "sm", tone, className)}>{children}</button>
  );
}

export function Seg<T extends string>({ value, options, onChange, label }: {
  value: T; options: { value: T; label: ReactNode }[]; onChange: (v: T) => void; label: string;
}) {
  return (
    <div className="vwnr-seg" role="group" aria-label={label}>
      {options.map((o) => (
        <Chip key={o.value} on={o.value === value} onClick={() => onChange(o.value)}>{o.label}</Chip>
      ))}
    </div>
  );
}

export function Badge({ tone, children }: { tone?: "accent" | "success" | "danger" | "warning" | "info"; children: ReactNode }) {
  return <span className={cx("vwnr-badge", tone)}>{children}</span>;
}
export const Count = ({ n }: { n: number }) => <span className="vwnr-count">{n.toLocaleString()}</span>;
export const Dot = ({ off, tone }: { off?: boolean; tone?: "success" }) => <i className={cx("vwnr-dot", off && "off", tone)} />;
export const Kbd = ({ children }: { children: ReactNode }) => <kbd className="vwnr-kbd">{children}</kbd>;
export const Keys = ({ keys }: { keys: string[] }) => (
  <span className="vwnr-keys">{keys.map((k) => <Kbd key={k}>{k}</Kbd>)}</span>
);

/* ---- fields ------------------------------------------------------------------ */

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cx("vwnr-input", props.className)} />;
}
export function Switch({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children?: ReactNode }) {
  return (
    <label className="vwnr-switch">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span />{children}
    </label>
  );
}
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="vwnr-field"><span>{label}</span>{children}</label>;
}

/** The card-size slider: writes --vwnr-card-min (180 to 220 px by default) on its grid. */
export function CardSize({ value, onChange, min = 180, max = 220 }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <input className="vwnr-range" type="range" min={min} max={max} step={4} value={value}
      aria-label="Card size" title="Card size" onChange={(e) => onChange(Number(e.target.value))} />
  );
}

/* ---- tooltip ------------------------------------------------------------------- */

/** Hover or focus shows the tip below the child; Escape hides it. */
export function Tooltip({ tip, children }: { tip: ReactNode; children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [at, setAt] = useState<{ x: number; y: number } | null>(null);
  const show = () => {
    const r = ref.current?.getBoundingClientRect();
    if (r) setAt({ x: Math.min(r.left, window.innerWidth - 356), y: r.bottom + 6 });
  };
  useEffect(() => {
    if (!at) return undefined;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setAt(null); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [at]);
  return (
    <span ref={ref} onMouseEnter={show} onMouseLeave={() => setAt(null)} onFocus={show} onBlur={() => setAt(null)}
      style={{ display: "contents" }}>
      {children}
      {at ? createPortal(<div className="vwnr-tip" role="tooltip" style={{ left: at.x, top: at.y }}>{tip}</div>, document.body) : null}
    </span>
  );
}

/* ---- the two searches ------------------------------------------------------------ */

export function Search({ value, onChange, onSubmit, placeholder, inputRef }: {
  value: string; onChange: (v: string) => void; onSubmit?: (v: string) => void; placeholder: string;
  inputRef?: Ref<HTMLInputElement>;
}) {
  return (
    <label className="vwnr-search">
      <IconSearch size={16} />
      <input ref={inputRef} value={value} placeholder={placeholder} spellCheck={false}
        onChange={(e) => onChange(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") onSubmit?.(value); }} />
      {value ? <button type="button" className="vwnr-icon-btn" aria-label="Clear" onClick={() => onChange("")}><IconX size={14} /></button> : null}
    </label>
  );
}

export type ReadPart = { key: string; label: ReactNode; kind?: "filter" | "look" };

/** The Ask bar: circles icon, how-to tooltip, Enter or blur commits. The page parses the sentence into its own
    filters (its own vocabulary) and shows what it read with <ReadAs>. */
export function AskBar({ value, onChange, onCommit, onClear, placeholder, tip, active, inputRef }: {
  value: string; onChange: (v: string) => void; onCommit: (v: string) => void; onClear: () => void;
  placeholder: string; tip: ReactNode; active?: boolean; inputRef?: Ref<HTMLInputElement>;
}) {
  return (
    <Tooltip tip={tip}>
      <label className={cx("vwnr-search", "ask", active && "on")}>
        <IconAsk size={16} />
        <input ref={inputRef} value={value} placeholder={placeholder} spellCheck={false} aria-label="Ask"
          onChange={(e) => onChange(e.target.value)} onBlur={() => onCommit(value)}
          onKeyDown={(e) => { if (e.key === "Enter") onCommit(value); }} />
        {value ? <button type="button" className="vwnr-icon-btn" aria-label="Clear" onClick={onClear}><IconX size={14} /></button> : null}
      </label>
    </Tooltip>
  );
}

/** "Read as": what the Ask sentence became; clicking a chip drops that part. Looks (the leftover, searched by
    meaning) show dashed. */
export function ReadAs({ parts, onDrop, end }: { parts: ReadPart[]; onDrop: (key: string) => void; end?: ReactNode }) {
  if (!parts.length) return null;
  return (
    <div className="vwnr-readas">
      <span className="vwnr-small">Read as</span>
      {parts.map((p) => p.kind === "look"
        ? <Chip key={p.key} tone="dashed" size="sm" title="Searched by meaning">{p.label}</Chip>
        : <Chip key={p.key} on size="sm" title="Drop this part" onClick={() => onDrop(p.key)}>{p.label}<IconX size={12} /></Chip>)}
      {end}
    </div>
  );
}

export function Toolbar({ children, below }: { children: ReactNode; below?: ReactNode }) {
  return (
    <div className="vwnr-toolbar">
      <div className="vwnr-toolbar-row">{children}</div>
      {below}
    </div>
  );
}

/* ---- top bar: pinned pages by use, the rest in "All pages" ----------------------------- */

export type Page = { id: string; label: string; icon: ReactNode; key?: string; count?: number };

/** Visits per page, kept per viewer. The home page always comes first; the others by use, most used first. */
export function usePageOrder(pages: Page[], home: string, current: string, storeKey = "vwnr.pages") {
  const [uses, setUses] = useState<Record<string, number>>(() => load(storeKey, {}));
  useEffect(() => {
    setUses((u) => { const n = { ...u, [current]: (u[current] ?? 0) + 1 }; save(storeKey, n); return n; });
  }, [current, storeKey]);
  return useMemo(() => {
    const order = new Map(pages.map((p, i) => [p.id, i]));
    const rest = pages.filter((p) => p.id !== home)
      .sort((a, b) => (uses[b.id] ?? 0) - (uses[a.id] ?? 0) || order.get(a.id)! - order.get(b.id)!);
    const first = pages.find((p) => p.id === home);
    return first ? [first, ...rest] : rest;
  }, [pages, home, uses]);
}

export function TopBar({ brand, pages, current, onGo, end }: {
  brand: ReactNode; pages: Page[]; current: string; onGo: (id: string) => void; end?: ReactNode;
}) {
  const navRef = useRef<HTMLElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState(pages.length);
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);

  // How many pinned pages fit: measure every link once (hidden row), then fill the nav's width.
  const measure = useCallback(() => {
    const nav = navRef.current, row = measureRef.current;
    if (!nav || !row) return;
    const room = nav.clientWidth;
    const widths = Array.from(row.children).map((c) => (c as HTMLElement).offsetWidth + 2);
    let used = 0, n = 0;
    for (const w of widths) { if (used + w > room) break; used += w; n += 1; }
    setFit(Math.max(1, n));
  }, []);
  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (navRef.current) ro.observe(navRef.current);
    return () => ro.disconnect();
  }, [measure, pages]);

  useEffect(() => {
    if (!open) return undefined;
    const close = (e: Event) => { if (!(e.target as Element)?.closest?.(".vwnr-menu, .vwnr-allpages")) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("pointerdown", close);
    window.addEventListener("keydown", esc);
    return () => { window.removeEventListener("pointerdown", close); window.removeEventListener("keydown", esc); };
  }, [open]);

  const link = (p: Page) => (
    <a key={p.id} href={`#/${p.id}`} aria-current={p.id === current ? "page" : undefined}
      onClick={(e) => { e.preventDefault(); onGo(p.id); }}>
      {p.icon}<span>{p.label}</span>{p.count ? <span className="vwnr-count">{p.count.toLocaleString()}</span> : null}
    </a>
  );
  const r = btn.current?.getBoundingClientRect();
  return (
    <header className="vwnr-topbar">
      <span className="vwnr-brand">{brand}</span>
      <nav ref={navRef} className="vwnr-nav" aria-label="Pages" style={{ flex: "1 1 auto" }}>
        {pages.slice(0, fit).map(link)}
      </nav>
      <div ref={measureRef} className="vwnr-nav" aria-hidden="true"
        style={{ position: "absolute", visibility: "hidden", pointerEvents: "none", left: -9999 }}>
        {pages.map(link)}
      </div>
      <button ref={btn} type="button" className={cx("vwnr-btn", "ghost", "vwnr-allpages", open && "on")}
        aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen(!open)}>
        <IconMenu size={16} />All pages
      </button>
      <div className="vwnr-topbar-end">{end}</div>
      {open ? createPortal(
        <div className="vwnr-menu" role="menu" style={{ top: (r?.bottom ?? 48) + 6, left: r?.left ?? 0 }}>
          {pages.map((p) => (
            <button key={p.id} type="button" role="menuitem" className="vwnr-menu-item"
              aria-current={p.id === current ? "page" : undefined} onClick={() => { setOpen(false); onGo(p.id); }}>
              {p.icon}<span>{p.label}</span>{p.key ? <Keys keys={["G", p.key]} /> : null}
            </button>
          ))}
        </div>, document.body) : null}
    </header>
  );
}

/* ---- keyboard: G+letter, Ctrl+K, /, A, ?, 4 3 2 1 ----------------------------------- */

export type Shortcuts = {
  go?: Record<string, () => void>;     // letter -> page (after G)
  find?: () => void;                   // Ctrl+K
  search?: () => void;                 // /
  ask?: () => void;                    // A
  help?: () => void;                   // ?
  rate?: (n: 1 | 2 | 3 | 4) => void;   // 4 3 2 1
};

export function useShortcuts(s: Shortcuts) {
  const ref = useRef(s);
  ref.current = s;
  useEffect(() => {
    let g = 0;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = t?.closest?.("input, textarea, select, [contenteditable=true]");
      const k = ref.current;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); k.find?.(); return; }
      if (typing || e.ctrlKey || e.metaKey || e.altKey) return;
      if (g && Date.now() - g < 1200) {
        g = 0;
        const fn = k.go?.[e.key.toLowerCase()];
        if (fn) { e.preventDefault(); fn(); }
        return;
      }
      if (e.key === "g") { g = Date.now(); return; }
      if (e.key === "/") { e.preventDefault(); k.search?.(); return; }
      if (e.key === "a") { e.preventDefault(); k.ask?.(); return; }
      if (e.key === "?") { e.preventDefault(); k.help?.(); return; }
      if (k.rate && ["1", "2", "3", "4"].includes(e.key)) { e.preventDefault(); k.rate(Number(e.key) as 1 | 2 | 3 | 4); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}

export function KeySheet({ rows }: { rows: { keys: string[]; what: string }[] }) {
  return (
    <div className="vwnr-keysheet">
      {rows.map((r) => [<Keys key={`${r.what}-k`} keys={r.keys} />, <span key={`${r.what}-w`}>{r.what}</span>])}
    </div>
  );
}

/* ---- grid and cards ---------------------------------------------------------------- */

export function Grid({ cardMin, children, label }: { cardMin?: number; children: ReactNode; label?: string }) {
  return (
    <div className="vwnr-grid" role="list" aria-label={label}
      style={cardMin ? ({ "--vwnr-card-min": `${cardMin}px` } as CSSProperties) : undefined}>
      {children}
    </div>
  );
}

export function Card({ media, shape = "wide", title, meta, tag, score, actions, selected, onOpen }: {
  media?: ReactNode; shape?: "wide" | "poster" | "square"; title: ReactNode; meta?: ReactNode;
  tag?: ReactNode; score?: ReactNode; actions?: ReactNode; selected?: boolean; onOpen?: () => void;
}) {
  return (
    <div className="vwnr-card" role="listitem" tabIndex={0} aria-selected={selected || undefined}
      onClick={onOpen} onKeyDown={(e) => { if (e.key === "Enter") onOpen?.(); }}>
      <div className={cx("vwnr-card-media", shape !== "wide" && shape)}>
        {media}
        {tag ? <span className="vwnr-card-tag">{tag}</span> : null}
        {score ? <span className="vwnr-card-score">{score}</span> : null}
        {actions ? <div className="vwnr-card-actions" onClick={(e) => e.stopPropagation()}>{actions}</div> : null}
      </div>
      <div className="vwnr-card-body">
        <div className="vwnr-card-title">{title}</div>
        {meta ? <div className="vwnr-card-meta">{meta}</div> : null}
      </div>
    </div>
  );
}

/** Arrow keys move focus between the cards of a grid (row width read from the layout). */
export function useGridKeys(gridRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
      const cards = Array.from(el.querySelectorAll<HTMLElement>(".vwnr-card"));
      const i = cards.indexOf(document.activeElement as HTMLElement);
      if (i < 0) return;
      const top = cards[0].offsetTop;
      const perRow = Math.max(1, cards.filter((c) => c.offsetTop === top).length);
      const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -perRow, ArrowDown: perRow }[e.key]!;
      const next = cards[Math.min(cards.length - 1, Math.max(0, i + step))];
      e.preventDefault();
      next.focus();
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [gridRef]);
}

/* ---- states -------------------------------------------------------------------------- */

export function SkeletonGrid({ n = 12, shape = "wide" }: { n?: number; shape?: "wide" | "poster" | "square" }) {
  const ratio = shape === "poster" ? "2 / 3" : shape === "square" ? "1" : "16 / 9";
  return (
    <div className="vwnr-grid" aria-busy="true" aria-label="Loading">
      {Array.from({ length: n }, (_, i) => (
        <div key={i} className="vwnr-card" style={{ cursor: "default" }}>
          <div className="vwnr-skeleton" style={{ aspectRatio: ratio, borderRadius: 0 }} />
          <div className="vwnr-card-body"><div className="vwnr-skeleton line" style={{ width: "70%" }} /><div className="vwnr-skeleton line" style={{ width: "45%" }} /></div>
        </div>
      ))}
    </div>
  );
}

export const Spinner = () => <span className="vwnr-spinner" role="status" aria-label="Working" />;

export function Empty({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return <div className="vwnr-empty"><p>{children}</p>{action}</div>;
}

export function Alert({ tone = "danger", title, detail, onRetry }: {
  tone?: "danger" | "warning" | "info"; title: ReactNode; detail?: ReactNode; onRetry?: () => void;
}) {
  return (
    <div className={cx("vwnr-alert", tone !== "danger" && tone)} role={tone === "danger" ? "alert" : "status"}>
      {tone === "info" ? <IconInfo /> : <IconAlert />}
      <div className="vwnr-alert-body"><div>{title}</div>{detail ? <div className="vwnr-alert-detail">{detail}</div> : null}</div>
      {onRetry ? <Button size="sm" onClick={onRetry}>Retry</Button> : null}
    </div>
  );
}

export type ToastItem = { id: number; text: ReactNode; tone?: "error" | "success" | "info" };
export function Toasts({ items, onDismiss }: { items: ToastItem[]; onDismiss: (id: number) => void }) {
  return (
    <div className="vwnr-toasts" aria-live="polite">
      {items.map((t) => (
        <div key={t.id} className={cx("vwnr-toast", t.tone)}>
          {t.tone === "success" ? <IconCheck size={16} /> : null}
          <span style={{ flex: 1 }}>{t.text}</span>
          <IconButton label="Dismiss" size="sm" onClick={() => onDismiss(t.id)}><IconX size={14} /></IconButton>
        </div>
      ))}
    </div>
  );
}

/* ---- tabs, stats, rating -------------------------------------------------------------- */

export function Tabs<T extends string>({ value, tabs, onChange }: { value: T; tabs: { value: T; label: ReactNode }[]; onChange: (v: T) => void }) {
  return (
    <div className="vwnr-tabs" role="tablist">
      {tabs.map((t) => (
        <button key={t.value} type="button" role="tab" className="vwnr-tab" aria-selected={t.value === value}
          onClick={() => onChange(t.value)}>{t.label}</button>
      ))}
    </div>
  );
}

export function Stats({ items }: { items: { label: ReactNode; value: ReactNode }[] }) {
  return (
    <dl className="vwnr-stats">
      {items.map((s, i) => <div key={i}><dt>{s.label}</dt><dd>{s.value}</dd></div>)}
    </dl>
  );
}

/** 4 3 2 1: the review keys. Labels are the page's own (e.g. Great / Good / Meh / No). */
export function Rating({ value, labels, onRate }: { value?: 1 | 2 | 3 | 4; labels: [string, string, string, string]; onRate: (n: 1 | 2 | 3 | 4) => void }) {
  return (
    <div className="vwnr-rating" role="group" aria-label="Rate">
      {([4, 3, 2, 1] as const).map((n, i) => (
        <button key={n} type="button" aria-pressed={value === n} onClick={() => onRate(n)}>
          <Kbd>{n}</Kbd>{labels[i]}
        </button>
      ))}
    </div>
  );
}
