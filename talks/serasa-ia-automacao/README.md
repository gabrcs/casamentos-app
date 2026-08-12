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
| `qa/check_html.mjs` | Renderiza os 14 slides no Chromium e checa overflow, sangramento e texto recortado. |
| `qa/check_pptx.py` | Checagem geométrica do `.pptx` com métricas de fonte reais. |

```bash
python3 build.py            # reconstrói deck.html
node make_pptx.js           # reconstrói deck.pptx
node qa/check_html.mjs      # QA do HTML (gera qa/shots/*.png)
python3 qa/check_pptx.py deck.pptx
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
| 2 | **Bio** — Bruno Prata, e a tese em uma frase | — | 1 min |
| 3 | A pergunta que estraga tudo (&ldquo;o que vocês querem automatizar?&rdquo;) | — | 1,5 min |
| 4 | **As sete perguntas** da entrevista | o roteiro | 3 min |
| 5 | **A notação** — 4 formas + 3 regras | a notação | 2,5 min |
| 6 | **Da fala ao desenho** — 5 frases viram um fluxograma | o desenho | 2,5 min |
| 7 | IA como **ferramenta** vs. IA como **solução** | a distinção | 2 min |
| 8 | **Em qual caixa cabe o quê** — Python / IA / humano | a regra de decisão | 3 min |
| 9 | **O mesmo fluxo, pintado** + o placar | a arquitetura | 2,5 min |
| 10 | **Humano na alça** — o código, 12 linhas + o teste de rubber stamping | o schema + limiar | 3 min |
| 11 | Panorama de ferramentas — 7 camadas | o mapa | 1,5 min |
| 12 | **O caso** — *a preencher* | — | 4 min |
| 13 | **O kit** — os arquivos pra baixar | o kit | 1 min |
| 14 | Fecho: três frases + desafio de uma hora | — | 1,5 min |

Total ≈ 25 min com o caso preenchido. Se precisar cortar, na ordem: slide 11 (panorama)
funciona como material de consulta, e o slide 5 pode ser encurtado lendo só as três regras.

O arco central é **4 → 5 → 6 → 8 → 9**: as perguntas produzem falas, as falas viram
desenho, o desenho é classificado, e o fluxo pintado *é* a arquitetura. Ao fim do 9 a
plateia viu um processo inteiro ser decidido sem ninguém escrever documento — é o ponto
alto e o que amarra o resto.

## O que ainda falta

Dois pontos estão marcados em rosa tracejado no deck e nas notas do apresentador.

**Slide 12 — o caso.** É o único slide sem conteúdo real. Vira **dois ou três** slides
quando estiver definido:

1. *O processo e a conversa* — qual era, quem executava, quantas vezes por mês, e uma
   frase literal de quem executava (de preferência a que virou losango). É o que amarra
   o caso ao slide 6.
2. *O fluxo pintado + o placar* — o mesmo desenho do slide 9 com as caixas reais, e o
   placar: &ldquo;N caixas → X Python · Y IA · Z humano&rdquo;. Se a maioria virou Python, diga
   isso em voz alta — é o ponto da palestra.
3. *O resultado e o que quebrou* — um número de antes → depois que você defenda no Q&A,
   e a falha: de preferência uma em que o modelo errou com confiança e você só descobriu
   depois. É o bloco que a plateia lembra; plateia técnica confia em quem mostra a cicatriz.

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
| Roxo | `#6D2077` | Metadados, &ldquo;humano&rdquo; nos fluxos |
| Roxo escuro | `#77127B` / `#4E0E62` | Fundo dos slides de pontuação (capa, hook, fecho) |
| Lavanda | `#F4F0F9` | Painéis de conclusão e tinta de fundo |

Tipografia: **Roboto** (marca) e **Roboto Mono** para rótulos técnicos e código.
Grid de 8px. Elemento gráfico recorrente: **squircle** — cartão de cantos muito
arredondados e badge circular magenta, como no site.

Dispositivos de marca reproduzidos do site: eyebrow rosa em caixa alta acima do título,
título em navy com **uma palavra em magenta**, cartões brancos com badge circular,
painéis de tinta lavanda.

**Código de cor dos fluxogramas** (consistente nos slides 6, 9 e 12):
azul = Python/automação tradicional · rosa = IA · lavanda = humano · roxo claro = início/fim.

O `.pptx` usa **Arial** em vez de Roboto — Roboto não está garantida em máquina de
terceiros e o PowerPoint substituiria por algo imprevisível. Arial é o grotesco seguro
mais próximo. Se a máquina da apresentação tiver Roboto instalada, troque a constante
`FONT` no topo de `make_pptx.js` e regenere.

### Como os fluxogramas ficam idênticos nos dois decks

Os SVG do HTML têm viewBox próprio (`650x600` no slide 6, `650x570` no slide 9). No
`.pptx`, a função `frame(vbW, vbH, x, y, w, h)` mapeia esse mesmo viewBox para uma região
do slide, mantendo proporção e centralizando — exatamente o que
`preserveAspectRatio="xMidYMid meet"` faz no HTML. **As mesmas coordenadas servem nos
dois arquivos**: se você mover um nó, mova pelo mesmo número nos dois.

## QA

O deck HTML é verificado slide por slide no Chromium: 14 telas renderizadas em
`qa/shots/`, fontes confirmadas carregadas, e checagem automática de overflow,
sangramento e de texto recortado por ancestral com `overflow:hidden` — o recorte é
calculado contra o retângulo de clip real, então decoração que sangra de propósito
dentro de um painel recortado não gera falso positivo.

O `.pptx` passa por uma checagem geométrica com métricas de fonte reais (Liberation Sans,
metricamente idêntica à Arial): estouro de texto, sobreposição de caixas e margens,
ignorando losangos e elipses (cuja bounding box não corresponde à forma visível).

**Não houve QA visual rasterizado do `.pptx`** — o LibreOffice Impress não está instalado
neste ambiente, então não foi possível convertê-lo em imagem. Vale abrir no PowerPoint
uma vez antes de apresentar.
