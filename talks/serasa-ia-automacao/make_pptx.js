/**
 * Gera deck.pptx — versão editável da palestra "Automatização de processos com IA".
 * Paleta e motivo visual seguem a identidade Serasa Experian (roxo/magenta/navy,
 * cards squircle, badge circular magenta).
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
};
const FONT = "Arial";
const W = 13.333;
const M = 0.72; // margem lateral

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "Gabriel Corrêa";
pres.title = "Automatização de processos com IA";

const RAIL = [
  "Mapear o processo",
  "Decidir o que automatizar",
  "Humano na alça",
  "Ferramentas e práticas",
  "Caso prático",
];

/* ---------------- helpers ---------------- */

function card(slide, x, y, w, h, fill) {
  slide.addShape(pres.ShapeType.roundRect, {
    x, y, w, h,
    rectRadius: 0.12,
    fill: { color: fill || C.paper },
    line: { color: fill && fill !== C.paper ? fill : C.line, width: 1 },
    shadow: { type: "outer", color: "16224E", opacity: 0.07, blur: 10, offset: 2, angle: 90 },
  });
}

function badge(slide, x, y, d, label, fill) {
  slide.addShape(pres.ShapeType.ellipse, {
    x, y, w: d, h: d,
    fill: { color: fill || C.magenta },
    line: { color: fill || C.magenta, width: 0 },
  });
  if (label) {
    slide.addText(label, {
      x, y, w: d, h: d,
      align: "center", valign: "middle", margin: 0,
      fontFace: FONT, fontSize: 13, bold: true, color: "FFFFFF",
    });
  }
}

/** Eyebrow rosa em caixa alta + título com uma palavra em magenta. */
function header(slide, eyebrow, titleRuns, lede) {
  slide.addText(eyebrow.toUpperCase(), {
    x: M, y: 0.5, w: W - 2 * M, h: 0.3,
    margin: 0, fontFace: FONT, fontSize: 11, bold: true,
    color: C.magenta, charSpacing: 2.2,
  });
  slide.addText(titleRuns, {
    x: M, y: 0.85, w: W - 2 * M, h: 0.95,
    margin: 0, valign: "top", fontFace: FONT, fontSize: 30, bold: true,
    color: C.ink, lineSpacing: 34,
  });
  if (lede) {
    slide.addText(lede, {
      x: M, y: 1.82, w: W - 2 * M - 1.4, h: 0.42,
      margin: 0, fontFace: FONT, fontSize: 13.5, color: C.inkSoft, lineSpacing: 18,
    });
  }
}

/** Faixa de conclusão em lavanda no pé do slide. */
function callout(slide, label, runs, y) {
  const h = 0.92;
  slide.addShape(pres.ShapeType.roundRect, {
    x: M, y, w: W - 2 * M, h,
    rectRadius: 0.1,
    fill: { color: C.lavender },
    line: { color: C.lavender, width: 0 },
  });
  slide.addText(label.toUpperCase(), {
    x: M + 0.28, y: y + 0.11, w: 6, h: 0.22,
    margin: 0, fontFace: FONT, fontSize: 9.5, bold: true, color: C.magenta, charSpacing: 1.8,
  });
  slide.addText(runs, {
    x: M + 0.28, y: y + 0.33, w: W - 2 * M - 0.56, h: 0.5,
    margin: 0, fontFace: FONT, fontSize: 12, color: C.ink, lineSpacing: 16,
  });
}

function footer(slide, sec) {
  slide.addText("Automatização de processos com IA", {
    x: M, y: 6.92, w: 5, h: 0.28,
    margin: 0, fontFace: FONT, fontSize: 9, bold: true, color: "9A93AC",
  });
  slide.addText(sec, {
    x: W - M - 5, y: 6.92, w: 5, h: 0.28,
    margin: 0, align: "right", fontFace: FONT, fontSize: 9, color: "9A93AC",
  });
}

/** Slide de abertura de seção, com trilha das 5 paradas. */
function opener(idx, titleRuns, lede) {
  const s = pres.addSlide();
  s.background = { color: C.paper };
  RAIL.forEach((t, i) => {
    const now = i === idx;
    const done = i < idx;
    s.addText(String(i + 1).padStart(2, "0"), {
      x: M, y: 2.28 + i * 0.52, w: 0.4, h: 0.34,
      margin: 0, valign: "middle", fontFace: FONT, fontSize: 11,
      bold: now, color: now ? C.magenta : done ? C.inkSoft : "B9AFC9",
    });
    s.addText(t, {
      x: M + 0.45, y: 2.28 + i * 0.52, w: 3.5, h: 0.34,
      margin: 0, valign: "middle", fontFace: FONT, fontSize: 13,
      bold: now, color: now ? C.magenta : done ? C.ink : "B9AFC9",
    });
  });
  s.addShape(pres.ShapeType.line, {
    x: 4.62, y: 1.55, w: 0, h: 4.4, line: { color: C.line, width: 1 },
  });
  s.addText(`PARADA ${String(idx + 1).padStart(2, "0")}`, {
    x: 5.1, y: 2.15, w: 6, h: 0.3,
    margin: 0, fontFace: FONT, fontSize: 11, bold: true, color: C.magenta, charSpacing: 2.2,
  });
  s.addText(titleRuns, {
    x: 5.1, y: 2.55, w: W - 5.1 - M, h: 1.5,
    margin: 0, valign: "top", fontFace: FONT, fontSize: 34, bold: true,
    color: C.ink, lineSpacing: 38,
  });
  s.addText(lede, {
    x: 5.1, y: 4.2, w: W - 5.1 - M - 0.6, h: 0.8,
    margin: 0, fontFace: FONT, fontSize: 14, color: C.inkSoft, lineSpacing: 19,
  });
  return s;
}

