/**
 * Gera deck.pptx — versão editável da palestra "Automação de processos com IA".
 * 16 slides, espelhando deck.src.html. Paleta e motivo visual seguem a identidade
 * Serasa Experian (roxo/magenta/navy, cards squircle, badge circular magenta).
 *
 * Os fluxogramas usam as MESMAS coordenadas do SVG do deck HTML: o viewBox é
 * 1280x720 e o slide é 13.333x7.5in, então px / 96 = polegadas. A função px()
 * faz essa conversão, e é por isso que os dois decks ficam idênticos.
 *
 * Fonte: Arial. Roboto (a fonte da marca) não está garantida no PowerPoint de
 * terceiros; Arial é o grotesco seguro mais próximo. Troque FONT abaixo se a
 * máquina da apresentação tiver Roboto instalada.
 *
 * Uso: node make_pptx.js
 */
const pptxgen = require("pptxgenjs");

const C = {
  ink: "16224E",
  inkSoft: "4A5578",
  navy: "1D4F91",
  magenta: "E80070",
  purple: "6D2077",
  deep: "4E0E62",
  lavender: "F4F0F9",
  line: "E3DCEC",
  paper: "FFFFFF",
  pink: "FF8FC0",
  green: "1F7A5C",
  greenBg: "E6F1EC",
  amber: "B4620A",
  amberBg: "FBEEDF",
  pinkBg: "FBE0EE",
  blueBg: "E4EDF8",
  humBg: "EEE3F4",
  edge: "8E86A0",
  // bloco de código
  codeBg: "141A31",
  codeTx: "D6D0E6",
  codeCm: "7E7796",
  codeKw: "FF9CC6",
  codeSt: "93D3A8",
  codeVr: "8FB8E8",
};
const FONT = "Arial";
const MONO = "Courier New";
const W = 13.333;
const M = 0.72;

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "Gabriel Corrêa";
pres.title = "Automação de processos com IA";

/** px do viewBox 1280x720 → polegadas */
const px = (v) => v / 96;

/* ---------------- chrome ---------------- */

function header(slide, eyebrow, titleRuns, opts) {
  const o = opts || {};
  slide.addText(eyebrow.toUpperCase(), {
    x: M, y: 0.5, w: W - 2 * M, h: 0.3,
    margin: 0, fontFace: FONT, fontSize: 11, bold: true,
    color: C.magenta, charSpacing: 2.2,
  });
  slide.addText(titleRuns, {
    x: M, y: 0.85, w: o.titleW || W - 2 * M, h: o.titleH || 0.95,
    margin: 0, valign: "top", fontFace: FONT,
    fontSize: o.size || 30, bold: true, color: C.ink, lineSpacing: o.lnspc || 34,
  });
  if (o.lede) {
    slide.addText(o.lede, {
      x: M, y: 1.82, w: W - 2 * M - 1.4, h: 0.42,
      margin: 0, fontFace: FONT, fontSize: 13.5, color: C.inkSoft, lineSpacing: 18,
    });
  }
}

function footer(slide, sec) {
  slide.addText("Automação de processos com IA", {
    x: M, y: 6.92, w: 5, h: 0.28,
    margin: 0, fontFace: FONT, fontSize: 9, bold: true, color: "9A93AC",
  });
  slide.addText(sec, {
    x: W - M - 5, y: 6.92, w: 5, h: 0.28,
    margin: 0, align: "right", fontFace: FONT, fontSize: 9, color: "9A93AC",
  });
}

function callout(slide, label, runs, y, h) {
  const hh = h || 0.92;
  slide.addShape(pres.ShapeType.roundRect, {
    x: M, y, w: W - 2 * M, h: hh, rectRadius: 0.1,
    fill: { color: C.lavender }, line: { color: C.lavender, width: 0 },
  });
  slide.addText(label.toUpperCase(), {
    x: M + 0.28, y: y + 0.1, w: 7, h: 0.22,
    margin: 0, fontFace: FONT, fontSize: 9.5, bold: true, color: C.magenta, charSpacing: 1.8,
  });
  slide.addText(runs, {
    x: M + 0.28, y: y + 0.32, w: W - 2 * M - 0.56, h: hh - 0.4,
    margin: 0, valign: "top", fontFace: FONT, fontSize: 12, color: C.ink, lineSpacing: 16,
  });
}

function card(slide, x, y, w, h, fill) {
  slide.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.1,
    fill: { color: fill || C.paper },
    line: { color: fill && fill !== C.paper ? fill : C.line, width: 1 },
  });
}

function badge(slide, x, y, d, label, fill) {
  slide.addShape(pres.ShapeType.ellipse, {
    x, y, w: d, h: d,
    fill: { color: fill || C.magenta }, line: { width: 0 },
  });
  if (label) {
    slide.addText(label, {
      x, y, w: d, h: d, align: "center", valign: "middle", margin: 0,
      fontFace: FONT, fontSize: 11, bold: true, color: "FFFFFF",
    });
  }
}

/* ---------------- bloco de código ---------------- */

const TOK = { t: C.codeTx, c: C.codeCm, k: C.codeKw, s: C.codeSt, v: C.codeVr, w: "FFFFFF" };

/**
 * lines: array de linhas; cada linha é array de [texto, token].
 * token: t=normal c=comentário k=palavra-chave s=string v=identificador w=destaque
 */
function codeBlock(slide, x, y, w, h, lines, fontSize) {
  slide.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.08,
    fill: { color: C.codeBg }, line: { width: 0 },
  });
  const runs = [];
  lines.forEach((ln, i) => {
    const last = i === lines.length - 1;
    if (ln.length === 0) {
      runs.push({ text: " ", options: { breakLine: !last } });
      return;
    }
    ln.forEach((tk, j) => {
      runs.push({
        text: tk[0],
        options: {
          color: TOK[tk[1] || "t"],
          bold: tk[1] === "w",
          breakLine: j === ln.length - 1 && !last,
        },
      });
    });
  });
  slide.addText(runs, {
    x: x + 0.18, y: y + 0.14, w: w - 0.36, h: h - 0.28,
    margin: 0, valign: "top", fontFace: MONO,
    fontSize: fontSize || 9, lineSpacing: (fontSize || 9) * 1.45,
  });
}

function codeCap(slide, x, y, text, w) {
  slide.addText(text.toUpperCase(), {
    x, y, w: w || 7.5, h: 0.24,
    margin: 0, fontFace: MONO, fontSize: 8.5, bold: true,
    color: C.magenta, charSpacing: 1.2,
  });
}

/* ---------------- fluxograma ---------------- */

const NODE_STYLE = {
  plain: { fill: C.paper, line: C.line, txt: C.ink },
  term: { fill: "EFEAF5", line: "CFC3DE", txt: C.purple },
  code: { fill: C.blueBg, line: C.navy, txt: C.ink },
  ia: { fill: C.pinkBg, line: C.magenta, txt: C.ink },
  hum: { fill: C.humBg, line: C.purple, txt: C.ink },
  todo: { fill: "FEF6FA", line: C.magenta, txt: "B4620A", dash: true },
};

/** caixa do fluxo, em coordenadas de px do viewBox */
function fnode(slide, xp, yp, wp, hp, lines, kind, opts) {
  const o = opts || {};
  const st = NODE_STYLE[kind || "plain"];
  slide.addText(
    lines.map((t, i) => ({ text: t, options: { breakLine: i !== lines.length - 1 } })),
    {
      shape: pres.ShapeType.roundRect,
      rectRadius: o.pill ? 0.5 : 0.1,
      x: px(xp), y: px(yp), w: px(wp), h: px(hp),
      fill: { color: st.fill },
      line: { color: st.line, width: 1.25, dashType: st.dash ? "dash" : "solid" },
      align: "center", valign: "middle", margin: 0,
      fontFace: FONT, fontSize: o.size || 11.5,
      bold: o.bold || kind === "term", italic: !!o.italic,
      color: o.color || st.txt, lineSpacing: (o.size || 11.5) * 1.25,
    }
  );
}

