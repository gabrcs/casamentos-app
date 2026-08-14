# Automação de processos com IA — Serasa Experian / Tecnologia

Palestra técnica de 20-25 minutos. 14 slides. Apresentador: **Bruno Prata**.

**Princípio do deck:** a palestra segue o caminho real de quem automatiza um processo —
**conversar → desenhar → decidir quem faz cada caixa → escolher ferramenta → um caso → o kit**.
Cada seção entrega um artefato que a plateia copia. Teoria só onde não tem como ensinar
na prática.

**A tese:** IA é a terceira pergunta, nunca a primeira. Se dá pra fazer com um `if`,
faça com um `if`; se o erro é caro e irreversível, é humano; o que sobra é IA.

## Arquivos

| Arquivo | O que é |
|---|---|
| `deck.html` | Deck para apresentar. Auto-contido (fonte embutida), abre em qualquer navegador. **Gerado — não edite.** |
| `deck.src.html` | Fonte do deck HTML. É aqui que você edita. |
| `build.py` | Injeta as fontes em `deck.src.html` → `deck.html`. Rode após cada edição. |
| `deck.pptx` | Versão PowerPoint editável, com notas do apresentador em todos os slides. **Gerado.** |
| `make_pptx.js` | Gerador do `.pptx`. |
| `fonts/` | Roboto e Roboto Mono (subsets latin/latin-ext) para embutir no HTML. |
| `assets/` | Foto do apresentador (**não versionada**) e `skill-preview.png`, a saída da skill mostrada no slide 13. |
| `kit/` | A skill `mapear-processo`, empacotada e com exemplos. Veja `kit/README.md`. |
| `qa/check_html.mjs` | Renderiza os 14 slides no Chromium e checa overflow, sangramento e texto recortado. |
| `qa/check_pptx.py` | Checagem geométrica do `.pptx` com métricas de fonte reais. |
| `qa/measure_rhythm.mjs` | Mede o vão entre blocos e a folga antes do rodapé, slide a slide. |
| `qa/simulate_cvd.py` | Simula protanopia e deuteranopia num PNG, para conferir a classificação. |
| `qa/make_qr.py` | Gera o QR do kit a partir de `assets/kit-link.txt`. |

```bash
python3 build.py            # reconstrói deck.html
node make_pptx.js           # reconstrói deck.pptx
node qa/check_html.mjs      # QA do HTML (gera qa/shots/*.png)
python3 qa/check_pptx.py deck.pptx
node qa/measure_rhythm.mjs   # ritmo vertical
node qa/make_preview.mjs     # recaptura o print da skill do slide 13
python3 qa/make_qr.py        # gera o QR (precisa de assets/kit-link.txt)
python3 qa/simulate_cvd.py qa/shots/s09.png   # confere as cores no daltonismo
```

## Apresentar o deck HTML

Abra `deck.html` no navegador.

| Tecla | Ação |
|---|---|
| `→` `↓` `espaço` | Próximo slide |
| `←` `↑` | Slide anterior |
| `Home` / `End` | Primeiro / último slide |
| `F` | Tela cheia |

Clicar na faixa esquerda da tela volta um slide; no resto, avança. A URL guarda o slide
atual (`#s8`), então é seguro dar refresh no meio da apresentação.

Para PDF: imprimir pelo navegador em paisagem, sem margens.

## Estrutura

| # | Slide | Artefato que entrega | Tempo |
|---|---|---|---|
| 1 | Capa | — | 1 min |
| 2 | **Bio** — foto, credenciais e a tese em uma frase | — | 1 min |
| 3 | **Duas perguntas para o mesmo processo** — "o que querem automatizar?" vs. "como você faz hoje?" | — | 1,5 min |
| 4 | **As sete perguntas** da entrevista | o roteiro | 3 min |
| 5 | **A notação** — 4 formas + 3 regras | a notação | 2,5 min |
| 6 | **Da fala ao desenho** — 5 frases viram um fluxograma | o desenho | 2,5 min |
| 7 | IA como **ferramenta** vs. IA como **solução** | a distinção | 2 min |
| 8 | **Em qual caixa cabe o quê** — Python / IA / humano | a regra de decisão | 3 min |
| 9 | **O mesmo fluxo, pintado** + o placar | a arquitetura | 2,5 min |
| 10 | **Quando a IA não tem certeza, ela passa pra uma pessoa** — o código + o teste de rubber stamping | o schema + limiar | 3 min |
| 11 | Panorama de ferramentas — 7 camadas | o mapa | 1,5 min |
| 12 | **Como eu monto um projeto desses, na ordem** — o método em 4 fases | o método | 4 min |
| 13 | **O kit** — a skill `mapear-processo` | a skill | 1 min |
| 14 | Fecho: três frases + desafio de uma hora | — | 1,5 min |

