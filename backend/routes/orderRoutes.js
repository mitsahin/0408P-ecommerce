import { Router } from 'express'
import { query } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', requireAuth, async (req, res) => {
  try {
    const ordersResult = await query(
      `SELECT id, address_id, order_date, price
       FROM orders WHERE user_id = $1 ORDER BY id DESC`,
      [req.user.id]
    )

    const orders = []
    for (const order of ordersResult.rows) {
      const itemsResult = await query(
        `SELECT product_id, count, detail FROM order_items WHERE order_id = $1 ORDER BY id`,
        [order.id]
      )
      orders.push({
        ...order,
        products: itemsResult.rows,
      })
    }

    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Siparişler alınamadı', error: error.message })
  }
})

router.post('/', requireAuth, async (req, res) => {
  const {
    address_id,
    order_date,
    card_no,
    card_name,
    card_expire_month,
    card_expire_year,
    card_ccv,
    price,
    products = [],
  } = req.body

  if (!address_id || !products.length) {
    res.status(400).json({ message: 'address_id ve products zorunludur' })
    return
  }

  try {
    const addressCheck = await query(
      'SELECT id FROM user_addresses WHERE id = $1 AND user_id = $2',
      [address_id, req.user.id]
    )
    if (!addressCheck.rows.length) {
      res.status(400).json({ message: 'Geçersiz adres' })
      return
    }

    const orderResult = await query(
      `INSERT INTO orders (
         user_id, address_id, order_date, price,
         card_no, card_name, card_expire_month, card_expire_year, card_ccv
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, address_id, order_date, price`,
      [
        req.user.id,
        address_id,
        order_date || new Date().toISOString(),
        price,
        String(card_no ?? ''),
        card_name,
        card_expire_month,
        card_expire_year,
        card_ccv,
      ]
    )

    const order = orderResult.rows[0]
    const orderProducts = []

    for (const item of products) {
      const itemResult = await query(
        `INSERT INTO order_items (order_id, product_id, count, detail)
         VALUES ($1, $2, $3, $4)
         RETURNING product_id, count, detail`,
        [order.id, item.product_id, item.count, item.detail ?? '']
      )
      orderProducts.push(itemResult.rows[0])
    }

    res.status(201).json({
      ...order,
      products: orderProducts,
    })
  } catch (error) {
    res.status(500).json({ message: 'Sipariş oluşturulamadı', error: error.message })
  }
})

export default router
