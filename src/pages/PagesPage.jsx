import { Link } from 'react-router-dom'

const PagesPage = () => {
  const pageCards = [
    {
      id: 'p1',
      name: 'About Us',
      to: '/about',
      label: 'Brand Story',
      description:
        'Learn our mission, product standards, and how we build a trusted shopping experience.',
    },
    {
      id: 'p2',
      name: 'Contact',
      to: '/contact',
      label: 'Support',
      description:
        'Reach us for order help, product questions, and business inquiries in one place.',
    },
    {
      id: 'p3',
      name: 'Team',
      to: '/team',
      label: 'People',
      description:
        'Meet the people behind the platform and see the teams that keep everything moving.',
    },
    {
      id: 'p4',
      name: 'Shop',
      to: '/shop',
      label: 'Products',
      description:
        'Browse all categories, discover new arrivals, and go directly to your ideal products.',
    },
  ]

  return (
    <section className="flex w-full flex-col gap-8">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-900 px-6 py-10 text-white sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-sky-100/80">
            Navigation Center
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">Pages</h1>
          <p className="mt-3 max-w-2xl text-sm text-sky-100/90 sm:text-base">
            Access your key site pages from one clean panel and move faster between support,
            brand, and shopping flows.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/shop"
              className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Go to Shop
            </Link>
            <Link
              to="/contact"
              className="rounded-xl border border-white/35 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {pageCards.map((item) => (
          <Link
            key={item.id}
            to={item.to}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">{item.name}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
            <span className="mt-4 inline-flex items-center text-sm font-semibold text-sky-600 transition group-hover:text-sky-700">
              Open page
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default PagesPage
