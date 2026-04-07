import { Link } from 'react-router-dom'

const SearchPage = () => {
  const quickSearches = [
    { id: 's1', label: 'T-Shirt', to: '/shop?filter=tshirt' },
    { id: 's2', label: 'Sneakers', to: '/shop?filter=ayakkabi' },
    { id: 's3', label: 'Jacket', to: '/shop?filter=ceket' },
    { id: 's4', label: 'Dress', to: '/shop?filter=elbise' },
  ]

  return (
    <section className="flex w-full flex-col gap-8">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-900 px-6 py-10 text-white sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-sky-100/80">
            Product Discovery
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">Search</h1>
          <p className="mt-3 max-w-2xl text-sm text-sky-100/90 sm:text-base">
            Find products faster by name, category, or style. Use quick links below or open
            the full shop catalog for advanced filtering.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/shop"
              className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Browse All Products
            </Link>
            <Link
              to="/contact"
              className="rounded-xl border border-white/35 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Get Help Finding Items
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Discover
        </p>
        <h2 className="mt-2 text-xl font-semibold text-slate-900">Quick searches</h2>
        <p className="mt-2 text-sm text-slate-500">
          Jump directly to popular categories with one click.
        </p>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {quickSearches.map((item) => (
            <Link
              key={item.id}
              to={item.to}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SearchPage