/* ================= 01 · CAPA ================= */
{
  const s = pres.addSlide();
  s.background = { color: C.deep };
  // squircles decorativos
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
      { text: "Automatização de\nprocessos com ", options: { color: "FFFFFF" } },
      { text: "IA", options: { color: C.pink } },
    ],
    {
      x: M, y: 1.98, w: 9.9, h: 2.15,
      margin: 0, valign: "top", fontFace: FONT, fontSize: 42, bold: true, lineSpacing: 48,
    }
  );
  s.addText(
    "Como mapear, decidir o que automatizar e onde manter o humano na alça — sem virar mais um piloto abandonado.",
    {
      x: M, y: 4.2, w: 6.6, h: 1,
      margin: 0, fontFace: FONT, fontSize: 15, color: "E7DCEF", lineSpacing: 22,
    }
  );
  s.addText("Gabriel Corrêa", {
    x: M, y: 6.15, w: 6, h: 0.3,
    margin: 0, fontFace: FONT, fontSize: 13, bold: true, color: "FFFFFF",
  });
  s.addText("Palestra técnica · 25 minutos", {
    x: M, y: 6.45, w: 6, h: 0.3,
    margin: 0, fontFace: FONT, fontSize: 11, color: "C9B6D4",
  });
  s.addNotes(
    "Abertura curta. Nome, o que faço, e a promessa da palestra em uma frase: " +
      "ao final vocês vão sair com um método de uma página para decidir o que automatizar. " +
      "Prometa o caso prático do fim — planta a recompensa. ~1 min."
  );
}

/* ================= 02 · HOOK ================= */
{
  const s = pres.addSlide();
  s.background = { color: C.deep };
  s.addText("O PONTO DE PARTIDA", {
    x: M, y: 1.5, w: 9, h: 0.3,
    margin: 0, fontFace: FONT, fontSize: 11, bold: true, color: C.pink, charSpacing: 2.2,
  });
  s.addText(
    [
      { text: "A pergunta errada é ", options: { color: "FFFFFF" } },
      { text: "“o que a IA consegue fazer aqui?”", options: { color: C.pink } },
    ],
    {
      x: M, y: 1.95, w: 11.3, h: 1.5,
      margin: 0, valign: "top", fontFace: FONT, fontSize: 34, bold: true, lineSpacing: 40,
    }
  );
  s.addText(
    [
      { text: "A pergunta certa é: ", options: { color: "E7DCEF" } },
      {
        text: "neste processo, o que é decisão e o que é digitação?",
        options: { color: "FFFFFF", bold: true },
      },
    ],
    {
      x: M, y: 3.75, w: 10.6, h: 0.7,
      margin: 0, fontFace: FONT, fontSize: 18, lineSpacing: 25,
    }
  );
  s.addText(
    "Automação com IA é 80% desenho de processo e 20% modelo. Quem inverte essa conta entrega uma demo bonita que ninguém usa em produção.",
    {
      x: M, y: 4.7, w: 10.2, h: 1,
      margin: 0, fontFace: FONT, fontSize: 15, color: "E7DCEF", lineSpacing: 22,
    }
  );
  s.addNotes(
    "Pausa depois da pergunta errada. Deixe o silêncio trabalhar. " +
      "Essa é a tese da palestra: automação é desenho de processo, não escolha de modelo. ~1,5 min."
  );
}

/* ================= 03 · AGENDA ================= */
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  header(
    s,
    "O caminho",
    [
      { text: "Cinco paradas, uma ", options: { color: C.ink } },
      { text: "ordem que importa", options: { color: C.magenta } },
    ],
    "Cada parada só faz sentido depois da anterior. A maioria dos projetos falha porque começa na parada 4."
  );
  const items = [
    ["Mapear", "Desenhar o processo como ele é de verdade — com volume, exceções e custo do erro."],
    ["Decidir", "Separar o que vira código, o que vira IA e o que continua humano."],
    ["Manter o humano", "Escolher o padrão de supervisão certo para cada etapa — e provar que ele é real."],
    ["Ferramentar", "Stack por camada, práticas que sustentam produção, e o caso prático."],
  ];
  const cw = 2.86, gap = 0.28, y = 2.65, ch = 3.4;
  items.forEach(([t, d], i) => {
    const x = M + i * (cw + gap);
    card(s, x, y, cw, ch, i === 3 ? C.lavender : C.paper);
    badge(s, x + 0.3, y + 0.32, 0.62, String(i + 1), i === 3 ? C.purple : C.magenta);
    s.addText(t, {
      x: x + 0.3, y: y + 1.12, w: cw - 0.6, h: 0.5,
      margin: 0, valign: "top", fontFace: FONT, fontSize: 16, bold: true, color: C.ink,
    });
    s.addText(d, {
      x: x + 0.3, y: y + 1.72, w: cw - 0.6, h: 1.4,
      margin: 0, valign: "top", fontFace: FONT, fontSize: 12, color: C.inkSoft, lineSpacing: 16,
    });
  });
  footer(s, "Agenda");
  s.addNotes("Contrato com a plateia. Aponte que a parada 4 (ferramentas) é onde todo mundo começa — e é por isso que dá errado. ~1 min.");
}

