import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-500">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-6 px-4 py-10 sm:px-6 lg:h-[488px] lg:justify-center lg:px-10">
        <div className="flex w-full flex-col items-center gap-4 text-center sm:flex-row sm:justify-center lg:justify-between">
          <Link to="/" className="text-lg font-semibold text-slate-900">
            Bandage
          </Link>
          <div className="flex items-center gap-3 text-sky-500">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <Twitter className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div className="h-px w-full bg-slate-200" />
        <div className="flex w-full flex-wrap justify-center gap-6 text-xs lg:justify-between">
          <div className="flex w-full flex-col items-center gap-3 text-center sm:w-[18%] sm:items-start sm:text-left">
            <h4 className="text-sm font-semibold text-slate-900">Company Info</h4>
            <Link to="/about" className="transition hover:text-slate-700">
              About Us
            </Link>
            <Link to="/pages" className="transition hover:text-slate-700">
              Carrier
            </Link>
            <Link to="/pages" className="transition hover:text-slate-700">
              We are hiring
            </Link>
            <Link to="/blog" className="transition hover:text-slate-700">
              Blog
            </Link>
          </div>
          <div className="flex w-full flex-col items-center gap-3 text-center sm:w-[18%] sm:items-start sm:text-left">
            <h4 className="text-sm font-semibold text-slate-900">Legal</h4>
            <Link to="/about" className="transition hover:text-slate-700">
              About Us
            </Link>
            <Link to="/pages" className="transition hover:text-slate-700">
              Carrier
            </Link>
            <Link to="/pages" className="transition hover:text-slate-700">
              We are hiring
            </Link>
            <Link to="/blog" className="transition hover:text-slate-700">
              Blog
            </Link>
          </div>
          <div className="flex w-full flex-col items-center gap-3 text-center sm:w-[18%] sm:items-start sm:text-left">
            <h4 className="text-sm font-semibold text-slate-900">Features</h4>
            <Link to="/pages" className="transition hover:text-slate-700">
              Business Marketing
            </Link>
            <Link to="/pages" className="transition hover:text-slate-700">
              User Analytic
            </Link>
            <Link to="/contact" className="transition hover:text-slate-700">
              Live Chat
            </Link>
            <Link to="/contact" className="transition hover:text-slate-700">
              Unlimited Support
            </Link>
          </div>
          <div className="flex w-full flex-col items-center gap-3 text-center sm:w-[18%] sm:items-start sm:text-left">
            <h4 className="text-sm font-semibold text-slate-900">Resources</h4>
            <Link to="/pages" className="transition hover:text-slate-700">
              IOS & Android
            </Link>
            <Link to="/pages" className="transition hover:text-slate-700">
              Watch a Demo
            </Link>
            <Link to="/team" className="transition hover:text-slate-700">
              Customers
            </Link>
            <Link to="/pages" className="transition hover:text-slate-700">
              API
            </Link>
          </div>
          <div className="flex w-full flex-col items-center gap-3 text-center sm:w-[24%] sm:items-start sm:text-left">
            <h4 className="text-sm font-semibold text-slate-900">Get In Touch</h4>
            <div className="flex w-full">
              <input
                type="email"
                placeholder="Your Email"
                className="w-full border border-slate-200 px-3 py-2 text-xs text-slate-500"
              />
              <button
                type="button"
                className="flex items-center justify-center bg-sky-500 px-4 py-2 text-xs font-semibold text-white"
              >
                Subscribe
              </button>
            </div>
            <span className="text-xs text-slate-400">Lore imp sum dolor Amit</span>
          </div>
        </div>
        <div className="pt-2 text-xs text-slate-400">
          Made With Love By Finland All Right Reserved
        </div>
      </div>
    </footer>
  )
}

export default Footer
