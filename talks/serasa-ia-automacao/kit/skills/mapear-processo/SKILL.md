---
name: mapear-processo
description: 'Transforma a descrição de um processo em linguagem natural num fluxograma HTML interativo, classificando cada etapa como automação tradicional, IA ou humano — com a justificativa de cada classificação e o placar do processo. Use sempre que alguém descrever como um trabalho é feito hoje e quiser saber o que dá para automatizar, mesmo que não peça um fluxograma — "esse processo dá pra automatizar?", "onde a IA ajudaria aqui?", "queria mapear esse fluxo", "o time faz assim, o que dá pra tirar da mão?" — ou quando colar a transcrição de uma conversa com quem executa o processo. Também serve para revisar um fluxo já desenhado e dizer onde a IA está sobrando ou faltando.'
---

# Mapear processo e classificar cada etapa

Alguém te descreve como um trabalho é feito. Você devolve o desenho desse trabalho com
cada etapa classificada: **automação tradicional**, **IA** ou **humano** — e o motivo de
cada uma.

A ordem importa e é o coração da skill: **IA é a terceira pergunta, nunca a primeira.**
A maior parte do que parece precisar de IA é digitação, e digitação se resolve com um
`if` que você testa uma vez e confia para sempre.

## O que você entrega

Três coisas, sempre as três:

1. **`<processo>.html`** — o fluxograma interativo. Auto-contido, tema escuro, abre em
   qualquer navegador sem internet. Clicar numa caixa mostra por que ela foi classificada
   assim e o que ela precisa para sair do papel.
2. **`<processo>.json`** — os mesmos dados em `{processo, resumo, nodes, edges, flows,
   placar, perguntas_abertas}`, para outro agente consumir.
3. **Um resumo curto na conversa** — o placar em uma linha, as duas ou três etapas mais
   promissoras, e as perguntas que ficaram sem resposta.

Não gere o HTML do zero: use `assets/template.html`, que já tem o layout, o painel de
detalhe, o realce de caminhos e a legenda. Substitua `/*DATA*/` pelo JSON e `__TITULO__`
pelo nome do processo. É o mesmo arquivo toda vez, então o resultado sai consistente e
você gasta o esforço no conteúdo, que é onde ele vale.

## Como classificar

Rode esta cascata **uma vez por caixa**, na ordem. A ordem existe porque cada pergunta
elimina uma opção mais cara que a anterior.

**1. Dá para fazer com um `if`?**
A regra é fixa, a entrada é estruturada e a saída é sempre a mesma → `automacao`.
Copiar campo de um sistema para outro, aplicar tabela de preço, validar formato de CPF,
disparar e-mail quando um status muda. É mais barato, é determinístico, dá para testar,
e não alucina.

**2. O erro é caro *e* irreversível?**
Dinheiro que não volta, crédito negado, contrato assinado, dado apagado → `humano`.
A IA pode propor, mas o clique é de uma pessoa. Costuma ser pouco volume, então manter
gente ali é barato — e é justamente o que te deixa automatizar o resto sem medo.

**3. Sobrou?**
Entrada em linguagem, regra ambígua, e verificar a resposta custa menos que produzi-la
→ `ia`. Classificar texto livre, extrair campo de documento que varia, redigir a primeira
versão de uma resposta.

**A exceção que atravessa tudo: se não existe como detectar que deu errado**, a etapa é
`ainda_nao`, independente do resto. Automatizar algo cuja falha ninguém percebe não
economiza trabalho, cria um passivo silencioso. A recomendação é tornar verificável
primeiro.

Detalhes, casos difíceis e exemplos de cada classe estão em
`references/classificacao.md`. Leia quando uma etapa não se encaixar de primeira, ou
quando a pessoa discordar de uma classificação.

## Não invente o que não te contaram

Esta é a diferença entre um mapa útil e um desenho bonito. A cascata precisa de duas
informações que raramente aparecem numa descrição espontânea: **quanto custa errar** e
**como a falha é detectada**.

Quando faltarem, você tem duas saídas legítimas:

- **Pergunte**, se forem poucas perguntas e a conversa estiver aberta. Uma ou duas
  perguntas objetivas melhoram o mapa inteiro.
- **Classifique como `indefinido`** e escreva em `pergunta` exatamente o que falta. A
  caixa aparece cinza no fluxograma e a dúvida sobe para `perguntas_abertas`.

O que não vale é chutar `ia` porque a etapa parece sofisticada. Uma caixa cinza com a
pergunta certa é mais útil que uma caixa rosa com um palpite — quem for automatizar vai
descobrir o palpite errado depois, quando já tiver custado.

Pelo mesmo motivo: **todo losango tem a regra escrita embaixo**. Se a pessoa disse "aí
depende do valor", o losango existe mas a regra é uma pergunta aberta — "a partir de
qual valor?". Losango sem regra é decisão que ninguém revisou, e é onde a automação
quebra três meses depois.

## Dois casos que a descrição sozinha não resolve

