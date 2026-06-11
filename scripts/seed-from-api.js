import fetch from 'node-fetch'
import { query, closeDb } from '../db.js'

const API_BASE = process.env.SEED_API_URL || 'https://workintech-fe-ecommerce.onrender.com'
const PAGE_SIZE = 25

async function fetchJson(path) {
  const response = await fetch(`${API_BASE}${path}`)
  if (!response.ok) {
    throw new Error(`${path} isteği başarısız: ${response.status}`)
  }
  return response.json()
}

async function fetchAllProducts() {
  const firstPage = await fetchJson(`/products?limit=${PAGE_SIZE}&offset=0`)
  const total = firstPage.total ?? firstPage.products?.length ?? 0
  const products = [...(firstPage.products ?? [])]

  for (let offset = PAGE_SIZE; offset < total; offset += PAGE_SIZE) {
    const page = await fetchJson(`/products?limit=${PAGE_SIZE}&offset=${offset}`)
    products.push(...(page.products ?? []))
    process.stdout.write(`\rÜrünler indiriliyor: ${Math.min(offset + PAGE_SIZE, total)}/${total}`)
  }

  if (total > 0) process.stdout.write('\n')
  return products
}

export async function seedFromApi() {
  console.log(`Workintech API'den veri çekiliyor: ${API_BASE}`)

  const categories = await fetchJson('/categories')
  const products = await fetchAllProducts()

  await query('TRUNCATE order_items, products, categories RESTART IDENTITY CASCADE')

  for (const category of categories) {
    await query(
      `INSERT INTO categories (id, title, img, code, rating, gender)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        category.id,
        category.title,
        category.img ?? '',
        category.code ?? '',
        category.rating ?? 0,
        category.gender ?? '',
      ]
    )
  }

  await query(
    `SELECT setval(
      pg_get_serial_sequence('categories', 'id'),
      GREATEST((SELECT COALESCE(MAX(id), 1) FROM categories), 1)
    )`
  )

  for (const product of products) {
    await query(
      `INSERT INTO products (
         id, name, description, price, category_id, rating, stock, store_id, sell_count, images
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb)`,
      [
        product.id,
        product.name,
        product.description ?? '',
        product.price ?? 0,
        product.category_id ?? null,
        product.rating ?? 0,
        product.stock ?? 0,
        product.store_id ?? null,
        product.sell_count ?? 0,
        JSON.stringify(product.images ?? []),
      ]
    )
  }

  await query(
    `SELECT setval(
      pg_get_serial_sequence('products', 'id'),
      GREATEST((SELECT COALESCE(MAX(id), 1) FROM products), 1)
    )`
  )

  console.log(`${categories.length} kategori, ${products.length} ürün yüklendi.`)
}

const isDirectRun = process.argv[1]?.endsWith('seed-from-api.js')

if (isDirectRun) {
  seedFromApi()
    .then(async () => {
      await closeDb()
      console.log('Seed tamamlandı.')
    })
    .catch(async (err) => {
      console.error('Seed hatası:', err.message)
      await closeDb()
      process.exit(1)
    })
}
