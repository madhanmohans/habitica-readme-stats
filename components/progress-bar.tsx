interface ProgressBarProps {
  value: number
  max: number
  className?: string
  color: string
  backgroundColor: string
}

export function ProgressBar({ value, max, className, color, backgroundColor }: ProgressBarProps) {
  const percentage = (value / max) * 100

  return (
    <div className={`h-4 rounded-full ${backgroundColor} ${className}`}>
      <div
        className={`h-full rounded-full ${color} transition-all duration-300`}
        style={{ width: `${Math.min(100, percentage)}%` }}
      />
    </div>
  )
}

