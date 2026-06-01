import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import { useAppStore } from '../store/useAppStore'

export default function Settings() {
  const { sections } = useAppStore()
  const [colorMode, setColorMode] = useState<'Light' | 'Dark' | 'System'>('Light')
  const [dueDateReminders, setDueDateReminders] = useState(true)
  const [dailySummary, setDailySummary] = useState(false)
  const navigate = useNavigate()

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
    <div className="min-h-screen flex flex-col font-body-md text-body-md bg-temple-ivory">
      <header className="w-full top-0 sticky z-40 bg-surface border-b border-outline-variant/20 flex justify-between items-center px-6 py-2">
        <h1 className="font-headline-sm text-headline-sm text-madder-red">Settings</h1>
        <div className="w-8" />
      </header>

      <main className="flex-1 px-4 pt-6 pb-24 space-y-8 overflow-y-auto">
        {/* My Areas */}
        <section className="space-y-4">
          <h2 className="px-2 font-label-md text-label-md text-stone uppercase tracking-widest">
            My Areas
          </h2>
          <div className="bg-sandstone/30 rounded-xl overflow-hidden border border-pandya-gold/10 shadow-[0_4px_12px_rgba(34,30,26,0.04)]">
            <ul className="divide-y divide-pandya-gold/10">
              {[...sections]
                .sort((a, b) => a.order - b.order)
                .map((section) => (
                  <li
                    key={section.id}
                    className="flex items-center justify-between p-4 bg-temple-ivory/50"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="material-symbols-outlined text-madder-red">
                        {section.icon}
                      </span>
                      <span className="font-body-md text-granite">{section.name}</span>
                    </div>
                    <span className="material-symbols-outlined text-stone/50 cursor-grab">
                      drag_handle
                    </span>
                  </li>
                ))}
            </ul>
          </div>
          <button
            onClick={() => navigate('/areas/new')}
            className="w-full py-3 px-6 border border-pandya-gold rounded-lg font-label-md text-granite hover:bg-sandstone/20 transition-all flex items-center justify-center space-x-2"
          >
            <span className="material-symbols-outlined text-[20px]">edit</span>
            <span>Manage Areas</span>
          </button>
        </section>

        {/* Appearance */}
        <section className="space-y-4">
          <h2 className="px-2 font-label-md text-label-md text-stone uppercase tracking-widest">
            Appearance
          </h2>
          <div className="bg-sandstone/30 rounded-xl p-4 border border-pandya-gold/10">
            <div className="flex items-center justify-between">
              <span className="font-body-md text-granite">Colour mode</span>
              <div className="grid grid-cols-3 p-1 bg-pearl rounded-lg border border-outline-variant/20">
                {(['Light', 'Dark', 'System'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setColorMode(m)}
                    className={`py-2 px-3 text-center rounded-md font-label-md text-[12px] transition-all ${
                      colorMode === m
                        ? 'bg-white text-madder-red shadow-sm'
                        : 'text-stone hover:text-granite'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
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
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  dueDateReminders ? 'bg-madder-red' : 'bg-stone/30'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    dueDateReminders ? 'translate-x-7' : 'translate-x-1'
                  }`}
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
                className={`w-12 h-6 rounded-full transition-colors relative ml-4 flex-shrink-0 ${
                  dailySummary ? 'bg-madder-red' : 'bg-stone/30'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    dailySummary ? 'translate-x-7' : 'translate-x-1'
                  }`}
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

      <BottomNav />
    </div>
  )
}
