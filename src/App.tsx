import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
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
      <AnimatePresence mode="wait" initial={false}>
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

      {/* BottomNav lives outside AnimatePresence — no more re-mount on route changes */}
      {showsNav(location.pathname) && !navHidden && <BottomNav />}
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
