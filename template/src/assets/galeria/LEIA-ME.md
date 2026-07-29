# Fotos da galeria (carrossel Swiper)

Toda imagem colocada nesta pasta aparece **automaticamente** no carrossel da
seção "Galeria de Fotos" — não precisa editar nenhum código
(`src/pages/index.astro` usa `import.meta.glob` para carregar tudo aqui).

- Formatos aceitos: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif` (maiúsculo ou
  minúsculo).
- Nomeie em ordem numérica para controlar a sequência do carrossel, ex:
  `01.jpg`, `02.jpg`, `03.jpg`, … (a ordenação é alfanumérica).
- Proporção usada no carrossel: `3:4` (retrato) — fotos em outra proporção
  são cortadas (`object-fit: cover`) para caber.
- Dimensão recomendada: ~1200×1600px, até ~500 KB cada.
- Sem limite de quantidade — coloque quantas fotos quiser.

Este arquivo (`LEIA-ME.md`) fica na pasta mas não é uma imagem, então é
ignorado pelo carrossel automaticamente.
