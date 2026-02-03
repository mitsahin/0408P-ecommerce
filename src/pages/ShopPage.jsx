import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { LayoutGrid, List } from 'lucide-react'
import ProductCard from '../components/ProductCard.jsx'
import { products as localProducts } from '../data/products'
import { fetchProducts } from '../store/actions/productActions'
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
  image: p?.image ?? p?.thumbnail ?? p?.img ?? '',
  title: p?.title ?? p?.name ?? 'Product',
  department: p?.department ?? p?.brand ?? '',
  price: String(p?.price ?? p?.list_price ?? '0'),
  oldPrice: String(p?.oldPrice ?? p?.sale_price ?? p?.price ?? '0'),
  colors: p?.colors ?? ['bg-sky-500', 'bg-emerald-500'],
})

const ShopPage = () => {
  const dispatch = useDispatch()
  const { productList, total } = useSelector((s) => s.products ?? {})

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const catalog = useMemo(() => {
    const list = Array.isArray(productList) && productList.length > 0 ? productList : localProducts
    return list.map(normalizeProduct)
  }, [productList])

  const pageSize = 8
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('popularity')
  const [filterOn, setFilterOn] = useState(false)
  const totalPages = Math.max(1, Math.ceil((total ?? catalog.length) / pageSize))
  const filteredProducts = useMemo(() => {
    if (!filterOn) return catalog
    return catalog.filter((item) => Number(item.price) <= 10)
  }, [catalog, filterOn])
  const sortedProducts = useMemo(() => {
    const items = [...filteredProducts]
    if (sortBy === 'price-asc') {
      return items.sort((a, b) => Number(a.price) - Number(b.price))
    }
    if (sortBy === 'price-desc') {
      return items.sort((a, b) => Number(b.price) - Number(a.price))
    }
    return items
  }, [filteredProducts, sortBy])
  const visibleProducts = useMemo(() => {
    const start = (page - 1) * pageSize
    return sortedProducts.slice(start, start + pageSize)
  }, [sortedProducts, page])

  const categories = [
    { id: 'cat-1', title: 'CLOTHS', items: '5 Items', image: categoryOne },
    { id: 'cat-2', title: 'CLOTHS', items: '5 Items', image: categoryTwo },
    { id: 'cat-3', title: 'CLOTHS', items: '5 Items', image: categoryThree },
    { id: 'cat-4', title: 'CLOTHS', items: '5 Items', image: categoryFour },
    { id: 'cat-5', title: 'CLOTHS', items: '5 Items', image: categoryFive },
  ]

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
            {categories.map((category) => (
              <article
                key={category.id}
                className="relative flex h-[300px] w-full max-w-[332px] overflow-hidden rounded bg-white sm:mx-0 sm:h-[223px] sm:w-[206px] sm:max-w-none"
              >
                <img
                  src={category.image}
                  alt={category.title}
                  className="h-full w-full object-contain object-center"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-slate-900/25 text-white">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                    {category.title}
                  </span>
                  <span className="text-[11px]">{category.items}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="flex w-full flex-col gap-4 rounded border border-slate-200 bg-white px-4 py-4 sm:mx-auto sm:w-[1088px] sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs text-slate-500">
              Showing {(page - 1) * pageSize + 1}–
              {Math.min(page * pageSize, sortedProducts.length)} of{' '}
              {sortedProducts.length}{' '}
              results
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
                <option value="popularity">Popularity</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <button
                type="button"
                onClick={() => {
                  setPage(1)
                  setFilterOn((prev) => !prev)
                }}
                className="rounded bg-sky-500 px-4 py-2 text-xs font-semibold text-white"
              >
                {filterOn ? 'Filtered' : 'Filter'}
              </button>
            </div>
          </div>

          <div className="flex w-full flex-col gap-6">
            <div className="flex w-full flex-wrap justify-center gap-[18px] sm:mx-auto sm:w-[1048px] sm:justify-between sm:gap-[30px]">
              {visibleProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex w-full sm:w-[calc(50%-15px)] lg:w-[calc(25%-22.5px)]"
                >
                  <ProductCard product={product} />
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
              <button
                type="button"
                onClick={() => setPage(2)}
                className={`rounded border border-slate-200 px-3 py-2 ${
                  page === 2 ? 'bg-sky-500 text-white' : ''
                }`}
              >
                2
              </button>
              <button
                type="button"
                onClick={() => setPage(3)}
                className={`rounded border border-slate-200 px-3 py-2 ${
                  page === 3 ? 'bg-sky-500 text-white' : ''
                }`}
              >
                3
              </button>
              <button
                type="button"
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="rounded border border-slate-200 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
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