Total ≈ 25 min com o caso preenchido. Se precisar cortar, na ordem: slide 11 (panorama)
funciona como material de consulta, e o slide 5 pode ser encurtado lendo só as três regras.

O arco central é **4 → 5 → 6 → 8 → 9**: as perguntas produzem falas, as falas viram
desenho, o desenho é classificado, e o fluxo pintado *é* a arquitetura. Ao fim do 9 a
plateia viu um processo inteiro ser decidido sem ninguém escrever documento — é o ponto
alto e o que amarra o resto.

## O que ainda falta

Os pontos abertos estão marcados em rosa tracejado no deck e nas notas do apresentador.

**Slide 13 — o link do kit.** A skill está pronta em `kit/`. Falta publicar e apontar o
QR: escreva a URL em `assets/kit-link.txt`, rode `python3 qa/make_qr.py`, e depois os dois
builds. Sem o arquivo, o slide mostra um espaço tracejado e o build avisa.

**A foto do slide 2.** Salve em `assets/bruno.jpg` e rode `python3 build.py` e
`node make_pptx.js`. Os dois formatos recortam em quadrado sozinhos; enquanto o arquivo
não existir, aparece um espaço tracejado com a instrução e o build avisa no terminal.
Detalhes em `assets/README.md`.

**Slide 13 — o kit.** Os sete arquivos estão listados, mas falta publicar e trocar a
caixa tracejada por link + QR. Falta decidir também se vai junto uma versão instalável
como skills (mais impressionante ao vivo, exclui quem não usa a ferramenta) ou só os
arquivos em Markdown (funcionam com qualquer coisa). Dá pra fazer os dois: Markdown como
base, skills como camada.

## Exemplo usado no deck

O processo de exemplo é **triagem de chamado de suporte** — genérico o bastante para
qualquer plateia e plausível num bureau de crédito, sem afirmar nada sobre processos
internos reais da Serasa. Aparece nos slides 6, 9 e 10, sempre o mesmo, para a plateia
acompanhar um caso só do começo ao fim.

O slide 3 é deliberadamente **descritivo, não corretivo**: não diz que a plateia pergunta
errado, e sim que a primeira pergunta é sobre o futuro que a pessoa imagina e a segunda é
sobre o presente que ela executa — e o presente é observável, então sai mais fiel. A ferramenta de desenho
recomendada é o **Miro**, uma só, e é a mesma que aparece no kit.

O **slide 12 não é um case**, e isso é deliberado: em vez de inventar um projeto ou
descrever um processo interno real, ele mostra o **método de trabalho do apresentador** —
entender, montar, dividir o trabalho, fechar o ciclo. Funciona melhor que um case
fabricado porque é verificável (é como ele trabalha de fato) e porque a fase 3 é a tese da
palestra aplicada com as mãos no teclado: o determinístico antes da IA.

O deck **não cita volume em número** — fala em "alto volume" e "baixo volume". A escolha
é proposital: número inventado num exemplo convida a plateia a discutir o número em vez
do método. A única quantidade que aparece é a regra do losango (`desconto > 10%`), que é
o conteúdo da decisão, não uma medição.

## Identidade visual

Baseada no site e no manual de marca da Experian.

| Token | Hex | Uso |
|---|---|---|
| Navy profundo | `#16224E` | Títulos e texto principal |
| Azul corporativo | `#1D4F91` | Faixa superior, &ldquo;Python&rdquo; nos fluxos |
| Magenta | `#E80070` | Acento único: eyebrow, badge, palavra destacada, &ldquo;IA&rdquo; nos fluxos |
| Roxo | `#6D2077` | Metadados e decoração — **não** classifica mais nada |
| Âmbar | `#B4620A` | &ldquo;Humano&rdquo; nos fluxos e no slide 8 |
| Roxo escuro | `#77127B` / `#4E0E62` | Fundo dos slides de pontuação (capa, hook, fecho) |
| Lavanda | `#F4F0F9` | Painéis de conclusão e tinta de fundo |

Tipografia: **Roboto** (marca) e **Roboto Mono** para rótulos técnicos e código.
Elemento gráfico recorrente: **squircle** — cartão de cantos muito arredondados e badge
circular magenta, como no site.

### Espaçamento — a grade de 8px

Nenhuma distância no deck é chutada: todas saem de sete tokens no `:root`, sobre uma
grade de 8px num palco de 1280px (`1cqw = 12,8px`).

| Token | Valor | Para que serve |
|---|---|---|
| `--s0` | 4px | dentro de um par (rótulo ↔ valor) |
| `--s1` | 8px | rótulo ↔ conteúdo |
| `--s1h` | 12px | item ↔ item dentro de um bloco |
| `--s2` | 16px | respiro interno de card |
| `--s3` | 24px | bloco ↔ bloco (é o vão padrão entre título, conteúdo e callout) |
| `--s4` | 32px | grupo ↔ grupo |
| `--s5` | 48px | coluna ↔ coluna |
| `--s6` | 64px | margem inferior do slide |

