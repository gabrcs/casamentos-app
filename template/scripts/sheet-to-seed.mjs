#!/usr/bin/env node
/**
 * Converte um CSV exportado do Google Sheets em um seed SQL para o D1.
 *
 * Uso:
 *   1. No Sheets: Arquivo > Fazer download > CSV.
 *   2. node scripts/sheet-to-seed.mjs lista.csv > scripts/seed-gifts.sql
 *   3. npm run db:seed:local  (ou db:seed:remote)
 *
 * Colunas esperadas (cabeçalho, em qualquer ordem, acentos/maiúsc. ignorados):
 *   titulo | descricao | valor | imagem | categoria | ordem
 * "valor" aceita "150", "150,00" ou "R$ 1.500,00".
 */
import { readFileSync } from 'node:fs';

const file = process.argv[2];
if (!file) {
  console.error('Uso: node scripts/sheet-to-seed.mjs <arquivo.csv>');
  process.exit(1);
}

/** Parser de CSV simples com suporte a aspas e vírgulas internas. */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\r') { /* ignora */ }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim() !== ''));
}

const norm = (s) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();

const toCents = (s) => {
  const cleaned = String(s)
    .replace(/[^\d,.-]/g, '')
    .replace(/\.(?=\d{3}(\D|$))/g, '')
    .replace(',', '.');
  const n = Number.parseFloat(cleaned);
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
};

const sql = (v) => (v == null || v === '' ? 'NULL' : `'${String(v).replace(/'/g, "''")}'`);

const rows = parseCsv(readFileSync(file, 'utf8'));
if (rows.length < 2) { console.error('CSV sem dados.'); process.exit(1); }

const header = rows[0].map(norm);
const col = (names) => header.findIndex((h) => names.includes(h));
const iTitle = col(['titulo', 'title', 'nome', 'presente']);
const iDesc = col(['descricao', 'description', 'desc']);
const iPrice = col(['valor', 'preco', 'price', 'valor (r$)']);
const iImg = col(['imagem', 'image', 'foto', 'url', 'image_url']);
const iCat = col(['categoria', 'category', 'tipo']);
const iOrder = col(['ordem', 'order', 'sort']);

if (iTitle < 0) { console.error('Coluna de título não encontrada.'); process.exit(1); }

const values = rows.slice(1).map((r, idx) => {
  const title = (r[iTitle] ?? '').trim();
  const desc = iDesc >= 0 ? (r[iDesc] ?? '').trim() : '';
  const cents = iPrice >= 0 ? toCents(r[iPrice]) : 0;
  const img = iImg >= 0 ? (r[iImg] ?? '').trim() : '';
  const cat = iCat >= 0 ? (r[iCat] ?? '').trim() : '';
  const order = iOrder >= 0 ? Number.parseInt(r[iOrder], 10) || idx + 1 : idx + 1;
  return `  (${sql(title)}, ${sql(desc)}, ${sql(img)}, ${cents}, ${sql(cat)}, ${order})`;
}).filter((_, i) => (rows[i + 1][iTitle] ?? '').trim() !== '');

console.log('DELETE FROM gifts;');
console.log('INSERT INTO gifts (title, description, image_url, price_cents, category, sort_order) VALUES');
console.log(values.join(',\n') + ';');
