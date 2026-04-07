import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { blogArticles } from '../data/blogArticles'

const BlogPage = () => {
  const [page, setPage] = useState(1)
  const perPage = 3
  const totalPages = Math.ceil(blogArticles.length / perPage)
  const articles = useMemo(() => {
    const start = (page - 1) * perPage
    return blogArticles.slice(start, start + perPage)
  }, [page])

  return (
    <section className="flex w-full flex-col gap-8">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-900 px-6 py-10 text-white sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-sky-100/80">
            Journal
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
            Blog & Insights
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-sky-100/90 sm:text-base">
            Styling guides, seasonal edits and ecommerce growth ideas prepared by our team.
          </p>
          <div className="mt-6">
            <Link
              to="/shop"
              className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Explore Products
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {articles.map((article) => (
          <article
            key={article.id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          >
            <img
              src={article.image}
              alt={article.title}
              className="h-44 w-full object-cover object-center"
              loading="lazy"
            />
            <div className="p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-sky-50 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-sky-600">
                  {article.tag}
                </span>
                <span className="text-xs font-medium text-slate-400">{article.readTime}</span>
              </div>
              <h2 className="mt-3 text-base font-semibold text-slate-900">{article.title}</h2>
              <p className="mt-2 text-sm text-slate-500">{article.excerpt}</p>
              <Link
                to={`/blog/${article.slug}`}
                className="mt-4 inline-flex items-center text-sm font-semibold text-sky-600 transition hover:text-sky-700"
              >
                Read more
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-2 text-xs font-semibold text-slate-500">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  )
}

export default BlogPage
