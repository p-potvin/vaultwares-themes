"""vaultnoir tokens: neutrals, signals and the five accents, in dark and light, each checked against WCAG AA.

Writes ``../tokens.css`` and ``../tokens.json`` and prints the contrast table that TOKENS.md quotes.

    python tools/build_tokens.py

Rules (operator, Sun, 22 Nov 2026 — vaultnoir design contract):
  * text >= 4.5:1, UI marks and the focus ring >= 3:1, on the worst surface each one sits on (surface-3);
  * the accent fill takes a white label when a small darkening (<= MAX_SHIFT lightness) gets it to 4.5:1,
    otherwise a near-black label;
  * the operator's hex is kept wherever it already passes.
"""

from __future__ import annotations

import colorsys
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

NEUTRALS = {
    "dark": {
        "bg": "#0a0b0e", "surface": "#111318", "surface-2": "#171a20", "surface-3": "#1e222a",
        "line": "#242831", "line-2": "#2f3440",
        "text": "#e8eaef", "muted": "#8d93a0", "faint": "#5c626e",
        "focus": "#8ab4ff", "scrim": "rgba(10, 11, 14, 0.72)", "shadow": "0 12px 40px rgba(0, 0, 0, 0.5)",
        "media": "#050506", "media-scrim": "rgba(10, 11, 14, 0.72)", "on-media": "#e8eaef",
    },
    "light": {
        "bg": "#f4f5f7", "surface": "#ffffff", "surface-2": "#eef0f3", "surface-3": "#e5e8ed",
        "line": "#dadde3", "line-2": "#c3c8d1",
        "text": "#111318", "muted": "#555b67", "faint": "#8a909c",
        "focus": "#2f6fe0", "scrim": "rgba(244, 245, 247, 0.78)", "shadow": "0 12px 32px rgba(17, 19, 24, 0.14)",
        "media": "#0a0b0e", "media-scrim": "rgba(10, 11, 14, 0.72)", "on-media": "#e8eaef",
    },
}
SIGNALS = {"success": "#3fd996", "danger": "#ff7a6b", "warning": "#f5b851", "info": "#8ab4ff"}
ACCENTS = {"red": "#ff3b4e", "sky": "#27b6f2", "violet": "#9070cc", "pink": "#e0529b", "amber": "#f0a63a"}
LABEL_DARK = "#0a0b0e"
MAX_SHIFT = 0.17   # how far the fill may darken to keep a white label (red: #ff3b4e -> #ea0013)


def rgb(h: str) -> tuple[float, float, float]:
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))  # type: ignore[return-value]


def hexs(c: tuple[float, float, float]) -> str:
    return "#" + "".join(f"{round(max(0, min(1, v)) * 255):02x}" for v in c)


