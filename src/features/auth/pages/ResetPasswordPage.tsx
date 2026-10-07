import type { FormEvent } from 'react'
import { useState } from 'react'
import { routePaths } from '../../../app/router/routePaths'
import { appIcons } from '../../../shared/icons/appIcons'
import { AuthCard, AuthPrimaryButton } from '../components/AuthCard'
import { AuthHeader } from '../components/AuthHeader'
import { PasswordField } from '../components/PasswordField'
import { useAuth } from '../hooks/useAuth'
import { validateNewPassword } from '../utils/authValidation'

type ResetErrors = {
  password?: string
  confirmPassword?: string
}

const SuccessIcon = appIcons.auth.success

export function ResetPasswordPage() {
  const { resetPassword } = useAuth()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<ResetErrors>({})
  const [updated, setUpdated] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors: ResetErrors = {
      password: validateNewPassword(password),
      confirmPassword: password === confirmPassword ? '' : 'Confirm password must match',
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = 'Confirm password is required'
    }

    if (nextErrors.password || nextErrors.confirmPassword) {
      setErrors(nextErrors)
      return
    }

    resetPassword()
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
          <p className="mt-2 text-sm leading-6 text-slate-500">You can now sign in with your new password.</p>
          <a
            className="mt-7 inline-flex h-11 w-full items-center justify-center rounded-full bg-violet-600 px-5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(111,61,204,0.24)] transition hover:bg-violet-700"
            href={routePaths.login}
          >
            Back to login
          </a>
        </div>
      ) : (
        <>
          <AuthHeader title="Create new password" subtitle="Choose a secure password for your admin account" />
          <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
            <PasswordField
              label="New password"
              value={password}
              autoComplete="new-password"
              placeholder="Minimum 8 characters"
              error={errors.password}
              onChange={(event) => {
                setPassword(event.target.value)
                setErrors((current) => ({ ...current, password: undefined }))
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
                setErrors((current) => ({ ...current, confirmPassword: undefined }))
              }}
            />
            <AuthPrimaryButton>Update password</AuthPrimaryButton>
            <a className="text-center text-sm font-semibold text-violet-700 transition hover:text-violet-800" href={routePaths.login}>
              Back to login
            </a>
          </form>
        </>
      )}
    </AuthCard>
  )
}
