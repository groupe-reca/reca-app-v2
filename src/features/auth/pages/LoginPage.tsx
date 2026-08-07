import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/infrastructure/supabase/client'
import { useSession } from '@/app/SessionContext'
import { loginSchema, type LoginInput } from '../schemas/login.schema'
import { useLogin } from '../hooks/useLogin'

// docs/05-Authentication-Roles-Permissions.md §30 — generic messages only.
const errorMessages = {
  INVALID_CREDENTIALS: 'Courriel ou mot de passe invalide.',
}

export function LoginPage() {
  const { status } = useSession()
  const location = useLocation()
  const login = useLogin()
  const [resetSent, setResetSent] = useState(false)
  const { register, handleSubmit, getValues, formState } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  if (status === 'authenticated') {
    const from = (location.state as { from?: string } | null)?.from ?? '/operations'
    return <Navigate to={from} replace />
  }

  const handleResetPassword = () => {
    const email = getValues('email')
    if (!email) return
    void supabase.auth.resetPasswordForEmail(email).then(() => {
      setResetSent(true)
    })
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="bg-brand-red flex size-12 items-center justify-center rounded-lg text-xl font-bold text-white">
            R
          </span>
          <div>
            <h1 className="text-heading-md text-text-primary font-bold">RECA</h1>
            <p className="text-body-sm text-text-muted">Centre des opérations</p>
          </div>
        </div>

        <form
          onSubmit={(event) => {
            void handleSubmit((values) => {
              login.mutate(values)
            })(event)
          }}
          className="rounded-card border-border bg-surface shadow-card space-y-4 border p-6"
        >
          <div>
            <label
              htmlFor="email"
              className="text-label-md text-text-secondary font-semibold"
            >
              Courriel
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="border-border-strong bg-surface text-body-md focus-visible:outline-focus mt-1 h-11 w-full rounded-md border px-3 focus-visible:outline-2"
              {...register('email')}
            />
            {formState.errors.email ? (
              <p className="text-body-sm text-status-danger mt-1">
                {formState.errors.email.message}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-label-md text-text-secondary font-semibold"
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="border-border-strong bg-surface text-body-md focus-visible:outline-focus mt-1 h-11 w-full rounded-md border px-3 focus-visible:outline-2"
              {...register('password')}
            />
            {formState.errors.password ? (
              <p className="text-body-sm text-status-danger mt-1">
                {formState.errors.password.message}
              </p>
            ) : null}
          </div>

          {login.isError ? (
            <p role="alert" className="text-body-sm text-status-danger">
              {errorMessages[login.error.code]}
            </p>
          ) : null}

          {resetSent ? (
            <p role="status" className="text-body-sm text-status-success">
              Si ce courriel existe, un lien de réinitialisation a été envoyé.
            </p>
          ) : null}

          <Button type="submit" className="w-full" loading={login.isPending}>
            Se connecter
          </Button>

          <button
            type="button"
            onClick={handleResetPassword}
            className="text-body-sm text-status-info w-full text-center hover:underline"
          >
            Mot de passe oublié ?
          </button>
        </form>
      </div>
    </div>
  )
}
