import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { LayoutGrid, List } from 'lucide-react'
import ProductCard from '../components/ProductCard.js'
import { products as localProducts } from '../data/products'
import { fetchProducts, setFilter, setLimit, setOffset } from '../store/actions/productActions'
import categoryOne from '../assets/card-cover-5-1.jpg'
import categoryTwo from '../assets/card-cover-6-1.jpg'
import categoryThree from '../assets/card-cover-7-1.jpg'
import categoryFour from '../assets/vv1.jpg'
import categoryFive from '../assets/card-cover-7-3.jpg'
import brandOne from '../assets/fa-brands-1.png'
import brandTwo from '../assets/fa-brands-2.png'
import brandThree from '../assets/fa-brands-3.png'
import brandFour from '../assets/fa-brands-4.png'
import brandFive from '../assets/fa-brands-5.png'

const normalizeProduct = (p) => ({
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

const ShopPage = () => {
  const dispatch = useDispatch()
  const { categoryId } = useParams()
  const { productList, total, limit, fetchState } = useSelector((s) => s.products ?? {})
  const categories = useSelector((s) => s.products?.categories ?? [])

  const toSlug = (value) =>
    String(value ?? '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

  const defaultLimit = limit || 25
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('price:asc')
  const [filterText, setFilterText] = useState('')

  useEffect(() => {
    dispatch(setLimit(defaultLimit))
  }, [dispatch, defaultLimit])

  useEffect(() => {
    setPage(1)
  }, [categoryId, sortBy, filterText])

  useEffect(() => {
    const offset = (page - 1) * defaultLimit
    dispatch(setOffset(offset))
    dispatch(setFilter(filterText))
    dispatch(
      fetchProducts({
        limit: defaultLimit,
        offset,
        category: categoryId,
        sort: sortBy,
        filter: filterText,
      })
    )
  }, [dispatch, page, defaultLimit, categoryId, sortBy, filterText])

  const catalog = useMemo(() => {
    const list = Array.isArray(productList) && productList.length > 0 ? productList : localProducts
    return list.map(normalizeProduct)
  }, [productList])

  const totalPages = Math.max(1, Math.ceil((total ?? catalog.length) / defaultLimit))

  const topCategories = useMemo(() => {
    const fallbackImages = [
      categoryOne,
      categoryTwo,
      categoryThree,
      categoryFour,
      categoryFive,
    ]
    return [...categories]
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      .slice(0, 5)
      .map((category, index) => ({
        ...category,
        image: category.image || category.img || fallbackImages[index % fallbackImages.length],
      }))
  }, [categories])

  const buildProductLink = (product) => {
    const category = categories.find(
      (item) => String(item.id) === String(product.categoryId)
    )
    if (!category) return `/product/${product.id}`
    const genderSlug = toSlug(category.gender ?? 'kadin') || 'kadin'
    const categorySlug = toSlug(category.title ?? category.name)
    const productSlug = toSlug(product.title)
    return `/shop/${genderSlug}/${categorySlug}/${category.id}/${productSlug}/${product.id}`
  }

  const brandLogos = [brandOne, brandTwo, brandThree, brandFour, brandFive]

  return (
    <section className="flex w-full flex-col items-center gap-6">
      <div className="w-full">
        <div className="mx-auto flex w-full max-w-[333px] flex-col gap-[18px] px-0 sm:max-w-[1440px] sm:gap-6 sm:px-4">
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

          <div className="flex w-full flex-col items-center gap-[18px] sm:mx-auto sm:w-[1088px] sm:flex-row sm:flex-nowrap sm:justify-between sm:gap-[15px]">
            {topCategories.map((category) => (
              <article
                key={category.id}
                className="relative flex h-[300px] w-full max-w-[332px] overflow-hidden rounded bg-white sm:mx-0 sm:h-[223px] sm:w-[206px] sm:max-w-none"
              >
                <Link
                  to={`/shop/${toSlug(category.gender ?? 'kadin')}/${toSlug(
                    category.title ?? category.name
                  )}/${category.id}`}
                  className="flex h-full w-full"
                >
                  <img
                    src={category.image}
                    alt={category.title ?? category.name}
                    className="h-full w-full object-contain object-center"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-slate-900/25 text-white">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                      {category.title ?? category.name}
                    </span>
                    <span className="text-[11px]">
                      Rating {Number(category.rating ?? 0).toFixed(1)}
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          <div className="flex w-full flex-col gap-4 rounded border border-slate-200 bg-white px-4 py-4 sm:mx-auto sm:w-[1088px] sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs text-slate-500">
              Showing {(page - 1) * defaultLimit + 1}–
              {Math.min(page * defaultLimit, total ?? catalog.length)} of{' '}
              {total ?? catalog.length} results
            </span>
            <div className="flex flex-wrap items-center gap-3 sm:justify-end">
              <span className="text-xs text-slate-500">Views:</span>
              <button
                type="button"
                className="flex items-center justify-center rounded border border-slate-200 px-2.5 py-2 text-slate-500"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="flex items-center justify-center rounded border border-slate-200 px-2.5 py-2 text-slate-500"
              >
                <List className="h-4 w-4" />
              </button>
              <select
                value={sortBy}
                onChange={(event) => {
                  setPage(1)
                  setSortBy(event.target.value)
                }}
                className="rounded border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600"
              >
                <option value="price:asc">Price: Low to High</option>
                <option value="price:desc">Price: High to Low</option>
                <option value="rating:asc">Rating: Low to High</option>
                <option value="rating:desc">Rating: High to Low</option>
              </select>
              <input
                value={filterText}
                onChange={(event) => setFilterText(event.target.value)}
                className="rounded border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600"
                placeholder="Filter"
              />
            </div>
          </div>

          <div className="flex w-full flex-col gap-6">
            {fetchState === 'FETCHING' ? (
              <div className="text-center text-xs uppercase tracking-[0.3em] text-slate-400">
                Loading
              </div>
            ) : null}
            <div className="flex w-full flex-wrap justify-center gap-[18px] sm:mx-auto sm:w-[1048px] sm:justify-between sm:gap-[30px]">
              {catalog.map((product) => (
                <div
                  key={product.id}
                  className="flex w-full sm:w-[calc(50%-15px)] lg:w-[calc(25%-22.5px)]"
                >
                  <ProductCard product={product} to={buildProductLink(product)} />
                </div>
              ))}
            </div>
            <div className="flex w-full flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
              <button
                type="button"
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="rounded border border-slate-200 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                First
              </button>
              <button
                type="button"
                onClick={() => setPage(1)}
                className={`rounded border border-slate-200 px-3 py-2 ${
                  page === 1 ? 'bg-sky-500 text-white' : ''
                }`}
              >
                1
              </button>
              {[...Array(Math.min(totalPages, 4))].map((_, index) => {
                const pageNumber = index + 1
                if (pageNumber === 1) return null
                return (
                  <button
                    key={`page-${pageNumber}`}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    className={`rounded border border-slate-200 px-3 py-2 ${
                      page === pageNumber ? 'bg-sky-500 text-white' : ''
                    }`}
                  >
                    {pageNumber}
                  </button>
                )
              })}
              {totalPages > 4 ? (
                <button
                  type="button"
                  onClick={() => setPage(totalPages)}
                  className="rounded border border-slate-200 px-3 py-2"
                >
                  ...
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="rounded border border-slate-200 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
              <button
                type="button"
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                className="rounded border border-slate-200 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Last
              </button>
            </div>
          </div>

          <div className="w-screen max-w-none -mx-4 sm:mx-0 sm:w-full">
            <div className="mx-auto flex w-full max-w-[414px] flex-col items-center justify-center gap-6 rounded bg-slate-50 py-10 text-center sm:max-w-[1440px] sm:flex-row sm:flex-wrap">
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
        </div>
      </div>
    </section>
  )
}

export default ShopPage