/* ================= 04 · OPENER MAPEAR ================= */
opener(
  0,
  [
    { text: "Mapear antes de ", options: { color: C.ink } },
    { text: "automatizar", options: { color: C.magenta } },
  ],
  "Você não pode automatizar o que não conseguiu descrever em uma tabela."
).addNotes("Transição rápida, 10 segundos. Não leia o slide.");

/* ================= 05 · ERRO Nº 1 ================= */
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  header(s, "O erro nº 1", [
    { text: "Automatizar um processo que ninguém mapeou não gera eficiência — gera o ", options: { color: C.ink } },
    { text: "mesmo caos, mais rápido", options: { color: C.magenta } },
  ]);
  const items = [
    ["Sintoma 1", "Ninguém sabe dizer a taxa de exceção do processo. Se você não sabe quanto ele já erra hoje, não tem como definir o que o modelo precisa acertar."],
    ["Sintoma 2", "O processo existe em quatro versões — uma por pessoa que executa. Automatizar aqui significa escolher a versão de alguém e chamar de padrão."],
    ["Sintoma 3", "A primeira pergunta da reunião é sobre ferramenta — “vamos usar n8n?” — e não sobre o fluxo. A ferramenta é consequência, não ponto de partida."],
  ];
  const cw = 3.87, gap = 0.32, y = 2.6, ch = 2.6;
  items.forEach(([t, d], i) => {
    const x = M + i * (cw + gap);
    card(s, x, y, cw, ch, C.paper);
    badge(s, x + 0.32, y + 0.3, 0.58, String(i + 1));
    s.addText(t, {
      x: x + 0.32, y: y + 1.02, w: cw - 0.64, h: 0.36,
      margin: 0, fontFace: FONT, fontSize: 15, bold: true, color: C.ink,
    });
    s.addText(d, {
      x: x + 0.32, y: y + 1.42, w: cw - 0.64, h: 1.05,
      margin: 0, valign: "top", fontFace: FONT, fontSize: 11.5, color: C.inkSoft, lineSpacing: 15,
    });
  });
  callout(
    s,
    "Regra prática",
    [
      { text: "Se o processo não cabe numa tabela de uma página, ele não é um processo — ", options: {} },
      { text: "são três processos que ninguém separou ainda.", options: { bold: true } },
    ],
    5.55
  );
  footer(s, "01 · Mapear");
  s.addNotes(
    "Peça levantada de mão: quem sabe a taxa de exceção do processo que quer automatizar? " +
      "Costuma levantar pouca mão — é o ponto. ~2 min."
  );
}

/* ================= 06 · CANVAS ================= */
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  header(
    s,
    "A ferramenta que resolve 80% do problema",
    [
      { text: "O canvas de mapeamento — ", options: { color: C.ink } },
      { text: "uma linha por etapa", options: { color: C.magenta } },
    ],
    "Exemplo: triagem de solicitações de suporte. As duas colunas destacadas decidem tudo."
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
    options: Object.assign(
      { color: C.inkSoft, fontSize: 10.5, fontFace: FONT, valign: "middle" },
      o || {}
    ),
  });
  const rows = [
    [th("Etapa"), th("Entrada"), th("Saída"), th("É decisão?", true), th("Custo do erro", true), th("Exceções"), th("Volume/mês"), th("Dono")],
    [td("1. Receber e registrar", { color: C.ink, bold: true }), td("e-mail, formulário"), td("ticket criado"), td("Não"), td("baixo", { color: C.green, bold: true }), td("2%"), td("12.000"), td("Suporte")],
    [td("2. Classificar assunto", { color: C.ink, bold: true }), td("texto livre"), td("categoria"), td("Sim — ambígua"), td("baixo", { color: C.green, bold: true }), td("15%"), td("12.000"), td("Suporte")],
    [td("3. Verificar elegibilidade", { color: C.ink, bold: true }), td("dados do cliente"), td("sim / não"), td("Sim — regra fixa"), td("alto", { color: C.magenta, bold: true }), td("5%"), td("4.000"), td("Suporte")],
    [td("4. Redigir resposta", { color: C.ink, bold: true }), td("contexto + histórico"), td("texto"), td("Sim — ambígua"), td("médio", { color: C.amber, bold: true }), td("20%"), td("9.000"), td("Suporte")],
    [td("5. Aprovar exceção comercial", { color: C.ink, bold: true }), td("proposta"), td("decisão"), td("Sim — julgamento"), td("alto, irreversível", { color: C.magenta, bold: true }), td("—"), td("300"), td("Gestor")],
  ];
  s.addTable(rows, {
    x: M, y: 2.5, w: W - 2 * M,
    colW: [2.55, 1.75, 1.35, 1.75, 1.85, 1.0, 1.15, 0.49],
    rowH: 0.42,
    border: { type: "solid", color: C.line, pt: 1 },
    fill: { color: C.paper },
    margin: 0.07,
  });
  callout(
    s,
    "Como ler",
    [
      { text: "Linha 1 é digitação → ", options: {} }, { text: "código", options: { bold: true } },
      { text: ". Linhas 2 e 4 são decisão ambígua com erro tolerável → ", options: {} }, { text: "IA", options: { bold: true } },
      { text: ". Linha 3 é regra fixa → ", options: {} }, { text: "código", options: { bold: true } },
      { text: ", nunca LLM. Linha 5 é julgamento irreversível → ", options: {} }, { text: "humano", options: { bold: true } },
      { text: ". O mapa dá a arquitetura antes de você escrever uma linha.", options: {} },
    ],
    5.62
  );
  footer(s, "01 · Mapear");
  s.addNotes(
    "SLIDE-CHAVE — dê tempo, a plateia vai fotografar. Percorra as colunas 'É decisão?' e " +
      "'Custo do erro' e mostre que elas sozinhas dão a arquitetura. Diga que o canvas cabe " +
      "em qualquer processo, e que preencher leva uma hora. ~3 min."
  );
}

