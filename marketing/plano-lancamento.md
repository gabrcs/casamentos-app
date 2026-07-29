# Plano de Lançamento — casamentos.app

**Marca:** casamentos.app (domínio + Instagram já criados).
**Produto:** Site de casamento sob medida (RSVP em banco de dados, lista de presentes com Pix copia-e-cola sem taxa, painel administrativo para os noivos), construído sobre a stack já validada no projeto do casal Marcus & Daíse.
**Modelo:** Serviço sob demanda (agência) — Gabriel personaliza e entrega cada site, cobra por projeto + hospedagem.
**Operação:** Solo, bootstrap, sem verba paga inicial além do teste local já em curso.
**Mercado de lançamento:** Curitiba/PR e região, com expansão nacional (BR) depois de validado.
**Data do documento:** 2026-07-16 (atualizado).

---

## 1. Resumo executivo

O produto já existe e já está em produção — o site de Marcus & Daíse é ao mesmo tempo o primeiro cliente e o case/portfólio de lançamento. Isso muda o problema: não é "validar se alguém quer isso", é "transformar um projeto pessoal em oferta repetível e vender as próximas 5-10 vagas".

**As 3 apostas do lançamento:**

1. **O case real vale mais que qualquer landing page.** Casais decidem por prova social visual (ver um site bonito, funcionando, de um casamento de verdade) — não por feature list. O site do Marcus & Daíse, com data real (10/10/2026), é o ativo de marketing mais forte que existe agora.
2. **Fornecedores de casamento são o canal de aquisição mais barato disponível.** Fotógrafos, cerimonialistas, buffets e assessorias de casamento já têm o público certo e indicam fornecedores complementares o tempo todo — sem custo de mídia.
3. **Pix sem taxa na lista de presentes é o diferencial mais fácil de comunicar.** Toda plataforma concorrente (iCasei, Casar.com etc.) cobra taxa em cima do dinheiro dos presentes. "Seus convidados presenteiam, vocês recebem 100%" é uma frase que vende sozinha.

**Prioridade dos primeiros 90 dias:** transformar o site do Marcus & Daíse em portfólio público apresentável, fechar 3-5 casais pagantes via indicação direta e parcerias com fornecedores locais, e formalizar oferta/preço antes de qualquer investimento em tráfego pago.

**Resultado esperado em 12 meses:** operação local em Curitiba com fluxo constante de indicações (fornecedores + boca a boca de casais), 15-25 sites entregues, processo de produção enxuto o bastante para considerar expandir para outras cidades ou testar um modelo self-serve mais simples.

---

## 2. Onde o produto está hoje (estado atual)

**O que já existe e funciona:**
- Stack completa: Astro + Cloudflare Workers (hospedagem grátis/barata) + D1 + Clerk (login) + Drizzle ORM.
- RSVP funcional gravando em banco de dados.
- Lista de presentes com geração de Pix BR Code/EMV **sem gateway e sem taxa** — diferencial real, não é copy vazio.
- Painel administrativo protegido por login (`/admin`, `/admin/rsvps`, `/admin/presentes`) — os noivos gerenciam sozinhos.
- Import de lista de presentes via Google Sheets (`scripts/sheet-to-seed.mjs`) — acelera onboarding de novo casal.
- Identidade visual pronta (paleta creme + marsala + dourado, tipografia serifada elegante) que pode virar o "estilo padrão" do portfólio.
- Um cliente real, em produção, com casamento marcado para 10/10/2026 em Curitiba — ou seja, o produto passa no teste de uso real antes mesmo do lançamento.

**O que já foi resolvido desde a primeira versão deste plano:**
- Marca definida: **casamentos.app**. Domínio e Instagram já criados.
- Autorização do casal Marcus & Daíse para usar o site como case público: confirmada.
- Preço validado com dinheiro real: primeiro pagamento de **R$500** recebido — deixa de ser hipótese.

