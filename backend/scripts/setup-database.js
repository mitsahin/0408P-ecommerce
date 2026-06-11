import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'
import { query, closeDb } from '../db.js'
import { seedFromApi } from './seed-from-api.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const schemaPath = path.join(__dirname, '../sql/schema.sql')
const migratePath = path.join(__dirname, '../sql/migrate.sql')

const DEMO_USERS = [
  {
    email: 'admin@commerce.com',
    name: 'Admin User',
    roleCode: 'admin',
    store: null,
  },
  {
    email: 'store@commerce.com',
    name: 'Store Owner',
    roleCode: 'store',
    store: {
      name: 'Commerce Store',
      phone: '05551234567',
      tax_no: 'T1234V123456',
      bank_account: 'TR000000000000000000000000',
    },
  },
  {
    email: 'customer@commerce.com',
    name: 'Demo Customer',
    roleCode: 'customer',
    store: null,
  },
]

function splitSqlStatements(sql) {
  const statements = []
  const withoutComments = sql.replace(/--[^\n]*/g, '')
  const blocks = []
  let cleaned = withoutComments.replace(/DO \$\$[\s\S]*?\$\$;/g, (block) => {
    blocks.push(block.trim())
    return ''
  })

  cleaned
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .forEach((part) => statements.push(part))

  return [...statements, ...blocks]
}

async function runSqlFile(filePath) {
  const sql = fs.readFileSync(filePath, 'utf8')
  const statements = splitSqlStatements(sql)
  for (const statement of statements) {
    await query(statement)
  }
}

async function seedDemoUsers() {
  const passwordHash = await bcrypt.hash('123456', 10)

  for (const demo of DEMO_USERS) {
    const roleResult = await query(
      'SELECT id FROM roles WHERE code = $1 LIMIT 1',
      [demo.roleCode]
    )
    if (!roleResult.rows.length) continue

    const roleId = roleResult.rows[0].id
    const existing = await query('SELECT id FROM users WHERE email = $1', [
      demo.email,
    ])

    let userId
    if (existing.rows.length) {
      userId = existing.rows[0].id
      await query(
        'UPDATE users SET password_hash = $1, role_id = $2, is_active = true WHERE id = $3',
        [passwordHash, roleId, userId]
      )
    } else {
      const userResult = await query(
        `INSERT INTO users (name, email, password_hash, role_id, is_active)
         VALUES ($1, $2, $3, $4, true)
         RETURNING id`,
        [demo.name, demo.email, passwordHash, roleId]
      )
      userId = userResult.rows[0].id
    }

    if (demo.store) {
      const storeExists = await query(
        'SELECT id FROM stores WHERE user_id = $1',
        [userId]
      )
      if (!storeExists.rows.length) {
        await query(
          `INSERT INTO stores (user_id, name, phone, tax_no, bank_account)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            userId,
            demo.store.name,
            demo.store.phone,
            demo.store.tax_no,
            demo.store.bank_account,
          ]
        )
      }
    }
  }
}

export async function setupDatabase({ seedCatalog = true } = {}) {
  let initialized = false
  try {
    const check = await query('SELECT 1 FROM roles LIMIT 1')
    initialized = check.rows.length > 0
  } catch {
    initialized = false
  }

  if (!initialized) {
    await runSqlFile(schemaPath)
    await runSqlFile(migratePath)
  }

  let productCount = 0
  try {
    const countResult = await query('SELECT COUNT(*)::int AS count FROM products')
    productCount = countResult.rows[0]?.count ?? 0
  } catch {
    if (initialized) {
      await runSqlFile(migratePath)
    }
    try {
      const countResult = await query('SELECT COUNT(*)::int AS count FROM products')
      productCount = countResult.rows[0]?.count ?? 0
    } catch {
      productCount = 0
    }
  }

  if (seedCatalog && productCount === 0) {
    console.log('Katalog boş — Workintech API\'den veri yükleniyor...')
    await seedFromApi()
  }

  await seedDemoUsers()
}

export async function initDatabaseCli() {
  try {
    await setupDatabase({ seedCatalog: true })
    console.log('Veritabanı kurulumu tamamlandı.')
    console.log('Demo giriş: customer@commerce.com / 123456')
  } finally {
    await closeDb()
  }
}

const isDirectRun = process.argv[1]?.endsWith('init-db.js')

if (isDirectRun) {
  initDatabaseCli().catch((err) => {
    console.error('Veritabanı başlatma hatası:', err.message)
    process.exit(1)
  })
}