/* ================= 07 · OPENER DECIDIR ================= */
opener(
  1,
  [
    { text: "O que automatizar — e com ", options: { color: C.ink } },
    { text: "o quê", options: { color: C.magenta } },
  ],
  "Antes de perguntar qual modelo, pergunte se precisa de modelo."
).addNotes("Transição. 10 segundos.");

/* ================= 08 · MATRIZ ================= */
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  header(s, "A matriz de decisão", [
    { text: "Custo do erro ", options: { color: C.ink } },
    { text: "×", options: { color: C.magenta } },
    { text: " reversibilidade", options: { color: C.ink } },
  ]);
  const quads = [
    ["ALTO · REVERSÍVEL", "Humano supervisiona", "A IA executa sozinha, o humano acompanha e reverte. Exige undo real e alerta — painel que ninguém abre não é supervisão.", C.lavender, C.purple],
    ["ALTO · IRREVERSÍVEL", "Humano aprova antes", "Nada acontece sem clique. Pagamento, comunicação ao cliente, alteração de cadastro, decisão que afeta crédito.", C.pinkBg, C.magenta],
    ["BAIXO · REVERSÍVEL", "Automatize e siga", "Log completo + revisão por amostragem. Aqui está o ganho fácil que quase ninguém colhe porque foi direto para o quadrante difícil.", C.greenBg, C.green],
    ["BAIXO · IRREVERSÍVEL", "Automatize com rede", "dry-run, ambiente de teste, janela de cancelamento. Torne reversível e o problema muda de quadrante.", C.amberBg, C.amber],
  ];
  // x0 recuado 0.5" para caber o rótulo do eixo Y; largura fecha exatamente na margem direita
  const x0 = M + 0.5, qw = (W - M - x0 - 0.3) / 2, qh = 1.55, gy = 0.22, y0 = 2.45;
  quads.forEach(([tag, title, body, bg, fg], i) => {
    const x = x0 + (i % 2) * (qw + 0.3);
    const y = y0 + Math.floor(i / 2) * (qh + gy);
    s.addShape(pres.ShapeType.roundRect, {
      x, y, w: qw, h: qh, rectRadius: 0.1,
      fill: { color: bg }, line: { color: bg, width: 0 },
    });
    s.addText(tag, {
      x: x + 0.26, y: y + 0.14, w: qw - 0.52, h: 0.22,
      margin: 0, fontFace: FONT, fontSize: 9.5, bold: true, color: fg, charSpacing: 1.4,
    });
    s.addText(title, {
      x: x + 0.26, y: y + 0.38, w: qw - 0.52, h: 0.32,
      margin: 0, fontFace: FONT, fontSize: 15, bold: true, color: C.ink,
    });
    s.addText(body, {
      x: x + 0.26, y: y + 0.74, w: qw - 0.52, h: 0.78,
      margin: 0, valign: "top", fontFace: FONT, fontSize: 11, color: C.inkSoft, lineSpacing: 14,
    });
  });
  // rótulos de eixo
  s.addText("CUSTO ALTO", {
    x: M - 0.55, y: y0 + 0.5, w: 1.6, h: 0.3, rotate: 270,
    margin: 0, align: "center", fontFace: FONT, fontSize: 9.5, bold: true, color: C.ink, charSpacing: 1.2,
  });
  s.addText("CUSTO BAIXO", {
    x: M - 0.55, y: y0 + qh + gy + 0.5, w: 1.6, h: 0.3, rotate: 270,
    margin: 0, align: "center", fontFace: FONT, fontSize: 9.5, bold: true, color: C.ink, charSpacing: 1.2,
  });
  // rótulos de coluna (eixo X) acima dos quadrantes
  ["REVERSÍVEL", "IRREVERSÍVEL"].forEach((t, i) => {
    s.addText(t, {
      x: x0 + i * (qw + 0.3), y: y0 - 0.32, w: qw, h: 0.26,
      margin: 0, align: "center", fontFace: FONT, fontSize: 9.5,
      bold: true, color: C.inkSoft, charSpacing: 1.4,
    });
  });
  callout(
    s,
    "Filtro anterior à matriz",
    [
      { text: "A etapa é determinística e estável? Então é ", options: {} },
      { text: "código", options: { bold: true } },
      { text: ", não é IA. LLM em cima de regra fixa é caro, lento e não-determinístico — três defeitos onde antes havia zero.", options: {} },
    ],
    5.88
  );
  footer(s, "02 · Decidir");
  s.addNotes(
    "O quadrante que a plateia subestima é 'baixo · reversível' — é onde está o ganho rápido. " +
      "O erro comum é atacar direto 'alto · irreversível' porque é o processo mais visível. " +
      "Feche pelo filtro: se dá pra fazer com SQL, não use LLM. ~3 min."
  );
}

