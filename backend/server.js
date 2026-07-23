import express from 'express'
import fetch from 'node-fetch'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { testConnection, getDbMode, ensureDb } from './db.js'
import { setupDatabase } from './scripts/setup-database.js'
import authRoutes from './routes/authRoutes.js'
import catalogRoutes from './routes/catalogRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../.env') })

const app = express()
const PORT = process.env.PORT || 3000

let dbReady = false
let catalogReady = false
let bootError = null

app.use(cors())
app.use(express.json())

app.get('/', (_req, res) => {
  res.json({
    name: '0408p-ecommerce-api',
    status: 'ok',
    health: '/health',
    docs: 'Use /categories, /products, /login, /order',
  })
})

app.get('/health', async (_req, res) => {
  // Return 200 while booting so Render health checks pass during schema/seed.
  if (!dbReady) {
    return res.status(200).json({
      status: bootError ? 'degraded' : 'starting',
      database: getDbMode() ?? 'pending',
      catalog: catalogReady ? 'ready' : 'pending',
      message: bootError || undefined,
    })
  }

  try {
    const db = await testConnection()
    res.json({
      status: 'ok',
      database: getDbMode() ?? 'connected',
      catalog: catalogReady ? 'ready' : 'seeding',
      connected_at: db.connected_at,
    })
  } catch (error) {
    res.status(503).json({
      status: 'error',
      database: 'disconnected',
      message: error.message,
    })
  }
})

app.use(authRoutes)
app.use(catalogRoutes)
app.use('/user', userRoutes)
app.use('/order', orderRoutes)

app.post('/chat', async (req, res) => {
  const { message } = req.body

  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama2',
        prompt: `Müşteri sorusu: "${message}". Lütfen kibar ve yardımcı bir şekilde cevap ver.`,
      }),
    })

    const data = await response.json()
    res.json({ reply: data.response })
  } catch (_error) {
    res.status(500).json({ error: 'Chatbot yanıt veremedi' })
  }
})

async function initializeDatabase() {
  try {
    await ensureDb()
    // Schema + demo users first (fast) so /health and auth work quickly.
    await setupDatabase({ seedCatalog: false })
    dbReady = true
    const db = await testConnection()
    const mode = getDbMode()
    console.log(`Veritabanı OK (${mode}) — ${db.connected_at}`)
    console.log('Demo giriş: customer@commerce.com / 123456')

    // Full catalog seed in background (can take several minutes on first boot).
    setupDatabase({ seedCatalog: true })
      .then(() => {
        catalogReady = true
        console.log('Katalog seed tamamlandı.')
      })
      .catch((error) => {
        console.error('Katalog seed başarısız:', error.message)
      })
  } catch (error) {
    bootError = error.message
    console.error('Veritabanı kurulumu başarısız:', error.message)
  }
}

function startServer() {
  app.listen(PORT, () => {
    console.log(`Server çalışıyor: http://localhost:${PORT}`)
    initializeDatabase()
  })
}

startServer()
