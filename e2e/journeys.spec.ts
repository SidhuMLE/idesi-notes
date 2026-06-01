import { test, expect, Page } from '@playwright/test'

// Clear app state between journeys
async function clearAppState(page: Page) {
  await page.goto('/')
  await page.evaluate(() => localStorage.removeItem('idesi-notes-v1'))
  await page.reload()
}

test.describe('Journey 1: Create an area and a task', () => {
  test.beforeEach(async ({ page }) => clearAppState(page))

  test('user creates Military area then adds a task', async ({ page }) => {
    // Go to Areas
    await page.goto('/areas')
    await page.getByRole('button', { name: /new area/i }).click()

    // Fill in area name
    await expect(page.getByPlaceholder(/family, health/i)).toBeVisible()
    await page.getByPlaceholder(/family, health/i).fill('Military')

    // Pick shield icon (aria-label contains shield)
    await page.getByRole('button', { name: /shield/i }).click()

    // Save
    await page.getByRole('button', { name: /save/i }).click()

    // Verify area appears in list
    await expect(page.getByText('Military')).toBeVisible()

    // Navigate into the area
    await page.getByText('Military').click()

    // Tap FAB to add task
    await page.locator('button[aria-label="Add new task"], button.fab, button[aria-label*="add"]').first().click()

    // Fill task details in bottom sheet
    await page.getByPlaceholder(/task title/i).fill('Buy new boots')
    await page.getByRole('button', { name: /high/i }).click()
    await page.getByRole('button', { name: /add task|save/i }).click()

    // Verify task appears
    await expect(page.getByText('Buy new boots')).toBeVisible()
  })
})

test.describe('Journey 2: Complete a task', () => {
  test.beforeEach(async ({ page }) => clearAppState(page))

  test('user completes a task and it moves to Done group', async ({ page }) => {
    // Seed data via localStorage
    await page.goto('/')
    await page.evaluate(() => {
      const sectionId = 'test-section-1'
      const taskId = 'test-task-1'
      localStorage.setItem('idesi-notes-v1', JSON.stringify({
        state: {
          sections: [{ id: sectionId, name: 'Military', icon: 'shield', color: '#8B2C24', order: 0, created_at: new Date().toISOString() }],
          tasks: [{ id: taskId, section_id: sectionId, title: 'Buy new boots', status: 'open', priority: 'high', created_at: new Date().toISOString() }],
          notes: []
        },
        version: 0
      }))
    })
    await page.reload()

    // Navigate to section
    await page.goto('/areas/test-section-1')

    // Tap checkbox to complete
    await page.locator('button.rounded-full').first().click()

    // Expand Done group if collapsed
    const doneButton = page.getByText(/done/i).filter({ hasText: /done/i }).first()
    if (await doneButton.isVisible()) {
      await doneButton.click()
    }

    // Verify in done group (strikethrough)
    await expect(page.locator('.line-through')).toBeVisible()
  })
})

test.describe('Journey 3: Create a note', () => {
  test.beforeEach(async ({ page }) => clearAppState(page))

  test('user writes a note and it persists', async ({ page }) => {
    // Seed a section
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.setItem('idesi-notes-v1', JSON.stringify({
        state: {
          sections: [{ id: 'sec-1', name: 'Military', icon: 'shield', color: '#8B2C24', order: 0, created_at: new Date().toISOString() }],
          tasks: [],
          notes: []
        },
        version: 0
      }))
    })
    await page.reload()

    // Go to section
    await page.goto('/areas/sec-1')

    // Switch to Notes tab
    await page.getByRole('button', { name: 'Notes' }).click()

    // Tap FAB
    await page.locator('button').filter({ has: page.locator('.material-symbols-outlined') }).last().click()

    // Should be in note editor — type text
    await page.locator('textarea').fill('Briefing notes for next exercise')

    // Go back
    await page.getByRole('button', { name: /back|arrow/i }).first().click()

    // Note preview should appear
    await expect(page.getByText('Briefing notes for next exercise')).toBeVisible()
  })
})

test.describe('Journey 4: Search', () => {
  test.beforeEach(async ({ page }) => clearAppState(page))

  test('user searches and finds a task', async ({ page }) => {
    // Seed data
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.setItem('idesi-notes-v1', JSON.stringify({
        state: {
          sections: [{ id: 'sec-1', name: 'Military', icon: 'shield', color: '#8B2C24', order: 0, created_at: new Date().toISOString() }],
          tasks: [{ id: 'task-1', section_id: 'sec-1', title: 'Buy new boots', status: 'open', priority: 'high', created_at: new Date().toISOString() }],
          notes: []
        },
        version: 0
      }))
    })
    await page.reload()

    // Go to search
    await page.goto('/search')

    // Type query
    await page.getByPlaceholder(/search/i).fill('boots')

    // Result should appear
    await expect(page.getByText('Buy new boots')).toBeVisible()

    // Tap result
    await page.getByText('Buy new boots').click()

    // Should be on task detail
    await expect(page.locator('textarea, input[type="text"]').first()).toBeVisible()
  })
})

test.describe('Journey 5: Edit and delete a task', () => {
  test.beforeEach(async ({ page }) => clearAppState(page))

  test('user edits task title then deletes it', async ({ page }) => {
    // Seed data
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.setItem('idesi-notes-v1', JSON.stringify({
        state: {
          sections: [{ id: 'sec-1', name: 'Military', icon: 'shield', color: '#8B2C24', order: 0, created_at: new Date().toISOString() }],
          tasks: [{ id: 'task-1', section_id: 'sec-1', title: 'Buy new boots', status: 'open', priority: 'high', created_at: new Date().toISOString() }],
          notes: []
        },
        version: 0
      }))
    })
    await page.reload()

    // Open task
    await page.goto('/tasks/task-1')

    // Edit title
    const titleField = page.locator('textarea').first()
    await titleField.clear()
    await titleField.fill('Buy waterproof boots')

    // Wait for auto-save
    await page.waitForTimeout(700)

    // Go back to section
    await page.getByRole('button', { name: /back|arrow/i }).first().click()

    // Updated title visible
    await expect(page.getByText('Buy waterproof boots')).toBeVisible()

    // Re-enter task
    await page.getByText('Buy waterproof boots').click()

    // Tap three-dot menu
    await page.locator('button').filter({ has: page.locator('text=more_vert') }).first().click()

    // Tap delete
    await page.getByRole('button', { name: /delete/i }).click()

    // Confirm delete
    await page.getByRole('button', { name: /delete/i }).last().click()

    // Task gone
    await expect(page.getByText('Buy waterproof boots')).not.toBeVisible()
  })
})
