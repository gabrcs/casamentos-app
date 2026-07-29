import type { APIRoute } from 'astro';
import { getDb } from '../../db/client';
import { rsvps, type RsvpStatus } from '../../db/schema';
import { withBase } from '../../lib/url';

export const prerender = false;

const STATUSES: RsvpStatus[] = ['yes', 'maybe', 'no'];

export const POST: APIRoute = async (context) => {
  const form = await context.request.formData();

  const inviteCode = String(form.get('invite_code') ?? '').trim();
  if (!inviteCode) {
    return redirectBack(context, 'erro=codigo');
  }

  const name = String(form.get('name') ?? '').trim();
  if (!name) {
    return redirectBack(context, 'erro=nome');
  }

  const statusRaw = String(form.get('status') ?? 'yes');
  const status = STATUSES.includes(statusRaw as RsvpStatus)
    ? (statusRaw as RsvpStatus)
    : 'yes';

  const messageRaw = String(form.get('message') ?? '').trim();
  const message = messageRaw === '' ? null : messageRaw;

  try {
    const db = getDb(context);
    await db.insert(rsvps).values({ inviteCode, name, status, message });
  } catch (err) {
    console.error('Erro ao salvar RSVP', err);
    return redirectBack(context, 'erro=servidor');
  }

  return context.redirect(withBase('/obrigado'), 303);
};

function redirectBack(context: Parameters<APIRoute>[0], query: string) {
  return context.redirect(`${withBase('/')}?${query}#confirmar`, 303);
}
