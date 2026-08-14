# assets

| Arquivo | O que é |
|---|---|
| `bruno.*` | Foto do apresentador. Opcional — veja abaixo. **Não versionada.** |
| `skill-preview.png` | Print da saída da skill, mostrado no slide 13. Gere com `node qa/make_preview.mjs`. |
| `kit-link.txt` | URL do kit. Alimenta o QR do slide 13. |
| `kit-qr.png` | O QR. Gere com `python3 qa/make_qr.py`. |

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

Sem o arquivo, os dois decks mostram um quadrado lavanda escrito `FOTO`. Ele é
apresentável do jeito que está, e no PowerPoint ou no Google Apresentações basta
selecionar o quadrado e substituir por Imagem — que é o caminho mais direto se você
for editar o deck de qualquer forma.

**A foto não é versionada** (veja o `.gitignore`): é imagem de uma pessoa real
e não precisa morar no repositório. Guarde uma cópia fora daqui.
