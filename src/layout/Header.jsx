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
  return (
    <header className="flex w-full flex-col">
      <div className="hidden w-full bg-slate-900 text-white sm:block">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-2 text-xs sm:flex-row sm:items-center sm:justify-between">
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
            <Instagram className="h-4 w-4" />
            <Youtube className="h-4 w-4" />
            <Facebook className="h-4 w-4" />
            <Twitter className="h-4 w-4" />
          </div>
        </div>
      </div>
      <div className="w-full border-b border-slate-200 bg-white text-slate-900">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex w-full items-center justify-between lg:w-auto">
            <Link to="/" className="text-xl font-semibold">
            Bandage
            </Link>
            <div className="flex items-center gap-4 text-slate-700 lg:hidden">
              <Link to="/search" className="flex items-center">
                <Search className="h-5 w-5" />
              </Link>
              <Link to="/cart" className="flex items-center">
                <ShoppingCart className="h-5 w-5" />
              </Link>
              <button
                type="button"
                className="flex items-center"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
          <nav className="flex flex-col items-center gap-6 text-lg font-semibold text-slate-500 lg:hidden">
            <NavLink
              exact
              to="/"
              className="text-slate-600 transition hover:text-slate-900"
              activeClassName="text-slate-900"
            >
              Home
            </NavLink>
            <NavLink
              to="/shop"
              className="text-slate-600 transition hover:text-slate-900"
              activeClassName="text-slate-900"
            >
              Shop
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
          </nav>
          <nav className="hidden flex-wrap items-center gap-5 text-sm font-semibold text-slate-500 lg:flex">
            <NavLink
              exact
              to="/"
              className="text-slate-600 transition hover:text-slate-900"
              activeClassName="text-slate-900"
            >
              Home
            </NavLink>
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
          <div className="hidden flex-wrap items-center gap-4 text-sm font-semibold text-sky-500 lg:flex">
            <Link to="/signup" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Login / Register
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
