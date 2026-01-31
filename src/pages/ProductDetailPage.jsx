import { Link, useParams } from 'react-router-dom'
import { products } from '../data/products'
import ProductCard from '../components/ProductCard.jsx'

const ProductDetailPage = () => {
  const { id } = useParams()
  const product = products.find((item) => item.id === id) || products[0]

  return (
    <section className="flex w-full flex-col gap-8">
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="text-slate-700">
          Home
        </Link>
        <span>/</span>
        <Link to="/shop" className="text-slate-700">
          Shop
        </Link>
        <span>/</span>
        <span className="text-slate-400">{product.title}</span>
      </div>

      <div className="flex w-full flex-col gap-6 rounded border border-slate-200 bg-white p-4 sm:flex-row sm:items-start sm:gap-8">
        <div className="flex w-full justify-center sm:w-[50%]">
          <img
            src={product.image}
            alt={product.title}
            className="h-[320px] w-full bg-white object-contain object-center sm:h-[420px]"
          />
        </div>
        <div className="flex w-full flex-col gap-4 sm:w-[45%]">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold text-slate-900">
              {product.title}
            </h1>
            <p className="text-sm text-slate-500">{product.department}</p>
          </div>
          <div className="flex items-center gap-3 text-lg font-semibold">
            <span className="text-slate-400 line-through">
              ${product.oldPrice}
            </span>
            <span className="text-emerald-600">${product.price}</span>
          </div>
          <p className="text-sm text-slate-500">
            We focus on ergonomics and meeting you where you work. It&apos;s only a
            keystroke away.
          </p>
          <div className="flex items-center gap-2">
            {product.colors.map((color) => (
              <span key={color} className={`h-3 w-3 rounded-full ${color}`} />
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="rounded bg-slate-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white"
            >
              Add to cart
            </button>
            <button
              type="button"
              className="rounded border border-slate-300 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600"
            >
              Add to wishlist
            </button>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Related products
        </h2>
        <div className="flex w-full flex-wrap gap-[30px]">
          {products.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="flex w-full sm:w-[calc(50%-15px)] lg:w-[calc(25%-22.5px)]"
            >
              <ProductCard product={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductDetailPage
