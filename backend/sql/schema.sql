-- Katalog tabloları
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  img VARCHAR(500),
  code VARCHAR(50),
  rating NUMERIC(4, 2) DEFAULT 0,
  gender VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  rating NUMERIC(5, 2) DEFAULT 0,
  stock INTEGER DEFAULT 0,
  store_id INTEGER,
  sell_count INTEGER DEFAULT 0,
  images JSONB DEFAULT '[]'::jsonb
);

-- Auth & kullanıcı tabloları
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role_id INTEGER REFERENCES roles(id) ON DELETE RESTRICT,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stores (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  tax_no VARCHAR(50),
  bank_account VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS user_addresses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  name VARCHAR(100),
  surname VARCHAR(100),
  phone VARCHAR(20),
  city VARCHAR(100),
  district VARCHAR(100),
  neighborhood TEXT
);

CREATE TABLE IF NOT EXISTS user_cards (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  card_no VARCHAR(20) NOT NULL,
  expire_month INTEGER,
  expire_year INTEGER,
  name_on_card VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  address_id INTEGER REFERENCES user_addresses(id) ON DELETE SET NULL,
  order_date TIMESTAMPTZ DEFAULT NOW(),
  price NUMERIC(10, 2),
  card_no VARCHAR(20),
  card_name VARCHAR(255),
  card_expire_month INTEGER,
  card_expire_year INTEGER,
  card_ccv INTEGER
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  count INTEGER DEFAULT 1,
  detail TEXT
);

-- Workintech ile aynı rol sırası: admin=1, store=2, customer=3
-- Workintech ile aynı rol sırası: admin=1, store=2, customer=3
INSERT INTO roles (id, name, code)
SELECT v.id, v.name, v.code
FROM (VALUES
  (1, 'Yönetici', 'admin'),
  (2, 'Mağaza', 'store'),
  (3, 'Müşteri', 'customer')
) AS v(id, name, code)
WHERE NOT EXISTS (SELECT 1 FROM roles r WHERE r.code = v.code);

SELECT setval(
  pg_get_serial_sequence('roles', 'id'),
  GREATEST((SELECT COALESCE(MAX(id), 1) FROM roles), 1)
);
