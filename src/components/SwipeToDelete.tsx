import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface Props {
  onDelete: () => void
  children: React.ReactNode
}

const REVEAL_THRESHOLD = 72
const DELETE_BUTTON_WIDTH = 80

export default function SwipeToDelete({ onDelete, children }: Props) {
  const [offset, setOffset] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const startX = useRef(0)
  const dragging = useRef(false)

  function handleTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX
    dragging.current = true
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (!dragging.current) return
    const diff = e.touches[0].clientX - startX.current
    if (diff < 0 && !revealed) return // don't allow left swipe when not revealed
    const clamped = Math.max(0, Math.min(DELETE_BUTTON_WIDTH, diff + (revealed ? DELETE_BUTTON_WIDTH : 0)))
    setOffset(clamped)
  }

  function handleTouchEnd() {
    dragging.current = false
    if (offset >= REVEAL_THRESHOLD) {
      setOffset(DELETE_BUTTON_WIDTH)
      setRevealed(true)
    } else {
      setOffset(0)
      setRevealed(false)
    }
  }

  function handleClose() {
    setOffset(0)
    setRevealed(false)
  }

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Delete action — sits behind the card */}
      <div
        className="absolute inset-y-0 left-0 flex items-center justify-center bg-kumkum rounded-xl"
        style={{ width: DELETE_BUTTON_WIDTH }}
      >
        <button
          onClick={() => { handleClose(); onDelete() }}
          className="flex flex-col items-center justify-center gap-1 w-full h-full"
        >
          <span className="material-symbols-outlined text-white text-[22px]">delete</span>
          <span className="text-white font-caption text-[11px]">Delete</span>
        </button>
      </div>

      {/* Card — slides right to reveal delete */}
      <motion.div
        style={{ x: offset }}
        transition={dragging.current ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 40 }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </motion.div>

      {/* Tap outside to close */}
      {revealed && (
        <div className="fixed inset-0 z-10" onClick={handleClose} />
      )}
    </div>
  )
}
