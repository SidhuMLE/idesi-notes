import { useState, useEffect } from 'react'
import { flushSync } from 'react-dom'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import type { TaskStatus, TaskPriority } from '../types'
import PageWrapper from '../components/PageWrapper'
import BottomSheet from '../components/BottomSheet'

export default function TaskDetail() {
  const { taskId } = useParams<{ taskId: string }>()
  const navigate = useNavigate()
  const { tasks, sections, updateTask, deleteTask } = useAppStore()

  const task = tasks.find(t => t.id === taskId)

  // All hooks run unconditionally so the hook count never changes between renders.
  // When the task is deleted and this component briefly re-renders before unmounting,
  // state initializers are ignored (they only apply on first mount) and the effect
  // guard below keeps auto-save from firing on a ghost render.
  const [title, setTitle] = useState(task?.title ?? '')
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? 'open')
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? 'medium')
  const [dueDate, setDueDate] = useState(task?.due_date ?? '')
  const [dueTime, setDueTime] = useState(task?.due_time ?? '')
  const [location, setLocation] = useState(task?.location ?? '')
  const [notes, setNotes] = useState(task?.body_notes ?? '')
  const [saved, setSaved] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const section = sections.find(s => s.id === task?.section_id)

  // Auto-save with debounce — skip if task no longer exists
  useEffect(() => {
    if (!task) return
    const t = setTimeout(() => {
      updateTask(taskId!, {
        title,
        status,
        priority,
        due_date: dueDate || undefined,
        due_time: dueDate && dueTime ? dueTime : undefined,
        location: location || undefined,
        body_notes: notes || undefined,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 1500)
    }, 500)
    return () => clearTimeout(t)
  }, [title, status, priority, dueDate, dueTime, location, notes])

  // Early return AFTER all hooks — safe per Rules of Hooks
  if (!task) return null

  return (
    <PageWrapper>
      <div className="bg-temple-ivory min-h-screen pb-16">
        {/* Top bar */}
        <header className="w-full top-0 sticky bg-surface border-b border-outline-variant/20 z-50 flex justify-between items-center px-4 py-2">
          <motion.button
            onClick={() => { sessionStorage.setItem('nav-direction', 'back'); navigate(-1) }}
            whileTap={{ scale: 0.90 }}
            className="text-madder-red hover:text-primary p-2 -ml-2 rounded-full"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </motion.button>
          {/* Section breadcrumb */}
          <button
            onClick={() => navigate('/areas/' + section?.id)}
            className="font-label-md text-label-md text-on-surface-variant hover:text-primary flex items-center gap-1 active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">folder_open</span>
            {section?.name}
          </button>
          <motion.button
            onClick={() => setShowDelete(true)}
            whileTap={{ scale: 0.90 }}
            className="text-madder-red p-2 -mr-2 rounded-full"
          >
            <span className="material-symbols-outlined text-[24px]">more_vert</span>
          </motion.button>
        </header>

        <main className="max-w-3xl mx-auto px-4 pt-6 space-y-6">
          {/* Saved indicator */}
          <div className="flex justify-end h-4">
            <span
              className={`font-caption text-caption text-stone flex items-center gap-1 transition-opacity duration-300 ${saved ? 'opacity-100' : 'opacity-0'}`}
            >
              <span className="material-symbols-outlined text-[14px]">cloud_done</span> Saved
            </span>
          </div>

          {/* Title */}
          <div className="relative group">
            <textarea
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-transparent border-none p-0 focus:ring-0 font-headline-md text-headline-md text-granite resize-none overflow-hidden placeholder-stone/40"
              placeholder="Task Title"
              rows={2}
            />
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-pandya-gold/0 group-focus-within:bg-pandya-gold/50 transition-colors duration-300" />
          </div>

          {/* Status segmented control */}
          <div className="space-y-2 pt-2">
            <label className="font-label-md text-label-md text-stone uppercase tracking-widest text-[11px]">
              Status
            </label>
            <div className="flex bg-surface-container-high rounded-lg p-1 gap-1">
              {(['open', 'in_progress', 'done'] as TaskStatus[]).map(s => (
                <motion.button
                  key={s}
                  onClick={() => setStatus(s)}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-1 py-2 px-3 rounded-md font-label-md text-label-md text-center transition-all ${
                    status === s
                      ? 'bg-surface shadow-sm text-madder-red border border-pandya-gold/20'
                      : 'text-stone hover:text-granite'
                  }`}
                >
                  {s === 'in_progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Details card */}
          <div className="bg-sandstone rounded-xl p-4 shadow-[0_8px_30px_rgba(34,30,26,0.06)] space-y-4 border border-pandya-gold/10 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-pandya-gold/5 rounded-full blur-2xl pointer-events-none" />

            {/* Priority */}
            <div className="flex flex-col gap-2 pb-4 border-b border-outline-variant/30 relative z-10">
              <div className="flex items-center gap-2 text-stone">
                <span className="material-symbols-outlined text-[20px]">flag</span>
                <span className="font-label-md text-label-md uppercase tracking-widest text-[11px]">
                  Priority
                </span>
              </div>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as TaskPriority[]).map(p => (
                  <motion.button
                    key={p}
                    onClick={() => setPriority(p)}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-1.5 rounded-md font-label-md text-label-md transition-all capitalize ${
                      priority === p
                        ? 'text-madder-red bg-pearl border border-pandya-gold/30 shadow-sm'
                        : 'text-stone bg-surface hover:bg-temple-ivory border border-transparent hover:border-pandya-gold/20'
                    }`}
                  >
                    {p}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Due date */}
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30 relative z-10">
              <div className="flex items-center gap-2 text-stone">
                <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                <span className="font-label-md text-label-md uppercase tracking-widest text-[11px]">
                  Due date
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={dueDate}
                  onChange={e => { setDueDate(e.target.value); if (!e.target.value) setDueTime('') }}
                  className="bg-transparent border-none font-body-md text-body-md text-granite focus:ring-0 text-right cursor-pointer"
                />
                {dueDate && (
                  <input
                    type="time"
                    value={dueTime}
                    onChange={e => setDueTime(e.target.value)}
                    placeholder="Time"
                    className="bg-transparent border-none font-body-md text-body-md text-stone focus:ring-0 text-right cursor-pointer w-[90px]"
                  />
                )}
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 relative z-10">
              <span className="material-symbols-outlined text-stone text-[20px]">location_on</span>
              <input
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Add location..."
                className="flex-1 bg-transparent border-none font-body-md text-body-md text-granite placeholder-stone/50 focus:ring-0"
              />
            </div>
          </div>

          {/* Task notes */}
          <div className="space-y-2">
            <label className="font-label-md text-label-md text-stone uppercase tracking-widest text-[11px]">
              Task Notes
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add notes..."
              className="w-full min-h-[120px] bg-sandstone rounded-xl p-4 border border-pandya-gold/10 font-body-md text-body-md text-granite placeholder-stone/50 focus:ring-1 focus:ring-pandya-gold focus:outline-none resize-none shadow-[0_4px_12px_rgba(34,30,26,0.04)]"
            />
          </div>
        </main>

        {/* Delete confirmation bottom sheet */}
        <BottomSheet open={showDelete} onClose={() => setShowDelete(false)} title="Delete Task?">
          <p className="font-body-md text-body-md text-stone">This action cannot be undone.</p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowDelete(false)}
              className="flex-1 py-3 border border-stone/30 rounded-lg font-label-md text-label-md text-granite"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                const id = taskId!
                setShowDelete(false)
                sessionStorage.setItem('nav-direction', 'back')
                flushSync(() => { navigate(-1) })
                deleteTask(id)
              }}
              className="flex-1 py-3 bg-error text-white rounded-lg font-label-md text-label-md"
            >
              Delete
            </button>
          </div>
        </BottomSheet>
      </div>
    </PageWrapper>
  )
}