**O que ainda não existe e precisa ser criado:**
- Página institucional "isso é um serviço, contrate para o seu casamento" — hoje o domínio existe mas o produto ainda se apresenta como site de um casal só.
- Pacotes formalizados além do primeiro preço cobrado (ver §4).
- Processo repetível de onboarding de cliente (hoje foi feito uma vez, manualmente, para o Marcus & Daíse).
- Canal de captação de leads (WhatsApp Business, link na bio do Instagram apontando pra algum lugar que converte).
- Prova social além do case único — falta o segundo cliente fora do Marcus & Daíse.

**Fase:** pré-lançamento / primeiro cliente pagante ainda não existe fora do case original. Isso é a fase mais frágil e mais rápida de sair — o gargalo não é produto, é **empacotar e distribuir**.

---

## 3. Posicionamento e público

**Categoria:** site de casamento sob medida, com foco em duas dores específicas que plataformas genéricas (iCasei, Casar.com, Zola) não resolvem bem para o público brasileiro de médio ticket: (1) taxa sobre presentes em Pix, e (2) aparência genérica/template óbvio.

**Proposta de valor central:**
> "Seu site de casamento, com a cara de vocês, e 100% do dinheiro dos presentes no bolso de vocês."

**ICP (perfil do cliente ideal) — primeira onda:**
- Casal noivo, casamento marcado entre 4 e 14 meses no futuro (tempo suficiente para RSVP e lista de presentes fazerem sentido).
- Curitiba e região metropolitana, para permitir contato próximo e indicação por fornecedores locais.
- Orçamento de casamento médio/alto (contrataram fotógrafo profissional, cerimonial, buffet — sinal de que pagam por qualidade e não vão tentar resolver com Canva).
- Pelo menos um dos noivos incomodado com a ideia de "site de casamento genérico" ou preocupado com taxa em cima de presentes.

**Por que este ICP primeiro:** é o público que o case atual (Marcus & Daíse) já representa — vender para o "gêmeo" do cliente que você já tem é sempre mais fácil que vender para um público novo.

**Voz de marca:** elegante, quente, direta — nada de jargão de "plataforma" ou "solução digital". Fala como quem já fez casamento entende: sem taxa escondida, sem enrolação, o site fica pronto rápido e os noivos não precisam mexer em nada técnico.

---

## 4. Oferta e preço

**Primeiro dado real:** R$500 pago por um cliente. É um ponto, não uma curva — não dá pra saber ainda se R$500 é o teto do que o mercado aceita ou se está deixando dinheiro na mesa. Tratar como piso de validação, não como preço final do pacote "âncora".

Proposta de estrutura de 3 pacotes, usando os R$500 como referência do nível de entrada — ajustar depois de mais 2-3 vendas:

| Pacote | O que inclui | Preço de referência | Público |
|---|---|---|---|
| **Essencial** | Site com contagem regressiva, história do casal, cerimônia/recepção, RSVP, subdomínio `casamentos.app/nome-do-casal` | ~R$500 (dado validado) | Casais com orçamento mais enxuto |
| **Completo** | Essencial + lista de presentes com Pix + painel admin + domínio próprio (`.com`) | A definir — testar acima de R$500, este é o nível do site do Marcus & Daíse | A maioria — pacote "âncora" |
| **Assinatura anual de hospedagem** (opcional, recorrente) | Manutenção, suporte a pequenas edições pós-entrega, backup | A definir | Upsell pós-venda, não bloqueia a venda inicial |

**Próximo passo de preço:** cobrar o pacote Completo (nível Marcus & Daíse) de um segundo cliente por um valor acima de R$500 — só assim descobre se R$500 foi "preço de amigo"/piso de entrada ou se é o teto real do ICP. Continua em aberto, ver §9.

**Diferencial de preço a comunicar sempre:** "sem taxa em cima dos presentes" precisa aparecer em toda peça de venda — é a objeção que mais rápido converte, porque é comparável e concreto (economiza real em dinheiro, não é benefício abstrato).

---

## 5. Canais de aquisição (ORB adaptado para negócio local de serviço)

Sem verba paga, os canais **owned** e **borrowed** carregam o lançamento. Pago entra só depois de validar o funil orgânico.

