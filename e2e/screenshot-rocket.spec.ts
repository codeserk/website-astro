import { test } from '@playwright/test'

test('screenshot blender-mcp-rocket page', async ({ page }) => {
  page.on('console', (msg) => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      console.log(`[browser:${msg.type()}]`, msg.text())
    }
  })
  page.on('pageerror', (err) => console.log('[pageerror]', err.message))

  await page.setViewportSize({ width: 1400, height: 1000 })
  await page.goto('http://localhost:4321/model/blender-mcp-rocket/')
  await page.waitForLoadState('networkidle')
  await page.waitForSelector('.webgl-model canvas')
  await page.waitForTimeout(3500)
  const model = page.locator('.webgl-model').first()
  await model.scrollIntoViewIfNeeded()
  const box = await model.boundingBox()
  console.log('webgl-model box:', JSON.stringify(box))
  await model.screenshot({
    path: '/Users/codeserk/Projects/codeserk/nest/.blender-preview/portfolio-rocket.png',
  })
})
