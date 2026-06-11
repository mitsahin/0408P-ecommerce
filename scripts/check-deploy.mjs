const FRONTEND = 'https://0408p-ecommerce.vercel.app'
const OWN_API = 'https://0408p-ecommerce-api.onrender.com'
const FALLBACK_API = 'https://workintech-fe-ecommerce.onrender.com'

async function check(name, url, options = {}) {
  try {
    const res = await fetch(url, options)
    const ok = res.ok || options.acceptStatus?.includes(res.status)
    console.log(`${ok ? '✓' : '✗'} ${name}: ${res.status} ${url}`)
    if (ok && options.parse) {
      const data = await res.json()
      console.log(`  → ${options.parse(data)}`)
    }
    return ok
  } catch (error) {
    console.log(`✗ ${name}: ${error.message}`)
    return false
  }
}

console.log('Deploy durumu kontrol ediliyor...\n')

const frontendOk = await check('Vercel frontend', FRONTEND)
const ownApiOk = await check('Kendi Render API', `${OWN_API}/health`, {
  parse: (d) => `database=${d.database ?? 'unknown'}`,
})
const fallbackOk = await check('Workintech API (fallback)', `${FALLBACK_API}/categories`, {
  parse: (d) => `${d.length} kategori`,
})
await check('Login (fallback API)', `${FALLBACK_API}/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'customer@commerce.com', password: '123456' }),
  acceptStatus: [200],
  parse: (d) => d.email,
})

console.log('\nÖzet:')
console.log(`  Frontend: ${frontendOk ? 'CANLI' : 'KAPALI'}`)
console.log(`  Kendi API: ${ownApiOk ? 'CANLI' : 'HENÜZ KURULMADI'}`)
console.log(`  Fallback API: ${fallbackOk ? 'CANLI' : 'KAPALI'}`)

if (!ownApiOk) {
  console.log('\nRender backend kurmak için:')
  console.log('  https://render.com/deploy?repo=https://github.com/mitsahin/0408P-ecommerce')
}

process.exit(frontendOk && (ownApiOk || fallbackOk) ? 0 : 1)
