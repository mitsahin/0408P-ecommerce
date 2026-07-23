import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory, useLocation, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Heart, ShoppingBag } from 'lucide-react'
import { products } from '../data/products'
import ProductCard from '../components/ProductCard.js'
import {
  fetchProductById,
  setFetchState,
  setProduct,
} from '../store/actions/productActions'
import { setCart } from '../store/actions/shoppingCartActions'
import { addWishlistItem } from '../utils/wishlist'
import axiosClient from '../api/axiosClient'
import thumbOne from '../assets/product-cover-5.png'
import thumbTwo from '../assets/product-cover-5 (1).png'
import thumbThree from '../assets/product-cover-5 (2).png'
import thumbFour from '../assets/product-cover-5 (3).png'
import brandOne from '../assets/fa-brands-1.png'
import brandTwo from '../assets/fa-brands-2.png'
import brandThree from '../assets/fa-brands-3.png'
import brandFour from '../assets/fa-brands-4.png'
import brandFive from '../assets/fa-brands-5.png'

const WOMEN_RELATED_IMAGES = [
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1543163521-1bf560c89c5e?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1596755094514-f87e34085b69?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=900&q=80',
]

const MEN_RELATED_IMAGES = [
  'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80',
]

const normalizeGender = (value) => {
  const raw = String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[ıİ]/g, 'i')
  if (raw === 'k' || raw === 'kadin' || raw === 'women' || raw === 'female') {
    return 'kadin'
  }
  if (raw === 'e' || raw === 'erkek' || raw === 'men' || raw === 'male') {
    return 'erkek'
  }
  if (raw === 'kids' || raw === 'kid' || raw === 'cocuk') return 'kids'
  return raw
}

const normalizeCardProduct = (p) => ({
  id: String(p?.id ?? p?.name ?? Math.random()),
  image:
    p?.images?.[0]?.url ?? p?.image ?? p?.thumbnail ?? p?.img ?? '',
  title: p?.title ?? p?.name ?? 'Product',
  department: p?.department ?? p?.brand ?? p?.category?.name ?? '',
  price: String(p?.price ?? p?.list_price ?? '0'),
  oldPrice: String(p?.oldPrice ?? p?.sale_price ?? p?.price ?? '0'),
  colors: p?.colors ?? ['bg-sky-500', 'bg-emerald-500'],
  categoryId: p?.category_id ?? p?.category?.id,
})

