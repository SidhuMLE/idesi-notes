import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  backdropClassName?: string
  sheetClassName?: string
}

export default function BottomSheet({ open, onClose, children, title, backdropClassName, sheetClassName }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className={`fixed inset-0 z-[60] bg-granite/25 ${backdropClassName ?? ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            className={`fixed bottom-0 left-0 right-0 z-[60] bg-surface rounded-t-2xl shadow-[0_-8px_40px_rgba(34,30,26,0.14)] p-6 space-y-4 ${sheetClassName ?? ''}`}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          >
            <div className="w-8 h-1 bg-outline-variant rounded-full mx-auto -mt-2 mb-2" />
            {title && (
              <h3 className="font-headline-sm text-headline-sm text-granite">{title}</h3>
            )}
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
