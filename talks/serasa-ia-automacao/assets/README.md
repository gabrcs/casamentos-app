# assets

## A foto do apresentador

Salve a foto aqui como **`bruno.jpg`** (também aceita `.jpeg`, `.png` ou `.webp`)
e rode os dois builds:

```bash
python3 build.py     # embute a foto em base64 no deck.html
node make_pptx.js    # insere a foto no deck.pptx com corte quadrado
```

Não precisa recortar antes: os dois formatos fazem o corte quadrado sozinhos
(`object-fit: cover` no HTML, `sizing: cover` no `.pptx`). A moldura foca o
enquadramento em `52% 16%` — pensado para retrato 3:4 com a pessoa levemente
à direita do centro e a cabeça no terço superior. Se a sua foto for enquadrada
de outro jeito, ajuste `object-position` em `.bio-photo img` no `deck.src.html`.

Enquanto o arquivo não existir, os dois decks mostram um espaço tracejado com
a instrução, e o build avisa no terminal — nada quebra.

**A foto não é versionada** (veja o `.gitignore`): é imagem de uma pessoa real
e não precisa morar no repositório. Guarde uma cópia fora daqui.
