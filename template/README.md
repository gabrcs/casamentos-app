# Template de Site de Casamento (BG Casamentos)

Template reutilizável do site de casamento: **RSVP em banco de dados**, **lista
de presentes com Pix copia e cola (sem taxa)** e **painel administrativo**
protegido por login. Mesmo layout e mesma paleta de cores para todos os
casais — só os dados mudam.

## Stack

- **Astro** (SSR) + **Tailwind CSS v4**
- **Cloudflare Workers** (hospedagem) + **D1** (banco SQLite)
- **Clerk** (autenticação do painel dos noivos)
- **Drizzle ORM** (acesso ao banco)
- Pix **BR Code / EMV** gerado sem gateway (`src/lib/pix.ts`)

## Para criar o site de um novo casal

Não use este projeto diretamente — siga o guia completo em
**[IMPLANTACAO.md](./IMPLANTACAO.md)**, que cobre do zero até o site em
produção: copiar o template, preencher os dados do casal, subir fotos,
configurar Cloudflare D1, Clerk e fazer o deploy.

## Onde ficam os dados do casal (depois de seguir o IMPLANTACAO.md)

- Nomes, data, locais, textos e história: `src/config/site.ts`
- Cores e fontes: `src/styles/global.css` (bloco `@theme`)
- Fotos da capa/"Sobre o Casal": `public/images/` (veja `LEIA-ME.md` na pasta)
- Fotos da galeria (carrossel): `src/assets/galeria/` (veja `LEIA-ME.md` na pasta)
- Lista de presentes: `scripts/seed-gifts.sql`
- Chave Pix, e-mails admin, chaves Clerk: `.dev.vars` (local) / `wrangler secret` (produção)
- Nome do projeto, banco D1 e domínio: `wrangler.toml` e `astro.config.mjs`

## Painel administrativo

- `/entrar` — login (Clerk)
- `/admin` — visão geral
- `/admin/rsvps` — confirmações + exportar CSV
- `/admin/presentes` — criar/editar/remover presentes e marcar status

Apenas e-mails listados em `ADMIN_EMAILS` conseguem acessar o painel.