const ProductDetailPage = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()
  const { productId, id, gender, categoryId, categoryName } = useParams()
  const routeId = productId || id
  const { product, fetchState, categories } = useSelector(
    (state) => state.products ?? {}
  )
  const cartItems = useSelector((state) => state.shoppingCart?.cart ?? [])
  const isLoading = fetchState === 'FETCHING'
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('description')
  const [relatedSource, setRelatedSource] = useState([])

  const isNumericId = /^\d+$/.test(String(routeId ?? ''))
  const localProduct = useMemo(
    () => products.find((item) => String(item.id) === String(routeId)),
    [routeId]
  )
  const routeSnapshot = location?.state?.productSnapshot
  const matchingSnapshot =
    routeSnapshot && String(routeSnapshot.id) === String(routeId)
      ? routeSnapshot
      : null

  // Only trust Redux product when it matches the current route id
  const matchingApiProduct =
    product && String(product.id) === String(routeId) ? product : null

  useEffect(() => {
    if (!routeId) return

    if (isNumericId) {
      dispatch(fetchProductById(routeId))
      return
    }

    // Local catalog ids like "product-7" — clear stale API product
    dispatch(setProduct(null))
    dispatch(setFetchState('FETCHED'))
  }, [dispatch, routeId, isNumericId])

  useEffect(() => {
    setActiveImageIndex(0)
    setActiveTab('description')
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [routeId])

  const activeProduct =
    matchingApiProduct || matchingSnapshot || localProduct || products[0]

  const productCategoryId =
    activeProduct?.category_id ??
    activeProduct?.category?.id ??
    activeProduct?.categoryId ??
    categoryId

  const productGender = useMemo(() => {
    const fromRoute = normalizeGender(gender)
    if (['kadin', 'erkek', 'kids'].includes(fromRoute)) return fromRoute

    const category = (categories ?? []).find(
      (item) => String(item.id) === String(productCategoryId)
    )
    return normalizeGender(category?.gender) || 'kadin'
  }, [gender, categories, productCategoryId])

  useEffect(() => {
    let cancelled = false

    const loadRelated = async () => {
      try {
        const params = { limit: 25 }
        if (productCategoryId) params.category = productCategoryId
        const query = new URLSearchParams(
          Object.entries(params).map(([key, value]) => [key, String(value)])
        ).toString()
        const response = await axiosClient.get(`/products?${query}`)
        const list = response?.data?.products ?? response?.data ?? []
        if (!cancelled) setRelatedSource(Array.isArray(list) ? list : [])
      } catch (_error) {
        if (!cancelled) setRelatedSource([])
      }
    }

    loadRelated()
    return () => {
      cancelled = true
    }
  }, [productCategoryId])

  const relatedProducts = useMemo(() => {
    const genderCategoryIds = new Set(
      (categories ?? [])
        .filter((category) => normalizeGender(category.gender) === productGender)
        .map((category) => String(category.id))
    )

    const source =
      Array.isArray(relatedSource) && relatedSource.length > 0
        ? relatedSource
        : products

    let related = source
      .map(normalizeCardProduct)
      .filter((item) => String(item.id) !== String(routeId))

    if (genderCategoryIds.size > 0) {
      const byGender = related.filter(
        (item) =>
          item.categoryId != null &&
          genderCategoryIds.has(String(item.categoryId))
      )
      if (byGender.length > 0) related = byGender
    }

    if (productCategoryId) {
      const byCategory = related.filter(
        (item) => String(item.categoryId) === String(productCategoryId)
      )
      if (byCategory.length > 0) related = byCategory
    }

    related = related.slice(0, 8)

    while (related.length < 8) {
      const index = related.length
      related.push({
        id: `related-${productGender}-${index}`,
        image: '',
        title:
          productGender === 'kadin'
            ? 'Kadın Öneri Ürünü'
            : productGender === 'erkek'
              ? 'Erkek Öneri Ürünü'
              : 'Benzer Ürün',
        department:
          categoryName ||
          (productGender === 'kadin'
            ? 'Kadın'
            : productGender === 'erkek'
              ? 'Erkek'
              : 'Shop'),
        price: String(Number(activeProduct?.price ?? 49.9).toFixed(2)),
        oldPrice: String(
          (Number(activeProduct?.price ?? 49.9) * 1.4).toFixed(2)
        ),
        colors: ['bg-sky-500', 'bg-emerald-500'],
        categoryId: productCategoryId,
      })
    }

    const visuals =
      productGender === 'kadin'
        ? WOMEN_RELATED_IMAGES
        : productGender === 'erkek'
          ? MEN_RELATED_IMAGES
          : WOMEN_RELATED_IMAGES

    return related.map((item, index) => ({
      ...item,
      image: visuals[index % visuals.length] || item.image,
      department:
        productGender === 'kadin'
          ? item.department || 'Kadın Koleksiyonu'
          : productGender === 'erkek'
            ? item.department || 'Erkek Koleksiyonu'
            : item.department,
    }))
  }, [
    categories,
    relatedSource,
    productGender,
    productCategoryId,
    routeId,
    categoryName,
    activeProduct?.price,
  ])

  const productName = activeProduct?.title ?? activeProduct?.name ?? 'Product'
  const productDescription =
    activeProduct?.description || 'Product details will be available soon.'
  const currentPrice = Number(activeProduct?.price ?? 0)
  const oldPriceValue = activeProduct?.oldPrice
    ? Number(activeProduct.oldPrice)
    : null
  const showOldPrice = oldPriceValue && oldPriceValue > currentPrice
  const galleryImages = useMemo(
    () =>
      [
        activeProduct?.images?.[0]?.url || activeProduct?.image,
        thumbOne,
        thumbTwo,
        thumbThree,
        thumbFour,
      ].filter(Boolean),
    [activeProduct]
  )
  const resolvedImageIndex = Math.min(
    activeImageIndex,
    Math.max(galleryImages.length - 1, 0)
  )
  const activeImage = galleryImages[resolvedImageIndex] || galleryImages[0]
  const brandLogos = [brandOne, brandTwo, brandThree, brandFour, brandFive]

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
    toast.success('Product added to cart')
  }

  const handleAddToWishlist = () => {
    if (!activeProduct?.id) return
    try {
      addWishlistItem({
        ...activeProduct,
        image: activeImage,
        thumbnail: activeImage,
      })
      toast.success('Product added to wishlist')
      history.push('/wishlist')
    } catch {
      toast.error('Could not update wishlist')
    }
  }

  return (
    <section className="flex w-full flex-col gap-8">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8">
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 shadow-sm">
          <Link to="/" className="text-slate-700">
            Home
          </Link>
          <span>/</span>
          <Link to="/shop" className="text-slate-700">
            Shop
          </Link>
          <span>/</span>
          <span className="text-slate-400">{productName}</span>
        </div>

        <button
          type="button"
          onClick={() => history.goBack()}
          className="flex w-fit items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
        >
          Back
        </button>

        <div className="flex w-full flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-start sm:gap-10 sm:p-8">
          {isLoading ? (
            <div className="flex w-full flex-col gap-6 sm:flex-row sm:items-start sm:gap-10">
              <div className="flex w-full items-center justify-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-500">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-slate-500" />
                Loading
              </div>
              <div className="flex w-full flex-col gap-4 sm:w-[50%] sm:flex-row sm:items-start">
                <div className="order-2 flex w-full gap-3 overflow-x-auto sm:order-1 sm:w-[90px] sm:flex-col sm:overflow-visible">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={`thumb-skeleton-${index}`}
                      className="h-[72px] w-[72px] flex-shrink-0 animate-pulse rounded border border-emerald-100 bg-emerald-100"
                    />
                  ))}
                </div>
                <div className="order-1 flex w-full items-center justify-center rounded-xl border border-slate-100 bg-slate-50 p-4 sm:order-2">
                  <div className="h-[320px] w-full animate-pulse rounded bg-emerald-100 sm:h-[420px]" />
                </div>
              </div>
              <div className="flex w-full flex-col gap-4 sm:w-[45%]">
                <div className="h-8 w-3/4 animate-pulse rounded bg-emerald-100" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-emerald-100" />
                <div className="h-6 w-2/5 animate-pulse rounded bg-emerald-100" />
                <div className="flex flex-col gap-2">
                  <div className="h-3 w-full animate-pulse rounded bg-emerald-100" />
                  <div className="h-3 w-5/6 animate-pulse rounded bg-emerald-100" />
                  <div className="h-3 w-2/3 animate-pulse rounded bg-emerald-100" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 animate-pulse rounded-full bg-emerald-100" />
                  <span className="h-3 w-3 animate-pulse rounded-full bg-emerald-100" />
                  <span className="h-3 w-3 animate-pulse rounded-full bg-emerald-100" />
                </div>
                <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
                  <div className="h-10 w-32 animate-pulse rounded bg-emerald-100" />
                  <div className="h-10 w-32 animate-pulse rounded bg-emerald-100" />
                </div>
              </div>
            </div>
          ) : null}
          {!isLoading ? (
            <div className="flex w-full flex-col gap-4 sm:w-[50%] sm:flex-row sm:items-start">
            <div className="order-2 flex w-full gap-3 overflow-x-auto sm:order-1 sm:w-[90px] sm:flex-col sm:overflow-visible">
              {galleryImages.map((image, index) => (
                <button
                  type="button"
                  key={`${image}-${index}`}
                  onClick={() => setActiveImageIndex(index)}
                  className={`flex h-[72px] w-[72px] flex-shrink-0 items-center justify-center rounded-lg border bg-white transition ${
                    resolvedImageIndex === index
                      ? 'border-slate-900 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img
                    src={image}
                      alt={`${productName} ${index + 1}`}
                    className="h-full w-full object-contain object-center"
                  />
                </button>
              ))}
            </div>
            <div className="order-1 flex w-full items-center justify-center rounded-xl border border-slate-100 bg-slate-50 p-4 sm:order-2">
              <img
                src={activeImage}
                alt={productName}
                className="h-[320px] w-full object-contain object-center sm:h-[420px]"
              />
            </div>
          </div>
          ) : null}
          {!isLoading ? (
            <div className="flex w-full flex-col gap-4 sm:w-[45%]">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-semibold text-slate-900">
                {productName}
              </h1>
              <p className="text-sm text-slate-500">
                {activeProduct?.department ?? activeProduct?.category?.name ?? 'Category unavailable'}
              </p>
            </div>
            <div className="flex items-center gap-3 text-xl font-semibold">
              {showOldPrice ? (
                <span className="text-slate-400 line-through">
                  ${oldPriceValue?.toFixed(2)}
                </span>
              ) : null}
              <span className="text-emerald-600">${currentPrice.toFixed(2)}</span>
            </div>
            <p className="text-sm text-slate-500">
              {productDescription}
            </p>
            <div className="flex items-center gap-2">
              {(activeProduct?.colors ?? ['bg-sky-500', 'bg-emerald-500']).map(
                (color) => (
                  <span key={color} className={`h-3 w-3 rounded-full ${color}`} />
                )
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={handleAddToCart}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-slate-800"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                Add to cart
              </button>
              <button
                type="button"
                onClick={handleAddToWishlist}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 transition hover:border-slate-400 hover:text-slate-800"
              >
                <Heart className="h-3.5 w-3.5" />
                Add to wishlist
              </button>
            </div>
          </div>
          ) : null}
        </div>

      <div className="flex w-full flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-6 border-b border-slate-200 text-sm font-semibold text-slate-500">
          <button
            type="button"
            onClick={() => setActiveTab('description')}
            className={`pb-3 text-[13px] uppercase tracking-[0.14em] ${
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
            className={`pb-3 text-[13px] uppercase tracking-[0.14em] ${
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
            className={`pb-3 text-[13px] uppercase tracking-[0.14em] ${
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
            {productGender === 'kadin'
              ? 'Benzer Kadın Ürünleri'
              : productGender === 'erkek'
                ? 'Benzer Erkek Ürünleri'
                : 'Benzer Ürünler'}
          </h2>
          <div className="flex w-full flex-wrap gap-[30px]">
            {relatedProducts.map((item) => {
              const isSynthetic = String(item.id).startsWith('related-')
              const linkTarget = isSynthetic
                ? `/shop/${productGender || 'kadin'}`
                : {
                    pathname: `/product/${item.id}`,
                    state: { productSnapshot: item },
                  }
              return (
                <div
                  key={item.id}
                  className="flex w-full sm:w-[calc(50%-15px)] lg:w-[calc(25%-22.5px)]"
                >
                  <ProductCard product={item} to={linkTarget} />
                </div>
              )
            })}
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
