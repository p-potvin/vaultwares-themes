"""tokens.json and bundle.css for the vaultnoir Claude Design system, from vaultwares-themes/vaultnoir."""
import json
import re
import sys
from pathlib import Path

S = Path(sys.argv[1]) / "project"
V = Path(sys.argv[2])
t = json.loads((V / "tokens.json").read_text(encoding="utf-8"))["tokens"]
D, L = t["dark"], t["light"]
USE = {
    "bg": "Page background.", "surface": "Cards, fields, panels.", "surface-2": "Buttons, menus, raised controls.",
    "surface-3": "Hover, selected rows, chips that are on; the worst ground text is checked on.",
    "line": "Borders and dividers.", "line-2": "Strong borders, control outlines.",
    "text": "Body text, 13:1 or more on surface-3.", "muted": "Secondary text, 4.5:1 or more on surface-3.",
    "faint": "Hints, icons, disabled: 3:1, never text someone must read.", "focus": "The 2px focus ring.",
    "scrim": "Modal backdrop.", "media": "Behind pictures and video.",
    "media-scrim": "Tags over pictures (same in both themes).", "on-media": "Text over pictures (same in both themes).",
    "success": "Success signal, always with a word or icon.", "danger": "Danger and errors, always with a word or icon.",
    "warning": "Warning signal, always with a word or icon.", "info": "Information signal, always with a word or icon.",
}
colors = []


def add(name, d, l, usage):
    colors.append({"name": f"vwnr-{name}", "value": {"dark": d, "light": l}, "usage": usage})


for k, v in D["neutrals"].items():
    if k == "shadow":
        continue
    add(k, v, L["neutrals"][k], USE.get(k, ""))
for k, v in D["signals"].items():
    add(k, v, L["signals"][k], USE.get(k, f"{k.replace('-soft', '').title()} background tint."))
AROLE = {
    "accent": "The active accent: marks, the live dot, selection ring, switch on. 3:1 or more.",
    "accent-text": "Accent as text and links. 4.5:1 or more on surface-3.",
    "accent-fill": "Primary button fill.", "accent-fill-hover": "Primary button fill on hover.",
    "accent-on": "Label on the accent fill, 4.5:1 or more.",
    "accent-soft": "Accent tint (Ask bar on, accent chips).", "accent-softer": "Lighter accent tint.",
}
for k, u in AROLE.items():
    add(k, D["accents"]["red"][k], L["accents"]["red"][k], u + " Default red; data-accent swaps it.")
for i in range(1, 6):
    add(f"ramp-{i}", D["accents"]["red"][f"ramp-{i}"], L["accents"]["red"][f"ramp-{i}"],
        f"Sequential chart ramp, step {i}, of the active accent.")
names = list(D["accents"])
for i, c in enumerate(D["categorical"], 1):
    add(f"cat-{i}", c, L["categorical"][i - 1], f"Categorical chart colour {i}: the {names[i - 1]} accent.")
for name in ("sky", "violet", "pink", "amber"):
    for k in ("accent", "accent-text", "accent-fill", "accent-on"):
        role = k.replace("accent", "").strip("-") or "mark"
        add(f"{name}-{role}", D["accents"][name][k], L["accents"][name][k],
            f'The {name} accent\'s {role} value: what data-accent="{name}" puts in --vwnr-{k}.')

LATIN = ("U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, "
         "U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD")
LATIN_EXT = ("U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+1D00-1DBF, U+1E00-1E9F, "
             "U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF")
fonts = []
for fam, file, w, st in [("Inter Tight", "inter-tight", "100 900", "normal"),
                         ("Inter Tight", "inter-tight", "100 900", "italic"),
                         ("JetBrains Mono", "jetbrains-mono", "100 800", "normal")]:
    for sub, rng in (("latin", LATIN), ("latin-ext", LATIN_EXT)):
        fonts.append({"family": fam, "file": f"fonts/{file}-{sub}-wght-{st}.woff2", "weight": w, "style": st,
                      "unicodeRange": rng})


def styles(rows):
    out = []
    for r in rows:
        name, size, lh, wt, usage = r[:5]
        s = {"name": name, "fontSize": size, "lineHeight": lh, "fontWeight": wt, "usage": usage}
        if len(r) > 5:
            s["sample"] = r[5]
        out.append(s)
    return out


