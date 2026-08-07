import { cn } from '@/lib/cn'

export type StatusTone = 'success' | 'info' | 'warning' | 'danger' | 'neutral'

interface StatusBadgeProps {
  label: string
  tone: StatusTone
  className?: string
}

// docs/01-Design-System.md §3.6, §6.2 — color never carries meaning alone,
// always paired with a dot + explicit label.
const toneClasses: Record<StatusTone, string> = {
  success: 'bg-status-success-soft text-status-success',
  info: 'bg-status-info-soft text-status-info',
  warning: 'bg-status-warning-soft text-status-warning',
  danger: 'bg-status-danger-soft text-status-danger',
  neutral: 'bg-status-neutral-soft text-status-neutral',
}

const dotClasses: Record<StatusTone, string> = {
  success: 'bg-status-success',
  info: 'bg-status-info',
  warning: 'bg-status-warning',
  danger: 'bg-status-danger',
  neutral: 'bg-status-neutral',
}

export function StatusBadge({ label, tone, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'rounded-pill text-label-sm inline-flex items-center gap-1.5 px-2.5 py-1 font-semibold tracking-wide uppercase',
        toneClasses[tone],
        className,
      )}
    >
      <span
        className={cn('size-1.5 rounded-full', dotClasses[tone])}
        aria-hidden="true"
      />
      {label}
    </span>
  )
}
