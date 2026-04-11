/**
 * Reads decompiled .tres item files from "Vostok RE" and generates:
 *   - src/renderer/src/data/items.ts
 *
 * Usage:  npx tsx scripts/sync-items.ts
 */

import { readdir, readFile, writeFile } from 'fs/promises'
import { join, basename } from 'path'

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const DECOMPILED = join(__dirname, '../../Vostok RE/decompiled')
const DECOMPILED_ITEMS = join(DECOMPILED, 'Items')
const DECOMPILED_SCRIPTS = join(DECOMPILED, 'Scripts')
const OUT_ITEMS = join(__dirname, '../src/renderer/src/data/items.ts')

/** Map game `type` field → our ItemCategory name */
const TYPE_TO_CATEGORY: Record<string, string> = {
  Ammo: 'Ammo',
  Armor: 'Armor',
  Attachment: 'Attachments',
  Backpack: 'Backpacks',
  'Belt Pouch': 'Belts',
  Clothing: 'Clothing',
  Consumable: 'Consumables',
  Consumables: 'Consumables',
  Electronics: 'Electronics',
  Fish: 'Fishing',
  Fishing: 'Fishing',
  Grenade: 'Grenades',
  Helmet: 'Helmets',
  Instrument: 'Instruments',
  Key: 'Keys',
  Knife: 'Knives',
  Literature: 'Books',
  Lore: 'Lore',
  Medical: 'Medical',
  Misc: 'Misc',
  Rig: 'Rigs',
  Weapon: 'Weapons'
}

/**
 * Scan Scripts/*.gd to find all classes that extend ItemData (directly or transitively).
 * Returns a Set including "ItemData" itself.
 */
async function findItemDataClasses(): Promise<Set<string>> {
  const files = await readdir(DECOMPILED_SCRIPTS)
  // Map class_name → extends
  const parentOf = new Map<string, string>()
  for (const file of files) {
    if (!file.endsWith('.gd')) continue
    const content = await readFile(join(DECOMPILED_SCRIPTS, file), 'utf-8')
    const extendsMatch = content.match(/^extends\s+(\w+)/m)
    const classMatch = content.match(/^class_name\s+(\w+)/m)
    if (extendsMatch && classMatch) {
      parentOf.set(classMatch[1], extendsMatch[1])
    }
  }

  const result = new Set<string>(['ItemData'])
  // Iteratively resolve: any class whose parent is already in the set gets added
  let changed = true
  while (changed) {
    changed = false
    for (const [cls, parent] of parentOf) {
      if (!result.has(cls) && result.has(parent)) {
        result.add(cls)
        changed = true
      }
    }
  }
  return result
}

// ---------------------------------------------------------------------------
// .tres parser
// ---------------------------------------------------------------------------

function parseResourceBlock(content: string): Record<string, string> {
  const idx = content.indexOf('\n[resource]')
  if (idx === -1) return {}
  const fields: Record<string, string> = {}
  // Skip past the "[resource]\n" line itself
  const afterHeader = content.indexOf('\n', idx + 1)
  if (afterHeader === -1) return fields
  for (const line of content.slice(afterHeader + 1).split('\n')) {
    if (line.startsWith('[')) break
    const m = line.match(/^(\w+)\s*=\s*(.+)/)
    if (m) fields[m[1]] = m[2].trim()
  }
  return fields
}

/** Parse ext_resource lines into a map of id → path */
function parseExtResources(content: string): Map<string, string> {
  const map = new Map<string, string>()
  for (const line of content.split('\n')) {
    if (!line.startsWith('[ext_resource')) continue
    const id = line.match(/ id="([^"]+)"/)
    const path = line.match(/path="([^"]+)"/)
    if (id && path) map.set(id[1], path[1])
  }
  return map
}

