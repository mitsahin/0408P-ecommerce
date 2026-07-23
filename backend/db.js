import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')

dotenv.config({ path: path.join(rootDir, '.env') })

const dataDir = path.join(rootDir, 'data', 'pgdata')

let pool = null
let pglite = null
let dbMode = null
let initPromise = null

async function createClient() {
  const onRender = Boolean(process.env.RENDER || process.env.RENDER_EXTERNAL_URL)

  if (process.env.DATABASE_URL) {
    const pg = await import('pg')
    const poolConfig = {
      connectionString: process.env.DATABASE_URL,
      options: '-c client_encoding=UTF8',
    }
    if (/render\.com|sslmode=require/i.test(process.env.DATABASE_URL)) {
      poolConfig.ssl = { rejectUnauthorized: false }
    }
    pool = new pg.default.Pool(poolConfig)
    pool.on('error', (err) => {
      console.error('PostgreSQL pool hatası:', err.message)
    })
    dbMode = 'postgres'
    return
  }

  if (onRender) {
    throw new Error(
      'DATABASE_URL gerekli (Render). Blueprint ile ecommerce-db bağlandığından emin olun.'
    )
  }

  const { PGlite } = await import('@electric-sql/pglite')
  fs.mkdirSync(dataDir, { recursive: true })
  pglite = new PGlite(dataDir)
  dbMode = 'pglite'
}

export async function ensureDb() {
  if (!initPromise) {
    initPromise = createClient()
  }
  await initPromise
  return dbMode
}

export async function query(text, params) {
  await ensureDb()
  if (pool) return pool.query(text, params)
  return pglite.query(text, params)
}

export async function testConnection() {
  const result = await query('SELECT NOW() AS connected_at')
  return result.rows[0]
}

export function getDbMode() {
  return dbMode
}

export async function closeDb() {
  if (pool) {
    await pool.end()
    pool = null
  }
  if (pglite) {
    await pglite.close()
    pglite = null
  }
  initPromise = null
  dbMode = null
}

export default { query, testConnection, closeDb, ensureDb, getDbMode }
