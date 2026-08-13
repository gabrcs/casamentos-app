// Mede o ritmo vertical de cada slide: o vão entre blocos irmãos e a folga
// que sobra antes da faixa do rodapé. Serve para conferir que as distâncias
// saem todas da grade de 8px (--s0..--s6) em vez de valores avulsos.
//
// Uso: node qa/measure_rhythm.mjs
import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox'] });
const p = await b.newPage({ viewport:{width:1600,height:900} });
await p.goto('file://' + path.join(HERE, '..', 'deck.html'));
await p.waitForTimeout(3000);
const out = await p.evaluate(() => {
  const res = [];
  document.querySelectorAll('.slide').forEach((s, i) => {
    s.classList.add('on');
    const kids = [...s.children].filter(e => !e.classList.contains('foot') && !e.classList.contains('topbar'));
    const sr = s.getBoundingClientRect();
    const cs = getComputedStyle(s);
    const padB = parseFloat(cs.paddingBottom);
    const gaps = [];
    for (let k = 0; k < kids.length - 1; k++) {
      const a = kids[k].getBoundingClientRect(), c = kids[k+1].getBoundingClientRect();
      gaps.push(Math.round(c.top - a.bottom));
    }
    const last = kids[kids.length-1].getBoundingClientRect();
    res.push({ s: i+1, gaps, folgaAbaixo: Math.round(sr.bottom - padB - last.bottom) });
    if (i !== 0) s.classList.remove('on');
  });
  return res;
});
console.log(out.map(r => `s${String(r.s).padStart(2)}  vãos=[${r.gaps.join(', ')}]  folga no rodapé=${r.folgaAbaixo}px`).join('\n'));
await b.close();
