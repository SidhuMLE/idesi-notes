interface Props {
  onClick: () => void
  icon?: string
  label?: string
}

export default function FAB({ onClick, icon = 'add', label = 'Add' }: Props) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full bg-madder-red text-on-primary shadow-lg flex items-center justify-center active:scale-95 transition-transform"
      style={{ boxShadow: '0 4px 16px rgba(139,44,36,0.3)' }}
    >
      <span className="material-symbols-outlined text-[26px]">{icon}</span>
    </button>
  )
}
