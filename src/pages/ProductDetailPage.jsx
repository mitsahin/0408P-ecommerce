import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory, useParams } from 'react-router-dom'
import { products } from '../data/products'
import ProductCard from '../components/ProductCard.js'
import { fetchProductById } from '../store/actions/productActions'
import { setCart } from '../store/actions/shoppingCartActions'
import thumbOne from '../assets/product-cover-5.png'
import thumbTwo from '../assets/product-cover-5 (1).png'
import thumbThree from '../assets/product-cover-5 (2).png'
import thumbFour from '../assets/product-cover-5 (3).png'
import brandOne from '../assets/fa-brands-1.png'
import brandTwo from '../assets/fa-brands-2.png'
import brandThree from '../assets/fa-brands-3.png'
import brandFour from '../assets/fa-brands-4.png'
import brandFive from '../assets/fa-brands-5.png'

const ProductDetailPage = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { productId, id } = useParams()
  const { product, fetchState } = useSelector((state) => state.products ?? {})
  const cartItems = useSelector((state) => state.shoppingCart?.cart ?? [])

  useEffect(() => {
    const resolvedId = productId || id
    if (resolvedId) {
      dispatch(fetchProductById(resolvedId))
    }
  }, [dispatch, productId, id])

  const fallbackProduct = products.find((item) => item.id === id) || products[0]
  const activeProduct = product || fallbackProduct
  const galleryImages = useMemo(
    () => [activeProduct?.images?.[0]?.url || activeProduct.image, thumbOne, thumbTwo, thumbThree, thumbFour].filter(Boolean),
    [activeProduct]
  )
  const [activeImage, setActiveImage] = useState(galleryImages[0])
  const [activeTab, setActiveTab] = useState('description')
  const brandLogos = [brandOne, brandTwo, brandThree, brandFour, brandFive]

  useEffect(() => {
    setActiveImage(galleryImages[0])
  }, [galleryImages])

  useEffect(() => {
    if (galleryImages.length > 0) {
      setActiveImage(galleryImages[0])
    }
  }, [galleryImages])

  const handleAddToCart = () => {
    if (!activeProduct) return
    const existing = cartItems.find(
      (item) => String(item.product?.id) === String(activeProduct.id)
    )
    const updatedCart = existing
      ? cartItems.map((item) =>
          String(item.product?.id) === String(activeProduct.id)
            ? { ...item, count: item.count + 1 }
            : item
        )
      : [
          ...cartItems,
          {
            count: 1,
            checked: true,
            product: {
              ...activeProduct,
              image:
                activeProduct?.images?.[0]?.url ||
                activeProduct?.image ||
                activeProduct?.thumbnail,
            },
          },
        ]
    dispatch(setCart(updatedCart))
  }

  return (
    <section className="flex w-full flex-col gap-8">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="text-slate-700">
            Home
          </Link>
          <span>/</span>
          <Link to="/shop" className="text-slate-700">
            Shop
          </Link>
          <span>/</span>
          <span className="text-slate-400">{activeProduct?.title ?? 'Product'}</span>
        </div>

        <button
          type="button"
          onClick={() => history.goBack()}
          className="flex w-fit items-center rounded border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700"
        >
          Back
        </button>

        <div className="flex w-full flex-col gap-6 rounded border border-slate-200 bg-white p-6 sm:flex-row sm:items-start sm:gap-10 sm:p-8">
          {fetchState === 'FETCHING' ? (
            <div className="flex w-full items-center justify-center py-10 text-xs uppercase tracking-[0.3em] text-slate-400">
              Loading
            </div>
          ) : null}
          <div className="flex w-full flex-col gap-4 sm:w-[50%] sm:flex-row sm:items-start">
            <div className="order-2 flex w-full gap-3 overflow-x-auto sm:order-1 sm:w-[90px] sm:flex-col sm:overflow-visible">
              {galleryImages.map((image, index) => (
                <button
                  type="button"
                  key={`${image}-${index}`}
                  onClick={() => setActiveImage(image)}
                  className={`flex h-[72px] w-[72px] flex-shrink-0 items-center justify-center rounded border bg-white ${
                    activeImage === image
                      ? 'border-slate-900'
                      : 'border-slate-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${activeProduct?.title ?? 'Product'} ${index + 1}`}
                    className="h-full w-full object-contain object-center"
                  />
                </button>
              ))}
            </div>
            <div className="order-1 flex w-full items-center justify-center rounded bg-slate-50 p-4 sm:order-2">
              <img
                src={activeImage}
                alt={activeProduct?.title ?? 'Product'}
                className="h-[320px] w-full object-contain object-center sm:h-[420px]"
              />
            </div>
          </div>
          <div className="flex w-full flex-col gap-4 sm:w-[45%]">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-semibold text-slate-900">
                {activeProduct?.title ?? 'Product'}
              </h1>
              <p className="text-sm text-slate-500">
                {activeProduct?.department ?? activeProduct?.category?.name}
              </p>
            </div>
            <div className="flex items-center gap-3 text-xl font-semibold">
              <span className="text-slate-400 line-through">
                ${activeProduct?.oldPrice ?? activeProduct?.price}
              </span>
              <span className="text-emerald-600">${activeProduct?.price}</span>
            </div>
            <p className="text-sm text-slate-500">
              We focus on ergonomics and meeting you where you work. It&apos;s only a
              keystroke away.
            </p>
            <div className="flex items-center gap-2">
              {(activeProduct?.colors ?? ['bg-sky-500', 'bg-emerald-500']).map(
                (color) => (
                  <span key={color} className={`h-3 w-3 rounded-full ${color}`} />
                )
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
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

      <div className="flex w-full flex-col gap-6 rounded border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center gap-6 border-b border-slate-200 text-sm font-semibold text-slate-500">
          <button
            type="button"
            onClick={() => setActiveTab('description')}
            className={`pb-2 ${
              activeTab === 'description'
                ? 'border-b-2 border-slate-900 text-slate-900'
                : ''
            }`}
          >
              Description
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('additional')}
            className={`pb-2 ${
              activeTab === 'additional'
                ? 'border-b-2 border-slate-900 text-slate-900'
                : ''
            }`}
            >
              Additional Information
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
            className={`pb-2 ${
              activeTab === 'reviews'
                ? 'border-b-2 border-slate-900 text-slate-900'
                : ''
            }`}
            >
              Reviews (0)
            </button>
          </div>
          {activeTab === 'description' ? (
            <div className="flex w-full flex-col gap-4 text-sm text-slate-500">
              <p>
                We focus on ergonomics and meeting you where you work. It&apos;s only
                a keystroke away.
              </p>
              <p>
                The quick fox jumps over the lazy dog. The quick fox jumps over the
                lazy dog.
              </p>
            </div>
          ) : null}
          {activeTab === 'additional' ? (
            <div className="flex w-full flex-col gap-2 text-sm text-slate-500">
              <span>Material: Premium cotton</span>
              <span>Care: Machine wash cold</span>
              <span>Fit: Regular</span>
            </div>
          ) : null}
          {activeTab === 'reviews' ? (
            <div className="text-sm text-slate-500">No reviews yet.</div>
          ) : null}
        </div>

        <div className="flex w-full flex-col gap-6">
          <h2 className="text-lg font-semibold text-slate-900">
            BESTSELLER PRODUCTS
          </h2>
          <div className="flex w-full flex-wrap gap-[30px]">
            {products.slice(0, 8).map((item) => (
              <div
                key={item.id}
                className="flex w-full sm:w-[calc(50%-15px)] lg:w-[calc(25%-22.5px)]"
              >
                <ProductCard product={item} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col items-center justify-center gap-6 rounded bg-slate-50 py-10 sm:flex-row sm:flex-wrap">
          {brandLogos.map((brand, index) => (
            <img
              key={`${brand}-${index}`}
              src={brand}
              alt="Brand logo"
              className="mx-auto h-7 object-contain opacity-70"
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductDetailPage
