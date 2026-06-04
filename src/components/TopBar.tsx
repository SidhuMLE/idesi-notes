import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

interface Props {
  title: string
  showBack?: boolean
  actions?: React.ReactNode
}

function goBack(navigate: ReturnType<typeof useNavigate>) {
  sessionStorage.setItem('nav-direction', 'back')
  navigate(-1)
}

export default function TopBar({ title, showBack = false, actions }: Props) {
  const navigate = useNavigate()

  return (
    <header className="w-full top-0 sticky bg-surface z-40 border-b border-outline-variant/20 flex justify-between items-center px-4 py-2 max-w-full">
      <div className="flex items-center gap-1 flex-1 min-w-0">
        {showBack && (
          <motion.button
            onClick={() => goBack(navigate)}
            whileTap={{ scale: 0.88 }}
            className="text-madder-red p-2 -ml-2 rounded-full flex items-center justify-center"
            aria-label="Back"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </motion.button>
        )}
        <h1 className="font-headline-sm text-headline-sm text-madder-red">
          {title}
        </h1>
      </div>
      {actions && <div className="flex items-center shrink-0">{actions}</div>}
    </header>
  )
}
