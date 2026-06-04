import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useBackButton } from './hooks/useBackButton'
import { NavProvider, useNav } from './context/NavContext'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Areas from './pages/Areas'
import SectionDetail from './pages/SectionDetail'
import TaskDetail from './pages/TaskDetail'
import NoteEditor from './pages/NoteEditor'
import Search from './pages/Search'
import Settings from './pages/Settings'
import NewEditArea from './pages/NewEditArea'

// Routes that show the bottom nav
const NAV_ROUTES = ['/', '/areas', '/search', '/settings']
function showsNav(pathname: string) {
  return (
    NAV_ROUTES.includes(pathname) ||
    // Section detail pages (/areas/:id) but NOT edit (/areas/:id/edit) or new (/areas/new)
    (/^\/areas\/[^/]+$/.test(pathname))
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  const { navHidden } = useNav()
  useBackButton()

  return (
    <>
      <AnimatePresence mode="sync" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/areas" element={<Areas />} />
          <Route path="/areas/new" element={<NewEditArea />} />
          <Route path="/areas/:sectionId" element={<SectionDetail />} />
          <Route path="/areas/:sectionId/edit" element={<NewEditArea />} />
          <Route path="/tasks/:taskId" element={<TaskDetail />} />
          <Route path="/notes/:noteId" element={<NoteEditor />} />
          <Route path="/search" element={<Search />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </AnimatePresence>

      {/* BottomNav with slide animation when hidden/shown by sheets */}
      <AnimatePresence initial={false}>
        {showsNav(location.pathname) && !navHidden && (
          <motion.div
            key="bottom-nav"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 42 }}
          >
            <BottomNav />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <NavProvider>
        <AnimatedRoutes />
      </NavProvider>
    </BrowserRouter>
  )
}
