# Guia de Implantação — Site de Casamento (BG Casamentos)

Guia passo a passo para criar o site de um **novo casal** a partir deste
template, do zero até em produção no Cloudflare. Layout e cores são fixos
(não mude classes Tailwind nem `src/styles/global.css` a menos que o casal
peça algo diferente) — o que muda é sempre dados: nomes, datas, locais,
fotos, Pix e presentes.

Sempre que aparecer `{{ALGO_ASSIM}}`, é um placeholder: substitua pelo valor
real antes de rodar o build/deploy.

---

## 0. Checklist — informações a coletar do casal antes de começar

- [ ] Nome do noivo e da noiva
- [ ] Data e hora da cerimônia (e da recepção, se diferente)
- [ ] Cidade/UF do evento
- [ ] Local e endereço completo da cerimônia (+ link do Google Maps)
- [ ] Local e endereço completo da recepção/festa (+ link do Google Maps)
- [ ] Uma frase/citação do casal (aparece no banner)
- [ ] Texto da "Nossa história" (2–4 parágrafos)
- [ ] Prazo final para confirmar presença (RSVP)
- [ ] E-mail de contato do casal
- [ ] Link de um vídeo do pré-wedding no YouTube (opcional — pode deixar em branco)
- [ ] 5 fotos para o banner do topo + 1 foto para "Sobre o Casal" + fotos para a galeria
- [ ] Chave Pix (CPF/CNPJ/e-mail/telefone/aleatória) e nome do recebedor
- [ ] Lista de presentes (nome, descrição, preço, categoria, foto/link de imagem)
- [ ] E-mail(s) que terão acesso ao painel administrativo
- [ ] Domínio (ou subcaminho de um domínio já existente) onde o site vai ficar no ar

---

## 1. Copiar o template e criar o novo projeto

```bash
# Escolha um slug curto para o casal, ex: joao-e-maria
export CASAL=joao-e-maria

cp -R /Users/gabrielcorreaprata/Desktop/Projects/BGCasamentos/template \
      /Users/gabrielcorreaprata/Desktop/Projects/casamento-$CASAL

cd /Users/gabrielcorreaprata/Desktop/Projects/casamento-$CASAL

# Projeto novo, sem histórico do template
rm -rf .git
git init
```

## 2. Instalar dependências e rodar local (com dados de exemplo)

```bash
npm install
npm run dev   # http://localhost:4321 — ainda com placeholders, é normal
```

Se o build/dev quebrar aqui por causa de algum placeholder, siga para o
passo 3 antes de continuar testando.

---

## 3. Arquivos a editar com os dados do novo casal

### 3.1 `src/config/site.ts` (o mais importante — dados do casal)

Preencha **todos** os campos abaixo (todos são `{{PLACEHOLDER}}` hoje):

| Campo | O que colocar |
|---|---|
| `groom` / `bride` (topo do arquivo) | Nomes do casal |
| `eventDate` | Data/hora ISO da cerimônia, ex: `'2027-05-20T18:00:00-03:00'` |
| `city` | Ex: `'Curitiba - PR'` |
| `quote` | Frase do casal exibida no banner |
| `videoUrl` | URL **embed** do YouTube (`https://www.youtube-nocookie.com/embed/ID_DO_VIDEO`), ou `''` para ocultar a seção de vídeo inteira |
| `ceremony.*` | Título fixo, horário, local, endereço, link do Maps normal e link do Maps "embed" (Google Maps > Compartilhar > Incorporar mapa > copie só a URL do `src`) |
| `reception.*` | Igual acima, para a recepção/festa |
| `rsvpDeadline` | Texto livre, ex: `'05 de outubro de 2027'` |
| `contactEmail` | E-mail de contato exibido/usado no site |
| `story` | Array de parágrafos da seção "Nossa história" — adicione/remova itens à vontade |

### 3.2 Fotos

- `public/images/` — siga `public/images/LEIA-ME.md` (nomes de arquivo fixos:
  `noivos.jpg`, `noivos-02.jpg` … `noivos-05.jpg`, `casal.jpg`).
- `src/assets/galeria/` — siga `src/assets/galeria/LEIA-ME.md` (qualquer
  quantidade de imagens, nomeadas em ordem: `01.jpg`, `02.jpg`, …).
- Pode apagar os arquivos `LEIA-ME.md` depois de colocar as fotos reais, ou
  deixá-los (não afetam o site).

### 3.3 Lista de presentes — `scripts/seed-gifts.sql`

