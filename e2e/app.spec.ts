import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('home page loads', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Idesi Notes')).toBeVisible()
    await expect(page.getByText('My Areas')).toBeVisible()
  })

  test('bottom nav navigates to Areas', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /areas/i }).click()
    await expect(page.getByRole('heading', { name: 'My Areas' })).toBeVisible()
  })

  test('bottom nav navigates to Search', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /search/i }).click()
    await expect(page.getByPlaceholder(/search notes/i)).toBeVisible()
  })

  test('bottom nav navigates to Settings', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /settings/i }).click()
    await expect(page.getByText('Colour mode')).toBeVisible()
  })
})

test.describe('Areas flow', () => {
  test('can create a new area', async ({ page }) => {
    await page.goto('/areas')
    await page.getByRole('button', { name: /new area/i }).click()
    await expect(page.getByPlaceholder(/family, health/i)).toBeVisible()
    await page.getByPlaceholder(/family, health/i).fill('Military')
    await page.getByRole('button', { name: /save/i }).click()
    await expect(page.getByText('Military')).toBeVisible()
  })
})

test.describe('Task flow', () => {
  test('quick add task from home', async ({ page }) => {
    // Create an area first via store
    await page.goto('/')
    // FAB is visible
    await expect(page.locator('button[aria-label="Add new task"]')).toBeVisible()
  })
})

test.describe('Search', () => {
  test('shows recent searches when empty', async ({ page }) => {
    await page.goto('/search')
    await expect(page.getByText('RECENT SEARCHES')).toBeVisible()
  })

  test('filter chips are present', async ({ page }) => {
    await page.goto('/search')
    await expect(page.getByRole('button', { name: 'All' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Tasks' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Notes' })).toBeVisible()
  })
})
