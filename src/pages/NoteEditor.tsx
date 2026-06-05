import { useState, useEffect } from 'react'
import { flushSync } from 'react-dom'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import PageWrapper from '../components/PageWrapper'
import BottomSheet from '../components/BottomSheet'

export default function NoteEditor() {
  const { noteId } = useParams<{ noteId: string }>()
  const navigate = useNavigate()
  const { notes, updateNote, deleteNote } = useAppStore()

  const note = notes.find(n => n.id === noteId)

  const [body, setBody] = useState(note?.body ?? '')
  const [saved, setSaved] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Auto-save
  useEffect(() => {
    if (!note) return
    setSaved(false)
    const t = setTimeout(() => {
      updateNote(noteId!, { body })
      setSaved(true)
    }, 800)
    return () => clearTimeout(t)
  }, [body])

  // Navigate away before deleting so the component never renders with a null note.
  // flushSync forces the navigation to flush synchronously before deleteNote runs,
  // preventing the batched render that caused the blank screen.
  function handleConfirmDelete() {
    const sectionId = note?.section_id
    const id = noteId!
    setShowDeleteConfirm(false)
    sessionStorage.setItem('nav-direction', 'back')
    flushSync(() => {
      navigate('/areas/' + sectionId, { replace: true, state: { tab: 'notes' } })
    })
    deleteNote(id)
  }

  if (!note) return null

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
            onClick={() => {
              sessionStorage.setItem('nav-direction', 'back')
              navigate('/areas/' + note.section_id, { replace: true, state: { tab: 'notes' } })
            }}
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
            onClick={() => setShowDeleteConfirm(true)}
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

      <BottomSheet open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Delete note?">
        <p className="font-body-md text-body-md text-stone">This note will be permanently deleted.</p>
        <div className="flex gap-3">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="flex-1 py-3 border border-stone/30 rounded-xl font-label-md text-label-md text-granite"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmDelete}
            className="flex-1 py-3 bg-kumkum text-white rounded-xl font-label-md text-label-md"
          >
            Delete
          </button>
        </div>
      </BottomSheet>
    </PageWrapper>
  )
}
