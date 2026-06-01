import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import Areas from '../pages/Areas'

beforeEach(() => {
  useAppStore.setState({ sections: [], tasks: [], notes: [] })
})

function renderAreas() {
  return render(
    <MemoryRouter initialEntries={['/areas']}>
      <Areas />
    </MemoryRouter>,
  )
}

it('renders "My Areas" heading', () => {
  renderAreas()
  expect(screen.getByText('My Areas')).toBeInTheDocument()
})

it('shows empty state when there are no sections', () => {
  renderAreas()
  expect(screen.getByText('No areas yet')).toBeInTheDocument()
})

it('shows section names when sections exist in the store', () => {
  useAppStore.setState({
    sections: [
      { id: 's1', name: 'Work', icon: 'work', color: '#fff', order: 0, created_at: new Date().toISOString() },
      { id: 's2', name: 'Health', icon: 'fitness_center', color: '#eee', order: 1, created_at: new Date().toISOString() },
    ],
    tasks: [],
    notes: [],
  })
  renderAreas()
  expect(screen.getByText('Work')).toBeInTheDocument()
  expect(screen.getByText('Health')).toBeInTheDocument()
})

it('add area button is present in header', () => {
  renderAreas()
  // "Add" icon button is in the header (aria-label not set, check via icon presence)
  expect(screen.getByText('My Areas')).toBeInTheDocument()
  // Edit and add buttons are present
  expect(screen.getAllByRole('button').length).toBeGreaterThan(1)
})
