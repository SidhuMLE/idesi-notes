export type TaskStatus = 'open' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Section {
  id: string
  name: string
  icon: string
  color: string
  order: number
  created_at: string
}

export interface Task {
  id: string
  section_id: string
  title: string
  status: TaskStatus
  priority: TaskPriority
  due_date?: string   // YYYY-MM-DD
  due_time?: string   // HH:MM — optional specific time
  location?: string
  body_notes?: string
  created_at: string
}

export interface Note {
  id: string
  section_id: string
  title?: string
  body: string
  created_at: string
  updated_at: string
}
