import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'
const JWT_EXPIRES_REMEMBER = process.env.JWT_EXPIRES_IN || '7d'
const JWT_EXPIRES_SESSION = process.env.JWT_EXPIRES_SESSION || '2h'

export function signToken(userId, { remember = false } = {}) {
  return jwt.sign(
    {
      sub: userId,
      remember: Boolean(remember),
    },
    JWT_SECRET,
    {
      expiresIn: remember ? JWT_EXPIRES_REMEMBER : JWT_EXPIRES_SESSION,
    }
  )
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET)
}