def lum(h: str) -> float:
    def ch(v: float) -> float:
        return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = (ch(v) for v in rgb(h))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def ratio(a: str, b: str) -> float:
    la, lb = sorted((lum(a), lum(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


def shift(h: str, dl: float) -> str:
    hh, ll, ss = colorsys.rgb_to_hls(*rgb(h))
    return hexs(colorsys.hls_to_rgb(hh, max(0.0, min(1.0, ll + dl)), ss))


def reach(h: str, against: str, target: float, direction: int) -> str:
    """The nearest lightness step of ``h`` (lighter: +1, darker: -1) with ``target`` contrast on ``against``."""
    c = h
    for _ in range(100):
        if ratio(c, against) >= target:
            return c
        c = shift(c, 0.01 * direction)
    return c


def mix(a: str, b: str, t: float) -> str:
    """t of ``a`` over ``b``."""
    return hexs(tuple(x * t + y * (1 - t) for x, y in zip(rgb(a), rgb(b))))


def rgba(h: str, a: float) -> str:
    r, g, b = (round(v * 255) for v in rgb(h))
    return f"rgba({r}, {g}, {b}, {a})"


def accent_set(base: str, mode: str) -> dict[str, str]:
    n = NEUTRALS[mode]
    d = 1 if mode == "dark" else -1          # towards more contrast on this mode's surfaces
    worst = n["surface-3"]
    mark = reach(base, worst, 3.0, d)
    text = reach(base, worst, 4.5, d)
    fill, label = base, "#ffffff"
    if ratio(fill, "#ffffff") < 4.5:
        darker = reach(base, "#ffffff", 4.5, -1)
        shifted = colorsys.rgb_to_hls(*rgb(base))[1] - colorsys.rgb_to_hls(*rgb(darker))[1]
        if shifted <= MAX_SHIFT:
            fill = darker
        else:
            fill, label = reach(base, LABEL_DARK, 4.5, 1), LABEL_DARK
    hover = shift(fill, 0.05 if label == LABEL_DARK or mode == "dark" else -0.05)
    if ratio(hover, label) < 4.5:
        hover = shift(fill, -0.05 if label == "#ffffff" else 0.05)
    ramp = [mix(mark, n["surface"], t) for t in (0.2, 0.4, 0.6, 0.8, 1.0)]
    return {
        "accent": mark, "accent-text": text, "accent-fill": fill, "accent-fill-hover": hover, "accent-on": label,
        "accent-soft": rgba(mark, 0.14 if mode == "dark" else 0.12), "accent-softer": rgba(mark, 0.08),
        **{f"ramp-{i + 1}": c for i, c in enumerate(ramp)},
    }


def signal_set(mode: str) -> dict[str, str]:
    n = NEUTRALS[mode]
    d = 1 if mode == "dark" else -1
    out = {}
    for k, v in SIGNALS.items():
        c = reach(v, n["surface-3"], 4.5, d)
        out[k] = c
        out[f"{k}-soft"] = rgba(c, 0.14 if mode == "dark" else 0.12)
    return out


def neutral_set(mode: str) -> dict[str, str]:
    n = dict(NEUTRALS[mode])
    d = 1 if mode == "dark" else -1
    n["muted"] = reach(n["muted"], n["surface-3"], 4.5, d)      # secondary text
    n["faint"] = reach(n["faint"], n["surface"], 3.0, d)        # hints, icons, disabled: UI-mark level only
    n["focus"] = reach(n["focus"], n["surface-3"], 3.0, d)
    return n


def block(selector: str, values: dict[str, str]) -> str:
    body = "\n".join(f"  --vwnr-{k}: {v};" for k, v in values.items())
    return f"{selector} {{\n{body}\n}}\n"


def main() -> None:
    css = [
        "/* vaultnoir tokens: GENERATED by tools/build_tokens.py, do not edit by hand.\n"
        "   <html data-theme=\"dark|light\" data-accent=\"red|sky|violet|pink|amber\">; dark + red when unset. */\n",
    ]
    data: dict[str, dict] = {}
    table = []
    for mode in ("dark", "light"):
        n, s = neutral_set(mode), signal_set(mode)
        sel = ":root, :root[data-theme=\"dark\"]" if mode == "dark" else ":root[data-theme=\"light\"]"
        css.append(block(sel, {**n, **s}))
        data[mode] = {"neutrals": n, "signals": s, "accents": {}}
        cats = {}
        for name, base in ACCENTS.items():
            a = accent_set(base, mode)
            data[mode]["accents"][name] = a
            cats[name] = a["accent"]
            if mode == "dark":
                sels = [f":root[data-accent=\"{name}\"]", f":root[data-theme=\"dark\"][data-accent=\"{name}\"]"]
                if name == "red":
                    sels = [":root", ":root[data-theme=\"dark\"]", *sels]
            else:
                sels = [f":root[data-theme=\"light\"][data-accent=\"{name}\"]"]
                if name == "red":
                    sels = [":root[data-theme=\"light\"]", *sels]
            css.append(block(", ".join(sels), a))
            table.append({
                "mode": mode, "accent": name, "mark": a["accent"], "mark_on_surface3": round(ratio(a["accent"], n["surface-3"]), 2),
                "text": a["accent-text"], "text_on_surface3": round(ratio(a["accent-text"], n["surface-3"]), 2),
                "fill": a["accent-fill"], "label": a["accent-on"], "label_on_fill": round(ratio(a["accent-on"], a["accent-fill"]), 2),
            })
        cat_sel = ":root, :root[data-theme=\"dark\"]" if mode == "dark" else ":root[data-theme=\"light\"]"
        css.append(block(cat_sel, {f"cat-{i + 1}": c for i, c in enumerate(cats.values())}))
        data[mode]["categorical"] = list(cats.values())
        for k in ("text", "muted"):
            table.append({"mode": mode, "neutral": k, "on_surface3": round(ratio(n[k], n["surface-3"]), 2)})
        table.append({"mode": mode, "neutral": "faint (UI only)", "on_surface": round(ratio(n["faint"], n["surface"]), 2)})
        table.append({"mode": mode, "neutral": "focus ring", "on_surface3": round(ratio(n["focus"], n["surface-3"]), 2)})
        for k in SIGNALS:
            table.append({"mode": mode, "signal": k, "value": s[k], "on_surface3": round(ratio(s[k], n["surface-3"]), 2)})
    (ROOT / "tokens.css").write_text("\n".join(css), encoding="utf-8", newline="\n")
    (ROOT / "tokens.json").write_text(json.dumps({"tokens": data, "contrast": table}, indent=2) + "\n",
                                      encoding="utf-8", newline="\n")
    for row in table:
        print(row)


if __name__ == "__main__":
    main()
