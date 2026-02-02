interface BadgeProps {
  variant: 'category' | 'status'
  value: string
}

const categoryColors: Record<string, string> = {
  education: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  health: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
  food: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100',
  infrastructure: 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-100',
  elderly: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
  other: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
}

const statusColors: Record<string, string> = {
  open: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100',
  completed: 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-100',
  in_progress: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100',
}

export function Badge({ variant, value }: BadgeProps) {
  const colors = variant === 'category' ? categoryColors : statusColors
  const colorClass = colors[value.toLowerCase()] || colors.other

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${colorClass}`}>
      {value}
    </span>
  )
}
