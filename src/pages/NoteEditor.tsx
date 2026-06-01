import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import PageWrapper from '../components/PageWrapper'

export default function NoteEditor() {
  const { noteId } = useParams<{ noteId: string }>()
  const navigate = useNavigate()
  const { notes, updateNote, deleteNote } = useAppStore()

  const note = notes.find(n => n.id === noteId)
  if (!note) return <div>Note not found</div>

  const [body, setBody] = useState(note.body)
  const [saved, setSaved] = useState(true)

  // Auto-save
  useEffect(() => {
    setSaved(false)
    const t = setTimeout(() => {
      updateNote(noteId!, { body })
      setSaved(true)
    }, 800)
    return () => clearTimeout(t)
  }, [body])

  const dateTitle = new Date(note.created_at).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <PageWrapper>
      <div className="bg-temple-ivory h-screen flex flex-col text-on-surface overflow-hidden">
        <header className="bg-surface border-b border-outline-variant/20 w-full top-0 sticky flex justify-between items-center px-4 py-2 z-10">
          <motion.button
            onClick={() => navigate(-1)}
            whileTap={{ scale: 0.90 }}
            className="text-madder-red p-2 -ml-2 rounded-full hover:bg-surface-variant"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </motion.button>
          <div className="flex flex-col items-center">
            <h1 className="font-headline-sm text-headline-sm text-primary font-display text-center">
              {dateTitle}
            </h1>
            <span
              className={`font-caption text-caption text-stone transition-opacity duration-300 ${saved ? 'opacity-100' : 'opacity-0'}`}
            >
              Saved
            </span>
          </div>
          <motion.button
            onClick={() => {
              deleteNote(noteId!)
              navigate(-1)
            }}
            whileTap={{ scale: 0.90 }}
            className="text-madder-red p-2 -mr-2 rounded-full hover:bg-surface-variant"
          >
            <span className="material-symbols-outlined">delete</span>
          </motion.button>
        </header>

        <main className="flex-grow flex flex-col relative w-full h-full">
          <textarea
            autoFocus
            value={body}
            onChange={e => setBody(e.target.value)}
            className="w-full h-full flex-grow bg-transparent border-none resize-none px-4 py-6 font-body-md text-body-md text-granite placeholder:text-stone/60 focus:ring-0 leading-relaxed"
            placeholder="Write something…"
          />
          <div className="h-[1px] w-full bg-pandya-gold/10 absolute bottom-0 left-0" />
        </main>
      </div>
    </PageWrapper>
  )
}
