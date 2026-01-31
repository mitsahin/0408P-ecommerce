import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <section className="flex w-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">
      <p className="text-xs uppercase tracking-[0.35em] text-slate-400">404</p>
      <h2 className="text-2xl font-semibold text-slate-900">
        Page not found
      </h2>
      <p className="text-sm text-slate-500">
        The page you are looking for does not exist or has moved.
      </p>
      <Link
        to="/"
        className="flex w-fit items-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white"
      >
        Go back home
      </Link>
    </section>
  )
}

export default NotFound
