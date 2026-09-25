// vaultsqware React components. Thin, typed wrappers over the classes in
// vaultsqware.css + components.css: load both stylesheets once at app root.
import * as React from "react";
import {
  IconCheck, IconChevronRight, IconClose, IconMinimize, IconMaximize, IconRestore,
  IconSearch, IconFolder, IconInfo, IconCheckCircle, IconAlertTriangle, IconAlertCircle,
  IconChevronLeft, IconChevronUp, IconLoader, IconUpload, IconStop, IconCopy,
} from "../icons/react";

export * from "../icons/react";

type Div = React.HTMLAttributes<HTMLDivElement>;
type Tone = "online" | "relay" | "warning" | "alert" | "sync" | "idle";
const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(" ");

/* ---------------------------------------------------------------- shells */

/** Full-window app frame: titlebar, signal strip, warm rail + console main, status bar. */
export function AppShell({ titlebar, signal, rail, statusbar, children, className, ...rest }:
  Div & { titlebar?: React.ReactNode; signal?: React.ReactNode; rail?: React.ReactNode; statusbar?: React.ReactNode }) {
  return (
    <div className={cx("vwsq-app vwsq-console-shell", className)} {...rest}>
      {titlebar}{signal}
      <div className="vwsq-shell">{rail}<main className="vwsq-main">{children}</main></div>
      {statusbar}
    </div>
  );
}

export const Surface = ({ className, ...p }: Div) => <div className={cx("vwsq-surface", className)} {...p} />;
export const Card = ({ className, ...p }: Div) => <div className={cx("vwsq-card", className)} {...p} />;
export const Panel = ({ className, ...p }: Div) => <div className={cx("vwsq-panel", className)} {...p} />;
export const WarmCard = ({ className, ...p }: Div) => <div className={cx("vwsq-warm-card", className)} {...p} />;
export const SectionTitle = ({ className, ...p }: React.HTMLAttributes<HTMLHeadingElement>) => <h3 className={cx("vwsq-section-title", className)} {...p} />;

/* ---------------------------------------------------------------- window chrome */

export function Titlebar({ mark, sub, path, maximized, onMinimize, onMaximize, onClose }: {
  mark: string; sub?: string; path?: string; maximized?: boolean;
  onMinimize?: () => void; onMaximize?: () => void; onClose?: () => void;
}) {
  return (
    <header className="vwsq-titlebar">
      <div className="vwsq-titlebar__brand">
        <span className="vwsq-titlebar__mark">{mark}</span>
        {sub && <span className="vwsq-titlebar__sub">{sub}</span>}
      </div>
      <div className="vwsq-titlebar__meta">{path && <span className="vwsq-titlebar__path">{path}</span>}</div>
      {(onMinimize || onMaximize || onClose) && (
        <div className="vwsq-titlebar__controls">
          {onMinimize && <button className="vwsq-winbtn" aria-label="Minimize" onClick={onMinimize}><IconMinimize /></button>}
          {onMaximize && <button className="vwsq-winbtn" aria-label={maximized ? "Restore" : "Maximize"} onClick={onMaximize}>{maximized ? <IconRestore /> : <IconMaximize />}</button>}
          {onClose && <button className="vwsq-winbtn vwsq-winbtn--close" aria-label="Close" onClick={onClose}><IconClose /></button>}
        </div>
      )}
    </header>
  );
}

export const SignalStrip = ({ state = "idle" }: { state?: "idle" | "busy" | "ok" | "fail" }) =>
  <div className={cx("vwsq-signalstrip", state !== "idle" && `vwsq-signalstrip--${state}`)} role="presentation" />;

export const StatusBar = ({ className, ...p }: Div) => <footer className={cx("vwsq-statusbar", className)} {...p} />;
export const StatusBarItem = ({ className, ...p }: React.HTMLAttributes<HTMLSpanElement>) => <span className={cx("vwsq-statusbar__item", className)} {...p} />;
export const StatusBarSpacer = () => <span className="vwsq-statusbar__spacer" />;

