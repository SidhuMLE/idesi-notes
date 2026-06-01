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

it('shows empty state message when no recent searches stored', () => {
  localStorage.removeItem('idesi-recent-searches')
  renderSearch()
  expect(screen.getByText('No recent searches')).toBeInTheDocument()
})
