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
    s.querySelectorAll('*').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.height === 0 || r.width === 0) return;
      if (r.bottom > sr.bottom + 2) bad.push(`${el.className || el.tagName} bleeds ${Math.round(r.bottom - sr.bottom)}px below`);
      if (r.right > sr.right + 2) bad.push(`${el.className || el.tagName} bleeds ${Math.round(r.right - sr.right)}px right`);
    });
    return { sec: s.dataset.sec, bad: [...new Set(bad)].slice(0, 6) };
  }, i);
  if (info.bad.length) problems.push(`slide ${i + 1} (${info.sec}): ${info.bad.join('; ')}`);
  await stage.screenshot({ path: `${OUT}/s${String(i + 1).padStart(2, '0')}.png` });
}
console.log(problems.length ? 'PROBLEMS:\n' + problems.join('\n') : 'no overflow detected');
await b.close();
