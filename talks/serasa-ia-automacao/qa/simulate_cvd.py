"""Simula daltonismo num PNG, para conferir se a classificação do fluxo
continua legível para quem não distingue vermelho e verde.

Matrizes de Viénot, Brettel & Mollon (1999), aplicadas em espaço linear —
simular em sRGB direto dá um resultado otimista demais.

Uso: python3 qa/simulate_cvd.py qa/shots/s09.png
Saída: <arquivo>.protanopia.png e <arquivo>.deuteranopia.png
"""
import sys, pathlib
import numpy as np
from PIL import Image

M_LMS = np.array([[17.8824, 43.5161, 4.11935],
                  [3.45565, 27.1554, 3.86714],
                  [0.0299566, 0.184309, 1.46709]])
M_RGB = np.linalg.inv(M_LMS)
SIM = {
    "protanopia":   np.array([[0, 2.02344, -2.52581], [0, 1, 0], [0, 0, 1]]),
    "deuteranopia": np.array([[1, 0, 0], [0.494207, 0, 1.24827], [0, 0, 1]]),
}


def simular(img, tipo):
    a = np.asarray(img.convert("RGB"), dtype=np.float64) / 255.0
    lin = np.where(a <= 0.04045, a / 12.92, ((a + 0.055) / 1.055) ** 2.4)
    m = M_RGB @ SIM[tipo] @ M_LMS
    out = np.einsum("ij,hwj->hwi", m, lin)
    out = np.clip(out, 0, 1)
    srgb = np.where(out <= 0.0031308, out * 12.92, 1.055 * out ** (1 / 2.4) - 0.055)
    return Image.fromarray((np.clip(srgb, 0, 1) * 255).astype(np.uint8))


def main(paths):
    for p in paths:
        p = pathlib.Path(p)
        img = Image.open(p)
        for tipo in SIM:
            saida = p.with_suffix(f".{tipo}.png")
            simular(img, tipo).save(saida)
            print(saida)


if __name__ == "__main__":
    main(sys.argv[1:] or ["qa/shots/s09.png"])
