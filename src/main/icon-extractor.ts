import { open, readFile, writeFile, mkdir, stat } from 'fs/promises'
import { existsSync } from 'fs'
import { join, basename } from 'path'
import { deflateSync } from 'zlib'
import type { FileHandle } from 'fs/promises'
import { app } from 'electron'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface IconProgress {
  phase: 'scanning' | 'extracting'
  current: number
  total: number
}

export type IconStatus =
  | { status: 'idle' }
  | { status: 'extracting'; progress: number; total: number }
  | { status: 'done' }
  | { status: 'error'; error: string }
  | { status: 'not-found' }

interface PckEntry {
  path: string
  offset: number
  size: number
}

// ---------------------------------------------------------------------------
// PCK directory parsing
// ---------------------------------------------------------------------------

async function readPckDirectory(fh: FileHandle, fileBase: number): Promise<PckEntry[]> {
  const headerBuf = Buffer.alloc(40)
  await fh.read(headerBuf, 0, 40, 0)

  const magic = headerBuf.toString('ascii', 0, 4)
  if (magic !== 'GDPC') throw new Error('Not a valid Godot PCK file')

  const dirOffset = Number(headerBuf.readBigUInt64LE(32))

  // Read entire directory in one shot (~1.8 MB) — 300x faster than per-field reads
  const fileStat = await fh.stat()
  const dirSize = fileStat.size - dirOffset
  const buf = Buffer.alloc(dirSize)
  await fh.read(buf, 0, dirSize, dirOffset)

  const fileCount = buf.readUInt32LE(0)
  const entries: PckEntry[] = []
  let pos = 4

  for (let i = 0; i < fileCount; i++) {
    const pathLen = buf.readUInt32LE(pos)
    pos += 4

    // pathLen includes null-padding for 4-byte alignment — find actual string end
    let strEnd = pos
    while (strEnd < pos + pathLen && buf[strEnd] !== 0) strEnd++
    const filePath = buf.toString('utf8', pos, strEnd)
    pos += pathLen

    // offset(8) + size(8) + md5(16) = 32 bytes
    const offset = Number(buf.readBigUInt64LE(pos))
    const size = Number(buf.readBigUInt64LE(pos + 8))
    pos += 32

    // flags (4 bytes)
    pos += 4

    entries.push({ path: filePath, offset: offset + fileBase, size })
  }

  return entries
}

// ---------------------------------------------------------------------------
// DXT5 (BC3) block decompression
// ---------------------------------------------------------------------------

function decodeDxt5(data: Buffer, width: number, height: number): Uint8Array {
  const rgba = new Uint8Array(width * height * 4)
  const blocksX = Math.ceil(width / 4)
  const blocksY = Math.ceil(height / 4)

  // Reusable per-block storage (avoids allocations in hot loop)
  const at = new Uint8Array(8)
  const cr = new Uint8Array(4)
  const cg = new Uint8Array(4)
  const cb = new Uint8Array(4)

  for (let by = 0; by < blocksY; by++) {
    for (let bx = 0; bx < blocksX; bx++) {
      const bo = (by * blocksX + bx) * 16

      // --- Alpha palette ---
      const a0 = data[bo]
      const a1 = data[bo + 1]
      at[0] = a0
      at[1] = a1
      if (a0 > a1) {
        at[2] = ((6 * a0 + a1 + 3) / 7) | 0
        at[3] = ((5 * a0 + 2 * a1 + 3) / 7) | 0
        at[4] = ((4 * a0 + 3 * a1 + 3) / 7) | 0
        at[5] = ((3 * a0 + 4 * a1 + 3) / 7) | 0
        at[6] = ((2 * a0 + 5 * a1 + 3) / 7) | 0
        at[7] = ((a0 + 6 * a1 + 3) / 7) | 0
      } else {
        at[2] = ((4 * a0 + a1 + 2) / 5) | 0
        at[3] = ((3 * a0 + 2 * a1 + 2) / 5) | 0
        at[4] = ((2 * a0 + 3 * a1 + 2) / 5) | 0
        at[5] = ((a0 + 4 * a1 + 2) / 5) | 0
        at[6] = 0
        at[7] = 255
      }

      // Alpha indices: two 24-bit halves (pixels 0-7 and 8-15)
      const aLow = data[bo + 2] | (data[bo + 3] << 8) | (data[bo + 4] << 16)
      const aHigh = data[bo + 5] | (data[bo + 6] << 8) | (data[bo + 7] << 16)

      // --- Color endpoints ---
      const c0 = data[bo + 8] | (data[bo + 9] << 8)
      const c1 = data[bo + 10] | (data[bo + 11] << 8)

      cr[0] = ((((c0 >> 11) & 0x1f) * 255) / 31 + 0.5) | 0
      cg[0] = ((((c0 >> 5) & 0x3f) * 255) / 63 + 0.5) | 0
      cb[0] = (((c0 & 0x1f) * 255) / 31 + 0.5) | 0
      cr[1] = ((((c1 >> 11) & 0x1f) * 255) / 31 + 0.5) | 0
      cg[1] = ((((c1 >> 5) & 0x3f) * 255) / 63 + 0.5) | 0
      cb[1] = (((c1 & 0x1f) * 255) / 31 + 0.5) | 0

      cr[2] = ((2 * cr[0] + cr[1] + 1) / 3) | 0
      cg[2] = ((2 * cg[0] + cg[1] + 1) / 3) | 0
      cb[2] = ((2 * cb[0] + cb[1] + 1) / 3) | 0
      cr[3] = ((cr[0] + 2 * cr[1] + 1) / 3) | 0
      cg[3] = ((cg[0] + 2 * cg[1] + 1) / 3) | 0
      cb[3] = ((cb[0] + 2 * cb[1] + 1) / 3) | 0

      const colorBits = data.readUInt32LE(bo + 12)

      // Write 4x4 pixel block
      for (let py = 0; py < 4; py++) {
        for (let px = 0; px < 4; px++) {
          const x = bx * 4 + px
          const y = by * 4 + py
          if (x >= width || y >= height) continue

          const pi = py * 4 + px
          const ci = (colorBits >> (pi * 2)) & 3
          const ai = pi < 8 ? (aLow >> (pi * 3)) & 7 : (aHigh >> ((pi - 8) * 3)) & 7

          const off = (y * width + x) * 4
          rgba[off] = cr[ci]
          rgba[off + 1] = cg[ci]
          rgba[off + 2] = cb[ci]
          rgba[off + 3] = at[ai]
        }
      }
    }
  }

  return rgba
}

