/**
 * Generate side-by-side comparison of full-res vs half-res icons.
 *
 * Usage:  npx tsx scripts/icon-bench.ts
 * Output: scripts/icon-compare/
 */

import { readFile, mkdir, writeFile } from 'fs/promises'
import { join } from 'path'
import { deflateSync, inflateSync } from 'zlib'

const CACHE_DIR = join(
  process.env.APPDATA || join(process.env.HOME!, 'AppData', 'Roaming'),
  'road-to-vostok-save-editor',
  'icon-cache'
)
const OUT_DIR = join(__dirname, 'icon-compare')

const SAMPLES = ['AK-12.png', 'Coffee.png', 'Mosin.png', 'M4A1.png']

// ---------------------------------------------------------------------------
// Minimal PNG decoder
// ---------------------------------------------------------------------------

function decodePng(buf: Buffer): { width: number; height: number; rgba: Uint8Array } {
  let pos = 8
  let width = 0
  let height = 0
  const idatChunks: Buffer[] = []

  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos)
    const type = buf.toString('ascii', pos + 4, pos + 8)
    if (type === 'IHDR') {
      width = buf.readUInt32BE(pos + 8)
      height = buf.readUInt32BE(pos + 12)
    } else if (type === 'IDAT') {
      idatChunks.push(buf.subarray(pos + 8, pos + 8 + len))
    }
    pos += 12 + len
  }

  const raw = inflateSync(Buffer.concat(idatChunks))
  const rgba = new Uint8Array(width * height * 4)
  for (let y = 0; y < height; y++) {
    const srcOff = y * (1 + width * 4) + 1
    const dstOff = y * width * 4
    raw.copy(rgba, dstOff, srcOff, srcOff + width * 4)
  }
  return { width, height, rgba }
}

// ---------------------------------------------------------------------------
// Box-filter 2x downscale
// ---------------------------------------------------------------------------

function downscaleHalf(rgba: Uint8Array, w: number, h: number): Uint8Array {
  const hw = w >> 1
  const hh = h >> 1
  const out = new Uint8Array(hw * hh * 4)
  for (let y = 0; y < hh; y++) {
    for (let x = 0; x < hw; x++) {
      const sx = x * 2
      const sy = y * 2
      for (let c = 0; c < 4; c++) {
        const tl = rgba[(sy * w + sx) * 4 + c]
        const tr = rgba[(sy * w + sx + 1) * 4 + c]
        const bl = rgba[((sy + 1) * w + sx) * 4 + c]
        const br = rgba[((sy + 1) * w + sx + 1) * 4 + c]
        out[(y * hw + x) * 4 + c] = (tl + tr + bl + br + 2) >> 2
      }
    }
  }
  return out
}

// ---------------------------------------------------------------------------
// PNG encoder
// ---------------------------------------------------------------------------

function crc32Table(): Uint32Array {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c
  }
  return table
}

const CRC_TABLE = crc32Table()

function crc32(buf: Buffer, start: number, end: number): number {
  let crc = 0xffffffff
  for (let i = start; i < end; i++) crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

function encodePng(rgba: Uint8Array, width: number, height: number): Buffer {
  const raw = Buffer.alloc(height * (1 + width * 4))
  for (let y = 0; y < height; y++) {
    const rowOff = y * (1 + width * 4)
    raw[rowOff] = 0
    Buffer.from(rgba.buffer, rgba.byteOffset + y * width * 4, width * 4).copy(raw, rowOff + 1)
  }
  const compressed = deflateSync(raw, { level: 1 })

  const png = Buffer.alloc(8 + 25 + 12 + compressed.length + 12)
  let off = 0

  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(png, off); off += 8
  png.writeUInt32BE(13, off); off += 4
  png.write('IHDR', off); off += 4
  png.writeUInt32BE(width, off); off += 4
  png.writeUInt32BE(height, off); off += 4
  png[off++] = 8; png[off++] = 6; png[off++] = 0; png[off++] = 0; png[off++] = 0
  png.writeUInt32BE(crc32(png, off - 17, off), off); off += 4

  png.writeUInt32BE(compressed.length, off); off += 4
  png.write('IDAT', off); off += 4
  compressed.copy(png, off); off += compressed.length
  png.writeUInt32BE(crc32(png, off - compressed.length - 4, off), off); off += 4

  png.writeUInt32BE(0, off); off += 4
  png.write('IEND', off); off += 4
  png.writeUInt32BE(crc32(png, off - 4, off), off)

  return png
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  await mkdir(OUT_DIR, { recursive: true })

  for (const name of SAMPLES) {
    const buf = await readFile(join(CACHE_DIR, name))
    const img = decodePng(buf)

    // Copy full-res original
    await writeFile(join(OUT_DIR, `${name.replace('.png', '')}_full.png`), buf)

    // Generate half-res
    const halfRgba = downscaleHalf(img.rgba, img.width, img.height)
    const halfPng = encodePng(halfRgba, img.width >> 1, img.height >> 1)
    await writeFile(join(OUT_DIR, `${name.replace('.png', '')}_half.png`), halfPng)

    const fullKB = (buf.length / 1024).toFixed(1)
    const halfKB = (halfPng.length / 1024).toFixed(1)
    console.log(`${name}: ${img.width}x${img.height} (${fullKB} KB) -> ${img.width >> 1}x${img.height >> 1} (${halfKB} KB)`)
  }

  console.log(`\nOutput: ${OUT_DIR}`)
}

main().catch(console.error)
