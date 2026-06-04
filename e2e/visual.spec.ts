import { test, expect, Page } from '@playwright/test'

// Seed minimal state so screens have content to render
async function seedState(page: Page) {
  await page.goto('/')
  await page.evaluate(() => {
    const now = new Date().toISOString()
    const tomorrow = new Date(Date.now() + 86400000).toISOString()
    localStorage.setItem('idesi-notes-v1', JSON.stringify({
      state: {
        sections: [
          { id: 's1', name: 'Military', icon: 'shield', color: '#8B2C24', order: 0, created_at: now },
          { id: 's2', name: 'Sigan', icon: 'business', color: '#155F5B', order: 1, created_at: now },
        ],
        tasks: [
          { id: 't1', section_id: 's1', title: 'Buy new boots', status: 'open', priority: 'high', due_date: new Date().toISOString(), created_at: now },
          { id: 't2', section_id: 's2', title: 'Review contracts', status: 'open', priority: 'medium', due_date: tomorrow, created_at: now },
          { id: 't3', section_id: 's1', title: 'Completed task', status: 'done', priority: 'low', created_at: now },
        ],
        notes: [
          { id: 'n1', section_id: 's1', body: 'Briefing notes for next exercise\nDetails here', created_at: now, updated_at: now },
        ],
      },
      version: 0,
    }))
  })
  await page.reload()
  // Wait for content to settle
  await page.waitForTimeout(400)
}

test.describe('Visual regression — current design baseline', () => {
  test.beforeEach(async ({ page }) => seedState(page))

  test('Home screen', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(300)
    await expect(page).toHaveScreenshot('home.png', { fullPage: true })
  })

  test('Areas list', async ({ page }) => {
    await page.goto('/areas')
    await page.waitForTimeout(300)
    await expect(page).toHaveScreenshot('areas.png', { fullPage: true })
  })

  test('Section detail — Tasks tab', async ({ page }) => {
    await page.goto('/areas/s1')
    await page.waitForTimeout(300)
    await expect(page).toHaveScreenshot('section-tasks.png', { fullPage: true })
  })

  test('Section detail — Notes tab', async ({ page }) => {
    await page.goto('/areas/s1')
    await page.getByRole('button', { name: 'Notes' }).click()
    await page.waitForTimeout(300)
    await expect(page).toHaveScreenshot('section-notes.png', { fullPage: true })
  })

  test('Task detail', async ({ page }) => {
    await page.goto('/tasks/t1')
    await page.waitForTimeout(300)
    await expect(page).toHaveScreenshot('task-detail.png', { fullPage: true })
  })

  test('Note editor', async ({ page }) => {
    await page.goto('/notes/n1')
    await page.waitForTimeout(300)
    await expect(page).toHaveScreenshot('note-editor.png', { fullPage: true })
  })

  test('Search — empty state', async ({ page }) => {
    await page.goto('/search')
    await page.waitForTimeout(300)
    await expect(page).toHaveScreenshot('search-empty.png', { fullPage: true })
  })

  test('Search — with results', async ({ page }) => {
    await page.goto('/search')
    await page.getByPlaceholder(/search/i).fill('boots')
    await page.waitForTimeout(300)
    await expect(page).toHaveScreenshot('search-results.png', { fullPage: true })
  })

  test('Settings', async ({ page }) => {
    await page.goto('/settings')
    await page.waitForTimeout(300)
    await expect(page).toHaveScreenshot('settings.png', { fullPage: true })
  })

  test('New area form', async ({ page }) => {
    await page.goto('/areas/new')
    await page.waitForTimeout(300)
    await expect(page).toHaveScreenshot('new-area.png', { fullPage: true })
  })
})
