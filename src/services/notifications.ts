import { LocalNotifications } from '@capacitor/local-notifications'
import type { Task } from '../types'

// Derive a stable 32-bit integer notification ID from a UUID string
function hashId(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0
  }
  return Math.abs(h) % 2_000_000_000
}

const DUE_DAY_OFFSET = 0
const HOUR_BEFORE_OFFSET = 2_000_000_000 // won't overflow — kept in separate range
const DAILY_SUMMARY_ID = 1_999_999_999

function dueDayId(taskId: string) { return hashId(taskId + DUE_DAY_OFFSET) }
function hourBeforeId(taskId: string) { return hashId(taskId + HOUR_BEFORE_OFFSET) }

export async function requestNotificationPermission(): Promise<boolean> {
  try {
    const { display } = await LocalNotifications.requestPermissions()
    return display === 'granted'
  } catch {
    return false
  }
}

export async function scheduleDueReminder(task: Task): Promise<void> {
  if (!task.due_date) return
  await cancelDueReminder(task.id)

  const now = new Date()
  const notifications: Parameters<typeof LocalNotifications.schedule>[0]['notifications'] = []

  // 9 AM on the due date
  const dueDay = new Date(task.due_date + 'T09:00:00')
  if (dueDay > now) {
    notifications.push({
      id: dueDayId(task.id),
      title: 'Task due today',
      body: task.title,
      schedule: { at: dueDay },
      smallIcon: 'ic_launcher',
      iconColor: '#8B2C24',
    })
  }

  // 1 hour before if a specific time is set
  if (task.due_time) {
    const dueDateTime = new Date(`${task.due_date}T${task.due_time}:00`)
    const oneHourBefore = new Date(dueDateTime.getTime() - 3_600_000)
    if (oneHourBefore > now) {
      notifications.push({
        id: hourBeforeId(task.id),
        title: 'Due in 1 hour',
        body: task.title,
        schedule: { at: oneHourBefore },
        smallIcon: 'ic_launcher',
        iconColor: '#8B2C24',
      })
    }
  }

  if (notifications.length > 0) {
    await LocalNotifications.schedule({ notifications })
  }
}

export async function cancelDueReminder(taskId: string): Promise<void> {
  try {
    await LocalNotifications.cancel({
      notifications: [
        { id: dueDayId(taskId) },
        { id: hourBeforeId(taskId) },
      ],
    })
  } catch {
    // ignore — notification may not exist
  }
}

export async function scheduleDailySummary(time: string, tasks: Task[]): Promise<void> {
  try {
    await LocalNotifications.cancel({ notifications: [{ id: DAILY_SUMMARY_ID }] })

    const [hh, mm] = time.split(':').map(Number)
    const next = new Date()
    next.setHours(hh, mm, 0, 0)
    if (next <= new Date()) next.setDate(next.getDate() + 1)

    const todayStr = new Date().toDateString()
    const dueCount = tasks.filter(
      t => t.status !== 'done' && t.due_date && new Date(t.due_date + 'T00:00:00').toDateString() === todayStr,
    ).length

    await LocalNotifications.schedule({
      notifications: [{
        id: DAILY_SUMMARY_ID,
        title: 'Your day ahead',
        body: dueCount > 0
          ? `${dueCount} task${dueCount > 1 ? 's' : ''} due today.`
          : 'No tasks due today — enjoy your day.',
        schedule: { at: next, repeats: true, every: 'day' },
        smallIcon: 'ic_launcher',
        iconColor: '#8B2C24',
      }],
    })
  } catch {
    // notifications may not be available in web/browser preview
  }
}

export async function cancelDailySummary(): Promise<void> {
  try {
    await LocalNotifications.cancel({ notifications: [{ id: DAILY_SUMMARY_ID }] })
  } catch { /* ignore */ }
}
