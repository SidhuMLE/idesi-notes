import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import TopBar from '../components/TopBar'
import BottomSheet from '../components/BottomSheet'
import PageWrapper from '../components/PageWrapper'
import { useAppStore } from '../store/useAppStore'
import { useNav } from '../context/NavContext'
import type { Task } from '../types'

// ── helpers ──────────────────────────────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatHeaderDate(): string {
  const now = new Date()
  const day = now.toLocaleDateString('en-GB', { weekday: 'short' }).toUpperCase()
  const date = now.getDate()
  const month = now.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase()
  return `${day}, ${date} ${month}`
}

function formatRelativeDate(dateStr: string): string {
  const target = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  target.setHours(0, 0, 0, 0)

  const diff = target.getTime() - today.getTime()
  const days = Math.round(diff / 86400000)

  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'

  const weekday = target.toLocaleDateString('en-GB', { weekday: 'short' })
  const date = target.getDate()
  const month = target.toLocaleDateString('en-GB', { month: 'short' })
  return `${weekday} ${date} ${month}`
}

function formatTaskTime(dateStr: string): string {
  const d = new Date(dateStr)
  // If the time component is midnight (likely date-only), don't show a time
  if (d.getHours() === 0 && d.getMinutes() === 0) return formatRelativeDate(dateStr)
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

// ── component ─────────────────────────────────────────────────────────────────

const MotionLink = motion(Link)

export default function Home() {
  const navigate = useNavigate()
  const { hideNav, showNav } = useNav()
  const { sections, tasksDueToday, openTaskCountBySection, updateTask, addTask, displayName } =
    useAppStore()

  const dueToday = tasksDueToday()

  // ── Quick-add state ──────────────────────────────────────────────────────
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [quickTitle, setQuickTitle] = useState('')
  const [quickSection, setQuickSection] = useState('')
  const [quickDate, setQuickDate] = useState('')
  const [showAreaPicker, setShowAreaPicker] = useState(false)

  // ── Upcoming state ───────────────────────────────────────────────────────
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')

  const allTasks = useAppStore(s => s.tasks)
  const upcomingTasks = allTasks
    .filter(t => t.status !== 'done' && t.section_id)
    .filter(t => priorityFilter === 'all' || t.priority === priorityFilter)
    .sort((a, b) => {
      const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 }
      const pDiff = (priorityOrder[a.priority] ?? 3) - (priorityOrder[b.priority] ?? 3)
      if (pDiff !== 0) return pDiff
      if (a.due_date && b.due_date) return a.due_date.localeCompare(b.due_date)
      if (a.due_date) return -1
      if (b.due_date) return 1
      return 0
    })

  function getSectionName(task: Task): string {
    return sections.find((s) => s.id === task.section_id)?.name ?? 'Unknown'
  }

  function markDone(task: Task) {
    updateTask(task.id, { status: 'done' })
  }

  function handleQuickAdd() {
    if (!quickTitle.trim() || !quickSection) return
    addTask({
      section_id: quickSection,
      title: quickTitle.trim(),
      status: 'open',
      priority: 'medium',
      due_date: quickDate || undefined,
    })
    setShowQuickAdd(false)
    setQuickTitle('')
    setQuickSection('')
    setQuickDate('')
    showNav()
    sessionStorage.setItem('nav-direction', 'forward')
    navigate('/areas/' + quickSection)
  }

  const priorityDotColor: Record<string, string> = {
    high: 'bg-madder-red',
    medium: 'bg-pandya-gold',
    low: 'bg-peacock',
  }

  return (
    <PageWrapper>
      <div className="bg-temple-ivory text-granite font-body-md antialiased min-h-screen pb-16 selection:bg-pandya-gold/20">
        <TopBar title="Idesi Notes" />

        <main className="px-4 max-w-5xl mx-auto space-y-8 pt-6">

          {/* Header section */}
          <section className="space-y-2">
            <p className="font-data-mono text-data-mono text-stone tracking-wide">
              {formatHeaderDate()}
            </p>
            <h2 className="font-headline-md text-headline-md text-granite max-w-[80%]">
              {getGreeting()}, {displayName || 'Explorer'}
            </h2>
          </section>

          {/* Due Today */}
          <section className="space-y-4 relative -mx-4 px-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-sm text-headline-sm text-granite">Due Today</h3>
              <span className="bg-sandstone text-granite font-label-md text-label-md px-3 py-1 rounded-full">
                {dueToday.length} {dueToday.length === 1 ? 'Task' : 'Tasks'}
              </span>
            </div>

            <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-4 snap-x snap-mandatory scroll-mask -mx-4 px-4">
              {dueToday.length === 0 ? (
                <div className="min-w-[280px] snap-center bg-sandstone rounded-xl p-6 shadow-[0_8px_32px_rgba(34,30,26,0.08)] flex flex-col items-center justify-center gap-3 shrink-0 border border-pandya-gold/10 text-center">
                  <span className="material-symbols-outlined text-[40px] text-stone/50">check_circle</span>
                  <p className="font-body-md text-body-md text-stone">All clear for today</p>
                </div>
              ) : (
                dueToday.map((task) => (
                  <motion.article
                    key={task.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/tasks/' + task.id)}
                    className="min-w-[280px] snap-center bg-sandstone rounded-xl p-6 shadow-[0_8px_32px_rgba(34,30,26,0.08)] flex flex-col justify-between shrink-0 border border-pandya-gold/10 relative overflow-hidden cursor-pointer"
                  >
                    {/* decorative gradient */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-pandya-gold/5 to-transparent rounded-bl-full pointer-events-none" />

                    <div className="space-y-4 relative z-10">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-madder-red" />
                        <span className="font-label-md text-label-md text-stone uppercase tracking-widest">
                          {getSectionName(task)}
                        </span>
                      </div>
                      <h4 className="font-body-lg text-body-lg text-granite leading-tight">
                        {task.title}
                      </h4>
                    </div>

                    <div className="mt-8 flex items-center justify-between relative z-10">
                      <span className="font-data-mono text-data-mono text-madder-red flex items-center gap-1">
                        <span className="material-symbols-outlined text-[18px]">schedule</span>
                        {task.due_date ? formatTaskTime(task.due_date) : ''}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); markDone(task) }}
                        className="w-10 h-10 rounded-full border border-pandya-gold text-granite flex items-center justify-center hover:bg-pandya-gold/10 transition-colors"
                        aria-label="Mark done"
                      >
                        <span className="material-symbols-outlined text-[20px]">check</span>
                      </button>
                    </div>
                  </motion.article>
                ))
              )}
            </div>
          </section>

          <hr className="border-t border-dashed border-pandya-gold/30 mx-auto w-3/4" />

          {/* Upcoming */}
          <section className="space-y-4">
            <h3 className="font-headline-sm text-headline-sm text-granite">Upcoming</h3>

            {/* Priority filter chips */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
              {(['all', 'high', 'medium', 'low'] as const).map(p => (
                <motion.button key={p} whileTap={{ scale: 0.94 }}
                  onClick={() => setPriorityFilter(p)}
                  className={`px-3 py-1 rounded-full font-label-md text-label-md capitalize whitespace-nowrap transition-colors ${priorityFilter === p ? 'bg-madder-red text-temple-ivory' : 'bg-sandstone text-stone hover:bg-sandstone/80'}`}>
                  {p === 'all' ? 'All' : p.charAt(0).toUpperCase() + p.slice(1)}
                </motion.button>
              ))}
            </div>

            {upcomingTasks.length === 0 ? (
              <p className="font-body-md text-body-md text-stone py-4">No tasks found.</p>
            ) : (
              <div className="space-y-3">
                {upcomingTasks.slice(0, 10).map((task) => (
                  <motion.div
                    key={task.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/tasks/' + task.id)}
                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-sandstone/50 transition-colors border-b border-pandya-gold/10 last:border-0 group cursor-pointer"
                  >
                    <div className={`w-2 h-2 rounded-full mt-1 self-start shrink-0 ${priorityDotColor[task.priority] ?? 'bg-stone'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-label-md text-label-md text-stone uppercase tracking-wide mb-1">
                        {getSectionName(task)}
                      </p>
                      <p className="font-body-md text-body-md text-granite group-hover:text-madder-red transition-colors truncate">
                        {task.title}
                      </p>
                    </div>
                    {task.due_date && (
                      <div className="bg-surface-variant text-granite font-caption text-caption px-3 py-1 rounded-full whitespace-nowrap shrink-0">
                        {formatRelativeDate(task.due_date)}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
            {upcomingTasks.length > 10 && (
              <button className="w-full py-3 text-center font-label-md text-label-md text-madder-red hover:bg-madder-red/5 rounded-lg transition-colors border border-transparent hover:border-madder-red/20">
                View all upcoming
              </button>
            )}
          </section>

          <hr className="border-t border-dashed border-pandya-gold/30 mx-auto w-3/4" />

          {/* My Areas */}
          <section className="space-y-4 relative -mx-4 px-4">
            <h3 className="font-headline-sm text-headline-sm text-granite">My Areas</h3>
            <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-4 scroll-mask -mx-4 px-4">
              {sections.map((section) => (
                <MotionLink
                  key={section.id}
                  to={'/areas/' + section.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="min-w-[140px] aspect-square bg-surface rounded-xl p-4 border border-pandya-gold/20 flex flex-col items-center justify-center gap-3 hover:bg-sandstone transition-colors shadow-[0_4px_16px_rgba(34,30,26,0.04)] shrink-0"
                >
                  <div className="w-12 h-12 rounded-full bg-sandstone flex items-center justify-center text-madder-red">
                    <span className="material-symbols-outlined text-[24px]">{section.icon}</span>
                  </div>
                  <div className="text-center">
                    <p className="font-label-md text-label-md text-granite">{section.name}</p>
                    <p className="font-caption text-caption text-stone">
                      {openTaskCountBySection(section.id)} active
                    </p>
                  </div>
                </MotionLink>
              ))}

              <MotionLink
                to="/areas/new"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="min-w-[140px] aspect-square bg-surface rounded-xl p-4 border border-dashed border-stone flex flex-col items-center justify-center gap-3 hover:bg-sandstone transition-colors shrink-0"
              >
                <div className="w-12 h-12 rounded-full border border-dashed border-stone flex items-center justify-center text-stone">
                  <span className="material-symbols-outlined text-[24px]">add</span>
                </div>
                <p className="font-label-md text-label-md text-granite">New Area</p>
              </MotionLink>
            </div>
          </section>

        </main>

        {/* FAB */}
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => { setShowQuickAdd(true); hideNav() }}
          className="fixed bottom-20 right-4 w-14 h-14 bg-madder-red text-temple-ivory rounded-2xl shadow-[0_8px_24px_rgba(139,44,36,0.3)] flex items-center justify-center z-40"
          aria-label="Quick add task"
        >
          <span className="material-symbols-outlined text-[28px]">add</span>
        </motion.button>

        {/* Quick-add bottom sheet */}
        <BottomSheet open={showQuickAdd} onClose={() => { setShowQuickAdd(false); showNav() }} title="Quick Add Task" backdropClassName="z-[59]" sheetClassName="z-[60]">
          <input
            autoFocus
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleQuickAdd()}
            placeholder="Task title..."
            className="w-full bg-temple-ivory border border-stone/30 rounded-lg px-4 py-3 font-body-md text-body-md text-granite placeholder:text-stone/50 focus:outline-none focus:border-pandya-gold focus:ring-1 focus:ring-pandya-gold"
          />

          {/* Area picker button */}
          <button
            onClick={() => setShowAreaPicker(true)}
            className="w-full flex items-center justify-between bg-temple-ivory border border-stone/30 rounded-lg px-4 py-3 font-body-md text-body-md text-granite focus:outline-none"
          >
            <span className={quickSection ? 'text-granite' : 'text-stone/50'}>
              {quickSection ? sections.find(s => s.id === quickSection)?.name : 'Select area...'}
            </span>
            <span className="material-symbols-outlined text-stone text-[20px]">expand_more</span>
          </button>

          <input
            type="date"
            value={quickDate}
            onChange={(e) => setQuickDate(e.target.value)}
            className="w-full bg-temple-ivory border border-stone/30 rounded-lg px-4 py-3 font-body-md text-body-md text-granite focus:outline-none focus:border-pandya-gold"
          />

          <button
            onClick={handleQuickAdd}
            disabled={!quickTitle.trim() || !quickSection}
            className="w-full py-3 bg-madder-red text-temple-ivory rounded-lg font-label-md text-label-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-kumkum transition-colors"
          >
            Add Task
          </button>
        </BottomSheet>

        {/* Area picker bottom sheet */}
        <BottomSheet open={showAreaPicker} onClose={() => setShowAreaPicker(false)} title="Select Area" backdropClassName="z-[69]" sheetClassName="z-[70]">
          {sections.map(s => (
            <button key={s.id} onClick={() => { setQuickSection(s.id); setShowAreaPicker(false) }}
              className={`w-full flex items-center gap-3 py-3 px-2 rounded-lg transition-colors text-left ${quickSection === s.id ? 'bg-sandstone' : 'hover:bg-sandstone/50'}`}>
              <span className="material-symbols-outlined text-madder-red">{s.icon}</span>
              <span className="font-body-md text-body-md text-granite">{s.name}</span>
              {quickSection === s.id && <span className="material-symbols-outlined text-madder-red ml-auto">check</span>}
            </button>
          ))}
        </BottomSheet>

      </div>
    </PageWrapper>
  )
}