/**
 * Resolve the icon ctex filename from the .tres content.
 *
 * Follows the chain:  .tres `icon = ExtResource("N")`
 *   → ext_resource path (e.g. "res://Items/.../Icon_Coffee.png")
 *   → corresponding .import sidecar on disk
 *   → `path.s3tc` field containing the ctex filename with hash
 *
 * Returns the ctex basename, e.g. "Icon_Coffee.png-03e4bc22cc0a46717328b57dcd1ecb0b.s3tc.ctex",
 * which uniquely identifies the correct PCK entry (avoiding UI icon collisions).
 */
async function resolveIconFile(
  content: string,
  fields: Record<string, string>,
  tresDir: string
): Promise<string | null> {
  const iconRef = fields.icon?.match(/ExtResource\("([^"]+)"\)/)
  if (!iconRef) return null
  const extResources = parseExtResources(content)
  const iconPath = extResources.get(iconRef[1])
  if (!iconPath) return null

  // The icon path is like "res://Items/Consumables/Coffee/Files/Icon_Coffee.png"
  // Resolve relative to the decompiled root to find the .import sidecar
  const relPath = iconPath.replace(/^res:\/\//, '')
  const importPath = join(DECOMPILED, relPath + '.import')

  try {
    const importContent = await readFile(importPath, 'utf-8')
    const ctexMatch = importContent.match(/path\.s3tc="res:\/\/.godot\/imported\/(.+?)"/)
    if (ctexMatch) return ctexMatch[1]
  } catch {
    // .import file not found — fall back to plain icon filename
  }

  const filename = basename(iconPath)
  return filename.startsWith('Icon_') && filename.endsWith('.png') ? filename : null
}

function parseString(raw: string | undefined): string {
  if (!raw) return ''
  if (raw.startsWith('"') && raw.endsWith('"')) return raw.slice(1, -1)
  return raw
}

function parseBool(raw: string | undefined): boolean {
  return raw === 'true'
}

function parseNumber(raw: string | undefined): number {
  if (!raw) return 0
  const n = Number(raw)
  return isNaN(n) ? 0 : n
}

function parseVector2(raw: string | undefined): { x: number; y: number } | null {
  if (!raw) return null
  const m = raw.match(/^Vector2\(\s*([\d.]+)\s*,\s*([\d.]+)\s*\)$/)
  if (!m) return null
  return { x: parseFloat(m[1]), y: parseFloat(m[2]) }
}

function getScriptClass(firstLine: string): string | null {
  const m = firstLine.match(/script_class="(\w+)"/)
  return m ? m[1] : null
}

// ---------------------------------------------------------------------------
// File scanning
// ---------------------------------------------------------------------------

async function findTresFiles(dir: string): Promise<string[]> {
  const results: string[] = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...(await findTresFiles(full)))
    } else if (entry.name.endsWith('.tres')) {
      results.push(full)
    }
  }
  return results
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

interface ItemEntry {
  category: string
  id: string
  displayName: string
  resourcePath: string
  sizeW: number
  sizeH: number
  iconFile: string | null
  stackable: boolean
  showCondition: boolean
  showAmount: boolean
  defaultAmount: number
  maxAmount: number
  repairs: boolean
}

