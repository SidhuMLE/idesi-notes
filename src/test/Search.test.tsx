import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import Search from '../pages/Search'

beforeEach(() => {
  useAppStore.setState({ sections: [], tasks: [], notes: [] })
})

function renderSearch() {
  return render(
    <MemoryRouter initialEntries={['/search']}>
      <Search />
    </MemoryRouter>,
  )
}

it('renders the search input', () => {
  renderSearch()
  expect(screen.getByPlaceholderText('Search notes, tasks, areas...')).toBeInTheDocument()
})

it('filter chips render: All, Tasks, Notes', () => {
  renderSearch()
  expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Tasks' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Notes' })).toBeInTheDocument()
})

it('shows recent searches section when query is empty', () => {
  renderSearch()
  expect(screen.getByText('RECENT SEARCHES')).toBeInTheDocument()
})

it('shows the hard-coded recent search items', () => {
  renderSearch()
  expect(screen.getByText('Q3 Planning')).toBeInTheDocument()
  expect(screen.getByText('Client Briefing')).toBeInTheDocument()
  expect(screen.getByText('Military')).toBeInTheDocument()
})
