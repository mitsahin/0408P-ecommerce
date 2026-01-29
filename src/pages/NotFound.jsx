import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
      <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
        404
      </p>
      <h2 className="text-2xl font-semibold text-white">Page not found</h2>
      <p className="text-slate-300">
        The page you are looking for does not exist or has moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
      >
        Go back home
      </Link>
    </div>
  )
}

export default NotFound