/* ================= 09 · GANHA / PERDE ================= */
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  header(s, "Onde o modelo é a ferramenta certa", [
    { text: "LLM ", options: { color: C.ink } },
    { text: "ganha", options: { color: C.magenta } },
    { text: " — e onde LLM ", options: { color: C.ink } },
    { text: "perde", options: { color: C.purple } },
  ]);
  const cols = [
    ["Use IA", C.magenta, [
      "Não-estruturado → estruturado: e-mail, PDF, transcrição, chamado virando JSON confiável.",
      "Classificação de borda confusa — onde a regra já tem 40 exceções e cresce todo mês.",
      "Rascunho que um humano revisa: resposta, resumo, código, documento, especificação.",
      "Interface em linguagem natural sobre um sistema que já existe.",
      "Tarefa caro de especificar, barato de verificar — a assinatura de um bom caso de uso.",
    ]],
    ["Não use IA", C.navy, [
      "Aritmética exata, conciliação, soma de valores. Dê a calculadora ao modelo, não a conta.",
      "Regra determinística e estável — isso é um if, e um if você testa.",
      "Qualquer etapa que precise de 100% de recall e não tenha rede de segurança.",
      "Decisão que precisa ser explicada juridicamente sem rastro de como foi tomada.",
      "Processo onde verificar custa mais que executar — a automação vira trabalho novo.",
    ]],
  ];
  cols.forEach(([title, color, items], ci) => {
    const x = M + ci * ((W - 2 * M) / 2 + 0.2);
    const cw = (W - 2 * M) / 2 - 0.2;
    badge(s, x, 2.5, 0.5, ci === 0 ? "✓" : "✕", color);
    s.addText(title, {
      x: x + 0.68, y: 2.5, w: cw - 0.68, h: 0.5,
      margin: 0, valign: "middle", fontFace: FONT, fontSize: 18, bold: true, color: C.ink,
    });
    s.addShape(pres.ShapeType.line, {
      x, y: 3.14, w: cw, h: 0, line: { color, width: 2 },
    });
    s.addText(
      items.map((t, i) => ({
        text: t,
        options: { bullet: { characterCode: "25CF" }, breakLine: i !== items.length - 1 },
      })),
      {
        x, y: 3.32, w: cw, h: 2.9,
        margin: 0, valign: "top", fontFace: FONT, fontSize: 12,
        color: C.inkSoft, lineSpacing: 16, paraSpaceAfter: 8,
      }
    );
  });
  footer(s, "02 · Decidir");
  s.addNotes(
    "A coluna da direita é a que ganha credibilidade com engenheiro. " +
      "Insista: dar a calculadora ao modelo em vez de pedir a conta. " +
      "A última linha de cada coluna é a heurística que resume tudo. ~2,5 min."
  );
}

/* ================= 10 · OPENER HUMANO ================= */
opener(
  2,
  [
    { text: "Human in the loop", options: { color: C.magenta } },
    { text: " não é um checkbox", options: { color: C.ink } },
  ],
  "São quatro padrões diferentes, com custos diferentes. Escolher errado custa caro nas duas direções."
).addNotes("Transição. 10 segundos.");

