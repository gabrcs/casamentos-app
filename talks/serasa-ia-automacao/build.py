#!/usr/bin/env python3
"""Injeta as fontes Roboto/Roboto Mono como data URI no deck.

O deck é publicado como Artifact, onde a CSP bloqueia CDN de fontes —
por isso a fonte precisa estar embutida no arquivo.

Uso: python3 build.py
Entrada:  deck.src.html  (+ fonts/*.woff2)
Saída:    deck.html
"""
import base64
import pathlib

HERE = pathlib.Path(__file__).parent
FONTS = HERE / "fonts"

LATIN = (
    "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,"
    "U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,"
    "U+FEFF,U+FFFD"
)
LATIN_EXT = (
    "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,"
    "U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,"
    "U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF"
)

# Roboto v51 é variável: um arquivo cobre 100-900.
FACES = [
    ("Roboto", "100 900", "roboto-latin.woff2", LATIN),
    ("Roboto", "100 900", "roboto-latin-ext.woff2", LATIN_EXT),
    ("Roboto Mono", "100 700", "robotomono-latin.woff2", LATIN),
    ("Roboto Mono", "100 700", "robotomono-latin-ext.woff2", LATIN_EXT),
]


def main():
    blocks = []
    for family, weight, filename, unicode_range in FACES:
        data = base64.b64encode((FONTS / filename).read_bytes()).decode()
        blocks.append(
            f"@font-face{{font-family:'{family}';font-style:normal;"
            f"font-weight:{weight};font-display:block;"
            f"src:url(data:font/woff2;base64,{data}) format('woff2');"
            f"unicode-range:{unicode_range};}}"
        )

    src = (HERE / "deck.src.html").read_text()
    if "/*FONTS*/" not in src:
        raise SystemExit("deck.src.html não tem o marcador /*FONTS*/")
    out = src.replace("/*FONTS*/", "\n".join(blocks))
    (HERE / "deck.html").write_text(out)
    print(f"deck.html: {len(out) / 1024:.0f} KB")


if __name__ == "__main__":
    main()
