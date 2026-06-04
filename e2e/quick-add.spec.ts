import { test, expect, Page } from '@playwright/test'

async function seedAreaAndLoad(page: Page) {
  await page.goto('/')
  await page.evaluate(() => {
    localStorage.setItem('idesi-notes-v1', JSON.stringify({
      state: {
        sections: [
          { id: 'sec-mil', name: 'Military', icon: 'shield', color: '#8B2C24', order: 0, created_at: new Date().toISOString() },
          { id: 'sec-sigan', name: 'Sigan', icon: 'business', color: '#155F5B', order: 1, created_at: new Date().toISOString() },
        ],
        tasks: [],
        notes: [],
      },
      version: 0,
    }))
  })
  await page.reload()
  await page.waitForTimeout(300)
}

test.describe('Quick Add Task flow', () => {
  test.beforeEach(seedAreaAndLoad)

  test('FAB opens quick-add sheet', async ({ page }) => {
    await page.goto('/')
    const fab = page.locator('button[aria-label="Quick add task"], button[aria-label*="add"]').first()
    await expect(fab).toBeVisible()
    await fab.click()
    await expect(page.getByText('Quick Add Task')).toBeVisible()
  })

  test('bottom nav hides when sheet is open', async ({ page }) => {
    await page.goto('/')
    await page.locator('button[aria-label="Quick add task"], button[aria-label*="add"]').first().click()
    await expect(page.getByText('Quick Add Task')).toBeVisible()
    // Bottom nav should be hidden
    const nav = page.locator('nav').filter({ hasText: 'Home' })
    await expect(nav).not.toBeVisible()
  })

  test('area picker opens above the quick-add sheet', async ({ page }) => {
    await page.goto('/')
    await page.locator('button[aria-label="Quick add task"], button[aria-label*="add"]').first().click()
    await expect(page.getByText('Quick Add Task')).toBeVisible()

    // Tap the area selector button
    await page.getByText(/select area/i).click()

    // Area picker sheet should appear on top — check Select Area title and area names
    await expect(page.getByText('Select Area')).toBeVisible()
    await expect(page.getByText('Military')).toBeVisible()
    await expect(page.getByText('Sigan')).toBeVisible()
  })

  test('full quick-add flow: select area, enter title, submit', async ({ page }) => {
    await page.goto('/')
    await page.locator('button[aria-label="Quick add task"], button[aria-label*="add"]').first().click()
    await expect(page.getByText('Quick Add Task')).toBeVisible()

    // Open area picker and select Military
    await page.getByText(/select area/i).click()
    await expect(page.getByText('Select Area')).toBeVisible()
    await page.getByText('Military').click()

    // Picker closes, area should now show as selected
    await expect(page.getByText('Select Area')).not.toBeVisible()
    await expect(page.getByText('Military')).toBeVisible() // shown in selector button

    // Enter task title
    await page.getByPlaceholder(/task title/i).fill('Buy new boots')

    // Submit
    const addBtn = page.getByRole('button', { name: /add task/i })
    await expect(addBtn).toBeEnabled()
    await addBtn.click()

    // Should navigate to the Military section page
    await expect(page).toHaveURL(/\/areas\/sec-mil/)

    // Task should appear in the list
    await expect(page.getByText('Buy new boots')).toBeVisible()
  })

  test('bottom nav reappears after closing sheet', async ({ page }) => {
    await page.goto('/')
    await page.locator('button[aria-label="Quick add task"], button[aria-label*="add"]').first().click()
    await expect(page.getByText('Quick Add Task')).toBeVisible()

    // Close by pressing backdrop or close gesture — press Escape
    await page.keyboard.press('Escape')
    await page.waitForTimeout(400)

    // Nav should be back
    const nav = page.locator('nav').filter({ hasText: 'Home' })
    await expect(nav).toBeVisible()
  })
})
