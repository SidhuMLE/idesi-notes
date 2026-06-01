import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Areas from './pages/Areas'
import SectionDetail from './pages/SectionDetail'
import TaskDetail from './pages/TaskDetail'
import NoteEditor from './pages/NoteEditor'
import Search from './pages/Search'
import Settings from './pages/Settings'
import NewEditArea from './pages/NewEditArea'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
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
    </BrowserRouter>
  )
}
