#!/usr/bin/env python3
"""
Convert Kecktech logo PNGs from RGB + black backdrop to RGBA with alpha.
Reads the dashboard public asset as source of truth; writes all repo copies.

Tune --dark-max and --feather if a future logo has different contrast.
"""
from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--source",
        type=Path,
        default=root / "dashboard/public/brand/transparent-logo.png",
        help="Input RGB (or RGBA) PNG",
    )
    parser.add_argument(
        "--dark-max",
        type=int,
        default=22,
        help="Pixels with max(R,G,B) <= this become fully transparent",
    )
    parser.add_argument(
        "--feather",
        type=int,
        default=48,
        help="Blend alpha between dark-max and dark-max+feather (anti-alias)",
    )
    args = parser.parse_args()

    dark_end = args.dark_max + args.feather
    src = args.source
    if not src.is_file():
        raise SystemExit(f"Missing source: {src}")

    im = Image.open(src).convert("RGBA")
    pixels = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, _a = pixels[x, y]
            m = max(r, g, b)
            if m <= args.dark_max:
                alpha = 0
            elif m >= dark_end:
                alpha = 255
            else:
                alpha = int(255 * (m - args.dark_max) / args.feather)
            pixels[x, y] = (r, g, b, alpha)

    outputs = [
        root / "dashboard/public/brand/transparent-logo.png",
        root / "img/transparent-logo.png",
        root / "docker/wordpress/branding/transparent-logo.png",
    ]
    for out in outputs:
        out.parent.mkdir(parents=True, exist_ok=True)
        im.save(out, format="PNG", optimize=True)
        print(f"Wrote {out.relative_to(root)} ({Image.open(out).mode})")

    # White-on-transparent wordmark for dark footers (same alpha mask as main logo).
    white = Image.new("RGBA", im.size)
    wp = white.load()
    for y in range(h):
        for x in range(w):
            _r, _g, _b, a = pixels[x, y]
            if a < 8:
                wp[x, y] = (0, 0, 0, 0)
            else:
                wp[x, y] = (255, 255, 255, a)
    footer_out = root / "docker/wordpress/branding/transparent-logo-white.png"
    footer_out.parent.mkdir(parents=True, exist_ok=True)
    white.save(footer_out, format="PNG", optimize=True)
    print(f"Wrote {footer_out.relative_to(root)} (RGBA footer white)")


if __name__ == "__main__":
    main()
