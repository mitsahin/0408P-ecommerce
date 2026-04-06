import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { toast } from 'react-toastify'
import {
  addWishlistItem,
  readWishlistIds,
  removeWishlistId,
  WISHLIST_CHANGED_EVENT,
} from '../utils/wishlist'

const ProductCard = ({ product, to, layout = 'grid', showWishlistButton = true }) => {
  const productLink = to || `/product/${product.id}`
  const isList = layout === 'list'
  const productId = useMemo(() => String(product?.id ?? ''), [product?.id])
  const [isWishlisted, setIsWishlisted] = useState(() =>
    readWishlistIds().includes(productId)
  )

  useEffect(() => {
    setIsWishlisted(readWishlistIds().includes(productId))
  }, [productId])

  useEffect(() => {
    const syncWishlistState = () => {
      setIsWishlisted(readWishlistIds().includes(productId))
    }
    window.addEventListener(WISHLIST_CHANGED_EVENT, syncWishlistState)
    window.addEventListener('storage', syncWishlistState)
    return () => {
      window.removeEventListener(WISHLIST_CHANGED_EVENT, syncWishlistState)
      window.removeEventListener('storage', syncWishlistState)
    }
  }, [productId])

  const handleWishlistToggle = (event) => {
    event.preventDefault()
    event.stopPropagation()
    if (!productId) return
    if (isWishlisted) {
      removeWishlistId(productId)
      toast.info('Product removed from wishlist')
      return
    }
    addWishlistItem(product)
    toast.success('Product added to wishlist')
  }

  return (
    <Link
      to={productLink}
      className={`group relative mx-auto flex w-full cursor-pointer gap-3 rounded-2xl border border-slate-200 bg-white transition duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:max-w-none ${
        isList
          ? 'max-w-none flex-row items-center p-4 lg:h-auto'
          : 'max-w-[332px] flex-col overflow-hidden lg:h-[442px]'
      }`}
      aria-label={`View ${product.title}`}
    >
      {showWishlistButton ? (
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute right-3 top-3 z-10 rounded-full border bg-white/95 p-2.5 shadow-sm transition ${
            isWishlisted
              ? 'border-rose-200 text-rose-500'
              : 'border-slate-200 text-slate-500 hover:text-slate-700'
          }`}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      ) : null}
      <img
        src={product.image}
        alt={product.title}
        className={
          isList
            ? 'h-24 w-24 flex-shrink-0 rounded-lg bg-slate-50 object-contain object-center'
            : 'h-[260px] w-full bg-slate-50 object-contain object-center transition duration-300 group-hover:scale-[1.03] sm:h-[300px]'
        }
      />
      <div
        className={`flex w-full flex-col gap-2 ${
          isList ? 'text-left' : 'px-4 pb-6 text-center'
        }`}
      >
        <span className="line-clamp-2 min-h-[40px] text-[13px] font-semibold text-slate-900">
          {product.title}
        </span>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          {product.department}
        </p>
        <div className="flex items-center justify-center gap-2 pt-1 text-[13px] font-semibold">
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
