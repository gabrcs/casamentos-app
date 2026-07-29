-- RSVP simplificado: código do convite, nome e confirmação (yes/maybe/no).
DROP TABLE IF EXISTS rsvps;

CREATE TABLE rsvps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invite_code TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'yes',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
