import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import Settings from '../pages/Settings'

beforeEach(() => {
  useAppStore.setState({ displayName: '', sections: [], tasks: [], notes: [] })
})

function renderSettings() {
  return render(
    <MemoryRouter initialEntries={['/settings']}>
      <Settings />
    </MemoryRouter>,
  )
}

it('renders "Settings" heading', () => {
  renderSettings()
  expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
})

it('"Edit Areas" button is present', () => {
  renderSettings()
  expect(screen.getByRole('button', { name: /edit areas/i })).toBeInTheDocument()
})

it('notification toggle for "Due date reminders" is present', () => {
  renderSettings()
  expect(screen.getByText('Due date reminders')).toBeInTheDocument()
})

it('notification toggle for "Daily summary" is present', () => {
  renderSettings()
  expect(screen.getByText('Daily summary')).toBeInTheDocument()
})
