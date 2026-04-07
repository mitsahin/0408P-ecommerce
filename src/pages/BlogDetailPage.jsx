import { Link, useParams } from 'react-router-dom'
import { blogArticles } from '../data/blogArticles'

const BlogDetailPage = () => {
  const { slug } = useParams()
  const article = blogArticles.find((item) => item.slug === slug)

  if (!article) {
    return (
      <section className="flex w-full flex-col gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Blog
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-slate-900">Article not found</h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
            The article link may be outdated. You can return to the blog list and continue
            exploring.
          </p>
          <Link
            to="/blog"
            className="mt-5 inline-flex rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
          >
            Back to Blog
          </Link>
        </div>
      </section>
    )
  }

  return (
    <article className="flex w-full flex-col gap-6">
      <Link
        to="/blog"
        className="w-fit text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 transition hover:text-slate-700"
      >
        Back to Blog
      </Link>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <img
          src={article.image}
          alt={article.title}
          className="h-[260px] w-full object-cover object-center sm:h-[340px]"
        />
        <div className="px-6 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="rounded-full bg-sky-50 px-2 py-1 font-semibold uppercase tracking-[0.12em] text-sky-600">
              {article.tag}
            </span>
            <span className="font-medium text-slate-400">{article.readTime}</span>
            <span className="font-medium text-slate-400">{article.publishedAt}</span>
          </div>

          <h1 className="mt-4 text-2xl font-semibold text-slate-900 sm:text-3xl">{article.title}</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">{article.excerpt}</p>

          <div className="mt-6 space-y-4">
            {article.content.map((paragraph, index) => (
              <p key={`${article.id}-paragraph-${index}`} className="text-sm leading-7 text-slate-600">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}

export default BlogDetailPage