/* ================= 11 · QUATRO PADRÕES ================= */
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  header(s, "Os quatro padrões", [
    { text: "O humano pode estar em ", options: { color: C.ink } },
    { text: "quatro posições", options: { color: C.magenta } },
    { text: " diferentes", options: { color: C.ink } },
  ]);
  const items = [
    ["Aprovação", "IA propõe, humano decide.", "Nada tem efeito sem clique.", "Para: ação irreversível ou regulada.\nCusto: latência e gargalo humano."],
    ["Supervisão", "IA executa, humano monitora.", "E pode reverter.", "Para: volume alto e reversível.\nExige: undo e alerta ativo, não painel."],
    ["Copiloto", "Humano conduz, IA acelera.", "Código, análise, redação.", "Para: trabalho de especialista.\nGanho imediato, risco baixo. Comece aqui."],
    ["Escalonamento", "IA resolve o claro,", "encaminha o ambíguo.", "Exige: caminho explícito para “não sei” — e que ele seja recompensado."],
  ];
  const cw = 2.86, gap = 0.28, y = 2.55, ch = 2.85;
  items.forEach(([t, b1, b2, meta], i) => {
    const x = M + i * (cw + gap);
    card(s, x, y, cw, ch, C.paper);
    badge(s, x + 0.3, y + 0.28, 0.54, String(i + 1));
    s.addText(t, {
      x: x + 0.3, y: y + 0.94, w: cw - 0.6, h: 0.34,
      margin: 0, fontFace: FONT, fontSize: 15, bold: true, color: C.ink,
    });
    s.addText(
      [
        { text: b1 + " ", options: { bold: true, color: C.ink } },
        { text: b2, options: { color: C.inkSoft } },
      ],
      {
        x: x + 0.3, y: y + 1.32, w: cw - 0.6, h: 0.72,
        margin: 0, valign: "top", fontFace: FONT, fontSize: 11.5, lineSpacing: 15,
      }
    );
    s.addText(meta, {
      x: x + 0.3, y: y + 2.02, w: cw - 0.6, h: 0.72,
      margin: 0, valign: "top", fontFace: FONT, fontSize: 10.5, color: C.purple, lineSpacing: 14,
    });
  });
  callout(
    s,
    "O detalhe que muda o projeto",
    [
      { text: "O padrão não é escolhido por processo, é escolhido ", options: {} },
      { text: "por linha do canvas", options: { bold: true } },
      { text: ". Um fluxo real normalmente usa três dos quatro ao mesmo tempo.", options: {} },
    ],
    5.75
  );
  footer(s, "03 · Humano na alça");
  s.addNotes(
    "Núcleo da palestra. Amarre cada padrão a uma linha do canvas do slide 6: " +
      "linha 2 → escalonamento por confiança, linha 4 → aprovação, linha 5 → humano decide. " +
      "Recomende começar por copiloto: é o de menor risco e ganho imediato. ~3 min."
  );
}

/* ================= 12 · RUBBER STAMPING ================= */
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
      [
        { text: `${i + 1}. `, options: { bold: true, color: C.ink } },
        { text: t, options: { color: C.inkSoft } },
      ],
      {
        x: M + 0.34, y: y + 1.0 + i * 0.66, w: cw - 0.68, h: 0.62,
        margin: 0, valign: "top", fontFace: FONT, fontSize: 12, lineSpacing: 16,
      }
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
      {
        text: " garante ao titular o direito de solicitar revisão de decisões tomadas unicamente com base em tratamento automatizado que afetem seus interesses.",
        options: { color: C.inkSoft },
      },
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
      { text: "desenhe o log de decisão junto com o fluxo, não depois da primeira solicitação de revisão.", options: {} },
    ],
    { x: x2 + 0.34, y: y + 2.5, w: cw - 0.68, h: 0.42, margin: 0, valign: "top", fontFace: FONT, fontSize: 11.5, color: C.purple, lineSpacing: 15 }
  );
  footer(s, "03 · Humano na alça");
  s.addNotes(
    "Slide mais relevante para o contexto Serasa. Taxa de rejeição de 0% como alarme é o " +
      "insight que gera pergunta na plateia. No art. 20 seja preciso: o direito é à revisão, " +
      "e o gatilho é a decisão tomada UNICAMENTE por tratamento automatizado. ~2,5 min."
  );
}

/* ================= 13 · OPENER FERRAMENTAS ================= */
opener(
  3,
  [
    { text: "Ferramentas: um ", options: { color: C.ink } },
    { text: "mapa", options: { color: C.magenta } },
    { text: ", não um desfile de logos", options: { color: C.ink } },
  ],
  "Ferramenta muda a cada seis meses. As camadas, não."
).addNotes("Transição. 10 segundos.");

/* ================= 14 · CAMADAS ================= */
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
      margin: 0, valign: "middle", fontFace: FONT, fontSize: 11.5,
      color: key ? C.magenta : C.purple,
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
    "Não venda ferramenta. As duas linhas destacadas são o recado: orquestração e eval. " +
      "Sobre banco vetorial, seja direto: na maioria dos casos a busca que a empresa já tem " +
      "resolve, e o vetorial entra só quando ela falha. ~2,5 min."
  );
}

/* ================= 15 · QUATRO PERGUNTAS ================= */
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  header(s, "Critério de escolha", [
    { text: "Quatro perguntas antes de adotar ", options: { color: C.ink } },
    { text: "qualquer", options: { color: C.magenta } },
    { text: " ferramenta", options: { color: C.ink } },
  ]);
  const qs = [
    ["O dado sai da empresa?", "Não “a ferramenta é segura?”, mas qual campo exatamente atravessa a fronteira. A resposta muda contrato, base legal e, muitas vezes, a arquitetura."],
    ["Quanto custa uma execução — e dez mil?", "Custo por token é linha de orçamento, não detalhe técnico. Faça a conta com o volume do canvas antes do piloto, não depois da fatura."],
    ["Se a ferramenta dobrar de preço ou morrer, o que acontece?", "Trocar de modelo deve ser configuração, não reescrita. Isole a chamada atrás de uma interface sua desde o primeiro dia."],
    ["Quem mantém isso em seis meses?", "Automação sem dono apodrece — em silêncio, e normalmente só se descobre pelo cliente. Nome de pessoa, não nome de squad."],
  ];
  const y0 = 2.6, rh = 1.05;
  qs.forEach(([q, a], i) => {
    const y = y0 + i * rh;
    badge(s, M, y + 0.04, 0.56, String(i + 1));
    s.addText(q, {
      x: M + 0.78, y, w: W - 2 * M - 0.78, h: 0.36,
      margin: 0, fontFace: FONT, fontSize: 16, bold: true, color: C.ink,
    });
    s.addText(a, {
      x: M + 0.78, y: y + 0.38, w: W - 2 * M - 0.9, h: 0.56,
      margin: 0, valign: "top", fontFace: FONT, fontSize: 12, color: C.inkSoft, lineSpacing: 16,
    });
  });
  footer(s, "04 · Ferramentas");
  s.addNotes(
    "A pergunta 1 é a que trava projeto em empresa regulada — trate como primeira, não última. " +
      "A pergunta 4 é a que mais gera concordância silenciosa na plateia. ~2 min."
  );
}

