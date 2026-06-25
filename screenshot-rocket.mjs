import { chromium } from 'playwright'

const browser = await chromium.launch({
  headless: true,
  executablePath: '/home/node/.cache/ms-playwright/chromium-1217/chrome-linux/chrome',
})
const ctx = await browser.newContext({ viewport: { width: 1400, height: 1000 } })
const page = await ctx.newPage()

await page.goto('http://localhost:4321/model/blender-mcp-rocket/', { waitUntil: 'networkidle' })
// give WebGL a moment to compile shaders and render
await page.waitForTimeout(4000)

await page.screenshot({
  path: '/Users/codeserk/Projects/codeserk/nest/.blender-preview/portfolio-rocket.png',
  fullPage: true,
})
console.log('OK')
await browser.close()