// ---------------------------------------------------------------------------
// Minimal PNG encoder (uses Node's built-in zlib)
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
  // Build raw scanlines with filter byte 0 (None) per row
  const raw = Buffer.alloc(height * (1 + width * 4))
  for (let y = 0; y < height; y++) {
    const rowOff = y * (1 + width * 4)
    raw[rowOff] = 0 // filter: None
    rgba.copyWithin(0, 0) // noop, just for TS
    Buffer.from(rgba.buffer, rgba.byteOffset + y * width * 4, width * 4).copy(raw, rowOff + 1)
  }

  const compressed = deflateSync(raw, { level: 1 })

  // PNG = signature + IHDR + IDAT + IEND
  const sigLen = 8
  const ihdrLen = 12 + 13 // length(4) + type(4) + data(13) + crc(4)
  const idatLen = 12 + compressed.length
  const iendLen = 12
  const png = Buffer.alloc(sigLen + ihdrLen + idatLen + iendLen)
  let off = 0

  // Signature
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(png, off)
  off += 8

  // IHDR
  png.writeUInt32BE(13, off)
  off += 4
  png.write('IHDR', off)
  off += 4
  png.writeUInt32BE(width, off)
  off += 4
  png.writeUInt32BE(height, off)
  off += 4
  png[off++] = 8 // bit depth
  png[off++] = 6 // color type: RGBA
  png[off++] = 0 // compression
  png[off++] = 0 // filter
  png[off++] = 0 // interlace
  png.writeUInt32BE(crc32(png, off - 17, off), off)
  off += 4

  // IDAT
  png.writeUInt32BE(compressed.length, off)
  off += 4
  png.write('IDAT', off)
  off += 4
  compressed.copy(png, off)
  off += compressed.length
  png.writeUInt32BE(crc32(png, off - compressed.length - 4, off), off)
  off += 4

  // IEND
  png.writeUInt32BE(0, off)
  off += 4
  png.write('IEND', off)
  off += 4
  png.writeUInt32BE(crc32(png, off - 4, off), off)

  return png
}

// ---------------------------------------------------------------------------
// GST2 (CompressedTexture2D) → RGBA
// ---------------------------------------------------------------------------

const GST2_HEADER_SIZE = 52
const FORMAT_DXT5 = 19

function decodeCtex(data: Buffer): { width: number; height: number; rgba: Uint8Array } {
  const magic = data.toString('ascii', 0, 4)
  if (magic !== 'GST2') throw new Error(`Unknown texture magic: ${magic}`)

  const width = data.readUInt32LE(8)
  const height = data.readUInt32LE(12)
  const format = data.readUInt32LE(48)

  if (format !== FORMAT_DXT5)
    throw new Error(`Unsupported texture format: ${format} (expected DXT5=${FORMAT_DXT5})`)

  const pixelData = data.subarray(GST2_HEADER_SIZE)
  const rgba = decodeDxt5(pixelData, width, height)
  return { width, height, rgba }
}

