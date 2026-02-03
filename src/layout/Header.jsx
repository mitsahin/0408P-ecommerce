import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
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

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false)

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
            </nav>
          <div className="flex flex-col items-center gap-5 pb-6 pt-6 text-sky-500">
              <Link to="/login" className="flex items-center gap-2 text-sky-400">
                <User className="h-5 w-5" />
                Login
              </Link>
              <Link to="/signup" className="flex items-center gap-2 text-sky-400">
                Register
              </Link>
              <Link to="/search" className="flex items-center">
                <Search className="h-6 w-6" />
              </Link>
              <Link to="/cart" className="flex items-center gap-1">
                <ShoppingCart className="h-6 w-6" />
                <span className="text-xs">1</span>
              </Link>
              <Link to="/wishlist" className="flex items-center gap-1">
                <Heart className="h-6 w-6" />
                <span className="text-xs">1</span>
              </Link>
            </div>
          </div>
          <nav className="hidden flex-wrap items-center gap-6 text-[13px] font-semibold text-slate-500 lg:flex">
            <NavLink
              to="/shop"
              className="flex items-center gap-1 text-slate-600 transition hover:text-slate-900"
              activeClassName="text-slate-900"
            >
              Shop
              <ChevronDown className="h-4 w-4" />
            </NavLink>
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
            <Link to="/login" className="flex items-center gap-2 text-sky-500">
              <User className="h-4 w-4" />
              Login
            </Link>
            <Link to="/signup" className="flex items-center gap-2 text-sky-500">
              Register
            </Link>
            <Link to="/search" className="flex items-center">
              <Search className="h-4 w-4" />
            </Link>
            <Link to="/cart" className="flex items-center gap-1">
              <ShoppingCart className="h-4 w-4" />
              <span className="text-xs">1</span>
            </Link>
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
