import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import contactHero from '../assets/shop-hero-1-product-slide-1.jpg'

const ContactPage = () => {
  const handleSubmit = (event) => {
    event.preventDefault()
    toast.success('Message sent. We will get back to you soon!')
    event.currentTarget.reset()
  }

  return (
    <section className="flex w-full flex-col gap-8">
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="text-slate-700">
          Home
        </Link>
        <span>/</span>
        <span className="text-slate-400">Contact</span>
      </div>
      <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-[#0B5E73] text-white shadow-sm lg:h-[757px]">
        <img
          src={contactHero}
          alt="Contact visual"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: '72% 16%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#073B4C]/95 via-[#0B5E73]/78 to-[#0B5E73]/18" />
        <div className="absolute inset-y-0 left-0 hidden w-[14%] bg-[#073B4C]/95 lg:block" />
        <div className="relative z-10 flex w-full flex-col gap-8 px-6 py-8 sm:px-8 lg:ml-[195px] lg:h-[757px] lg:w-[1050px] lg:flex-row lg:items-center lg:justify-center lg:gap-24 lg:pt-[112px] lg:pb-[112px] lg:px-0">
          <div className="flex w-full flex-col gap-4 lg:w-[40%]">
            <h1 className="text-[40px] font-bold leading-[48px] tracking-[0.2px] text-white">
              CONTACT US
            </h1>
            <p className="max-w-[320px] text-xs leading-5 text-white/85">
              Problems trying to resolve the conflict between the two major
              realms of Classical physics: Newtonian mechanics
            </p>
            <button
              type="button"
              onClick={() => toast.success('Thanks! Our contact team will reach you soon.')}
              className="w-fit rounded bg-sky-500 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-sky-600"
            >
              Contact Us
            </button>
          </div>
          <div className="grid w-full grid-cols-2 gap-x-8 gap-y-8 text-white lg:w-[60%]">
            {[
              { city: 'Paris', line1: '1901 Thorn ridge Cir.', line2: '75000 Paris' },
              { city: 'New York', line1: '2715 Ash Dr. San Jose,', line2: '75000 Paris' },
              { city: 'Berlin', line1: '4140 Parker Rd.', line2: '75000 Paris' },
              { city: 'London', line1: '3517 W. Gray St. Utica,', line2: '75000 Paris' },
            ].map((office, index) => (
              <div
                key={office.city}
                className={`flex flex-col gap-2 lg:px-5 ${
                  index < 2 ? 'lg:border-b lg:border-white/20 lg:pb-5' : ''
                } ${index % 2 === 0 ? 'lg:border-r lg:border-white/20 lg:pr-6' : ''}`}
              >
                <h2 className="text-[20px] font-bold leading-7">{office.city}</h2>
                <p className="text-xs font-semibold text-white/90">{office.line1}</p>
                <p className="text-xs font-semibold text-white/90">{office.line2}</p>
                <p className="text-[11px] text-white/85">Phone : +451 215 215</p>
                <p className="text-[11px] text-white/85">Fax : +451 215 215</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <form
        className="flex w-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        onSubmit={handleSubmit}
      >
        <h2 className="text-lg font-semibold text-slate-900">Quick Message</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-300"
            placeholder="Full name"
          />
          <input
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-300"
            placeholder="Email address"
          />
        </div>
        <textarea
          className="min-h-[110px] rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-300"
          placeholder="Tell us more"
        />
        <button
          type="submit"
          className="w-fit rounded-full bg-slate-900 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-slate-800"
        >
          Send Message
        </button>
      </form>
    </section>
  )
}

export default ContactPage