// ---------------------------------------------------------------------------
// Icon name extraction from PCK paths
// ---------------------------------------------------------------------------

/** Extract item ID from PCK icon path like ".godot/imported/Icon_AK-12.png-hash.s3tc.ctex" */
function extractItemId(pckPath: string): string | null {
  const filename = basename(pckPath)
  // Match: Icon_{name}.png-{hash}.s3tc.ctex
  const match = filename.match(/^Icon_(.+)\.png-[a-f0-9]+\.s3tc\.ctex$/)
  return match ? match[1] : null
}

// ---------------------------------------------------------------------------
// Cache management
// ---------------------------------------------------------------------------

function getCacheDir(): string {
  return join(app.getPath('userData'), 'icon-cache')
}

function getVersionPath(): string {
  return join(getCacheDir(), 'version.json')
}

async function isCacheValid(pckPath: string): Promise<boolean> {
  try {
    const versionJson = await readFile(getVersionPath(), 'utf-8')
    const cached = JSON.parse(versionJson) as { pckMtime: number }
    const pckStat = await stat(pckPath)
    return cached.pckMtime === pckStat.mtimeMs
  } catch {
    return false
  }
}

async function writeCacheVersion(pckPath: string): Promise<void> {
  const pckStat = await stat(pckPath)
  await writeFile(getVersionPath(), JSON.stringify({ pckMtime: pckStat.mtimeMs }))
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

let currentStatus: IconStatus = { status: 'idle' }

export function getIconStatus(): IconStatus {
  return currentStatus
}

export function getIconCachePath(itemId: string): string {
  return join(getCacheDir(), `${itemId}.png`)
}

/** Read a cached icon as a base64 data URL, or null if not cached */
export async function getIconBase64(itemId: string): Promise<string | null> {
  const cachePath = getIconCachePath(itemId)
  try {
    const buf = await readFile(cachePath)
    return `data:image/png;base64,${buf.toString('base64')}`
  } catch {
    return null
  }
}

/**
 * Extract all item icons from the game PCK file.
 * Calls onProgress for each icon extracted.
 * Skips extraction if cache is valid.
 */
export async function extractAllIcons(
  pckPath: string,
  onProgress?: (progress: IconProgress) => void,
  force = false
): Promise<void> {
  // Check cache validity (skip if forced)
  if (!force && (await isCacheValid(pckPath))) {
    currentStatus = { status: 'done' }
    return
  }

  currentStatus = { status: 'extracting', progress: 0, total: 0 }

  const cacheDir = getCacheDir()
  if (!existsSync(cacheDir)) await mkdir(cacheDir, { recursive: true })

  let fh: FileHandle | null = null
  try {
    fh = await open(pckPath, 'r')

    // Read file_base from header
    const baseBuf = Buffer.alloc(8)
    await fh.read(baseBuf, 0, 8, 24)
    const fileBase = Number(baseBuf.readBigUInt64LE(0))

    // Scan PCK directory
    onProgress?.({ phase: 'scanning', current: 0, total: 0 })
    const allEntries = await readPckDirectory(fh, fileBase)

    // Filter icon .ctex entries
    const iconEntries = allEntries.filter(
      (e) => e.path.includes('Icon_') && e.path.endsWith('.s3tc.ctex')
    )

    const total = iconEntries.length
    currentStatus = { status: 'extracting', progress: 0, total }
    onProgress?.({ phase: 'extracting', current: 0, total })

    // Extract each icon
    for (let i = 0; i < iconEntries.length; i++) {
      const entry = iconEntries[i]
      const itemId = extractItemId(entry.path)
      if (!itemId) continue

      const outPath = join(cacheDir, `${itemId}.png`)

      // Read CTEX data from PCK
      const ctexBuf = Buffer.alloc(entry.size)
      await fh.read(ctexBuf, 0, entry.size, entry.offset)

      // Decode and save as PNG
      const { width, height, rgba } = decodeCtex(ctexBuf)
      const png = encodePng(rgba, width, height)
      await writeFile(outPath, png)

      currentStatus = { status: 'extracting', progress: i + 1, total }
      onProgress?.({ phase: 'extracting', current: i + 1, total })
    }

    await writeCacheVersion(pckPath)
    currentStatus = { status: 'done' }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    currentStatus = { status: 'error', error: message }
    throw err
  } finally {
    await fh?.close()
  }
}
