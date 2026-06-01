import { motion } from 'framer-motion'

const variants = {
  forward: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  back: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
}

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const direction = (sessionStorage.getItem('nav-direction') ?? 'forward') as 'forward' | 'back'
  const v = variants[direction]

  return (
    <motion.div
      initial={v.initial}
      animate={v.animate}
      exit={v.exit}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      style={{ minHeight: '100dvh' }}
    >
      {children}
    </motion.div>
  )
}
