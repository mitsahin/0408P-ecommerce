import { Link } from 'react-router-dom'

const AboutPage = () => {
  return (
    <section className="flex w-full flex-col gap-8">
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="text-slate-700">
          Home
        </Link>
        <span>/</span>
        <span className="text-slate-400">About</span>
      </div>
      <div className="flex w-full flex-col gap-6 rounded border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
        <div className="flex w-full flex-col gap-4 sm:w-[55%]">
          <h1 className="text-2xl font-semibold text-slate-900">
            About Bandage
          </h1>
          <p className="text-sm text-slate-500">
            We build modern shopping experiences focused on clarity, speed, and
            customer delight. Our team blends design and engineering to deliver
            a seamless ecommerce experience.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <span>Founded 2024</span>
            <span>•</span>
            <span>Global team</span>
            <span>•</span>
            <span>24/7 support</span>
          </div>
          <Link
            to="/shop"
            className="flex w-fit items-center rounded bg-slate-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white"
          >
            Explore products
          </Link>
        </div>
        <div className="flex w-full flex-col gap-4 sm:w-[40%]">
          <div className="flex w-full flex-col gap-2 rounded border border-slate-200 bg-slate-50 px-4 py-4">
            <span className="text-xs text-slate-500">Our mission</span>
            <span className="text-sm font-semibold text-slate-900">
              Make shopping effortless
            </span>
            <span className="text-xs text-slate-500">
              Design-first experiences with reliable delivery.
            </span>
          </div>
          <div className="flex w-full flex-col gap-2 rounded border border-slate-200 bg-slate-50 px-4 py-4">
            <span className="text-xs text-slate-500">Our promise</span>
            <span className="text-sm font-semibold text-slate-900">
              Trusted quality
            </span>
            <span className="text-xs text-slate-500">
              Curated items with clear pricing and support.
            </span>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col gap-6 rounded border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-slate-900">
            Our values
          </h2>
          <p className="text-sm text-slate-500">
            We focus on clear pricing, reliable delivery, and thoughtful design.
          </p>
        </div>
        <div className="flex w-full flex-col gap-4 sm:flex-row">
          <div className="flex w-full flex-col gap-2 rounded border border-slate-200 bg-slate-50 px-4 py-4">
            <span className="text-xs text-slate-500">Customer first</span>
            <span className="text-sm font-semibold text-slate-900">
              Support that listens
            </span>
            <span className="text-xs text-slate-500">
              Real people, real help, around the clock.
            </span>
          </div>
          <div className="flex w-full flex-col gap-2 rounded border border-slate-200 bg-slate-50 px-4 py-4">
            <span className="text-xs text-slate-500">Quality</span>
            <span className="text-sm font-semibold text-slate-900">
              Curated selection
            </span>
            <span className="text-xs text-slate-500">
              Every item is vetted for reliability.
            </span>
          </div>
          <div className="flex w-full flex-col gap-2 rounded border border-slate-200 bg-slate-50 px-4 py-4">
            <span className="text-xs text-slate-500">Speed</span>
            <span className="text-sm font-semibold text-slate-900">
              Fast delivery
            </span>
            <span className="text-xs text-slate-500">
              Optimized logistics for fast arrivals.
            </span>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col gap-6 rounded border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-col gap-2 sm:w-[60%]">
          <h2 className="text-lg font-semibold text-slate-900">
            Join the Bandage community
          </h2>
          <p className="text-sm text-slate-500">
            Discover our latest collections and meet the team behind the brand.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 text-xs font-semibold uppercase tracking-[0.2em] sm:w-[35%]">
          <Link
            to="/team"
            className="flex w-full items-center justify-center rounded border border-slate-200 px-4 py-3 text-slate-700"
          >
            Meet the team
          </Link>
          <Link
            to="/contact"
            className="flex w-full items-center justify-center rounded bg-slate-900 px-4 py-3 text-white"
          >
            Contact us
          </Link>
        </div>
      </div>
    </section>
  )
}

export default AboutPage
