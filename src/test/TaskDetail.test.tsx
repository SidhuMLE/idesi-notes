import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import TaskDetail from '../pages/TaskDetail'

beforeEach(() => {
  useAppStore.setState({ sections: [], tasks: [], notes: [] })
})

function seedTask() {
  useAppStore.setState({
    sections: [
      { id: 's1', name: 'Work', icon: 'work', color: '#fff', order: 0, created_at: new Date().toISOString() },
    ],
    tasks: [
      {
        id: 't1',
        section_id: 's1',
        title: 'Write the spec',
        status: 'open',
        priority: 'medium',
        created_at: new Date().toISOString(),
      },
    ],
    notes: [],
  })
}

function renderTask(taskId = 't1') {
  return render(
    <MemoryRouter initialEntries={[`/tasks/${taskId}`]}>
      <Routes>
        <Route path="/tasks/:taskId" element={<TaskDetail />} />
      </Routes>
    </MemoryRouter>,
  )
}

it('renders the task title in the textarea', () => {
  seedTask()
  renderTask()
  expect(screen.getByDisplayValue('Write the spec')).toBeInTheDocument()
})

it('status segmented control has 3 options', () => {
  seedTask()
  renderTask()
  expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'In Progress' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Done' })).toBeInTheDocument()
})

it('priority buttons render with lowercase labels', () => {
  seedTask()
  renderTask()
  expect(screen.getByRole('button', { name: 'low' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'medium' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'high' })).toBeInTheDocument()
})

it('renders nothing (null) when task id is unknown', () => {
  const { container } = renderTask('nonexistent')
  expect(container).toBeEmptyDOMElement()
})
