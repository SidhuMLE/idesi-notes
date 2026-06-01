import { NavLink } from 'react-router-dom'

const items = [
  { to: '/', icon: 'home', label: 'Home' },
  { to: '/areas', icon: 'category', label: 'Areas' },
  { to: '/search', icon: 'search', label: 'Search' },
  { to: '/settings', icon: 'settings', label: 'Settings' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 bg-temple-ivory border-t border-pandya-gold/10 shadow-[0_-4px_20px_rgba(34,30,26,0.05)] rounded-t-xl">
      {items.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            isActive
              ? 'flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-full px-4 py-1 active:scale-90 transition-transform duration-200'
              : 'flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 hover:text-secondary transition-all active:scale-90 duration-200'
          }
        >
          {({ isActive }) => (
            <>
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {icon}
              </span>
              <span className="font-label-md text-[10px] mt-1">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
