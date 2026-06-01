import { useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import PageWrapper from '../components/PageWrapper'

const ICONS = [
  'home',
  'diversity_1',
  'favorite',
  'payments',
  'shield',
  'work',
  'school',
  'flight_takeoff',
  'fitness_center',
  'shopping_bag',
  'directions_car',
  'gavel',
  'construction',
  'lightbulb',
  'business',
  'calendar_month',
  'military_tech',
  'local_hospital',
  'savings',
  'code',
]

const COLORS = [
  '#8B2C24',
  '#155F5B',
  '#3E5C2E',
  '#97701C',
  '#6c1510',
  '#B23A2C',
  '#C8962C',
  '#221E1A',
  '#6E655A',
  '#003e3b',
]

export default function NewEditArea() {
  const { sectionId } = useParams<{ sectionId: string }>()
  const location = useLocation()
  const isEdit = location.pathname.includes('/edit')

  const { sections, addSection, updateSection } = useAppStore()
  const existingSection = sections.find((s) => s.id === sectionId)

  const [name, setName] = useState(existingSection?.name || '')
  const [icon, setIcon] = useState(existingSection?.icon || 'home')
  const [color, setColor] = useState(existingSection?.color || COLORS[0])
  const navigate = useNavigate()

  const handleSave = () => {
    if (!name.trim()) return
    if (isEdit && existingSection) {
      updateSection(existingSection.id, { name: name.trim(), icon, color })
    } else {
      addSection({ name: name.trim(), icon, color })
    }
    navigate('/areas')
  }

  return (
    <PageWrapper>
      <div className="bg-temple-ivory min-h-screen flex flex-col">
        <header className="w-full top-0 sticky bg-temple-ivory z-40 border-b border-pandya-gold/10">
          <div className="flex justify-between items-center px-6 py-4">
            <motion.button
              onClick={() => navigate(-1)}
              whileTap={{ scale: 0.90 }}
              className="text-granite hover:text-primary p-2 -ml-2 rounded-full"
            >
              <span className="material-symbols-outlined">close</span>
            </motion.button>
            <h1 className="font-headline-sm text-headline-sm text-granite">
              {isEdit ? 'Edit Area' : 'New Area'}
            </h1>
            <motion.button
              onClick={handleSave}
              disabled={!name.trim()}
              whileTap={{ scale: 0.97 }}
              className={`font-label-md text-label-md py-2 px-4 rounded-lg transition-colors ${
                name.trim()
                  ? 'text-madder-red hover:bg-madder-red/5'
                  : 'text-stone opacity-50 cursor-not-allowed'
              }`}
            >
              Save
            </motion.button>
          </div>
        </header>

        <main className="flex-grow px-6 py-6 space-y-8 pb-16">
          {/* Name input */}
          <section className="space-y-2">
            <label className="font-label-md text-label-md text-granite block">Area name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              placeholder="e.g. Family, Health, Work"
              className="w-full bg-temple-ivory border border-stone/30 text-granite font-body-md text-body-md rounded-lg px-4 py-3 focus:outline-none focus:border-pandya-gold focus:ring-1 focus:ring-pandya-gold transition-colors placeholder:text-stone/50 shadow-[0_2px_10px_rgba(34,30,26,0.02)]"
            />
          </section>

          {/* Icon picker */}
          <section className="space-y-4">
            <h2 className="font-label-md text-label-md text-granite flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-pandya-gold" />
              Icon
            </h2>
            <div className="grid grid-cols-4 gap-4 bg-surface-container-low p-4 rounded-xl border border-stone/10 shadow-[0_4px_20px_rgba(34,30,26,0.03)]">
              {ICONS.map((ic) => (
                <motion.button
                  key={ic}
                  onClick={() => setIcon(ic)}
                  aria-label={`Select ${ic} icon`}
                  whileTap={{ scale: 0.88 }}
                  className={`aspect-square flex flex-col items-center justify-center rounded-lg transition-all ${
                    icon === ic
                      ? 'border border-pandya-gold bg-sandstone text-madder-red'
                      : 'border border-transparent text-granite hover:bg-sandstone/50 hover:text-madder-red'
                  }`}
                >
                  <span className="material-symbols-outlined text-[28px]">{ic}</span>
                </motion.button>
              ))}
            </div>
          </section>

          {/* Color picker */}
          <section className="space-y-4">
            <h2 className="font-label-md text-label-md text-granite flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-pandya-gold" />
              Colour
            </h2>
            <div className="flex gap-3 flex-wrap">
              {COLORS.map((c) => (
                <motion.button
                  key={c}
                  onClick={() => setColor(c)}
                  style={{ backgroundColor: c }}
                  whileTap={{ scale: 0.88 }}
                  className={`w-10 h-10 rounded-full transition-all flex items-center justify-center ${
                    color === c ? 'ring-2 ring-offset-2 ring-pandya-gold scale-110' : ''
                  }`}
                >
                  {color === c && (
                    <span className="material-symbols-outlined text-white text-[16px]">check</span>
                  )}
                </motion.button>
              ))}
            </div>
          </section>
        </main>
      </div>
    </PageWrapper>
  )
}
