import { createContext, useContext, useState } from 'react'

interface NavContextValue {
  navHidden: boolean
  hideNav: () => void
  showNav: () => void
}

const NavContext = createContext<NavContextValue>({
  navHidden: false,
  hideNav: () => {},
  showNav: () => {},
})

export function NavProvider({ children }: { children: React.ReactNode }) {
  const [navHidden, setNavHidden] = useState(false)
  return (
    <NavContext.Provider value={{ navHidden, hideNav: () => setNavHidden(true), showNav: () => setNavHidden(false) }}>
      {children}
    </NavContext.Provider>
  )
}

export function useNav() {
  return useContext(NavContext)
}
