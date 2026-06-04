import { motion } from 'framer-motion'

// Native Android feel: new page slides in, exiting page disappears instantly.
// No exit animation = no "blank nav" gap between transitions.
const variants = {
  forward: {
    initial: { opacity: 0, x: 24 },
    animate: { opacity: 1, x: 0 },
  },
  back: {
    initial: { opacity: 0, x: -24 },
    animate: { opacity: 1, x: 0 },
  },
}

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const direction = (sessionStorage.getItem('nav-direction') ?? 'forward') as 'forward' | 'back'
  const v = variants[direction]

  return (
    <motion.div
      initial={v.initial}
      animate={v.animate}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      style={{ minHeight: '100dvh' }}
    >
      {children}
    </motion.div>
  )
}
