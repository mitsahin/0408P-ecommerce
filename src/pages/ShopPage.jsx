import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory, useLocation, useParams } from 'react-router-dom'
import { LayoutGrid, List, RotateCcw } from 'lucide-react'
import ReactPaginate from 'react-paginate'
import ProductCard from '../components/ProductCard.js'
import { products as localProducts } from '../data/products'
import { fetchProducts, setFilter, setLimit, setOffset } from '../store/actions/productActions'
import categoryOne from '../assets/card-cover-5-1.jpg'
import categoryTwo from '../assets/card-cover-6-1.jpg'
import categoryThree from '../assets/card-cover-7-1.jpg'
import categoryFour from '../assets/vv1.jpg'
import categoryFive from '../assets/card-cover-7-3.jpg'
import topImage from '../assets/product-cover-5.png'
import shoeImage from '../assets/card-cover-7-3.jpg'
import jacketImage from '../assets/card-cover-7-11.jpg'
import shirtImage from '../assets/card-cover-5-1.jpg'
import knitwearImage from '../assets/vv1.jpg'
import trouserImage from '../assets/card-cover-7-1.jpg'
import suitImage from '../assets/media bg-cover.png'
import editorAccessories from '../assets/accc.jpg'
import editorKids from '../assets/kıds.png'
import editorWomen from '../assets/media bg-cover (1).png'
import shopHeroImage from '../assets/shop-hero-2-png-picture-1 (2).png'
import vv2Image from '../assets/vv2.jpg'
import cardCoverNine from '../assets/card-cover-9.jpg'
import teamUserOne from '../../team-1-user-1-3.jpg'
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

const SHOP_SEGMENTS = {
  kadin: {
    title: 'Kadın Shop',
    description: 'Modern kadın koleksiyonlarını keşfedin.',
    bannerImages: [categoryOne, categoryTwo, categoryFour, categoryFive, categoryThree],
    keywords: ['kadin', 'women', 'female'],
  },
  erkek: {
    title: 'Erkek Shop',
    description: 'Günlük ve klasik erkek stilini tek sayfada bulun.',
    bannerImages: [categoryThree, categoryFive, categoryOne, categoryFour, categoryTwo],
    keywords: ['erkek', 'men', 'male'],
  },
  kids: {
    title: 'Kids Shop',
    description: 'Kids koleksiyonunda rahat ve dinamik parçalar.',
    bannerImages: [editorKids, categoryTwo, shoeImage, editorKids, knitwearImage],
    keywords: ['kids', 'kid', 'cocuk', 'çocuk', 'bebek', 'genclik'],
  },
  accessories: {
    title: 'Accessories Shop',
    description: 'Aksesuar koleksiyonuyla kombinini tamamla.',
    bannerImages: [shoeImage, suitImage, topImage, trouserImage, shirtImage],
    keywords: ['aksesuar', 'accessory', 'accessories', 'canta', 'çanta', 'watch', 'saat'],
  },
}

const VIRTUAL_SEGMENT_LABELS = {
  kids: ['Tişört', 'Ayakkabı', 'Ceket', 'Gömlek', 'Kazak', 'Pantalon'],
  accessories: ['Çanta', 'Saat', 'Şapka', 'Kemer', 'Takı', 'Cüzdan'],
}

