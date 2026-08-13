import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'shots');
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
await p.goto('file://' + path.join(HERE, '..', 'deck.html'));
await p.waitForTimeout(3600);
const n = await p.evaluate(() => document.querySelectorAll('.slide').length);
const fontOK = await p.evaluate(() => document.fonts.check("700 40px Roboto") && document.fonts.check("400 20px 'Roboto Mono'"));
console.log('slides:', n, '| fonts loaded:', fontOK);
const problems = [];
for (let i = 0; i < n; i++) {
  await p.evaluate(k => {
    document.querySelectorAll('.slide').forEach((s, j) => s.classList.toggle('on', j === k));
  }, i);
  await p.waitForTimeout(160);
  const stage = await p.$('#stage');
  const info = await p.evaluate(k => {
    const s = document.querySelectorAll('.slide')[k];
    const sr = s.getBoundingClientRect();
    const bad = [];
    // content overflowing the slide box
    if (s.scrollHeight > s.clientHeight + 2) bad.push(`vertical overflow +${s.scrollHeight - s.clientHeight}px`);
    if (s.scrollWidth > s.clientWidth + 2) bad.push(`horizontal overflow +${s.scrollWidth - s.clientWidth}px`);
    // filho em fluxo que desce além do padding do slide — invade a faixa do rodapé
    // sem aumentar scrollHeight, porque irmãos com flex:1 encolhem para compensar
    {
      const cs = getComputedStyle(s);
      const limite = sr.bottom - parseFloat(cs.paddingBottom);
      [...s.children].forEach(el => {
        if (getComputedStyle(el).position === 'absolute') return;
        const r = el.getBoundingClientRect();
        if (r.height && r.bottom > limite + 2)
          bad.push(`${el.className || el.tagName} invade o rodapé em ${Math.round(r.bottom - limite)}px`);
      });
    }
    // rect após recorte pelos ancestrais com overflow:hidden — decoração que
    // sangra de propósito dentro de um painel recortado não é problema
    const clipped = el => {
      let r = el.getBoundingClientRect();
      let box = { top: r.top, right: r.right, bottom: r.bottom, left: r.left };
      for (let a = el.parentElement; a && a !== s.parentElement; a = a.parentElement) {
        const ov = getComputedStyle(a).overflow;
        if (ov === 'visible') continue;
        const ar = a.getBoundingClientRect();
        box.top = Math.max(box.top, ar.top);
        box.left = Math.max(box.left, ar.left);
        box.right = Math.min(box.right, ar.right);
        box.bottom = Math.min(box.bottom, ar.bottom);
      }
      return box;
    };
    s.querySelectorAll('*').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.height === 0 || r.width === 0) return;
      const c = clipped(el);
      if (c.bottom > sr.bottom + 2) bad.push(`${el.className || el.tagName} bleeds ${Math.round(c.bottom - sr.bottom)}px below`);
      if (c.right > sr.right + 2) bad.push(`${el.className || el.tagName} bleeds ${Math.round(c.right - sr.right)}px right`);
      // texto sendo cortado por um ancestral com overflow:hidden.
      // só olha quem carrega texto direto — decoração posicionada fora do
      // painel é de propósito e não conta.
      const ownText = [...el.childNodes]
        .filter(nd => nd.nodeType === 3).map(nd => nd.textContent.trim()).join('');
      if (ownText) {
        if (c.bottom < r.bottom - 2 || c.top > r.top + 2)
          bad.push(`texto cortado na vertical: "${ownText.slice(0, 30)}"`);
        if (c.right < r.right - 2 || c.left > r.left + 2)
          bad.push(`texto cortado na horizontal: "${ownText.slice(0, 30)}"`);
      }
    });
    return { sec: s.dataset.sec, bad: [...new Set(bad)].slice(0, 6) };
  }, i);
  if (info.bad.length) problems.push(`slide ${i + 1} (${info.sec}): ${info.bad.join('; ')}`);
  await stage.screenshot({ path: `${OUT}/s${String(i + 1).padStart(2, '0')}.png` });
}
console.log(problems.length ? 'PROBLEMS:\n' + problems.join('\n') : 'no overflow detected');
await b.close();