Edite os `INSERT INTO gifts` com os itens reais (título, descrição, URL de
imagem, preço em **centavos**, categoria, ordem). Ou gere o arquivo a partir
de uma planilha do Google Sheets:

```bash
# No Sheets: Arquivo > Fazer download > CSV
# Colunas esperadas: titulo | descricao | valor | imagem | categoria | ordem
node scripts/sheet-to-seed.mjs lista.csv > scripts/seed-gifts.sql
```

### 3.4 Variáveis de ambiente locais — `.dev.vars`

```bash
cp .dev.vars.example .dev.vars
```

Edite `.dev.vars` e preencha:

- `PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` — do dashboard do Clerk (passo 5)
- `ADMIN_EMAILS` — e-mail(s) que podem acessar `/admin`, separados por vírgula
- `PIX_KEY` — chave Pix do casal
- `PIX_MERCHANT_NAME` — nome do recebedor, **sem acento, maiúsculo, até 25 caracteres**
- `PIX_MERCHANT_CITY` — cidade do recebedor, **sem acento, maiúsculo, até 15 caracteres**

`.dev.vars` nunca vai para o Git (já está no `.gitignore`).

### 3.5 `wrangler.toml`

| Campo | O que colocar |
|---|---|
| `name` | Nome do projeto no Cloudflare, ex: `casamento-joao-e-maria` |
| `routes[0].pattern` | `{{DOMINIO}}/{{SLUG}}*`, ex: `casamentos.app/joaoemaria*`. Se for publicar na raiz de um domínio próprio do casal, use `{{DOMINIO}}/*` |
| `routes[0].zone_name` | O domínio raiz cadastrado no Cloudflare, ex: `casamentos.app` |
| `database_name` | Mesmo valor de `name` (recomendado) |
| `database_id` | Cole aqui depois de rodar `wrangler d1 create` (passo 4) |
| `[vars].PUBLIC_CLERK_PUBLISHABLE_KEY` | Chave **pública** do Clerk (não é secreta) |
| `[vars].ADMIN_EMAILS` | Mesmo valor de `.dev.vars` |
| `[vars].PIX_MERCHANT_NAME` / `PIX_MERCHANT_CITY` | Mesmos valores de `.dev.vars` |

### 3.6 `astro.config.mjs`

Ajuste `base` para bater com o `routes[0].pattern` do `wrangler.toml`:

```js
base: '/joaoemaria',   // ou '/' se publicar na raiz do domínio
```

### 3.7 `package.json`

Troque as 5 ocorrências de `{{PROJECT_NAME}}` (campo `name` + os 4 scripts
`db:migrate:*`/`db:seed:*`) pelo mesmo nome usado em `wrangler.toml` →
`name`/`database_name`. Forma rápida:

```bash
sed -i '' 's/{{PROJECT_NAME}}/casamento-joao-e-maria/g' package.json wrangler.toml
```

(no Linux, sem o `''` depois de `-i`)

---

## 4. Cloudflare D1 (banco de dados)

```bash
# 1. Login (abre o navegador)
npx wrangler login

# 2. Cria o banco — copie o "database_id" retornado
npx wrangler d1 create casamento-joao-e-maria
# Cole o database_id em wrangler.toml > [[d1_databases]] > database_id

# 3. Aplica as migrações (cria as tabelas)
npm run db:migrate:local     # banco local, para testar com `wrangler dev`
npm run db:migrate:remote    # banco de produção

# 4. Carrega a lista de presentes
npm run db:seed:local
npm run db:seed:remote
```

## 5. Clerk (login do painel administrativo)

1. Crie uma aplicação em https://dashboard.clerk.com (ou reutilize uma
   existente da BG Casamentos, se for esse o modelo).
2. Em **API Keys**, copie `Publishable key` e `Secret key`.
3. Local: cole as duas em `.dev.vars` (`PUBLIC_CLERK_PUBLISHABLE_KEY`,
   `CLERK_SECRET_KEY`).
4. Produção: a publishable key vai em `wrangler.toml` (`[vars]`, não é
   secreta). A secret key vai como secret do Worker:
   ```bash
   npx wrangler secret put CLERK_SECRET_KEY
   ```
5. Defina quem é admin: e-mails autorizados ficam em `ADMIN_EMAILS` (local em
   `.dev.vars`, produção como secret):
   ```bash
   npx wrangler secret put ADMIN_EMAILS
   ```
   Peça para o casal (ou quem for administrar) criar uma conta em `/entrar`
   com um dos e-mails da lista.

