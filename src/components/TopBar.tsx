import { useNavigate } from 'react-router-dom'

interface Props {
  title: string
  showBack?: boolean
  actions?: React.ReactNode
}

export default function TopBar({ title, showBack = false, actions }: Props) {
  const navigate = useNavigate()

  return (
    <header className="w-full top-0 sticky bg-surface z-40 border-b border-outline-variant/20 flex justify-between items-center px-4 py-2 max-w-full">
      <div className="flex items-center gap-1 flex-1 min-w-0">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="text-madder-red active:scale-95 duration-150 p-2 -ml-2 rounded-full flex items-center justify-center"
            aria-label="Back"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        )}
        <h1 className="font-headline-sm text-headline-sm text-primary truncate">
          {title}
        </h1>
      </div>
      {actions && <div className="flex items-center shrink-0">{actions}</div>}
    </header>
  )
}
