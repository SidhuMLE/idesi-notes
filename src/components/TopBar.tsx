import { useNavigate } from 'react-router-dom'

interface Props {
  title: string
  showBack?: boolean
  actions?: React.ReactNode
}

export default function TopBar({ title, showBack = false, actions }: Props) {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-outline-variant/20 flex items-center gap-2 px-2 py-2 min-h-14">
      {showBack && (
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-surface-container active:scale-95 transition-all"
          aria-label="Back"
        >
          <span className="material-symbols-outlined text-granite">arrow_back</span>
        </button>
      )}
      <h1 className="flex-1 font-headline-sm text-headline-sm text-primary truncate px-1">
        {title}
      </h1>
      {actions && <div className="flex items-center">{actions}</div>}
    </header>
  )
}
