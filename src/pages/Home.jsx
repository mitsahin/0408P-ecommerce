import { ShoppingCart, Sparkles } from 'lucide-react'
import { toast } from 'react-toastify'

const Home = () => {
  const handleToast = () => {
    toast.success('Welcome! Project scaffolding is ready.')
  }

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <div className="flex items-center gap-3 text-slate-200">
          <div className="rounded-xl bg-slate-800 p-2">
            <ShoppingCart className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
              Starter
            </p>
            <h1 className="text-2xl font-semibold text-white">
              0408P Ecommerce UI
            </h1>
          </div>
        </div>
        <p className="text-slate-300">
          Redux, React Router v5, Tailwind, Axios, Toastify, and Lucide are
          wired up. Start building pages and features here.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleToast}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
          >
            <Sparkles className="h-4 w-4" />
            Show Toast
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500"
          >
            View Products
          </button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {['Catalog', 'Cart', 'Checkout'].map((label) => (
          <div
            key={label}
            className="rounded-xl border border-slate-800 bg-slate-900/20 p-4"
          >
            <p className="text-sm font-semibold text-white">{label}</p>
            <p className="text-sm text-slate-400">
              Ready for your next feature.
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Home
