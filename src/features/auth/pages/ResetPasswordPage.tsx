import type { FormEvent } from 'react'
import { useState } from 'react'
import { routePaths } from '../../../app/router/routePaths'
import { FormError } from '../../../shared/forms/FormError'
import { Input } from '../../../shared/forms/Input'
import { appIcons } from '../../../shared/icons/appIcons'
import { AuthCard, AuthPrimaryButton } from '../components/AuthCard'
import { AuthHeader } from '../components/AuthHeader'
import { PasswordField } from '../components/PasswordField'
import { useAuth } from '../hooks/useAuth'
import { validateEmail, validateNewPassword } from '../utils/authValidation'

type ResetErrors = {
  email?: string
  code?: string
  password?: string
  confirmPassword?: string
  form?: string
}

const SuccessIcon = appIcons.auth.success
const invalidFieldClass = 'border-red-300 focus:border-red-500 focus:ring-red-100'

function initialEmail() {
  return new URLSearchParams(window.location.search).get('email') ?? ''
}

export function ResetPasswordPage() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState(initialEmail)
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<ResetErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [updated, setUpdated] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors: ResetErrors = {
      email: validateEmail(email),
      code: /^\d{6}$/.test(code.trim()) ? '' : 'Enter the six-digit code from the email',
      password: validateNewPassword(password),
      confirmPassword: password === confirmPassword ? '' : 'Confirm password must match',
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = 'Confirm password is required'
    }

    if (nextErrors.email || nextErrors.code || nextErrors.password || nextErrors.confirmPassword) {
      setErrors(nextErrors)
      return
    }

    setSubmitting(true)
    const result = await resetPassword({ email, code, password })
    setSubmitting(false)
    if (!result.ok) {
      setErrors({ form: result.error })
      return
    }

    setUpdated(true)
  }

  return (
    <AuthCard>
      {updated ? (
        <div className="py-4 text-center">
          <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <SuccessIcon className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-2xl font-semibold text-slate-950">Password updated</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Every existing session has been signed out. Sign in with your new password.
          </p>
          <a
            className="mt-7 inline-flex h-11 w-full items-center justify-center rounded-full bg-violet-600 px-5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(111,61,204,0.24)] transition hover:bg-violet-700"
            href={routePaths.login}
          >
            Back to login
          </a>
        </div>
      ) : (
        <>
          <AuthHeader title="Create new password" subtitle="Enter the code we emailed you and choose a new password" />
          <form className="grid gap-5" onSubmit={(event) => void handleSubmit(event)} noValidate>
            <div className="grid gap-2">
              <Input
                label="Email"
                type="email"
                value={email}
                autoComplete="email"
                placeholder="admin@kinvo.app"
                className={errors.email ? invalidFieldClass : undefined}
                aria-invalid={Boolean(errors.email)}
                onChange={(event) => {
                  setEmail(event.target.value)
                  setErrors((current) => ({ ...current, email: undefined, form: undefined }))
                }}
              />
              <FormError message={errors.email} />
            </div>
            <div className="grid gap-2">
              <Input
                label="Reset code"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                placeholder="6-digit code"
                className={errors.code ? invalidFieldClass : undefined}
                aria-invalid={Boolean(errors.code)}
                onChange={(event) => {
                  setCode(event.target.value)
                  setErrors((current) => ({ ...current, code: undefined, form: undefined }))
                }}
              />
              <FormError message={errors.code} />
            </div>
            <PasswordField
              label="New password"
              value={password}
              autoComplete="new-password"
              placeholder="Minimum 8 characters"
              error={errors.password}
              onChange={(event) => {
                setPassword(event.target.value)
                setErrors((current) => ({ ...current, password: undefined, form: undefined }))
              }}
            />
            <PasswordField
              label="Confirm password"
              value={confirmPassword}
              autoComplete="new-password"
              placeholder="Re-enter password"
              error={errors.confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value)
                setErrors((current) => ({ ...current, confirmPassword: undefined, form: undefined }))
              }}
            />
            <FormError message={errors.form} />
            <AuthPrimaryButton disabled={submitting}>{submitting ? 'Updating…' : 'Update password'}</AuthPrimaryButton>
            <a className="text-center text-sm font-semibold text-violet-700 transition hover:text-violet-800" href={routePaths.login}>
              Back to login
            </a>
          </form>
        </>
      )}
    </AuthCard>
  )
}
