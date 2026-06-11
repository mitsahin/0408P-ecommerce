-- Mevcut veritabanlarını Workintech uyumlu şemaya taşır
ALTER TABLE categories ADD COLUMN IF NOT EXISTS code VARCHAR(50);
ALTER TABLE categories ADD COLUMN IF NOT EXISTS rating NUMERIC(4, 2) DEFAULT 0;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS gender VARCHAR(10);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'title'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'name'
  ) THEN
    ALTER TABLE products RENAME COLUMN title TO name;
  END IF;
END $$;

ALTER TABLE products ADD COLUMN IF NOT EXISTS store_id INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS sell_count INTEGER DEFAULT 0;
