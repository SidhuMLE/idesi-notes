import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import SectionDetail from '../pages/SectionDetail'

beforeEach(() => {
  useAppStore.setState({ sections: [], tasks: [], notes: [] })
})

function renderSection(sectionId = 's1') {
  return render(
    <MemoryRouter initialEntries={[`/areas/${sectionId}`]}>
      <Routes>
        <Route path="/areas/:sectionId" element={<SectionDetail />} />
      </Routes>
    </MemoryRouter>,
  )
}

function seedSection() {
  useAppStore.setState({
    sections: [
      { id: 's1', name: 'Work', icon: 'work', color: '#fff', order: 0, created_at: new Date().toISOString() },
    ],
    tasks: [
      { id: 't1', section_id: 's1', title: 'Write report', status: 'open', priority: 'high', created_at: new Date().toISOString() },
    ],
    notes: [
      { id: 'n1', section_id: 's1', body: 'My first note\nSecond line', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    ],
  })
}

it('renders Tasks and Notes tabs', () => {
  seedSection()
  renderSection()
  expect(screen.getByRole('button', { name: 'Tasks' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Notes' })).toBeInTheDocument()
})

it('tasks tab shows task titles', () => {
  seedSection()
  renderSection()
  expect(screen.getByText('Write report')).toBeInTheDocument()
})

it('notes tab shows note content after switching', () => {
  seedSection()
  renderSection()
  fireEvent.click(screen.getByRole('button', { name: 'Notes' }))
  expect(screen.getByText('My first note')).toBeInTheDocument()
})

it('filter chips render on tasks tab', () => {
  seedSection()
  renderSection()
  expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'In Progress' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Done' })).toBeInTheDocument()
})
