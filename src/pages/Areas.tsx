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

  const sorted = [...sections].sort((a, b) => a.order - b.order)

  return (
    <PageWrapper>
      <div className="min-h-screen bg-temple-ivory text-granite font-body-md flex flex-col pb-[100px]">
        {/* Sticky header */}
        <header className="sticky top-0 z-40 bg-temple-ivory border-b border-pandya-gold/10">
          <div className="flex justify-between items-center px-4 py-2 h-16">
            <span className="w-10" />
            <h1 className="font-headline-sm text-headline-sm text-granite">My Areas</h1>
            {editMode ? (
              <button
                onClick={() => setEditMode(false)}
                className="font-label-md text-label-md text-madder-red px-2"
              >
                Done
              </button>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditMode(true)}
                  className="w-10 h-10 flex items-center justify-center text-stone hover:text-granite rounded-full"
                  aria-label="Edit areas"
                >
                  <span className="material-symbols-outlined text-[22px]">edit</span>
                </button>
                <button
                  onClick={() => navigate('/areas/new')}
                  className="w-10 h-10 flex items-center justify-center text-stone hover:text-granite rounded-full"
                  aria-label="New area"
                >
                  <span className="material-symbols-outlined text-[22px]">add</span>
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 px-4 py-6 flex flex-col gap-4 max-w-lg mx-auto w-full">
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
                onClick={editMode ? undefined : () => navigate('/areas/' + section.id)}
                className={`group flex items-center bg-surface-container-low rounded-xl p-4 shadow-[0_4px_20px_rgba(34,30,26,0.03)] border border-pandya-gold/10 transition-transform ${editMode ? 'cursor-default' : 'active:scale-[0.98] cursor-pointer'}`}
              >
                {editMode && (
                  <span className="material-symbols-outlined text-stone/40 text-[22px] mr-3 shrink-0">
                    drag_handle
                  </span>
                )}
                <div className="w-12 h-12 rounded-full bg-sandstone flex items-center justify-center text-madder-red shrink-0 border border-pandya-gold/20">
                  <span className="material-symbols-outlined text-[22px]">{section.icon}</span>
                </div>
                <div className="ml-4 flex-1 min-w-0">
                  <h3 className="font-label-md text-label-md text-granite truncate">{section.name}</h3>
                  <p className="font-caption text-caption text-stone mt-1">
                    {openCount} open task{openCount !== 1 ? 's' : ''} · {noteCount} note{noteCount !== 1 ? 's' : ''}
                  </p>
                </div>
                {editMode ? (
                  <div className="flex items-center gap-2 ml-2">
                    <button
                      onClick={() => navigate(`/areas/${section.id}/edit`)}
                      className="p-2 text-stone hover:text-madder-red"
                      aria-label="Edit area"
                    >
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button
                      onClick={() => deleteSection(section.id)}
                      className="p-2 text-stone hover:text-error"
                      aria-label="Delete area"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
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
                className="w-full flex items-center justify-center gap-2 border border-pandya-gold text-granite rounded-lg py-3.5 px-4 font-label-md text-label-md hover:bg-pandya-gold/5 active:bg-pandya-gold/10 transition-colors"
              >
                <span className="material-symbols-outlined text-pandya-gold text-[20px]">add</span>
                New Area
              </motion.button>
            </div>
          )}
        </main>

        <BottomNav />
      </div>
    </PageWrapper>
  )
}
