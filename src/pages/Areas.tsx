import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import BottomNav from '../components/BottomNav'
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

  function handleDelete(id: string) {
    deleteSection(id)
    setConfirmDeleteId(null)
  }

  return (
    <PageWrapper>
      <div className="bg-temple-ivory text-granite font-body-md antialiased min-h-screen flex flex-col pb-[100px] relative">
        {/* Sticky header */}
        <header className="w-full top-0 sticky bg-temple-ivory z-40 border-b border-pandya-gold/10 transition-shadow">
          <div className="flex justify-between items-center px-md py-sm h-16 max-w-full mx-auto md:px-margin">
            {editMode ? (
              <button
                onClick={() => setEditMode(false)}
                className="font-label-md text-label-md text-madder-red px-2 py-2 rounded-full hover:bg-sandstone/50 active:scale-95 duration-150 transition-colors focus:outline-none"
              >
                Done
              </button>
            ) : (
              <button
                onClick={() => {}}
                className="text-granite p-2 rounded-full hover:bg-sandstone/50 active:scale-95 duration-150 transition-colors focus:outline-none"
                aria-label="Menu"
              >
                <span className="material-symbols-outlined">menu</span>
              </button>
            )}
            <h1 className="font-headline-sm text-headline-sm text-granite tracking-tight">My Areas</h1>
            <button
              onClick={() => setEditMode((v) => !v)}
              className="text-granite p-2 rounded-full hover:bg-sandstone/50 active:scale-95 duration-150 transition-colors focus:outline-none"
              aria-label="More options"
            >
              <span className="material-symbols-outlined">more_vert</span>
            </button>
          </div>
        </header>

        <main className="flex-1 px-md py-lg flex flex-col gap-4 max-w-lg mx-auto w-full">
          {/* Section list */}
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
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  editMode
                    ? navigate(`/areas/${section.id}/edit`)
                    : navigate('/areas/' + section.id)
                }
                className="group flex items-center bg-surface-container-low rounded-xl p-4 shadow-[0_4px_20px_rgba(34,30,26,0.03)] border border-pandya-gold/10 active:scale-[0.98] transition-transform cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-sandstone flex items-center justify-center text-madder-red shrink-0 border border-pandya-gold/20">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {section.icon}
                  </span>
                </div>
                <div className="ml-4 flex-1 min-w-0">
                  <h3 className="font-label-md text-label-md text-granite truncate">{section.name}</h3>
                  <p className="font-caption text-caption text-stone mt-1">
                    {openCount} open task{openCount !== 1 ? 's' : ''} · {noteCount} note{noteCount !== 1 ? 's' : ''}
                  </p>
                </div>
                {editMode ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setConfirmDeleteId(section.id)
                    }}
                    className="text-pandya-gold/60 hover:text-error transition-colors ml-2 shrink-0 p-1"
                    aria-label="Delete area"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                ) : (
                  <span className="material-symbols-outlined text-pandya-gold/60 group-hover:text-pandya-gold transition-colors shrink-0 ml-2">
                    chevron_right
                  </span>
                )}
              </motion.div>
            )
          })}

          {/* Empty state */}
          {sections.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 text-center gap-4 mt-8">
              <div className="w-16 h-16 rounded-full bg-pearl flex items-center justify-center border border-pandya-gold/20">
                <span className="material-symbols-outlined text-[28px] text-stone">category</span>
              </div>
              <p className="font-body-md text-body-md text-stone">No areas yet</p>
              <p className="font-caption text-caption text-stone/70">
                Create your first life area to get started
              </p>
            </div>
          )}

          {/* New Area button */}
          {!editMode && (
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
          )}
        </main>

        {/* Confirm delete dialog */}
        {confirmDeleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-granite/40 backdrop-blur-sm px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-temple-ivory rounded-2xl p-6 w-full max-w-sm shadow-[0_16px_48px_rgba(34,30,26,0.18)] border border-pandya-gold/20"
            >
              <h3 className="font-headline-sm text-headline-sm text-granite mb-2">Delete area?</h3>
              <p className="font-body-md text-body-md text-stone mb-6">
                This will permanently delete the area. Tasks and notes inside it will remain.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="flex-1 py-2.5 rounded-lg border border-pandya-gold/40 font-label-md text-label-md text-granite hover:bg-sandstone/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDeleteId)}
                  className="flex-1 py-2.5 rounded-lg bg-error text-on-primary font-label-md text-label-md hover:opacity-90 transition-opacity"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}

        <BottomNav />
      </div>
    </PageWrapper>
  )
}
