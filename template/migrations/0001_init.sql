-- Migração inicial: tabelas de RSVP e lista de presentes.

CREATE TABLE IF NOT EXISTS rsvps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  attending INTEGER NOT NULL DEFAULT 1,
  guests_count INTEGER NOT NULL DEFAULT 1,
  companions TEXT,
  dietary TEXT,
  message TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS gifts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  price_cents INTEGER NOT NULL DEFAULT 0,
  category TEXT,
  status TEXT NOT NULL DEFAULT 'available',
  reserved_by TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_gifts_status ON gifts (status);
CREATE INDEX IF NOT EXISTS idx_gifts_sort ON gifts (sort_order);
