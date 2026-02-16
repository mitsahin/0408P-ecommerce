import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const ContactPage = () => {
  const handleSubmit = (event) => {
    event.preventDefault()
    toast.success('Message sent. We will get back to you soon!')
    event.currentTarget.reset()
  }

  return (
    <section className="flex w-full flex-col gap-8">
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="text-slate-700">
          Home
        </Link>
        <span>/</span>
        <span className="text-slate-400">Contact</span>
      </div>
      <div className="flex w-full flex-col gap-6 rounded border border-slate-200 bg-white p-4 sm:flex-row sm:gap-8">
        <div className="flex w-full flex-col gap-4 sm:w-[45%]">
          <h1 className="text-2xl font-semibold text-slate-900">
            Get in touch
          </h1>
          <p className="text-sm text-slate-500">
            We would love to hear from you. Our friendly team is always here to
            help.
          </p>
          <div className="flex flex-col gap-2 text-sm text-slate-500">
            <span>Phone: (225) 555-0118</span>
            <span>Email: michelle.rivera@example.com</span>
            <span>Address: 123 Main Street, Istanbul</span>
          </div>
        </div>
        <form
          className="flex w-full flex-col gap-4 sm:w-[55%]"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-2">
            <label className="text-xs text-slate-500">Full name</label>
            <input
              className="rounded border border-slate-200 px-3 py-2 text-sm text-slate-700"
              placeholder="Your name"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs text-slate-500">Email address</label>
            <input
              className="rounded border border-slate-200 px-3 py-2 text-sm text-slate-700"
              placeholder="you@example.com"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs text-slate-500">Message</label>
            <textarea
              className="min-h-[120px] rounded border border-slate-200 px-3 py-2 text-sm text-slate-700"
              placeholder="Tell us more"
            />
          </div>
          <button
            type="submit"
            className="rounded bg-slate-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white"
          >
            Send message
          </button>
        </form>
      </div>
    </section>
  )
}

export default ContactPage
