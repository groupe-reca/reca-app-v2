import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSession } from '@/app/SessionContext'
import { Button } from '@/components/ui/Button'
import { useLogout } from '../hooks/useLogout'

// docs/05-Authentication-Roles-Permissions.md §43 — wait for session
// resolution, redirect if absent, handle a disabled/suspended account,
// preserve the intended destination for post-login redirect.
export function RequireAuth() {
  const { status, session } = useSession()
  const location = useLocation()
  const logout = useLogout()

  if (status === 'loading') {
    return (
      <div className="bg-background text-body-sm text-text-muted flex min-h-screen items-center justify-center">
        Chargement…
      </div>
    )
  }

  if (status === 'unauthenticated' || !session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (!session.actif) {
    return (
      <div className="bg-background flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-heading-sm text-text-primary font-semibold">
          Votre accès est temporairement suspendu.
        </p>
        <p className="text-body-sm text-text-muted max-w-sm">
          Communiquez avec un administrateur pour réactiver votre compte.
        </p>
        <Button
          variant="secondary"
          onClick={() => {
            logout.mutate()
          }}
        >
          Se déconnecter
        </Button>
      </div>
    )
  }

  return <Outlet />
}
