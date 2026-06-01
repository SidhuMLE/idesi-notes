import { NavLink } from 'react-router-dom'

const items = [
  { to: '/', icon: 'home', label: 'Home' },
  { to: '/areas', icon: 'category', label: 'Areas' },
  { to: '/search', icon: 'search', label: 'Search' },
  { to: '/settings', icon: 'settings', label: 'Settings' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-outline-variant/30 flex items-stretch h-16 safe-area-inset-bottom">
      {items.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-0.5 text-xs transition-colors ${
              isActive
                ? 'text-madder-red font-semibold'
                : 'text-stone hover:text-granite'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={`material-symbols-outlined text-[22px] ${isActive ? 'text-madder-red' : 'text-stone'}`}
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {icon}
              </span>
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