/** losango de decisão; cx/cy = centro em px */
function fdiamond(slide, cxp, cyp, hwp, hhp, lines, kind, opts) {
  const o = opts || {};
  const st = NODE_STYLE[kind || "plain"];
  slide.addText(
    lines.map((t, i) => ({ text: t, options: { breakLine: i !== lines.length - 1 } })),
    {
      shape: pres.ShapeType.diamond,
      x: px(cxp - hwp), y: px(cyp - hhp), w: px(hwp * 2), h: px(hhp * 2),
      fill: { color: st.fill }, line: { color: st.line, width: 1.25 },
      align: "center", valign: "middle", margin: 0,
      fontFace: FONT, fontSize: o.size || 11, color: st.txt,
      lineSpacing: (o.size || 11) * 1.25,
    }
  );
}

/** rótulo abaixo do nó (CÓDIGO / IA / HUMANO) */
function ftag(slide, cxp, yp, text, color) {
  slide.addText(text, {
    x: px(cxp) - 0.95, y: px(yp) - 0.1, w: 1.9, h: 0.2,
    margin: 0, align: "center", fontFace: FONT, fontSize: 8.5,
    bold: true, color, charSpacing: 0.8,
  });
}

/** texto solto no espaço do fluxograma */
function ftext(slide, xp, yp, runs, opts) {
  const o = opts || {};
  slide.addText(runs, {
    x: px(xp), y: px(yp), w: o.w || 3.2, h: o.h || 0.24,
    margin: 0, valign: "middle", align: o.align || "left",
    fontFace: o.mono ? MONO : FONT, fontSize: o.size || 9.5,
    bold: !!o.bold, color: o.color || C.inkSoft, charSpacing: o.cs || 0,
    lineSpacing: (o.size || 9.5) * 1.35,
  });
}

/** um segmento de aresta; arrow=true põe a ponta no fim */
function seg(slide, x1, y1, x2, y2, arrow) {
  const o = {
    x: px(Math.min(x1, x2)), y: px(Math.min(y1, y2)),
    w: px(Math.abs(x2 - x1)), h: px(Math.abs(y2 - y1)),
    line: { color: C.edge, width: 1.75 },
  };
  if (x2 < x1) o.flipH = true;
  if (y2 < y1) o.flipV = true;
  if (arrow) o.line.endArrowType = "triangle";
  slide.addShape(pres.ShapeType.line, o);
}

/** aresta com cotovelos: pontos [[x,y],...]; ponta no último segmento */
function edge(slide, pts) {
  for (let i = 0; i < pts.length - 1; i++) {
    seg(slide, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], i === pts.length - 2);
  }
}

/** desenha o fluxo da triagem; painted=true classifica cada caixa */
function triagem(slide, painted) {
  const k = (c) => (painted ? c : "plain");
  fnode(slide, 70, 250, 120, 70, ["Solicitação", "chega"], "term", { pill: true, size: 11 });
  fnode(slide, 228, 250, 165, 70, ["Registrar", "ticket"], k("code"));
  fnode(slide, 431, 250, 175, 70, ["Classificar", "assunto"], k("ia"));
  fnode(slide, 644, 250, 165, 70, ["Redigir", "resposta"], k("ia"));
  fdiamond(slide, 932, 285, 85, 65, ["Precisa", "aprovação?"], k("code"), { size: 10 });
  fnode(slide, 560, 460, 200, 70, ["Gestor revisa", "e aprova"], k("hum"));
  fnode(slide, 820, 460, 180, 70, ["Enviar", "resposta"], k("code"));
  fnode(slide, 1060, 460, 100, 70, ["Fim"], "term", { pill: true, size: 11 });

  edge(slide, [[190, 285], [222, 285]]);
  edge(slide, [[393, 285], [425, 285]]);
  edge(slide, [[606, 285], [638, 285]]);
  edge(slide, [[809, 285], [841, 285]]);
  edge(slide, [[932, 350], [932, 400], [660, 400], [660, 454]]);
  edge(slide, [[1017, 285], [1200, 285], [1200, 420], [910, 420], [910, 454]]);
  edge(slide, [[760, 495], [814, 495]]);
  edge(slide, [[1000, 495], [1054, 495]]);
  ftext(slide, 936, 396, "sim", { bold: true, size: 9, color: "6E6684", w: 0.5 });
  ftext(slide, 1024, 268, "não", { bold: true, size: 9, color: "6E6684", w: 0.5 });

  if (painted) {
    ftag(slide, 310, 342, "CÓDIGO", C.navy);
    ftag(slide, 518, 342, "IA · 12.000/mês", C.magenta);
    ftag(slide, 726, 342, "IA + revisão", C.magenta);
    ftag(slide, 932, 372, "CÓDIGO · regra fixa", C.navy);
    ftag(slide, 660, 552, "HUMANO · 300/mês", C.purple);
    ftag(slide, 910, 552, "CÓDIGO", C.navy);
  } else {
    ftext(slide, 80, 432, "A REGRA DO LOSANGO, ESCRITA:", { bold: true, size: 9, color: C.magenta, w: 3.4 });
    ftext(slide, 80, 456, "desconto > 10% ou exceção contratual", { size: 10, w: 3.6 });
    ftext(slide, 80, 478, "losango sem regra = decisão que ninguém revisou", { size: 9, color: "8E86A0", w: 4.6 });
  }
}

/* ================= 01 · CAPA ================= */
{
  const s = pres.addSlide();
  s.background = { color: C.deep };
  s.addShape(pres.ShapeType.roundRect, {
    x: 9.6, y: -1.1, w: 3.4, h: 3.4, rectRadius: 0.3,
    fill: { color: "FFFFFF", transparency: 92 }, line: { width: 0 },
  });
  s.addShape(pres.ShapeType.roundRect, {
    x: 11.2, y: 4.6, w: 2.6, h: 2.6, rectRadius: 0.3,
    fill: { color: C.magenta }, line: { width: 0 },
  });
  s.addShape(pres.ShapeType.ellipse, {
    x: 10.5, y: 3.1, w: 0.5, h: 0.5, fill: { color: C.pink }, line: { width: 0 },
  });
  s.addText("SERASA EXPERIAN · TECNOLOGIA", {
    x: M, y: 1.6, w: 8, h: 0.3,
    margin: 0, fontFace: FONT, fontSize: 12, bold: true, color: C.pink, charSpacing: 2.4,
  });
  s.addText(
    [
      { text: "Automação de\nprocessos com ", options: { color: "FFFFFF" } },
      { text: "IA", options: { color: C.pink } },
    ],
    { x: M, y: 1.98, w: 9.9, h: 2.15, margin: 0, valign: "top", fontFace: FONT, fontSize: 42, bold: true, lineSpacing: 48 }
  );
  s.addText(
    "Como mapear o processo, implementar com eval e levar para produção.",
    { x: M, y: 4.2, w: 6.6, h: 1, margin: 0, fontFace: FONT, fontSize: 15, color: "E7DCEF", lineSpacing: 22 }
  );
  s.addText("Gabriel Corrêa", {
    x: M, y: 6.15, w: 6, h: 0.3, margin: 0, fontFace: FONT, fontSize: 13, bold: true, color: "FFFFFF",
  });
  s.addText("Palestra técnica · 25 minutos", {
    x: M, y: 6.45, w: 6, h: 0.3, margin: 0, fontFace: FONT, fontSize: 11, color: "C9B6D4",
  });
  s.addNotes(
    "Abertura curta. Nome, o que faço, e a promessa em uma frase: vocês vão sair com um método " +
      "de uma página para decidir o que automatizar. Prometa o caso prático do fim. ~1 min."
  );
}

