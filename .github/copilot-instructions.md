# Copilot instructions for 0408P-ecommerce

## Project overview
- React 19 + Vite storefront with Redux (classic `createStore`), React Router v5, Tailwind v4, Axios, React Toastify, and Lucide icons.
- App shell is `Header` + `PageContent` + `Footer` in [src/App.jsx](src/App.jsx), with route wiring in [src/layout/PageContent.jsx](src/layout/PageContent.jsx).
- Routing uses React Router v5 patterns (`<Switch>`, `<Route component={...}>`, `NavLink activeClassName`) — keep this API style when editing routes.

## Key architecture and data flows
- Redux store is created in [src/store/store.jsx](src/store/store.jsx) with `thunk` + `redux-logger` middleware and `rootReducer` combining `client`, `products`, and `shoppingCart` slices.
- Action creators live under [src/store/actions](src/store/actions). `fetchProducts()` and `fetchRolesIfNeeded()` are thunk actions that call [src/api/axiosClient.jsx](src/api/axiosClient.jsx) and dispatch string action types like `products/setFetchState`.
- Product data is currently a mix of API and local mock data. The mock catalog lives in [src/data/products.js](src/data/products.js), and pages like Shop/Product Detail use it directly, while HomePage dispatches `fetchProducts()` to manage `fetchState` only.
- API client is a single Axios instance with a hardcoded base URL in [src/api/axiosClient.jsx](src/api/axiosClient.jsx) (README and `.env.example` mention `VITE_API_BASE_URL`, but it is not wired in yet).

## Conventions and patterns
- Component files are `.jsx`, while `.js` files re-export the `.jsx` default (example: [src/layout/Header.js](src/layout/Header.js)). Keep imports using the `.js` alias unless you are changing the convention.
- UI styling is Tailwind-only; [src/index.css](src/index.css) just imports Tailwind via `@import "tailwindcss";`.
- `react-slick` slider CSS is imported globally in [src/main.jsx](src/main.jsx). If you add/remove sliders, ensure those CSS imports remain accurate.

## Dev workflows
- Install deps: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`
- Preview build: `npm run preview`
- Lint: `npm run lint`

## Integration points
- External API requests go through `axiosClient` only. Update that module if base URLs, headers, or interceptors are needed.
- Notifications use React Toastify in [src/App.jsx](src/App.jsx); prefer adding new toasts via that setup.