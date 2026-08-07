import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-card border-border flex flex-col items-center gap-2 border border-dashed px-6 py-12 text-center">
      <p className="text-heading-sm text-text-primary font-semibold">{title}</p>
      {description ? (
        <p className="text-body-sm text-text-muted max-w-sm">{description}</p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  )
}