/* ================= 02 · HOOK ================= */
{
  const s = pres.addSlide();
  s.background = { color: C.deep };
  s.addText("O PONTO DE PARTIDA", {
    x: M, y: 1.15, w: 9, h: 0.3, margin: 0, fontFace: FONT, fontSize: 11, bold: true, color: C.pink, charSpacing: 2.2,
  });
  s.addText(
    [
      { text: "A pergunta errada é ", options: { color: "FFFFFF" } },
      { text: "“o que a IA consegue fazer aqui?”", options: { color: C.pink } },
    ],
    { x: M, y: 1.6, w: 11.3, h: 1.5, margin: 0, valign: "top", fontFace: FONT, fontSize: 34, bold: true, lineSpacing: 40 }
  );
  s.addText(
    [
      { text: "A pergunta certa é: ", options: { color: "E7DCEF" } },
      { text: "neste processo, o que é decisão e o que é digitação?", options: { color: "FFFFFF", bold: true } },
    ],
    { x: M, y: 3.4, w: 10.6, h: 0.7, margin: 0, fontFace: FONT, fontSize: 18, lineSpacing: 25 }
  );
  s.addText(
    "Automação com IA é 80% desenho de processo e 20% modelo. Quem inverte essa conta entrega uma demo bonita que ninguém usa em produção.",
    { x: M, y: 4.3, w: 10.2, h: 1, margin: 0, fontFace: FONT, fontSize: 15, color: "E7DCEF", lineSpacing: 22 }
  );
  // roteiro em uma linha (substitui o slide de agenda)
  s.addText(
    [
      { text: "NOS PRÓXIMOS 25 MIN     ", options: { color: C.pink, bold: true, charSpacing: 1.6 } },
      { text: "mapear  →  decidir  →  humano na alça  →  levar para produção  →  ", options: { color: "C9B6D4" } },
      { text: "um caso real", options: { color: "FFFFFF", bold: true } },
    ],
    { x: M, y: 5.95, w: 11.9, h: 0.4, margin: 0, valign: "middle", fontFace: FONT, fontSize: 12 }
  );
  s.addNotes(
    "Pausa depois da pergunta errada; deixe o silêncio trabalhar. Esta é a tese: automação é " +
      "desenho de processo, não escolha de modelo. A linha do rodapé é a única agenda. ~1,5 min."
  );
}

/* ================= 03 · MÉTODO + NOTAÇÃO ================= */
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  header(s, "O método", [
    { text: "Quatro passos e ", options: { color: C.ink } },
    { text: "quatro formas", options: { color: C.magenta } },
    { text: ". É só isso.", options: { color: C.ink } },
  ]);
  const steps = [
    ["Desenhe o fluxo como ele acontece hoje", ", sem melhorar nada. Entreviste quem executa: a versão do gerente é a oficial, a de quem executa é a real."],
    ["Uma caixa por ação, um losango por decisão.", " Na dúvida, é decisão — decisão escondida dentro de ação é onde a automação quebra depois."],
    ["Tabele cada caixa", ": entrada, saída, dono, volume/mês, taxa de exceção, custo do erro. Sem os dois últimos, o passo 4 é chute."],
    ["Volte ao desenho e pinte cada caixa", ": código, IA ou humano. O fluxo pintado é a arquitetura."],
  ];
  const y0 = 2.3, rh = 0.82;
  steps.forEach(([lead, rest], i) => {
    badge(s, M, y0 + i * rh, 0.34, String(i + 1));
    s.addText(
      [
        { text: lead, options: { bold: true, color: C.ink } },
        { text: rest, options: { color: C.inkSoft } },
      ],
      { x: M + 0.5, y: y0 + i * rh - 0.04, w: 6.5, h: 0.74, margin: 0, valign: "top", fontFace: FONT, fontSize: 11.5, lineSpacing: 15.5 }
    );
  });

  // notação: as quatro formas, desenhadas
  const nx = 8.0;
  codeCap(s, nx, 2.18, "A notação inteira", 4.6);
  const shapes = [
    ["início / fim", "term", true, "onde o processo começa e termina", null],
    ["ação", "plain", false, "uma caixa = uma ação.", "Se tem “e” no nome, são duas."],
    ["decisão", "plain", false, "todo losango tem que ter", "uma regra escrita embaixo"],
  ];
  shapes.forEach(([label, kind, pill, d1, d2], i) => {
    const y = 2.52 + i * 0.86;
    const st = NODE_STYLE[kind];
    if (label === "decisão") {
      s.addText(label, {
        shape: pres.ShapeType.diamond,
        x: nx, y, w: 1.55, h: 0.56,
        fill: { color: st.fill }, line: { color: st.line, width: 1.25 },
        align: "center", valign: "middle", margin: 0,
        fontFace: FONT, fontSize: 11, color: st.txt,
      });
    } else {
      s.addText(label, {
        shape: pres.ShapeType.roundRect, rectRadius: pill ? 0.5 : 0.1,
        x: nx, y, w: 1.55, h: 0.56,
        fill: { color: st.fill }, line: { color: st.line, width: 1.25 },
        align: "center", valign: "middle", margin: 0,
        fontFace: FONT, fontSize: 11, bold: pill, color: st.txt,
      });
    }
    s.addText(d2 ? d1 + "\n" + d2 : d1, {
      x: nx + 1.75, y, w: 2.9, h: 0.56,
      margin: 0, valign: "middle", fontFace: FONT, fontSize: 10, color: C.inkSoft, lineSpacing: 13.5,
    });
  });
  // seta condicional
  const ya = 2.52 + 3 * 0.86;
  s.addShape(pres.ShapeType.line, {
    x: nx, y: ya + 0.3, w: 1.4, h: 0,
    line: { color: C.edge, width: 1.75, endArrowType: "triangle" },
  });
  s.addText("sim", {
    x: nx + 0.4, y: ya + 0.05, w: 0.6, h: 0.22,
    margin: 0, fontFace: FONT, fontSize: 9, bold: true, color: "6E6684",
  });
  s.addText("seta condicional —\nrotule sempre as duas saídas", {
    x: nx + 1.75, y: ya, w: 2.9, h: 0.56,
    margin: 0, valign: "middle", fontFace: FONT, fontSize: 10, color: C.inkSoft, lineSpacing: 13.5,
  });

  callout(
    s,
    "Por que fluxograma e não texto",
    [
      { text: "Processo em texto esconde decisão. Em fluxograma, decisão tem forma própria — e é exatamente onde você vai escolher entre código, IA e humano. ", options: {} },
      { text: "O desenho não é documentação, é a ferramenta de decisão.", options: { bold: true } },
    ],
    5.82
  );
  footer(s, "01 · Mapear");
  s.addNotes(
    "Este é o slide do método. Diga que a notação inteira são quatro formas — não é BPMN, " +
      "não precisa de ferramenta, papel resolve. O passo 4 é o que ninguém faz. ~2,5 min."
  );
}

/* ================= 04 · FLUXO COMO É HOJE ================= */
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  header(s, "Passos 1 e 2 · exemplo real", [
    { text: "Triagem de solicitação de suporte, ", options: { color: C.ink } },
    { text: "como acontece hoje", options: { color: C.magenta } },
  ]);
  triagem(s, false);
  callout(
    s,
    "O que este desenho já entrega",
    [
      { text: "Seis ações, uma decisão, duas saídas rotuladas — e a regra do losango escrita. ", options: {} },
      { text: "Nada aqui é sobre IA ainda.", options: { bold: true } },
      { text: " Quem tenta desenhar isso e não consegue fechar as setas descobriu que tem dois processos, não um.", options: {} },
    ],
    5.92
  );
  footer(s, "01 · Mapear");
  s.addNotes(
    "Percorra o fluxo com o dedo, uma caixa por vez. Insista que ainda não se falou de IA — " +
      "e que a regra do losango escrita já é metade da decisão de arquitetura. ~2 min."
  );
}