/* ---------------------------------------------------------------- warm rail */

export function Rail({ search, actions, footer, children, className, ...rest }:
  React.HTMLAttributes<HTMLElement> & { search?: React.ReactNode; actions?: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <nav className={cx("vwsq-warm-rail vwsq-rail", className)} {...rest}>
      {search}
      {actions && <div className="vwsq-rail__actions">{actions}</div>}
      <div className="vwsq-rail__tree">{children}</div>
      {footer}
    </nav>
  );
}

export function RailSearch({ shortcut = "Ctrl K", className, ...input }: React.InputHTMLAttributes<HTMLInputElement> & { shortcut?: string }) {
  return (
    <div className="vwsq-rail__search">
      <IconSearch />
      <input type="search" className={cx("vwsq-rail__filter", className)} {...input} />
      {shortcut && <kbd className="vwsq-kbd">{shortcut}</kbd>}
    </div>
  );
}

export const RailFooter = ({ children, count }: { children?: React.ReactNode; count?: React.ReactNode }) =>
  <div className="vwsq-rail__foot">{children}{count != null && <span className="vwsq-rail__count">{count}</span>}</div>;

export function NavGroup({ label, count, spine, open, onToggle, children }: {
  label: string; count?: number; spine?: number | string; open?: boolean; onToggle?: () => void; children?: React.ReactNode;
}) {
  const style = spine != null ? ({ "--spine": typeof spine === "number" ? `var(--vwsq-spine-${spine})` : spine } as React.CSSProperties) : undefined;
  return (
    <div className={cx("vwsq-navgroup", open && "vwsq-navgroup--open")} style={style}>
      <button className="vwsq-navgroup__head" aria-expanded={!!open} onClick={onToggle}>
        <IconChevronRight className="vwsq-navgroup__chevron" size={10} />
        <span className="vwsq-navgroup__label">{label}</span>
        {count != null && <span className="vwsq-count">{count}</span>}
      </button>
      <div className="vwsq-navgroup__items">{children}</div>
    </div>
  );
}

export function NavItem({ icon, active, dot, children, className, ...rest }:
  React.ButtonHTMLAttributes<HTMLButtonElement> & { icon?: React.ReactNode; active?: boolean; dot?: "alert" | "warning" }) {
  return (
    <button className={cx("vwsq-navitem", active && "vwsq-navitem--active", className)} aria-current={active ? "page" : undefined} {...rest}>
      {icon}
      <span className="vwsq-navitem__name">{children}</span>
      {dot && <span className={`vwsq-navitem__dot vwsq-navitem__dot--${dot}`} />}
    </button>
  );
}

export const Count = ({ children, iris }: { children: React.ReactNode; iris?: boolean }) =>
  <span className={cx("vwsq-count", iris && "vwsq-count--iris")}>{children}</span>;

export function JobList({ title = "Jobs", children }: { title?: string; children?: React.ReactNode }) {
  const n = React.Children.count(children);
  return (
    <section className="vwsq-jobs">
      <div className="vwsq-jobs__title">{title}{n > 0 && <Count iris>{n}</Count>}</div>
      <div className="vwsq-jobs__list">{children}</div>
    </section>
  );
}

export function Job({ name, meta, signal = "sync", live = true, watching, onStop, onClick }: {
  name: string; meta?: string; signal?: Tone; live?: boolean; watching?: boolean; onStop?: () => void; onClick?: () => void;
}) {
  return (
    <div className={cx("vwsq-job", watching && "vwsq-job--watching")} onClick={onClick}>
      <Led signal={signal} live={live} />
      <div className="vwsq-job__body"><div className="vwsq-job__name">{name}</div>{meta && <div className="vwsq-job__meta">{meta}</div>}</div>
      {onStop && <button className="vwsq-job__stop" aria-label={`Stop ${name}`} onClick={(e) => { e.stopPropagation(); onStop(); }}><IconStop /></button>}
    </div>
  );
}

