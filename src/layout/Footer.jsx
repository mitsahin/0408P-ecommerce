import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter } from 'lucide-react'
import { toast } from 'react-toastify'

const Footer = () => {
  const [email, setEmail] = useState('')

  const handleSubscribe = () => {
    const trimmed = email.trim()
    if (!trimmed || !trimmed.includes('@')) {
      toast.error('Geçerli bir e-posta adresi girin.')
      return
    }
    toast.success('Aboneliğiniz için teşekkürler!')
    setEmail('')
  }

  return (
    <footer className="border-t border-slate-200 bg-white text-slate-500" translate="no">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-8 px-4 py-10 sm:px-6 lg:py-14 lg:px-10">
        <div className="flex w-full flex-col items-center gap-4 text-center sm:flex-row sm:justify-center lg:justify-between">
          <Link to="/" className="text-lg font-semibold text-slate-900">
            Bandaj
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
        <div className="flex w-full flex-col flex-wrap gap-8 text-xs sm:flex-row">
          <div className="flex w-full flex-col items-center gap-3 text-center sm:w-[calc(50%-1rem)] sm:items-start sm:text-left lg:w-[calc(20%-1.6rem)]">
            <h4 className="text-sm font-semibold text-slate-900">Şirket</h4>
            <Link to="/about" className="transition hover:text-slate-700">
              Hakkımızda
            </Link>
            <Link to="/pages" className="transition hover:text-slate-700">
              Kariyer
            </Link>
            <Link to="/pages" className="transition hover:text-slate-700">
              İş ilanları
            </Link>
            <Link to="/blog" className="transition hover:text-slate-700">
              Blog
            </Link>
          </div>
          <div className="flex w-full flex-col items-center gap-3 text-center sm:w-[calc(50%-1rem)] sm:items-start sm:text-left lg:w-[calc(20%-1.6rem)]">
            <h4 className="text-sm font-semibold text-slate-900">Yasal</h4>
            <Link to="/about" className="transition hover:text-slate-700">
              Hakkımızda
            </Link>
            <Link to="/pages" className="transition hover:text-slate-700">
              Kariyer
            </Link>
            <Link to="/pages" className="transition hover:text-slate-700">
              İş ilanları
            </Link>
            <Link to="/blog" className="transition hover:text-slate-700">
              Blog
            </Link>
          </div>
          <div className="flex w-full flex-col items-center gap-3 text-center sm:w-[calc(50%-1rem)] sm:items-start sm:text-left lg:w-[calc(20%-1.6rem)]">
            <h4 className="text-sm font-semibold text-slate-900">Özellikler</h4>
            <Link to="/pages" className="transition hover:text-slate-700">
              İşletme pazarlama
            </Link>
            <Link to="/pages" className="transition hover:text-slate-700">
              Kullanıcı analitikleri
            </Link>
            <Link to="/contact" className="transition hover:text-slate-700">
              Canlı sohbet
            </Link>
            <Link to="/contact" className="transition hover:text-slate-700">
              Sınırsız destek
            </Link>
          </div>
          <div className="flex w-full flex-col items-center gap-3 text-center sm:w-[calc(50%-1rem)] sm:items-start sm:text-left lg:w-[calc(20%-1.6rem)]">
            <h4 className="text-sm font-semibold text-slate-900">Kaynaklar</h4>
            <Link to="/pages" className="transition hover:text-slate-700">
              iOS ve Android
            </Link>
            <Link to="/pages" className="transition hover:text-slate-700">
              Demo izle
            </Link>
            <Link to="/team" className="transition hover:text-slate-700">
              Müşteriler
            </Link>
            <Link to="/pages" className="transition hover:text-slate-700">
              API
            </Link>
          </div>
          <div className="flex w-full flex-col items-center gap-3 text-center sm:w-[calc(50%-1rem)] sm:items-start sm:text-left lg:w-[calc(20%-1.6rem)]">
            <h4 className="text-sm font-semibold text-slate-900">İletişim</h4>
            <div className="flex w-full overflow-hidden rounded-lg border border-slate-200">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="E-posta adresiniz"
                className="w-full border-0 px-3 py-2 text-xs text-slate-500 outline-none"
              />
              <button
                type="button"
                onClick={handleSubscribe}
                className="flex items-center justify-center bg-sky-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-sky-600"
              >
                Abone ol
              </button>
            </div>
            <span className="text-xs text-slate-400">Kampanya ve haberler için abone olun</span>
          </div>
        </div>
        <div className="pt-2 text-xs text-slate-400">
          Finlandiya&apos;da sevgiyle yapıldı · Tüm hakları saklıdır
        </div>
      </div>
    </footer>
  )
}

export default Footer
