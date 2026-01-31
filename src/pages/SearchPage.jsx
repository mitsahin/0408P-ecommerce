import { Link } from 'react-router-dom'

const SearchPage = () => {
  return (
    <section className="flex w-full flex-col gap-6">
      <h1 className="text-2xl font-semibold text-slate-900">Search</h1>
      <p className="text-sm text-slate-500">
        Search products. This page is a placeholder.
      </p>
      <Link
        to="/"
        className="flex w-fit items-center rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700"
      >
        Back to Home
      </Link>
    </section>
  )
}

export default SearchPage