**Nenhum losango apareceu.** Se você desenhou o processo inteiro e não achou nenhuma
decisão, desconfie antes de entregar. Processo sem decisão existe, mas é raro — o mais
comum é que a pessoa contou a versão feliz e não mencionou o caso chato. Pergunte
diretamente: "tem alguma vez em que você para e faz diferente?". Se ela disser que não,
registre isso em `perguntas_abertas` para quem for automatizar saber que a pergunta foi
feita, e não apenas esquecida.

**Metade ou mais do mapa ficou `indefinido`.** Aconteceu porque a descrição era curta
demais — normal, é o que as pessoas escrevem quando pedem ajuda pela primeira vez. Nesse
caso o entregável muda de natureza: o valor não está no desenho, está nas perguntas.
Diga isso no resumo, com essas palavras: **"isso ainda não é um mapa, é uma lista de
perguntas"**, e coloque as perguntas antes do link do arquivo. Entregar um diagrama
bonito e quase vazio como se fosse um resultado é pior que dizer o que falta.

## Como ler a descrição

Duas armadilhas comuns:

**Uma caixa por ação.** Se o nome tem "e", são duas caixas. "Registrar e classificar o
chamado" esconde exatamente a etapa que você ia automatizar — registrar é `automacao`,
classificar provavelmente é `ia`, e juntas viram uma caixa impossível de classificar.

**Decisão escondida dentro de ação.** Frases como "aí eu vejo se...", "quando é caso de...",
"se for acima de..." são losangos, mesmo quando a pessoa contou como se fosse um passo
único. Na dúvida entre ação e decisão, é decisão.

Se a descrição vier de uma transcrição de conversa, aproveite as frases literais: elas
costumam trazer a regra do losango de graça ("se for desconto acima de 10%, eu paro e
mando pro meu gestor" é o losango e a regra na mesma frase).

## O formato do JSON

```json
{
  "processo": "Triagem de chamado de suporte",
  "resumo": "Uma frase sobre o que o processo faz e para quem.",
  "nodes": [
    { "id": "n1", "tipo": "inicio", "label": "Chamado chega" },
    { "id": "n2", "tipo": "acao", "label": "Registrar chamado",
      "classe": "automacao",
      "porque": "Copia nome, CPF e texto de um formulário para o sistema de tickets. Entrada estruturada, saída sempre igual.",
      "precisa": "Acesso à API do sistema de tickets",
      "frequencia": "todo chamado",
      "custo_erro": "baixo — dá para corrigir depois" },
    { "id": "n5", "tipo": "decisao", "label": "Desconto acima de 10%?",
      "regra": "desconto > 0.10 ou exceção contratual",
      "classe": "automacao",
      "porque": "Comparação numérica contra um limite fixo." },
    { "id": "n9", "tipo": "fim", "label": "Fim" }
  ],
  "edges": [
    { "from": "n1", "to": "n2" },
    { "from": "n5", "to": "n6", "label": "sim" },
    { "from": "n5", "to": "n7", "label": "não" }
  ],
  "flows": [
    { "nome": "Caminho comum", "steps": ["n1","n2","n3","n5","n7","n9"] },
    { "nome": "Com aprovação", "steps": ["n1","n2","n3","n5","n6","n7","n9"] }
  ],
  "placar": { "automacao": 3, "ia": 2, "humano": 1, "ainda_nao": 0, "indefinido": 0 },
  "perguntas_abertas": [
    "A partir de qual valor a aprovação do gestor é obrigatória?"
  ]
}
```

Campos: `tipo` é `inicio` | `acao` | `decisao` | `fim`. `classe` é `automacao` | `ia` |
`humano` | `ainda_nao` | `indefinido`, e só existe em `acao` e `decisao`. `regra` é
obrigatória em `decisao` — se não souber, deixe a pergunta em `pergunta` e mande a dúvida
para `perguntas_abertas`. `flows` são os caminhos que a pessoa mencionou; se ela só
descreveu um, entregue um só.

Cada `steps` precisa listar os nós **em sequência**, porque o realce de caminho no HTML
só acende uma aresta quando os dois nós são vizinhos na lista.

## Como montar o arquivo

```bash
python3 - <<'PY'
import json, pathlib
tpl = pathlib.Path("assets/template.html").read_text()
dados = json.loads(pathlib.Path("processo.json").read_text())
html = tpl.replace("/*DATA*/", json.dumps(dados, ensure_ascii=False))
html = html.replace("__TITULO__", dados["processo"])
pathlib.Path("processo.html").write_text(html)
PY
```

Escreva o JSON primeiro, num arquivo, e depois injete. Assim o JSON que você entrega e o
que está dentro do HTML são o mesmo, e um erro de sintaxe aparece no `json.loads` em vez
de virar uma página em branco.

## O resumo na conversa

Curto. Três coisas, nesta ordem:

1. **O placar** numa linha: "7 etapas → 4 automação · 2 IA · 1 humano".
2. **Por onde começar**: a etapa `automacao` de maior frequência. É o ganho mais barato e
   o que constrói confiança para o resto.
3. **O que trava**: as perguntas abertas, se houver.

Se o placar veio com muito mais `automacao` que `ia`, diga isso em voz alta em vez de
esconder. É o resultado mais comum e o mais útil — significa que boa parte do trabalho
sai sem modelo nenhum, com um script que não custa por execução e não precisa de eval.
