import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export type RsvpStatus = 'yes' | 'maybe' | 'no';

/** Confirmações de presença (RSVP) enviadas pelos convidados. */
export const rsvps = sqliteTable('rsvps', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  inviteCode: text('invite_code').notNull(),
  name: text('name').notNull(),
  status: text('status').$type<RsvpStatus>().notNull().default('yes'),
  message: text('message'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
});

export type GiftStatus = 'available' | 'reserved' | 'purchased';

/** Itens da lista de presentes, pagos via Pix copia e cola. */
export const gifts = sqliteTable('gifts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  // Valor em centavos para evitar erros de ponto flutuante.
  priceCents: integer('price_cents').notNull().default(0),
  category: text('category'),
  status: text('status').$type<GiftStatus>().notNull().default('available'),
  reservedBy: text('reserved_by'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`(datetime('now'))`),
});

export type Rsvp = typeof rsvps.$inferSelect;
export type NewRsvp = typeof rsvps.$inferInsert;
export type Gift = typeof gifts.$inferSelect;
export type NewGift = typeof gifts.$inferInsert;
