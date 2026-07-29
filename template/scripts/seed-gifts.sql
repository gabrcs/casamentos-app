-- Seed de exemplo para a lista de presentes.
-- Substitua pelos itens reais (ou gere este arquivo a partir do Google Sheets
-- com `node scripts/sheet-to-seed.mjs lista.csv > scripts/seed-gifts.sql`).

DELETE FROM gifts;

INSERT INTO gifts (title, description, image_url, price_cents, category, sort_order) VALUES
  ('Jogo de panelas', 'Ajude a equipar nossa cozinha nova.', NULL, 45000, 'Cozinha', 1),
  ('Jantar romântico', 'Contribua para nossa primeira noite especial de casados.', NULL, 20000, 'Experiências', 2),
  ('Aspirador de pó', 'Um presente útil para o dia a dia.', NULL, 60000, 'Casa', 3),
  ('Diária de lua de mel', 'Nos ajude a curtir a viagem dos sonhos.', NULL, 80000, 'Lua de mel', 4),
  ('Cota livre', 'Contribua com qualquer valor com muito carinho.', NULL, 5000, 'Cotas', 5);
