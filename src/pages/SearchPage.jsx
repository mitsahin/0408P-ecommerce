import { Link } from 'react-router-dom'

const SearchPage = () => {
  return (
    <section className="flex w-full flex-col gap-6">
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-8 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
          Discover
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">Search</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-500">
          Use header search to find products by name, category and style.
        </p>
      </div>
      <Link
        to="/"
        className="flex w-fit items-center rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
      >
        Back to Home
      </Link>
    </section>
  )
}

export default SearchPage
