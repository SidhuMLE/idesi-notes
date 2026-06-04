/**
 * Notification service — reconcile-from-state approach.
 *
 * Design: instead of imperative schedule/cancel calls scattered through the
 * app, one idempotent `syncNotifications(state)` function rebuilds all
 * pending notifications from the current task list every time it's called.
 *
 * Call sites:
 *   1. Zustand subscribe (debounced 2s) — picks up task add/edit/complete/delete
 *   2. @capacitor/app 'appStateChange' isActive — re-arms on every foreground
 *
 * This ensures the daily summary count and due reminders are always accurate
 * as of the last time the user opened the app.
 */

import { LocalNotifications } from '@capacitor/local-notifications'
import type { Task } from '../types'

// ── ID namespace ─────────────────────────────────────────────────────────────
// Keep IDs in non-overlapping ranges so cancel-all is a simple list comprehension.
// IDs must be 32-bit positive integers.

function djb2(s: string): number {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = (Math.imul(h, 33) ^ s.charCodeAt(i)) >>> 0
  return h % 100_000_000 // 0 – 99 999 999
}

function dueDayId(taskId: string) { return djb2(taskId + 'd') }
function hourBeforeId(taskId: string) { return djb2(taskId + 'h') + 100_000_000 }

const DAILY_SUMMARY_ID = 999_999_999

// ── Permission ───────────────────────────────────────────────────────────────

export async function checkOrRequestPermission(): Promise<boolean> {
  try {
    const { display } = await LocalNotifications.checkPermissions()
    if (display === 'granted') return true
    if (display === 'denied') return false
    const { display: result } = await LocalNotifications.requestPermissions()
    return result === 'granted'
  } catch {
    return false
  }
}

// ── Reconcile ────────────────────────────────────────────────────────────────

export interface NotifSettings {
  dueDateReminders: boolean
  dailySummary: boolean
  dailySummaryTime: string // 'HH:MM'
}

export async function syncNotifications(
  tasks: Task[],
  settings: NotifSettings,
): Promise<void> {
  try {
    // Cancel every notification this app may have scheduled
    const cancelIds = [
      DAILY_SUMMARY_ID,
      ...tasks.flatMap(t => [dueDayId(t.id), hourBeforeId(t.id)]),
    ]
    await LocalNotifications.cancel({ notifications: cancelIds.map(id => ({ id })) })

    if (!settings.dueDateReminders && !settings.dailySummary) return

    const now = new Date()
    const toSchedule: Parameters<typeof LocalNotifications.schedule>[0]['notifications'] = []
    const openWithDue = tasks.filter(t => t.status !== 'done' && t.due_date)

    // ── Due-date reminders ────────────────────────────────────────────────────
    if (settings.dueDateReminders) {
      for (const task of openWithDue) {
        // 9 AM on the due date
        const at = new Date(`${task.due_date}T09:00:00`)
        if (at > now) {
          toSchedule.push({
            id: dueDayId(task.id),
            title: 'Task due today',
            body: task.title,
            smallIcon: 'ic_stat_notify',
            iconColor: '#8B2C24',
            schedule: { at },
          })
        }

        // 1 hour before the specific time, if a time was set
        if (task.due_time) {
          const dueAt = new Date(`${task.due_date}T${task.due_time}:00`)
          const before = new Date(dueAt.getTime() - 3_600_000)
          if (before > now) {
            toSchedule.push({
              id: hourBeforeId(task.id),
              title: 'Due in 1 hour',
              body: task.title,
              smallIcon: 'ic_stat_notify',
              iconColor: '#8B2C24',
              schedule: { at: before },
            })
          }
        }
      }
    }

    // ── Daily summary ─────────────────────────────────────────────────────────
    // One-shot at the NEXT occurrence of the configured time.
    // On app-resume, this function is called again and rescheduled with a fresh
    // count — so the count is always accurate as of the last app open.
    if (settings.dailySummary) {
      const [hh, mm] = settings.dailySummaryTime.split(':').map(Number)
      const next = new Date()
      next.setHours(hh, mm, 0, 0)
      if (next <= now) next.setDate(next.getDate() + 1)

      const todayStr = new Date().toDateString()
      const dueTodayTasks = tasks.filter(
        t =>
          t.status !== 'done' &&
          t.due_date &&
          new Date(`${t.due_date}T00:00:00`).toDateString() === todayStr,
      )
      const count = dueTodayTasks.length
      // Up to 5 task titles for the expandable inbox view
      const titles = dueTodayTasks.slice(0, 5).map(t => t.title)

      toSchedule.push({
        id: DAILY_SUMMARY_ID,
        title: count > 0 ? `${count} task${count > 1 ? 's' : ''} due today` : 'Good morning!',
        body: count > 0 ? titles[0] : 'No tasks due today — enjoy your day.',
        ...(count > 1 && { inboxList: titles }),
        summaryText: count > 0 ? `${count} task${count > 1 ? 's' : ''} due` : '',
        smallIcon: 'ic_stat_notify',
        iconColor: '#8B2C24',
        schedule: { at: next }, // one-shot — NOT repeating
      })
    }

    if (toSchedule.length > 0) {
      await LocalNotifications.schedule({ notifications: toSchedule })
    }
  } catch {
    // LocalNotifications not available in browser preview — ignore silently
  }
}