async function main() {
  const itemClasses = await findItemDataClasses()
  console.log(`Item script classes: ${[...itemClasses].join(', ')}`)

  const tresFiles = await findTresFiles(DECOMPILED_ITEMS)
  console.log(`Found ${tresFiles.length} .tres files`)

  const items: ItemEntry[] = []
  const unknownTypes = new Map<string, string[]>()

  for (const filePath of tresFiles) {
    const content = await readFile(filePath, 'utf-8')
    const firstLine = content.split('\n')[0]
    const scriptClass = getScriptClass(firstLine)
    if (!scriptClass || !itemClasses.has(scriptClass)) continue

    const fields = parseResourceBlock(content)
    const rawType = parseString(fields.type).trim()
    if (!rawType) continue

    const category = TYPE_TO_CATEGORY[rawType]
    if (!category) {
      const list = unknownTypes.get(rawType) ?? []
      list.push(filePath)
      unknownTypes.set(rawType, list)
      continue
    }

    const id = basename(filePath, '.tres')
    const relPath = filePath
      .replace(/\\/g, '/')
      .replace(/^.*\/Items\//, 'res://Items/')

    const size = parseVector2(fields.size) ?? { x: 1, y: 1 }
    const tresDir = join(filePath, '..')
    const iconFile = await resolveIconFile(content, fields, tresDir)

    items.push({
      category,
      id,
      displayName: parseString(fields.name) || id,
      resourcePath: relPath,
      sizeW: size.x,
      sizeH: size.y,
      iconFile,
      stackable: parseBool(fields.stackable),
      showCondition: parseBool(fields.showCondition),
      showAmount: parseBool(fields.showAmount),
      defaultAmount: parseNumber(fields.defaultAmount),
      maxAmount: parseNumber(fields.maxAmount),
      repairs: parseBool(fields.repairs)
    })
  }

  if (unknownTypes.size > 0) {
    console.warn('\nUnmapped type values (items skipped):')
    for (const [type, files] of unknownTypes) {
      console.warn(`  "${type}" (${files.length}): ${files.map((f) => basename(f)).join(', ')}`)
    }
  }

  // Sort by category, then display name
  items.sort((a, b) => a.category.localeCompare(b.category) || a.displayName.localeCompare(b.displayName))

  // Collect all categories for the type union
  const categories = [...new Set(items.map((i) => i.category))].sort()

  console.log(`\nParsed ${items.length} items across ${categories.length} categories:`)
  for (const cat of categories) {
    console.log(`  ${cat}: ${items.filter((i) => i.category === cat).length}`)
  }

  // ---- Generate items.ts ----
  const itemLines: string[] = []
  for (const item of items) {
    const props: string[] = [
      `    category: '${item.category}'`,
      `    id: '${item.id}'`,
      `    displayName: '${item.displayName.replace(/'/g, "\\'")}'`,
      `    resourcePath: '${item.resourcePath}'`
    ]
    if (item.sizeW !== 1 || item.sizeH !== 1) {
      props.push(`    sizeW: ${item.sizeW}`)
      props.push(`    sizeH: ${item.sizeH}`)
    }
    if (item.iconFile) props.push(`    iconFile: '${item.iconFile}'`)
    if (item.stackable) props.push('    stackable: true')
    if (item.showCondition) props.push('    showCondition: true')
    if (item.showAmount) props.push('    showAmount: true')
    if (item.defaultAmount) props.push(`    defaultAmount: ${item.defaultAmount}`)
    if (item.maxAmount) props.push(`    maxAmount: ${item.maxAmount}`)
    if (item.repairs) props.push('    repairs: true')
    itemLines.push(`  {\n${props.join(',\n')}\n  }`)
  }

  const itemsSrc = `import type { GameItem, ResolvedItemMeta } from '../lib/types'

export const ITEMS = [
${itemLines.join(',\n')}
] satisfies GameItem[]

/** Items indexed by resource path for quick lookup */
export const ITEMS_BY_PATH = new Map<string, GameItem>(
  ITEMS.map((item) => [item.resourcePath, item])
)

export function resolveItemMeta(item: GameItem): ResolvedItemMeta {
  const stackable = item.stackable ?? false
  const showCondition = item.showCondition ?? false
  return {
    stackable,
    showCondition,
    showAmount: item.showAmount ?? false,
    defaultAmount: item.defaultAmount ?? (stackable ? 1 : 0),
    defaultCondition: showCondition ? 100 : 0,
    maxAmount: item.maxAmount,
    repairs: item.repairs ?? false
  }
}

/** Resolved metadata indexed by resource path */
export const ITEMS_META = new Map<string, ResolvedItemMeta>(
  ITEMS.map((item) => [item.resourcePath, resolveItemMeta(item)])
)

export function getItemSize(item: GameItem): { w: number; h: number } {
  return { w: item.sizeW ?? 1, h: item.sizeH ?? 1 }
}
`

  await writeFile(OUT_ITEMS, itemsSrc, 'utf-8')
  console.log(`\nWrote ${OUT_ITEMS}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
