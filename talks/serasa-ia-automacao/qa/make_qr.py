#!/usr/bin/env python3
"""Gera o QR code do kit a partir do link em assets/kit-link.txt.

Coloque a URL (uma linha) em assets/kit-link.txt e rode:

    python3 qa/make_qr.py && python3 build.py && node make_pptx.js

Sem o arquivo, o slide 13 mostra um espaço tracejado com a instrução e os
builds avisam no terminal — nada quebra.

Correção de erro em M (15%): o QR ainda lê com o brilho do projetor
comendo contraste, sem virar um bloco denso demais para a câmera achar.
"""
import pathlib
import sys

import qrcode
from qrcode.constants import ERROR_CORRECT_M

HERE = pathlib.Path(__file__).parent.parent
LINK = HERE / "assets" / "kit-link.txt"
SAIDA = HERE / "assets" / "kit-qr.png"


def main():
    if not LINK.exists() or not LINK.read_text().strip():
        print(f"sem link: escreva a URL em {LINK.relative_to(HERE)} e rode de novo")
        return 1

    url = LINK.read_text().strip().splitlines()[0].strip()
    qr = qrcode.QRCode(version=None, error_correction=ERROR_CORRECT_M, box_size=12, border=2)
    qr.add_data(url)
    qr.make(fit=True)
    # navy da marca em vez de preto puro: some menos no slide claro
    img = qr.make_image(fill_color="#16224E", back_color="white").convert("RGB")
    img.save(SAIDA)
    print(f"{SAIDA.relative_to(HERE)}: {img.size[0]}px  →  {url}")

    # conferir a leitura importa mais que gerar: um QR errado num slide só
    # aparece na frente da plateia
    try:
        from pyzbar.pyzbar import decode
        from PIL import Image

        lido = decode(Image.open(SAIDA))
        if not lido:
            print("AVISO: não consegui ler o QR gerado — confira antes de apresentar")
            return 1
        if lido[0].data.decode() != url:
            print(f"AVISO: o QR leu outra coisa: {lido[0].data.decode()}")
            return 1
        print("leitura conferida: bate com a URL")
    except ImportError:
        print("(sem pyzbar/libzbar aqui — escaneie uma vez com o celular antes de apresentar)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
