import type { APIRoute } from 'astro';
import { getDb } from '../../../db/client';
import { rsvps } from '../../../db/schema';
import { isAdmin } from '../../../lib/auth';
import { desc } from 'drizzle-orm';

export const prerender = false;

function csvField(value: unknown): string {
  const s = value === null || value === undefined ? '' : String(value);
  return `"${s.replace(/"/g, '""')}"`;
}

export const GET: APIRoute = async (context) => {
  if (!(await isAdmin(context))) {
    return new Response('Forbidden', { status: 403 });
  }

  const db = getDb(context);
  const rows = await db.select().from(rsvps).orderBy(desc(rsvps.createdAt));

  const statusLabel: Record<string, string> = {
    yes: 'Sim',
    maybe: 'Talvez',
    no: 'Nao',
  };

  const header = ['Codigo do convite', 'Nome', 'Confirmacao', 'Mensagem', 'Data'];
  const lines = rows.map((r) =>
    [r.inviteCode, r.name, statusLabel[r.status] ?? r.status, r.message, r.createdAt]
      .map(csvField)
      .join(',')
  );

  const csv = '﻿' + [header.map(csvField).join(','), ...lines].join('\r\n');

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="confirmacoes.csv"',
    },
  });
};
