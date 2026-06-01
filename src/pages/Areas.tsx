import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import BottomNav from '../components/BottomNav'

export default function Areas() {
  const navigate = useNavigate()
  const sections = useAppStore((s) => s.sections)
  const tasks = useAppStore((s) => s.tasks)
  const notes = useAppStore((s) => s.notes)

  const sorted = [...sections].sort((a, b) => a.order - b.order)

  return (
    <div className="min-h-screen bg-temple-ivory text-granite font-body-md flex flex-col pb-[100px]">
      {/* Sticky header */}
      <header className="sticky top-0 z-40 bg-temple-ivory border-b border-pandya-gold/10">
        <div className="flex justify-between items-center px-4 py-2 h-16">
          {/* Spacer to balance the right button */}
          <span className="w-10" />
          <h1 className="font-headline-sm text-headline-sm text-granite">My Areas</h1>
          <button
            className="w-10 h-10 flex items-center justify-center text-stone hover:text-granite active:scale-90 transition-all duration-150 rounded-full"
            aria-label="More options"
          >
            <span className="material-symbols-outlined text-[22px]">more_vert</span>
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 flex flex-col gap-4 max-w-lg mx-auto w-full">
        {/* Section list */}
        {sorted.map((section) => {
          const openCount = tasks.filter(
            (t) => t.section_id === section.id && t.status !== 'done',
          ).length
          const noteCount = notes.filter((n) => n.section_id === section.id).length

          return (
            <div
              key={section.id}
              onClick={() => navigate('/areas/' + section.id)}
              className="group flex items-center bg-surface-container-low rounded-xl p-4 shadow-[0_4px_20px_rgba(34,30,26,0.03)] border border-pandya-gold/10 active:scale-[0.98] transition-transform cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-sandstone flex items-center justify-center text-madder-red shrink-0 border border-pandya-gold/20">
                <span className="material-symbols-outlined text-[22px]">{section.icon}</span>
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <h3 className="font-label-md text-label-md text-granite truncate">{section.name}</h3>
                <p className="font-caption text-caption text-stone mt-1">
                  {openCount} open task{openCount !== 1 ? 's' : ''} · {noteCount} note{noteCount !== 1 ? 's' : ''}
                </p>
              </div>
              <span className="material-symbols-outlined text-pandya-gold/60 group-hover:text-pandya-gold transition-colors shrink-0 ml-2">
                chevron_right
              </span>
            </div>
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
        <div className="mt-6">
          <button
            onClick={() => navigate('/areas/new')}
            className="w-full flex items-center justify-center gap-2 border border-pandya-gold text-granite rounded-lg py-3.5 px-4 font-label-md text-label-md hover:bg-pandya-gold/5 active:bg-pandya-gold/10 transition-colors"
          >
            <span className="material-symbols-outlined text-pandya-gold text-[20px]">add</span>
            New Area
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
