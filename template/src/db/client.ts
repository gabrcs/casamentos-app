import { drizzle } from 'drizzle-orm/d1';
import type { APIContext } from 'astro';
import * as schema from './schema';

/**
 * Retorna um cliente Drizzle ligado ao banco D1 disponível no runtime do
 * Cloudflare. Use dentro de páginas/endpoints Astro passando `Astro`/`context`.
 */
export function getDb(context: APIContext | { locals: App.Locals }) {
  const db = context.locals.runtime?.env?.DB;
  if (!db) {
    throw new Error(
      'Binding D1 "DB" não encontrado. Verifique o wrangler.toml e o platformProxy.'
    );
  }
  return drizzle(db, { schema });
}

export { schema };
