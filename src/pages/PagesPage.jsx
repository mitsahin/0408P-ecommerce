import { Link } from 'react-router-dom'

const PagesPage = () => {
  const quickPages = [
    { id: 'p1', name: 'About Us', to: '/about' },
    { id: 'p2', name: 'Contact', to: '/contact' },
    { id: 'p3', name: 'Team', to: '/team' },
    { id: 'p4', name: 'Shop', to: '/shop' },
  ]

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-8 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
          Navigation
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">Pages</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-500">
          Access all supporting pages from one clean panel.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {quickPages.map((item) => (
          <Link
            key={item.id}
            to={item.to}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
          >
            {item.name}
          </Link>
        ))}
      </div>
    </section>
  )
}

export default PagesPage
