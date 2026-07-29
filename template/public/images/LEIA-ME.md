# Fotos de capa e "Sobre o Casal"

Coloque aqui as fotos referenciadas em `src/pages/index.astro`. Os nomes de
arquivo são fixos (o código busca por eles diretamente) — respeite exatamente:

| Arquivo | Onde aparece | Dimensão recomendada |
|---|---|---|
| `noivos.jpg` | Banner do topo (slide 1) | 1600×2000px (retrato), paisagem também funciona |
| `noivos-02.jpg` | Banner do topo (slide 2) | igual acima |
| `noivos-03.jpg` | Banner do topo (slide 3) | igual acima |
| `noivos-04.jpg` | Banner do topo (slide 4) | igual acima |
| `noivos-05.jpg` | Banner do topo (slide 5) + thumbnail do vídeo (seção "Assista ao clipe") | igual acima |
| `casal.jpg` | Seção "Sobre o Casal" | 1200×1500px (retrato) ou similar |

Formato: `.jpg`. Peso recomendado: até ~500 KB cada (o Astro comprime no
build, mas partir de arquivos já otimizados acelera o `npm run dev`/deploy).

Se o casal tiver menos de 5 fotos para o banner, duplique uma delas ou remova
as entradas extras do array em `src/pages/index.astro` (seção `<!-- Banner com
foto dos noivos -->`).

Este arquivo (`LEIA-ME.md`) não precisa ser removido — ele não é servido
como página, só documentação da pasta.
