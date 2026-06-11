import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(__dirname, 'data', 'pgdata')

let pool = null
let pglite = null
let dbMode = null
let initPromise = null

async function createClient() {
  if (process.env.DATABASE_URL) {
    const pg = await import('pg')
    pool = new pg.default.Pool({
      connectionString: process.env.DATABASE_URL,
      options: '-c client_encoding=UTF8',
    })
    pool.on('error', (err) => {
      console.error('PostgreSQL pool hatası:', err.message)
    })
    dbMode = 'postgres'
    return
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
