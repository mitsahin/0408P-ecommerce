import { Router } from 'express'
import { query } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/address', requireAuth, async (req, res) => {
  try {
    const result = await query(
      `SELECT id, title, name, surname, phone, city, district, neighborhood
       FROM user_addresses WHERE user_id = $1 ORDER BY id`,
      [req.user.id]
    )
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ message: 'Adresler alınamadı', error: error.message })
  }
})

router.post('/address', requireAuth, async (req, res) => {
  const { title, name, surname, phone, city, district, neighborhood } = req.body

  try {
    const result = await query(
      `INSERT INTO user_addresses (user_id, title, name, surname, phone, city, district, neighborhood)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, title, name, surname, phone, city, district, neighborhood`,
      [req.user.id, title, name, surname, phone, city, district, neighborhood]
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ message: 'Adres kaydedilemedi', error: error.message })
  }
})

router.put('/address', requireAuth, async (req, res) => {
  const { id, title, name, surname, phone, city, district, neighborhood } = req.body

  if (!id) {
    res.status(400).json({ message: 'Adres id zorunludur' })
    return
  }

  try {
    const result = await query(
      `UPDATE user_addresses
       SET title = $1, name = $2, surname = $3, phone = $4, city = $5, district = $6, neighborhood = $7
       WHERE id = $8 AND user_id = $9
       RETURNING id, title, name, surname, phone, city, district, neighborhood`,
      [title, name, surname, phone, city, district, neighborhood, id, req.user.id]
    )

    if (!result.rows.length) {
      res.status(404).json({ message: 'Adres bulunamadı' })
      return
    }

    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ message: 'Adres güncellenemedi', error: error.message })
  }
})

router.delete('/address/:id', requireAuth, async (req, res) => {
  try {
    const result = await query(
      'DELETE FROM user_addresses WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    )

    if (!result.rows.length) {
      res.status(404).json({ message: 'Adres bulunamadı' })
      return
    }

    res.json({ message: 'Adres silindi' })
  } catch (error) {
    res.status(500).json({ message: 'Adres silinemedi', error: error.message })
  }
})

router.get('/card', requireAuth, async (req, res) => {
  try {
    const result = await query(
      `SELECT id, card_no, expire_month, expire_year, name_on_card
       FROM user_cards WHERE user_id = $1 ORDER BY id`,
      [req.user.id]
    )
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ message: 'Kartlar alınamadı', error: error.message })
  }
})

router.post('/card', requireAuth, async (req, res) => {
  const { card_no, expire_month, expire_year, name_on_card } = req.body

  try {
    const result = await query(
      `INSERT INTO user_cards (user_id, card_no, expire_month, expire_year, name_on_card)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, card_no, expire_month, expire_year, name_on_card`,
      [req.user.id, card_no, expire_month, expire_year, name_on_card]
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ message: 'Kart kaydedilemedi', error: error.message })
  }
})

router.put('/card', requireAuth, async (req, res) => {
  const { id, card_no, expire_month, expire_year, name_on_card } = req.body

  if (!id) {
    res.status(400).json({ message: 'Kart id zorunludur' })
    return
  }

  try {
    const result = await query(
      `UPDATE user_cards
       SET card_no = $1, expire_month = $2, expire_year = $3, name_on_card = $4
       WHERE id = $5 AND user_id = $6
       RETURNING id, card_no, expire_month, expire_year, name_on_card`,
      [card_no, expire_month, expire_year, name_on_card, id, req.user.id]
    )

    if (!result.rows.length) {
      res.status(404).json({ message: 'Kart bulunamadı' })
      return
    }

    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ message: 'Kart güncellenemedi', error: error.message })
  }
})

router.delete('/card/:id', requireAuth, async (req, res) => {
  try {
    const result = await query(
      'DELETE FROM user_cards WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    )

    if (!result.rows.length) {
      res.status(404).json({ message: 'Kart bulunamadı' })
      return
    }

    res.json({ message: 'Kart silindi' })
  } catch (error) {
    res.status(500).json({ message: 'Kart silinemedi', error: error.message })
  }
})

export default router
