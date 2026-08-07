interface ProgressBarProps {
  value: number
  max: number
}

export function ProgressBar({ value, max }: ProgressBarProps) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="flex items-center gap-2">
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="rounded-pill bg-surface-sunken h-1.5 flex-1 overflow-hidden"
      >
        <div
          className="rounded-pill bg-status-info h-full transition-[width]"
          style={{ width: `${String(percent)}%` }}
        />
      </div>
      <span className="text-label-sm text-text-muted shrink-0 tabular-nums">
        {value}/{max}
      </span>
    </div>
  )
}
