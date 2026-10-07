import type { FormEvent } from 'react'
import { useState } from 'react'
import { navigateTo, routePaths } from '../../../app/router/routePaths'
import { FormError } from '../../../shared/forms/FormError'
import { Input } from '../../../shared/forms/Input'
import { AuthCard, AuthPrimaryButton } from '../components/AuthCard'
import { AuthHeader } from '../components/AuthHeader'
import { PasswordField } from '../components/PasswordField'
import { useAuth } from '../hooks/useAuth'
import { validateEmail, validateRequiredPassword } from '../utils/authValidation'

type LoginErrors = {
  email?: string
  password?: string
  form?: string
}

export function LoginPage() {
  const { login, notice } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [errors, setErrors] = useState<LoginErrors>({})
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors: LoginErrors = {
      email: validateEmail(email),
      password: validateRequiredPassword(password),
    }

    if (nextErrors.email || nextErrors.password) {
      setErrors(nextErrors)
      return
    }

    setSubmitting(true)
    const result = await login({ email, password, remember })
    setSubmitting(false)
    if (!result.ok) {
      // error.message from the API is written to be shown as-is (incl. 429 RATE_LIMITED).
      setErrors({ form: result.error })
      return
    }

    navigateTo(routePaths.userManagement, { replace: true })
  }

  return (
    <AuthCard>
      <AuthHeader title="Welcome back" subtitle="Sign in to manage Kinvo operations" />
      <form className="grid gap-5" onSubmit={(event) => void handleSubmit(event)} noValidate>
        <div className="grid gap-2">
          <Input
            label="Email"
            type="email"
            value={email}
            autoComplete="email"
            placeholder="admin@kinvo.app"
            className={errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : undefined}
            aria-invalid={Boolean(errors.email)}
            onChange={(event) => {
              setEmail(event.target.value)
              setErrors((current) => ({ ...current, email: undefined, form: undefined }))
            }}
          />
          <FormError message={errors.email} />
        </div>

        <PasswordField
          label="Password"
          value={password}
          autoComplete="current-password"
          placeholder="Enter your password"
          error={errors.password}
          onChange={(event) => {
            setPassword(event.target.value)
            setErrors((current) => ({ ...current, password: undefined, form: undefined }))
          }}
        />

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <label className="inline-flex items-center gap-2 font-medium text-slate-600">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
            />
            Remember me
          </label>
          <a className="font-semibold text-violet-700 transition hover:text-violet-800" href={routePaths.forgotPassword}>
            Forgot password?
          </a>
        </div>

        <FormError message={errors.form ?? notice ?? undefined} />
        <AuthPrimaryButton disabled={submitting}>{submitting ? 'Signing in…' : 'Sign in'}</AuthPrimaryButton>
      </form>
    </AuthCard>
  )
}
