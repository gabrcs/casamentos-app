# O kit — Automação de processos com IA

O que a plateia leva embora. Duas camadas: **arquivos** que funcionam com qualquer
ferramenta, e **uma skill instalável** para quem usa Claude Code.

## A skill

**`mapear-processo`** — você descreve como um trabalho é feito hoje, em português
corrido, e ela devolve o fluxograma daquele trabalho com cada etapa classificada como
**automação tradicional**, **IA** ou **humano**, junto com o motivo de cada classificação.

Entrega três coisas:

- um HTML interativo, auto-contido, que abre em qualquer navegador sem internet;
- um JSON `{nodes, edges, flows, placar}` para outro agente consumir;
- o placar do processo em uma linha, no chat.

O que a diferencia de um gerador de diagrama qualquer é a **cascata de classificação**:
dá para fazer com um `if`? o erro é caro e irreversível? só depois disso IA. E quando a
descrição não diz quanto custa errar ou como a falha é percebida, a skill marca a etapa
como indefinida e devolve a pergunta — em vez de chutar.

### Instalar

```bash
# a partir do .skill empacotado
# (ou copie a pasta para ~/.claude/skills/)
cp -r skills/mapear-processo ~/.claude/skills/
```

Depois é só descrever um processo. Não precisa invocar pelo nome.

### Ver funcionando antes de instalar

`skills/mapear-processo/exemplo/` tem um caso completo: a descrição original em
`descricao-original.txt`, o resultado em `conciliacao.html` (abra no navegador) e os
dados em `conciliacao.json`.

O exemplo é uma conciliação mensal de parceiros — 14 etapas, das quais 7 saem com
script, 2 com IA, 1 fica humana, 1 não deve ser automatizada ainda e 2 ficaram sem
informação suficiente. É um resultado típico, e o ponto da palestra: **a maior parte do
que parece precisar de IA é digitação**.

## Os arquivos

| Arquivo | O que é |
|---|---|
| `7-perguntas.md` | O roteiro de entrevista, com o que anotar em cada resposta. |
| `quadro-notacao` | O quadro de notação no Miro — duplique e troque os nomes das caixas. |
| `canvas.md` | Uma linha por caixa: entrada, saída, dono, frequência, exceções, custo do erro. |
| `classificar.md` | A cascata do slide 8 em forma de checklist — rode uma vez por caixa. |
| `prompt.template.md` | As sete seções de um prompt de produção. |
| `evals/exemplo.yaml` | Vinte casos, cinco de borda, mais o comando de CI. |
| `checklist-producao.md` | Doze itens antes de ligar o fluxo. |

> Os arquivos ainda estão por escrever — a skill foi a primeira peça do kit a ficar pronta.