/* ================= 16 · BOAS PRÁTICAS ================= */
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  header(s, "Boas práticas", [
    { text: "As dez que ", options: { color: C.ink } },
    { text: "doem", options: { color: C.magenta } },
    { text: " quando você ignora", options: { color: C.ink } },
  ]);
  const ps = [
    ["Defina o “certo” antes do prompt.", "Vinte casos reais com resposta esperada. Sem isso não é automação, é aposta."],
    ["Prompt é código.", "Versionado, revisado em PR, testado no CI. Não mora num Google Doc."],
    ["Fixe a versão do modelo.", "Atualizar modelo é deploy — com eval antes e rollback previsto."],
    ["Contexto e ferramenta antes de modelo maior.", "A maioria das falhas é falta de acesso, não de inteligência."],
    ["Dê a ferramenta determinística.", "O modelo decide quando usar; o código faz a conta."],
    ["Projete a falha explícita.", "Pior que errar é errar com confiança e em silêncio. “Não sei” é saída válida."],
    ["Registre input, output, versão e quem decidiu.", "Auditoria não é opcional — e não é reconstruível depois."],
    ["Custo e latência são requisitos.", "Definidos no começo, medidos sempre, não descobertos no fim do trimestre."],
    ["Piloto → medir → escalar.", "Um processo, uma etapa, uma métrica. Nunca big bang."],
    ["Toda automação tem dono e data de revisão.", "O processo muda; a automação não muda sozinha."],
  ];
  const colW = (W - 2 * M) / 2 - 0.25, y0 = 2.55, rh = 0.86;
  ps.forEach(([lead, rest], i) => {
    const col = i < 5 ? 0 : 1;
    const row = i % 5;
    const x = M + col * (colW + 0.5);
    const y = y0 + row * rh;
    s.addText(String(i + 1).padStart(2, "0"), {
      x, y: y + 0.02, w: 0.42, h: 0.3,
      margin: 0, fontFace: FONT, fontSize: 11, bold: true, color: C.magenta,
    });
    s.addText(
      [
        { text: lead + " ", options: { bold: true, color: C.ink } },
        { text: rest, options: { color: C.inkSoft } },
      ],
      {
        x: x + 0.46, y, w: colW - 0.46, h: 0.8,
        margin: 0, valign: "top", fontFace: FONT, fontSize: 11.5, lineSpacing: 15,
      }
    );
  });
  footer(s, "04 · Práticas");
  s.addNotes(
    "Não leia as dez. Escolha três para falar — 1, 6 e 10 são as que mais doem — e diga que " +
      "o resto está no material. Se o tempo apertar, este é o slide para acelerar. ~2 min."
  );
}

/* ================= 17 · OPENER CASO ================= */
opener(
  4,
  [
    { text: "Como eu fiz — ", options: { color: C.ink } },
    { text: "na prática", options: { color: C.magenta } },
  ],
  "Um processo real, o mapa antes e depois, e o que quebrou no caminho."
).addNotes("Mude o tom aqui: menos método, mais história. A plateia relaxa e presta mais atenção.");

