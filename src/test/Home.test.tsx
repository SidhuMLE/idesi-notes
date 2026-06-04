import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import Home from '../pages/Home'

beforeEach(() => {
  useAppStore.setState({ displayName: '', sections: [], tasks: [], notes: [] })
})

function renderHome() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Home />
    </MemoryRouter>,
  )
}

it('renders a time-appropriate greeting with fallback name "Explorer"', () => {
  renderHome()
  expect(screen.getByText(/Explorer/)).toBeInTheDocument()
})

it('renders "Due Today" section heading', () => {
  renderHome()
  expect(screen.getByText('Due Today')).toBeInTheDocument()
})

it('renders "My Areas" section heading', () => {
  renderHome()
  expect(screen.getByText('My Areas')).toBeInTheDocument()
})

it('shows the "New Area" card link', () => {
  renderHome()
  expect(screen.getByText('New Area')).toBeInTheDocument()
})

it('shows "All clear for today" when there are no due-today tasks', () => {
  renderHome()
  expect(screen.getByText('All clear for today')).toBeInTheDocument()
})
