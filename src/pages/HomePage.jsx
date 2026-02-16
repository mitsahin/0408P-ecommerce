import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ChevronLeft, ChevronRight, Clock, MessageSquare, Truck } from 'lucide-react'
import HomeSlider from '../components/Slider.js'
import ProductCard from '../components/ProductCard.js'
import { fetchProducts } from '../store/actions/productActions'
import editorMen from '../assets/media bg-cover.png'
import editorWomen from '../assets/media bg-cover (1).png'
import editorAccessories from '../assets/accc.jpg'
import editorKids from '../assets/kıds.png'
import productAlt4 from '../assets/shop-hero-2-png-picture-1 (2).png'
import coupleBanner from '../assets/asian-woman-man-with-winter-clothes 1 (3).png'
import blogCover1 from '../assets/y1.png'
import blogCover2 from '../assets/y2.png'
import blogCover3 from '../assets/u.png'
import { products as allProducts } from '../data/products'

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

const toSlug = (value) =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

const HomePage = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const { fetchState, productList, categories } = useSelector((state) => state.products)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const vitaSlides = [
    {
      id: 'vita-1',
      season: 'Summer 2020',
      title: 'Vita Classic Product',
      description:
        'We know how large objects will act, We know how are objects will act, We know',
      price: '$16.48',
      image: productAlt4,
    },
  ]
  const [vitaIndex, setVitaIndex] = useState(0)
  const [vitaFading, setVitaFading] = useState(false)
  const vitaFadeTimerRef = useRef(null)

  const triggerVitaChange = (nextIndex) => {
    setVitaFading(true)
    if (vitaFadeTimerRef.current) {
      clearTimeout(vitaFadeTimerRef.current)
    }
    vitaFadeTimerRef.current = setTimeout(() => setVitaFading(false), 120)
    setVitaIndex((prev) =>
      typeof nextIndex === 'function' ? nextIndex(prev) : nextIndex
    )
  }

  useEffect(() => {
    const timer = setInterval(() => {
      triggerVitaChange((prev) => (prev + 1) % vitaSlides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [vitaSlides.length])

  useEffect(() => () => clearTimeout(vitaFadeTimerRef.current), [])

  const editorPicks = [
    {
      id: 'men',
      title: 'MEN',
      image: editorMen,
      className: 'sm:w-[58%] lg:w-[60%]',
    },
    {
      id: 'women',
      title: 'WOMEN',
      image: editorWomen,
      className: 'sm:w-[40%] lg:w-[38%]',
    },
    {
      id: 'accessories',
      title: 'ACCESSORIES',
      image: editorAccessories,
      className: 'w-full',
    },
    {
      id: 'kids',
      title: 'KIDS',
      image: editorKids,
      className: 'w-full',
    },
  ]

  const featuredProducts = useMemo(() => {
    const list = Array.isArray(productList) && productList.length > 0 ? productList : allProducts
    return list.map(normalizeProduct).slice(0, 8)
  }, [productList])

  const buildProductLink = (product) => {
    const category = categories?.find(
      (item) => String(item.id) === String(product.categoryId)
    )
    if (!category) return `/product/${product.id}`
    const genderSlug = toSlug(category.gender ?? 'kadin') || 'kadin'
    const categorySlug = toSlug(category.title ?? category.name)
    const productSlug = toSlug(product.title)
    return `/shop/${genderSlug}/${categorySlug}/${category.id}/${productSlug}/${product.id}`
  }

  const featuredPosts = [
    {
      id: 'post-1',
      image: blogCover1,
      title: "Loudest à la Madison #1 (L'integral)",
      excerpt:
        "We focus on ergonomics and meeting you where you work. It's only a keystroke away.",
    },
    {
      id: 'post-2',
      image: blogCover2,
      title: "Loudest à la Madison #1 (L'integral)",
      excerpt:
        "We focus on ergonomics and meeting you where you work. It's only a keystroke away.",
    },
    {
      id: 'post-3',
      image: blogCover3,
      title: "Loudest à la Madison #1 (L'integral)",
      excerpt:
        "We focus on ergonomics and meeting you where you work. It's only a keystroke away.",
    },
  ]

  return (
    <section className="flex w-full flex-col gap-0">
      <div className="flex w-full flex-col gap-2 lg:h-[852px]">
        <div className="w-full">
          <HomeSlider />
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-2 lg:h-[770px]">
        <div className="mx-auto flex w-[333px] min-h-[1850px] flex-col gap-[48px] bg-white pb-[40px] pt-[80px] sm:w-full sm:min-h-0 sm:max-w-[1050px] sm:px-4 sm:pb-[80px] lg:h-full lg:min-h-0">
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-700">
              Editor&apos;s pick
            </p>
            <p className="text-xs text-slate-500">
              Problems trying to resolve the conflict between
            </p>
          </div>
          <div className="flex w-full justify-center">
            <div className="flex w-full flex-col items-center gap-[30px] lg:h-[500px] lg:flex-row lg:items-stretch">
              <div className="relative flex h-[500px] w-full max-w-[320px] overflow-hidden rounded-lg bg-slate-100 shadow-sm sm:max-w-[420px] lg:h-[500px] lg:w-[510px] lg:max-w-none">
                <img
                  src={editorPicks[0].image}
                  alt={editorPicks[0].title}
                  className="h-full w-full object-contain object-center"
                />
                <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded bg-white/90 px-6 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-900 shadow-sm">
                  {editorPicks[0].title}
                </span>
              </div>
              <div className="relative flex h-[500px] w-full max-w-[320px] overflow-hidden rounded-lg bg-slate-100 shadow-sm sm:max-w-[420px] lg:h-[500px] lg:w-[240px] lg:max-w-none">
                <img
                  src={editorPicks[1].image}
                  alt={editorPicks[1].title}
                  className="h-full w-full object-contain object-center"
                />
                <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded bg-white/90 px-6 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-900 shadow-sm">
                  {editorPicks[1].title}
                </span>
              </div>
              <div className="flex w-full max-w-[320px] flex-col gap-[16px] sm:max-w-[420px] lg:w-[240px] lg:max-w-none">
                <div className="relative flex h-[242px] w-full overflow-hidden rounded-lg bg-slate-100 shadow-sm lg:h-[242px]">
                  <img
                    src={editorPicks[2].image}
                    alt={editorPicks[2].title}
                    className="h-full w-full object-contain object-center"
                  />
                  <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded bg-white/90 px-6 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-900 shadow-sm">
                    {editorPicks[2].title}
                  </span>
                </div>
                <div className="relative flex h-[242px] w-full overflow-hidden rounded-lg bg-slate-100 shadow-sm lg:h-[242px]">
                  <img
                    src={editorPicks[3].image}
                    alt={editorPicks[3].title}
                    className="h-full w-full object-contain object-center"
                  />
                  <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded bg-white/90 px-6 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-900 shadow-sm">
                    {editorPicks[3].title}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full flex-col">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[24px] pb-[12px] pt-[16px] lg:h-[1652px] sm:pt-[32px]">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-sm text-slate-500">Featured Products</p>
          <h2 className="text-2xl font-semibold text-slate-900">
            BESTSELLER PRODUCTS
          </h2>
          <p className="text-xs text-slate-400">
            Problems trying to resolve the conflict between
          </p>
        </div>
        {fetchState === 'FAILED' ? (
          <div className="flex items-center rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-600">
            Something went wrong while loading products.
          </div>
        ) : null}
        {fetchState === 'FETCHING' ? (
          <div className="flex w-full flex-wrap gap-[30px]">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={`featured-skeleton-${index}`}
                className={`flex w-full sm:w-[calc(50%-15px)] lg:w-[calc(25%-22.5px)] ${
                  index < 4 ? '' : index < 6 ? 'hidden sm:flex' : 'hidden lg:flex'
                }`}
              >
                <div className="mx-auto flex w-full max-w-[332px] flex-col gap-3 rounded-lg border border-emerald-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:max-w-none lg:h-[442px]">
                  <div className="h-[260px] w-full animate-pulse rounded bg-emerald-100 sm:h-[300px]" />
                  <div className="flex w-full flex-col gap-2 px-4 pb-6 text-center">
                    <div className="mx-auto h-4 w-3/4 animate-pulse rounded bg-emerald-100" />
                    <div className="mx-auto h-3 w-1/2 animate-pulse rounded bg-emerald-100" />
                    <div className="mx-auto flex items-center justify-center gap-2">
                      <span className="h-3 w-10 animate-pulse rounded bg-emerald-100" />
                      <span className="h-3 w-10 animate-pulse rounded bg-emerald-100" />
                    </div>
                    <div className="flex items-center justify-center gap-2 pt-2">
                      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-100" />
                      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-100" />
                      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-100" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex w-full flex-wrap gap-[30px]">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="flex w-full sm:w-[calc(50%-15px)] lg:w-[calc(25%-22.5px)]"
              >
                <ProductCard product={product} to={buildProductLink(product)} />
              </div>
            ))}
          </div>
        )}
        </div>
      </div>

      <div className="flex w-full flex-col">
        <div className="relative flex w-full flex-col items-center rounded-[5px] border border-slate-200 bg-emerald-700 px-4 pb-[112px] pt-[112px] text-white lg:h-[709px] lg:w-full lg:px-0">
          <button
            type="button"
            onClick={() =>
              triggerVitaChange(
                (prev) => (prev - 1 + vitaSlides.length) % vitaSlides.length
              )
            }
            className="absolute left-6 top-1/2 hidden h-[44.4706px] w-[24px] -translate-y-1/2 items-center justify-center text-white lg:flex"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
          <button
            type="button"
            onClick={() =>
              triggerVitaChange((prev) => (prev + 1) % vitaSlides.length)
            }
            className="absolute right-6 top-1/2 hidden h-[44.4706px] w-[24px] -translate-y-1/2 items-center justify-center text-white lg:flex"
            aria-label="Next slide"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
          <div
            key={vitaSlides[vitaIndex].id}
            className={`mx-auto flex w-full max-w-[1036px] flex-col items-center gap-[80px] transition-opacity duration-500 sm:flex-row sm:justify-between lg:h-[711px] lg:items-center ${
              vitaFading ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <div className="flex w-full flex-col items-center gap-5 text-center sm:w-[55%] sm:items-start sm:text-left lg:pl-[30px] lg:h-[432px] lg:w-[509px]">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/80 sm:text-sm">
                {vitaSlides[vitaIndex].season}
              </p>
              <h2 className="text-[40px] font-bold leading-[52px] tracking-[0.2px] text-white sm:text-[48px] sm:leading-[64px] lg:h-[160px] lg:w-[509px] lg:text-[58px] lg:leading-[80px]">
                {vitaSlides[vitaIndex].title}
              </h2>
              <p className="text-sm text-white/75 sm:text-[14px] sm:leading-[20px] lg:w-[376px]">
                {vitaSlides[vitaIndex].description}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6 sm:justify-start">
                <span className="text-2xl font-semibold">{vitaSlides[vitaIndex].price}</span>
                <Link
                  to="/cart"
                  className="flex items-center justify-center rounded bg-emerald-500 px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white"
                >
                  Add to cart
                </Link>
              </div>
            </div>
            <div className="flex w-full items-center justify-center sm:w-[40%] lg:h-[599px] lg:w-[443px]">
              <img
                src={vitaSlides[vitaIndex].image}
                alt={vitaSlides[vitaIndex].title}
                className="mx-auto h-[260px] w-full object-contain object-center sm:h-[320px] lg:h-[685px] lg:w-[443px]"
              />
            </div>
          </div>
          <div className="mt-1 hidden w-full items-center justify-center lg:flex">
            <div className="flex h-[10px] w-[62px] overflow-hidden rounded-full bg-white/40">
              {vitaSlides.map((slide, index) => (
                <span
                  key={slide.id}
                  className={`h-full w-[31px] ${
                    vitaIndex === index ? 'bg-white' : 'bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[1440px] flex-col">
        <div className="flex w-full flex-col gap-6 bg-white px-4 py-2 sm:flex-row sm:items-center sm:justify-between lg:h-[682px]">
          <div className="flex w-full items-center justify-center sm:w-[50%]">
            <img
              src={coupleBanner}
              alt="Winter collection"
              className="mx-auto w-full max-w-[520px] object-contain object-center"
            />
          </div>
          <div className="flex w-full flex-col gap-4 sm:w-[45%]">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
              Summer 2020
            </p>
            <h3 className="text-3xl font-semibold text-slate-900">
              Part of the Neural Universe
            </h3>
            <p className="text-sm text-slate-500">
              We know how large objects will act, but things on a small scale.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => history.push('/shop')}
                className="flex items-center justify-center rounded bg-emerald-500 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white"
              >
                Buy now
              </button>
              <button
                type="button"
                onClick={() => history.push('/blog')}
                className="flex items-center justify-center rounded border border-emerald-500 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600"
              >
                Read more
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full flex-col gap-2">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[80px] pb-[112px] pt-[112px] lg:h-[1044px]">
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-500/90">
              Practice Advice
            </p>
            <h3 className="text-2xl font-semibold tracking-[0.01em] text-slate-900">
              Featured Posts
            </h3>
            <p className="text-xs text-slate-400/90">
              Problems trying to resolve the conflict between
            </p>
          </div>
          <div className="flex w-full flex-wrap gap-[30px]">
            {featuredPosts.map((post) => (
              <article
                key={post.id}
                className="flex w-full flex-col overflow-hidden rounded-lg border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-md sm:w-[calc(50%-15px)] lg:h-[540px] lg:w-[calc(33.333%-20px)]"
              >
                <div className="relative flex w-full">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-[260px] w-full bg-white object-contain object-center"
                  />
                  <span className="absolute left-4 top-4 rounded bg-rose-500 px-2 py-1 text-xs font-semibold text-white">
                    NEW
                  </span>
                </div>
                <div className="flex w-full flex-col gap-3 px-5 py-5">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="rounded-full bg-sky-50 px-2 py-0.5 text-sky-600">Google</span>
                    <span>Trending</span>
                    <span>New</span>
                  </div>
                  <h4 className="text-[14px] font-semibold text-slate-900">
                    {post.title}
                  </h4>
                  <p className="text-[12px] text-slate-500">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-sky-500" />
                      22 April 2021
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5 text-emerald-500" />
                      10 comments
                    </span>
                  </div>
                  <Link
                    to="/blog"
                    className="flex items-center gap-2 text-[12px] font-semibold text-slate-500 transition hover:text-slate-700"
                  >
                    Learn More
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

    </section>
  )
}

export default HomePage