/* ================= 05 · CANVAS ================= */
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  header(
    s,
    "Passo 3 · a tabela",
    [
      { text: "O canvas — ", options: { color: C.ink } },
      { text: "uma linha por caixa do fluxo", options: { color: C.magenta } },
    ],
    { lede: "As duas colunas destacadas são as que decidem tudo no passo 4." }
  );
  const th = (t, hi) => ({
    text: t,
    options: {
      fill: { color: hi ? C.magenta : C.navy }, color: "FFFFFF",
      bold: true, fontSize: 10.5, fontFace: FONT, align: "left", valign: "middle",
    },
  });
  const td = (t, o) => ({
    text: t,
    options: Object.assign({ color: C.inkSoft, fontSize: 10.5, fontFace: FONT, valign: "middle" }, o || {}),
  });
  const rows = [
    [th("Caixa do fluxo"), th("Entrada"), th("Saída"), th("É decisão?", true), th("Custo do erro", true), th("Exceções"), th("Volume/mês"), th("Dono")],
    [td("Registrar ticket", { color: C.ink, bold: true }), td("e-mail, formulário"), td("ticket criado"), td("Não"), td("baixo", { color: C.green, bold: true }), td("2%"), td("12.000"), td("Suporte")],
    [td("Classificar assunto", { color: C.ink, bold: true }), td("texto livre"), td("categoria"), td("Sim — ambígua"), td("baixo", { color: C.green, bold: true }), td("15%"), td("12.000"), td("Suporte")],
    [td("Redigir resposta", { color: C.ink, bold: true }), td("contexto + histórico"), td("texto"), td("Sim — ambígua"), td("médio", { color: C.amber, bold: true }), td("20%"), td("9.000"), td("Suporte")],
    [td("Precisa aprovação?", { color: C.ink, bold: true }), td("valor do desconto"), td("sim / não"), td("Sim — regra fixa"), td("alto", { color: C.magenta, bold: true }), td("5%"), td("12.000"), td("Suporte")],
    [td("Gestor revisa e aprova", { color: C.ink, bold: true }), td("proposta"), td("decisão"), td("Sim — julgamento"), td("alto, irreversível", { color: C.magenta, bold: true }), td("—"), td("300"), td("Gestor")],
  ];
  s.addTable(rows, {
    x: M, y: 2.5, w: W - 2 * M,
    colW: [2.5, 1.8, 1.35, 1.75, 1.85, 1.0, 1.15, 0.49],
    rowH: 0.42,
    border: { type: "solid", color: C.line, pt: 1 },
    fill: { color: C.paper },
    margin: 0.07,
  });
  callout(
    s,
    "Como ler",
    [
      { text: "Decisão ambígua + erro tolerável → ", options: {} }, { text: "IA", options: { bold: true } },
      { text: ". Regra fixa, mesmo com erro caro → ", options: {} }, { text: "código", options: { bold: true } },
      { text: ". Julgamento irreversível → ", options: {} }, { text: "humano", options: { bold: true } },
      { text: ". Digitação → ", options: {} }, { text: "código", options: { bold: true } },
      { text: ". A tabela decide, você só transcreve para o desenho.", options: {} },
    ],
    5.62
  );
  footer(s, "01 · Mapear");
  s.addNotes(
    "SLIDE-CHAVE — dê tempo, a plateia fotografa. Uma linha por caixa do fluxo anterior: " +
      "o canvas não é outro documento, é o mesmo desenho em forma de tabela. " +
      "Percorra só as duas colunas destacadas. ~3 min."
  );
}

/* ================= 06 · FLUXO PINTADO ================= */
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  header(s, "Passo 4 · o entregável de verdade", [
    { text: "O mesmo fluxo, pintado — e pronto, ", options: { color: C.ink } },
    { text: "essa é a arquitetura", options: { color: C.magenta } },
  ]);
  triagem(s, true);
  callout(
    s,
    "Como ler o resultado",
    [
      { text: "As duas caixas rosas são ", options: {} },
      { text: "21.000 execuções/mês de decisão ambígua com erro tolerável", options: { bold: true } },
      { text: " — é aí que a IA se paga. A lavanda são 300 julgamentos irreversíveis por mês: continua humana, e é barato que continue. O losango parece decisão de IA e não é.", options: {} },
    ],
    5.92
  );
  footer(s, "01 · Mapear");
  s.addNotes(
    "O ponto alto da primeira parte. Mesmo desenho, três cores — e a arquitetura apareceu " +
      "sem ninguém escrever documento. Destaque que o losango engana: parece IA, é um if. ~2 min."
  );
}

/* ================= 07 · ÁRVORE DE DECISÃO ================= */
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  header(
    s,
    "A árvore · rode uma vez por linha do canvas",
    [
      { text: "Quatro perguntas e a etapa ", options: { color: C.ink } },
      { text: "se classifica sozinha", options: { color: C.magenta } },
    ],
    { size: 27, lnspc: 31, titleW: 8.2 }
  );
  // o quinto caminho, no canto livre ao lado do título
  ftext(s, 880, 104, "E O QUINTO CAMINHO", { bold: true, size: 9, color: C.purple, w: 3.6, h: 0.2 });
  s.addText(
    [
      { text: "A árvore classifica ", options: {} },
      { text: "etapa de processo", options: { bold: true } },
      { text: ". Trabalho de especialista — código, análise, redação — não entra: ali é ", options: {} },
      { text: "copiloto", options: { bold: true, color: C.purple } },
      { text: ".", options: {} },
    ],
    { x: px(880), y: px(124), w: 3.7, h: 0.8, margin: 0, valign: "top", fontFace: FONT, fontSize: 10, color: C.inkSoft, lineSpacing: 13.5 }
  );

  const qs = [
    [256, ["A regra é fixa", "e estável?"]],
    [348, ["Verificar custa menos", "que executar?"]],
    [440, ["O erro é caro?"]],
    [532, ["É reversível?"]],
  ];
  qs.forEach(([cy, lines]) => fdiamond(s, 240, cy, 150, 34, lines, "plain", { size: 10 }));

  // descidas
  [[290, 308, "não"], [382, 400, "sim"], [474, 492, "sim"]].forEach(([y1, y2, lb]) => {
    edge(s, [[240, y1], [240, y2]]);
    ftext(s, 248, (y1 + y2) / 2, lb, { bold: true, size: 8.5, color: "6E6684", w: 0.42 });
  });

  const leaves = [
    [256, "CÓDIGO — não use LLM", "code", "sim", ["Um if você testa uma vez", "e confia para sempre."]],
    [348, "AINDA NÃO AUTOMATIZE", "todo", "não", ["Torne verificável primeiro. Senão", "a automação vira trabalho novo."]],
    [440, "IA + revisão por amostragem", "ia", "não", ["O ganho fácil. Comece por aqui,", "não pelo processo mais visível."]],
    [532, "IA + humano supervisiona", "ia", "sim", ["Só vale com undo real e alerta.", "Painel que ninguém abre não conta."]],
  ];
  leaves.forEach(([cy, label, kind, lb, notes]) => {
    edge(s, [[390, cy], [464, cy]]);
    ftext(s, 404, cy - 12, lb, { bold: true, size: 8.5, color: "6E6684", w: 0.42 });
    fnode(s, 470, cy - 28, 330, 56, [label], kind, { size: 12, bold: true, italic: kind === "todo" });
    s.addText(notes.join("\n"), {
      x: px(820), y: px(cy) - 0.24, w: 3.7, h: 0.48,
      margin: 0, valign: "middle", fontFace: FONT, fontSize: 10, color: C.inkSoft, lineSpacing: 13.5,
    });
  });
  // quinta folha
  edge(s, [[240, 566], [240, 624], [464, 624]]);
  ftext(s, 248, 590, "não", { bold: true, size: 8.5, color: "6E6684", w: 0.42 });
  fnode(s, 470, 596, 330, 56, ["IA propõe + humano aprova"], "hum", { size: 12, bold: true });
  s.addText("Caro e irreversível. O clique\nhumano é o produto aqui.", {
    x: px(820), y: px(624) - 0.24, w: 3.7, h: 0.48,
    margin: 0, valign: "middle", fontFace: FONT, fontSize: 10, color: C.inkSoft, lineSpacing: 13.5,
  });
  footer(s, "02 · Decidir");
  s.addNotes(
    "Percorra a árvore em voz alta com UMA linha do canvas — de preferência 'Classificar " +
      "assunto'. A primeira pergunta é a que mais economiza dinheiro: se é regra fixa, é código. " +
      "A segunda é a que ninguém faz e é a que evita projeto morto. ~3 min."
  );
}

