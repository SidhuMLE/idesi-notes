import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import PageWrapper from '../components/PageWrapper'
import { useAppStore } from '../store/useAppStore'
import type { Section } from '../types'

function SortableAreaRow({ section }: { section: Section }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
  }
  return (
    <li ref={setNodeRef} style={style}
      className="flex items-center justify-between p-4 bg-temple-ivory/50 touch-none">
      <div className="flex items-center space-x-4">
        <span className="material-symbols-outlined text-madder-red">{section.icon}</span>
        <span className="font-body-md text-body-md text-granite">{section.name}</span>
      </div>
      <button {...attributes} {...listeners}
        className="text-stone/50 cursor-grab active:cursor-grabbing p-1 touch-none"
        aria-label="Drag to reorder">
        <span className="material-symbols-outlined">drag_handle</span>
      </button>
    </li>
  )
}

export default function Settings() {
  const { sections, reorderSections } = useAppStore()
  const [dueDateReminders, setDueDateReminders] = useState(true)
  const [dailySummary, setDailySummary] = useState(false)
  const navigate = useNavigate()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )
  const sorted = [...sections].sort((a, b) => a.order - b.order)

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = sorted.findIndex(s => s.id === active.id)
      const newIndex = sorted.findIndex(s => s.id === over.id)
      const newOrder = arrayMove(sorted, oldIndex, newIndex)
      reorderSections(newOrder.map(s => s.id))
    }
  }

  const handleExport = () => {
    const data = JSON.stringify(useAppStore.getState())
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'idesi-notes-backup.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <PageWrapper>
      <div className="min-h-screen flex flex-col font-body-md text-body-md bg-temple-ivory">
        <header className="w-full top-0 sticky z-40 bg-surface border-b border-outline-variant/20 flex justify-between items-center px-6 py-2">
          <h1 className="font-headline-sm text-headline-sm text-madder-red">Settings</h1>
          <div className="w-8" />
        </header>

        <main className="flex-1 px-4 pt-6 pb-16 space-y-8 overflow-y-auto">
          {/* My Areas */}
          <section className="space-y-4">
            <h2 className="px-2 font-label-md text-label-md text-stone uppercase tracking-widest">
              My Areas
            </h2>
            <div className="bg-sandstone/30 rounded-xl overflow-hidden border border-pandya-gold/10 shadow-[0_4px_12px_rgba(34,30,26,0.04)]">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={sorted.map(s => s.id)} strategy={verticalListSortingStrategy}>
                  <ul className="divide-y divide-pandya-gold/10">
                    {sorted.map(section => <SortableAreaRow key={section.id} section={section} />)}
                  </ul>
                </SortableContext>
              </DndContext>
            </div>
            <button
              onClick={() => navigate('/areas')}
              className="w-full py-3 px-6 border border-pandya-gold rounded-lg font-label-md text-granite hover:bg-sandstone/20 transition-all flex items-center justify-center space-x-2"
            >
              <span className="material-symbols-outlined text-[20px]">edit</span>
              <span>Edit Areas</span>
            </button>
          </section>

          {/* Notifications */}
          <section className="space-y-4">
            <h2 className="px-2 font-label-md text-label-md text-stone uppercase tracking-widest">
              Notifications
            </h2>
            <div className="bg-sandstone/30 rounded-xl overflow-hidden border border-pandya-gold/10">
              <div className="flex items-center justify-between p-4 border-b border-pandya-gold/10">
                <span className="font-body-md text-granite">Due date reminders</span>
                <button
                  onClick={() => setDueDateReminders((v) => !v)}
                  className={`w-12 h-6 rounded-full relative flex items-center transition-colors duration-200 ${
                    dueDateReminders ? 'bg-madder-red' : 'bg-stone/30'
                  }`}
                >
                  <motion.span
                    layout
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    className="w-5 h-5 bg-white rounded-full shadow-sm absolute"
                    style={{ left: dueDateReminders ? 'calc(100% - 22px)' : '2px' }}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between p-4">
                <div>
                  <span className="font-body-md text-granite block">Daily summary</span>
                  <span className="font-caption text-caption text-stone">
                    A morning overview of today's tasks
                  </span>
                </div>
                <button
                  onClick={() => setDailySummary((v) => !v)}
                  className={`w-12 h-6 rounded-full relative flex items-center transition-colors duration-200 ml-4 flex-shrink-0 ${
                    dailySummary ? 'bg-madder-red' : 'bg-stone/30'
                  }`}
                >
                  <motion.span
                    layout
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    className="w-5 h-5 bg-white rounded-full shadow-sm absolute"
                    style={{ left: dailySummary ? 'calc(100% - 22px)' : '2px' }}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Data */}
          <section className="space-y-4">
            <h2 className="px-2 font-label-md text-label-md text-stone uppercase tracking-widest">
              Data
            </h2>
            <div className="bg-sandstone/30 rounded-xl overflow-hidden border border-pandya-gold/10">
              <button
                onClick={handleExport}
                className="flex items-center gap-3 p-4 w-full text-left border-b border-pandya-gold/10 hover:bg-sandstone/30 transition-colors"
              >
                <span className="material-symbols-outlined text-stone">download</span>
                <span className="font-body-md text-granite">Export all data</span>
              </button>
              <button className="flex items-center gap-3 p-4 w-full text-left hover:bg-error-container/20 transition-colors">
                <span className="material-symbols-outlined text-kumkum">delete</span>
                <span className="font-body-md text-kumkum">Delete all data</span>
              </button>
            </div>
          </section>

          {/* Version */}
          <p className="text-center font-caption text-caption text-stone pb-4">
            Idesi Notes v0.1.0
          </p>
        </main>
      </div>
    </PageWrapper>
  )
}
