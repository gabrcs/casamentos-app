"""QA geométrico do deck.pptx.

LibreOffice Impress não está instalado neste ambiente, então não há como
rasterizar. Este script mede o que realmente importa com métricas de fonte
reais (Liberation Sans = métricas da Arial):

  1. texto que estoura a altura ou a largura da sua caixa
  2. shapes fora dos limites do slide
  3. margem insuficiente da borda do slide
  4. caixas de texto que se sobrepõem
"""
import sys
from pptx import Presentation
from pptx.util import Emu
from pptx.enum.shapes import MSO_SHAPE
from PIL import ImageFont

EMU_IN = 914400.0
FONT_REG = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
FONT_BLD = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
SLIDE_W, SLIDE_H = 13.333, 7.5
MIN_MARGIN = 0.5
PT_IN = 1 / 72.0

_cache = {}


def font(size_pt, bold):
    key = (round(size_pt * 4), bold)
    if key not in _cache:
        # rasteriza a 4x para precisão de subpixel na medição
        _cache[key] = ImageFont.truetype(FONT_BLD if bold else FONT_REG, int(size_pt * 4))
    return _cache[key]


def text_width_in(s, size_pt, bold):
    """Largura de uma linha, em polegadas."""
    f = font(size_pt, bold)
    return (f.getlength(s) / 4.0) * PT_IN


def wrap_lines(text, size_pt, bold, avail_in):
    """Conta linhas após word-wrap na largura disponível."""
    lines = 0
    for hard in text.split("\n"):
        words = hard.split()
        if not words:
            lines += 1
            continue
        cur = words[0]
        n = 1
        for w in words[1:]:
            if text_width_in(cur + " " + w, size_pt, bold) <= avail_in:
                cur += " " + w
            else:
                n += 1
                cur = w
        lines += n
    return lines


def para_metrics(p, default_size, default_bold):
    """Tamanho/negrito dominantes e espaçamento de linha de um parágrafo."""
    size = default_size
    bold = default_bold
    best = -1
    for r in p.runs:
        ln = len(r.text)
        if ln > best:
            best = ln
            if r.font.size:
                size = r.font.size.pt
            if r.font.bold is not None:
                bold = r.font.bold
    if p.runs and p.runs[0].font.size:
        size = max(size, p.runs[0].font.size.pt)
    lnspc = None
    pPr = p._pPr
    if pPr is not None:
        for child in pPr:
            if child.tag.endswith("}lnSpc"):
                for gc in child:
                    if gc.tag.endswith("}spcPts"):
                        lnspc = int(gc.get("val")) / 100.0  # em pontos
                    elif gc.tag.endswith("}spcPct"):
                        lnspc = size * int(gc.get("val")) / 100000.0
    if lnspc is None:
        lnspc = size * 1.21
    return size, bold, lnspc


def space_after_pt(p):
    pPr = p._pPr
    if pPr is None:
        return 0.0
    for child in pPr:
        if child.tag.endswith("}spcAft"):
            for gc in child:
                if gc.tag.endswith("}spcPts"):
                    return int(gc.get("val")) / 100.0
    return 0.0


def main(path):
    prs = Presentation(path)
    problems = []

    for idx, slide in enumerate(prs.slides, 1):
        boxes = []
        for sh in slide.shapes:
            if sh.left is None or sh.top is None:
                continue
            x = Emu(sh.left).inches
            y = Emu(sh.top).inches
            w = Emu(sh.width).inches
            h = Emu(sh.height).inches
            rot = getattr(sh, "rotation", 0) or 0

            # 1. fora dos limites do slide (rotacionados têm bbox diferente; ignorados)
            if not rot:
                if x < -0.01 or y < -0.01 or x + w > SLIDE_W + 0.01 or y + h > SLIDE_H + 0.01:
                    # decoração sangrando de propósito é permitida se não tiver texto
                    if sh.has_text_frame and sh.text_frame.text.strip():
                        problems.append(
                            f"s{idx}: '{sh.text_frame.text[:28]}' fora do slide "
                            f"(x={x:.2f} y={y:.2f} até {x+w:.2f},{y+h:.2f})"
                        )

            if not (sh.has_text_frame and sh.text_frame.text.strip()):
                continue

            tf = sh.text_frame
            txt = tf.text.strip()

            # 2. margem da borda
            if not rot and (x < MIN_MARGIN - 0.05 or x + w > SLIDE_W - MIN_MARGIN + 0.05):
                problems.append(f"s{idx}: '{txt[:28]}' margem lateral < {MIN_MARGIN}\" (x={x:.2f}, fim={x+w:.2f})")
            if not rot and (y < 0.3 or y + h > SLIDE_H - 0.2):
                problems.append(f"s{idx}: '{txt[:28]}' muito perto da borda vert. (y={y:.2f}, fim={y+h:.2f})")

            # 3. estouro de texto
            ml = Emu(tf.margin_left or 0).inches
            mr = Emu(tf.margin_right or 0).inches
            mt = Emu(tf.margin_top or 0).inches
            mb = Emu(tf.margin_bottom or 0).inches
            avail_w = w - ml - mr
            avail_h = h - mt - mb
            if avail_w <= 0.05:
                continue

            total_h = 0.0
            worst_line = 0.0
            for p in tf.paragraphs:
                ptxt = "".join(r.text for r in p.runs)
                if not ptxt.strip():
                    total_h += 8 * PT_IN
                    continue
                size, bold, lnspc = para_metrics(p, 18.0, False)
                n = wrap_lines(ptxt, size, bold, avail_w)
                total_h += n * lnspc * PT_IN + space_after_pt(p) * PT_IN
                if n == 1:
                    worst_line = max(worst_line, text_width_in(ptxt, size, bold))

            if total_h > avail_h + 0.03:
                problems.append(
                    f"s{idx}: OVERFLOW VERTICAL '{txt[:34]}' precisa {total_h:.2f}\" "
                    f"tem {avail_h:.2f}\" (falta {total_h-avail_h:.2f}\")"
                )
            if worst_line > avail_w + 0.02:
                problems.append(
                    f"s{idx}: OVERFLOW HORIZONTAL '{txt[:34]}' precisa {worst_line:.2f}\" tem {avail_w:.2f}\""
                )

            # losango e elipse ocupam ~metade da bbox: comparar retângulos daria
            # falso positivo com rótulos que ficam nos cantos vazios da forma
            try:
                non_rect = sh.auto_shape_type in (MSO_SHAPE.DIAMOND, MSO_SHAPE.OVAL)
            except (ValueError, AttributeError):
                non_rect = False
            # caixas rotacionadas têm bbox visual diferente da declarada — não comparar
            if not rot and not non_rect:
                boxes.append((txt, x, y, w, h))

        # 4. sobreposição entre caixas de texto
        for i in range(len(boxes)):
            for j in range(i + 1, len(boxes)):
                t1, x1, y1, w1, h1 = boxes[i]
                t2, x2, y2, w2, h2 = boxes[j]
                ox = min(x1 + w1, x2 + w2) - max(x1, x2)
                oy = min(y1 + h1, y2 + h2) - max(y1, y2)
                if ox > 0.06 and oy > 0.06:
                    problems.append(
                        f"s{idx}: sobreposição '{t1[:20]}' × '{t2[:20]}' ({ox:.2f}\"×{oy:.2f}\")"
                    )

    if problems:
        print(f"{len(problems)} PROBLEMA(S):")
        for p in problems:
            print("  " + p)
        return 1
    print("QA geométrico: OK — sem overflow, sem sobreposição, margens respeitadas")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else "deck.pptx"))
