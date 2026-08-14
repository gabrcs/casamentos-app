// Captura o fluxograma da skill mapear-processo para o slide 13.
// Só o quadro do fluxo, em escala nativa: a página inteira em miniatura
// vira textura ilegível no slide.
//
// Uso: node qa/make_preview.mjs
import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ORIGEM = path.join(HERE, '..', 'kit/skills/mapear-processo/exemplo/testes/C.html');
const DESTINO = path.join(HERE, '..', 'assets/skill-preview.png');

const b = await chromium.launch({
  executablePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox'],
});
const p = await b.newPage({ viewport: { width: 1200, height: 1400 }, deviceScaleFactor: 2 });
await p.goto('file://' + ORIGEM);
await p.waitForTimeout(700);
// esconde o painel lateral para o fluxo ocupar o quadro inteiro
await p.evaluate(() => {
  document.querySelector('.main').style.gridTemplateColumns = '1fr';
  document.querySelector('.side').style.display = 'none';
  const cv = document.querySelector('.canvas');
  cv.style.padding = '28px 24px';
  // o quadro abraça o fluxo, senão sobra fundo escuro vazio dos dois lados
  const nat = parseFloat(document.getElementById('svg').style.maxWidth);
  cv.style.width = (nat + 48) + 'px';
  cv.style.margin = '0';
});
await p.waitForTimeout(300);
await p.locator('.canvas').screenshot({ path: DESTINO });
console.log('preview:', DESTINO);
await b.close();