tokens = {
    "name": "vaultnoir", "version": 1,
    "meta": {"source": "github", "repo": "p-potvin/vaultwares-themes", "ref": "vw-themes-vaultnoir", "package": "vaultnoir",
             "paths": {"tokens": ["vaultnoir/tokens.json"], "fonts": ["vaultnoir/fonts"],
                       "docs": ["vaultnoir/README.md", "vaultnoir/COMPONENTS.md"]}, "synced": "2026-11-22"},
    "color": {"themes": [{"id": "dark", "name": "Dark"}, {"id": "light", "name": "Light"}], "tokens": colors},
    "type": {
        "fonts": fonts,
        "families": {"ui": "\"Inter Tight\", ui-sans-serif, system-ui, \"Segoe UI\", sans-serif",
                     "mono": "\"JetBrains Mono\", ui-monospace, Consolas, monospace"},
        "groups": [
            {"name": "Headings", "family": "ui", "styles": styles([
                ("h1", "29px", 1.2, 600, "Page title.", "Heat (1995)"),
                ("h2", "24px", 1.2, 600, "Section title on a detail page."),
                ("h3", "20px", 1.2, 600, "Panel title."),
                ("h4", "17px", 1.2, 600, "Section heads in a grid page.")])},
            {"name": "Text", "family": "ui", "styles": styles([
                ("body", "14px", 1.45, 400, "Everything by default.", "Ask in plain words: year, genre, language."),
                ("label", "13px", 1.3, 500, "Buttons, chips, nav links."),
                ("small", "12px", 1.4, 400, "Card meta, Read as, captions."),
                ("xs", "11px", 1.3, 500, "Menu labels, uppercase with 0.06em tracking.")])},
            {"name": "Mono", "family": "mono", "styles": styles([
                ("num", "14px", 1.45, 500, "Numbers and durations, tabular.", "29,990 · 2h 50m"),
                ("stat", "20px", 1.2, 600, "Stat tiles."),
                ("kbd", "11px", 1.3, 500, "Keys, ids, badges.", "G T · tt0113277")])}]},
    "spacing": {"tokens": [{"name": f"vwnr-space-{n}", "value": f"{v}px", "usage": u} for n, v, u in [
        (1, 4, "Icon to label inside small chips."), (2, 8, "Gap between controls in a row."),
        (3, 12, "Grid gap, toolbar padding."), (4, 16, "Page gutter, panel padding."), (5, 20, "Modal padding."),
        (6, 24, "Space above a section head."), (8, 32, "Large separations.")]]},
    "radius": {"tokens": [{"name": f"vwnr-radius{s}", "value": f"{v}px", "usage": u} for s, v, u in [
        ("-xs", 4, "Keys, code, small tags."), ("-sm", 7, "Thumbnails."), ("", 8, "Buttons, chips, menu items."),
        ("-md", 9, "Inputs and the two searches."), ("-lg", 10, "Menus, alerts, stat tiles."),
        ("-xl", 12, "Cards, panels, modals."), ("-pill", 999, "Badges and counts.")]]},
    "shadow": {"tokens": [{"name": "vwnr-shadow", "value": {"dark": D["neutrals"]["shadow"], "light": L["neutrals"]["shadow"]},
                           "usage": "Menus, toasts, modals, tooltips."}]},
    "size": {"tokens": [{"name": f"vwnr-{n}", "value": v, "usage": u} for n, v, u in [
        ("topbar", "56px", "Top bar height."), ("control", "34px", "Buttons."),
        ("control-sm", "28px", "Small buttons, rating keys."), ("input", "38px", "Inputs and the two searches."),
        ("chip", "30px", "Chips."), ("row", "36px", "Table rows."),
        ("card-min", "200px", "Card minimum width; the slider moves it from 180 to 220."),
        ("gap", "12px", "Grid gap."), ("target", "32px", "Click-target floor.")]]},
}
(S / "tokens.json").write_text(json.dumps(tokens, indent=1, ensure_ascii=False) + "\n", encoding="utf-8", newline="\n")

base = (V / "vaultnoir.css").read_text(encoding="utf-8")
base = re.sub(r'@import url\("[^"]+"\);\n', "", base)
tok = (V / "tokens.css").read_text(encoding="utf-8")
blocks = re.findall(r'(:root[^{]*data-accent="(?:sky|violet|pink|amber)"[^{]*\{[^}]*\})', tok)
css = ("/* vaultnoir: base, the four other accents (data-accent), components. Colours come from tokens.json. */\n"
       + base + "\n" + "\n".join(blocks) + "\n" + (V / "components.css").read_text(encoding="utf-8"))
assert "</style" not in css
(S / "components" / "bundle.css").write_text(css, encoding="utf-8", newline="\n")
print(len(colors), "colours;", len(blocks), "accent blocks;", len(css), "bytes of css")
