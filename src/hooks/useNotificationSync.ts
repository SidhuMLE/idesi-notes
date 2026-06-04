import { useEffect } from 'react'
import { App as CapApp } from '@capacitor/app'
import { useAppStore } from '../store/useAppStore'
import { syncNotifications } from '../services/notifications'

async function runSync() {
  const s = useAppStore.getState()
  if (!s.notifDueDateReminders && !s.notifDailySummary) return
  await syncNotifications(s.tasks, {
    dueDateReminders: s.notifDueDateReminders,
    dailySummary: s.notifDailySummary,
    dailySummaryTime: s.notifDailySummaryTime,
  })
}

/**
 * Subscribes to store changes (debounced 2s) and to the app-resume event so
 * notifications are always rebuilt from the latest task state.
 *
 * Mount once in <AnimatedRoutes> — it has no JSX output.
 */
export function useNotificationSync() {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    const unsubStore = useAppStore.subscribe(() => {
      clearTimeout(timer)
      timer = setTimeout(runSync, 2000)
    })

    // Re-arm on every foreground to refresh the daily-summary count
    let removeResumeListener: (() => void) | undefined
    CapApp.addListener('appStateChange', ({ isActive }) => {
      if (isActive) runSync()
    }).then(handle => {
      removeResumeListener = () => handle.remove()
    }).catch(() => { /* not available in browser */ })

    return () => {
      unsubStore()
      clearTimeout(timer)
      removeResumeListener?.()
    }
  }, [])
}
