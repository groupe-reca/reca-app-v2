import { test, expect } from '@playwright/test'

test('dashboard shell renders', async ({ page }) => {
  await page.goto('/')
  await expect(
    page.getByRole('heading', { name: 'RECA — Centre des opérations' }),
  ).toBeVisible()
})
