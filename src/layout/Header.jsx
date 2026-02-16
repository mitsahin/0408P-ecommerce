import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink } from 'react-router-dom'
import md5 from 'blueimp-md5'
import {
  ChevronDown,
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

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const dispatch = useDispatch()
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

  const menuItems = [
    { label: 'Çanta', matchKeys: ['canta', 'bags'] },
    { label: 'Kemer', matchKeys: ['kemer', 'belts'] },
    { label: 'Kozmetik', matchKeys: ['kozmetik', 'cosmetics'] },
    { label: 'Şapka', matchKeys: ['sapka', 'hats'] },
  ]
  const buildMenuLink = (gender, item) => {
    const matchSlugs = Array.from(
      new Set([toSlug(item.label), ...(item.matchKeys ?? []).map((key) => toSlug(key))])
    )
    const match = categories.find((category) => {
      const titleSlug = toSlug(category.title ?? category.name ?? '')
      const categoryGender = toSlug(category.gender ?? '')
      const genderMatch = categoryGender === gender
      return genderMatch && matchSlugs.includes(titleSlug)
    })
    const fallback = categories.find((category) => {
      const titleSlug = toSlug(category.title ?? category.name ?? '')
      return matchSlugs.includes(titleSlug)
    })
    const categoryId = (match ?? fallback)?.id ?? '0'
    const categorySlug = matchSlugs[0] ?? toSlug(item.label)
    return `/shop/${gender}/${categorySlug}/${categoryId}`
  }


  const cartCount = cartItems.reduce((sum, item) => sum + (item.count ?? 0), 0)
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (item.count ?? 0) * Number(item.product?.price ?? 0),
    0
  )
  const discountRate = appliedCoupon === 'SAVE10' ? 0.1 : 0
  const discountedTotal = cartTotal * (1 - discountRate)
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
      <div className="w-full border-b border-slate-200 bg-white text-slate-900">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-4 py-4 sm:px-6 lg:h-[58px] lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div className="flex w-full items-center justify-between lg:w-auto">
            <Link to="/" className="text-xl font-bold text-slate-900">
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
              mobileOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <nav className="flex flex-col items-center gap-6 pt-4 text-lg font-semibold text-slate-600">
                <NavLink
                  to="/shop"
                  className="transition hover:text-slate-900"
                  activeClassName="text-slate-900"
                >
                  Shop
                </NavLink>
                <div className="flex w-full flex-col items-center gap-4 text-sm text-slate-500">
                  <div className="flex w-full flex-col items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Kadin
                    </span>
                    <div className="flex w-full flex-col gap-2">
                      {menuItems.map((item) => (
                        <Link
                          key={`mobile-kadin-${item.label}`}
                          to={buildMenuLink('kadin', item)}
                          className="text-center text-sm text-slate-600"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="flex w-full flex-col items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Erkek
                    </span>
                    <div className="flex w-full flex-col gap-2">
                      {menuItems.map((item) => (
                        <Link
                          key={`mobile-erkek-${item.label}`}
                          to={buildMenuLink('erkek', item)}
                          className="text-center text-sm text-slate-600"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                {categories.length > 0 ? (
                  <div className="flex w-full flex-col items-center gap-3 text-sm text-slate-500">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Categories
                    </span>
                    <div className="flex w-full flex-col gap-2">
                      {categories.map((category) => {
                        const gender = toSlug(category?.gender ?? 'kadin') || 'kadin'
                        const categorySlug = toSlug(category?.title ?? category?.name)
                        return (
                          <Link
                            key={category.id}
                            to={`/shop/${gender}/${categorySlug}/${category.id}`}
                            className="text-center text-sm text-slate-600"
                          >
                            {category.title ?? category.name}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                ) : null}
                <NavLink
                  to="/about"
                  className="transition hover:text-slate-900"
                  activeClassName="text-slate-900"
                >
                  About
                </NavLink>
                <NavLink
                  to="/blog"
                  className="transition hover:text-slate-900"
                  activeClassName="text-slate-900"
                >
                  Blog
                </NavLink>
                <NavLink
                  to="/contact"
                  className="transition hover:text-slate-900"
                  activeClassName="text-slate-900"
                >
                  Contact
                </NavLink>
                <NavLink
                  to="/pages"
                  className="transition hover:text-slate-900"
                  activeClassName="text-slate-900"
                >
                  Pages
                </NavLink>
                <NavLink
                  to="/team"
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
                <Link to="/login" className="flex items-center gap-2 text-sky-400">
                  <User className="h-5 w-5" />
                  Login
                </Link>
              )}
              {!userName ? (
                <Link to="/signup" className="flex items-center gap-2 text-sky-400">
                  Register
                </Link>
              ) : null}
              <Link to="/search" className="flex items-center">
                <Search className="h-6 w-6" />
              </Link>
              <Link to="/cart" className="flex items-center gap-1">
                <ShoppingCart className="h-6 w-6" />
                <span className="text-xs">{cartCount}</span>
              </Link>
              <Link to="/wishlist" className="flex items-center gap-1">
                <Heart className="h-6 w-6" />
                <span className="text-xs">1</span>
              </Link>
            </div>
          </div>
          <nav className="hidden flex-wrap items-center gap-6 text-[13px] font-semibold text-slate-500 lg:flex">
            <div className="relative flex items-center gap-1 text-slate-600 transition hover:text-slate-900 group">
              <NavLink
                to="/shop"
                className="flex items-center gap-1"
                activeClassName="text-slate-900"
              >
                Shop
                <ChevronDown className="h-4 w-4" />
              </NavLink>
              <div className="absolute left-1/2 top-full z-20 mt-3 hidden w-[500px] -translate-x-1/2 flex-col gap-5 border border-slate-100 bg-white px-8 py-7 text-slate-700 shadow-md before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:content-[''] group-hover:flex group-focus-within:flex">
                <div className="flex w-full justify-center gap-12">
                  <div className="flex w-1/2 flex-col gap-3">
                    <span className="text-[15px] font-semibold text-slate-800">
                      Kadin
                    </span>
                    {menuItems.map((item) => (
                      <Link
                        key={`kadin-${item.label}`}
                        to={buildMenuLink('kadin', item)}
                        className="text-[13px] font-semibold text-slate-500 transition hover:text-slate-900"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  <div className="flex w-1/2 flex-col gap-3">
                    <span className="text-[15px] font-semibold text-slate-800">
                      Erkek
                    </span>
                    {menuItems.map((item) => (
                      <Link
                        key={`erkek-${item.label}`}
                        to={buildMenuLink('erkek', item)}
                        className="text-[13px] font-semibold text-slate-500 transition hover:text-slate-900"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
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
          <div className="hidden flex-wrap items-center gap-6 text-[13px] font-semibold text-sky-500 lg:flex">
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
              <span className="text-xs">1</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
