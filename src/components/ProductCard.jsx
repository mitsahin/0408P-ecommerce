import { Link } from 'react-router-dom'

const ProductCard = ({ product }) => {
  return (
    <article className="mx-auto flex w-full max-w-[320px] flex-col gap-3 border border-slate-100 bg-white sm:max-w-none lg:h-[442px]">
      <Link to={`/product/${product.id}`} className="flex w-full">
        <img
          src={product.image}
          alt={product.title}
          className="h-[260px] w-full bg-white object-contain object-center sm:h-[300px]"
        />
      </Link>
      <div className="flex w-full flex-col gap-2 px-4 pb-6 text-center">
        <Link to={`/product/${product.id}`} className="text-[13px] font-semibold text-slate-900">
          {product.title}
        </Link>
        <p className="text-[11px] font-medium text-slate-500">
          {product.department}
        </p>
        <div className="flex items-center justify-center gap-2 text-[13px] font-semibold">
          <span className="text-slate-400 line-through">
            ${product.oldPrice}
          </span>
          <span className="text-emerald-600">${product.price}</span>
        </div>
        <div className="flex items-center justify-center gap-2 pt-2">
          {product.colors.map((color) => (
            <span
              key={color}
              className={`h-2.5 w-2.5 rounded-full ${color}`}
            />
          ))}
        </div>
      </div>
    </article>
  )
}

export default ProductCard
