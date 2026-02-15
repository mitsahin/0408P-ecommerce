import { useDispatch } from 'react-redux'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { loginUser } from '../store/actions/clientActions'

const LoginPage = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (formData) => {
    try {
      await dispatch(
        loginUser({
          email: formData.email,
          password: formData.password,
          remember: formData.remember,
        })
      )
      const redirectTo = location.state?.from ?? '/'
      history.push(redirectTo)
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          'Login failed. Please try again.'
      )
    }
  }

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
        <form className="flex w-full flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex w-full flex-col gap-2">
            <label className="text-xs text-slate-500">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="rounded border border-slate-200 px-3 py-2 text-sm text-slate-700"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid email address',
                },
              })}
            />
            {errors.email ? (
              <span className="text-xs text-rose-500">{errors.email.message}</span>
            ) : null}
          </div>
          <div className="flex w-full flex-col gap-2">
            <label className="text-xs text-slate-500">Password</label>
            <input
              type="password"
              placeholder="********"
              className="rounded border border-slate-200 px-3 py-2 text-sm text-slate-700"
              {...register('password', {
                required: 'Password is required',
              })}
            />
            {errors.password ? (
              <span className="text-xs text-rose-500">
                {errors.password.message}
              </span>
            ) : null}
          </div>
          <div className="flex w-full items-center justify-between text-xs text-slate-500">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded"
                {...register('remember')}
              />
              Remember me
            </label>
            <button type="button" className="text-sky-500">
              Forgot password?
            </button>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded bg-slate-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
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
