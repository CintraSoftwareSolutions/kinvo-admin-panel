import type { FormEvent } from 'react'
import { useState } from 'react'
import { routePaths } from '../../../app/router/routePaths'
import { FormError } from '../../../shared/forms/FormError'
import { Input } from '../../../shared/forms/Input'
import { appIcons } from '../../../shared/icons/appIcons'
import { AuthCard, AuthPrimaryButton } from '../components/AuthCard'
import { AuthHeader } from '../components/AuthHeader'
import { useAuth } from '../hooks/useAuth'
import { validateEmail } from '../utils/authValidation'

const SuccessIcon = appIcons.auth.success

export function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth()
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextError = validateEmail(email)
    if (nextError) {
      setEmailError(nextError)
      return
    }

    setSubmitting(true)
    const result = await requestPasswordReset(email)
    setSubmitting(false)
    if (!result.ok) {
      // e.g. SERVICE_UNAVAILABLE: mail transport is down and no code was sent.
      setEmailError(result.error ?? 'Could not send a reset code.')
      return
    }

    setSent(true)
  }

  return (
    <AuthCard>
      {sent ? (
        <div className="py-4 text-center">
          <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <SuccessIcon className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-2xl font-semibold text-slate-950">Check your inbox</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            If that address has an account, a six-digit code is on its way. It is valid for one hour.
          </p>
          <a
            className="mt-7 inline-flex h-11 w-full items-center justify-center rounded-full bg-violet-600 px-5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(111,61,204,0.24)] transition hover:bg-violet-700"
            href={`${routePaths.resetPassword}?email=${encodeURIComponent(email.trim())}`}
          >
            Enter reset code
          </a>
        </div>
      ) : (
        <>
          <AuthHeader title="Reset your password" subtitle="Enter your admin email and we’ll send a six-digit reset code" />
          <form className="grid gap-5" onSubmit={(event) => void handleSubmit(event)} noValidate>
            <div className="grid gap-2">
              <Input
                label="Email"
                type="email"
                value={email}
                autoComplete="email"
                placeholder="admin@kinvo.app"
                className={emailError ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : undefined}
                aria-invalid={Boolean(emailError)}
                onChange={(event) => {
                  setEmail(event.target.value)
                  setEmailError('')
                }}
              />
              <FormError message={emailError} />
            </div>
            <AuthPrimaryButton disabled={submitting}>{submitting ? 'Sending…' : 'Send reset code'}</AuthPrimaryButton>
            <a className="text-center text-sm font-semibold text-violet-700 transition hover:text-violet-800" href={routePaths.login}>
              Back to login
            </a>
          </form>
        </>
      )}
    </AuthCard>
  )
}
