import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('should navigate from home to blog via section link', async ({ page }) => {
    // Arrange
    await page.goto('/')

    // Act
    await page.locator('section a[href="/blog"] h2').click()

    // Assert
    await expect(page).toHaveURL('/blog')
  })

  test('should navigate from home to project via section link', async ({ page }) => {
    // Arrange
    await page.goto('/')

    // Act
    await page.locator('section a[href="/project"] h2').click()

    // Assert
    await expect(page).toHaveURL('/project')
  })

  test('should navigate from collection to entry detail', async ({ page }) => {
    // Arrange
    await page.goto('/blog')
    const firstEntry = page.locator('.PageLink a').first()
    const href = await firstEntry.getAttribute('href')

    // Act
    await firstEntry.click()

    // Assert
    await expect(page).toHaveURL(href!)
  })

  test('should navigate from entry back to collection via breadcrumbs', async ({ page }) => {
    // Arrange
    await page.goto('/language/typescript')
    const breadcrumb = page.locator('.breadcrumb a[href="/language"]')

    // Act
    await breadcrumb.click()

    // Assert
    await expect(page).toHaveURL('/language')
  })
})