const SEGMENT_FEATURE_CARDS = {
  kids: [
    { title: 'Back to School', subtitle: 'Yeni Sezon', image: editorKids },
    { title: 'Comfort Set', subtitle: 'Rahat Kalıplar', image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=900&q=80' },
    { title: 'Active Kids', subtitle: 'Dinamik Stil', image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=900&q=80' },
  ],
  accessories: [
    { title: 'Premium Bags', subtitle: 'Öne Çıkan', image: editorAccessories },
    { title: 'Smart Watches', subtitle: 'Yeni Koleksiyon', image: suitImage },
    { title: 'Daily Essentials', subtitle: 'Tamamlayıcılar', image: topImage },
  ],
}

const ALL_PRODUCTS_SEGMENT_CARDS = [
  {
    title: 'Kids',
    subtitle: 'Rahat ve Dinamik',
    image: editorKids,
    to: '/shop/kids',
  },
  {
    title: 'Kadın',
    subtitle: 'Modern Koleksiyon',
    image: categoryOne,
    to: '/shop/kadin',
  },
  {
    title: 'Erkek',
    subtitle: 'Günlük ve Klasik',
    image: categoryThree,
    to: '/shop/erkek',
  },
  {
    title: 'Accessories',
    subtitle: 'Tamamlayıcı Parçalar',
    image: editorAccessories,
    to: '/shop/accessories',
  },
]

const SHOP_HERO_CARDS = [
  { title: 'Cloths', image: categoryOne, to: '/shop/erkek', position: '52% center' },
  { title: 'Cloths', image: categoryTwo, to: '/shop/kadin', position: '46% center' },
  { title: 'Cloths', image: categoryThree, to: '/shop/kadin', position: '56% center' },
  { title: 'Cloths', image: teamUserOne, to: '/shop/accessories', position: '50% 30%' },
  { title: 'Cloths', image: cardCoverNine, to: '/shop/kids', position: '50% 24%' },
]

const KIDS_SHOE_IMAGES = [
  'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=900&q=80',
]

const KIDS_JACKET_IMAGES = [
  'https://images.unsplash.com/photo-1503919005314-30d93d07d823?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1503341733017-1901578f9f1e?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1517298257259-f72ccd2db392?auto=format&fit=crop&w=900&q=80',
]

const KIDS_COAT_IMAGES = [
  'https://images.unsplash.com/photo-1475189778702-5ec9941484ae?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1503919005314-30d93d07d823?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1503341733017-1901578f9f1e?auto=format&fit=crop&w=900&q=80',
]

const KIDS_SWEAT_IMAGES = [
  'https://images.unsplash.com/photo-1503341733017-1901578f9f1e?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1475189778702-5ec9941484ae?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
]

const resolveKidsVisualSet = (slug) => {
  if (slug.includes('ayakkab')) {
    return { images: KIDS_SHOE_IMAGES, department: 'Kids Shoes' }
  }
  if (slug.includes('mont') || slug.includes('coat')) {
    return { images: KIDS_COAT_IMAGES, department: 'Kids Coat' }
  }
  if (slug.includes('ceket') || slug.includes('jacket')) {
    return { images: KIDS_JACKET_IMAGES, department: 'Kids Jacket' }
  }
  if (
    slug.includes('sweet') ||
    slug.includes('sweat') ||
    slug.includes('sweatshirt') ||
    slug.includes('kazak')
  ) {
    return { images: KIDS_SWEAT_IMAGES, department: 'Kids Sweat' }
  }
  return null
}

const ShopPage = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()
  const { categoryId, gender, categoryName } = useParams()
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

  const normalizeGenderSlug = (value, fallback = '') => {
    const raw = toSlug(value ?? fallback)
    if (raw === 'k') return 'kadin'
    if (raw === 'e') return 'erkek'
    return raw || fallback
  }
  const activeGender = (() => {
    const normalized = normalizeGenderSlug(gender ?? '')
    return ['kadin', 'erkek', 'kids', 'accessories'].includes(normalized) ? normalized : ''
  })()
  const activeSegment = SHOP_SEGMENTS[activeGender] ?? {
    title: 'Tüm Ürünler',
    description: 'Tüm kategorilerden karma ürünleri keşfedin.',
    bannerImages: [categoryOne, categoryTwo, categoryThree, categoryFour, categoryFive],
    keywords: [],
  }

  const defaultLimit = limit || 25
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('price:asc')
  const [filterText, setFilterText] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const activeCategoryId = String(categoryId ?? '')

  const visibleCategories = useMemo(() => {
    if (!activeGender) return categories
    if (activeGender === 'kadin' || activeGender === 'erkek') {
      return categories.filter(
        (category) => normalizeGenderSlug(category?.gender) === activeGender
      )
    }

    const labels = VIRTUAL_SEGMENT_LABELS[activeGender] ?? []
    const matchedByKeyword = categories.filter((category) => {
      const slug = toSlug(category?.title ?? category?.name)
      return activeSegment.keywords.some((keyword) => slug.includes(toSlug(keyword)))
    })
    const categorySource = matchedByKeyword.length > 0 ? matchedByKeyword : categories
    if (categorySource.length === 0) return []
    const fallbackId = categorySource[0]?.id ?? 1

    return labels.map((label, index) => ({
      id: categorySource[index]?.id ?? fallbackId,
      title: label,
      name: label,
      gender: activeGender,
      rating: categorySource[index]?.rating ?? 4.5,
      image:
        categorySource[index]?.image ||
        categorySource[index]?.img ||
        activeSegment.bannerImages[index % activeSegment.bannerImages.length],
    }))
  }, [activeGender, categories, activeSegment])

  const updateQueryParams = (updates = {}, replace = false) => {
    const nextParams = new URLSearchParams(location.search)
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        nextParams.delete(key)
      } else {
        nextParams.set(key, String(value))
      }
    })
    const nextSearch = nextParams.toString()
    const navigationMethod = replace ? history.replace : history.push
    navigationMethod({
      pathname: location.pathname,
      search: nextSearch ? `?${nextSearch}` : '',
    })
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const nextSort = params.get('sort') || 'price:asc'
    const allowedSorts = ['price:asc', 'price:desc', 'rating:asc', 'rating:desc']
    const safeSort = allowedSorts.includes(nextSort) ? nextSort : 'price:asc'
    const nextFilter = params.get('filter') ?? ''
    const parsedPage = Number(params.get('page') || '1')
    const safePage = Number.isFinite(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1

    setSortBy((prev) => (prev === safeSort ? prev : safeSort))
    setFilterText((prev) => (prev === nextFilter ? prev : nextFilter))
    setPage((prev) => (prev === safePage ? prev : safePage))
  }, [location.search])

  useEffect(() => {
    dispatch(setLimit(defaultLimit))
  }, [dispatch, defaultLimit])

  useEffect(() => {
    if (!activeGender || activeCategoryId || visibleCategories.length === 0) return
    const firstCategory = visibleCategories[0]
    history.replace(
      `/shop/${activeGender}/${toSlug(firstCategory?.title ?? firstCategory?.name)}/${firstCategory?.id}`
    )
  }, [activeGender, activeCategoryId, visibleCategories, history])

  useEffect(() => {
    const offset = (page - 1) * defaultLimit
    dispatch(setOffset(offset))
    dispatch(setFilter(filterText))
    dispatch(
      fetchProducts({
        limit: defaultLimit,
        offset,
        category: categoryId || undefined,
        sort: sortBy,
        filter: filterText,
      })
    )
  }, [dispatch, page, defaultLimit, categoryId, sortBy, filterText])

  const catalog = useMemo(() => {
    const list = Array.isArray(productList) && productList.length > 0 ? productList : localProducts
    const normalizedList = list.map(normalizeProduct)
    const categorySlug = toSlug(categoryName)
    const isKidsPage = activeGender === 'kids'
    const kidsVisualPreset = resolveKidsVisualSet(categorySlug)
    if (!isKidsPage || !kidsVisualPreset) return normalizedList

    return normalizedList.map((item, index) => ({
      ...item,
      image: kidsVisualPreset.images[index % kidsVisualPreset.images.length],
      department: kidsVisualPreset.department,
    }))
  }, [productList, activeGender, categoryName])

  const totalPages = Math.max(1, Math.ceil((total ?? catalog.length) / defaultLimit))

  const topCategories = useMemo(() => {
    const categorySlug = toSlug(categoryName)
    const isKidsPage = activeGender === 'kids'
    const kidsVisualPreset = resolveKidsVisualSet(categorySlug)
    const fallbackImages =
      isKidsPage && kidsVisualPreset ? kidsVisualPreset.images : activeSegment.bannerImages
    return [...visibleCategories]
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      .slice(0, 5)
      .map((category, index) => ({
        ...category,
        image:
          activeGender === 'kids'
            ? fallbackImages[index % fallbackImages.length]
            : category.image || category.img || fallbackImages[index % fallbackImages.length],
      }))
  }, [visibleCategories, activeSegment, activeGender, categoryName])
  const segmentFeatureCards = useMemo(
    () => {
      if (activeGender !== 'kids') return SEGMENT_FEATURE_CARDS[activeGender] ?? []
      const slug = toSlug(categoryName)
      const preset = resolveKidsVisualSet(slug)
      if (!preset) return SEGMENT_FEATURE_CARDS.kids
      return [
        { title: 'Back to School', subtitle: 'Yeni Sezon', image: preset.images[0] },
        { title: 'Comfort Set', subtitle: 'Rahat Kalıplar', image: preset.images[1] },
        { title: 'Active Kids', subtitle: 'Dinamik Stil', image: preset.images[2] },
      ]
    },
    [activeGender, categoryName]
  )

  const buildCategoryLink = (category) =>
    {
      const nextParams = new URLSearchParams(location.search)
      nextParams.delete('page')
      const queryString = nextParams.toString()
      const targetGender =
        activeGender === 'kids' || activeGender === 'accessories'
          ? activeGender
          : normalizeGenderSlug(category?.gender, 'kadin')
      const path = `/shop/${targetGender}/${toSlug(
        category?.title ?? category?.name
      )}/${category.id}`
      return queryString ? `${path}?${queryString}` : path
    }

  const buildProductLink = (product) => {
    const category = categories.find(
      (item) => String(item.id) === String(product.categoryId)
    )
    if (!category) return `/product/${product.id}`
    const genderSlug = normalizeGenderSlug(category.gender, 'kadin')
    const categorySlug = toSlug(category.title ?? category.name)
    const productSlug = toSlug(product.title)
    return `/shop/${genderSlug}/${categorySlug}/${category.id}/${productSlug}/${product.id}`
  }

  const handleResetFilters = () => {
    setSortBy('price:asc')
    setFilterText('')
    setPage(1)
    updateQueryParams(
      {
        sort: undefined,
        filter: undefined,
        page: undefined,
      },
      true
    )
  }

  const brandLogos = [brandOne, brandTwo, brandThree, brandFour, brandFive]

  return (
    <section className="flex w-full flex-col items-center gap-8">
      <div className="w-full">
        <div className="mx-auto flex w-full max-w-[333px] flex-col gap-5 px-0 sm:max-w-[1200px] sm:gap-6 sm:px-4">
          <div className="flex items-center justify-between py-1">
            <h1 className="text-[24px] font-semibold text-slate-900">Shop</h1>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Link to="/" className="font-semibold text-slate-700">
                Home
              </Link>
              <span>{'>'}</span>
              <span className="text-slate-400">Shop</span>
            </div>
          </div>

          <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {SHOP_HERO_CARDS.map((item, index) => {
                const cardImage = item.image
                const cardTitle = item.title ?? 'Cloths'
                const cardLink = item.to || '/shop'
                const cardPosition = item.position || 'center'
                return (
                  <Link
                    key={`${cardTitle}-${index}`}
                    to={cardLink}
                    className="group relative h-[185px] overflow-hidden rounded-sm"
                  >
                    <img
                      src={cardImage}
                      alt={cardTitle}
                      className="h-full w-full scale-[1.03] object-cover transition duration-300 group-hover:scale-105"
                      style={{ objectPosition: cardPosition }}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/35 text-white">
                      <span className="text-[11px] font-bold uppercase tracking-[0.16em]">
                        CLOTHS
                      </span>
                      <span className="mt-1 text-[11px] font-semibold text-white/90">
                        5 Items
                      </span>
                    </div>
                  </Link>
                )
              }
            )}
          </div>

          <div className="flex w-full flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Showing all {total ?? catalog.length} results
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-slate-500">Views:</span>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-pressed={viewMode === 'grid'}
                className={`flex h-[34px] w-[34px] items-center justify-center rounded border ${
                  viewMode === 'grid'
                    ? 'border-slate-900 text-slate-900'
                    : 'border-slate-200 text-slate-400'
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                aria-pressed={viewMode === 'list'}
                className={`flex h-[34px] w-[34px] items-center justify-center rounded border ${
                  viewMode === 'list'
                    ? 'border-slate-900 text-slate-900'
                    : 'border-slate-200 text-slate-400'
                }`}
              >
                <List className="h-3.5 w-3.5" />
              </button>
              <select
                value={sortBy}
                onChange={(event) => {
                  const nextSort = event.target.value
                  setPage(1)
                  setSortBy(nextSort)
                  updateQueryParams(
                    {
                      sort: nextSort === 'price:asc' ? undefined : nextSort,
                      page: undefined,
                    },
                    true
                  )
                }}
                className="h-[36px] min-w-[130px] rounded border border-slate-200 bg-white px-3 text-xs text-slate-500 outline-none transition focus:border-slate-300"
              >
                <option value="price:asc">Popularity</option>
                <option value="price:desc">Price: High</option>
                <option value="rating:desc">Best Rated</option>
                <option value="rating:asc">Rating: Low</option>
              </select>
              <input
                value={filterText}
                onChange={(event) => {
                  const nextFilter = event.target.value
                  setFilterText(nextFilter)
                  setPage(1)
                  updateQueryParams(
                    {
                      filter: nextFilter || undefined,
                      page: undefined,
                    },
                    true
                  )
                }}
                placeholder="Search"
                className="h-[36px] w-[120px] rounded border border-slate-200 bg-white px-3 text-xs text-slate-500 outline-none transition focus:border-slate-300"
              />
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex h-[36px] items-center gap-1 rounded bg-sky-500 px-4 text-xs font-semibold text-white transition hover:bg-sky-600"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Filter
              </button>
            </div>
          </div>

          <div className="flex w-full flex-col gap-6">
            {fetchState === 'FETCHING' ? (
              <div className="flex w-full items-center justify-center gap-3 py-6 text-xs uppercase tracking-[0.3em] text-slate-400">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-slate-500" />
                Loading
              </div>
            ) : null}

            <div
              className={`flex w-full flex-wrap justify-between gap-y-6 transition-opacity duration-300 ${
                fetchState === 'FETCHING'
                  ? 'pointer-events-none opacity-0'
                  : 'opacity-100'
              }`}
            >
              {catalog.map((product) => (
                <div
                  key={product.id}
                  className={`flex w-full ${
                    viewMode === 'list'
                      ? 'sm:w-full lg:w-full'
                      : 'sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]'
                  }`}
                >
                  <ProductCard
                    product={product}
                    to={buildProductLink(product)}
                    layout={viewMode}
                  />
                </div>
              ))}
            </div>

            {fetchState !== 'FETCHING' && catalog.length === 0 ? (
              <div className="rounded border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500">
                No products matched your filters.
              </div>
            ) : null}

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
              activeClassName="bg-sky-500 text-white border-sky-500"
              previousClassName="rounded border border-slate-200 px-3 py-2 transition hover:border-slate-300"
              nextClassName="rounded border border-slate-200 px-3 py-2 transition hover:border-slate-300"
              breakClassName="rounded border border-slate-200 px-3 py-2"
              previousLinkClassName="block cursor-pointer"
              nextLinkClassName="block cursor-pointer"
              breakLinkClassName="block cursor-pointer"
              disabledClassName="cursor-not-allowed opacity-50"
            />
          </div>

          <div className="w-screen max-w-none -mx-4 sm:mx-0 sm:w-full">
            <div className="mx-auto flex w-full max-w-[414px] flex-col items-center justify-center gap-6 rounded bg-slate-50 py-10 text-center sm:max-w-[1200px] sm:flex-row sm:flex-wrap">
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