/* ================= 18 · CASO: FLUXO ================= */
{
  const s = pres.addSlide();
  s.background = { color: C.paper };
  header(s, "Caso prático · o processo", [
    { text: "O fluxo, etapa por etapa — e ", options: { color: C.ink } },
    { text: "quem executa cada uma", options: { color: C.magenta } },
  ]);
  const steps = [
    ["Etapa", "O que entra e o que sai desta etapa.", "automatizado"],
    ["Etapa", "O que entra e o que sai desta etapa.", "automatizado"],
    ["Etapa", "Onde você entrou na alça — e por quê.", "humano aprova"],
    ["Etapa", "O que entra e o que sai desta etapa.", "automatizado"],
    ["Etapa", "Decisão final que continuou sua.", "humano decide"],
  ];
  const cw = 2.24, gap = 0.19, y = 2.75, ch = 2.35;
  steps.forEach(([t, d, mode], i) => {
    const x = M + i * (cw + gap);
    const isAuto = mode === "automatizado";
    s.addShape(pres.ShapeType.roundRect, {
      x, y, w: cw, h: ch, rectRadius: 0.1,
      fill: { color: isAuto ? "F5FAF7" : C.lavender },
      line: { color: isAuto ? "BFDDCE" : "DDD2EA", width: 1 },
    });
    s.addText(String(i + 1).padStart(2, "0"), {
      x: x + 0.26, y: y + 0.2, w: 1, h: 0.26,
      margin: 0, fontFace: FONT, fontSize: 11, bold: true, color: C.magenta,
    });
    s.addText(t, {
      x: x + 0.26, y: y + 0.5, w: cw - 0.52, h: 0.3,
      margin: 0, fontFace: FONT, fontSize: 14, bold: true, color: C.ink,
    });
    s.addText(d, {
      x: x + 0.26, y: y + 0.85, w: cw - 0.52, h: 0.9,
      margin: 0, valign: "top", fontFace: FONT, fontSize: 11, color: C.inkSoft, lineSpacing: 14,
    });
    s.addShape(pres.ShapeType.roundRect, {
      x: x + 0.26, y: y + ch - 0.48, w: cw - 0.52, h: 0.3, rectRadius: 0.15,
      fill: { color: isAuto ? C.greenBg : "EEE3F4" },
      line: { width: 0 },
    });
    s.addText(mode, {
      x: x + 0.26, y: y + ch - 0.48, w: cw - 0.52, h: 0.3,
      margin: 0, align: "center", valign: "middle",
      fontFace: FONT, fontSize: 9.5, bold: true, color: isAuto ? C.green : C.purple,
    });
    if (i < steps.length - 1) {
      s.addText("›", {
        x: x + cw, y: y + ch / 2 - 0.2, w: gap, h: 0.4,
        margin: 0, align: "center", valign: "middle",
        fontFace: FONT, fontSize: 18, color: "B9AFC9",
      });
    }
  });
  callout(
    s,
    "A preencher com o seu caso",
    [
      {
        text: "Substitua as cinco etapas pelo fluxo real: nome da etapa, entrada → saída, e o modo (automatizado / humano aprova / humano decide / copiloto). Mantenha o contraste visual: verde = máquina, lavanda = você.",
        options: { italic: true },
      },
    ],
    5.55
  );
  footer(s, "05 · Caso prático");
  s.addNotes(
    "PREENCHER. Conte o fluxo como história, não como lista. O contraste verde/lavanda deve " +
      "deixar óbvio, de longe, onde você continuou na alça. ~2 min."
  );
}

/* ================= 19 · CASO: RESULTADO ================= */
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
    ["O que quebrou", "A falha mais interessante do projeto — de preferência uma em que o modelo errou com confiança e você só descobriu depois.\n\nComo você detectou, e qual guarda-corpo entrou depois."],
    ["O que eu faria diferente", "Uma coisa concreta. Normalmente: “teria escrito os casos de teste antes do prompt” ou “teria começado por uma etapa menor”."],
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
        text: "Fechar amarrando à parada 03: qual dos quatro padrões você usou em cada ponto, e o que aconteceu quando tentou tirar o humano de onde ele era necessário.",
        options: { italic: true },
      },
    ],
    5.85
  );
  footer(s, "05 · Caso prático");
  s.addNotes(
    "PREENCHER. O quadro do meio é o mais valioso: plateia técnica confia em quem mostra a " +
      "falha. Feche amarrando aos quatro padrões da parada 03. ~2,5 min."
  );
}

/* ================= 20 · FECHO ================= */
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
    [[{ text: "Mapeie o processo ", options: {} }, { text: "antes", options: { bold: true } }, { text: " de escolher a ferramenta.", options: {} }]],
    [[{ text: "Automatize o que é digitação. Mantenha o humano onde ", options: {} }, { text: "errar é caro", options: { bold: true } }, { text: ".", options: {} }]],
    [[{ text: "Sem eval e sem dono, nenhuma automação sobrevive ao ", options: {} }, { text: "terceiro mês", options: { bold: true } }, { text: ".", options: {} }]],
  ];
  three.forEach((runs, i) => {
    const y = 2.35 + i * 0.82;
    s.addText(String(i + 1).padStart(2, "0"), {
      x: M, y, w: 0.5, h: 0.4,
      margin: 0, valign: "middle", fontFace: FONT, fontSize: 13, bold: true, color: C.pink,
    });
    s.addText(runs[0].map((r) => ({ text: r.text, options: Object.assign({ color: "FFFFFF" }, r.options) })), {
      x: M + 0.62, y, w: 10.6, h: 0.5,
      margin: 0, valign: "middle", fontFace: FONT, fontSize: 17, lineSpacing: 23,
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
      { text: "Escolha um processo que você executa toda semana. Preencha o canvas de uma página. Marque a única linha que é pura digitação. Automatize ", options: {} },
      { text: "só ela", options: { bold: true } },
      { text: ". Meça. Depois volte para a segunda linha.", options: {} },
    ],
    {
      x: M + 0.34, y: 5.56, w: W - 2 * M - 0.68, h: 0.7,
      margin: 0, valign: "top", fontFace: FONT, fontSize: 13.5, color: "FFFFFF", lineSpacing: 19,
    }
  );
  s.addText("Obrigado — perguntas?", {
    x: M, y: 6.65, w: 8, h: 0.35,
    margin: 0, fontFace: FONT, fontSize: 14, bold: true, color: C.pink,
  });
  s.addNotes(
    "Feche pelo desafio, não pelo agradecimento — dá algo para a plateia fazer na segunda-feira. " +
      "Deixe este slide no telão durante o Q&A: as três frases sustentam a discussão. ~1,5 min."
  );
}

pres.writeFile({ fileName: __dirname + "/deck.pptx" }).then((f) => console.log("gerado:", f));
