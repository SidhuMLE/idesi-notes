import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useBackButton } from './hooks/useBackButton'
import Home from './pages/Home'
import Areas from './pages/Areas'
import SectionDetail from './pages/SectionDetail'
import TaskDetail from './pages/TaskDetail'
import NoteEditor from './pages/NoteEditor'
import Search from './pages/Search'
import Settings from './pages/Settings'
import NewEditArea from './pages/NewEditArea'

function AnimatedRoutes() {
  const location = useLocation()
  useBackButton()

  return (
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
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  )
}
