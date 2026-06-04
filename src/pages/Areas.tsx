import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import PageWrapper from '../components/PageWrapper'

export default function Areas() {
  const navigate = useNavigate()
  const sections = useAppStore((s) => s.sections)
  const tasks = useAppStore((s) => s.tasks)
  const notes = useAppStore((s) => s.notes)
  const deleteSection = useAppStore((s) => s.deleteSection)
  const [editMode, setEditMode] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const sorted = [...sections].sort((a, b) => a.order - b.order)

  return (
    <PageWrapper>
      <div className="bg-temple-ivory text-granite font-body-md min-h-screen flex flex-col antialiased relative pb-16">

        {/* Header */}
        <header className="w-full top-0 sticky bg-temple-ivory z-40 border-b border-pandya-gold/10">
          <div className="flex justify-between items-center px-4 py-2 h-14">
            <h1 className="font-headline-sm text-headline-sm text-madder-red">My Areas</h1>
            <div className="flex items-center gap-1">
              {editMode ? (
                <button onClick={() => setEditMode(false)}
                  className="font-label-md text-label-md text-madder-red px-3 py-1.5">
                  Done
                </button>
              ) : (
                <button onClick={() => setEditMode(v => !v)}
                  className="text-stone p-2 rounded-full hover:bg-sandstone/50 active:scale-95 duration-150 transition-colors">
                  <span className="material-symbols-outlined text-[22px]">more_vert</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Main — matches Stitch structure exactly */}
        <main className="flex-1 px-md py-6 flex flex-col gap-4 max-w-[32rem] mx-auto w-full">

          {/* Row list — gap-3 between rows, same as Stitch */}
          <div className="flex flex-col gap-3">
            {sorted.map((section, index) => {
              const openCount = tasks.filter(
                (t) => t.section_id === section.id && t.status !== 'done',
              ).length
              const noteCount = notes.filter((n) => n.section_id === section.id).length

              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, delay: index * 0.04 }}
                  onClick={() =>
                    editMode
                      ? navigate(`/areas/${section.id}/edit`)
                      : navigate('/areas/' + section.id)
                  }
                  className="group flex items-center bg-surface-container-low rounded-xl p-4 shadow-[0_4px_20px_rgba(34,30,26,0.03)] border border-pandya-gold/10 active:scale-[0.98] transition-transform cursor-pointer"
                >
                  {/* Icon — filled, matches Stitch */}
                  <div className="w-12 h-12 rounded-full bg-sandstone flex items-center justify-center text-madder-red shrink-0 border border-pandya-gold/20">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {section.icon}
                    </span>
                  </div>

                  {/* Text */}
                  <div className="ml-4 flex-1">
                    <h3 className="font-label-md text-label-md text-granite">{section.name}</h3>
                    <p className="font-caption text-caption text-stone mt-1">
                      {openCount} open task{openCount !== 1 ? 's' : ''} · {noteCount} note{noteCount !== 1 ? 's' : ''}
                    </p>
                  </div>

                  {/* Right action — chevron or delete */}
                  {editMode ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setConfirmDeleteId(section.id)
                      }}
                      className="text-stone/50 hover:text-error transition-colors p-1"
                      aria-label="Delete area"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  ) : (
                    <div className="text-pandya-gold/60 group-hover:text-pandya-gold transition-colors">
                      <span className="material-symbols-outlined">chevron_right</span>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Empty state */}
          {sections.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 text-center gap-4 mt-8">
              <div className="w-16 h-16 rounded-full bg-pearl flex items-center justify-center border border-pandya-gold/20">
                <span className="material-symbols-outlined text-[28px] text-stone">category</span>
              </div>
              <p className="font-body-md text-body-md text-stone">No areas yet</p>
              <p className="font-caption text-caption text-stone/70">Create your first life area to get started</p>
            </div>
          )}

          {/* New Area button */}
          <div className="mt-6">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/areas/new')}
              className="w-full flex items-center justify-center gap-2 border border-pandya-gold text-granite rounded-lg py-3.5 px-4 font-label-md text-label-md hover:bg-pandya-gold/5 active:bg-pandya-gold/10 transition-colors focus:outline-none focus:ring-2 focus:ring-pandya-gold focus:ring-offset-2 focus:ring-offset-temple-ivory"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span>New Area</span>
            </motion.button>
          </div>
        </main>

        {/* Confirm delete */}
        {confirmDeleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-granite/40 px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-temple-ivory rounded-2xl p-6 w-full max-w-[24rem] shadow-xl border border-pandya-gold/20"
            >
              <h3 className="font-headline-sm text-headline-sm text-granite mb-2">Delete area?</h3>
              <p className="font-body-md text-body-md text-stone mb-6">
                This will permanently delete the area and all its tasks and notes.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="flex-1 py-2.5 rounded-lg border border-pandya-gold/40 font-label-md text-label-md text-granite"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { deleteSection(confirmDeleteId); setConfirmDeleteId(null) }}
                  className="flex-1 py-2.5 rounded-lg bg-error text-white font-label-md text-label-md"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}

      </div>
    </PageWrapper>
  )
}