/* ================= 08 · ESCALONAMENTO (CÓDIGO) ================= */
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  header(s, "O padrão mais útil, na prática", [
    { text: "Escalonamento por confiança — ", options: { color: C.ink } },
    { text: "são doze linhas", options: { color: C.magenta } },
  ]);
  codeCap(s, M, 2.32, "triagem.py");
  codeBlock(s, M, 2.6, 7.5, 3.05, [
    [["# o schema é o contrato: sem ele não há limiar nem log", "c"]],
    [["class ", "k"], ["Triagem", "w"], ["(BaseModel):", "t"]],
    [["    categoria: ", "t"], ["Literal", "v"], ['["cobranca", "fraude", "cadastro", "outro"]', "s"]],
    [["    confianca: ", "t"], ["float", "v"], ["        # 0-1, exigido no prompt", "c"]],
    [["    justificativa: ", "t"], ["str", "v"], ["     # 1 frase — vai para o log", "c"]],
    [["    faltou_contexto: ", "t"], ["bool", "v"], ["   # o caminho explícito de \"não sei\"", "c"]],
    [],
    [["r = ", "t"], ["classificar", "w"], ["(ticket)   ", "t"], ["# saída estruturada", "c"]],
    [["if ", "k"], ["r.faltou_contexto ", "t"], ["or ", "k"], ["r.confianca < LIMIAR:", "t"]],
    [["    fila_humana.", "t"], ["enfileirar", "w"], ["(ticket, sugestao=r)  ", "t"], ["# COM a sugestão", "c"]],
    [["else", "k"], [":", "t"]],
    [["    ", "t"], ["rotear", "w"], ["(ticket, r.categoria)", "t"]],
    [["registrar", "w"], ["(ticket.id, r, modelo=MODELO, prompt_v=PROMPT_V)", "t"]],
  ], 9);

  const cx = 8.5, cw = W - M - cx;
  const notes = [
    ["O limiar sai do eval", "Rode os casos, veja onde o acerto cai, escolha ali. Começamos em 0.85 — o ponto em que o erro confiante zerou.", C.paper, C.magenta],
    ["Escalone com a sugestão", "Fila que chega em branco custa o mesmo que não ter automação. Com categoria sugerida + justificativa, o humano confirma em segundos.", C.paper, C.magenta],
  ];
  let cy = 2.6;
  notes.forEach(([t, d, bg, tc]) => {
    const h = 1.18;
    card(s, cx, cy, cw, h, bg);
    s.addText(t, {
      x: cx + 0.24, y: cy + 0.16, w: cw - 0.48, h: 0.26,
      margin: 0, fontFace: FONT, fontSize: 12, bold: true, color: tc,
    });
    s.addText(d, {
      x: cx + 0.24, y: cy + 0.46, w: cw - 0.48, h: 0.6,
      margin: 0, valign: "top", fontFace: FONT, fontSize: 10, color: C.inkSoft, lineSpacing: 13.5,
    });
    cy += h + 0.16;
  });
  card(s, cx, cy, cw, 0.8, C.lavender);
  s.addText(
    [
      { text: "Meça a taxa de escalonamento. ", options: { bold: true, color: C.purple } },
      { text: "Subiu? Mudou o contexto ou apareceu categoria nova — não é o modelo piorando.", options: { color: C.inkSoft } },
    ],
    { x: cx + 0.24, y: cy + 0.1, w: cw - 0.48, h: 0.62, margin: 0, valign: "top", fontFace: FONT, fontSize: 10, lineSpacing: 13.5 }
  );

  callout(
    s,
    "O detalhe que quase todo mundo esquece",
    [
      { text: "Sem faltou_contexto, o modelo nunca diz \"não sei\" — ele chuta com confiança alta.", options: { bold: true } },
      { text: " \"Não sei\" precisa ser uma saída válida e explicitamente permitida no prompt, senão você mediu confiança de um modelo que não tem como discordar de si mesmo.", options: {} },
    ],
    5.85
  );
  footer(s, "03 · Humano na alça");
  s.addNotes(
    "Leia o código em voz alta — são doze linhas, cabe. O que importa não é o código, é o " +
      "schema: sem faltou_contexto e confianca não existe limiar nem log. " +
      "Este é o slide que transforma 'human in the loop' de conceito em implementação. ~3 min."
  );
}

/* ================= 09 · RUBBER STAMPING ================= */
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  header(s, "O anti-padrão que passa em toda auditoria", [
    { text: "Se o humano aprova 400 itens por dia, não existe humano na alça — existe um ", options: { color: C.ink } },
    { text: "ritual de aprovação", options: { color: C.magenta } },
  ]);
  const cw = (W - 2 * M) / 2 - 0.2, y = 2.75, ch = 3.0;
  card(s, M, y, cw, ch, C.paper);
  s.addText("Três perguntas para saber se o checkpoint é real", {
    x: M + 0.34, y: y + 0.3, w: cw - 0.68, h: 0.6,
    margin: 0, valign: "top", fontFace: FONT, fontSize: 15, bold: true, color: C.magenta, lineSpacing: 20,
  });
  [
    "O revisor tem tempo e informação suficientes para discordar?",
    "Existe registro de quando ele discordou? Taxa de rejeição de 0% é alarme, não é qualidade.",
    "Se a revisão por amostragem daria o mesmo resultado, a revisão item a item é teatro — e está custando uma pessoa.",
  ].forEach((t, i) => {
    s.addText(
      [{ text: `${i + 1}. `, options: { bold: true, color: C.ink } }, { text: t, options: { color: C.inkSoft } }],
      { x: M + 0.34, y: y + 1.0 + i * 0.66, w: cw - 0.68, h: 0.62, margin: 0, valign: "top", fontFace: FONT, fontSize: 12, lineSpacing: 16 }
    );
  });

  const x2 = M + cw + 0.4;
  card(s, x2, y, cw, ch, C.lavender);
  s.addText("O lado regulatório", {
    x: x2 + 0.34, y: y + 0.3, w: cw - 0.68, h: 0.32,
    margin: 0, fontFace: FONT, fontSize: 15, bold: true, color: C.purple,
  });
  s.addText(
    [
      { text: "A LGPD, art. 20", options: { bold: true, color: C.ink } },
      { text: " garante ao titular o direito de solicitar revisão de decisões tomadas unicamente com base em tratamento automatizado que afetem seus interesses.", options: { color: C.inkSoft } },
    ],
    { x: x2 + 0.34, y: y + 0.72, w: cw - 0.68, h: 0.85, margin: 0, valign: "top", fontFace: FONT, fontSize: 12, lineSpacing: 16 }
  );
  s.addText(
    [
      { text: "Em serviço financeiro isso não é rodapé jurídico: é o que define quais etapas ", options: { color: C.inkSoft } },
      { text: "podem", options: { bold: true, color: C.ink } },
      { text: " ser 100% automáticas — e obriga rastro de qual versão do modelo decidiu o quê, quando.", options: { color: C.inkSoft } },
    ],
    { x: x2 + 0.34, y: y + 1.62, w: cw - 0.68, h: 0.85, margin: 0, valign: "top", fontFace: FONT, fontSize: 12, lineSpacing: 16 }
  );
  s.addText(
    [
      { text: "Consequência prática: ", options: { bold: true } },
      { text: "desenhe o log de decisão junto com o fluxo — é o slide seguinte.", options: {} },
    ],
    { x: x2 + 0.34, y: y + 2.5, w: cw - 0.68, h: 0.42, margin: 0, valign: "top", fontFace: FONT, fontSize: 11.5, color: C.purple, lineSpacing: 15 }
  );
  footer(s, "03 · Humano na alça");
  s.addNotes(
    "Slide mais relevante para o contexto Serasa. 'Taxa de rejeição 0% é alarme' costuma gerar " +
      "pergunta. No art. 20 seja preciso: o direito é à revisão, e o gatilho é a decisão tomada " +
      "UNICAMENTE por tratamento automatizado. ~2,5 min."
  );
}

