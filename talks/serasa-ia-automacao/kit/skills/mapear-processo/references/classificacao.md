# Classificação de etapas — casos difíceis

Leia quando uma etapa não se encaixar de primeira na cascata do `SKILL.md`, ou quando
alguém discordar de uma classificação e você precisar defender ou rever.

## Índice

- [Automação tradicional](#automacao-tradicional)
- [IA](#ia)
- [Humano](#humano)
- [Ainda não automatize](#ainda-nao-automatize)
- [Indefinido](#indefinido)
- [As confusões mais frequentes](#as-confusoes-mais-frequentes)

---

## Automação tradicional

**A regra é fixa, a entrada é estruturada, a saída é sempre a mesma.**

Ferramentas: Python, SQL, chamada de API, regex, cron, planilha com fórmula.

Como aparece na descrição de quem executa:

- "eu copio daqui pra lá"
- "rodo esse relatório toda segunda"
- "se o valor for maior que X, marco como Y"
- "junto essas duas planilhas pelo CPF"
- "quando muda de status, aviso o time"

Por que preferir isso sempre que couber: um `if` você testa uma vez e confia para
sempre. Não custa por execução, não varia, não precisa de eval, não precisa de limiar de
confiança, e quando quebra, quebra alto — o que é bom, porque você fica sabendo.

**Um sinal forte:** se a pessoa consegue explicar a regra completa em uma frase sem usar
"depende", é automação tradicional.

---

## IA

**A entrada é linguagem, a regra é ambígua, e verificar custa menos que fazer.**

Como aparece na descrição:

- "depende do que tá escrito"
- "eu leio e decido na hora"
- "cada cliente escreve de um jeito"
- "tem que entender o contexto"
- "escrevo a resposta, geralmente parecida com outras"

As três condições valem juntas, e a terceira é a que mais se esquece. **Verificar precisa
custar menos que fazer.** Se conferir a saída da IA dá o mesmo trabalho que produzir a
saída na mão, você não automatizou nada — trocou uma tarefa por outra igual, e ainda
adicionou risco.

O preço que vem junto, e que a classificação assume: casos de teste versionados, um
limiar de confiança abaixo do qual a decisão vai para uma pessoa, e um caminho explícito
de "não sei". Se a etapa é `ia`, escreva isso em `precisa`.

---

## Humano

**O erro é caro e irreversível, ou a regra ainda não existe.**

Como aparece:

- "isso aí eu levo pro meu gestor"
- "cada caso é um caso"
- "aqui a gente conversa com o cliente antes"
- "depende de quem é o cliente"

Duas coisas que valem registrar quando classificar assim:

**Costuma ser pouco volume.** Julgamento irreversível quase nunca é a etapa que a pessoa
faz cem vezes por dia. Manter gente ali é barato, e é o que permite automatizar o resto
sem medo.

**"IA propõe, humano aprova" ainda é `humano`.** A IA reduz o trabalho da pessoa, mas a
etapa continua dependendo do clique dela. Registre isso em `precisa`: "a IA pode preparar
a proposta; a decisão continua sendo humana."

E o alerta que vale escrever em `porque` quando for o caso: se a pessoa aprova centenas
de itens por dia, isso não é supervisão, é carimbo. Três perguntas revelam:

1. O revisor tem tempo e informação para discordar?
2. Existe registro de quando ele discordou? Taxa de rejeição de 0% é alarme, não
   qualidade.
3. Se revisar por amostragem daria o mesmo resultado, revisar item a item é teatro — e
   está custando uma pessoa.

---

## Ainda não automatize

**Não existe como detectar que a etapa deu errado.**

Esta classe atravessa as outras: mesmo que a etapa pareça um `if` perfeito, se ninguém
percebe quando ela falha, automatizar transforma um erro visível em um erro silencioso.

Como aparece:

- "a gente só descobre quando o cliente reclama"
- "sinceramente, não sei se já deu errado"
- "não tem como conferir"

O que escrever em `precisa`: o guarda-corpo que falta. Normalmente é uma das três coisas —
um log do que foi decidido, uma amostragem periódica, ou um alerta quando um número sai
da faixa esperada.

Não é um "não" definitivo. É "torne verificável e volte".

---

## Indefinido

**A descrição não diz o suficiente para classificar.**

Use quando faltar uma das duas informações que a cascata exige:

- quanto custa errar nessa etapa
- como a falha é percebida

Escreva a pergunta exata em `pergunta` — não "falta contexto", e sim "se essa
classificação sair errada, o que acontece com o cliente?". A pergunta específica é o que
transforma o mapa numa próxima conversa em vez de num beco.

---

## As confusões mais frequentes

**Losango não é sinônimo de IA.** Uma decisão pode ser uma comparação numérica. "Desconto
acima de 10%?" parece decisão de IA e é `if desconto > 0.10`. Classifique o losango pela
natureza da regra, não pelo formato.

**Volume alto não implica IA.** Volume alto implica que vale a pena automatizar; *qual*
automação continua sendo a cascata que decide. A etapa mais repetitiva de um processo
costuma ser a mais burra, e é justamente a que sai com script.

**"A IA já faz isso hoje" não é classificação.** Se a pessoa já usa um chat para essa
etapa, isso é IA como *ferramenta* — ela no meio, revisando cada saída. Virar uma caixa
`ia` no fluxo significa rodar sem ninguém olhando, o que exige schema, limiar, log e
dono. Se essas coisas não existem, a etapa hoje é `humano` com apoio de IA, e o mapa
deve dizer isso.

**Etapa rara não paga automação.** Antes de classificar, olhe a frequência. Uma etapa que
acontece duas vezes por ano pode ficar como está, mesmo sendo trivialmente automatizável.
Quando for o caso, classifique normalmente mas registre em `porque` que o retorno é
baixo — a decisão de priorizar é de quem tem o processo, não sua.
