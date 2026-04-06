import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import ReactPaginate from 'react-paginate'
import { products as localProducts } from '../data/products'
import { setCart } from '../store/actions/shoppingCartActions'
import {
  clearWishlistIds,
  readWishlistIds,
  readWishlistItemsMap,
  removeWishlistId,
  writeWishlistIds,
  WISHLIST_CHANGED_EVENT,
} from '../utils/wishlist'

const WishlistPage = () => {
  const history = useHistory()
  const location = useLocation()
  const dispatch = useDispatch()
  const cartItems = useSelector((state) => state.shoppingCart?.cart ?? [])
  const productList = useSelector((state) => state.products?.productList ?? [])
  const [wishlistIds, setWishlistIds] = useState(() => readWishlistIds())
  const [searchText, setSearchText] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [stockFilter, setStockFilter] = useState('all')
  const [page, setPage] = useState(1)
  const pageSize = 6

  const updateQueryParams = (updates = {}) => {
    const nextParams = new URLSearchParams(location.search)
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        nextParams.delete(key)
      } else {
        nextParams.set(key, String(value))
      }
    })
    const nextSearch = nextParams.toString()
    history.push({
      pathname: location.pathname,
      search: nextSearch ? `?${nextSearch}` : '',
    })
  }

  useEffect(() => {
    const syncWishlist = () => setWishlistIds(readWishlistIds())
    window.addEventListener(WISHLIST_CHANGED_EVENT, syncWishlist)
    window.addEventListener('storage', syncWishlist)
    return () => {
      window.removeEventListener(WISHLIST_CHANGED_EVENT, syncWishlist)
      window.removeEventListener('storage', syncWishlist)
    }
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const nextSearchText = params.get('q') ?? ''
    const nextSortBy = params.get('sort') || 'newest'
    const allowedSort = ['newest', 'price-asc', 'price-desc', 'name-asc', 'name-desc']
    const safeSort = allowedSort.includes(nextSortBy) ? nextSortBy : 'newest'
    const nextStockFilter = params.get('stock') || 'all'
    const allowedStock = ['all', 'in-stock', 'out-of-stock']
    const safeStock = allowedStock.includes(nextStockFilter) ? nextStockFilter : 'all'
    const parsedPage = Number(params.get('page') || '1')
    const safePage = Number.isFinite(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1

    setSearchText((prev) => (prev === nextSearchText ? prev : nextSearchText))
    setSortBy((prev) => (prev === safeSort ? prev : safeSort))
    setStockFilter((prev) => (prev === safeStock ? prev : safeStock))
    setPage((prev) => (prev === safePage ? prev : safePage))
  }, [location.search])

  const catalog = useMemo(() => {
    const source =
      Array.isArray(productList) && productList.length > 0 ? productList : localProducts
    return source.map((item) => ({
      ...item,
      resolvedId: String(item?.id),
      resolvedName: item?.title ?? item?.name ?? 'Product',
      resolvedImage:
        item?.images?.[0]?.url || item?.image || item?.thumbnail || item?.img || '',
      resolvedPrice: Number(item?.price ?? item?.list_price ?? 0),
      resolvedDepartment: item?.department ?? item?.brand ?? item?.category?.name ?? '',
      resolvedInStock:
        typeof item?.in_stock === 'boolean'
          ? item.in_stock
          : Number(item?.stock ?? item?.stock_count ?? 1) > 0,
    }))
  }, [productList])

  const wishlistProducts = useMemo(
    () => {
      const catalogMap = new Map(
        catalog.map((product) => [String(product.resolvedId), product])
      )
      const storedMap = readWishlistItemsMap()
      return wishlistIds
        .map((id) => {
          const normalizedId = String(id)
          const storedProduct = storedMap[normalizedId]
          if (catalogMap.has(normalizedId)) {
            const catalogProduct = catalogMap.get(normalizedId)
            return {
              ...catalogProduct,
              // Keep user's latest selected image from wishlist snapshot.
              resolvedImage: storedProduct?.image || catalogProduct.resolvedImage,
              resolvedName:
                storedProduct?.title || catalogProduct.resolvedName,
              resolvedPrice:
                typeof storedProduct?.price === 'number'
                  ? storedProduct.price
                  : catalogProduct.resolvedPrice,
              resolvedDepartment:
                storedProduct?.department || catalogProduct.resolvedDepartment,
              resolvedInStock:
                typeof catalogProduct?.resolvedInStock === 'boolean'
                  ? catalogProduct.resolvedInStock
                  : typeof storedProduct?.inStock === 'boolean'
                    ? storedProduct.inStock
                    : true,
              addedAt: storedProduct?.addedAt ?? null,
            }
          }
          if (!storedProduct) return null
          return {
            id: storedProduct.id,
            resolvedId: storedProduct.id,
            resolvedName: storedProduct.title ?? 'Product',
            resolvedImage: storedProduct.image ?? '',
            resolvedPrice: Number(storedProduct.price ?? 0),
            resolvedDepartment: storedProduct.department ?? '',
            resolvedInStock:
              typeof storedProduct.inStock === 'boolean'
                ? storedProduct.inStock
                : true,
            addedAt: storedProduct.addedAt ?? null,
          }
        })
        .filter(Boolean)
    },
    [catalog, wishlistIds]
  )

  useEffect(() => {
    const visibleIds = wishlistProducts.map((product) => String(product.resolvedId))
    const normalizedStoredIds = wishlistIds.map(String)
    const hasMismatch =
      visibleIds.length !== normalizedStoredIds.length ||
      visibleIds.some((id) => !normalizedStoredIds.includes(id))
    if (!hasMismatch) return
    const nextIds = writeWishlistIds(visibleIds)
    setWishlistIds(nextIds)
  }, [wishlistProducts, wishlistIds])

  const visibleWishlistProducts = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase()
    const filtered = wishlistProducts.filter((product) => {
      if (!normalizedSearch) return true
      const name = String(product.resolvedName ?? '').toLowerCase()
      const department = String(product.resolvedDepartment ?? '').toLowerCase()
      return name.includes(normalizedSearch) || department.includes(normalizedSearch)
    })

    const stockFiltered =
      stockFilter === 'all'
        ? filtered
        : filtered.filter((product) =>
            stockFilter === 'in-stock' ? product.resolvedInStock : !product.resolvedInStock
          )

    const sorted = [...stockFiltered]
    if (sortBy === 'price-asc') {
      sorted.sort((a, b) => (a.resolvedPrice ?? 0) - (b.resolvedPrice ?? 0))
    } else if (sortBy === 'price-desc') {
      sorted.sort((a, b) => (b.resolvedPrice ?? 0) - (a.resolvedPrice ?? 0))
    } else if (sortBy === 'name-asc') {
      sorted.sort((a, b) =>
        String(a.resolvedName ?? '').localeCompare(String(b.resolvedName ?? ''), 'tr')
      )
    } else if (sortBy === 'name-desc') {
      sorted.sort((a, b) =>
        String(b.resolvedName ?? '').localeCompare(String(a.resolvedName ?? ''), 'tr')
      )
    } else {
      // newest (default): recent added first
      sorted.sort((a, b) => {
        const aTime = new Date(a.addedAt ?? 0).getTime()
        const bTime = new Date(b.addedAt ?? 0).getTime()
        return bTime - aTime
      })
    }
    return sorted
  }, [wishlistProducts, searchText, sortBy, stockFilter])

  const totalPages = Math.max(1, Math.ceil(visibleWishlistProducts.length / pageSize))
  const pagedWishlistProducts = useMemo(() => {
    const start = (page - 1) * pageSize
    return visibleWishlistProducts.slice(start, start + pageSize)
  }, [visibleWishlistProducts, page])

  useEffect(() => {
    if (page <= totalPages) return
    const nextPage = totalPages
    setPage(nextPage)
    updateQueryParams({ page: nextPage <= 1 ? undefined : nextPage })
  }, [page, totalPages])

  const formatAddedAt = (value) => {
    if (!value) return null
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return null
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const handleRemove = (productId) => {
    const nextIds = removeWishlistId(productId)
    setWishlistIds(nextIds)
    toast.info('Product removed from wishlist')
  }

  const handleClearAll = () => {
    clearWishlistIds()
    setWishlistIds([])
    toast.info('Wishlist cleared')
  }

  const handleAddToCart = (product) => {
    const existing = cartItems.find(
      (item) => String(item?.product?.id) === String(product?.id)
    )
    const nextCart = existing
      ? cartItems.map((item) =>
          String(item?.product?.id) === String(product?.id)
            ? { ...item, count: (item.count ?? 0) + 1 }
            : item
        )
      : [
          ...cartItems,
          {
            count: 1,
            checked: true,
            product: {
              ...product,
              id: product.id ?? product.resolvedId,
              name: product.resolvedName,
              title: product.resolvedName,
              image: product.resolvedImage,
              price: product.resolvedPrice,
            },
          },
        ]
    dispatch(setCart(nextCart))
    toast.success('Product added to cart')
  }

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-slate-900">Wishlist</h1>
          <p className="text-sm text-slate-500">
            Saved products: {wishlistProducts.length}
          </p>
        </div>
        {wishlistProducts.length > 0 ? (
          <button
            type="button"
            onClick={handleClearAll}
            className="rounded border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          >
            Clear all
          </button>
        ) : null}
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded border border-slate-200 bg-white px-6 py-10 text-center">
          <p className="text-sm text-slate-500">
            Wishlist is empty. Add products you like to see them here.
          </p>
          <Link
            to="/shop"
            className="rounded bg-slate-900 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white"
          >
            Go to shop
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 rounded border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <input
              value={searchText}
              onChange={(event) => {
                const nextValue = event.target.value
                setSearchText(nextValue)
                updateQueryParams({
                  q: nextValue || undefined,
                  page: undefined,
                })
              }}
              placeholder="Search wishlist..."
              className="w-full rounded border border-slate-200 px-3 py-2 text-sm text-slate-700 sm:max-w-[320px]"
            />
            <select
              value={sortBy}
              onChange={(event) => {
                const nextValue = event.target.value
                setSortBy(nextValue)
                updateQueryParams({
                  sort: nextValue === 'newest' ? undefined : nextValue,
                  page: undefined,
                })
              }}
              className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 sm:w-[220px]"
            >
              <option value="newest">Newest added</option>
              <option value="price-asc">Price: Low to high</option>
              <option value="price-desc">Price: High to low</option>
              <option value="name-asc">Name: A-Z</option>
              <option value="name-desc">Name: Z-A</option>
            </select>
            <select
              value={stockFilter}
              onChange={(event) => {
                const nextValue = event.target.value
                setStockFilter(nextValue)
                updateQueryParams({
                  stock: nextValue === 'all' ? undefined : nextValue,
                  page: undefined,
                })
              }}
              className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 sm:w-[180px]"
            >
              <option value="all">All stock</option>
              <option value="in-stock">In stock only</option>
              <option value="out-of-stock">Out of stock</option>
            </select>
          </div>

          {visibleWishlistProducts.length === 0 ? (
            <div className="rounded border border-slate-200 bg-white px-6 py-8 text-center text-sm text-slate-500">
              No wishlist products match your search.
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pagedWishlistProducts.map((product) => (
            <article
              key={product.resolvedId}
              className="flex flex-col gap-3 rounded border border-slate-200 bg-white p-4"
            >
              <Link
                to={{
                  pathname: `/product/${product.resolvedId}`,
                  state: {
                    productSnapshot: {
                      id: product.id ?? product.resolvedId,
                      title: product.resolvedName,
                      name: product.resolvedName,
                      image: product.resolvedImage,
                      thumbnail: product.resolvedImage,
                      price: product.resolvedPrice,
                      department: product.resolvedDepartment,
                    },
                  },
                }}
                className="flex justify-center"
              >
                <img
                  src={product.resolvedImage}
                  alt={product.resolvedName}
                  className="h-44 w-full rounded bg-white object-contain"
                />
              </Link>
              <div className="flex flex-col gap-1">
                <h2 className="text-sm font-semibold text-slate-900">{product.resolvedName}</h2>
                <p className="text-xs text-slate-500">{product.resolvedDepartment}</p>
                <span
                  className={`w-fit rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                    product.resolvedInStock
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-rose-50 text-rose-600'
                  }`}
                >
                  {product.resolvedInStock ? 'In stock' : 'Out of stock'}
                </span>
                <p className="text-sm font-semibold text-emerald-600">
                  {product.resolvedPrice.toFixed(2)} TL
                </p>
                {formatAddedAt(product.addedAt) ? (
                  <p className="text-[11px] text-slate-400">
                    Eklendi: {formatAddedAt(product.addedAt)}
                  </p>
                ) : null}
              </div>
              <div className="mt-auto flex gap-2">
                <button
                  type="button"
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.resolvedInStock}
                  className="flex-1 rounded bg-slate-900 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add to cart
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(product.resolvedId)}
                  className="rounded border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600"
                >
                  Remove
                </button>
              </div>
            </article>
            ))}
          </div>

          {visibleWishlistProducts.length > pageSize ? (
            <ReactPaginate
              pageCount={totalPages}
              forcePage={Math.max(0, page - 1)}
              onPageChange={(selectedItem) => {
                const nextPage = selectedItem.selected + 1
                setPage(nextPage)
                updateQueryParams({ page: nextPage <= 1 ? undefined : nextPage })
              }}
              previousLabel="Prev"
              nextLabel="Next"
              breakLabel="..."
              marginPagesDisplayed={1}
              pageRangeDisplayed={3}
              containerClassName="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500"
              pageClassName="rounded border border-slate-200 px-3 py-2 transition hover:border-slate-300"
              pageLinkClassName="block cursor-pointer"
              activeClassName="bg-slate-900 text-white border-slate-900"
              previousClassName="rounded border border-slate-200 px-3 py-2 transition hover:border-slate-300"
              nextClassName="rounded border border-slate-200 px-3 py-2 transition hover:border-slate-300"
              breakClassName="rounded border border-slate-200 px-3 py-2"
              previousLinkClassName="block cursor-pointer"
              nextLinkClassName="block cursor-pointer"
              breakLinkClassName="block cursor-pointer"
              disabledClassName="cursor-not-allowed opacity-50"
            />
          ) : null}
        </>
      )}
    </section>
  )
}

export default WishlistPage
