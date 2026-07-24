import { Router } from 'express'
import { query } from '../db.js'
import { hashPassword, comparePassword } from '../utils/password.js'
import { signToken } from '../utils/token.js'
import { formatUser } from '../utils/user.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/roles', async (_req, res) => {
  try {
    const result = await query('SELECT id, name, code FROM roles ORDER BY id')
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ message: 'Roller alınamadı', error: error.message })
  }
})

router.post('/signup', async (req, res) => {
  const { name, email, password, role_id, store } = req.body

  if (!name || !email || !password || !role_id) {
    res.status(400).json({ message: 'name, email, password ve role_id zorunludur' })
    return
  }

  try {
    const roleResult = await query('SELECT id, code FROM roles WHERE id = $1', [role_id])
    if (!roleResult.rows.length) {
      res.status(400).json({ message: 'Geçersiz rol' })
      return
    }

    const role = roleResult.rows[0]
    if (role.code === 'store' && !store) {
      res.status(400).json({ message: 'Mağaza rolü için store bilgisi gerekli' })
      return
    }

    const existing = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()])
    if (existing.rows.length) {
      res.status(409).json({ message: 'Bu e-posta adresi zaten kayıtlı' })
      return
    }

    const passwordHash = await hashPassword(password)
    const userResult = await query(
      `INSERT INTO users (name, email, password_hash, role_id, is_active)
       VALUES ($1, $2, $3, $4, false)
       RETURNING id, name, email, role_id`,
      [name, email.toLowerCase(), passwordHash, role_id]
    )
    const user = userResult.rows[0]

    if (role.code === 'store' && store) {
      await query(
        `INSERT INTO stores (user_id, name, phone, tax_no, bank_account)
         VALUES ($1, $2, $3, $4, $5)`,
        [user.id, store.name, store.phone, store.tax_no, store.bank_account]
      )
    }

    res.status(201).json({
      message: 'Kayıt başarılı',
      user: formatUser(user),
    })
  } catch (error) {
    res.status(500).json({ message: 'Kayıt oluşturulamadı', error: error.message })
  }
})

router.post('/login', async (req, res) => {
  const { email, password, remember } = req.body

  if (!email || !password) {
    res.status(400).json({ message: 'E-posta ve şifre zorunludur' })
    return
  }

  try {
    const result = await query(
      `SELECT u.id, u.name, u.email, u.password_hash, u.role_id, u.is_active,
              r.code AS role_code, r.name AS role_name
       FROM users u
       JOIN roles r ON r.id = u.role_id
       WHERE u.email = $1`,
      [email.toLowerCase()]
    )

    if (!result.rows.length) {
      res.status(401).json({ message: 'E-posta veya şifre hatalı' })
      return
    }

    const user = result.rows[0]
    const valid = await comparePassword(password, user.password_hash)
    if (!valid) {
      res.status(401).json({ message: 'E-posta veya şifre hatalı' })
      return
    }

    if (!user.is_active) {
      res.status(403).json({ message: 'Hesabınız henüz aktif değil' })
      return
    }

    const token = signToken(user.id, { remember: Boolean(remember) })
    res.json({
      token,
      user: formatUser(user),
      remember: Boolean(remember),
      expires_in: remember ? '7d' : '2h',
    })
  } catch (error) {
    res.status(500).json({ message: 'Giriş yapılamadı', error: error.message })
  }
})

router.get('/verify', requireAuth, async (req, res) => {
  const remember = Boolean(req.auth?.remember)
  const token = signToken(req.user.id, { remember })
  res.json({
    token,
    user: formatUser(req.user),
    remember,
    expires_in: remember ? '7d' : '2h',
  })
})

export default router
