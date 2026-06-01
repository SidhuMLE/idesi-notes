import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import type { Task, TaskPriority } from '../types'
import BottomNav from '../components/BottomNav'
import BottomSheet from '../components/BottomSheet'
import PageWrapper from '../components/PageWrapper'

// ── Date helpers ────────────────────────────────────────────────────────────

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function isOverdue(dateStr: string): boolean {
  return startOfDay(new Date(dateStr)) < startOfDay(new Date())
}

function formatRelativeDate(dateStr: string): string {
  const target = startOfDay(new Date(dateStr))
  const today = startOfDay(new Date())
  const diff = (target.getTime() - today.getTime()) / 86400000

  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  if (diff === -1) return 'Yesterday'

  const d = new Date(dateStr)
  return `${DAY_NAMES[d.getDay()]} ${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`
}

function formatNoteDate(dateStr: string): string {
  const d = new Date(dateStr)
  const day = DAY_NAMES[d.getDay()]
  const date = d.getDate()
  const month = MONTH_NAMES[d.getMonth()]
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${day} ${date} ${month}, ${hh}:${mm}`
}

// ── Filter type ──────────────────────────────────────────────────────────────

type FilterLabel = 'All' | 'Open' | 'In Progress' | 'Done'

const FILTERS: FilterLabel[] = ['All', 'Open', 'In Progress', 'Done']

// ── Component ────────────────────────────────────────────────────────────────

export default function SectionDetail() {
  const navigate = useNavigate()
  const { sectionId } = useParams<{ sectionId: string }>()

  const sections = useAppStore((s) => s.sections)
  const tasksBySection = useAppStore((s) => s.tasksBySection)
  const notesBySection = useAppStore((s) => s.notesBySection)
  const updateTask = useAppStore((s) => s.updateTask)
  const addNote = useAppStore((s) => s.addNote)
  const addTask = useAppStore((s) => s.addTask)
  const deleteSection = useAppStore((s) => s.deleteSection)

  const [activeTab, setActiveTab] = useState<'tasks' | 'notes'>('tasks')
  const [filter, setFilter] = useState<FilterLabel>('All')
  const [showDone, setShowDone] = useState(false)

  // Add task sheet
  const [showAddTask, setShowAddTask] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('medium')
  const [newTaskDueDate, setNewTaskDueDate] = useState('')

  // Three-dot menu
  const [showMenu, setShowMenu] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const section = sections.find((s) => s.id === sectionId)
  const allTasks = sectionId ? tasksBySection(sectionId) : []
  const notes = sectionId ? notesBySection(sectionId) : []

  // Apply filter (excluding done — those go in the collapsible group)
  const filteredTasks = allTasks.filter((t) => {
    if (filter === 'All') return true
    if (filter === 'Open') return t.status === 'open'
    if (filter === 'In Progress') return t.status === 'in_progress'
    if (filter === 'Done') return t.status === 'done'
    return true
  })

  const doneTasks = filter === 'Done'
    ? []
    : allTasks.filter((t) => t.status === 'done')

  const activeTasks = filteredTasks.filter((t) => t.status !== 'done')

  function toggleTask(task: Task) {
    updateTask(task.id, { status: task.status === 'done' ? 'open' : 'done' })
  }

  function handleNewNote() {
    if (!sectionId) return
    const id = addNote({ section_id: sectionId, body: '' })
    navigate('/notes/' + id)
  }

  function handleSaveTask() {
    if (!sectionId || !newTaskTitle.trim()) return
    addTask({
      section_id: sectionId,
      title: newTaskTitle.trim(),
      status: 'open',
      priority: newTaskPriority,
      ...(newTaskDueDate ? { due_date: newTaskDueDate } : {}),
    })
    setNewTaskTitle('')
    setNewTaskPriority('medium')
    setNewTaskDueDate('')
    setShowAddTask(false)
  }

  function handleDeleteSection() {
    if (!sectionId) return
    deleteSection(sectionId)
    navigate('/areas')
  }

  const PRIORITY_OPTIONS: { label: string; value: TaskPriority }[] = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
  ]

  return (
    <PageWrapper>
      <div className="bg-temple-ivory min-h-screen flex flex-col pb-20">
        {/* Top app bar */}
        <header className="w-full top-0 sticky bg-surface z-40 border-b border-outline-variant/20">
          <div className="flex justify-between items-center px-4 py-2">
            <button
              onClick={() => navigate(-1)}
              className="text-madder-red active:scale-95 duration-150 p-2 rounded-full"
              aria-label="Go back"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="flex items-center gap-2 text-primary">
              {section?.icon && (
                <span className="material-symbols-outlined text-[20px]">{section.icon}</span>
              )}
              <h1 className="font-headline-sm text-headline-sm font-display tracking-tight">
                {section?.name ?? 'Area'}
              </h1>
            </div>
            <button
              onClick={() => setShowMenu(true)}
              className="text-madder-red active:scale-95 p-2 rounded-full"
              aria-label="More options"
            >
              <span className="material-symbols-outlined">more_vert</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-pandya-gold/20 px-4 pt-2">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex-1 pb-3 text-center font-label-md text-label-md border-b-2 transition-colors ${
                activeTab === 'tasks'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-stone hover:text-granite'
              }`}
            >
              Tasks
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex-1 pb-3 text-center font-label-md text-label-md border-b-2 transition-colors ${
                activeTab === 'notes'
                  ? 'border-madder-red text-madder-red font-semibold'
                  : 'border-transparent text-stone hover:text-granite'
              }`}
            >
              Notes
            </button>
          </div>
        </header>

        {/* ── TASKS TAB ── */}
        {activeTab === 'tasks' && (
          <main className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
            {/* Filter chips */}
            <div className="flex overflow-x-auto gap-2 pb-2 hide-scrollbar">
              {FILTERS.map((f) => (
                <motion.button
                  key={f}
                  onClick={() => setFilter(f)}
                  whileTap={{ scale: 0.94 }}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full font-label-md text-label-md transition-colors ${
                    filter === f
                      ? 'bg-sandstone text-granite shadow-[0_2px_8px_rgba(34,30,26,0.05)] border border-pandya-gold/20'
                      : 'bg-temple-ivory text-stone border border-stone/30 hover:bg-sandstone/50'
                  }`}
                >
                  {f}
                </motion.button>
              ))}
            </div>

            {/* Open / filtered task list */}
            <div className="space-y-3">
              {activeTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => navigate('/tasks/' + task.id)}
                  className="bg-sandstone rounded-xl p-4 shadow-[0_4px_12px_rgba(34,30,26,0.06)] flex items-start gap-3 border border-transparent cursor-pointer active:scale-[0.98] transition-transform"
                >
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleTask(task)
                    }}
                    className="mt-1 w-5 h-5 rounded-full border-2 border-stone flex-shrink-0 flex items-center justify-center hover:border-primary transition-colors"
                    aria-label="Complete task"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-body-md text-body-md text-granite">{task.title}</h3>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-stone font-caption text-caption text-xs capitalize">
                        {task.priority}
                      </span>
                      {task.due_date && (
                        <span
                          className={`px-2 py-0.5 rounded-full font-caption text-caption text-xs flex items-center gap-1 ${
                            isOverdue(task.due_date)
                              ? 'bg-error-container text-kumkum'
                              : 'bg-surface-container-high text-stone'
                          }`}
                        >
                          {isOverdue(task.due_date) && (
                            <span className="material-symbols-outlined text-[12px]">warning</span>
                          )}
                          {formatRelativeDate(task.due_date)}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Done group — collapsible (hidden when filter is 'Done') */}
            {doneTasks.length > 0 && (
              <div className="mt-8">
                <button
                  onClick={() => setShowDone((v) => !v)}
                  className="flex items-center gap-2 w-full text-left py-2 mb-2 text-stone hover:text-granite transition-colors group"
                >
                  <span
                    className={`material-symbols-outlined transition-transform duration-200 text-stone ${
                      showDone ? '' : '-rotate-90'
                    }`}
                  >
                    expand_more
                  </span>
                  <span className="font-label-md text-label-md">Done ({doneTasks.length})</span>
                  <div className="flex-1 h-px bg-pandya-gold/10 ml-2" />
                </button>
                {showDone && (
                  <div className="space-y-3 opacity-60">
                    {doneTasks.map((task) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-surface-container-low rounded-xl p-4 border border-pandya-gold/5 flex items-start gap-3"
                      >
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => toggleTask(task)}
                          className="mt-1 w-5 h-5 rounded-full bg-primary flex-shrink-0 flex items-center justify-center"
                          aria-label="Reopen task"
                        >
                          <span className="material-symbols-outlined text-white text-[14px]">check</span>
                        </motion.button>
                        <h3 className="font-body-md text-body-md text-stone line-through">{task.title}</h3>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Empty state */}
            {filteredTasks.length === 0 && (
              <div className="flex flex-col items-center justify-center h-48 text-center gap-3 mt-4">
                <span className="material-symbols-outlined text-[40px] text-stone/40">task_alt</span>
                <p className="font-body-md text-body-md text-stone">No tasks here</p>
              </div>
            )}
          </main>
        )}

        {/* ── NOTES TAB ── */}
        {activeTab === 'notes' && (
          <main className="flex-1 overflow-y-auto px-4 py-6 pb-24 flex flex-col gap-4">
            {notes.map((note) => (
              <article
                key={note.id}
                onClick={() => navigate('/notes/' + note.id)}
                className="bg-sandstone rounded-xl p-4 shadow-[0_4px_20px_rgba(34,30,26,0.08)] flex flex-col gap-2 relative group overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
              >
                {/* Left accent stripe */}
                <div className="absolute top-0 left-0 w-1 h-full bg-pandya-gold/40" />
                <div className="flex justify-between items-center pl-2">
                  <time className="font-data-mono text-data-mono text-stone text-[12px]">
                    {formatNoteDate(note.created_at)}
                  </time>
                </div>
                <h3 className="font-label-md text-label-md text-granite font-bold line-clamp-1 pl-2">
                  {note.body.split('\n')[0] || 'Untitled note'}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 leading-snug text-sm pl-2">
                  {note.body.split('\n').slice(1).join(' ')}
                </p>
              </article>
            ))}

            {notes.length === 0 && (
              <div className="flex flex-col items-center justify-center h-48 text-center mt-8 gap-3">
                <span className="material-symbols-outlined text-[40px] text-stone/40">sticky_note_2</span>
                <p className="font-body-md text-body-md text-stone italic">
                  No notes yet — tap + to write your first entry.
                </p>
              </div>
            )}
          </main>
        )}

        {/* FAB */}
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => activeTab === 'tasks' ? setShowAddTask(true) : handleNewNote()}
          className="fixed bottom-[88px] right-6 w-14 h-14 bg-madder-red text-temple-ivory rounded-full shadow-[0_4px_20px_rgba(139,44,36,0.3)] flex items-center justify-center hover:bg-primary transition-colors z-40"
          aria-label={activeTab === 'tasks' ? 'New task' : 'New note'}
        >
          <span className="material-symbols-outlined text-[28px]">add</span>
        </motion.button>

        <BottomNav />

        {/* ── Add Task Bottom Sheet ── */}
        <BottomSheet
          open={showAddTask}
          onClose={() => setShowAddTask(false)}
          title="New Task"
        >
          <input
            type="text"
            placeholder="Task title..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSaveTask()}
            autoFocus
            className="w-full bg-surface-container-high rounded-xl px-4 py-3 font-body-md text-body-md text-granite placeholder:text-stone/60 outline-none focus:ring-2 focus:ring-primary/30"
          />

          {/* Priority chips */}
          <div className="flex gap-2">
            {PRIORITY_OPTIONS.map(({ label, value }) => (
              <motion.button
                key={value}
                whileTap={{ scale: 0.94 }}
                onClick={() => setNewTaskPriority(value)}
                className={`flex-1 py-2 rounded-full font-label-md text-label-md text-sm transition-colors ${
                  newTaskPriority === value
                    ? 'bg-sandstone text-granite border border-pandya-gold/30 shadow-sm'
                    : 'bg-temple-ivory text-stone border border-stone/30'
                }`}
              >
                {label}
              </motion.button>
            ))}
          </div>

          {/* Due date */}
          <input
            type="date"
            value={newTaskDueDate}
            onChange={(e) => setNewTaskDueDate(e.target.value)}
            className="w-full bg-surface-container-high rounded-xl px-4 py-3 font-body-md text-body-md text-granite outline-none focus:ring-2 focus:ring-primary/30"
          />

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleSaveTask}
            disabled={!newTaskTitle.trim()}
            className="w-full py-3 rounded-xl bg-madder-red text-temple-ivory font-label-md text-label-md disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            Save Task
          </motion.button>
        </BottomSheet>

        {/* ── Three-dot Menu Bottom Sheet ── */}
        <BottomSheet
          open={showMenu}
          onClose={() => setShowMenu(false)}
        >
          <button
            onClick={() => {
              navigate(`/areas/${sectionId}/edit`)
              setShowMenu(false)
            }}
            className="w-full text-left px-4 py-3 rounded-xl font-body-md text-body-md text-granite hover:bg-surface-container-high transition-colors"
          >
            Edit Area
          </button>
          <button
            onClick={() => {
              setShowMenu(false)
              setShowDeleteConfirm(true)
            }}
            className="w-full text-left px-4 py-3 rounded-xl font-body-md text-body-md text-kumkum hover:bg-error-container transition-colors"
          >
            Delete Area
          </button>
        </BottomSheet>

        {/* ── Delete Confirm Bottom Sheet ── */}
        <BottomSheet
          open={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          title="Delete Area?"
        >
          <p className="font-body-md text-body-md text-stone">
            This will permanently delete the area and all its tasks and notes.
          </p>
          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 py-3 rounded-xl border border-stone/30 font-label-md text-label-md text-granite transition-colors hover:bg-surface-container-high"
            >
              Cancel
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleDeleteSection}
              className="flex-1 py-3 rounded-xl bg-kumkum text-white font-label-md text-label-md transition-colors hover:bg-madder-red"
            >
              Delete
            </motion.button>
          </div>
        </BottomSheet>
      </div>
    </PageWrapper>
  )
}