/* ================= 10 · CAMADAS ================= */
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  header(s, "A stack por camada", [
    { text: "Seis camadas — e as ", options: { color: C.ink } },
    { text: "duas", options: { color: C.magenta } },
    { text: " que decidem se vai para produção", options: { color: C.ink } },
  ]);
  const layers = [
    ["Modelo", "Claude · GPT · Gemini · modelo aberto self-hosted", false],
    ["Agente e código", "Claude Code · Claude Agent SDK · Cursor · LangGraph", false],
    ["Orquestração", "Temporal · Airflow · Step Functions · n8n — retry, idempotência, estado", true],
    ["Integração", "MCP · APIs internas — um protocolo no lugar de N integrações sob medida", false],
    ["Contexto e dados", "A busca que você já tem · banco vetorial só quando a busca simples falhar", false],
    ["Eval e observabilidade", "Conjunto de casos versionado · Langfuse · Braintrust · traço com input, output e versão", true],
  ];
  const y0 = 2.42, rh = 0.5, rg = 0.08;
  layers.forEach(([name, tools, key], i) => {
    const y = y0 + i * (rh + rg);
    s.addShape(pres.ShapeType.roundRect, {
      x: M, y, w: W - 2 * M, h: rh, rectRadius: 0.08,
      fill: { color: key ? "FEF6FA" : C.paper },
      line: { color: key ? C.magenta : C.line, width: 1 },
    });
    s.addText(name, {
      x: M + 0.28, y, w: 2.7, h: rh,
      margin: 0, valign: "middle", fontFace: FONT, fontSize: 12.5, bold: true, color: C.ink,
    });
    s.addText(tools, {
      x: M + 3.05, y, w: W - 2 * M - 3.35, h: rh,
      margin: 0, valign: "middle", fontFace: FONT, fontSize: 11.5, color: key ? C.magenta : C.purple,
    });
  });
  callout(
    s,
    "O que separa piloto de produção",
    [
      { text: "Todo piloto tem a camada de modelo. O que quase nenhum tem é ", options: {} },
      { text: "orquestração", options: { bold: true } },
      { text: " e ", options: {} },
      { text: "eval", options: { bold: true } },
      { text: " — e são exatamente as duas que decidem se aquilo sobrevive ao terceiro mês.", options: {} },
    ],
    5.92
  );
  footer(s, "04 · Ferramentas");
  s.addNotes(
    "Passe rápido, não venda ferramenta. As duas linhas destacadas são o recado. " +
      "Sobre banco vetorial seja direto: na maioria dos casos a busca que a empresa já tem " +
      "resolve. Se o tempo apertar, este é o slide para acelerar. ~1,5 min."
  );
}

/* ================= 11 · EVAL SET ================= */
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  header(s, "O artefato que separa automação de aposta", [
    { text: "O eval set é um arquivo. ", options: { color: C.ink } },
    { text: "Comece por ele", options: { color: C.magenta } },
    { text: ", não pelo prompt.", options: { color: C.ink } },
  ]);
  codeCap(s, M, 2.4, "evals/triagem.yaml  ·  versionado no repo, revisado em PR");
  codeBlock(s, M, 2.68, 7.5, 2.78, [
    [["# 20 casos REAIS tirados do histórico — não inventados", "c"]],
    [["- id: cob-001", "t"]],
    [["  entrada: ", "t"], ['"não reconheço a cobrança de R$ 89,90 no cartão"', "s"]],
    [["  esperado: { categoria: cobranca, escalona: ", "t"], ["false", "v"], [" }", "t"]],
    [],
    [["- id: frd-014", "t"]],
    [["  entrada: ", "t"], ['"abriram conta no meu CPF, quero registrar fraude"', "s"]],
    [["  esperado: { categoria: fraude, escalona: ", "t"], ["false", "v"], [" }", "t"]],
    [],
    [["# os casos de borda são os que importam:", "c"]],
    [["# este é ambíguo de propósito e DEVE escalonar", "c"]],
    [["- id: amb-007", "t"]],
    [["  entrada: ", "t"], ['"cobrança que não fiz, acho que usaram meus dados"', "s"]],
    [["  esperado: { escalona: ", "t"], ["true", "v"], [" }", "t"]],
  ], 8.5);
  codeCap(s, M, 5.58, "no CI, bloqueando merge");
  codeBlock(s, M, 5.86, 7.5, 0.5, [
    [["pytest", "w"], [" evals/ --limiar 0.85   ", "t"], ["# falha = não entra em produção", "c"]],
  ], 9);

  const cx = 8.5, cw = W - M - cx;
  card(s, cx, 2.68, cw, 2.15, C.paper);
  s.addText("Os três números", {
    x: cx + 0.26, y: 2.86, w: cw - 0.52, h: 0.28,
    margin: 0, fontFace: FONT, fontSize: 13, bold: true, color: C.magenta,
  });
  [
    ["Acerto por categoria", " — média esconde a categoria que vai mal.", C.inkSoft],
    ["Taxa de escalonamento", " — o custo humano que você está criando.", C.inkSoft],
    ["Erro confiante", " — errou com confiança acima do limiar. Este é o número que mata o projeto. Meta: zero.", C.magenta],
  ].forEach(([b, r, rc], i) => {
    s.addText(
      [{ text: b, options: { bold: true, color: C.ink } }, { text: r, options: { color: rc } }],
      { x: cx + 0.26, y: 3.2 + i * 0.54, w: cw - 0.52, h: 0.56, margin: 0, valign: "top", fontFace: FONT, fontSize: 10, lineSpacing: 13.5 }
    );
  });
  card(s, cx, 4.98, cw, 1.38, C.lavender);
  s.addText("Vinte casos bastam", {
    x: cx + 0.26, y: 5.14, w: cw - 0.52, h: 0.28,
    margin: 0, fontFace: FONT, fontSize: 13, bold: true, color: C.purple,
  });
  s.addText(
    [
      { text: "Não espere ter mil. Vinte casos reais, sendo ", options: {} },
      { text: "cinco de borda", options: { bold: true, color: C.ink } },
      { text: ", já pegam quase toda regressão. O eval que existe vale mais que o eval perfeito que você faria depois.", options: {} },
    ],
    { x: cx + 0.26, y: 5.48, w: cw - 0.52, h: 0.8, margin: 0, valign: "top", fontFace: FONT, fontSize: 10, color: C.inkSoft, lineSpacing: 13.5 }
  );
  footer(s, "04 · Ferramentas");
  s.addNotes(
    "Insista na inversão: o eval vem ANTES do prompt. E no número que mata projeto: erro " +
      "confiante. Se der abertura, conte que 20 casos com 5 de borda já pega quase tudo — " +
      "tira a desculpa de 'não tenho dados suficientes'. ~2,5 min."
  );
}

