# 0408P Ecommerce

React + Vite storefront with Express + PostgreSQL backend, Redux, React Router v5, Tailwind v4.

## Canlı adresler

| Servis | URL | Durum |
|--------|-----|-------|
| Frontend (Vercel) | https://0408p-ecommerce.vercel.app | Canlı |
| Backend (Render) | https://zero408p-ecommerce-api.onrender.com | Canlı |
| Fallback API | https://workintech-fe-ecommerce.onrender.com | Canlı (587 ürün) |

**Demo giriş:** `customer@commerce.com` / `123456`

## Yerel kurulum

```bash
npm run setup          # frontend + backend bağımlılıkları
cp .env.example .env   # DATABASE_URL ve JWT ayarları
npm run db:init        # şema + seed (587 ürün)
npm start              # backend :3000 + frontend :5173
```

## Deploy

### Vercel (frontend) — otomatik

GitHub `main` branch'e push → Vercel otomatik deploy eder.

Production API adresi `.env.production` içinde tanımlıdır. Kendi Render API'niz hazır olunca:

```env
VITE_API_BASE_URL=https://zero408p-ecommerce-api.onrender.com
```

### Render (backend + PostgreSQL) — tek seferlik kurulum

1. [Render Blueprint deploy](https://render.com/deploy?repo=https://github.com/mitsahin/0408P-ecommerce) linkine gidin
2. GitHub ile giriş yapın → **Apply** / **Deploy Blueprint**
3. 5–10 dk bekleyin (DB oluşturma + 587 ürün seed)
4. `/health` endpoint'ini kontrol edin
5. `.env.production` URL'sini kendi API'nize çevirip push edin

`render.yaml` otomatik olarak şunları kurar:
- Node.js web servisi (`0408p-ecommerce-api`)
- PostgreSQL veritabanı (`ecommerce-db`)
- `JWT_SECRET`, `DATABASE_URL` ortam değişkenleri

Deploy durumu kontrolü:

```bash
npm run deploy:check
```

## API uç noktaları

- `GET /health` — sağlık kontrolü
- `POST /login`, `POST /signup`, `GET /verify`
- `GET /categories`, `GET /products`
- `GET|POST /user/address`, `GET|POST /user/card`
- `GET|POST /order`

## Klasör yapısı

- `src/` — React frontend
- `backend/` — Express API, routes, SQL şeması
- `render.yaml` — Render Blueprint tanımı
- `vercel.json` — SPA routing
