import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'
import { useAppStore } from '../store/useAppStore'

const RECENT_KEY = 'idesi-recent-searches'
const MAX_RECENT = 5

function getRecentSearches(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]')
  } catch {
    return []
  }
}

function addRecentSearch(query: string) {
  if (!query.trim()) return
  const recent = getRecentSearches().filter(s => s !== query)
  recent.unshift(query)
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)))
}

export default function Search() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'All' | 'Tasks' | 'Notes'>('All')
  const [recentSearches, setRecentSearches] = useState<string[]>(getRecentSearches)
  const navigate = useNavigate()
  const { tasks, notes, sections } = useAppStore()

  const matchedTasks =
    filter !== 'Notes'
      ? tasks.filter(
          (t) =>
            t.title.toLowerCase().includes(query.toLowerCase()) ||
            t.body_notes?.toLowerCase().includes(query.toLowerCase()),
        )
      : []

  const matchedNotes =
    filter !== 'Tasks'
      ? notes.filter((n) => n.body.toLowerCase().includes(query.toLowerCase()))
      : []

  const getSectionName = (id: string) =>
    sections.find((s) => s.id === id)?.name || 'Unknown'

  const highlight = (text: string): React.ReactNode => {
    if (!query) return text
    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="text-madder-red">
          {part}
        </span>
      ) : (
        part
      ),
    )
  }

  const handleBlur = () => {
    if (query.trim()) {
      addRecentSearch(query)
      setRecentSearches(getRecentSearches())
    }
  }

  const handleClearRecent = () => {
    localStorage.removeItem(RECENT_KEY)
    setRecentSearches([])
  }

  // Combined results array for indexed animation delays
  const taskResults = matchedTasks.map((task, index) => ({ type: 'task' as const, item: task, index }))
  const noteResults = matchedNotes.map((note, index) => ({ type: 'note' as const, item: note, index: taskResults.length + index }))
  const allResults = [...taskResults, ...noteResults]

  return (
    <PageWrapper>
      <div className="min-h-screen bg-temple-ivory pb-16">
        {/* Header */}
        <header className="w-full top-0 sticky z-40 bg-temple-ivory border-b border-pandya-gold/10 flex justify-between items-center px-4 py-2">
          <button
            onClick={() => { sessionStorage.setItem('nav-direction', 'back'); navigate(-1) }}
            className="text-granite p-2 rounded-full hover:bg-sandstone active:scale-95"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline-sm text-headline-sm text-madder-red">Search</h1>
          <div className="w-10" />
        </header>

        <main className="px-4 py-6 space-y-6">
          {/* Search input */}
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone pointer-events-none">
              search
            </span>
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onBlur={handleBlur}
              className="w-full pl-10 pr-10 py-3 bg-temple-ivory border border-stone rounded-lg font-body-md text-body-md text-granite placeholder-stone focus:outline-none focus:border-pandya-gold focus:ring-1 focus:ring-pandya-gold transition-colors"
              placeholder="Search notes, tasks, areas..."
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone hover:text-granite p-1 rounded-full active:scale-95"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            )}
          </div>

          {/* Filter chips */}
          <div className="flex space-x-3 overflow-x-auto pb-2 hide-scrollbar">
            {(['All', 'Tasks', 'Notes'] as const).map((f) => (
              <motion.button
                key={f}
                whileTap={{ scale: 0.94 }}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors ${
                  filter === f
                    ? 'bg-madder-red text-temple-ivory shadow-[0_4px_12px_rgba(34,30,26,0.08)]'
                    : 'bg-sandstone text-granite hover:bg-pandya-gold/20'
                }`}
              >
                {f}
              </motion.button>
            ))}
          </div>

          {/* Results */}
          {query && (
            <div className="space-y-4">
              <h2 className="font-label-md text-caption text-stone uppercase tracking-wider">
                RESULTS
              </h2>
              {allResults.map(({ type, item, index }) =>
                type === 'task' ? (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, delay: index * 0.03 }}
                    onClick={() => navigate('/tasks/' + item.id)}
                    className="bg-sandstone rounded-xl p-4 shadow-[0_4px_12px_rgba(34,30,26,0.05)] cursor-pointer active:scale-[0.98] transition-transform"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="mt-1 flex-shrink-0 text-stone">
                        <span className="material-symbols-outlined">check_box</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-caption text-caption text-stone mb-1">
                          {getSectionName(item.section_id)}
                        </div>
                        <h3 className="font-label-md text-body-md text-granite mb-2">
                          {highlight(item.title)}
                        </h3>
                        {item.body_notes && (
                          <p className="font-body-md text-caption text-stone line-clamp-2">
                            {highlight(item.body_notes)}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.article>
                ) : (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, delay: index * 0.03 }}
                    onClick={() => navigate('/notes/' + item.id)}
                    className="bg-sandstone rounded-xl p-4 shadow-[0_4px_12px_rgba(34,30,26,0.05)] cursor-pointer active:scale-[0.98] transition-transform"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="mt-1 flex-shrink-0 text-stone">
                        <span className="material-symbols-outlined">article</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-caption text-caption text-stone mb-1">
                          {getSectionName(item.section_id)}
                        </div>
                        <h3 className="font-label-md text-body-md text-granite mb-2">
                          {highlight(item.body.split('\n')[0] || 'Untitled')}
                        </h3>
                        <p className="font-body-md text-caption text-stone line-clamp-2">
                          {highlight(item.body)}
                        </p>
                      </div>
                    </div>
                  </motion.article>
                )
              )}
              {matchedTasks.length === 0 && matchedNotes.length === 0 && (
                <div className="text-center py-12">
                  <span className="material-symbols-outlined text-[48px] text-stone/30">
                    search_off
                  </span>
                  <p className="font-body-md text-body-md text-stone mt-2">
                    No results for "{query}"
                  </p>
                  <p className="font-caption text-caption text-stone/70 mt-1">
                    Try different keywords
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Recent searches (shown when no query) */}
          {!query && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-label-md text-caption text-stone uppercase tracking-wider">
                  RECENT SEARCHES
                </h2>
                {recentSearches.length > 0 && (
                  <button
                    onClick={handleClearRecent}
                    className="font-label-md text-caption text-stone hover:text-madder-red transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
              {recentSearches.length === 0 ? (
                <p className="font-body-md text-body-md text-stone">No recent searches</p>
              ) : (
                <ul className="space-y-3">
                  {recentSearches.map((s) => (
                    <li
                      key={s}
                      onClick={() => setQuery(s)}
                      className="flex items-center space-x-3 text-granite hover:bg-sandstone p-2 rounded-lg cursor-pointer transition-colors"
                    >
                      <span className="material-symbols-outlined text-stone">schedule</span>
                      <span className="font-body-md text-body-md">{s}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </main>

      </div>
    </PageWrapper>
  )
}