/* ================= 12 · PROMPT + REGISTRO ================= */
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  header(s, "Os outros dois artefatos", [
    { text: "O prompt tem anatomia. E toda decisão ", options: { color: C.ink } },
    { text: "deixa rastro", options: { color: C.magenta } },
    { text: ".", options: { color: C.ink } },
  ]);
  const half = (W - 2 * M) / 2 - 0.2;
  codeCap(s, M, 2.32, "prompts/triagem.v4.md  ·  sete seções, sempre nessa ordem", 6.0);
  codeBlock(s, M, 2.6, half, 3.85, [
    [["## 1. Papel", "c"]],
    [["Você tria solicitações de suporte de um bureau.", "t"]],
    [],
    [["## 2. Tarefa", "c"]],
    [["Classifique em UMA categoria e informe a confiança.", "t"]],
    [],
    [["## 3. Dados", "c"]],
    [["{{ticket}}  {{historico_do_cliente}}", "t"]],
    [],
    [["## 4. Regras de decisão", "c"]],
    [["- CPF usado por terceiro -> sempre ", "t"], ["fraude", "s"], [".", "t"]],
    [["- Valor contestado + suspeita -> escalone.", "t"]],
    [],
    [["## 5. Formato de saída", "c"]],
    [["JSON no schema Triagem. Nada fora do JSON.", "t"]],
    [],
    [["## 6. Quando NÃO decidir", "c"]],
    [["Falta histórico ou cabe em duas categorias ->", "t"]],
    [["faltou_contexto: true", "s"], [". Não chute.", "t"]],
    [],
    [["## 7. Casos de borda", "c"]],
    [["<3 exemplos vindos direto do eval set>", "t"]],
  ], 8.5);

  const x2 = M + half + 0.4;
  codeCap(s, x2, 2.32, "o registro de cada decisão  ·  uma linha por execução", 6.0);
  codeBlock(s, x2, 2.6, half, 2.5, [
    [["{", "t"]],
    [['  "ticket"', "v"], [': ', "t"], ['"T-88421"', "s"], [",", "t"]],
    [['  "ts"', "v"], [': ', "t"], ['"2026-07-30T14:02:11Z"', "s"], [",", "t"]],
    [['  "modelo"', "v"], [': ', "t"], ['"<id e versão fixados>"', "s"], [",", "t"]],
    [['  "prompt_v"', "v"], [': ', "t"], ['"4"', "s"], [",", "t"]],
    [['  "entrada"', "v"], [': ', "t"], ['"<hash + referência>"', "s"], [",", "t"]],
    [['  "saida"', "v"], [': { ', "t"], ['"categoria"', "v"], [": ", "t"], ['"fraude"', "s"], [", ... },", "t"]],
    [['  "confianca"', "v"], [": ", "t"], ["0.91", "v"], [",", "t"]],
    [['  "decidiu"', "v"], [': ', "t"], ['"automatico"', "s"], [",", "t"]],
    [['  "revisado_por"', "v"], [": ", "t"], ["null", "v"], [",", "t"]],
    [['  "revertido_em"', "v"], [": ", "t"], ["null", "v"]],
    [["}", "t"]],
  ], 8.5);

  card(s, x2, 5.25, half, 1.2, C.lavender);
  s.addText("POR QUE EXATAMENTE ESSES CAMPOS", {
    x: x2 + 0.26, y: 5.38, w: half - 0.52, h: 0.22,
    margin: 0, fontFace: FONT, fontSize: 9, bold: true, color: C.magenta, charSpacing: 1.2,
  });
  s.addText(
    [
      { text: "modelo + prompt_v", options: { bold: true, color: C.ink } },
      { text: " = reproduzir a decisão seis meses depois. ", options: {} },
      { text: "decidiu + revisado_por", options: { bold: true, color: C.ink } },
      { text: " = responder ao art. 20 sem arqueologia. ", options: {} },
      { text: "revertido_em", options: { bold: true, color: C.ink } },
      { text: " sempre null = ou está perfeito, ou ninguém está olhando.", options: {} },
    ],
    { x: x2 + 0.26, y: 5.64, w: half - 0.52, h: 0.72, margin: 0, valign: "top", fontFace: FONT, fontSize: 10, color: C.inkSoft, lineSpacing: 13 }
  );
  footer(s, "04 · Ferramentas");
  s.addNotes(
    "Não leia as sete seções — aponte a 6 ('quando NÃO decidir'), que é a que quase todo " +
      "prompt não tem. No registro, o campo mais interessante é revertido_em: se está sempre " +
      "null, ou está perfeito ou ninguém olha. ~2,5 min."
  );
}

/* ================= 13 · CHECKLIST ================= */
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  header(s, "O portão antes de produção", [
    { text: "Doze itens. Desmarcado é ", options: { color: C.ink } },
    { text: "risco assumido", options: { color: C.magenta } },
    { text: ", não esquecimento.", options: { color: C.ink } },
  ]);
  const items = [
    ["Eval set no repo", ", 20 casos, rodando no CI e bloqueando merge."],
    ["Versão do modelo fixada.", " Atualizar é deploy: eval antes, rollback previsto."],
    ["Prompt versionado em arquivo", " e revisado em PR. Não mora em Google Doc."],
    ["Saída estruturada com schema", " validado no código, não texto livre."],
    ["Caminho de “não sei”", " existe, é permitido no prompt e é medido."],
    ["Conta feita em código", ", não pedida ao modelo. Ferramenta antes de aritmética."],
    ["Registro por execução", " com modelo, versão do prompt e quem decidiu."],
    ["Retry e idempotência", " na orquestração. Reprocessar não duplica efeito."],
    ["Custo por execução medido", " e multiplicado pelo volume do canvas."],
    ["Você sabe qual campo de dado sai", " da empresa — o campo, não a ferramenta."],
    ["Undo existe", " onde o padrão é supervisão. Sem undo, não é supervisão."],
    ["Tem dono com nome", " e data de revisão na agenda. Não nome de squad."],
  ];
  const colW = (W - 2 * M) / 2 - 0.3, y0 = 2.46, rh = 0.6;
  items.forEach(([lead, rest], i) => {
    const col = i < 6 ? 0 : 1;
    const row = i % 6;
    const x = M + col * (colW + 0.6);
    const y = y0 + row * rh;
    s.addShape(pres.ShapeType.roundRect, {
      x, y: y + 0.03, w: 0.22, h: 0.22, rectRadius: 0.04,
      fill: { color: C.paper }, line: { color: C.magenta, width: 1.75 },
    });
    s.addText(
      [{ text: lead, options: { bold: true, color: C.ink } }, { text: rest, options: { color: C.inkSoft } }],
      { x: x + 0.38, y, w: colW - 0.38, h: 0.56, margin: 0, valign: "top", fontFace: FONT, fontSize: 11, lineSpacing: 14.5 }
    );
  });
  callout(
    s,
    "Como usar",
    [
      { text: "Não é lista de boas intenções, é ", options: {} },
      { text: "portão de produção", options: { bold: true } },
      { text: ". Rode antes de ligar o fluxo, e trate item desmarcado como risco aceito conscientemente — com nome e data ao lado.", options: {} },
    ],
    6.1,
    0.82
  );
  footer(s, "04 · Práticas");
  s.addNotes(
    "Não leia os doze. Diga que é portão, não lista de desejos, e destaque três: eval no CI, " +
      "caminho de 'não sei', e dono com nome. O resto é material de consulta. ~1,5 min."
  );
}

