"""vaultnoir icons: Panopticam's hand-drawn set plus the catalog's additions, one source (icons.json).

20px grid, stroke 1.6, round caps and joins, outline, currentColor; filled only for "on" variants.
Writes svg/<name>.svg, sprite.svg (symbols "vwnr-<name>") and react/index.tsx.

    python icons/build.py
"""

import json
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
ADDED = {
    "Ask": '<circle cx="10" cy="10" r="7.5" /><circle cx="10" cy="10" r="4" /><circle cx="10" cy="10" r="1.2" fill="currentColor" />',
    "Similar": '<circle cx="7.5" cy="10" r="4.5" /><circle cx="12.5" cy="10" r="4.5" />',
    "Lyrics": '<path d="M3 5h9M3 9h9M3 13h5" /><path d="M15.3 14.5V6l2.7-1" /><circle cx="13.5" cy="14.5" r="1.8" />',
    "Wave": '<path d="M3 9v2M6 6.5v7M9 4v12M12 7v6M15 5.5v9M17.5 9v2" />',
    "Music": '<path d="M8 15V4.5l9-2V13" /><circle cx="5.5" cy="15" r="2.5" /><circle cx="14.5" cy="13" r="2.5" />',
    "Cast": '<rect x="2.5" y="4" width="15" height="12" rx="1.5" /><circle cx="10" cy="8.8" r="2.3" /><path d="M6 16c.6-2 2.1-3 4-3s3.4 1 4 3" />',
    "Oracle": '<path d="M3 4.5h5a2 2 0 0 1 2 2V16a1.5 1.5 0 0 0-1.5-1.5H3zM17 4.5h-5a2 2 0 0 0-2 2V16a1.5 1.5 0 0 1 1.5-1.5H17z" />',
    "Picture": '<rect x="2.5" y="3.5" width="15" height="13" rx="1.5" /><circle cx="7" cy="8" r="1.5" /><path d="M2.5 14l4.5-4 3.5 3 2.5-2 4.5 4" />',
    "Poster": '<rect x="5" y="2.5" width="10" height="15" rx="1.2" /><path d="M5 13.5h10" />',
    "Tv": '<rect x="2.5" y="4.5" width="15" height="10" rx="1.5" /><path d="M7 17.5h6M7.5 2l2.5 2.5L12.5 2" />',
    "Home": '<path d="M3 9.5L10 3.5l7 6M5 8v8.5h10V8" />',
    "Edit": '<path d="M12.5 4l3.5 3.5L7.5 16H4v-3.5z" /><path d="M10.8 5.7l3.5 3.5" />',
    "Hide": '<circle cx="10" cy="10" r="7.5" /><circle cx="10" cy="10" r="4" /><path d="M3.5 3.5l13 13" />',
    "History": '<path d="M3.5 10a6.5 6.5 0 1 0 6.5-6.5c-2 0-3.8.9-5 2.4" /><path d="M3.5 3v3.5H7M10 6.5V10l2.5 1.5" />',
    "Check": '<path d="M4 10.5l3.5 3.5L16 5.5" />',
    "ChevronLeft": '<path d="M12.5 4.5L7 10l5.5 5.5" />',
    "ChevronRight": '<path d="M7.5 4.5L13 10l-5.5 5.5" />',
    "ChevronDown": '<path d="M4.5 7.5L10 13l5.5-5.5" />',
    "Info": '<circle cx="10" cy="10" r="7.5" /><path d="M10 9v5" /><circle cx="10" cy="6.3" r=".9" fill="currentColor" />',
    "Alert": '<path d="M10 3l7.5 13.5h-15z" /><path d="M10 8.5v3.5" /><circle cx="10" cy="14.2" r=".9" fill="currentColor" />',
    "Sun": '<circle cx="10" cy="10" r="3.5" /><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.3 4.3l1.4 1.4M14.3 14.3l1.4 1.4M4.3 15.7l1.4-1.4M14.3 5.7l1.4-1.4" />',
    "Moon": '<path d="M16.5 12A7 7 0 0 1 8 3.5a7 7 0 1 0 8.5 8.5z" />',
    "Settings": '<path d="M3 6h8M15 6h2M3 14h2M9 14h8" /><circle cx="13" cy="6" r="2" /><circle cx="7" cy="14" r="2" />',
    "Keyboard": '<rect x="2" y="5" width="16" height="10" rx="1.5" /><path d="M5 8h.01M8 8h.01M11 8h.01M14 8h.01M5 11h.01M15 11h.01M7.5 12h5" />',
    "Heart": '<path d="M10 16.5s-6.5-4-6.5-8.5A3.5 3.5 0 0 1 10 6a3.5 3.5 0 0 1 6.5 2c0 4.5-6.5 8.5-6.5 8.5z" />',
    "HeartFilled": '<path d="M10 16.5s-6.5-4-6.5-8.5A3.5 3.5 0 0 1 10 6a3.5 3.5 0 0 1 6.5 2c0 4.5-6.5 8.5-6.5 8.5z" fill="currentColor" />',
    "Filter": '<path d="M3 4.5h14l-5.5 6.5V16l-3-1.5v-3.5z" />',
    "Play": '<path d="M6 4l10 6-10 6z" />',
    "Bell": '<path d="M5 13.5V9a5 5 0 0 1 10 0v4.5l1.5 1.5h-13z" /><path d="M8.5 17h3" />',
    "Globe": '<circle cx="10" cy="10" r="7.5" /><path d="M2.5 10h15M10 2.5c2 2.2 3 4.7 3 7.5s-1 5.3-3 7.5c-2-2.2-3-4.7-3-7.5s1-5.3 3-7.5z" />',
}


