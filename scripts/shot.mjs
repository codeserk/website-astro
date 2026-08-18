#!/usr/bin/env node
/**
 * Screenshots a page from the running dev server and reports console/page
 * errors, so changes can be verified instead of assumed.
 *
 * Usage: npm run shot -- /test-tui [--out shot] [--width 1440] [--height 900]
 *        npm run shot -- /test-tui --full
 *
 * Writes to ~/Projects/AI/agents/tmp/<out>.png, which container agents read at
 * /home/node/agents/tmp/<out>.png. Requires `npm run dev` to be running.
 */
import { mkdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { chromium } from 'playwright'

const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const index = args.indexOf(`--${name}`)
  return index === -1 ? fallback : args[index + 1]
}

const route = args.find((arg) => arg.startsWith('/')) ?? '/'
const base = flag('base', 'http://localhost:4321')
const out = flag('out', 'shot')
const width = Number(flag('width', 1440))
const height = Number(flag('height', 900))
const full = args.includes('--full')
const settle = Number(flag('settle', 2500))

const dir = join(homedir(), 'Projects/AI/agents/tmp')
mkdirSync(dir, { recursive: true })
const target = join(dir, `${out}.png`)

const problems = []
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 2 })

page.on('console', (message) => {
  if (message.type() === 'error' || message.type() === 'warning') {
    problems.push(`[${message.type()}] ${message.text()}`)
  }
})
page.on('pageerror', (error) => problems.push(`[pageerror] ${error.message}`))
page.on('requestfailed', (request) =>
  problems.push(`[request] ${request.url()} - ${request.failure()?.errorText ?? 'failed'}`),
)

const url = `${base}${route}`
try {
  const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 })
  if (!response?.ok()) problems.push(`[http] ${response?.status()} on ${url}`)
} catch (error) {
  console.error(`shot: could not load ${url}\n${error.message}\nIs "npm run dev" running?`)
  await browser.close()
  process.exit(1)
}

await page.waitForTimeout(settle)
await page.screenshot({ path: target, fullPage: full })

const probe = flag('probe', null)
if (probe) {
  const metrics = await page.evaluate((selector) => {
    const element = document.querySelector(selector)
    if (!element) return null
    const style = getComputedStyle(element)
    return {
      offsetWidth: element.offsetWidth,
      offsetHeight: element.offsetHeight,
      scrollWidth: element.scrollWidth,
      scrollHeight: element.scrollHeight,
      columnWidth: style.columnWidth,
      columnCount: style.columnCount,
      columnGap: style.columnGap,
      columnFill: style.columnFill,
      height: style.height,
      position: style.position,
      overflow: style.overflow,
    }
  }, probe)
  console.log(`probe ${probe}: ${metrics ? JSON.stringify(metrics, null, 2) : 'NOT FOUND'}`)
}

await browser.close()

console.log(`shot: ${url} -> ${target} (${width}x${height}${full ? ', full page' : ''})`)
if (problems.length === 0) {
  console.log('shot: no console errors, page errors or failed requests')
} else {
  console.log(`shot: ${problems.length} problem(s)`)
  for (const problem of problems) console.log(`  ${problem}`)
}
