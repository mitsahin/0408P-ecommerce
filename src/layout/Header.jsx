import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, useHistory, useLocation } from 'react-router-dom'
import md5 from 'blueimp-md5'
import {
  ChevronDown,
  ChevronRight,
  Facebook,
  Heart,
  Instagram,
  Mail,
  Menu,
  Phone,
  Search,
  ShoppingCart,
  Twitter,
  User,
  Youtube,
} from 'lucide-react'
import { logoutUser } from '../store/actions/clientActions'
import { setAppliedCoupon, setCouponCode } from '../store/actions/shoppingCartActions'
import { readWishlistIds, WISHLIST_CHANGED_EVENT } from '../utils/wishlist'
import suitImage from '../assets/media bg-cover.png'
import topImage from '../assets/product-cover-5.png'
import shoeImage from '../assets/card-cover-7-3.jpg'
import jacketImage from '../assets/card-cover-7-11.jpg'
import shirtImage from '../assets/card-cover-5-1.jpg'
import knitwearImage from '../assets/vv1.jpg'
import trouserImage from '../assets/card-cover-7-1.jpg'

const Header = () => {
  const allProductsPath = '/shop'
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isDesktopShopOpen, setIsDesktopShopOpen] = useState(false)
  const [wishlistCount, setWishlistCount] = useState(() => readWishlistIds().length)
  const desktopShopMenuRef = useRef(null)
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()
  const categories = useSelector((state) => state.products?.categories ?? [])
  const cartItems = useSelector((state) => state.shoppingCart?.cart ?? [])
  const couponCode = useSelector((state) => state.shoppingCart?.couponCode ?? '')
  const appliedCoupon = useSelector(
    (state) => state.shoppingCart?.appliedCoupon ?? ''
  )
  const user = useSelector((state) => state.client?.user ?? {})

  const toSlug = (value) =>
    String(value ?? '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

  const normalizeGenderSlug = (value, fallback = 'kadin') => {
    const raw = toSlug(value ?? fallback)
    if (raw === 'k') return 'kadin'
    if (raw === 'e') return 'erkek'
    return raw || fallback
  }

  const menuCategoryConfig = [
    { key: 'tisort', label: 'Tişört', matchKeys: ['tisort', 'tshirt', 't-shirt'] },
    { key: 'ayakkabi', label: 'Ayakkabı', matchKeys: ['ayakkabi', 'shoe', 'sneaker'] },
    { key: 'ceket', label: 'Ceket', matchKeys: ['ceket', 'jacket', 'mont'] },
    {
      key: 'takim-elbise',
      label: 'Takım Elbise',
      matchKeys: ['takim-elbise', 'takim elbise', 'takim', 'suit', 'blazer'],
    },
    { key: 'gomlek', label: 'Gömlek', matchKeys: ['gomlek', 'shirt'] },
    { key: 'kazak', label: 'Kazak', matchKeys: ['kazak', 'sweater', 'knit'] },
    { key: 'pantalon', label: 'Pantalon', matchKeys: ['pantalon', 'pantolon', 'trouser', 'pants'] },
  ]
  const kidsMenuCategoryConfig = [
    { key: 'tisort', label: 'Tişört', matchKeys: ['kids', 'cocuk', 'bebek', 'genclik', 'tisort', 'tshirt', 't-shirt'] },
    { key: 'ayakkabi', label: 'Ayakkabı', matchKeys: ['kids', 'cocuk', 'ayakkabi', 'shoe', 'sneaker'] },
    { key: 'ceket', label: 'Ceket', matchKeys: ['kids', 'cocuk', 'ceket', 'jacket', 'mont'] },
    { key: 'gomlek', label: 'Gömlek', matchKeys: ['kids', 'cocuk', 'gomlek', 'shirt'] },
    { key: 'kazak', label: 'Kazak', matchKeys: ['kids', 'cocuk', 'kazak', 'sweater', 'knit'] },
    { key: 'pantalon', label: 'Pantalon', matchKeys: ['kids', 'cocuk', 'pantalon', 'pantolon', 'trouser', 'pants'] },
  ]
  const getCategoryFallbackImage = (menuKey, gender) => {
    const imageMap = {
      tisort: topImage,
      ayakkabi: shoeImage,
      ceket: jacketImage,
      'takim-elbise': suitImage,
      gomlek: shirtImage,
      kazak: knitwearImage,
      pantalon: trouserImage,
      canta: topImage,
      saat: jacketImage,
      sapka: knitwearImage,
      kemer: trouserImage,
      taki: shirtImage,
      cuzdan: shoeImage,
    }
    return imageMap[menuKey] || jacketImage
  }

  const groupedCategories = useMemo(() => {
    const groups = { kadin: [], erkek: [] }
    categories.forEach((category) => {
      const normalized = normalizeGenderSlug(category?.gender)
      if (normalized === 'erkek') groups.erkek.push(category)
      else groups.kadin.push(category)
    })
    return groups
  }, [categories])

  const buildMenuCategories = (source, config, menuGender) => {
    const fallbackCategoryId = source[0]?.id ?? categories[0]?.id ?? 1

    return config.map((item, index) => {
      const matched = source.find((category) => {
        const titleSlug = toSlug(category?.title ?? category?.name)
        return item.matchKeys.some((key) => titleSlug.includes(toSlug(key)))
      })

      return {
        id: matched?.id ?? source[index]?.id ?? fallbackCategoryId,
        title: matched?.title ?? matched?.name ?? item.label,
        menuTitle: item.label,
        menuGender,
        image:
          matched?.img ||
          matched?.image ||
          matched?.thumbnail ||
          getCategoryFallbackImage(item.key, menuGender),
      }
    })
  }

  const womenMenuCategories = useMemo(
    () => buildMenuCategories(groupedCategories.kadin, menuCategoryConfig, 'kadin'),
    [groupedCategories, categories]
  )
  const menMenuCategories = useMemo(
    () => buildMenuCategories(groupedCategories.erkek, menuCategoryConfig, 'erkek'),
    [groupedCategories, categories]
  )
  const kidsMenuCategories = useMemo(
    () => buildMenuCategories(categories, kidsMenuCategoryConfig, 'kids'),
    [groupedCategories, categories]
  )
  const getCategoryLink = (category, fallbackGender = 'kadin') => {
    const gender = normalizeGenderSlug(category?.gender ?? category?.menuGender, fallbackGender)
    const categorySlug = toSlug(category?.title ?? category?.name ?? category?.menuTitle)
    return `/shop/${gender}/${categorySlug}/${category.id}`
  }

  const closeMobileMenu = () => setMobileOpen(false)
  const closeAllMenus = () => {
    setMobileOpen(false)
    setIsDesktopShopOpen(false)
  }
  const goAllProducts = () => {
    closeAllMenus()
    if (location.pathname === allProductsPath && !location.search) return
    history.push(allProductsPath)
  }


  const cartCount = cartItems.reduce((sum, item) => sum + (item.count ?? 0), 0)
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (item.count ?? 0) * Number(item.product?.price ?? 0),
    0
  )
  const discountRate = appliedCoupon === 'SAVE10' ? 0.1 : 0
  const discountedTotal = cartTotal * (1 - discountRate)
  useEffect(() => {
    const syncWishlistCount = () => setWishlistCount(readWishlistIds().length)
    window.addEventListener(WISHLIST_CHANGED_EVENT, syncWishlistCount)
    window.addEventListener('storage', syncWishlistCount)
    return () => {
      window.removeEventListener(WISHLIST_CHANGED_EVENT, syncWishlistCount)
      window.removeEventListener('storage', syncWishlistCount)
    }
  }, [])

  useEffect(() => {
    closeAllMenus()
  }, [location.pathname, location.search])

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!desktopShopMenuRef.current) return
      if (!desktopShopMenuRef.current.contains(event.target)) {
        setIsDesktopShopOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])
  const userName = user?.name || user?.email || ''
  const gravatarHash = user?.email
    ? md5(String(user.email).trim().toLowerCase())
    : ''
  const gravatarUrl = user?.email
    ? `https://www.gravatar.com/avatar/${gravatarHash}?d=identicon`
    : null

  return (
    <header className="flex w-full flex-col">
      <div className="hidden w-full bg-[#252B42] text-white sm:block">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 px-4 py-2 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5" />
              (225) 555-0118
            </span>
            <span className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5" />
              michelle.rivera@example.com
            </span>
          </div>
          <span className="text-center text-xs font-semibold">
            Follow Us and get a chance to win 80% off
          </span>
          <div className="flex items-center justify-center gap-3">
            <span className="text-xs">Follow Us :</span>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer">
              <Youtube className="h-4 w-4" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <Twitter className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="w-full border-b border-slate-200 bg-white text-slate-900 shadow-sm">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-4 py-4 sm:px-6 lg:h-[68px] lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div className="flex w-full items-center justify-between lg:w-auto">
            <Link to="/" className="text-[24px] font-bold leading-none text-slate-900">
              Bandage
            </Link>
            <div className="flex items-center gap-4 text-slate-700 lg:hidden">
              <Link to="/search" className="flex items-center">
                <Search className="h-5 w-5 text-sky-400" />
              </Link>
              <Link to="/cart" className="flex items-center">
                <ShoppingCart className="h-5 w-5 text-sky-400" />
              </Link>
              <button
                type="button"
                className="flex items-center"
                aria-label="Open menu"
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((prev) => !prev)}
              >
                <Menu className="h-5 w-5 text-slate-900" />
              </button>
            </div>
          </div>
          <div
            className={`relative w-full overflow-hidden transition-all duration-300 lg:hidden ${
              mobileOpen
                ? 'max-h-[80vh] overflow-y-auto opacity-100'
                : 'max-h-0 opacity-0'
            }`}
          >
            <nav className="flex flex-col items-center gap-6 pt-4 text-lg font-semibold text-slate-600">
                <button
                  type="button"
                  onClick={goAllProducts}
                  className="transition hover:text-slate-900"
                >
                  Shop
                </button>
                <div className="grid w-full grid-cols-2 gap-2 text-xs">
                  <Link
                    to="/shop/kids"
                    onClick={closeMobileMenu}
                    className="rounded border border-slate-200 bg-white px-3 py-2 text-center font-semibold uppercase tracking-[0.12em] text-slate-600"
                  >
                    Kids
                  </Link>
                  <Link
                    to="/shop/kadin"
                    onClick={closeMobileMenu}
                    className="rounded border border-slate-200 bg-white px-3 py-2 text-center font-semibold uppercase tracking-[0.12em] text-slate-600"
                  >
                    Kadın
                  </Link>
                  <Link
                    to="/shop/erkek"
                    onClick={closeMobileMenu}
                    className="rounded border border-slate-200 bg-white px-3 py-2 text-center font-semibold uppercase tracking-[0.12em] text-slate-600"
                  >
                    Erkek
                  </Link>
                  <Link
                    to="/shop/accessories"
                    onClick={closeMobileMenu}
                    className="rounded border border-slate-200 bg-white px-3 py-2 text-center font-semibold uppercase tracking-[0.12em] text-slate-600"
                  >
                    Accessories
                  </Link>
                  <button
                    type="button"
                    onClick={goAllProducts}
                    className="col-span-2 rounded border border-slate-900 bg-slate-900 px-3 py-2 text-center font-semibold uppercase tracking-[0.12em] text-white"
                  >
                    Tüm Ürünler
                  </button>
                </div>
                <div className="flex w-full flex-col items-center gap-4 text-sm text-slate-500">
                  <div className="flex w-full flex-col items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Kids
                    </span>
                    <div className="grid w-full grid-cols-1 gap-2">
                      {kidsMenuCategories.map((item) => (
                        <Link
                          key={`mobile-kids-${item.menuTitle}`}
                          to={getCategoryLink(item, 'kids')}
                          onClick={closeMobileMenu}
                          className="flex items-center gap-3 rounded border border-slate-100 bg-white px-3 py-2 text-sm text-slate-600"
                        >
                          <img
                            src={item.image}
                            alt={item.menuTitle}
                            className="h-9 w-9 rounded border border-slate-100 object-cover"
                          />
                          {item.menuTitle}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="flex w-full flex-col items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Kadın
                    </span>
                    <div className="grid w-full grid-cols-1 gap-2">
                      {womenMenuCategories.map((item) => (
                        <Link
                          key={`mobile-kadin-${item.menuTitle}`}
                          to={getCategoryLink(item, 'kadin')}
                          onClick={closeMobileMenu}
                          className="flex items-center gap-3 rounded border border-slate-100 bg-white px-3 py-2 text-sm text-slate-600"
                        >
                          <img
                            src={item.image}
                            alt={item.menuTitle}
                            className="h-9 w-9 rounded border border-slate-100 object-cover"
                          />
                          {item.menuTitle}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="flex w-full flex-col items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Erkek
                    </span>
                    <div className="grid w-full grid-cols-1 gap-2">
                      {menMenuCategories.map((item) => (
                        <Link
                          key={`mobile-erkek-${item.menuTitle}`}
                          to={getCategoryLink(item, 'erkek')}
                          onClick={closeMobileMenu}
                          className="flex items-center gap-3 rounded border border-slate-100 bg-white px-3 py-2 text-sm text-slate-600"
                        >
                          <img
                            src={item.image}
                            alt={item.menuTitle}
                            className="h-9 w-9 rounded border border-slate-100 object-cover"
                          />
                          {item.menuTitle}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                <NavLink
                  to="/about"
                  onClick={closeMobileMenu}
                  className="transition hover:text-slate-900"
                  activeClassName="text-slate-900"
                >
                  About
                </NavLink>
                <NavLink
                  to="/blog"
                  onClick={closeMobileMenu}
                  className="transition hover:text-slate-900"
                  activeClassName="text-slate-900"
                >
                  Blog
                </NavLink>
                <NavLink
                  to="/contact"
                  onClick={closeMobileMenu}
                  className="transition hover:text-slate-900"
                  activeClassName="text-slate-900"
                >
                  Contact
                </NavLink>
                <NavLink
                  to="/pages"
                  onClick={closeMobileMenu}
                  className="transition hover:text-slate-900"
                  activeClassName="text-slate-900"
                >
                  Pages
                </NavLink>
                <NavLink
                  to="/team"
                  onClick={closeMobileMenu}
                  className="transition hover:text-slate-900"
                  activeClassName="text-slate-900"
                >
                  Team
                </NavLink>
            </nav>
            <div className="flex flex-col items-center gap-5 pb-6 pt-6 text-sky-500">
              {userName ? (
                <button
                  type="button"
                  onClick={() => dispatch(logoutUser())}
                  className="flex items-center gap-2 text-sky-400"
                >
                  <User className="h-5 w-5" />
                  Logout
                </button>
              ) : (
                <Link to="/login" onClick={closeMobileMenu} className="flex items-center gap-2 text-sky-400">
                  <User className="h-5 w-5" />
                  Login
                </Link>
              )}
              {!userName ? (
                <Link to="/signup" onClick={closeMobileMenu} className="flex items-center gap-2 text-sky-400">
                  Register
                </Link>
              ) : null}
              <Link to="/search" onClick={closeMobileMenu} className="flex items-center">
                <Search className="h-6 w-6" />
              </Link>
              <Link to="/cart" onClick={closeMobileMenu} className="flex items-center gap-1">
                <ShoppingCart className="h-6 w-6" />
                <span className="text-xs">{cartCount}</span>
              </Link>
              <Link to="/wishlist" onClick={closeMobileMenu} className="flex items-center gap-1">
                <Heart className="h-6 w-6" />
                <span className="text-xs">{wishlistCount}</span>
              </Link>
            </div>
          </div>
          <nav className="hidden flex-wrap items-center gap-7 text-[14px] font-semibold text-slate-500 lg:flex">
            <div
              ref={desktopShopMenuRef}
              className="relative flex items-center gap-1 text-slate-600 transition hover:text-slate-900"
            >
              <button
                type="button"
                onClick={goAllProducts}
                className="text-slate-600 transition hover:text-slate-900"
              >
                Shop
              </button>
              <button
                type="button"
                className="flex items-center text-slate-600 transition hover:text-slate-900"
                onClick={() => setIsDesktopShopOpen((prev) => !prev)}
                aria-expanded={isDesktopShopOpen}
                aria-label="Shop menu"
              >
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isDesktopShopOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`absolute left-1/2 top-full z-20 mt-3 w-[900px] -translate-x-1/2 flex-col gap-6 rounded-2xl border border-slate-100 bg-white/95 px-8 py-7 text-slate-700 shadow-2xl backdrop-blur ${
                  isDesktopShopOpen ? 'flex' : 'hidden'
                }`}
              >
                <div className="grid grid-cols-5 gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2">
                  <Link
                    to="/shop/kids"
                    onClick={closeAllMenus}
                    className="flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-700 transition hover:border-slate-300"
                  >
                    Kids
                  </Link>
                  <Link
                    to="/shop/kadin"
                    onClick={closeAllMenus}
                    className="flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-700 transition hover:border-slate-300"
                  >
                    Kadın
                  </Link>
                  <Link
                    to="/shop/erkek"
                    onClick={closeAllMenus}
                    className="flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-700 transition hover:border-slate-300"
                  >
                    Erkek
                  </Link>
                  <Link
                    to="/shop/accessories"
                    onClick={closeAllMenus}
                    className="flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-700 transition hover:border-slate-300"
                  >
                    Accessories
                  </Link>
                  <button
                    type="button"
                    onClick={goAllProducts}
                    className="flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-700 transition hover:border-slate-300"
                  >
                    Tüm Ürünler
                  </button>
                </div>
                <div className="flex w-full gap-4">
                  <div className="flex w-1/3 flex-col gap-3">
                    <span className="text-[15px] font-semibold text-slate-800">
                      Kids
                    </span>
                    {kidsMenuCategories.map((item) => (
                      <Link
                        key={`kids-${item.menuTitle}`}
                        to={getCategoryLink(item, 'kids')}
                        onClick={closeAllMenus}
                        className="group/item flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-3 py-2 text-[13px] font-semibold text-slate-500 transition hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                      >
                        <span className="flex-1">{item.menuTitle}</span>
                        <ChevronRight className="h-3.5 w-3.5 opacity-0 transition group-hover/item:opacity-100" />
                      </Link>
                    ))}
                  </div>
                  <div className="flex w-1/3 flex-col gap-3">
                    <span className="text-[15px] font-semibold text-slate-800">
                      Kadın
                    </span>
                    {womenMenuCategories.map((item) => (
                      <Link
                        key={`kadin-${item.menuTitle}`}
                        to={getCategoryLink(item, 'kadin')}
                        onClick={closeAllMenus}
                        className="group/item flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-3 py-2 text-[13px] font-semibold text-slate-500 transition hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                      >
                        <span className="flex-1">{item.menuTitle}</span>
                        <ChevronRight className="h-3.5 w-3.5 opacity-0 transition group-hover/item:opacity-100" />
                      </Link>
                    ))}
                  </div>
                  <div className="flex w-1/3 flex-col gap-3">
                    <span className="text-[15px] font-semibold text-slate-800">
                      Erkek
                    </span>
                    {menMenuCategories.map((item) => (
                      <Link
                        key={`erkek-${item.menuTitle}`}
                        to={getCategoryLink(item, 'erkek')}
                        onClick={closeAllMenus}
                        className="group/item flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-3 py-2 text-[13px] font-semibold text-slate-500 transition hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                      >
                        <span className="flex-1">{item.menuTitle}</span>
                        <ChevronRight className="h-3.5 w-3.5 opacity-0 transition group-hover/item:opacity-100" />
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-xs text-slate-400">Modern Collections</span>
                  <button
                    type="button"
                    onClick={goAllProducts}
                    className="flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 transition hover:text-slate-900"
                  >
                    Tümüne Gör
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
            <NavLink
              to="/about"
              className="text-slate-600 transition hover:text-slate-900"
              activeClassName="text-slate-900"
            >
              About
            </NavLink>
            <NavLink
              to="/blog"
              className="text-slate-600 transition hover:text-slate-900"
              activeClassName="text-slate-900"
            >
              Blog
            </NavLink>
            <NavLink
              to="/contact"
              className="text-slate-600 transition hover:text-slate-900"
              activeClassName="text-slate-900"
            >
              Contact
            </NavLink>
            <NavLink
              to="/pages"
              className="text-slate-600 transition hover:text-slate-900"
              activeClassName="text-slate-900"
            >
              Pages
            </NavLink>
            <NavLink
              to="/team"
              className="text-slate-600 transition hover:text-slate-900"
              activeClassName="text-slate-900"
            >
              Team
            </NavLink>
          </nav>
          <div className="hidden flex-wrap items-center gap-6 text-[14px] font-semibold text-sky-500 lg:flex">
            {userName ? (
              <div className="relative flex items-center gap-2 text-slate-600 group">
                {gravatarUrl ? (
                  <img
                    src={gravatarUrl}
                    alt={userName}
                    className="h-7 w-7 rounded-full bg-white"
                  />
                ) : (
                  <User className="h-4 w-4" />
                )}
                <span className="max-w-[120px] truncate text-xs font-semibold text-slate-700">
                  {userName}
                </span>
                <div className="absolute right-0 top-full z-20 hidden w-[200px] flex-col gap-2 rounded border border-slate-200 bg-white p-3 text-xs text-slate-600 shadow-lg group-hover:flex">
                  <Link to="/orders" className="transition hover:text-slate-900">
                    Previous orders
                  </Link>
                  <button
                    type="button"
                    onClick={() => dispatch(logoutUser())}
                    className="text-left text-rose-500 transition hover:text-rose-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 text-sky-500">
                <User className="h-4 w-4" />
                Login
              </Link>
            )}
            {!userName ? (
              <Link to="/signup" className="flex items-center gap-2 text-sky-500">
                Register
              </Link>
            ) : null}
            <Link to="/search" className="flex items-center">
              <Search className="h-4 w-4" />
            </Link>
            <div className="relative flex items-center gap-1 text-slate-600 group">
              <Link to="/cart" className="flex items-center gap-1">
                <ShoppingCart className="h-4 w-4" />
                <span className="text-xs">{cartCount}</span>
              </Link>
              <div className="absolute right-0 top-full z-20 hidden w-[320px] flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 text-slate-700 shadow-lg group-hover:flex">
                <span className="text-sm font-semibold text-slate-800">
                  Sepetim ({cartCount} Urun)
                </span>
                <div className="flex max-h-[260px] flex-col gap-3 overflow-auto">
                  {cartItems.length === 0 ? (
                    <span className="text-xs text-slate-400">Cart is empty.</span>
                  ) : (
                    cartItems.map((item, index) => {
                      const productTitle = item.product?.name ?? item.product?.title
                      const productDetail =
                        item.product?.description ?? item.product?.category?.name
                      const productSize =
                        item.product?.size ?? item.product?.detail ?? 'Tek Ebat'
                      return (
                        <div
                          key={`${item.product?.id}-${index}`}
                          className="flex gap-3 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0"
                        >
                          <img
                            src={item.product?.image}
                            alt={productTitle}
                            className="h-14 w-14 rounded border border-slate-100 bg-white object-contain"
                          />
                          <div className="flex flex-1 flex-col gap-1 text-xs">
                            <span className="font-semibold text-slate-800">
                              {productTitle}
                            </span>
                            {productDetail ? (
                              <span className="text-slate-500">
                                {productDetail}
                              </span>
                            ) : null}
                            <span className="text-slate-400">
                              Beden: {productSize} Adet: {item.count}
                            </span>
                            <span className="text-orange-500">
                              {Number(item.product?.price ?? 0).toFixed(2)} TL
                            </span>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    value={couponCode}
                    onChange={(event) =>
                      dispatch(setCouponCode(event.target.value))
                    }
                    placeholder="Indirim kodu"
                    className="flex-1 rounded border border-slate-200 px-3 py-2 text-xs text-slate-600"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      dispatch(
                        setAppliedCoupon(couponCode.trim().toUpperCase())
                      )
                    }
                    className="rounded border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600"
                  >
                    Uygula
                  </button>
                </div>
                {appliedCoupon ? (
                  <button
                    type="button"
                    onClick={() => {
                      dispatch(setAppliedCoupon(''))
                      dispatch(setCouponCode(''))
                    }}
                    className="text-left text-[11px] font-semibold text-rose-500"
                  >
                    Kuponu kaldir
                  </button>
                ) : null}
                <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-xs">
                  <span className="text-slate-500">Total</span>
                  <span className="font-semibold text-slate-900">
                    {discountedTotal.toFixed(2)} TL
                  </span>
                </div>
                {discountRate > 0 ? (
                  <span className="text-[11px] text-emerald-600">
                    SAVE10 uygulandi (-%10)
                  </span>
                ) : null}
                <div className="flex items-center gap-2">
                  <Link
                    to="/cart"
                    className="flex-1 rounded border border-slate-200 px-3 py-2 text-center text-xs font-semibold text-slate-600"
                  >
                    Sepete Git
                  </Link>
                  <Link
                    to="/order"
                    className="flex-1 rounded bg-orange-500 px-3 py-2 text-center text-xs font-semibold text-white"
                  >
                    Siparisi Tamamla
                  </Link>
                </div>
              </div>
            </div>
            <Link to="/wishlist" className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span className="text-xs">{wishlistCount}</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
