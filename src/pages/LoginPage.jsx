import { Link } from 'react-router-dom'

const LoginPage = () => {
  return (
    <section className="flex w-full flex-col items-center gap-6">
      <div className="flex w-full max-w-[520px] flex-col gap-6 rounded border border-slate-200 bg-white p-6">
        <div className="flex w-full items-center justify-between border-b border-slate-200 pb-4 text-sm font-semibold">
          <span className="text-slate-900">Login</span>
          <Link to="/signup" className="text-sky-500">
            Register
          </Link>
        </div>
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Login</h1>
          <p className="text-sm text-slate-500">
            Welcome back! Please enter your details.
          </p>
        </div>
        <form className="flex w-full flex-col gap-4">
          <div className="flex w-full flex-col gap-2">
            <label className="text-xs text-slate-500">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="rounded border border-slate-200 px-3 py-2 text-sm text-slate-700"
            />
          </div>
          <div className="flex w-full flex-col gap-2">
            <label className="text-xs text-slate-500">Password</label>
            <input
              type="password"
              placeholder="********"
              className="rounded border border-slate-200 px-3 py-2 text-sm text-slate-700"
            />
          </div>
          <div className="flex w-full items-center justify-between text-xs text-slate-500">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4 rounded" />
              Remember me
            </label>
            <button type="button" className="text-sky-500">
              Forgot password?
            </button>
          </div>
          <button
            type="submit"
            className="rounded bg-slate-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white"
          >
            Login
          </button>
        </form>
        <div className="flex w-full items-center justify-center gap-2 text-xs text-slate-500">
          <span>Don&apos;t have an account?</span>
          <Link to="/signup" className="font-semibold text-sky-500">
            Register
          </Link>
        </div>
      </div>
    </section>
  )
}

export default LoginPage
