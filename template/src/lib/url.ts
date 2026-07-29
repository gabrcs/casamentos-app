/** Prefixa um caminho absoluto (ex: "/admin") com o base path do site (import.meta.env.BASE_URL). */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path}`;
}
