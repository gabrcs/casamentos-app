import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server';
import { defineMiddleware } from 'astro:middleware';
import { withBase } from './lib/url';

// Rotas que exigem login (bloqueadas se não autenticado).
const isProtectedRoute = createRouteMatcher([
  withBase('/admin(.*)'),
  withBase('/api/gifts(.*)'),
  withBase('/api/rsvps(.*)'),
]);

// Rotas que precisam do contexto do Clerk (protegidas + tela de login).
// Todo o resto do site (home, presentes, RSVP...) é público e NÃO passa pelo
// Clerk — assim o site continua acessível mesmo se as chaves do Clerk falharem.
const needsClerk = createRouteMatcher([
  withBase('/admin(.*)'),
  withBase('/entrar(.*)'),
  withBase('/api/gifts(.*)'),
  withBase('/api/rsvps(.*)'),
]);

const apiPrefix = withBase('/api/');

const clerk = clerkMiddleware((auth, context) => {
  if (isProtectedRoute(context.request)) {
    const { userId, redirectToSignIn } = auth();
    if (!userId) {
      // Endpoints de API respondem 401; páginas redirecionam ao login.
      if (context.url.pathname.startsWith(apiPrefix)) {
        return new Response('Unauthorized', { status: 401 });
      }
      return redirectToSignIn();
    }
  }
});

export const onRequest = defineMiddleware((context, next) => {
  if (needsClerk(context.request)) {
    return clerk(context, next);
  }
  // Rotas públicas: nem inicializa o Clerk.
  return next();
});
