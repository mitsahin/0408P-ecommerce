import { Link } from 'react-router-dom'

const ProductCard = ({ product, to, layout = 'grid' }) => {
  const productLink = to || `/product/${product.id}`
  const isList = layout === 'list'
  return (
    <Link
      to={productLink}
      className={`mx-auto flex w-full cursor-pointer gap-3 rounded-lg border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:max-w-none ${
        isList
          ? 'max-w-none flex-row items-center p-4 lg:h-auto'
          : 'max-w-[332px] flex-col lg:h-[442px]'
      }`}
      aria-label={`View ${product.title}`}
    >
      <img
        src={product.image}
        alt={product.title}
        className={
          isList
            ? 'h-24 w-24 flex-shrink-0 bg-white object-contain object-center'
            : 'h-[260px] w-full bg-white object-contain object-center sm:h-[300px]'
        }
      />
      <div
        className={`flex w-full flex-col gap-2 ${
          isList ? 'text-left' : 'px-4 pb-6 text-center'
        }`}
      >
        <span className="text-[13px] font-semibold text-slate-900">
          {product.title}
        </span>
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
          {(product.colors ?? []).map((color) => (
            <span
              key={color}
              className={`h-2.5 w-2.5 rounded-full ${color}`}
            />
          ))}
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
