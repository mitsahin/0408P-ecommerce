# 0408P Ecommerce

React + Vite storefront scaffold with Redux, React Router v5, Tailwind v4, Axios, Toastify, and Lucide.

## Getting started

1. Install dependencies

```bash
npm install
```

1. Add environment variables

```bash
cp .env.example .env
```

1. Run the dev server

```bash
npm run dev
```

## Environment variables

`VITE_API_BASE_URL` sets the API base URL used by `src/api/axiosClient.js`.

## Postman notes

`GET /products` response shape:

```json
{
  "total": 185,
  "products": [
    { "id": 1 },
    { "id": 2 }
  ]
}
```

Sample product queries:

- `/products?category=2`
- `/products?category=2&filter=siyah`
- `/products?category=2&filter=siyah&sort=price:desc`

## Folder layout

- `src/api` Axios client and API helpers
- `src/pages` route-level views
- `src/store` Redux store, reducers, and actions