### Owned (o que Gabriel controla)
- **Portfólio/case do Marcus & Daíse como vitrine pública.** Autorização já confirmada — falta executar: adicionar link discreto "feito por casamentos.app" no rodapé do site deles, e usar prints/vídeo do site real em qualquer material de venda.
- **Instagram @casamentos.app** — já criado, ainda sem conteúdo publicado. Portfólio visual é o formato certo pra esse público — casais de casamento vivem no Instagram pesquisando fornecedores. Prioridade: publicar as primeiras 5-8 telas do site do Marcus & Daíse (ver §6).
- **WhatsApp Business** — ainda não criado. É onde casal brasileiro fecha decisão de fornecedor de casamento, não em formulário de site. Fazer antes do primeiro post no Instagram, pra ter pra onde mandar quem clicar no link da bio.

### Borrowed (essencial nesta fase — é o canal mais barato que existe)
- **Parcerias com fornecedores de casamento em Curitiba:** cerimonialistas, fotógrafos, buffets, decoradores. Eles já têm o público, já são procurados por casais recém-noivos, e indicam fornecedores complementares por hábito de mercado. Modelo: comissão por indicação convertida, ou parceria de troca (fornecedor indica, aparece como "parceiro recomendado" na página do serviço).
- **O próprio casal Marcus & Daíse como referência ativa.** Pedir para eles indicarem para amigos noivos e para o próprio fornecedor de cerimônia/buffet — casais recém-casados são a fonte de indicação mais crível para casais prestes a casar.
- **Grupos e comunidades de noivos** (Facebook ainda é relevante para esse público no Brasil, grupos regionais de "noivas de Curitiba" etc.) — participar entregando valor antes de vender.

### Rented (só depois de validar o owned/borrowed)
- Anúncio local no Instagram/Meta segmentado por "noivos" + Curitiba, com orçamento pequeno de teste (R$300-500) **somente depois** de ter pelo menos 1-2 casos além do original para usar como criativo.

**O que não fazer agora:** Product Hunt, Hacker News, SEO de conteúdo pesado, ou qualquer canal pensado para produto B2B/SaaS de larga escala. Esse ferramental (do playbook padrão de lançamento) não serve para negócio de serviço local com ciclo de venda 1:1 — descartado explicitamente, não por esquecimento.

---

## 6. Roteiro dos primeiros 90 dias

**Semanas 1-2 — Destravar (fundação mínima para vender)**
- ~~Definir nome do serviço, comprar domínio, criar Instagram~~ — feito (casamentos.app).
- ~~Pedir autorização ao casal para usar o site como case público~~ — feito.
- Criar WhatsApp Business.
- Preparar 5-8 prints/telas do site do Marcus & Daíse em alta qualidade (desktop + mobile) para portfólio.
- Adicionar link "feito por casamentos.app" no rodapé do site do Marcus & Daíse.
- Fechar preço do pacote Completo (acima dos R$500 já validados no Essencial — ver §4).

**Semanas 3-4 — Base (primeiro conteúdo e primeira lista de contatos)**
- Publicar 3-5 posts no Instagram mostrando o site real (contagem regressiva, RSVP, lista de presentes com Pix, painel admin — cada tela é um post).
- Listar e contatar pessoalmente 8-10 fornecedores de casamento em Curitiba (cerimonialistas, fotógrafos, buffets) propondo parceria de indicação.
- Criar processo simples de onboarding: formulário/questionário que o próximo casal preenche (nomes, data, textos, fotos) — reduzir fricção de repetir manualmente o que foi feito para o Marcus & Daíse.

**Semanas 5-8 — Velocidade (primeiras vendas)**
- Fechar 2-3 casais via indicação direta (rede pessoal + fornecedores parceiros).
- Entregar o primeiro site pago fora do case original — vira o segundo case, com um público/estilo diferente (evita portfólio parecer "um caso só").
- Pedir depoimento em vídeo/texto curto de cada casal entregue.

