import { Link } from 'react-router-dom'
import { EmptyState } from '@/components/ui/EmptyState'

export function NotFoundPage() {
  return (
    <div className="p-8">
      <EmptyState
        title="Page introuvable"
        description="Cette page n’existe pas ou a été déplacée."
        action={
          <Link
            to="/operations"
            className="border-border-strong bg-surface-raised text-body-sm text-text-primary hover:bg-surface-hover inline-flex h-10 items-center justify-center rounded-md border px-4 font-semibold"
          >
            Retour au Centre des opérations
          </Link>
        }
      />
    </div>
  )
}
