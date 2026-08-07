import type { StatusTone } from './StatusBadge'

interface StatTileProps {
  label: string
  value: string
  tone?: StatusTone
}

const toneText: Record<StatusTone, string> = {
  success: 'text-status-success',
  info: 'text-status-info',
  warning: 'text-status-warning',
  danger: 'text-status-danger',
  neutral: 'text-text-primary',
}

export function StatTile({ label, value, tone = 'neutral' }: StatTileProps) {
  return (
    <div className="border-border bg-surface-raised rounded-lg border px-4 py-3">
      <p className="text-label-md text-text-muted">{label}</p>
      <p className={`text-heading-lg mt-1 font-bold tabular-nums ${toneText[tone]}`}>
        {value}
      </p>
    </div>
  )
}
