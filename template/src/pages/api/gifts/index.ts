import type { APIRoute } from 'astro';
import { getDb } from '../../../db/client';
import { gifts, type GiftStatus } from '../../../db/schema';
import { isAdmin } from '../../../lib/auth';
import { withBase } from '../../../lib/url';
import { eq, sql } from 'drizzle-orm';

export const prerender = false;

const VALID_STATUS: GiftStatus[] = ['available', 'reserved', 'purchased'];

function parsePriceToCents(value: string): number {
  const normalized = value.replace(/[^\d,.-]/g, '').replace(/\.(?=\d{3}(\D|$))/g, '').replace(',', '.');
  const num = Number.parseFloat(normalized);
  return Number.isFinite(num) ? Math.round(num * 100) : 0;
}

function str(form: FormData, key: string): string {
  return String(form.get(key) ?? '').trim();
}

/** Formulários do admin postam aqui com _action = create | update | delete. */
export const POST: APIRoute = async (context) => {
  if (!(await isAdmin(context))) {
    return new Response('Forbidden', { status: 403 });
  }

  const form = await context.request.formData();
  const action = str(form, '_action');
  const db = getDb(context);

  try {
    if (action === 'create') {
      const title = str(form, 'title');
      if (!title) return context.redirect(`${withBase('/admin/presentes')}?erro=titulo`, 303);
      await db.insert(gifts).values({
        title,
        description: str(form, 'description') || null,
        imageUrl: str(form, 'image_url') || null,
        priceCents: parsePriceToCents(str(form, 'price')),
        category: str(form, 'category') || null,
        sortOrder: Number.parseInt(str(form, 'sort_order') || '0', 10) || 0,
      });
    } else if (action === 'update') {
      const id = Number.parseInt(str(form, 'id'), 10);
      if (!id) return context.redirect(`${withBase('/admin/presentes')}?erro=id`, 303);
      const status = str(form, 'status') as GiftStatus;
      await db
        .update(gifts)
        .set({
          title: str(form, 'title'),
          description: str(form, 'description') || null,
          imageUrl: str(form, 'image_url') || null,
          priceCents: parsePriceToCents(str(form, 'price')),
          category: str(form, 'category') || null,
          status: VALID_STATUS.includes(status) ? status : 'available',
          reservedBy: str(form, 'reserved_by') || null,
          sortOrder: Number.parseInt(str(form, 'sort_order') || '0', 10) || 0,
          updatedAt: sql`(datetime('now'))`,
        })
        .where(eq(gifts.id, id));
    } else if (action === 'status') {
      // Atalho para mudar apenas o status a partir da tabela.
      const id = Number.parseInt(str(form, 'id'), 10);
      const status = str(form, 'status') as GiftStatus;
      if (id && VALID_STATUS.includes(status)) {
        await db
          .update(gifts)
          .set({ status, updatedAt: sql`(datetime('now'))` })
          .where(eq(gifts.id, id));
      }
    } else if (action === 'delete') {
      const id = Number.parseInt(str(form, 'id'), 10);
      if (id) await db.delete(gifts).where(eq(gifts.id, id));
    }
  } catch (err) {
    console.error('Erro ao gerenciar presente', err);
    return context.redirect(`${withBase('/admin/presentes')}?erro=servidor`, 303);
  }

  return context.redirect(`${withBase('/admin/presentes')}?ok=1`, 303);
};