## 6. Configurar o secret do Pix

```bash
npx wrangler secret put PIX_KEY
```

`PIX_MERCHANT_NAME` e `PIX_MERCHANT_CITY` **não** são secrets — ficam em
`wrangler.toml > [vars]` (passo 3.5).

## 7. Deploy

```bash
npm run deploy
```

Isso roda `astro build` (gera `dist/`) e `wrangler deploy` (publica o
Worker). Na primeira vez, confirme no dashboard do Cloudflare
(**Workers & Pages**) que o Worker foi criado com o nome esperado.

### Domínio customizado

No dashboard do Cloudflare: **Workers & Pages > {{PROJECT_NAME}} > Settings
> Domains & Routes**. Se o domínio já está no Cloudflare (zona já
cadastrada), a rota configurada em `wrangler.toml` (`routes`) já cobre o
subcaminho — não precisa de passo manual extra além de o domínio estar
ativo na Cloudflare. Se for domínio novo, adicione a zona primeiro em
**Websites** e aponte os nameservers do registrador para o Cloudflare.

---

## 8. Verificação pós-deploy

Acesse o site publicado e confira:

- [ ] Home carrega, banner mostra as 5 fotos, nomes e data corretos
- [ ] Contagem regressiva bate com a data/hora configurada
- [ ] Seção "Sobre o Casal" mostra a história e a foto certas
- [ ] Vídeo do pré-wedding aparece (ou a seção some, se `videoUrl` estiver vazio)
- [ ] Mapas de cerimônia e recepção abrem no endereço certo
- [ ] Galeria de fotos (carrossel) mostra as imagens de `src/assets/galeria`
- [ ] Lista de presentes aparece com preços certos; clicar em "Presentear via
      Pix" mostra QR code e código copia-e-cola válidos
- [ ] Formulário de RSVP salva (confirme algo de teste e apague depois pelo
      painel, ou marque para os noivos ignorarem entradas de teste)
- [ ] `/entrar` faz login com um e-mail da `ADMIN_EMAILS` e abre `/admin`
- [ ] `/admin`, `/admin/rsvps` (com exportar CSV) e `/admin/presentes`
      funcionam e mostram os dados reais

---

## 9. Troubleshooting

**Erro "Binding D1 'DB' não encontrado"**
Rode `npm run db:migrate:local` (dev) ou confirme que `database_id` em
`wrangler.toml` foi preenchido com o valor real de `wrangler d1 create`
(deploy).

**Presentes não aparecem / lista vazia**
Rode `npm run db:seed:local` ou `npm run db:seed:remote` conforme o
ambiente. Confirme que `scripts/seed-gifts.sql` tem os itens do casal.

**QR Code do Pix não aparece / aviso "chave Pix não configurada"**
`PIX_KEY` não foi definido — configure em `.dev.vars` (local) ou
`wrangler secret put PIX_KEY` (produção).

**`/entrar` funciona mas `/admin` diz "Acesso restrito"**
O e-mail logado no Clerk não está em `ADMIN_EMAILS`. Confirme o valor exato
(sem espaços extras, minúsculo é tratado automaticamente) em `.dev.vars` ou
no secret de produção.

**Erro de autenticação do Clerk (chaves ausentes/erradas)**
Confirme `PUBLIC_CLERK_PUBLISHABLE_KEY` (em `wrangler.toml > [vars]` ou
`.dev.vars`) e `CLERK_SECRET_KEY` (secret). As duas precisam ser do **mesmo**
ambiente Clerk (test vs. live).

**Fotos não aparecem**
- Banner/"Sobre o Casal": confira se os arquivos em `public/images/` têm
  exatamente os nomes esperados (veja `public/images/LEIA-ME.md`).
- Galeria: confira se as imagens estão em `src/assets/galeria/` com extensão
  suportada (`.jpg`, `.png`, `.webp`, `.avif`).

**`npm run build` falha com erro relacionado a `site.eventDate` ou
`new Date(...)`**
Confirme que `eventDate` em `src/config/site.ts` foi preenchido com uma data
ISO válida (o placeholder `{{DATA_HORA_CASAMENTO_ISO}}` não é uma data
válida e só deve existir antes do passo 3.1).

**Rota/base path erradas (404 em tudo, ou CSS não carrega)**
`base` em `astro.config.mjs` precisa bater exatamente com o path usado em
`routes[0].pattern` no `wrangler.toml` (passo 3.5 e 3.6).
