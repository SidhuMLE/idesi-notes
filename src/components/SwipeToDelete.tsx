import { useRef, useState } from 'react'

interface Props {
  onDelete: () => void
  children: React.ReactNode
}

const BTN_WIDTH = 80

/**
 * Swipe-right-to-reveal-delete pattern.
 *
 * Architecture: the delete button sits to the LEFT of the card in a flex row
 * that is (container + BTN_WIDTH) wide. At rest, translateX(-BTN_WIDTH) hides
 * the button off-screen via overflow:hidden. Swiping right reveals it.
 * This avoids the z-index/transparency issues of placing the button behind the card.
 */
export default function SwipeToDelete({ onDelete, children }: Props) {
  const [offset, setOffset] = useState(0) // 0 = hidden, BTN_WIDTH = fully revealed
  const [snapping, setSnapping] = useState(false)
  const startX = useRef(0)
  const startOffset = useRef(0)

  const revealed = offset >= BTN_WIDTH

  function snap(to: number) {
    setSnapping(true)
    setOffset(to)
  }

  function close() { snap(0) }

  function handleTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX
    startOffset.current = offset
    setSnapping(false)
  }

  function handleTouchMove(e: React.TouchEvent) {
    const dx = e.touches[0].clientX - startX.current
    setOffset(Math.max(0, Math.min(BTN_WIDTH, startOffset.current + dx)))
  }

  function handleTouchEnd() {
    snap(offset >= BTN_WIDTH / 2 ? BTN_WIDTH : 0)
  }

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Flex row: [delete btn | card], full row shifts left to hide btn at rest */}
      <div
        style={{
          display: 'flex',
          width: `calc(100% + ${BTN_WIDTH}px)`,
          transform: `translateX(${offset - BTN_WIDTH}px)`,
          transition: snapping ? 'transform 0.2s ease' : 'none',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Delete button */}
        <div
          style={{ width: BTN_WIDTH, flexShrink: 0 }}
          className="bg-kumkum flex flex-col items-center justify-center gap-1 cursor-pointer select-none"
          onClick={() => { close(); onDelete() }}
        >
          <span className="material-symbols-outlined text-white text-[22px]">delete</span>
          <span className="text-white text-[11px] font-medium">Delete</span>
        </div>

        {/* Card slot */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {children}
        </div>
      </div>

      {/* Transparent overlay over the card (not the delete btn) to close swipe on tap */}
      {revealed && (
        <div
          className="absolute inset-y-0"
          style={{ left: BTN_WIDTH, right: 0, zIndex: 5 }}
          onClick={close}
        />
      )}
    </div>
  )
}
