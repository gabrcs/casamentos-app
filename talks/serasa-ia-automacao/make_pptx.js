/**
 * Gera deck.pptx — versão editável da palestra "Automação de processos com IA".
 * 14 slides, espelhando deck.src.html. Paleta e motivo visual seguem a identidade
 * Serasa Experian (roxo/magenta/navy, cards squircle, badge circular magenta).
 *
 * Os fluxogramas do deck HTML vivem em SVGs com viewBox próprio (650x600 e
 * 650x570). Aqui a função frame() mapeia esse viewBox para uma região do slide,
 * então as MESMAS coordenadas servem nos dois arquivos: se você mover um nó no
 * SVG, mova pelo mesmo número aqui.
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
  edge: "8E86A0",
  pinkBg: "FBE0EE",
  pinkTint: "FEF6FA",
  blueBg: "E4EDF8",
  blueTint: "F2F7FC",
  humBg: "EEE3F4",
  mute: "9A93AC",
  hint: "A08BAA",
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
const H = 7.5;
const M = 0.72;

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "Bruno Prata";
pres.title = "Automação de processos com IA";

/* ---------------- chrome ---------------- */

function topbar(slide) {
  slide.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: W, h: 0.115,
    fill: { color: C.navy }, line: { width: 0 },
  });
}

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
}

function footer(slide, sec) {
  slide.addText("Automação de processos com IA", {
    x: M, y: 6.92, w: 5, h: 0.28,
    margin: 0, fontFace: FONT, fontSize: 9, bold: true, color: C.mute,
  });
  slide.addText(sec, {
    x: W - M - 5, y: 6.92, w: 5, h: 0.28,
    margin: 0, align: "right", fontFace: FONT, fontSize: 9, color: C.mute,
  });
}

function callout(slide, label, runs, y, h, opts) {
  const o = opts || {};
  const hh = h || 0.92;
  slide.addShape(pres.ShapeType.roundRect, {
    x: M, y, w: W - 2 * M, h: hh, rectRadius: 0.1,
    fill: { color: o.fill || C.lavender }, line: { width: 0 },
  });
  slide.addShape(pres.ShapeType.rect, {
    x: M, y, w: 0.05, h: hh,
    fill: { color: C.magenta }, line: { width: 0 },
  });
  if (label) {
    slide.addText(label.toUpperCase(), {
      x: M + 0.28, y: y + 0.1, w: 8, h: 0.22,
      margin: 0, fontFace: FONT, fontSize: 9.5, bold: true, color: C.magenta, charSpacing: 1.8,
    });
  }
  slide.addText(runs, {
    x: M + 0.28, y: y + (label ? 0.34 : 0.14), w: W - 2 * M - 0.56, h: hh - (label ? 0.42 : 0.28),
    margin: 0, valign: label ? "top" : "middle", fontFace: FONT, fontSize: 12,
    color: o.color || C.ink, lineSpacing: 16,
  });
}

function card(slide, x, y, w, h, fill, lineColor) {
  slide.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.1,
    fill: { color: fill || C.paper },
    line: { color: lineColor || (fill && fill !== C.paper ? fill : C.line), width: 1 },
  });
}

function dashCard(slide, x, y, w, h) {
  slide.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.1,
    fill: { color: C.pinkTint },
    line: { color: C.magenta, width: 1.25, dashType: "dash" },
  });
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
    x, y, w: w || 5, h: 0.24,
    margin: 0, fontFace: MONO, fontSize: 8.5, bold: true,
    color: C.magenta, charSpacing: 1.2,
  });
}

/* ---------------- fluxograma ---------------- */

/**
 * Mapeia um viewBox SVG (vbW x vbH) para a região (x,y,w,h) do slide, em
 * polegadas, mantendo proporção e centralizando — igual ao
 * preserveAspectRatio="xMidYMid meet" do HTML.
 */
function frame(vbW, vbH, x, y, w, h) {
  const s = Math.min(w / vbW, h / vbH);
  const ox = x + (w - vbW * s) / 2;
  const oy = y + (h - vbH * s) / 2;
  return {
    s,
    X: (v) => ox + v * s,
    Y: (v) => oy + v * s,
    L: (v) => v * s,
    pt: (v) => v * s * 72, // px do viewBox → pontos de fonte
  };
}

const NODE_STYLE = {
  plain: { fill: C.paper, line: C.line, txt: C.ink },
  term: { fill: "EFEAF5", line: "CFC3DE", txt: C.purple },
  code: { fill: C.blueBg, line: C.navy, txt: C.ink },
  ia: { fill: C.pinkBg, line: C.magenta, txt: C.ink },
  hum: { fill: C.humBg, line: C.purple, txt: C.ink },
};

/** caixa do fluxo, em coordenadas do viewBox */
function fnode(slide, F, xp, yp, wp, hp, lines, kind, opts) {
  const o = opts || {};
  const st = NODE_STYLE[kind || "plain"];
  const size = F.pt(o.size || 19);
  slide.addText(
    lines.map((t, i) => ({ text: t, options: { breakLine: i !== lines.length - 1 } })),
    {
      shape: pres.ShapeType.roundRect,
      rectRadius: o.pill ? 0.5 : 0.09,
      x: F.X(xp), y: F.Y(yp), w: F.L(wp), h: F.L(hp),
      fill: { color: st.fill },
      line: { color: st.line, width: 1.25 },
      align: "center", valign: "middle", margin: 0,
      fontFace: FONT, fontSize: size,
      bold: kind === "term", color: st.txt, lineSpacing: size * 1.25,
    }
  );
}

/** losango de decisão; cx/cy = centro no viewBox */
function fdiamond(slide, F, cxp, cyp, hwp, hhp, lines, kind, opts) {
  const o = opts || {};
  const st = NODE_STYLE[kind || "plain"];
  const size = F.pt(o.size || 17);
  slide.addText(
    lines.map((t, i) => ({ text: t, options: { breakLine: i !== lines.length - 1 } })),
    {
      shape: pres.ShapeType.diamond,
      x: F.X(cxp - hwp), y: F.Y(cyp - hhp), w: F.L(hwp * 2), h: F.L(hhp * 2),
      fill: { color: st.fill }, line: { color: st.line, width: 1.25 },
      align: "center", valign: "middle", margin: 0,
      fontFace: FONT, fontSize: size, color: st.txt, lineSpacing: size * 1.25,
    }
  );
}

/** rótulo de classificação, alinhado à esquerda a partir de xp */
function ftag(slide, F, xp, yp, text, color, wp) {
  slide.addText(text, {
    x: F.X(xp), y: F.Y(yp) - F.L(14), w: F.L(wp || 190), h: F.L(28),
    margin: 0, align: "left", valign: "middle", fontFace: FONT,
    fontSize: F.pt(14), bold: true, color, charSpacing: 0.5,
  });
}

/** texto solto no espaço do fluxograma */
function ftext(slide, F, xp, yp, text, opts) {
  const o = opts || {};
  const size = F.pt(o.size || 15);
  slide.addText(text, {
    x: F.X(xp), y: F.Y(yp) - F.L(11), w: F.L(o.w || 200), h: F.L(o.h || 22),
    margin: 0, valign: "middle", align: o.align || "left",
    fontFace: FONT, fontSize: size, bold: !!o.bold,
    color: o.color || C.inkSoft, lineSpacing: size * 1.3,
  });
}

/** um segmento de aresta; arrow=true põe a ponta no fim */
function seg(slide, F, x1, y1, x2, y2, arrow) {
  const o = {
    x: F.X(Math.min(x1, x2)), y: F.Y(Math.min(y1, y2)),
    w: F.L(Math.abs(x2 - x1)), h: F.L(Math.abs(y2 - y1)),
    line: { color: C.edge, width: 1.5 },
  };
  if (x2 < x1) o.flipH = true;
  if (y2 < y1) o.flipV = true;
  if (arrow) o.line.endArrowType = "triangle";
  slide.addShape(pres.ShapeType.line, o);
}

