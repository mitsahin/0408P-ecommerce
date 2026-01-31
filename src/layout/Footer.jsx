import { Facebook, Instagram, Twitter } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-500">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-10 lg:min-h-[488px]">
        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-lg font-semibold text-slate-900">Bandage</span>
          <div className="flex items-center gap-3 text-sky-500">
            <Facebook className="h-4 w-4" />
            <Instagram className="h-4 w-4" />
            <Twitter className="h-4 w-4" />
          </div>
        </div>
        <div className="h-px w-full bg-slate-200" />
        <div className="flex w-full flex-wrap gap-6 text-xs">
          <div className="flex w-full flex-col gap-3 sm:w-[18%]">
            <h4 className="text-sm font-semibold text-slate-900">Company Info</h4>
            <span>About Us</span>
            <span>Carrier</span>
            <span>We are hiring</span>
            <span>Blog</span>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-[18%]">
            <h4 className="text-sm font-semibold text-slate-900">Legal</h4>
            <span>About Us</span>
            <span>Carrier</span>
            <span>We are hiring</span>
            <span>Blog</span>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-[18%]">
            <h4 className="text-sm font-semibold text-slate-900">Features</h4>
            <span>Business Marketing</span>
            <span>User Analytic</span>
            <span>Live Chat</span>
            <span>Unlimited Support</span>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-[18%]">
            <h4 className="text-sm font-semibold text-slate-900">Resources</h4>
            <span>IOS & Android</span>
            <span>Watch a Demo</span>
            <span>Customers</span>
            <span>API</span>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-[24%]">
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
