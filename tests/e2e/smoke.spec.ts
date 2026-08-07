import { test, expect } from '@playwright/test'

test('unauthenticated visitor is redirected to login', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/login$/)
  await expect(page.getByRole('heading', { name: 'RECA' })).toBeVisible()
  await expect(page.getByLabel('Courriel')).toBeVisible()
})

test('invalid credentials show a generic error, not a raw Supabase response', async ({
  page,
}) => {
  await page.goto('/login')
  await page.getByLabel('Courriel').fill('nobody@example.com')
  await page.getByLabel('Mot de passe').fill('wrong-password-123')
  await page.getByRole('button', { name: 'Se connecter' }).click()
  await expect(page.getByRole('alert')).toHaveText('Courriel ou mot de passe invalide.')
})
