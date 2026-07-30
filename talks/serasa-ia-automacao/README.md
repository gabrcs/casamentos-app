# Automatização de processos com IA — Serasa Experian / Tecnologia

Palestra técnica de 20-25 minutos. 20 slides.

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

| # | Slide | Tempo |
|---|---|---|
| 1 | Capa | 1 min |
| 2 | Hook — a pergunta errada vs. a pergunta certa | 1,5 min |
| 3 | Agenda — cinco paradas | 1 min |
| 4 | Abertura: Mapear | — |
| 5 | O erro nº 1 — automatizar o caos | 2 min |
| 6 | **O canvas de mapeamento** — slide-chave, a plateia fotografa | 3 min |
| 7 | Abertura: Decidir | — |
| 8 | Matriz custo do erro × reversibilidade | 3 min |
| 9 | Onde LLM ganha / onde LLM perde | 2,5 min |
| 10 | Abertura: Humano na alça | — |
| 11 | Os quatro padrões de human in the loop | 3 min |
| 12 | Rubber stamping + LGPD art. 20 | 2,5 min |
| 13 | Abertura: Ferramentas | — |
| 14 | A stack por camada | 2,5 min |
| 15 | Quatro perguntas antes de adotar ferramenta | 2 min |
| 16 | As dez boas práticas | 2 min |
| 17 | Abertura: Caso prático | — |
| 18 | **Caso: o fluxo** — a preencher | 2 min |
| 19 | **Caso: resultado e cicatrizes** — a preencher | 2,5 min |
| 20 | Fecho: três frases + desafio de uma semana | 1,5 min |

Total ≈ 24 min sem Q&A. Se o tempo apertar, acelere o slide 16 (as dez práticas) —
é o único que funciona como material de consulta em vez de fala.

## Slides 18 e 19 precisam do seu caso

São os dois únicos slides com placeholder, marcados em rosa tracejado no deck.

**Slide 18 — o fluxo.** Cinco cartões em sequência. Para cada etapa: nome, entrada → saída,
e o modo de execução. Mantenha o código de cor: **verde = máquina**, **lavanda = você**.
Os modos disponíveis são `automatizado`, `humano aprova`, `humano decide` e `copiloto` —
os mesmos quatro padrões do slide 11, para o caso fechar o arco da palestra.

**Slide 19 — resultado.** Três blocos:
1. *Antes → depois*: um número que você consiga defender vale mais que três estimados.
2. *O que quebrou*: de preferência uma falha em que o modelo errou com confiança e você só
   descobriu depois. É o bloco que a plateia lembra — plateia técnica confia em quem mostra a falha.
3. *O que eu faria diferente*: uma coisa concreta.

## Identidade visual

Baseada no site e no manual de marca da Experian.

| Token | Hex | Uso |
|---|---|---|
| Navy profundo | `#16224E` | Títulos e texto principal |
| Azul corporativo | `#1D4F91` | Faixa superior, cabeçalho de tabela, estrutura |
| Magenta | `#E80070` | Acento único: eyebrow, badge, palavra destacada, progresso |
| Roxo | `#6D2077` | Metadados, elementos secundários |
| Roxo escuro | `#77127B` / `#4E0E62` | Fundo dos slides de pontuação (capa, hook, fecho) |
| Lavanda | `#F4F0F9` | Painéis de conclusão e tinta de fundo |

Tipografia: **Roboto** (marca) e **Roboto Mono** para rótulos técnicos e numeração.
Grid de 8px. Elemento gráfico recorrente: **squircle** — cartão de cantos muito
arredondados e badge circular magenta, como no site.

Dispositivos de marca reproduzidos do site: eyebrow rosa em caixa alta acima do título,
título em navy com **uma palavra em magenta**, cartões brancos com badge circular,
painéis de tinta lavanda, e trilha lateral com o item ativo em magenta.

O `.pptx` usa **Arial** em vez de Roboto — Roboto não está garantida em máquina de
terceiros e o PowerPoint substituiria por algo imprevisível. Arial é o grotesco seguro
mais próximo. Se a máquina da apresentação tiver Roboto instalada, troque a constante
`FONT` no topo de `make_pptx.js` e regenere.

## QA

O deck HTML foi verificado slide por slide no Chromium: as 20 telas renderizadas, fontes
confirmadas carregadas, e checagem automática de overflow e sangramento de elementos.

O `.pptx` passou pelo validador de esquema OOXML e por uma checagem geométrica com
métricas de fonte reais (Liberation Sans, metricamente idêntica à Arial): estouro de
texto, sobreposição de caixas e margens. **Não houve QA visual rasterizado** — o
LibreOffice Impress não está instalado neste ambiente, então não foi possível converter
o `.pptx` em imagem. Vale abrir no PowerPoint uma vez antes de apresentar.
