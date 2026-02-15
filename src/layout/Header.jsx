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

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const dispatch = useDispatch()
  const categories = useSelector((state) => state.products?.categories ?? [])
  const cartItems = useSelector((state) => state.shoppingCart?.cart ?? [])
  const user = useSelector((state) => state.client?.user ?? {})

  const toSlug = (value) =>
    String(value ?? '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

  const groupedCategories = useMemo(() => {
    const groups = { kadin: [], erkek: [], other: [] }
    categories.forEach((category) => {
      const gender = toSlug(category?.gender ?? category?.code ?? '')
      if (gender === 'kadin' || gender === 'kadinlar' || gender === 'women') {
        groups.kadin.push(category)
      } else if (gender === 'erkek' || gender === 'erkekler' || gender === 'men') {
        groups.erkek.push(category)
      } else {
        groups.other.push(category)
      }
    })
    return groups
  }, [categories])

  const getCategoryImage = (category, index) =>
    category?.image ||
    category?.img ||
    `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=facearea&w=80&h=80&q=80&sig=${index}`

  const cartCount = cartItems.reduce((sum, item) => sum + (item.count ?? 0), 0)
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (item.count ?? 0) * Number(item.product?.price ?? 0),
    0
  )
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
                {categories.length > 0 ? (
                  <div className="flex w-full flex-col items-center gap-3 text-sm text-slate-500">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Categories
                    </span>
                    <div className="flex w-full flex-col gap-2">
                      {categories.slice(0, 8).map((category) => {
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
              <div className="absolute left-0 top-full z-20 hidden w-[420px] flex-col gap-4 rounded border border-slate-200 bg-white p-4 text-slate-700 shadow-lg group-hover:flex">
                <div className="flex w-full gap-6">
                  <div className="flex w-1/2 flex-col gap-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Kadin
                    </span>
                    {groupedCategories.kadin.length === 0 ? (
                      <span className="text-xs text-slate-400">No categories</span>
                    ) : (
                      groupedCategories.kadin.slice(0, 6).map((category, index) => (
                        <Link
                          key={category.id}
                          to={`/shop/kadin/${toSlug(category.title ?? category.name)}/${category.id}`}
                          className="flex items-center gap-2 text-sm text-slate-600 transition hover:text-slate-900"
                        >
                          <img
                            src={getCategoryImage(category, index)}
                            alt={category.title ?? category.name}
                            className="h-8 w-8 rounded bg-slate-100 object-cover"
                          />
                          {category.title ?? category.name}
                        </Link>
                      ))
                    )}
                  </div>
                  <div className="flex w-1/2 flex-col gap-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Erkek
                    </span>
                    {groupedCategories.erkek.length === 0 ? (
                      <span className="text-xs text-slate-400">No categories</span>
                    ) : (
                      groupedCategories.erkek.slice(0, 6).map((category, index) => (
                        <Link
                          key={category.id}
                          to={`/shop/erkek/${toSlug(category.title ?? category.name)}/${category.id}`}
                          className="flex items-center gap-2 text-sm text-slate-600 transition hover:text-slate-900"
                        >
                          <img
                            src={getCategoryImage(category, index + 6)}
                            alt={category.title ?? category.name}
                            className="h-8 w-8 rounded bg-slate-100 object-cover"
                          />
                          {category.title ?? category.name}
                        </Link>
                      ))
                    )}
                  </div>
                </div>
                {groupedCategories.other.length > 0 ? (
                  <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
                    {groupedCategories.other.slice(0, 6).map((category) => (
                      <Link
                        key={category.id}
                        to={`/shop/kadin/${toSlug(category.title ?? category.name)}/${category.id}`}
                        className="transition hover:text-slate-900"
                      >
                        {category.title ?? category.name}
                      </Link>
                    ))}
                  </div>
                ) : null}
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
              <div className="absolute right-0 top-full z-20 hidden w-[280px] flex-col gap-3 rounded border border-slate-200 bg-white p-3 text-slate-700 shadow-lg group-hover:flex">
                <span className="text-xs font-semibold text-slate-500">
                  Sepetim ({cartCount} Urun)
                </span>
                <div className="flex max-h-[220px] flex-col gap-3 overflow-auto">
                  {cartItems.length === 0 ? (
                    <span className="text-xs text-slate-400">Cart is empty.</span>
                  ) : (
                    cartItems.map((item) => (
                      <div key={item.product?.id} className="flex gap-3">
                        <img
                          src={item.product?.image}
                          alt={item.product?.name ?? item.product?.title}
                          className="h-12 w-12 rounded bg-slate-100 object-contain"
                        />
                        <div className="flex flex-1 flex-col gap-1 text-xs">
                          <span className="font-semibold text-slate-700">
                            {item.product?.name ?? item.product?.title}
                          </span>
                          <span className="text-slate-400">Adet: {item.count}</span>
                          <span className="text-amber-600">
                            {Number(item.product?.price ?? 0).toFixed(2)} TL
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-xs">
                  <span className="text-slate-500">Total</span>
                  <span className="font-semibold text-slate-900">
                    {cartTotal.toFixed(2)} TL
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to="/cart"
                    className="flex-1 rounded border border-slate-200 px-3 py-2 text-center text-xs text-slate-600"
                  >
                    Sepete Git
                  </Link>
                  <Link
                    to="/order"
                    className="flex-1 rounded bg-amber-500 px-3 py-2 text-center text-xs font-semibold text-white"
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