export function Drawer({ icon, title, open, onToggle, children }: {
  icon?: React.ReactNode; title: string; open?: boolean; onToggle?: () => void; children?: React.ReactNode;
}) {
  return (
    <section className={cx("vwsq-drawer", open && "vwsq-drawer--open")}>
      {open && <div className="vwsq-drawer__body">{children}</div>}
      <button className="vwsq-drawer__head" aria-expanded={!!open} onClick={onToggle}>
        {icon}<span className="vwsq-drawer__title">{title}</span>
        <IconChevronUp className="vwsq-drawer__chevron" />
      </button>
    </section>
  );
}

export const SettingGroup = ({ children }: { children: React.ReactNode }) => <div className="vwsq-setting__group">{children}</div>;
export const Setting = ({ hint, disabled, children }: { hint?: React.ReactNode; disabled?: boolean; children: React.ReactNode }) =>
  <div className={cx("vwsq-setting", disabled && "vwsq-setting--disabled")}>{children}{hint && <p className="vwsq-setting__hint">{hint}</p>}</div>;

/* ---------------------------------------------------------------- buttons */

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "primary" | "danger" | "quiet" | "warm"; size?: "sm" | "md" | "lg";
  icon?: React.ReactNode; block?: boolean; loading?: boolean;
};
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "default", size = "md", icon, block, loading, className, children, disabled, ...rest }, ref) {
  return (
    <button ref={ref} disabled={disabled || loading} className={cx("vwsq-btn", variant !== "default" && `vwsq-btn--${variant}`,
      size !== "md" && `vwsq-btn--${size}`, block && "vwsq-btn--block", className)} {...rest}>
      {loading ? <Spinner /> : icon}{children}
    </button>
  );
});

export const IconButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: React.ReactNode; label: string; quiet?: boolean; active?: boolean; tipPos?: "top" | "bottom" | "right";
}>(function IconButton({ icon, label, quiet, active, tipPos, className, ...rest }, ref) {
  return (
    <button ref={ref} aria-label={label} data-tip={label} data-tip-pos={tipPos}
      className={cx("vwsq-iconbtn", quiet && "vwsq-iconbtn--quiet", active && "vwsq-iconbtn--active", className)} {...rest}>{icon}</button>
  );
});

/* ---------------------------------------------------------------- form */

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { mono?: boolean };
export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ mono, className, ...p }, ref) =>
  <input ref={ref} className={cx("vwsq-input", mono && "vwsq-input--mono", className)} {...p} />);
export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { mono?: boolean }>(
  ({ mono, className, ...p }, ref) => <textarea ref={ref} className={cx("vwsq-input", mono && "vwsq-input--mono", className)} {...p} />);
export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...p }, ref) => <select ref={ref} className={cx("vwsq-input", className)} {...p} />);

export function SearchField({ shortcut, className, ...p }: InputProps & { shortcut?: string }) {
  return <div className={cx("vwsq-search", className)}><IconSearch /><Input type="search" {...p} />{shortcut && <kbd className="vwsq-kbd">{shortcut}</kbd>}</div>;
}

/** Label + control + description + validation message. */
export function Field({ label, required, type, alias, description, error, warning, children, className }: {
  label: React.ReactNode; required?: boolean; type?: string; alias?: string; description?: React.ReactNode;
  error?: React.ReactNode; warning?: React.ReactNode; children: React.ReactNode; className?: string;
}) {
  return (
    <label className={cx("vwsq-field", error ? "vwsq-field--invalid" : warning ? "vwsq-field--warn" : "", className)}>
      <span className="vwsq-field__label">
        {label}{required && <span className="vwsq-field__req">*</span>}
        {type && <span className="vwsq-field__type">{type}</span>}
        {alias && <span className="vwsq-field__type">{alias}</span>}
      </span>
      {children}
      {description && <span className="vwsq-field__desc">{description}</span>}
      {error ? <span className="vwsq-field__msg vwsq-field__msg--error">{error}</span>
        : warning ? <span className="vwsq-field__msg vwsq-field__msg--warn">{warning}</span> : null}
    </label>
  );
}

