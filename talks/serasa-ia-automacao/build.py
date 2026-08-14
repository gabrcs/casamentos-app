#!/usr/bin/env python3
"""Injeta as fontes e a foto do apresentador como data URI no deck.

O deck é publicado como Artifact, onde a CSP bloqueia qualquer requisição
externa — fonte e imagem precisam estar embutidas no próprio arquivo.

A foto é opcional: sem ela o slide 2 mostra um espaço marcado, e o build
avisa. Basta salvar o arquivo em assets/ (jpg, jpeg, png ou webp, de
preferência já quadrado) e rodar de novo.

Uso: python3 build.py
Entrada:  deck.src.html  (+ fonts/*.woff2, assets/bruno.*)
Saída:    deck.html
"""
import base64
import pathlib

HERE = pathlib.Path(__file__).parent
FONTS = HERE / "fonts"
ASSETS = HERE / "assets"
PHOTO_STEM = "bruno"
PHOTO_EXTS = (".jpg", ".jpeg", ".png", ".webp")
PREVIEW = "skill-preview.png"   # a saída da skill, mostrada no slide 13
QR = "kit-qr.png"               # gerado por qa/make_qr.py
QR_LINK = "kit-link.txt"

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


def find_photo():
    """Primeiro arquivo assets/bruno.* que existir."""
    for ext in PHOTO_EXTS:
        f = ASSETS / (PHOTO_STEM + ext)
        if f.exists():
            return f
    return None


QR_PLACEHOLDER = (
    ".kqr{display:block;border:1.5px dashed #E80070;background:#FEF6FA;"
    "border-radius:1.2cqw;padding:1.2cqw 1.6cqw}"
    ".qrimg{display:none}"
    ".qrlab::after{content:' — a definir'}"
    ".qrurl{font-style:italic;color:#A08BAA}"
)

PREVIEW_PLACEHOLDER = (
    ".kshot{border-style:dashed;border-color:#E80070;background:#FEF6FA;min-height:18cqw}"
    ".kshot img{display:none}"
    ".kshot::after{"
    "content:'preview: gere com node qa/make_preview.mjs';"
    "display:grid;place-items:center;min-height:18cqw;text-align:center;padding:2cqw;"
    "font-family:'Roboto Mono',monospace;font-size:.95cqw;color:#A08BAA;font-style:italic}"
)

PLACEHOLDER = (
    ".bio-photo{border:1.5px dashed var(--magenta);background:#FEF6FA}"
    ".bio-photo img{display:none}"
    ".bio-photo::after{"
    "content:'foto: salve em assets/bruno.jpg';"
    "position:absolute;inset:0;display:grid;place-items:center;text-align:center;"
    "padding:2cqw;font-family:'Roboto Mono',monospace;font-size:.95cqw;"
    "line-height:1.5;color:#A08BAA;font-style:italic}"
)


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

    photo = find_photo()
    if photo:
        mime = {"jpg": "jpeg", "jpeg": "jpeg", "png": "png", "webp": "webp"}[
            photo.suffix.lstrip(".").lower()
        ]
        data = base64.b64encode(photo.read_bytes()).decode()
        out = out.replace("__PHOTO__", f"data:image/{mime};base64,{data}")
        out = out.replace("/*PHOTO*/", "")
        print(f"foto: {photo.name} ({photo.stat().st_size / 1024:.0f} KB)")
    else:
        out = out.replace("__PHOTO__", "")
        out = out.replace("/*PHOTO*/", PLACEHOLDER)
        print("foto: AUSENTE — salve em assets/bruno.jpg e rode de novo")

    prev = ASSETS / PREVIEW
    if prev.exists():
        data = base64.b64encode(prev.read_bytes()).decode()
        out = out.replace("__PREVIEW__", f"data:image/png;base64,{data}")
        out = out.replace("/*PREVIEW*/", "")
        print(f"preview: {prev.name} ({prev.stat().st_size / 1024:.0f} KB)")
    else:
        out = out.replace("__PREVIEW__", "")
        out = out.replace("/*PREVIEW*/", PREVIEW_PLACEHOLDER)
        print("preview: AUSENTE — rode node qa/make_preview.mjs")

    qr = ASSETS / QR
    link = (ASSETS / QR_LINK).read_text().strip() if (ASSETS / QR_LINK).exists() else ""
    if qr.exists() and link:
        data = base64.b64encode(qr.read_bytes()).decode()
        out = out.replace("__QR__", f"data:image/png;base64,{data}")
        out = out.replace("__KITLINK__", link.splitlines()[0].strip())
        out = out.replace("/*QR*/", "")
        print(f"qr: {link.splitlines()[0].strip()}")
    else:
        out = out.replace("__QR__", "")
        out = out.replace("__KITLINK__", "o link do kit entra aqui")
        out = out.replace("/*QR*/", QR_PLACEHOLDER)
        print("qr: AUSENTE — escreva a URL em assets/kit-link.txt e rode qa/make_qr.py")

    (HERE / "deck.html").write_text(out)
    print(f"deck.html: {len(out) / 1024:.0f} KB")


if __name__ == "__main__":
    main()
