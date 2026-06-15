import { vi } from 'vitest'

// flushSync inside act() (used by fireEvent) triggers a React warning.
// In tests, replace it with a plain call — the navigation still happens synchronously.
vi.mock('react-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-dom')>()
  return { ...actual, flushSync: (fn: () => void) => fn() }
})

import { render, screen, fireEvent } from '@testing-library/react'
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

/** Single-entry router — for tests that don't need navigate(-1) to resolve a real route. */
function renderTask(taskId = 't1') {
  return render(
    <MemoryRouter initialEntries={[`/tasks/${taskId}`]}>
      <Routes>
        <Route path="/tasks/:taskId" element={<TaskDetail />} />
      </Routes>
    </MemoryRouter>,
  )
}

/** Two-entry router so navigate(-1) lands on a visible "Previous Page". */
function renderTaskWithHistory(taskId = 't1') {
  return render(
    <MemoryRouter initialEntries={['/home', `/tasks/${taskId}`]} initialIndex={1}>
      <Routes>
        <Route path="/home" element={<div>Previous Page</div>} />
        <Route path="/tasks/:taskId" element={<TaskDetail />} />
      </Routes>
    </MemoryRouter>,
  )
}

// ── Basic render ──────────────────────────────────────────────────────────────

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

// ── Button outcomes — nothing should break or leave a blank screen ─────────

it('back button navigates to the previous screen', () => {
  seedTask()
  renderTaskWithHistory()
  fireEvent.click(screen.getByRole('button', { name: 'arrow_back' }))
  expect(screen.getByText('Previous Page')).toBeInTheDocument()
})

it('more_vert button opens the delete confirmation sheet', () => {
  seedTask()
  renderTask()
  fireEvent.click(screen.getByRole('button', { name: 'more_vert' }))
  expect(screen.getByText('Delete Task?')).toBeInTheDocument()
  expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument()
})

it('Cancel in delete sheet keeps the task visible and the store intact', () => {
  seedTask()
  renderTask()
  fireEvent.click(screen.getByRole('button', { name: 'more_vert' }))
  fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
  // Still on the task page
  expect(screen.getByDisplayValue('Write the spec')).toBeInTheDocument()
  // Task not deleted from store
  expect(useAppStore.getState().tasks).toHaveLength(1)
})

it('Delete navigates back and removes the task — no blank screen', () => {
  seedTask()
  renderTaskWithHistory()
  fireEvent.click(screen.getByRole('button', { name: 'more_vert' }))
  fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
  // Must land on the previous page, not a blank screen
  expect(screen.getByText('Previous Page')).toBeInTheDocument()
  // Task must be removed from the store
  expect(useAppStore.getState().tasks).toHaveLength(0)
})

it('status buttons update local state without crashing', () => {
  seedTask()
  renderTask()
  fireEvent.click(screen.getByRole('button', { name: 'In Progress' }))
  // Page is still rendered (no blank screen / crash)
  expect(screen.getByDisplayValue('Write the spec')).toBeInTheDocument()
})

it('priority buttons update local state without crashing', () => {
  seedTask()
  renderTask()
  fireEvent.click(screen.getByRole('button', { name: 'high' }))
  expect(screen.getByDisplayValue('Write the spec')).toBeInTheDocument()
})
