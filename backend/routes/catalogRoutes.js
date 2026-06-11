import { Router } from 'express'
import { query } from '../db.js'
import { formatCategory, formatProduct } from '../utils/formatters.js'

const router = Router()

router.get('/categories', async (_req, res) => {
  try {
    const result = await query(
      'SELECT id, title, img, code, rating, gender FROM categories ORDER BY id'
    )
    res.json(result.rows.map(formatCategory))
  } catch (error) {
    res.status(500).json({ error: 'Kategoriler alınamadı', message: error.message })
  }
})

router.get('/products', async (req, res) => {
  try {
    const { category, filter, sort, limit = '25', offset = '0' } = req.query
    const conditions = []
    const params = []

    if (category) {
      params.push(Number(category))
      conditions.push(`p.category_id = $${params.length}`)
    }

    if (filter) {
      params.push(`%${filter}%`)
      conditions.push(
        `(p.name ILIKE $${params.length} OR p.description ILIKE $${params.length})`
      )
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

    let orderClause = 'ORDER BY p.id ASC'
    if (sort === 'price:asc') orderClause = 'ORDER BY p.price ASC'
    if (sort === 'price:desc') orderClause = 'ORDER BY p.price DESC'
    if (sort === 'rating:asc') orderClause = 'ORDER BY p.rating ASC'
    if (sort === 'rating:desc') orderClause = 'ORDER BY p.rating DESC'

    const countResult = await query(
      `SELECT COUNT(*)::int AS total FROM products p ${whereClause}`,
      params
    )
    const total = countResult.rows[0]?.total ?? 0

    params.push(Number(limit), Number(offset))
    const limitIndex = params.length - 1
    const offsetIndex = params.length

    const productsResult = await query(
      `SELECT p.id, p.name, p.description, p.price, p.category_id, p.rating,
              p.stock, p.store_id, p.sell_count, p.images
       FROM products p
       ${whereClause}
       ${orderClause}
       LIMIT $${limitIndex} OFFSET $${offsetIndex}`,
      params
    )

    res.json({
      total,
      products: productsResult.rows.map(formatProduct),
    })
  } catch (error) {
    res.status(500).json({ error: 'Ürünler alınamadı', message: error.message })
  }
})

router.get('/products/:id', async (req, res) => {
  try {
    const result = await query(
      `SELECT id, name, description, price, category_id, rating, stock,
              store_id, sell_count, images
       FROM products WHERE id = $1`,
      [req.params.id]
    )

    if (!result.rows.length) {
      res.status(404).json({ error: 'Ürün bulunamadı' })
      return
    }

    res.json(formatProduct(result.rows[0]))
  } catch (error) {
    res.status(500).json({ error: 'Ürün alınamadı', message: error.message })
  }
})

export default router