/** Text input with an embedded picker button (paths, colours, dates…). */
export function PickerInput({ onPick, pickIcon = <IconFolder />, pickLabel = "Browse", ...p }: InputProps & {
  onPick: () => void; pickIcon?: React.ReactNode; pickLabel?: string;
}) {
  return <span className="vwsq-field__wrap"><Input {...p} /><button type="button" className="vwsq-field__pick" aria-label={pickLabel} data-tip={pickLabel} onClick={onPick}>{pickIcon}</button></span>;
}

export function Toggle({ label, checked, onChange, disabled }: { label?: React.ReactNode; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <label className="vwsq-toggle">
      <input type="checkbox" role="switch" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
      <span className="vwsq-toggle__track"><span className="vwsq-toggle__thumb" /></span>
      {label && <span className="vwsq-toggle__label">{label}</span>}
    </label>
  );
}

export function Checkbox({ checked, onChange, disabled, children }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean; children?: React.ReactNode }) {
  return (
    <label className="vwsq-check">
      <input type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
      <span className="vwsq-check__box"><IconCheck /></span>{children}
    </label>
  );
}

export interface RadioOption<T extends string> { value: T; label: React.ReactNode; hint?: React.ReactNode }
export function RadioGroup<T extends string>({ name, value, onChange, options }: { name: string; value: T; onChange: (v: T) => void; options: RadioOption<T>[] }) {
  return (
    <div className="vwsq-radios" role="radiogroup">
      {options.map((o) => (
        <label key={o.value} className="vwsq-radio">
          <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} />
          <span className="vwsq-radio__dot" />
          <span className="vwsq-radio__body"><span className="vwsq-radio__label">{o.label}</span>{o.hint && <span className="vwsq-radio__hint">{o.hint}</span>}</span>
        </label>
      ))}
    </div>
  );
}

export const Slider = ({ className, ...p }: React.InputHTMLAttributes<HTMLInputElement>) => <input type="range" className={cx("vwsq-slider", className)} {...p} />;

export function TagInput({ value, onChange, placeholder = "Add…" }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [draft, setDraft] = React.useState("");
  const add = () => { const t = draft.trim(); if (t && !value.includes(t)) onChange([...value, t]); setDraft(""); };
  return (
    <div className="vwsq-tags">
      {value.map((t) => (
        <span key={t} className="vwsq-tag">{t}
          <button type="button" className="vwsq-tag__x" aria-label={`Remove ${t}`} onClick={() => onChange(value.filter((x) => x !== t))}><IconClose /></button>
        </span>
      ))}
      <input className="vwsq-tags__input" value={draft} placeholder={placeholder} onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } else if (e.key === "Backspace" && !draft && value.length) onChange(value.slice(0, -1)); }}
        onBlur={add} />
    </div>
  );
}

export function DropZone({ onFiles, children = "Drop files here or click to browse", accept, multiple = true }: {
  onFiles: (files: File[]) => void; children?: React.ReactNode; accept?: string; multiple?: boolean;
}) {
  const [over, setOver] = React.useState(false);
  const input = React.useRef<HTMLInputElement>(null);
  return (
    <div className={cx("vwsq-dropzone", over && "vwsq-dropzone--over")} role="button" tabIndex={0}
      onClick={() => input.current?.click()} onKeyDown={(e) => e.key === "Enter" && input.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); onFiles(Array.from(e.dataTransfer.files)); }}>
      <IconUpload />{children}
      <input ref={input} type="file" hidden accept={accept} multiple={multiple} onChange={(e) => onFiles(Array.from(e.target.files ?? []))} />
    </div>
  );
}

/* ---------------------------------------------------------------- in-view navigation */

