import { verifyToken } from '../utils/token.js'
import { query } from '../db.js'

export async function requireAuth(req, res, next) {
  const raw = req.headers.authorization
  const token = String(raw ?? '')
    .replace(/^Bearer\s+/i, '')
    .trim()

  if (!token) {
    res.status(401).json({ message: 'Yetkilendirme gerekli' })
    return
  }

  try {
    const payload = verifyToken(token)
    const result = await query(
      `SELECT u.id, u.name, u.email, u.role_id, u.is_active, r.code AS role_code, r.name AS role_name
       FROM users u
       JOIN roles r ON r.id = u.role_id
       WHERE u.id = $1`,
      [payload.sub]
    )

    if (!result.rows.length) {
      res.status(401).json({ message: 'Kullanıcı bulunamadı' })
      return
    }

    const user = result.rows[0]
    if (!user.is_active) {
      res.status(403).json({ message: 'Hesabınız henüz aktif değil' })
      return
    }

    req.user = user
    next()
  } catch {
    res.status(401).json({ message: 'Geçersiz veya süresi dolmuş token' })
  }
}
