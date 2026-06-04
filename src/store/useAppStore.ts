import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Section, Task, Note } from '../types'
import capacitorStorage from './capacitorStorage'

function uid() {
  return crypto.randomUUID()
}

function now() {
  return new Date().toISOString()
}

interface AppStore {
  displayName: string
  sections: Section[]
  tasks: Task[]
  notes: Note[]

  setDisplayName: (name: string) => void

  // Section actions
  addSection: (data: Omit<Section, 'id' | 'created_at' | 'order'>) => void
  updateSection: (id: string, data: Partial<Omit<Section, 'id' | 'created_at'>>) => void
  deleteSection: (id: string) => void
  reorderSections: (ids: string[]) => void

  // Task actions
  addTask: (data: Omit<Task, 'id' | 'created_at'>) => string
  updateTask: (id: string, data: Partial<Omit<Task, 'id' | 'created_at'>>) => void
  deleteTask: (id: string) => void

  // Note actions
  addNote: (data: Omit<Note, 'id' | 'created_at' | 'updated_at'>) => string
  updateNote: (id: string, data: Partial<Omit<Note, 'id' | 'created_at' | 'updated_at'>>) => void
  deleteNote: (id: string) => void

  // Selectors
  tasksBySection: (sectionId: string) => Task[]
  notesBySection: (sectionId: string) => Note[]
  tasksDueToday: () => Task[]
  tasksUpcoming: (days?: number) => Task[]
  openTaskCountBySection: (sectionId: string) => number
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      displayName: '',
      sections: [],
      tasks: [],
      notes: [],

      setDisplayName: (name) => set({ displayName: name }),

      addSection: (data) =>
        set((s) => ({
          sections: [
            ...s.sections,
            { ...data, id: uid(), created_at: now(), order: s.sections.length },
          ],
        })),

      updateSection: (id, data) =>
        set((s) => ({
          sections: s.sections.map((sec) => (sec.id === id ? { ...sec, ...data } : sec)),
        })),

      deleteSection: (id) =>
        set((s) => ({
          sections: s.sections.filter((sec) => sec.id !== id),
          tasks: s.tasks.filter((t) => t.section_id !== id),
          notes: s.notes.filter((n) => n.section_id !== id),
        })),

      reorderSections: (ids) =>
        set((s) => ({
          sections: ids
            .map((id, order) => {
              const sec = s.sections.find((sec) => sec.id === id)
              return sec ? { ...sec, order } : null
            })
            .filter(Boolean) as Section[],
        })),

      addTask: (data) => {
        const id = uid()
        set((s) => ({ tasks: [...s.tasks, { ...data, id, created_at: now() }] }))
        return id
      },

      updateTask: (id, data) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...data } : t)),
        })),

      deleteTask: (id) =>
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      addNote: (data) => {
        const id = uid()
        const ts = now()
        set((s) => ({ notes: [...s.notes, { ...data, id, created_at: ts, updated_at: ts }] }))
        return id
      },

      updateNote: (id, data) =>
        set((s) => ({
          notes: s.notes.map((n) =>
            n.id === id ? { ...n, ...data, updated_at: now() } : n,
          ),
        })),

      deleteNote: (id) =>
        set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),

      tasksBySection: (sectionId) =>
        get().tasks.filter((t) => t.section_id === sectionId),

      notesBySection: (sectionId) =>
        get()
          .notes.filter((n) => n.section_id === sectionId)
          .sort((a, b) => b.created_at.localeCompare(a.created_at)),

      tasksDueToday: () => {
        const today = new Date().toDateString()
        return get()
          .tasks.filter(
            (t) => t.due_date && new Date(t.due_date).toDateString() === today && t.status !== 'done',
          )
          .sort((a, b) => a.due_date!.localeCompare(b.due_date!))
      },

      tasksUpcoming: (days = 7) => {
        const now = new Date()
        const cutoff = new Date(now.getTime() + days * 86400000)
        const today = now.toDateString()
        return get()
          .tasks.filter(
            (t) =>
              t.due_date &&
              t.status !== 'done' &&
              new Date(t.due_date).toDateString() !== today &&
              new Date(t.due_date) <= cutoff &&
              new Date(t.due_date) >= now,
          )
          .sort((a, b) => a.due_date!.localeCompare(b.due_date!))
      },

      openTaskCountBySection: (sectionId) =>
        get().tasks.filter((t) => t.section_id === sectionId && t.status !== 'done').length,
    }),
    { name: 'idesi-notes-v1', storage: createJSONStorage(() => capacitorStorage) },
  ),
)
