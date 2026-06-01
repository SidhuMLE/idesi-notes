import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { App } from '@capacitor/app'

export function useBackButton() {
  const navigate = useNavigate()

  useEffect(() => {
    const listenerPromise = App.addListener('backButton', ({ canGoBack }) => {
      sessionStorage.setItem('nav-direction', 'back')
      if (canGoBack) {
        navigate(-1)
      } else {
        App.exitApp()
      }
    })

    return () => {
      listenerPromise.then((l) => l.remove())
    }
  }, [navigate])
}
