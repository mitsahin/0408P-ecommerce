/**
 * One-shot: seed demo address + card on the live API for customer@commerce.com
 * Usage: node scripts/seed-demo-profile.mjs
 */
const API = process.env.SEED_TARGET_API || 'https://zero408p-ecommerce-api.onrender.com'

async function main() {
  const loginRes = await fetch(`${API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'customer@commerce.com',
      password: '123456',
    }),
  })
  if (!loginRes.ok) {
    throw new Error(`Login failed: ${loginRes.status}`)
  }
  const { token } = await loginRes.json()
  const auth = { Authorization: token, 'Content-Type': 'application/json' }

  const [addresses, cards] = await Promise.all([
    fetch(`${API}/user/address`, { headers: auth }).then((r) => r.json()),
    fetch(`${API}/user/card`, { headers: auth }).then((r) => r.json()),
  ])

  if (!Array.isArray(addresses) || addresses.length === 0) {
    for (const body of [
      {
        title: 'Shipping - Ev',
        name: 'Demo',
        surname: 'Customer',
        phone: '05321234567',
        city: 'İstanbul',
        district: 'Kadıköy',
        neighborhood: 'Caferağa Mah. Örnek Sok. No:1',
      },
      {
        title: 'Billing - Ev',
        name: 'Demo',
        surname: 'Customer',
        phone: '05321234567',
        city: 'İstanbul',
        district: 'Kadıköy',
        neighborhood: 'Caferağa Mah. Örnek Sok. No:1',
      },
    ]) {
      const res = await fetch(`${API}/user/address`, {
        method: 'POST',
        headers: auth,
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error(`Address seed failed: ${res.status}`)
      console.log('Adres eklendi:', body.title)
    }
  } else {
    console.log(`Adresler zaten var (${addresses.length})`)
  }

  if (!Array.isArray(cards) || cards.length === 0) {
    const res = await fetch(`${API}/user/card`, {
      method: 'POST',
      headers: auth,
      body: JSON.stringify({
        card_no: '1234123412341234',
        expire_month: 12,
        expire_year: 2025,
        name_on_card: 'Ali Bas',
      }),
    })
    if (!res.ok) throw new Error(`Card seed failed: ${res.status}`)
    console.log('Kart eklendi: 1234123412341234')
  } else {
    console.log(`Kartlar zaten var (${cards.length})`)
  }

  console.log('Tamam. Hesabım / sipariş sayfasını yenile.')
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