def main() -> None:
    base = json.loads((HERE / "_panopticam.json").read_text(encoding="utf-8"))
    icons = {**base, **ADDED}
    icons = dict(sorted(icons.items()))
    (HERE / "icons.json").write_text(json.dumps({"grid": 20, "stroke": 1.6, "icons": icons}, indent=1) + "\n",
                                     encoding="utf-8", newline="\n")
    head = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" '
            'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">')
    out = HERE / "svg"
    out.mkdir(exist_ok=True)
    for f in out.glob("*.svg"):
        f.unlink()
    symbols = []
    for name, body in icons.items():
        slug = re.sub(r"(?<!^)(?=[A-Z])", "-", name).lower()
        (out / f"{slug}.svg").write_text(f"{head}{body}</svg>\n", encoding="utf-8", newline="\n")
        symbols.append(f'  <symbol id="vwnr-{slug}" viewBox="0 0 20 20">{body}</symbol>')
    (HERE / "sprite.svg").write_text(
        '<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="1.6" '
        'stroke-linecap="round" stroke-linejoin="round" style="display:none">\n' + "\n".join(symbols) + "\n</svg>\n",
        encoding="utf-8", newline="\n")
    jsx = []
    for name, body in icons.items():
        b = (body.replace("stroke-width", "strokeWidth").replace("stroke-linecap", "strokeLinecap")
             .replace("fill-rule", "fillRule"))
        jsx.append(f"export const Icon{name} = (p: IconProps) => (<Svg {{...p}}>{b}</Svg>);")
    react = HERE / "react"
    react.mkdir(exist_ok=True)
    (react / "index.tsx").write_text(
        "/* vaultnoir icons: GENERATED by icons/build.py from icons.json, do not edit by hand.\n"
        "   20px grid, 1.6 stroke, outline, currentColor. Sizes 16 / 18 / 20. */\n\n"
        'import type { ReactNode, SVGProps } from "react";\n\n'
        "export type IconProps = SVGProps<SVGSVGElement> & { size?: number };\n\n"
        "function Svg({ size = 18, children, ...rest }: IconProps & { children: ReactNode }) {\n"
        "  return (\n"
        '    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor"\n'
        '      strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>\n'
        "      {children}\n    </svg>\n  );\n}\n\n" + "\n".join(jsx) + "\n",
        encoding="utf-8", newline="\n")
    print(len(icons), "icons")


if __name__ == "__main__":
    main()