A escala serve à **proximidade como sinal de agrupamento**: o que pertence junto fica a
`--s1`, o que é irmão fica a `--s1h`, o que é outro assunto fica a `--s3`. Em todo slide
de conteúdo o vão entre blocos é `--s3` — `qa/measure_rhythm.mjs` confere isso.

### Tracking e entrelinha

Um único `letter-spacing` está errado em algum tamanho: texto grande lê espaçado demais,
texto pequeno lê apertado demais. O deck usa uma escada de tracking por faixa de tamanho
(`--tr-display` a `--tr-micro`, de `-0.03em` a `+0.1em`), e a entrelinha anda ao contrário
do tamanho — apertada nos títulos (`1.0`–`1.06`), folgada no corpo (`1.5`), levemente
mais fechada no texto pequeno e denso de card (`1.45`–`1.48`).

O `.pptx` segue a mesma escada: `charSpacing` em pontos (`tamanho × em`) e `lineSpacing`
derivado do tamanho pela mesma tabela de razões.

Dispositivos de marca reproduzidos do site: eyebrow rosa em caixa alta acima do título,
título em navy com **uma palavra em magenta**, cartões brancos com badge circular,
painéis de tinta lavanda.

### Classificação: cor não é o único sinal

O apresentador é daltônico, e o esquema antigo (azul / rosa / **roxo**) era ilegível
para ele: sob protanopia, azul e roxo ficam a **ΔE 11,7** — praticamente a mesma cor.
Pior, o problema real estava nos **preenchimentos**, não nas bordas: as tintas claras
originais ficavam a ΔE 3,1.

O esquema atual foi escolhido por medição, não por gosto:

| Classe | Borda | Preenchimento | Sinal redundante |
|---|---|---|---|
| Automação tradicional | `#1D4F91` | `#9CC0EA` | — |
| IA | `#E80070` | `#FDEDF6` | **hachura diagonal** |
| Humano | `#B4620A` | `#EFCB8F` | — |

Pior par sob protanopia e deuteranopia: **ΔE 26,7**. A hachura existe porque tinta clara
não separa três categorias por cor sozinha — quem não distingue vermelho lê o padrão.
Pelo mesmo motivo, **nenhum texto do deck descreve conteúdo por cor**: em vez de "as duas
rosas", o slide 9 diz "as duas caixas de IA".

`qa/simulate_cvd.py` gera as versões simuladas de qualquer print para conferir.

O `.pptx` não tem preenchimento hachurado, então lá a separação é só por luminosidade —
por isso os tons são mais fortes que o instinto pediria. Os fluxogramas dos slides 6, 9 e
12 seguem o mesmo código; início e fim continuam em roxo claro, que não é classificação.

O `.pptx` usa **Arial** em vez de Roboto — Roboto não está garantida em máquina de
terceiros e o PowerPoint substituiria por algo imprevisível. Arial é o grotesco seguro
mais próximo. Se a máquina da apresentação tiver Roboto instalada, troque a constante
`FONT` no topo de `make_pptx.js` e regenere.

### Como os fluxogramas ficam idênticos nos dois decks

Os SVG do HTML têm viewBox próprio (`570x600` no slide 6, `690x570` no slide 9). No
`.pptx`, a função `frame(vbW, vbH, x, y, w, h)` mapeia esse mesmo viewBox para uma região
do slide, mantendo proporção e centralizando — exatamente o que
`preserveAspectRatio="xMidYMid meet"` faz no HTML. **As mesmas coordenadas servem nos
dois arquivos**: se você mover um nó, mova pelo mesmo número nos dois.

## QA

O deck HTML é verificado slide por slide no Chromium: 14 telas renderizadas em
`qa/shots/`, fontes confirmadas carregadas, e checagem automática de overflow,
sangramento, invasão da faixa do rodapé e texto recortado por ancestral com
`overflow:hidden` — o recorte é
calculado contra o retângulo de clip real, então decoração que sangra de propósito
dentro de um painel recortado não gera falso positivo.

O `.pptx` passa por uma checagem geométrica com métricas de fonte reais (Liberation Sans,
metricamente idêntica à Arial): estouro de texto, sobreposição de caixas e margens,
ignorando losangos e elipses (cuja bounding box não corresponde à forma visível).

**Não houve QA visual rasterizado do `.pptx`** — o LibreOffice Impress não está instalado
neste ambiente, então não foi possível convertê-lo em imagem. Vale abrir no PowerPoint
uma vez antes de apresentar.
