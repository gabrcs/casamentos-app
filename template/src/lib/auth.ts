import type { APIContext } from 'astro';

/** Lista de e-mails autorizados a acessar o /admin (config via env ADMIN_EMAILS). */
function getAllowedEmails(context: APIContext | { locals: App.Locals }): string[] {
  const raw = context.locals.runtime?.env?.ADMIN_EMAILS ?? '';
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Retorna true se o usuário logado (Clerk) faz parte da allowlist do casal.
 * Requer que o clerkMiddleware já tenha populado `locals.auth()`.
 */
export async function isAdmin(
  context: APIContext | { locals: App.Locals }
): Promise<boolean> {
  const auth = (context.locals as App.Locals).auth?.();
  if (!auth?.userId) return false;

  const allowed = getAllowedEmails(context);
  // Se nenhuma allowlist for configurada, qualquer usuário autenticado é admin.
  if (allowed.length === 0) return true;

  const user = await (context.locals as App.Locals).currentUser?.();
  const emails =
    user?.emailAddresses?.map((e: { emailAddress: string }) =>
      e.emailAddress.toLowerCase()
    ) ?? [];
  return emails.some((email) => allowed.includes(email));
}