export interface TabItem<T extends string> { id: T; label: React.ReactNode; icon?: React.ReactNode }
export function Tabs<T extends string>({ tabs, value, onChange }: { tabs: TabItem<T>[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="vwsq-tabs" role="tablist">
      {tabs.map((t) => (
        <button key={t.id} role="tab" aria-selected={t.id === value} className={cx("vwsq-tab", t.id === value && "vwsq-tab--active")} onClick={() => onChange(t.id)}>{t.icon}{t.label}</button>
      ))}
    </div>
  );
}

export function Segmented<T extends string>({ options, value, onChange }: { options: TabItem<T>[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="vwsq-segmented" role="radiogroup">
      {options.map((o) => (
        <button key={o.id} role="radio" aria-checked={o.id === value} className={cx("vwsq-segmented__opt", o.id === value && "vwsq-segmented__opt--active")} onClick={() => onChange(o.id)}>{o.icon}{o.label}</button>
      ))}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: Array<{ label: React.ReactNode; href?: string; onClick?: () => void }> }) {
  return (
    <nav className="vwsq-breadcrumbs" aria-label="Breadcrumb">
      {items.map((it, i) => {
        const last = i === items.length - 1;
        return (
          <React.Fragment key={i}>
            {last ? <span className="vwsq-breadcrumbs__current" aria-current="page">{it.label}</span>
              : <a href={it.href ?? "#"} onClick={it.onClick && ((e) => { e.preventDefault(); it.onClick!(); })}>{it.label}</a>}
            {!last && <IconChevronRight />}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

export function Pagination({ page, pages, onChange }: { page: number; pages: number; onChange: (p: number) => void }) {
  const nums: Array<number | "…"> = [];
  for (let p = 1; p <= pages; p++) {
    if (p === 1 || p === pages || Math.abs(p - page) <= 1) nums.push(p);
    else if (nums[nums.length - 1] !== "…") nums.push("…");
  }
  return (
    <nav className="vwsq-pagination" aria-label="Pagination">
      <IconButton quiet icon={<IconChevronLeft />} label="Previous page" disabled={page <= 1} onClick={() => onChange(page - 1)} />
      {nums.map((n, i) => n === "…" ? <span key={`e${i}`} className="vwsq-pagination__page" style={{ cursor: "default" }}>…</span> :
        <button key={n} className={cx("vwsq-pagination__page", n === page && "vwsq-pagination__page--active")} aria-current={n === page ? "page" : undefined} onClick={() => onChange(n)}>{n}</button>)}
      <IconButton quiet icon={<IconChevronRight />} label="Next page" disabled={page >= pages} onClick={() => onChange(page + 1)} />
    </nav>
  );
}

export const Toolbar = ({ className, ...p }: Div) => <div role="toolbar" className={cx("vwsq-toolbar", className)} {...p} />;
export const ToolbarSeparator = () => <span className="vwsq-toolbar__sep" role="separator" />;
export const ToolbarSpacer = () => <span className="vwsq-toolbar__spacer" />;

export const Link = ({ className, ...p }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a className={cx("vwsq-link", className)} {...p} />;
export const Kbd = ({ children }: { children: React.ReactNode }) => <kbd className="vwsq-kbd">{children}</kbd>;

/* ---------------------------------------------------------------- display */

export const Led = ({ signal = "idle", live }: { signal?: Tone; live?: boolean }) =>
  <span className={cx("vwsq-led", live && "vwsq-led--live")} style={signal === "idle" ? undefined : { background: `var(--vwsq-signal-${signal})` }} aria-hidden="true" />;

export const Chip = ({ tone, children }: { tone?: "alert" | "warning"; children: React.ReactNode }) =>
  <span className={cx("vwsq-chip", tone && `vwsq-chip--${tone}`)}>{children}</span>;

export const Badge = ({ tone, led, children }: { tone?: Exclude<Tone, "idle"> | "iris"; led?: boolean; children: React.ReactNode }) =>
  <span className={cx("vwsq-badge", tone && `vwsq-badge--${tone}`)}>{led && <span className="vwsq-led vwsq-led--live" />}{children}</span>;

export function Avatar({ name, src, size = "md" }: { name: string; src?: string; size?: "sm" | "md" | "lg" }) {
  const initials = name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("");
  return <span className={cx("vwsq-avatar", size !== "md" && `vwsq-avatar--${size}`)} title={name}>{src ? <img src={src} alt="" /> : initials}</span>;
}

export function Stat({ label, value, delta, trend }: { label: string; value: React.ReactNode; delta?: React.ReactNode; trend?: "up" | "down" }) {
  return (
    <div className="vwsq-stat">
      <span className="vwsq-stat__label">{label}</span>
      <span className="vwsq-stat__value">{value}</span>
      {delta && <span className={cx("vwsq-stat__delta", trend && `vwsq-stat__delta--${trend}`)}>{delta}</span>}
    </div>
  );
}

export const KeyValue = ({ items }: { items: Array<[React.ReactNode, React.ReactNode]> }) =>
  <dl className="vwsq-kv">{items.map(([k, v], i) => <React.Fragment key={i}><dt>{k}</dt><dd>{v}</dd></React.Fragment>)}</dl>;

export const Divider = () => <hr className="vwsq-divider" />;

export function Tooltip({ tip, pos, children }: { tip: string; pos?: "top" | "bottom" | "right"; children: React.ReactNode }) {
  return <span data-tip={tip} data-tip-pos={pos} style={{ display: "inline-flex" }}>{children}</span>;
}

/* ---------------------------------------------------------------- data */

export interface Column<R> { key: string; label: React.ReactNode; align?: "left" | "right"; mono?: boolean; width?: number | string; render?: (row: R) => React.ReactNode }
export function Table<R>({ columns, rows, rowKey, selected, onRowClick }: {
  columns: Column<R>[]; rows: R[]; rowKey: (r: R) => string; selected?: string; onRowClick?: (r: R) => void;
}) {
  return (
    <table className="vwsq-table">
      <thead><tr>{columns.map((c) => <th key={c.key} style={{ width: c.width, textAlign: c.align }}>{c.label}</th>)}</tr></thead>
      <tbody>
        {rows.map((r) => {
          const k = rowKey(r);
          return (
            <tr key={k} className={cx(k === selected && "vwsq-table__row--selected")} onClick={onRowClick && (() => onRowClick(r))} style={onRowClick ? { cursor: "pointer" } : undefined}>
              {columns.map((c) => (
                <td key={c.key} className={cx(c.align === "right" && "vwsq-table__num", c.mono && "vwsq-table__mono")}>
                  {c.render ? c.render(r) : String((r as Record<string, unknown>)[c.key] ?? "")}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export const List = ({ className, ...p }: Div) => <div className={cx("vwsq-list", className)} {...p} />;
export function ListRow({ name, meta, trailing, onClick }: { name: React.ReactNode; meta?: React.ReactNode; trailing?: React.ReactNode; onClick?: () => void }) {
  return <div className="vwsq-row" onClick={onClick} role={onClick ? "button" : undefined} tabIndex={onClick ? 0 : undefined}>
    <span className="vwsq-row__name">{name}</span><span className="vwsq-row__meta">{meta}</span>{trailing}
  </div>;
}

export function CodeLine({ children, copyable = true }: { children: string; copyable?: boolean }) {
  return (
    <div className="vwsq-codeline">
      <code className="vwsq-codeline__text">{children}</code>
      {copyable && <IconButton quiet icon={<IconCopy />} label="Copy" onClick={() => navigator.clipboard?.writeText(children)} />}
    </div>
  );
}

export function Accordion({ title, defaultOpen, children }: { title: React.ReactNode; defaultOpen?: boolean; children: React.ReactNode }) {
  return <details className="vwsq-accordion" open={defaultOpen}><summary><IconChevronRight />{title}</summary><div className="vwsq-accordion__body">{children}</div></details>;
}

/* ---------------------------------------------------------------- run + output */

export function RunBar({ status, statusText, children }: { status?: "ok" | "fail" | "busy"; statusText?: React.ReactNode; children?: React.ReactNode }) {
  return <div className="vwsq-runbar">
    {statusText && <span className={cx("vwsq-runbar__status", status && `vwsq-runbar__status--${status}`)}>{statusText}</span>}
    <span className="vwsq-runbar__spacer" />{children}
  </div>;
}

export function Console({ title = "Output", source, live, tools, children, bodyRef }: {
  title?: string; source?: string; live?: boolean; tools?: React.ReactNode; children?: React.ReactNode; bodyRef?: React.Ref<HTMLPreElement>;
}) {
  return (
    <section className="vwsq-console">
      <div className="vwsq-console__head">
        <span className="vwsq-section-title">{title}{source && <Badge tone="iris">{source}</Badge>}</span>
        <div className="vwsq-console__tools">{live && <span className="vwsq-console__live">Live</span>}{tools}</div>
      </div>
      <pre ref={bodyRef} className="vwsq-console__body">{children}</pre>
    </section>
  );
}

/* ---------------------------------------------------------------- feedback */

const toneIcon = { info: <IconInfo />, success: <IconCheckCircle />, warning: <IconAlertTriangle />, error: <IconAlertCircle /> };
type FeedbackTone = keyof typeof toneIcon;

export function Alert({ tone = "info", title, children }: { tone?: FeedbackTone; title?: React.ReactNode; children?: React.ReactNode }) {
  return <div className={`vwsq-alert vwsq-alert--${tone}`} role={tone === "error" ? "alert" : "status"}>
    {toneIcon[tone]}<div>{title && <div className="vwsq-alert__title">{title}</div>}<div className="vwsq-alert__body">{children}</div></div>
  </div>;
}

export function Progress({ value, tone, indeterminate, label }: { value?: number; tone?: "online" | "alert"; indeterminate?: boolean; label?: string }) {
  return <div className={cx("vwsq-progress", tone && `vwsq-progress--${tone}`, indeterminate && "vwsq-progress--indeterminate")}
    role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={indeterminate ? undefined : value}>
    <div className="vwsq-progress__bar" style={{ "--value": `${Math.max(0, Math.min(100, value ?? 0))}%` } as React.CSSProperties} />
  </div>;
}

export const Spinner = ({ size = 16 }: { size?: number }) => <IconLoader className="vwsq-spinner" size={size} />;
export const Skeleton = ({ width = "100%", height = 12 }: { width?: number | string; height?: number | string }) =>
  <div className="vwsq-skeleton" style={{ width, height }} aria-hidden="true" />;

export function EmptyState({ icon, mark, title, children, action }: { icon?: React.ReactNode; mark?: string; title: React.ReactNode; children?: React.ReactNode; action?: React.ReactNode }) {
  return <div className="vwsq-empty">
    {mark ? <div className="vwsq-empty__mark">{mark}</div> : icon}
    <div className="vwsq-empty__title">{title}</div>
    {children && <p className="vwsq-empty__body">{children}</p>}
    {action}
  </div>;
}

/* ---------------------------------------------------------------- overlays */

export interface ToastItem { id: number; tone: FeedbackTone; message: React.ReactNode }
/** const { toasts, push, dismiss } = useToasts(); <Toasts items={toasts} onDismiss={dismiss} /> */
export function useToasts(timeout = 4200) {
  const [toasts, set] = React.useState<ToastItem[]>([]);
  const dismiss = React.useCallback((id: number) => set((t) => t.filter((x) => x.id !== id)), []);
  const push = React.useCallback((message: React.ReactNode, tone: FeedbackTone = "info") => {
    const id = Date.now() + Math.random();
    set((t) => [...t, { id, tone, message }]);
    if (timeout > 0) setTimeout(() => dismiss(id), timeout);
  }, [dismiss, timeout]);
  return { toasts, push, dismiss };
}
export function Toast({ tone = "info", children, onClick }: { tone?: FeedbackTone; children: React.ReactNode; onClick?: () => void }) {
  return <div className={`vwsq-toast vwsq-toast--${tone}`} role="status" onClick={onClick}>{toneIcon[tone]}<span>{children}</span></div>;
}
export const Toasts = ({ items, onDismiss }: { items: ToastItem[]; onDismiss?: (id: number) => void }) =>
  <div className="vwsq-toasts" aria-live="polite">{items.map((t) => <Toast key={t.id} tone={t.tone} onClick={() => onDismiss?.(t.id)}>{t.message}</Toast>)}</div>;

function useEscape(open: boolean, onClose?: () => void) {
  React.useEffect(() => {
    if (!open || !onClose) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
}

export function Modal({ open, onClose, title, size = "md", footer, children }: {
  open: boolean; onClose?: () => void; title: React.ReactNode; size?: "sm" | "md" | "wide"; footer?: React.ReactNode; children?: React.ReactNode;
}) {
  useEscape(open, onClose);
  if (!open) return null;
  return (
    <div className="vwsq-modal-host" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className={cx("vwsq-modal", size !== "md" && `vwsq-modal--${size}`)} role="dialog" aria-modal="true">
        <div className="vwsq-modal__head"><span className="vwsq-modal__title">{title}</span>{onClose && <IconButton quiet icon={<IconClose />} label="Close" onClick={onClose} />}</div>
        <div className="vwsq-modal__body">{children}</div>
        {footer && <div className="vwsq-modal__foot">{footer}</div>}
      </div>
    </div>
  );
}

export function Sheet({ open, onClose, title, footer, children }: { open: boolean; onClose?: () => void; title: React.ReactNode; footer?: React.ReactNode; children?: React.ReactNode }) {
  useEscape(open, onClose);
  if (!open) return null;
  return (
    <aside className="vwsq-sheet" role="dialog" aria-modal="true">
      <div className="vwsq-modal__head"><span className="vwsq-modal__title">{title}</span>{onClose && <IconButton quiet icon={<IconClose />} label="Close" onClick={onClose} />}</div>
      <div className="vwsq-modal__body">{children}</div>
      {footer && <div className="vwsq-modal__foot">{footer}</div>}
    </aside>
  );
}

export type MenuEntry = "separator" | { heading: string } | { label: React.ReactNode; icon?: React.ReactNode; shortcut?: string; danger?: boolean; onSelect: () => void };
/** Context / dropdown menu. Pass x/y for a fixed-position context menu, or omit them to render inline. */
export function Menu({ items, x, y, onClose }: { items: MenuEntry[]; x?: number; y?: number; onClose?: () => void }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const floating = x != null && y != null;
  useEscape(true, onClose);
  React.useEffect(() => {
    if (!floating || !onClose) return;
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) onClose(); };
    window.addEventListener("mousedown", h);
    return () => window.removeEventListener("mousedown", h);
  }, [floating, onClose]);
  return (
    <div ref={ref} role="menu" className={cx("vwsq-menu", !floating && "vwsq-menu--static")} style={floating ? { left: x, top: y } : undefined}>
      {items.map((it, i) => it === "separator" ? <div key={i} className="vwsq-menu__sep" role="separator" />
        : "heading" in it ? <div key={i} className="vwsq-menu__label">{it.heading}</div>
        : <button key={i} role="menuitem" className={cx("vwsq-menu__item", it.danger && "vwsq-menu__item--danger")} onClick={() => { it.onSelect(); onClose?.(); }}>
            {it.icon}{it.label}{it.shortcut && <kbd className="vwsq-kbd">{it.shortcut}</kbd>}
          </button>)}
    </div>
  );
}
