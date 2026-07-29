# casamentos.app · Kit de estreia no Instagram

Baseado em `outputs/casamentos-app-brand-identity.html` (território "Yours, Entirely", selecionado em 27/07/2026).

## Perfil

**Foto de perfil:** `logos/avatar-1024.png`

**Nome (campo pesquisável):** casamentos.app | Sites de Casamento

**Bio:**

```
Sites de casamento sob medida
RSVP + presentes via Pix, sem taxa
Feito em Curitiba, para todo o Brasil
Chama no WhatsApp
```

**Link:** wa.me com mensagem pré-preenchida, por exemplo:
`https://wa.me/55XXXXXXXXXXX?text=Oi!%20Quero%20um%20site%20para%20o%20nosso%20casamento`

## Primeiro post (carrossel, `post-01/`)

Ordem: slide-1 a slide-6. Formato 1080x1080.

**Legenda:**

```
Um site de casamento inteiramente de vocês.

Cada site nasce da história do casal: as cores, as palavras, as fotos, o jeito da celebração. Nada de catálogo de modelos prontos.

E o que vem junto:

RSVP simples: os convidados confirmam em segundos e vocês acompanham tudo em tempo real.

Presentes via Pix direto para o casal, sem taxa. O valor chega em cheio.

Painel próprio: RSVP, presentes e recados num lugar só, administrado por vocês.

Quer ver a celebração de vocês online? Chama a gente no WhatsApp pelo link da bio.

#sitedecasamento #casamento #noivos #noivas2026 #noivos2026 #casamentocuritiba #noivascuritiba #listadepresentes #rsvp
```

**Texto alternativo (acessibilidade), por slide:**

1. Capa vinho com moldura clara e o texto: um site de casamento inteiramente de vocês.
2. Prévia de site de casal com nomes Marcus e Daíse, data e contagem regressiva.
3. Prévia de formulário RSVP com nome preenchido e botão de confirmação.
4. Prévia de presente com QR Code de Pix e aviso de 100% para o casal.
5. Prévia do painel do casal com confirmações, presentes e recados.
6. Convite final: veja a celebração de vocês online, chame no WhatsApp.

## Primeiro story (`story-01.png`)

Formato 1080x1920. Publicar logo após o post.

- Adicionar figurinha de link apontando para o WhatsApp, com o rótulo "chama a gente".
- Opcional: figurinha de localização Curitiba.
- Depois de publicado, salvar em um destaque "quem somos" (capa: `logos/avatar-1024.png`).

## Logos (`logos/`)

- `logo-mark-plum.svg` · símbolo (moldura assimétrica) em Plum, fundo transparente.
- `logo-mark-cocoa.svg` · símbolo monocromático em Cocoa.
- `logo-mark-ivory.svg` · símbolo em Ivory, para fundos escuros.
- `logo-avatar.svg` + `avatar-1024.png` · avatar do perfil, moldura Ivory sobre Plum.
- `logo-wordmark.svg` + `wordmark-ivory-bg.png` · logo horizontal em fundo claro.
- `logo-wordmark-ivory.svg` + `wordmark-plum-bg.png` · logo horizontal em fundo Plum.

Observações:

- Os SVGs de wordmark usam a fonte Cormorant Garamond via `font-family`; para publicar, use os PNGs (fonte já renderizada). Instale a fonte no sistema se for editar os SVGs.
- O brand report marca o símbolo como proposta, ainda sem verificação de marca registrada.

## Fontes dos assets

HTMLs editáveis em `sources/` (renderizados com `sources/render.swift`, WebKit nativo):

```bash
swiftc -O sources/render.swift -o /tmp/render && /tmp/render sources/slide-1.html saida.png 1080 1080
```

Paleta: Plum `#5B2D3A` · Ivory `#FBF6EE` · Rose Clay `#C78378` · Antique Gold `#B88A45` · Cocoa `#34211F`. Tipografia: Cormorant Garamond (display) + Inter (texto).
