import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type CardVariant = 'default' | 'interactive' | 'warning' | 'danger'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
}

const variantClasses: Record<CardVariant, string> = {
  default: 'border-border',
  interactive:
    'border-border hover:border-border-strong hover:bg-surface-hover cursor-pointer',
  warning: 'border-status-warning/40',
  danger: 'border-status-danger/40',
}

export function Card({ variant = 'default', className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-card bg-surface shadow-card border p-5 transition-colors',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  )
}

export function CardHeader({
  title,
  action,
  meta,
}: {
  title: ReactNode
  action?: ReactNode
  meta?: ReactNode
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h3 className="text-heading-md text-text-primary font-semibold">{title}</h3>
        {meta ? <p className="text-body-sm text-text-muted mt-0.5">{meta}</p> : null}
      </div>
      {action}
    </div>
  )
}
