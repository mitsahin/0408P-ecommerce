import express from 'express'
import fetch from 'node-fetch'
import cors from 'cors'
import dotenv from 'dotenv'
import { testConnection, getDbMode, ensureDb } from './db.js'
import { setupDatabase } from './scripts/setup-database.js'
import authRoutes from './routes/authRoutes.js'
import catalogRoutes from './routes/catalogRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/health', async (_req, res) => {
  try {
    const db = await testConnection()
    res.json({
      status: 'ok',
      database: getDbMode() ?? 'connected',
      connected_at: db.connected_at,
    })
  } catch (error) {
    res.status(503).json({ status: 'error', database: 'disconnected', message: error.message })
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

async function startServer() {
  try {
    await ensureDb()
    await setupDatabase({ seedCatalog: true })
  } catch (error) {
    console.error('Veritabanı kurulumu başarısız:', error.message)
    process.exit(1)
  }

  app.listen(PORT, async () => {
    console.log(`Server çalışıyor: http://localhost:${PORT}`)
    try {
      const db = await testConnection()
      const mode = getDbMode()
      console.log(`Veritabanı OK (${mode}) — ${db.connected_at}`)
      console.log('Demo giriş: customer@commerce.com / 123456')
    } catch (error) {
      console.warn('Veritabanı bağlantı uyarısı:', error.message)
    }
  })
}

startServer()