/* ================= 14 · CASO: FLUXO ================= */
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  header(s, "Caso prático · o processo", [
    { text: "O meu fluxo, na mesma notação — e ", options: { color: C.ink } },
    { text: "quem executa cada caixa", options: { color: C.magenta } },
  ]);
  // esqueleto de fluxo para preencher, na notação ensinada no slide 3
  fnode(s, 70, 300, 120, 70, ["Início"], "term", { pill: true, size: 11 });
  [1, 2, 3, 4].forEach((n, i) => {
    const x = 240 + i * 215;
    const kind = i === 2 ? "hum" : "code";
    fnode(s, x, 300, 180, 70, ["Etapa " + n, "(preencher)"], kind, { size: 11, italic: true });
    ftag(s, x + 90, 394, i === 2 ? "HUMANO APROVA" : "AUTOMÁTICO", i === 2 ? C.purple : C.navy);
    edge(s, [[x - 50, 335], [x - 6, 335]]);
  });
  fnode(s, 1100, 300, 110, 70, ["Fim"], "term", { pill: true, size: 11 });
  edge(s, [[1025, 335], [1094, 335]]);

  callout(
    s,
    "A preencher com o seu caso",
    [
      {
        text: "Troque as quatro caixas pelo fluxo real e pinte cada uma como no slide 6: azul = código, rosa = IA, lavanda = humano. Se o seu fluxo tem decisão, use losango e escreva a regra embaixo. O contraste de cor precisa deixar óbvio, de longe, onde você continuou na alça.",
        options: { italic: true },
      },
    ],
    5.35,
    1.1
  );
  footer(s, "05 · Caso prático");
  s.addNotes(
    "PREENCHER com o seu caso. Conte como história, não como lista. Use a MESMA notação do " +
      "slide 3 — o retorno visual é o que amarra a palestra. ~2 min."
  );
}

/* ================= 15 · CASO: RESULTADO ================= */
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  header(s, "Caso prático · resultado e cicatrizes", [
    { text: "O que ganhei, o que ", options: { color: C.ink } },
    { text: "quebrou", options: { color: C.magenta } },
    { text: ", e o que eu faria diferente", options: { color: C.ink } },
  ]);
  const blocks = [
    ["Antes → depois", "Tempo por execução: de X para Y\nVolume que passou a caber: Z\nCusto por execução: R$ —\n\nUm número que você consiga defender vale mais que três estimados."],
    ["O que quebrou", "A falha mais interessante do projeto — de preferência uma em que o modelo errou com confiança e você só descobriu depois.\n\nComo detectou, e qual guarda-corpo entrou depois."],
    ["O que eu faria diferente", "Uma coisa concreta. Normalmente: “teria escrito o eval antes do prompt” ou “teria começado por uma etapa menor”."],
  ];
  const cw = 3.87, gap = 0.32, y = 2.65, ch = 2.75;
  blocks.forEach(([t, d], i) => {
    const x = M + i * (cw + gap);
    s.addShape(pres.ShapeType.roundRect, {
      x, y, w: cw, h: ch, rectRadius: 0.1,
      fill: { color: "FEF6FA" },
      line: { color: C.magenta, width: 1, dashType: "dash" },
    });
    s.addText(t.toUpperCase(), {
      x: x + 0.3, y: y + 0.26, w: cw - 0.6, h: 0.26,
      margin: 0, fontFace: FONT, fontSize: 9.5, bold: true, color: C.magenta, charSpacing: 1.5,
    });
    s.addText(d, {
      x: x + 0.3, y: y + 0.62, w: cw - 0.6, h: ch - 0.9,
      margin: 0, valign: "top", fontFace: FONT, fontSize: 11.5, color: C.inkSoft, lineSpacing: 16,
    });
  });
  callout(
    s,
    "Onde o humano ficou — e por quê",
    [
      {
        text: "Amarre à árvore do slide 7: qual folha classificou cada etapa, e o que aconteceu quando você tentou tirar o humano de onde ele era necessário.",
        options: { italic: true },
      },
    ],
    5.85
  );
  footer(s, "05 · Caso prático");
  s.addNotes(
    "PREENCHER. O quadro do meio é o mais valioso: plateia técnica confia em quem mostra a " +
      "falha. Feche amarrando à árvore de decisão. ~2,5 min."
  );
}

/* ================= 16 · FECHO ================= */
{
  const s = pres.addSlide();
  s.background = { color: C.deep };
  s.addShape(pres.ShapeType.roundRect, {
    x: 11.4, y: -0.9, w: 2.8, h: 2.8, rectRadius: 0.3,
    fill: { color: "FFFFFF", transparency: 93 }, line: { width: 0 },
  });
  s.addText("PARA LEVAR", {
    x: M, y: 0.85, w: 8, h: 0.3,
    margin: 0, fontFace: FONT, fontSize: 11, bold: true, color: C.pink, charSpacing: 2.2,
  });
  s.addText(
    [
      { text: "Três frases e ", options: { color: "FFFFFF" } },
      { text: "um desafio de uma semana", options: { color: C.pink } },
    ],
    { x: M, y: 1.25, w: 11, h: 0.6, margin: 0, fontFace: FONT, fontSize: 26, bold: true }
  );
  const three = [
    [{ text: "Desenhe o fluxo ", options: {} }, { text: "antes", options: { bold: true } }, { text: " de escolher a ferramenta.", options: {} }],
    [{ text: "Pinte cada caixa: código, IA ou humano. ", options: {} }, { text: "O desenho pintado é a arquitetura", options: { bold: true } }, { text: ".", options: {} }],
    [{ text: "Sem eval e sem dono, nenhuma automação sobrevive ao ", options: {} }, { text: "terceiro mês", options: { bold: true } }, { text: ".", options: {} }],
  ];
  three.forEach((runs, i) => {
    const y = 2.35 + i * 0.82;
    s.addText(String(i + 1).padStart(2, "0"), {
      x: M, y, w: 0.5, h: 0.4,
      margin: 0, valign: "middle", fontFace: FONT, fontSize: 13, bold: true, color: C.pink,
    });
    s.addText(runs.map((r) => ({ text: r.text, options: Object.assign({ color: "FFFFFF" }, r.options) })), {
      x: M + 0.62, y, w: 10.6, h: 0.5, margin: 0, valign: "middle", fontFace: FONT, fontSize: 17, lineSpacing: 23,
    });
  });
  s.addShape(pres.ShapeType.roundRect, {
    x: M, y: 5.1, w: W - 2 * M, h: 1.35, rectRadius: 0.1,
    fill: { color: "FFFFFF", transparency: 90 }, line: { width: 0 },
  });
  s.addText("DESAFIO", {
    x: M + 0.34, y: 5.28, w: 6, h: 0.24,
    margin: 0, fontFace: FONT, fontSize: 9.5, bold: true, color: C.pink, charSpacing: 1.8,
  });
  s.addText(
    [
      { text: "Escolha um processo que você executa toda semana. Desenhe o fluxo numa folha. Pinte as caixas. Automatize ", options: {} },
      { text: "só a mais azul", options: { bold: true } },
      { text: " — a mais determinística. Escreva os 20 casos de eval antes do prompt. Meça. Depois volte para a segunda caixa.", options: {} },
    ],
    { x: M + 0.34, y: 5.56, w: W - 2 * M - 0.68, h: 0.75, margin: 0, valign: "top", fontFace: FONT, fontSize: 13.5, color: "FFFFFF", lineSpacing: 19 }
  );
  s.addText("Obrigado — perguntas?", {
    x: M, y: 6.65, w: 8, h: 0.35,
    margin: 0, fontFace: FONT, fontSize: 14, bold: true, color: C.pink,
  });
  s.addNotes(
    "Feche pelo desafio, não pelo agradecimento — dá algo concreto para segunda-feira. " +
      "Deixe este slide no telão durante o Q&A. ~1,5 min."
  );
}

pres.writeFile({ fileName: __dirname + "/deck.pptx" }).then((f) => console.log("gerado:", f));
