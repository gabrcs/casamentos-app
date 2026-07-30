# Automatização de processos com IA — Serasa Experian / Tecnologia

Palestra técnica de 20-25 minutos. 16 slides.

**Princípio do deck:** cada seção entrega um **artefato** que a plateia copia — um
fluxograma, uma árvore de decisão, um trecho de código, um arquivo de eval, um checklist.
Teoria só onde não tem como ensinar na prática.

## Arquivos

| Arquivo | O que é |
|---|---|
| `deck.html` | Deck para apresentar. Auto-contido (fonte embutida), abre em qualquer navegador. **Gerado — não edite.** |
| `deck.src.html` | Fonte do deck HTML. É aqui que você edita. |
| `build.py` | Injeta as fontes em `deck.src.html` → `deck.html`. Rode após cada edição. |
| `deck.pptx` | Versão PowerPoint editável, com notas do apresentador em todos os slides. |
| `make_pptx.js` | Gerador do `.pptx`. |
| `fonts/` | Roboto e Roboto Mono (subsets latin/latin-ext) para embutir no HTML. |

```bash
python3 build.py     # reconstrói deck.html
node make_pptx.js    # reconstrói deck.pptx
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
| 2 | Hook: a pergunta errada vs. a certa (traz o roteiro numa linha) | — | 1,5 min |
| 3 | **O método**: 4 passos + a notação inteira (4 formas) | a notação | 2,5 min |
| 4 | **Fluxograma "como acontece hoje"** — triagem de suporte | o desenho | 2 min |
| 5 | **O canvas** — uma linha por caixa do fluxo | a tabela | 3 min |
| 6 | **O mesmo fluxo pintado** — código / IA / humano | a arquitetura | 2 min |
| 7 | **Árvore de decisão** — 4 perguntas, a etapa se classifica | a árvore | 3 min |
| 8 | **Escalonamento por confiança** — o código, 12 linhas | o schema + limiar | 3 min |
| 9 | Rubber stamping + LGPD art. 20 | as 3 perguntas | 2,5 min |
| 10 | A stack por camada | o mapa | 1,5 min |
| 11 | **O eval set** — o arquivo YAML + o comando de CI | o eval | 2,5 min |
| 12 | **Anatomia do prompt** (7 seções) + **registro de decisão** | os dois arquivos | 2,5 min |
| 13 | Checklist de produção — 12 itens | o portão | 1,5 min |
| 14 | **Caso: o fluxo** — a preencher | — | 2 min |
| 15 | **Caso: resultado e cicatrizes** — a preencher | — | 2,5 min |
| 16 | Fecho: três frases + desafio de uma semana | — | 1,5 min |

Total ≈ 25 min sem Q&A. Se precisar cortar, na ordem: slide 10 (stack) e slide 13
(checklist) são os dois que funcionam como material de consulta em vez de fala.

O arco central é 3 → 4 → 5 → 6: ensina a notação, desenha o processo, tabela, e pinta.
Ao fim do 6 a arquitetura apareceu sem ninguém escrever documento — é o ponto alto da
primeira metade e o que amarra o resto.

## Slides 14 e 15 precisam do seu caso

São os dois únicos slides com placeholder, marcados em rosa tracejado.

**Slide 14 — o fluxo.** Já vem um esqueleto na **mesma notação do slide 3**. Troque as
quatro caixas pelo fluxo real e pinte cada uma como no slide 6: azul = código,
rosa = IA, lavanda = humano. Se o seu fluxo tem decisão, use losango e escreva a regra
embaixo. Usar a notação que você acabou de ensinar é o que fecha o arco da palestra.

**Slide 15 — resultado.** Três blocos:
1. *Antes → depois*: um número que você consiga defender vale mais que três estimados.
2. *O que quebrou*: de preferência uma falha em que o modelo errou com confiança e você só
   descobriu depois. É o bloco que a plateia lembra — plateia técnica confia em quem mostra a falha.
3. *O que eu faria diferente*: uma coisa concreta.

Feche amarrando à árvore do slide 7: qual folha classificou cada etapa do seu caso.

## Exemplo usado no deck

O processo de exemplo é **triagem de solicitação de suporte** — genérico o bastante para
qualquer plateia e plausível num bureau de crédito, sem afirmar nada sobre processos
internos reais da Serasa. Aparece nos slides 4, 5, 6, 8, 11 e 12, sempre o mesmo, para a
plateia acompanhar um caso só do começo ao fim.

Os números (12.000 classificações/mês, 300 aprovações de gestor, limiar 0.85) são do
exemplo, não medições reais — se alguém perguntar, diga que é ilustrativo.

## Identidade visual

Baseada no site e no manual de marca da Experian.

| Token | Hex | Uso |
|---|---|---|
| Navy profundo | `#16224E` | Títulos e texto principal |
| Azul corporativo | `#1D4F91` | Faixa superior, cabeçalho de tabela, "código" nos fluxos |
| Magenta | `#E80070` | Acento único: eyebrow, badge, palavra destacada, "IA" nos fluxos |
| Roxo | `#6D2077` | Metadados, "humano" nos fluxos |
| Roxo escuro | `#77127B` / `#4E0E62` | Fundo dos slides de pontuação (capa, hook, fecho) |
| Lavanda | `#F4F0F9` | Painéis de conclusão e tinta de fundo |

Tipografia: **Roboto** (marca) e **Roboto Mono** para rótulos técnicos e código.
Grid de 8px. Elemento gráfico recorrente: **squircle** — cartão de cantos muito
arredondados e badge circular magenta, como no site.

Dispositivos de marca reproduzidos do site: eyebrow rosa em caixa alta acima do título,
título em navy com **uma palavra em magenta**, cartões brancos com badge circular,
painéis de tinta lavanda.

**Código de cor dos fluxogramas** (consistente nos slides 4, 6, 7 e 14):
azul = código · rosa = IA · lavanda = humano · roxo claro = início/fim.

O `.pptx` usa **Arial** em vez de Roboto — Roboto não está garantida em máquina de
terceiros e o PowerPoint substituiria por algo imprevisível. Arial é o grotesco seguro
mais próximo. Se a máquina da apresentação tiver Roboto instalada, troque a constante
`FONT` no topo de `make_pptx.js` e regenere.

### Como os fluxogramas ficam idênticos nos dois decks

Os SVG do HTML usam `viewBox="0 0 1280 720"`, que é o slide inteiro. O `.pptx` tem
13.333 × 7.5 polegadas — ou seja, exatamente 96 px por polegada. A função `px()` em
`make_pptx.js` faz `valor / 96`, então **as mesmas coordenadas servem para os dois**.
Se você mover um nó, mova nos dois arquivos usando o mesmo número.

## QA

O deck HTML foi verificado slide por slide no Chromium: 20 telas renderizadas, fontes
confirmadas carregadas, e checagem automática de overflow, sangramento e de conteúdo
recortado dentro de containers com `overflow:hidden`.

O `.pptx` passou pelo validador de esquema OOXML e por uma checagem geométrica com
métricas de fonte reais (Liberation Sans, metricamente idêntica à Arial): estouro de
texto, sobreposição de caixas e margens, ignorando losangos e elipses (cuja bounding box
não corresponde à forma visível).

**Não houve QA visual rasterizado do `.pptx`** — o LibreOffice Impress não está instalado
neste ambiente, então não foi possível convertê-lo em imagem. Vale abrir no PowerPoint
uma vez antes de apresentar.
