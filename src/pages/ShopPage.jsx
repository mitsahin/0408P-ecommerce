import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import { products } from '../data/products'

const ShopPage = () => {
  const catalog = products

  return (
    <section className="flex w-full flex-col gap-8">
      <div className="flex w-full flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="text-slate-700">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-400">Shop</span>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-slate-900">Shop</h1>
          <p className="text-sm text-slate-500">
            Explore the latest products and editor picks.
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col gap-4 rounded border border-slate-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-xs text-slate-500">Showing 1–12 of 24 results</span>
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-xs text-slate-500">Sort by</label>
          <select className="rounded border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
            <option>Popularity</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest</option>
          </select>
        </div>
      </div>

      <div className="flex w-full flex-col gap-6">
        <div className="flex w-full flex-wrap gap-[30px]">
          {catalog.map((product) => (
            <div
              key={product.id}
              className="flex w-full sm:w-[calc(50%-15px)] lg:w-[calc(25%-22.5px)]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        <div className="flex w-full items-center justify-center gap-2 text-xs text-slate-500">
          <button className="rounded border border-slate-200 px-3 py-2">
            Prev
          </button>
          <button className="rounded border border-slate-200 bg-slate-900 px-3 py-2 text-white">
            1
          </button>
          <button className="rounded border border-slate-200 px-3 py-2">
            2
          </button>
          <button className="rounded border border-slate-200 px-3 py-2">
            3
          </button>
          <button className="rounded border border-slate-200 px-3 py-2">
            Next
          </button>
        </div>
      </div>
    </section>
  )
}

export default ShopPage