/** aresta com cotovelos: pontos [[x,y],...]; ponta no último segmento */
function edge(slide, F, pts) {
  for (let i = 0; i < pts.length - 1; i++) {
    seg(slide, F, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], i === pts.length - 2);
  }
}

/**
 * O fluxo da triagem de chamados — as mesmas coordenadas do SVG do HTML.
 * painted=true classifica cada caixa (Python / IA / humano).
 */
function triagem(slide, F, painted) {
  const k = (c) => (painted ? c : "plain");
  fnode(slide, F, 20, 6, 230, 50, ["Chamado chega"], "term", { pill: true, size: 18 });
  fnode(slide, F, 20, 88, 230, 52, ["Registrar chamado"], k("code"));
  fnode(slide, F, 20, 172, 230, 52, ["Classificar assunto"], k("ia"));
  fnode(slide, F, 20, 256, 230, 52, ["Redigir resposta"], k("ia"));
  fdiamond(slide, F, 135, 392, 115, 48, ["Desconto", "acima de 10%?"], k("code"));
  fnode(slide, F, 300, 366, 210, 52, ["Gestor aprova"], k("hum"));
  fnode(slide, F, 20, 474, 230, 52, ["Enviar resposta"], k("code"));
  fnode(slide, F, 430, 474, 100, 52, ["Fim"], "term", { pill: true, size: 18 });

  edge(slide, F, [[135, 56], [135, 82]]);
  edge(slide, F, [[135, 140], [135, 166]]);
  edge(slide, F, [[135, 224], [135, 250]]);
  edge(slide, F, [[135, 308], [135, 338]]);
  edge(slide, F, [[250, 392], [294, 392]]);
  edge(slide, F, [[135, 440], [135, 468]]);
  edge(slide, F, [[405, 418], [405, painted ? 456 : 450], [200, painted ? 456 : 450], [200, 468]]);
  edge(slide, F, [[250, 500], [424, 500]]);
  ftext(slide, F, 258, 376, "sim", { bold: true, size: 15, color: "6E6684", w: 40 });
  ftext(slide, F, 146, 454, "não", { bold: true, size: 15, color: "6E6684", w: 40 });

  if (painted) {
    ftag(slide, F, 262, 114, "PYTHON · API do sistema", C.navy);
    ftag(slide, F, 262, 198, "IA · alto volume", C.magenta);
    ftag(slide, F, 262, 282, "IA · alto volume + revisão", C.magenta);
    ftag(slide, F, 518, 392, "HUMANO · baixo volume", C.purple, 210);
    ftag(slide, F, 20, 547, "PYTHON", C.navy, 100);
  } else {
    ftext(slide, F, 20, 557, "A REGRA DO LOSANGO, ESCRITA:", { bold: true, size: 16, color: C.magenta, w: 330 });
    ftext(slide, F, 20, 581, "desconto > 10% ou exceção contratual", { size: 17, w: 380 });
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
  s.addText("Onde a IA ajuda — e onde um script resolve melhor.", {
    x: M, y: 4.2, w: 7.2, h: 0.5, margin: 0, fontFace: FONT, fontSize: 16, color: "E7DCEF", lineSpacing: 22,
  });
  s.addText("Bruno Prata", {
    x: M, y: 6.15, w: 6, h: 0.3, margin: 0, fontFace: FONT, fontSize: 13, bold: true, color: "FFFFFF",
  });
  s.addText("Palestra técnica · 25 minutos", {
    x: M, y: 6.45, w: 6, h: 0.3, margin: 0, fontFace: FONT, fontSize: 11, color: "C9B6D4",
  });
  s.addNotes(
    "Abertura curta. Nome e a promessa em uma frase: vocês vão sair com um roteiro de entrevista, " +
      "uma notação de fluxograma e uma regra de decisão. Prometa o kit do fim. ~1 min."
  );
}

/* ================= 02 · BIO ================= */
{
  const s = pres.addSlide();
  topbar(s);
  s.addText("QUEM ESTÁ FALANDO", {
    x: M, y: 0.5, w: 8, h: 0.3,
    margin: 0, fontFace: FONT, fontSize: 11, bold: true, color: C.magenta, charSpacing: 2.2,
  });
  s.addText("Bruno Prata", {
    x: M, y: 1.5, w: 6.5, h: 0.85, margin: 0, valign: "top",
    fontFace: FONT, fontSize: 40, bold: true, color: C.ink,
  });
  s.addText(
    [
      { text: "Especialista em Dados no ", options: { color: C.inkSoft } },
      { text: "Nubank", options: { color: C.ink, bold: true } },
    ],
    { x: M, y: 2.4, w: 6.5, h: 0.4, margin: 0, fontFace: FONT, fontSize: 17 }
  );
  const chips = ["Grupo Boticário", "iFood", "EBANX", "Nubank"];
  const chipW = [1.85, 0.95, 1.1, 1.15];
  let cx = M;
  chips.forEach((t, i) => {
    s.addText(t, {
      shape: pres.ShapeType.roundRect, rectRadius: 0.06,
      x: cx, y: 3.1, w: chipW[i], h: 0.36,
      fill: { color: C.lavender }, line: { width: 0 },
      align: "center", valign: "middle", margin: 0,
      fontFace: MONO, fontSize: 10.5, color: C.purple,
    });
    cx += chipW[i] + 0.14;
  });
  s.addText("Administração — UFPR  ·  6+ anos entre análise de dados, BI e decisão", {
    x: M, y: 3.66, w: 6.5, h: 0.3, margin: 0, fontFace: FONT, fontSize: 11.5, color: "8B84A0",
  });

  s.addShape(pres.ShapeType.roundRect, {
    x: 7.7, y: 1.45, w: 4.9, h: 2.6, rectRadius: 0.13,
    fill: { color: C.deep }, line: { width: 0 },
  });
  s.addText("O QUE EU FAÇO", {
    x: 7.98, y: 1.68, w: 4.3, h: 0.24,
    margin: 0, fontFace: MONO, fontSize: 8.5, bold: true, color: C.pink, charSpacing: 1.2,
  });
  s.addText(
    [
      { text: "Os últimos anos foram automatizando processo de decisão: entender como ele acontece hoje e devolver a parte repetitiva pra máquina — ", options: { color: "EDE4F3" } },
      { text: "script quando dá, IA quando é linguagem, pessoa quando o erro custa caro", options: { color: "FFFFFF", bold: true } },
      { text: ".", options: { color: "EDE4F3" } },
    ],
    { x: 7.98, y: 1.98, w: 4.34, h: 1.9, margin: 0, valign: "top", fontFace: FONT, fontSize: 13, lineSpacing: 19 }
  );

  callout(
    s, "O combinado desta palestra",
    [
      { text: "Não é demo de ferramenta. Em 25 minutos você sai com " },
      { text: "um roteiro de entrevista, uma notação de fluxograma e uma regra de decisão", options: { bold: true } },
      { text: " que dá pra aplicar no seu processo amanhã de manhã — mais um kit de arquivos pra baixar no fim." },
    ],
    4.55, 1.0
  );
  footer(s, "Abertura");
  s.addNotes(
    "Credencial em 30 segundos, não currículo. A frase do painel escuro é a tese da palestra inteira: " +
      "script / IA / pessoa. Ela volta no slide 8. ~1 min."
  );
}

/* ================= 03 · A PERGUNTA ERRADA ================= */
{
  const s = pres.addSlide();
  s.background = { color: C.deep };
  s.addText("COMO ISSO COMEÇA ERRADO", {
    x: M, y: 0.95, w: 9, h: 0.3,
    margin: 0, fontFace: FONT, fontSize: 11, bold: true, color: C.pink, charSpacing: 2.2,
  });
  s.addText(
    [
      { text: "A primeira pergunta é sempre ", options: { color: "FFFFFF" } },
      { text: "a errada", options: { color: C.pink } },
    ],
    { x: M, y: 1.35, w: 11, h: 0.7, margin: 0, valign: "top", fontFace: FONT, fontSize: 32, bold: true }
  );

  const DL = [
    ["VOCÊ PERGUNTA", "“O que vocês querem automatizar?”", false],
    ["A PESSOA RESPONDE", "“Queria um bot que respondesse os chamados.”", false],
  ];
  let dy = 2.5;
  DL.forEach(([who, what]) => {
    s.addText(who, {
      x: M, y: dy + 0.06, w: 2.1, h: 0.26,
      margin: 0, fontFace: MONO, fontSize: 9, color: "C9B6D4", charSpacing: 1.2,
    });
    s.addText(what, {
      x: M + 2.35, y: dy, w: 9, h: 0.42,
      margin: 0, valign: "top", fontFace: FONT, fontSize: 19, color: "FFFFFF",
    });
    dy += 0.72;
  });
  s.addText(
    "Isso não é o processo. É um palpite de solução — e quem constrói em cima dele automatiza o que alguém imaginou, não o trabalho que existe.",
    { x: M + 2.35, y: dy + 0.02, w: 8.6, h: 0.62, margin: 0, valign: "top", fontFace: FONT, fontSize: 13.5, color: "E7DCEF", lineSpacing: 19 }
  );
  dy += 0.95;
  s.addText("PERGUNTE ASSIM", {
    x: M, y: dy + 0.06, w: 2.1, h: 0.26,
    margin: 0, fontFace: MONO, fontSize: 9, bold: true, color: C.pink, charSpacing: 1.2,
  });
  s.addText("“Me conta o que você fez ontem, na ordem.”", {
    x: M + 2.35, y: dy, w: 9, h: 0.45,
    margin: 0, valign: "top", fontFace: FONT, fontSize: 19, bold: true, color: "FFFFFF",
  });

  s.addText(
    [
      { text: "O CAMINHO DE HOJE   ", options: { color: C.pink, bold: true } },
      { text: "conversar → desenhar → decidir quem faz cada caixa → ferramentas → um caso → ", options: { color: "C9B6D4" } },
      { text: "o kit pra baixar", options: { color: "FFFFFF", bold: true } },
    ],
    { x: M, y: 6.25, w: 11.9, h: 0.45, margin: 0, valign: "top", fontFace: FONT, fontSize: 12, lineSpacing: 17 }
  );
  s.addNotes(
    "Slide de pontuação. Encene o diálogo: faça a pergunta errada em voz alta e dê a resposta que sempre vem. " +
      "A linha de baixo é o roteiro — aponte pra ela. ~1,5 min."
  );
}

/* ================= 04 · AS SETE PERGUNTAS ================= */
{
  const s = pres.addSlide();
  topbar(s);
  header(s, "Passo 1 · a conversa", [
    { text: "Sete perguntas que arrancam o processo " },
    { text: "inteiro", options: { color: C.magenta } },
    { text: " em meia hora" },
  ], { size: 27, lnspc: 31, titleH: 0.85 });

  const QS = [
    ["01", "“Me conta o que você fez ontem, na ordem.”",
      [{ text: "As etapas " }, { text: "reais", options: { bold: true } },
       { text: " — não a versão oficial do gestor." }], false],
    ["02", "“O que te faz parar e perguntar pra alguém?”",
      [{ text: "Cada resposta é um " }, { text: "losango", options: { bold: true, color: C.magenta } },
       { text: ". E vem com a regra junto." }], true],
    ["03", "“O que você copia de um lugar pro outro?”",
      [{ text: "Digitação pura. " }, { text: "A primeira caixa que vira script.", options: { bold: true, color: C.magenta } }], true],
    ["04", "“Quando isso dá errado, como você descobre?”",
      [{ text: "Sem resposta aqui, " }, { text: "não automatize ainda", options: { bold: true } },
       { text: "." }], false],
    ["05", "“Qual é o caso chato que sempre aparece?”",
      [{ text: "As exceções. Viram os " }, { text: "casos de teste", options: { bold: true } },
       { text: " depois." }], false],
    ["06", "“Quantas vezes você faz isso por dia?”",
      [{ text: "Frequência. " }, { text: "Etapa rara não paga automação.", options: { bold: true } }], false],
    ["07", "“Se você errar aqui, o que acontece?”",
      [{ text: "Custo do erro. Decide se a etapa " }, { text: "pode", options: { bold: true } },
       { text: " rodar sozinha." }], false],
  ];

  let y = 1.9;
  const rowH = 0.585;
  QS.forEach(([n, q, reveal, key]) => {
    if (key) {
      s.addShape(pres.ShapeType.roundRect, {
        x: M, y: y - 0.04, w: W - 2 * M, h: rowH, rectRadius: 0.06,
        fill: { color: C.pinkTint }, line: { width: 0 },
      });
    } else {
      s.addShape(pres.ShapeType.rect, {
        x: M, y: y - 0.04, w: W - 2 * M, h: 0.01,
        fill: { color: C.line }, line: { width: 0 },
      });
    }
    s.addText(n, {
      x: M + 0.12, y: y + 0.06, w: 0.42, h: 0.28,
      margin: 0, fontFace: MONO, fontSize: 10, bold: true, color: key ? C.magenta : "B9AFC9",
    });
    s.addText(q, {
      x: M + 0.62, y: y + 0.08, w: 4.2, h: 0.38,
      margin: 0, valign: "top", fontFace: FONT, fontSize: 12.5, color: C.ink, lineSpacing: 16,
    });
    s.addText(reveal, {
      x: M + 4.95, y: y + 0.08, w: 6.85, h: 0.38,
      margin: 0, valign: "top", fontFace: FONT, fontSize: 11.5, color: C.inkSoft, lineSpacing: 15,
    });
    y += rowH;
  });

  callout(
    s, "Duas delas fazem 70% do trabalho",
    [
      { text: "A " }, { text: "2", options: { bold: true } },
      { text: " te entrega os losangos; a " }, { text: "3", options: { bold: true } },
      { text: ", as caixas que viram script. Grave a conversa e desenhe em cima da transcrição — não da memória." },
    ],
    6.08, 0.66
  );
  footer(s, "01 · Conversar");
  s.addNotes(
    "O artefato do slide. Leia as sete em voz alta, rápido, e pare na 2 e na 3 — são as duas destacadas. " +
      "Diga que este slide está no kit. ~3 min."
  );
}

/* ================= 05 · A NOTAÇÃO ================= */
{
  const s = pres.addSlide();
  topbar(s);
  header(s, "Passo 2 · o desenho", [
    { text: "Quatro formas e três regras. " },
    { text: "Não precisa de BPMN.", options: { color: C.magenta } },
  ], { size: 29, titleH: 0.65 });

  const RULES = [
    ["1", "Uma caixa = uma ação.", " Se o nome da caixa tem “e”, são duas caixas. “Registrar e classificar” esconde exatamente a etapa que você ia automatizar."],
    ["2", "Todo losango tem a regra escrita embaixo.", " Losango sem regra é decisão que ninguém revisou — e é onde a automação quebra três meses depois."],
    ["3", "Rotule as duas saídas.", " Seta sem rótulo esconde o caminho que ninguém tratou. Na dúvida entre ação e decisão, é decisão."],
  ];
  let ry = 2.05;
  RULES.forEach(([n, lead, rest]) => {
    s.addShape(pres.ShapeType.ellipse, {
      x: M, y: ry, w: 0.32, h: 0.32,
      fill: { color: C.magenta }, line: { width: 0 },
    });
    s.addText(n, {
      x: M, y: ry, w: 0.32, h: 0.32, align: "center", valign: "middle", margin: 0,
      fontFace: MONO, fontSize: 10.5, bold: true, color: "FFFFFF",
    });
    s.addText(
      [{ text: lead, options: { bold: true, color: C.ink } }, { text: rest, options: { color: C.inkSoft } }],
      { x: M + 0.48, y: ry - 0.03, w: 5.5, h: 0.75, margin: 0, valign: "top", fontFace: FONT, fontSize: 12.5, lineSpacing: 17 }
    );
    ry += 0.88;
  });

  s.addShape(pres.ShapeType.roundRect, {
    x: M, y: 4.78, w: 6.0, h: 1.0, rectRadius: 0.09,
    fill: { color: C.lavender }, line: { width: 0 },
  });
  s.addShape(pres.ShapeType.rect, { x: M, y: 4.78, w: 0.05, h: 1.0, fill: { color: C.magenta }, line: { width: 0 } });
  s.addText("COM O QUE DESENHAR", {
    x: M + 0.24, y: 4.88, w: 5, h: 0.22,
    margin: 0, fontFace: FONT, fontSize: 9.5, bold: true, color: C.magenta, charSpacing: 1.8,
  });
  s.addText(
    [
      { text: "Papel, na frente da pessoa, na hora. Depois passe pra " },
      { text: "Mermaid", options: { fontFace: MONO } },
      { text: " ou " },
      { text: "draw.io", options: { fontFace: MONO } },
      { text: " — Mermaid é texto, então versiona no repo e o diff mostra quando o processo mudou." },
    ],
    { x: M + 0.24, y: 5.1, w: 5.5, h: 0.62, margin: 0, valign: "top", fontFace: FONT, fontSize: 11.5, color: C.ink, lineSpacing: 15 }
  );

  // a notação, no mesmo viewBox 440x350 do SVG
  const F = frame(440, 350, 7.3, 2.0, 5.3, 3.9);
  codeCap(s, F.X(0), 1.66, "A notação inteira", 3);
  fnode(s, F, 14, 14, 150, 52, ["início / fim"], "term", { pill: true, size: 18 });
  ftext(s, F, 184, 40, "onde o processo começa e termina", { size: 16, w: 250 });
  fnode(s, F, 14, 98, 150, 52, ["ação"], "plain");
  ftext(s, F, 184, 116, "uma caixa = uma ação.", { size: 16, w: 250 });
  ftext(s, F, 184, 138, "Se tem “e” no nome, são duas.", { size: 16, w: 250 });
  fdiamond(s, F, 89, 216, 75, 34, ["decisão"], "plain", { size: 19 });
  ftext(s, F, 184, 206, "todo losango tem que ter", { size: 16, w: 250 });
  ftext(s, F, 184, 228, "uma regra escrita embaixo", { size: 16, w: 250 });
  edge(s, F, [[14, 300], [150, 300]]);
  ftext(s, F, 40, 284, "sim", { bold: true, size: 15, color: "6E6684", w: 40 });
  ftext(s, F, 184, 290, "seta condicional —", { size: 16, w: 250 });
  ftext(s, F, 184, 312, "rotule sempre as duas saídas", { size: 16, w: 250 });

  footer(s, "02 · Desenhar");
  s.addNotes(
    "Ensine a notação inteira aqui — são só quatro formas. A regra 2 (losango sem regra escrita) é a que " +
      "mais gera pergunta; guarde um exemplo na manga. ~2,5 min."
  );
}

/* ================= 06 · DA FALA AO DESENHO ================= */
{
  const s = pres.addSlide();
  topbar(s);
  header(s, "Passo 2 · na prática", [
    { text: "Da fala ao desenho: " },
    { text: "cinco frases viram um fluxo", options: { color: C.magenta } },
  ], { size: 28, titleH: 0.65 });

  const SAYS = [
    ["“Chega um e-mail, ou o cliente abre pelo formulário.”", "→ início", false],
    ["“Aí eu jogo no sistema: copio nome, CPF e o texto do chamado.”", "→ ação · registrar chamado", false],
    ["“Leio e vejo do que se trata — cobrança, fraude, cadastro.”", "→ ação · classificar assunto", false],
    ["“Escrevo a resposta. Geralmente é parecida com outras que já mandei.”", "→ ação · redigir resposta", false],
    ["“Se for desconto acima de 10%, eu paro e mando pro meu gestor.”", "→ losango + a regra, na mesma frase", true],
  ];
  let sy = 1.95;
  SAYS.forEach(([q, to, key]) => {
    s.addShape(pres.ShapeType.roundRect, {
      x: M, y: sy, w: 5.75, h: 0.74, rectRadius: 0.07,
      fill: { color: key ? C.pinkTint : C.lavender }, line: { width: 0 },
    });
    s.addShape(pres.ShapeType.rect, {
      x: M, y: sy, w: 0.045, h: 0.74,
      fill: { color: key ? C.magenta : "EAE3F3" }, line: { width: 0 },
    });
    s.addText(q, {
      x: M + 0.22, y: sy + 0.06, w: 5.4, h: 0.42,
      margin: 0, valign: "top", fontFace: FONT, fontSize: 11, italic: true, color: C.ink, lineSpacing: 14,
    });
    s.addText(to, {
      x: M + 0.22, y: sy + 0.48, w: 5.4, h: 0.22,
      margin: 0, fontFace: MONO, fontSize: 9, bold: key, color: key ? C.magenta : C.purple,
    });
    sy += 0.80;
  });

  const F = frame(570, 600, 6.9, 1.9, 5.7, 4.05);
  triagem(s, F, false);

  callout(
    s, "",
    [
      { text: "A quinta frase entregou " },
      { text: "o losango e a regra na mesma respiração", options: { bold: true } },
      { text: ". E repare: até aqui " },
      { text: "nada foi dito sobre IA", options: { bold: true } },
      { text: "." },
    ],
    6.14, 0.58
  );
  footer(s, "02 · Desenhar");
  s.addNotes(
    "Aponte cada fala e a caixa que ela virou. O ponto alto é a quinta: losango + regra de graça. " +
      "Diga que nada aqui é sobre IA ainda. ~2,5 min."
  );
}

/* ================= 07 · FERRAMENTA VS. SOLUÇÃO ================= */
{
  const s = pres.addSlide();
  topbar(s);
  header(s, "Passo 3 · onde a IA entra", [
    { text: "Antes de escolher modelo: você quer a IA como " },
    { text: "ferramenta", options: { color: C.magenta } },
    { text: " ou como " },
    { text: "solução", options: { color: C.purple } },
    { text: "?" },
  ], { size: 26, lnspc: 31, titleH: 0.9 });

  const cw = (W - 2 * M - 0.4) / 2;
  card(s, M, 2.1, cw, 3.5, C.paper);
  s.addText("IA como ferramenta — um copiloto seu", {
    x: M + 0.32, y: 2.34, w: cw - 0.64, h: 0.34,
    margin: 0, fontFace: FONT, fontSize: 15, bold: true, color: C.magenta,
  });
  s.addText(
    [{ text: "Você está no meio.", options: { bold: true, color: C.ink } },
     { text: " Cada uso é uma decisão sua, e você vê a saída antes de qualquer coisa acontecer.", options: { color: C.inkSoft } }],
    { x: M + 0.32, y: 2.76, w: cw - 0.64, h: 0.62, margin: 0, valign: "top", fontFace: FONT, fontSize: 12, lineSpacing: 16 }
  );
  s.addText("Escrever o script · entender uma base nova · gerar o SQL · revisar um texto · virar 40 páginas de PDF em resumo", {
    x: M + 0.32, y: 3.44, w: cw - 0.64, h: 0.9,
    margin: 0, valign: "top", fontFace: MONO, fontSize: 10.5, color: C.ink, lineSpacing: 15,
  });
  s.addText(
    [{ text: "Não precisa de eval, log nem dono.", options: { bold: true, color: C.ink } },
     { text: " Precisa de você prestando atenção. Começa hoje, sem projeto e sem aprovação.", options: { color: C.inkSoft } }],
    { x: M + 0.32, y: 4.5, w: cw - 0.64, h: 0.85, margin: 0, valign: "top", fontFace: FONT, fontSize: 12, lineSpacing: 16 }
  );

  const x2 = M + cw + 0.4;
  card(s, x2, 2.1, cw, 3.5, C.lavender);
  s.addText("IA como solução — dentro do processo", {
    x: x2 + 0.32, y: 2.34, w: cw - 0.64, h: 0.34,
    margin: 0, fontFace: FONT, fontSize: 15, bold: true, color: C.purple,
  });
  s.addText(
    [{ text: "Roda sem você", options: { bold: true, color: C.ink } },
     { text: ", N vezes por dia, e o resultado vai direto pro cliente ou pro sistema seguinte.", options: { color: C.inkSoft } }],
    { x: x2 + 0.32, y: 2.76, w: cw - 0.64, h: 0.62, margin: 0, valign: "top", fontFace: FONT, fontSize: 12, lineSpacing: 16 }
  );
  s.addText("Classificar todo chamado que entra · extrair campo de documento · redigir a primeira versão da resposta", {
    x: x2 + 0.32, y: 3.44, w: cw - 0.64, h: 0.9,
    margin: 0, valign: "top", fontFace: MONO, fontSize: 10.5, color: C.ink, lineSpacing: 15,
  });
  s.addText(
    [{ text: "Precisa de tudo que um sistema precisa:", options: { bold: true, color: C.ink } },
     { text: " saída com schema, limiar de confiança, log por execução, dono com nome e um conjunto de casos de teste.", options: { color: C.inkSoft } }],
    { x: x2 + 0.32, y: 4.5, w: cw - 0.64, h: 0.85, margin: 0, valign: "top", fontFace: FONT, fontSize: 12, lineSpacing: 16 }
  );

  callout(
    s, "A confusão que mata projeto",
    [
      { text: "Quase todo piloto que morre no terceiro mês é " },
      { text: "uma solução tratada como se fosse ferramenta", options: { bold: true } },
      { text: ": funcionou lindo no chat de quem construiu, e ninguém desenhou o que acontece quando erra às 3 da manhã sem ninguém olhando. " },
      { text: "A demo é ferramenta. Produção é solução.", options: { bold: true } },
    ],
    5.78, 0.88
  );
  footer(s, "03 · Decidir");
  s.addNotes(
    "Distinção central da palestra. Pergunte quem já usa IA no dia a dia (muitas mãos) e quem tem IA rodando " +
      "sem supervisão em produção (poucas). A diferença entre as duas mãos é este slide. ~2 min."
  );
}

/* ================= 08 · AS TRÊS CAIXAS ================= */
{
  const s = pres.addSlide();
  topbar(s);
  header(s, "Passo 3 · a classificação", [
    { text: "Cada caixa do fluxo vira uma de " },
    { text: "três coisas", options: { color: C.magenta } },
  ], { size: 28, titleH: 0.65 });

  const BOXES = [
    {
      title: "Automação tradicional", accent: C.navy, fill: C.blueTint, chipBg: "DCE8F6",
      stack: ["Python", "SQL", "API", "regex", "cron"],
      when: "A regra é fixa, a entrada é estruturada e a saída é sempre a mesma.",
      say: "“eu copio daqui pra lá” · “rodo esse relatório toda segunda”",
      lastLab: "POR QUE NÃO IA AQUI",
      last: [{ text: "Mais barato, determinístico e testável. " },
             { text: "Um if você testa uma vez e confia pra sempre.", options: { bold: true, color: C.ink } }],
    },
    {
      title: "IA", accent: C.magenta, fill: C.pinkTint, chipBg: "FBDCEC",
      stack: ["LLM + schema", "limiar", "eval"],
      when: "A entrada é linguagem, a regra é ambígua, e verificar custa menos que fazer.",
      say: "“depende do que tá escrito” · “eu leio e decido na hora”",
      lastLab: "O PREÇO QUE VEM JUNTO",
      last: [{ text: "Não é determinística. Sem casos de teste, limiar e um caminho de “não sei”, você trocou trabalho por risco." }],
    },
    {
      title: "Humano", accent: C.purple, fill: C.lavender, chipBg: "E6D8EE",
      stack: ["julgamento"],
      when: "O erro é caro e irreversível — ou a regra ainda nem existe.",
      say: "“isso aí eu levo pro meu gestor” · “cada caso é um caso”",
      lastLab: "A BOA NOTÍCIA",
      last: [{ text: "Costuma ser pouco volume. " },
             { text: "Manter gente ali é barato", options: { bold: true, color: C.ink } },
             { text: " — e é o que te deixa automatizar o resto sem medo." }],
    },
  ];

  const bw = (W - 2 * M - 0.6) / 3;
  BOXES.forEach((b, i) => {
    const x = M + i * (bw + 0.3);
    card(s, x, 2.0, bw, 3.55, b.fill, b.accent);
    s.addText(b.title, {
      x: x + 0.28, y: 2.22, w: bw - 0.56, h: 0.32,
      margin: 0, fontFace: FONT, fontSize: 14.5, bold: true, color: b.accent,
    });
    let sx = x + 0.28;
    let sy2 = 2.64;
    b.stack.forEach((t) => {
      const tw = 0.16 + t.length * 0.075;
      if (sx + tw > x + bw - 0.24) { sx = x + 0.28; sy2 += 0.32; }
      s.addText(t, {
        shape: pres.ShapeType.roundRect, rectRadius: 0.04,
        x: sx, y: sy2, w: tw, h: 0.26,
        fill: { color: b.chipBg }, line: { width: 0 },
        align: "center", valign: "middle", margin: 0,
        fontFace: MONO, fontSize: 8.5, color: b.accent,
      });
      sx += tw + 0.08;
    });
    const base = sy2 + 0.42;
    s.addText("QUANDO", {
      x: x + 0.28, y: base, w: bw - 0.56, h: 0.2,
      margin: 0, fontFace: MONO, fontSize: 8, bold: true, color: b.accent, charSpacing: 1,
    });
    s.addText(b.when, {
      x: x + 0.28, y: base + 0.2, w: bw - 0.56, h: 0.52,
      margin: 0, valign: "top", fontFace: FONT, fontSize: 11, color: C.inkSoft, lineSpacing: 14,
    });
    s.addText("COMO APARECE NA ENTREVISTA", {
      x: x + 0.28, y: base + 0.78, w: bw - 0.56, h: 0.2,
      margin: 0, fontFace: MONO, fontSize: 8, bold: true, color: b.accent, charSpacing: 1,
    });
    s.addText(b.say, {
      x: x + 0.28, y: base + 0.98, w: bw - 0.56, h: 0.52,
      margin: 0, valign: "top", fontFace: FONT, fontSize: 10.5, italic: true, color: C.ink, lineSpacing: 14,
    });
    s.addText(b.lastLab, {
      x: x + 0.28, y: base + 1.56, w: bw - 0.56, h: 0.2,
      margin: 0, fontFace: MONO, fontSize: 8, bold: true, color: b.accent, charSpacing: 1,
    });
    s.addText(b.last, {
      x: x + 0.28, y: base + 1.76, w: bw - 0.56, h: 0.72,
      margin: 0, valign: "top", fontFace: FONT, fontSize: 11, color: C.inkSoft, lineSpacing: 14,
    });
  });

  callout(
    s, "A ordem de perguntar — uma vez por caixa",
    [
      { text: "1.", options: { bold: true } },
      { text: " Dá pra fazer com um " }, { text: "if", options: { fontFace: MONO } },
      { text: "? Se dá, faça com " }, { text: "if", options: { fontFace: MONO } },
      { text: ".   " }, { text: "2.", options: { bold: true } },
      { text: " Se não dá, o erro é caro e irreversível? Se é, humano decide (ou a IA propõe e o humano aprova).   " },
      { text: "3.", options: { bold: true } },
      { text: " Se não é, IA com revisão por amostragem.   " },
      { text: "A IA é a terceira pergunta, nunca a primeira.", options: { color: C.magenta } },
    ],
    5.75, 0.9
  );
  footer(s, "03 · Decidir");
  s.addNotes(
    "O slide que a plateia fotografa. As três frases entre aspas são o gancho: elas vêm da entrevista do " +
      "slide 4, então o método fecha aqui. Termine lendo a ordem de perguntar. ~3 min."
  );
}

/* ================= 09 · O FLUXO PINTADO ================= */
{
  const s = pres.addSlide();
  topbar(s);
  header(s, "Passo 3 · o entregável", [
    { text: "O mesmo fluxo, pintado — e pronto: " },
    { text: "essa é a arquitetura", options: { color: C.magenta } },
  ], { size: 26, lnspc: 30, titleH: 0.9, titleW: 7.6 });

  const F = frame(690, 570, 0.72, 2.05, 6.2, 4.5);
  triagem(s, F, true);

  card(s, 7.3, 2.15, 5.3, 1.42, C.paper);
  s.addText("O placar", {
    x: 7.58, y: 2.34, w: 4.8, h: 0.3,
    margin: 0, fontFace: FONT, fontSize: 14, bold: true, color: C.magenta,
  });
  s.addText(
    [
      { text: "5 ações + 1 decisão", options: { bold: true, color: C.ink } },
      { text: " → 3 viram ", options: { color: C.inkSoft } },
      { text: "Python", options: { bold: true, color: C.navy } },
      { text: ", 2 viram ", options: { color: C.inkSoft } },
      { text: "IA", options: { bold: true, color: C.magenta } },
      { text: ", 1 continua ", options: { color: C.inkSoft } },
      { text: "humana", options: { bold: true, color: C.purple } },
      { text: ".", options: { color: C.inkSoft } },
    ],
    { x: 7.58, y: 2.66, w: 4.8, h: 0.42, margin: 0, valign: "top", fontFace: FONT, fontSize: 12.5, lineSpacing: 16 }
  );
  s.addText("Metade do processo foi resolvida sem IA nenhuma. Isso é bom sinal, não fracasso.", {
    x: 7.58, y: 3.08, w: 4.8, h: 0.4,
    margin: 0, valign: "top", fontFace: FONT, fontSize: 11, color: C.inkSoft, lineSpacing: 14,
  });

  card(s, 7.3, 3.75, 5.3, 2.05, C.lavender);
  s.addText("Como ler o desenho", {
    x: 7.58, y: 3.94, w: 4.8, h: 0.3,
    margin: 0, fontFace: FONT, fontSize: 13, bold: true, color: C.purple,
  });
  s.addText(
    [{ text: "As duas rosas são " }, { text: "decisão ambígua em alto volume, com erro tolerável", options: { bold: true, color: C.ink } },
     { text: " — é ali que a IA se paga." }],
    { x: 7.58, y: 4.26, w: 4.8, h: 0.48, margin: 0, valign: "top", fontFace: FONT, fontSize: 11, color: C.inkSoft, lineSpacing: 14 }
  );
  s.addText(
    [{ text: "A lavanda são " }, { text: "poucos julgamentos, todos irreversíveis", options: { bold: true, color: C.ink } },
     { text: ": continua humana, e é barato que continue." }],
    { x: 7.58, y: 4.76, w: 4.8, h: 0.48, margin: 0, valign: "top", fontFace: FONT, fontSize: 11, color: C.inkSoft, lineSpacing: 14 }
  );
  s.addText(
    [{ text: "O losango " }, { text: "parece", options: { italic: true } },
     { text: " decisão de IA e não é — é " }, { text: "if desconto > 0.10", options: { fontFace: MONO } }, { text: "." }],
    { x: 7.58, y: 5.26, w: 4.8, h: 0.44, margin: 0, valign: "top", fontFace: FONT, fontSize: 11, color: C.inkSoft, lineSpacing: 14 }
  );

  // legenda
  const LEG = [["Python", C.blueBg, C.navy], ["IA", C.pinkBg, C.magenta], ["humano", C.humBg, C.purple]];
  const LEGX = [7.32, 8.72, 9.92];
  LEG.forEach(([t, fill, ln], i) => {
    s.addShape(pres.ShapeType.roundRect, {
      x: LEGX[i], y: 6.02, w: 0.17, h: 0.17, rectRadius: 0.03,
      fill: { color: fill }, line: { color: ln, width: 1.25 },
    });
    s.addText(t, {
      x: LEGX[i] + 0.24, y: 5.98, w: 1.0, h: 0.24,
      margin: 0, fontFace: FONT, fontSize: 11, color: C.inkSoft,
    });
  });

  footer(s, "03 · Decidir");
  s.addNotes(
    "Ponto alto da primeira metade: a arquitetura apareceu sem ninguém escrever documento. " +
      "Fale o placar em voz alta — 3 de 6 caixas viraram Python. ~2,5 min."
  );
}

/* ================= 10 · HUMANO NA ALÇA ================= */
{
  const s = pres.addSlide();
  topbar(s);
  header(s, "O ponto onde a IA vira solução de verdade", [
    { text: "O humano na alça são " },
    { text: "doze linhas", options: { color: C.magenta } },
    { text: " — e um teste pra ver se ele é real" },
  ], { size: 26, lnspc: 30, titleH: 0.9 });

  codeCap(s, M, 2.06, "triagem.py", 3);
  codeBlock(s, M, 2.32, 7.35, 3.35, [
    [["# o schema é o contrato: sem ele não há limiar nem log", "c"]],
    [["class ", "k"], ["Triagem", "w"], ["(BaseModel):"]],
    [["    categoria: "], ["Literal", "v"], ["["], ['"cobranca"', "s"], [", "], ['"fraude"', "s"], [", "], ['"cadastro"', "s"], [", "], ['"outro"', "s"], ["]"]],
    [["    confianca: "], ["float", "v"], ["        "], ["# 0-1, exigido no prompt", "c"]],
    [["    justificativa: "], ["str", "v"], ["     "], ["# 1 frase — vai para o log", "c"]],
    [["    faltou_contexto: "], ["bool", "v"], ["   "], ['# o caminho explícito de "não sei"', "c"]],
    [],
    [["r = "], ["classificar", "w"], ["(chamado)  "], ["# saída estruturada, não texto livre", "c"]],
    [["if ", "k"], ["r.faltou_contexto "], ["or ", "k"], ["r.confianca < LIMIAR:"]],
    [["    fila_humana."], ["enfileirar", "w"], ["(chamado, sugestao=r)  "], ["# COM a sugestão", "c"]],
    [["else", "k"], [":"]],
    [["    "], ["rotear", "w"], ["(chamado, r.categoria)"]],
    [["registrar", "w"], ["(chamado.id, r, modelo=MODELO, prompt_v=PROMPT_V)"]],
  ], 9);

  card(s, 8.35, 2.32, 4.25, 1.85, C.paper);
  s.addText("O checkpoint é real? Três perguntas", {
    x: 8.6, y: 2.5, w: 3.8, h: 0.3,
    margin: 0, fontFace: FONT, fontSize: 12, bold: true, color: C.magenta,
  });
  [
    [{ text: "1.", options: { bold: true, color: C.ink } }, { text: " O revisor tem tempo e informação pra discordar?" }],
    [{ text: "2.", options: { bold: true, color: C.ink } }, { text: " Existe registro de quando ele discordou? Rejeição de 0% é alarme, não é qualidade." }],
    [{ text: "3.", options: { bold: true, color: C.ink } }, { text: " Se revisar por amostragem daria o mesmo, revisar item a item é teatro — e custa uma pessoa." }],
  ].forEach((runs, i) => {
    s.addText(runs, {
      x: 8.6, y: 2.84 + i * 0.44, w: 3.8, h: 0.42,
      margin: 0, valign: "top", fontFace: FONT, fontSize: 10.5, color: C.inkSoft, lineSpacing: 13.5,
    });
  });

  card(s, 8.35, 4.32, 4.25, 1.35, C.lavender);
  s.addText(
    [
      { text: "LGPD, art. 20.", options: { bold: true, color: C.purple } },
      { text: " O titular pode pedir revisão de decisão tomada " },
      { text: "unicamente", options: { italic: true } },
      { text: " de forma automatizada. Em serviço financeiro isso define quais caixas " },
      { text: "podem", options: { bold: true, color: C.ink } },
      { text: " ser 100% automáticas — e obriga saber qual versão do modelo decidiu o quê." },
    ],
    { x: 8.6, y: 4.5, w: 3.8, h: 1.0, margin: 0, valign: "top", fontFace: FONT, fontSize: 10.5, color: C.inkSoft, lineSpacing: 13.5 }
  );

  callout(
    s, "O detalhe que quase todo mundo esquece",
    [
      { text: "Sem faltou_contexto, o modelo nunca diz “não sei” — ele chuta com confiança alta.", options: { bold: true } },
      { text: " “Não sei” precisa ser saída válida e explicitamente permitida no prompt. E escalone " },
      { text: "com a sugestão junto", options: { bold: true } },
      { text: ": fila que chega em branco custa o mesmo que não ter automação." },
    ],
    5.85, 0.85
  );
  footer(s, "03 · Decidir");
  s.addNotes(
    "Passe o código linha a linha, devagar. O campo faltou_contexto é o detalhe que ninguém espera — " +
      "sem ele o modelo nunca diz 'não sei'. O limiar sai do eval, não do chute. ~3 min."
  );
}

/* ================= 11 · PANORAMA DE FERRAMENTAS ================= */
{
  const s = pres.addSlide();
  topbar(s);
  header(s, "Passo 4 · o panorama", [
    { text: "Sete camadas — e as " },
    { text: "duas", options: { color: C.magenta } },
    { text: " que decidem se vai pra produção" },
  ], { size: 27, lnspc: 31, titleH: 0.85 });

  const LAYERS = [
    ["Modelos", ["Claude Opus 5", "Sonnet 5", "Haiku 4.5", "GPT", "Gemini 2.5", "Llama / Qwen self-hosted"], "o motor, não o produto", false],
    ["Chat", ["Claude", "ChatGPT", "Gemini"], "aqui a IA é ferramenta: você no meio, sem log e sem eval", false],
    ["Agentes de código", ["Claude Code", "Cursor", "Codex", "Copilot"], "leem e escrevem no seu repo, rodam comando", false],
    ["Skills e MCP", ["Skills", "MCP"], "skill = instrução reutilizável · MCP = um protocolo no lugar de N integrações", false],
    ["SDK / API", ["Claude Agent SDK", "API direta", "LangGraph", "Pydantic AI"], "quando vira produto", false],
    ["Orquestração", ["n8n", "Airflow", "Temporal", "Step Functions", "GitHub Actions"], "retry, idempotência, estado, quem dispara", true],
    ["Eval e observabilidade", ["casos versionados no repo", "Langfuse", "Braintrust"], "sem isso, o terceiro mês te pega", true],
  ];

  let ly = 1.92;
  const lh = 0.50;
  LAYERS.forEach(([name, tools, note, key]) => {
    s.addShape(pres.ShapeType.roundRect, {
      x: M, y: ly, w: W - 2 * M, h: lh, rectRadius: 0.07,
      fill: { color: key ? C.pinkTint : C.paper },
      line: { color: key ? C.magenta : C.line, width: 1 },
    });
    s.addShape(pres.ShapeType.roundRect, {
      x: M + 0.22, y: ly + 0.15, w: 0.05, h: 0.22, rectRadius: 0.02,
      fill: { color: key ? C.magenta : C.navy }, line: { width: 0 },
    });
    s.addText(name, {
      x: M + 0.4, y: ly + 0.1, w: 1.95, h: 0.32,
      margin: 0, valign: "middle", fontFace: FONT, fontSize: 11.5, bold: true, color: C.ink,
    });
    let tx = M + 2.5;
    tools.forEach((t) => {
      const tw = 0.2 + t.length * 0.078;
      s.addText(t, {
        shape: pres.ShapeType.roundRect, rectRadius: 0.04,
        x: tx, y: ly + 0.12, w: tw, h: 0.28,
        fill: { color: key ? C.pinkBg : C.lavender }, line: { width: 0 },
        align: "center", valign: "middle", margin: 0,
        fontFace: MONO, fontSize: 8.5, color: key ? C.magenta : C.purple,
      });
      tx += tw + 0.08;
    });
    s.addText(note, {
      x: tx + 0.04, y: ly + 0.12, w: W - M - tx - 0.24, h: 0.28,
      margin: 0, valign: "middle", fontFace: FONT, fontSize: 9.5, italic: true,
      color: key ? "B07093" : "8B84A0",
    });
    ly += lh + 0.07;
  });

  callout(
    s, "",
    [
      { text: "Claude Code não é modelo", options: { bold: true } },
      { text: " — é agente. " },
      { text: "Cursor não é orquestrador", options: { bold: true } },
      { text: " — é editor com agente. " },
      { text: "GitHub Actions é gatilho", options: { bold: true } },
      { text: ", não orquestrador." },
    ],
    6.08, 0.58
  );
  footer(s, "04 · Ferramentas");
  s.addNotes(
    "Slide de consulta — não leia linha por linha. Fale as duas rosas (orquestração e eval) e as três " +
      "confusões do rodapé. Se precisar cortar tempo, este é o slide que encurta. ~1,5 min."
  );
}

/* ================= 12 · O CASO (a preencher) ================= */
{
  const s = pres.addSlide();
  topbar(s);
  header(s, "Passo 5 · o caso", [
    { text: "Um processo real, " },
    { text: "na mesma notação", options: { color: C.magenta } },
  ], { size: 28, titleH: 0.65 });

  const PH = [
    ["O processo e a conversa", "Qual era o processo, quem executava, com que frequência acontecia.",
      "Uma frase literal de quem executava — a fala que virou losango. É o que amarra este slide ao slide 6."],
    ["O fluxo pintado + o placar", "O mesmo desenho do slide 9, com as caixas reais.",
      "“N caixas → X Python · Y IA · Z humano”. Se a maioria virou Python, diga isso em voz alta: é o ponto da palestra."],
    ["O que quebrou", "Um número de antes → depois que você defenda no Q&A.",
      "E a falha: de preferência uma em que o modelo errou com confiança e você só descobriu depois. Como detectou e qual guarda-corpo entrou."],
  ];
  const pw = (W - 2 * M - 0.6) / 3;
  PH.forEach(([lab, line, hint], i) => {
    const x = M + i * (pw + 0.3);
    dashCard(s, x, 2.15, pw, 2.5);
    s.addText(lab.toUpperCase(), {
      x: x + 0.28, y: 2.38, w: pw - 0.56, h: 0.22,
      margin: 0, fontFace: MONO, fontSize: 8.5, bold: true, color: C.magenta, charSpacing: 1,
    });
    s.addText(line, {
      x: x + 0.28, y: 2.66, w: pw - 0.56, h: 0.6,
      margin: 0, valign: "top", fontFace: FONT, fontSize: 11.5, color: C.inkSoft, lineSpacing: 15,
    });
    s.addText(hint, {
      x: x + 0.28, y: 3.3, w: pw - 0.56, h: 1.2,
      margin: 0, valign: "top", fontFace: FONT, fontSize: 10, italic: true, color: C.hint, lineSpacing: 13.5,
    });
  });

  callout(
    s, "Ainda a preencher",
    [
      { text: "Este slide vira " }, { text: "dois ou três", options: { bold: true } },
      { text: " quando o caso estiver definido: um do processo e da conversa, um do fluxo pintado, um do resultado e das cicatrizes. A estrutura já está de pé — falta o conteúdo." },
    ],
    5.3, 0.88
  );
  footer(s, "05 · O caso");
  s.addNotes(
    "PENDENTE: substituir pelos slides do caso real. Três blocos, na ordem: processo + a fala que virou " +
      "losango; o fluxo pintado com placar; o resultado e o que quebrou. ~4 min quando estiver pronto."
  );
}

/* ================= 13 · O KIT ================= */
{
  const s = pres.addSlide();
  topbar(s);
  header(s, "Passo 6 · pra levar embora", [
    { text: "O kit — os arquivos que eu usei " },
    { text: "pra montar tudo isso", options: { color: C.magenta } },
  ], { size: 28, titleH: 0.65 });

  const KIT = [
    ["7-perguntas.md", "O roteiro de entrevista", " do slide 4, com o que anotar em cada resposta."],
    ["notacao.mmd", "O fluxograma em Mermaid", " — copia, troca os nomes das caixas, versiona no repo."],
    ["canvas.md", "Uma linha por caixa", ": entrada, saída, dono, frequência, exceções, custo do erro."],
    ["classificar.md", "As três perguntas do slide 8", " em forma de checklist — rode uma vez por caixa."],
    ["prompt.template.md", "As sete seções de um prompt de produção", ": papel, tarefa, dados, regras, formato de saída, quando NÃO decidir, casos de borda."],
    ["evals/exemplo.yaml", "Vinte casos, cinco de borda", ", mais o comando que roda no CI e bloqueia o merge."],
    ["checklist-producao.md", "Doze itens antes de ligar o fluxo.", " Item desmarcado é risco aceito, com nome e data ao lado."],
  ];
  let ky = 1.98;
  const kh = 0.5;
  KIT.forEach(([file, lead, rest]) => {
    s.addShape(pres.ShapeType.roundRect, {
      x: M, y: ky, w: W - 2 * M, h: kh, rectRadius: 0.07,
      fill: { color: C.paper }, line: { color: C.line, width: 1 },
    });
    s.addText(file, {
      x: M + 0.28, y: ky + 0.11, w: 2.6, h: 0.28,
      margin: 0, valign: "middle", fontFace: MONO, fontSize: 10, color: C.magenta,
    });
    s.addText(
      [{ text: lead, options: { bold: true, color: C.ink } }, { text: rest, options: { color: C.inkSoft } }],
      { x: M + 3.05, y: ky + 0.05, w: W - 2 * M - 3.35, h: 0.40, margin: 0, valign: "middle", fontFace: FONT, fontSize: 10.5, lineSpacing: 13.5 }
    );
    ky += kh + 0.08;
  });

  dashCard(s, M, 6.02, W - 2 * M, 0.72);
  s.addText("LINK / QR A DEFINIR", {
    x: M + 0.28, y: 6.24, w: 2.3, h: 0.28,
    margin: 0, valign: "middle", fontFace: MONO, fontSize: 9.5, bold: true, color: C.magenta, charSpacing: 1,
  });
  s.addText(
    "Repositório público ou pasta compartilhada. Definir também se vai junto a versão instalável como skills, ou só os arquivos em Markdown — que funcionam com qualquer ferramenta.",
    { x: M + 2.75, y: 6.14, w: W - 2 * M - 3.05, h: 0.5, margin: 0, valign: "middle", fontFace: FONT, fontSize: 10, italic: true, color: C.hint, lineSpacing: 13 }
  );
  footer(s, "06 · O kit");
  s.addNotes(
    "PENDENTE: publicar o repositório e trocar a caixa tracejada por link + QR. Diga que o kit é o " +
      "motivo de ninguém precisar anotar nada durante a palestra. ~1 min."
  );
}

/* ================= 14 · FECHO ================= */
{
  const s = pres.addSlide();
  s.background = { color: C.deep };
  s.addText("PARA LEVAR", {
    x: M, y: 0.95, w: 8, h: 0.3,
    margin: 0, fontFace: FONT, fontSize: 11, bold: true, color: C.pink, charSpacing: 2.2,
  });
  s.addText(
    [{ text: "Três frases e ", options: { color: "FFFFFF" } },
     { text: "um desafio de uma hora", options: { color: C.pink } }],
    { x: M, y: 1.35, w: 11, h: 0.6, margin: 0, valign: "top", fontFace: FONT, fontSize: 26, bold: true }
  );
  const THREE = [
    ["01", [{ text: "A conversa vem antes do desenho. O desenho vem antes da " }, { text: "ferramenta", options: { bold: true } }, { text: "." }]],
    ["02", [{ text: "Se dá pra fazer com um " }, { text: "if", options: { bold: true } }, { text: ", faça com um if. IA é a terceira pergunta." }]],
    ["03", [{ text: "Mantenha a pessoa onde " }, { text: "errar é caro", options: { bold: true } }, { text: " — e prove que ela consegue discordar." }]],
  ];
  let ty = 2.3;
  THREE.forEach(([n, runs]) => {
    s.addText(n, {
      x: M, y: ty + 0.05, w: 0.5, h: 0.3,
      margin: 0, fontFace: MONO, fontSize: 12, bold: true, color: C.pink,
    });
    s.addText(runs, {
      x: M + 0.62, y: ty, w: 10.5, h: 0.6,
      margin: 0, valign: "top", fontFace: FONT, fontSize: 18, color: "FFFFFF", lineSpacing: 24,
    });
    ty += 0.78;
  });

  s.addShape(pres.ShapeType.roundRect, {
    x: M, y: 5.05, w: W - 2 * M, h: 1.35, rectRadius: 0.1,
    fill: { color: "FFFFFF", transparency: 90 }, line: { width: 0 },
  });
  s.addShape(pres.ShapeType.rect, { x: M, y: 5.05, w: 0.05, h: 1.35, fill: { color: C.pink }, line: { width: 0 } });
  s.addText("DESAFIO DE UMA HORA", {
    x: M + 0.28, y: 5.18, w: 6, h: 0.24,
    margin: 0, fontFace: FONT, fontSize: 9.5, bold: true, color: C.pink, charSpacing: 1.8,
  });
  s.addText(
    [
      { text: "Pegue alguém do seu time que executa um processo toda semana. Faça as " },
      { text: "sete perguntas", options: { bold: true } },
      { text: ". Desenhe o fluxo na frente da pessoa. Marque a única caixa que é pura digitação — e automatize " },
      { text: "só ela", options: { bold: true } },
      { text: ". Depois volte pra segunda." },
    ],
    { x: M + 0.28, y: 5.45, w: W - 2 * M - 0.56, h: 0.85, margin: 0, valign: "top", fontFace: FONT, fontSize: 13, color: "FFFFFF", lineSpacing: 18 }
  );
  s.addNotes(
    "Fecho. As três frases são o resumo da palestra inteira — leia devagar. O desafio de uma hora é o " +
      "call to action: não é 'automatize um processo', é 'faça uma entrevista'. ~1,5 min."
  );
}

/* ---------------- escreve ---------------- */
const path = require("path");
pres.writeFile({ fileName: path.join(__dirname, "deck.pptx") }).then((f) => {
  console.log("gerado:", f);
});
