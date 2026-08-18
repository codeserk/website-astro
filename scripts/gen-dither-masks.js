#!/usr/bin/env node
/**
 * Generates the ordered-dither (Bayer 4x4) mask steps that SceneBackground.astro
 * dissolves the wasm scene in with.
 *
 * Step N is a mask PNG whose opaque cells are the ones with a Bayer threshold
 * below N, so animating 00 -> 16 reveals a layer dot by dot. The cell size is
 * baked into the PNG instead of being left to `mask-size`, otherwise the
 * browser smooths the dots into blobs.
 *
 * Usage: node scripts/gen-dither-masks.js [--cell 16] [--out public/portfolio-scene/dither]
 *
 * Keep `cell` at twice the CSS `mask-size` cell so the pattern lands on whole
 * device pixels at both 1x and 2x (CSS uses mask-size: 32px on a 4-cell
 * pattern, i.e. 8px cells, so cell = 16).
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { deflateSync } from 'node:zlib'

const PROJECT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DEFAULT_OUT = 'public/portfolio-scene/dither'
const DEFAULT_CELL = 16

const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
]
/* Bayer rows are not quartile-balanced, so one-cell rings at a fixed level come
 * out striped. This matrix keeps one value from each quartile in every row and
 * column, evenly spaced, so ring levels 4/8/12 give exact 25/50/75% density
 * along any straight edge. */
const EDGE = [
  [0, 8, 4, 12],
  [13, 1, 9, 5],
  [6, 14, 2, 10],
  [11, 7, 15, 3],
]

const BAYER_SIZE = BAYER.length
const STEPS = BAYER_SIZE * BAYER_SIZE

function parseArgs(argv) {
  const options = { cell: DEFAULT_CELL, out: DEFAULT_OUT }
  for (let i = 0; i < argv.length; i += 2) {
    const flag = argv[i]
    const value = argv[i + 1]
    if (flag === '--cell') {
      options.cell = Number.parseInt(value, 10)
    } else if (flag === '--out') {
      options.out = value
    } else {
      throw new Error(`unknown argument: ${flag}`)
    }
  }
  if (!Number.isInteger(options.cell) || options.cell < 1) {
    throw new Error(`--cell must be a positive integer, got: ${options.cell}`)
  }
  return options
}

const CRC_TABLE = (() => {
  const table = new Int32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    }
    table[n] = c
  }
  return table
})()

function crc32(buffer) {
  let c = 0xffffffff
  for (const byte of buffer) {
    c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8)
  }
  return (c ^ 0xffffffff) >>> 0
}

function pngChunk(type, data) {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  const typed = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(typed))
  return Buffer.concat([length, typed, crc])
}

/** 8-bit grayscale + alpha PNG (color type 4), one Bayer tile at `cell` scale. */
function maskPng(level, cell) {
  const size = BAYER_SIZE * cell

  const header = Buffer.alloc(13)
  header.writeUInt32BE(size, 0)
  header.writeUInt32BE(size, 4)
  header[8] = 8
  header[9] = 4

  const scanlines = []
  for (let y = 0; y < size; y++) {
    scanlines.push(0)
    for (let x = 0; x < size; x++) {
      const opaque = BAYER[Math.floor(y / cell)][Math.floor(x / cell)] < level
      scanlines.push(255, opaque ? 255 : 0)
    }
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk('IHDR', header),
    pngChunk('IDAT', deflateSync(Buffer.from(scanlines))),
    pngChunk('IEND', Buffer.alloc(0)),
  ])
}

/** Edge-ramp mask for mask-border: a solid centre dissolving to nothing over
 *  three ordered-dither rings (75/50/25%). The min-distance field chamfers the
 *  corners. Baked at 2x - 8px cells shown at 4px CSS by a 16px border width
 *  against a 32px slice. */
function edgePng(cell = 8) {
  const cells = 12
  const size = cells * cell

  const header = Buffer.alloc(13)
  header.writeUInt32BE(size, 0)
  header.writeUInt32BE(size, 4)
  header[8] = 8
  header[9] = 4

  const scanlines = []
  for (let y = 0; y < size; y++) {
    scanlines.push(0)
    for (let x = 0; x < size; x++) {
      const cx = Math.floor(x / cell)
      const cy = Math.floor(y / cell)
      const ring = Math.min(cx, cy, cells - 1 - cx, cells - 1 - cy)
      const level = Math.min(STEPS, (ring + 1) * 4)
      scanlines.push(255, EDGE[cy % 4][cx % 4] < level ? 255 : 0)
    }
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk('IHDR', header),
    pngChunk('IDAT', deflateSync(Buffer.from(scanlines))),
    pngChunk('IEND', Buffer.alloc(0)),
  ])
}

const { cell, out } = parseArgs(process.argv.slice(2))
const outDir = resolve(PROJECT_ROOT, out)

mkdirSync(outDir, { recursive: true })
for (let level = 0; level <= STEPS; level++) {
  writeFileSync(join(outDir, `${String(level).padStart(2, '0')}.png`), maskPng(level, cell))
}

writeFileSync(join(outDir, 'edge.png'), edgePng())

console.log(`gen-dither-masks: wrote ${STEPS + 1} steps at ${cell}px cells + edge.png to ${out}`)
