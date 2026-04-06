import { Link } from 'react-router-dom'

const BlogPage = () => {
  const articles = [
    { id: 'b1', title: 'Top 10 styling tips for new season', tag: 'Fashion' },
    { id: 'b2', title: 'How to build a capsule wardrobe', tag: 'Guide' },
    { id: 'b3', title: 'Streetwear essentials this month', tag: 'Trends' },
  ]

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-8 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-sky-500">
          Practice Advice
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">Blog</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-500">
          Styling guides, seasonal edits and ecommerce growth tips in one place.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {articles.map((article) => (
          <article
            key={article.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="rounded-full bg-sky-50 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-sky-600">
              {article.tag}
            </span>
            <h2 className="mt-3 text-base font-semibold text-slate-900">{article.title}</h2>
            <p className="mt-2 text-sm text-slate-500">
              We focus on ergonomics and simple choices that improve daily style.
            </p>
          </article>
        ))}
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

export default BlogPage
