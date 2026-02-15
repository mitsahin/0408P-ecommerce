import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import axiosClient from '../api/axiosClient'
import { fetchRolesIfNeeded } from '../store/actions/clientActions'

const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
const phonePattern = /^(\+90|0)?5\d{9}$/
const taxPattern = /^T\d{4}V\d{6}$/
const ibanPattern = /^TR\d{24}$/

const SignupPage = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const roles = useSelector((state) => state.client?.roles ?? [])
  const [submitError, setSubmitError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      role_id: '',
    },
  })

  const selectedRoleId = watch('role_id')
  const selectedRole = useMemo(
    () => roles.find((role) => String(role.id) === String(selectedRoleId)),
    [roles, selectedRoleId]
  )
  const isStoreRole =
    selectedRole?.code === 'store' ||
    selectedRole?.name?.toLowerCase()?.includes('mağaza')

  useEffect(() => {
    dispatch(fetchRolesIfNeeded())
  }, [dispatch])

  useEffect(() => {
    if (roles.length === 0) return
    const customer = roles.find((role) => role.code === 'customer')
    if (customer) {
      setValue('role_id', String(customer.id), { shouldValidate: false })
    }
  }, [roles, setValue])

  const onSubmit = async (formData) => {
    setSubmitError('')
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role_id: Number(formData.role_id),
    }

    if (isStoreRole) {
      payload.store = {
        name: formData.store_name,
        phone: formData.store_phone,
        tax_no: formData.store_tax_no,
        bank_account: formData.store_bank_account,
      }
    }

    try {
      await axiosClient.post('/signup', payload)
      toast.warning(
        'You need to click link in email to activate your account!'
      )
      setTimeout(() => history.goBack(), 600)
    } catch (error) {
      setSubmitError(
        error?.response?.data?.message ||
          error?.message ||
          'Signup failed. Please try again.'
      )
    }
  }

  return (
    <section className="flex w-full flex-col gap-8">
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="text-slate-700">
          Home
        </Link>
        <span>/</span>
        <span className="text-slate-400">Sign Up</span>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-6 rounded border border-slate-200 bg-white p-4 sm:p-6"
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-slate-900">Create account</h1>
          <p className="text-sm text-slate-500">
            Create an account to start shopping.
          </p>
        </div>

        <div className="flex w-full flex-col gap-4 sm:flex-row">
          <div className="flex w-full flex-col gap-2">
            <label className="text-xs text-slate-500">Name</label>
            <input
              className="rounded border border-slate-200 px-3 py-2 text-sm text-slate-700"
              placeholder="Your name"
              {...register('name', {
                required: 'Name is required',
                minLength: {
                  value: 3,
                  message: 'Name must be at least 3 characters',
                },
              })}
            />
            {errors.name ? (
              <span className="text-xs text-rose-500">{errors.name.message}</span>
            ) : null}
          </div>
          <div className="flex w-full flex-col gap-2">
            <label className="text-xs text-slate-500">Email</label>
            <input
              className="rounded border border-slate-200 px-3 py-2 text-sm text-slate-700"
              placeholder="you@example.com"
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
        </div>

        <div className="flex w-full flex-col gap-4 sm:flex-row">
          <div className="flex w-full flex-col gap-2">
            <label className="text-xs text-slate-500">Password</label>
            <input
              type="password"
              className="rounded border border-slate-200 px-3 py-2 text-sm text-slate-700"
              placeholder="********"
              {...register('password', {
                required: 'Password is required',
                pattern: {
                  value: passwordPattern,
                  message:
                    'Min 8 chars, include upper, lower, number, special char',
                },
              })}
            />
            {errors.password ? (
              <span className="text-xs text-rose-500">
                {errors.password.message}
              </span>
            ) : null}
          </div>
          <div className="flex w-full flex-col gap-2">
            <label className="text-xs text-slate-500">Confirm password</label>
            <input
              type="password"
              className="rounded border border-slate-200 px-3 py-2 text-sm text-slate-700"
              placeholder="********"
              {...register('password_confirm', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === watch('password') || 'Passwords do not match',
              })}
            />
            {errors.password_confirm ? (
              <span className="text-xs text-rose-500">
                {errors.password_confirm.message}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex w-full flex-col gap-2">
          <label className="text-xs text-slate-500">Role</label>
          <select
            className="rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
            {...register('role_id', { required: 'Role is required' })}
          >
            <option value="" disabled>
              Select role
            </option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
          {errors.role_id ? (
            <span className="text-xs text-rose-500">{errors.role_id.message}</span>
          ) : null}
        </div>

        {isStoreRole ? (
          <div className="flex w-full flex-col gap-4 rounded border border-slate-200 bg-slate-50 p-4">
            <div className="flex w-full flex-col gap-2">
              <label className="text-xs text-slate-500">Store name</label>
              <input
                className="rounded border border-slate-200 px-3 py-2 text-sm text-slate-700"
                placeholder="Store name"
                {...register('store_name', {
                  required: 'Store name is required',
                  minLength: {
                    value: 3,
                    message: 'Store name must be at least 3 characters',
                  },
                })}
              />
              {errors.store_name ? (
                <span className="text-xs text-rose-500">
                  {errors.store_name.message}
                </span>
              ) : null}
            </div>
            <div className="flex w-full flex-col gap-4 sm:flex-row">
              <div className="flex w-full flex-col gap-2">
                <label className="text-xs text-slate-500">Store phone</label>
                <input
                  className="rounded border border-slate-200 px-3 py-2 text-sm text-slate-700"
                  placeholder="05xxxxxxxxx"
                  {...register('store_phone', {
                    required: 'Store phone is required',
                    pattern: {
                      value: phonePattern,
                      message: 'Enter a valid Türkiye phone number',
                    },
                  })}
                />
                {errors.store_phone ? (
                  <span className="text-xs text-rose-500">
                    {errors.store_phone.message}
                  </span>
                ) : null}
              </div>
              <div className="flex w-full flex-col gap-2">
                <label className="text-xs text-slate-500">Tax number</label>
                <input
                  className="rounded border border-slate-200 px-3 py-2 text-sm text-slate-700"
                  placeholder="T1234V123456"
                  {...register('store_tax_no', {
                    required: 'Tax number is required',
                    pattern: {
                      value: taxPattern,
                      message: 'Tax number must match TXXXXVXXXXXX',
                    },
                  })}
                />
                {errors.store_tax_no ? (
                  <span className="text-xs text-rose-500">
                    {errors.store_tax_no.message}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="flex w-full flex-col gap-2">
              <label className="text-xs text-slate-500">Bank account (IBAN)</label>
              <input
                className="rounded border border-slate-200 px-3 py-2 text-sm text-slate-700"
                placeholder="TRXXXXXXXXXXXXXXXXXXXXXXXX"
                {...register('store_bank_account', {
                  required: 'Bank account is required',
                  pattern: {
                    value: ibanPattern,
                    message: 'Enter a valid TR IBAN',
                  },
                })}
              />
              {errors.store_bank_account ? (
                <span className="text-xs text-rose-500">
                  {errors.store_bank_account.message}
                </span>
              ) : null}
            </div>
          </div>
        ) : null}

        {submitError ? (
          <div className="rounded border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-600">
            {submitError}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded bg-slate-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <span className="flex h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : null}
          Create account
        </button>
      </form>
    </section>
  )
}

export default SignupPage