**Semanas 9-12 — Compor (repetir o que funcionou)**
- Revisar quais canais trouxeram os leads reais (indicação de fornecedor vs. rede pessoal vs. Instagram orgânico) e dobrar aposta no que funcionou.
- Com 2+ cases variados, considerar teste pago pequeno (R$300-500) segmentado localmente.
- Formalizar preço final com base em dados reais de conversão, não mais em achismo.

---

## 7. Retenção e referência (pós-entrega)

Diferente de SaaS, o "cliente" (casal) usa o produto intensamente por poucos meses e depois o casamento acontece — não existe "retenção" recorrente clássica. O jogo aqui é:

- **Suporte pós-entrega leve:** pequenas edições de texto/foto sem custo por um período (ex: 30 dias), depois cobrado ou incluso na assinatura de hospedagem. Constrói boa vontade e reduz atrito.
- **Momento de indicação certo:** o pico de indicação de um casal satisfeito é logo após o casamento, quando amigos noivos perguntam "como vocês fizeram aquele site?". Preparar um pedido de indicação/depoimento programado para essa janela (ex: mensagem de WhatsApp 1 semana após o casamento).
- **Fornecedores parceiros como canal recorrente:** diferente do casal (cliente único), o fornecedor parceiro indica repetidamente — é o ativo de "retenção" real deste negócio. Manter relacionamento ativo (agradecer cada indicação, compartilhar quando o site do indicado fica pronto).

---

## 8. Stack de operação (o que substitui uma equipe)

Como operação solo, o "time de marketing" é ferramenta + processo, não headcount:

| Frente | Como é feito sem contratar |
|---|---|
| Portfólio/vendas | Instagram + WhatsApp Business + site institucional simples (pode ser a própria stack Astro) |
| Onboarding de cliente | Formulário/planilha reaproveitando `scripts/sheet-to-seed.mjs` já existente para presentes |
| Indicação de fornecedores | Relacionamento 1:1 manual — não escalável ainda, e está certo não ser: validar antes de sistematizar |
| Depoimentos/prova social | Pedido manual pós-entrega, texto ou vídeo curto por WhatsApp |

**O que não construir ainda:** CRM, automação de e-mail, painel de afiliados para fornecedores. Prematuro para o volume atual (0 a poucos clientes/mês) — reavaliar quando o funil de indicação de fornecedores gerar volume difícil de acompanhar manualmente.

---

## 9. Decisões em aberto

**Resolvidas:**
1. ~~Preço não validado~~ — R$500 pago por cliente real. Piso confirmado; teto ainda desconhecido (ver §4).
2. ~~Nome do serviço~~ — casamentos.app. Domínio + Instagram criados.
3. ~~Autorização do casal Marcus & Daíse~~ — confirmada.

**Ainda em aberto:**
4. **Escala do processo de entrega não testada.** Um site foi feito manualmente, uma vez. Quantos sites por mês Gabriel consegue entregar sozinho sem cair de qualidade é desconhecido — importa para não vender mais rápido do que consegue entregar.
5. **Expansão geográfica além de Curitiba** é fora de escopo para os 12 meses — mencionado aqui para não ser esquecido, não para ser perseguido agora.
6. **Teto de preço real do pacote Completo** — R$500 foi o Essencial/piso. Precisa de uma segunda venda testando valor mais alto pra achar o teto do ICP.

---

## 10. O que fica de fora deste plano (e por quê)

- **Tráfego pago em escala** — sem validação de preço e sem cases suficientes, pago só queima dinheiro em criativo fraco.
- **SEO de conteúdo (blog sobre casamento)** — ciclo longo demais para um negócio local pré-validação; revisitar só se o modelo local funcionar e fizer sentido escalar para outras cidades.
- **Modelo self-serve/SaaS** — a stack técnica já suporta virar produto self-serve no futuro (é só multi-tenant o schema atual), mas isso é uma aposta de produto diferente, não de marketing. Não misturar as duas decisões agora.
- **Product Hunt / lançamento estilo SaaS** — público de casamento não está nesses canais; descartado.

---

*Documento vivo — revisar após os primeiros 3 clientes pagantes fechados, quando os dados reais de canal e preço substituem as hipóteses acima.*
