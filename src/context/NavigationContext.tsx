import { createContext, useContext } from 'react'

type Direction = 'forward' | 'back'

const NavigationContext = createContext<{ direction: Direction }>({ direction: 'forward' })

export function useNavigationDirection() {
  return useContext(NavigationContext).direction
}

// Utility — call before any navigate(-1) or navigate(path) to set slide direction
export function setNavDirection(direction: Direction) {
  sessionStorage.setItem('nav-direction', direction)
}

export { NavigationContext }
