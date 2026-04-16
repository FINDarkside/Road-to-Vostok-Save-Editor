/**
 * Roundtrip verification for the schema codec.
 *
 * Parses real save files (Character.tres, World.tres, Traders.tres) from the
 * game save directory, runs them through the codec (parse → serialize), and
 * compares the output to the original byte-for-byte.
 *
 * Run with: npx tsx scripts/verify-codec-roundtrip.ts
 *
 * Exits with code 1 if any roundtrip produces a diff. Prints a unified-ish
 * diff summary of the first few mismatching lines.
 */

import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { parseTresFile } from '../src/renderer/src/lib/tres/parser'
import { serializeTresFile } from '../src/renderer/src/lib/tres/serializer'
import {
  parseCharacter,
  serializeCharacter,
  parseWorld,
  serializeWorld,
  parseTraders,
  serializeTraders
} from '../src/renderer/src/lib/tres/codec'
import type { TresFile } from '../src/renderer/src/lib/tres/types'

const SAVE_DIR =
  process.env.ROAD_TO_VOSTOK_SAVES ?? join(process.env.APPDATA ?? '', 'Road to Vostok')

interface Case {
  file: string
  roundtrip: (source: TresFile) => TresFile
}

const cases: Case[] = [
  {
    file: 'Character.tres',
    roundtrip: (src) => serializeCharacter(parseCharacter(src), src)
  },
  { file: 'World.tres', roundtrip: (src) => serializeWorld(parseWorld(src), src) },
  { file: 'Traders.tres', roundtrip: (src) => serializeTraders(parseTraders(src), src) }
]

let failed = 0
for (const { file, roundtrip } of cases) {
  const path = join(SAVE_DIR, file)
  if (!existsSync(path)) {
    console.log(`[skip] ${file} — not found at ${path}`)
    continue
  }

  const original = readFileSync(path, 'utf8')
  const parsed = parseTresFile(original)
  const serialized = serializeTresFile(roundtrip(parsed))

  if (serialized === original) {
    console.log(`[ok]   ${file}`)
    continue
  }

  failed++
  console.log(`[FAIL] ${file}`)
  const origLines = original.split('\n')
  const newLines = serialized.split('\n')
  const max = Math.max(origLines.length, newLines.length)
  let shown = 0
  for (let i = 0; i < max && shown < 20; i++) {
    if (origLines[i] !== newLines[i]) {
      console.log(`  line ${i + 1}:`)
      console.log(`    - ${origLines[i] ?? '<EOF>'}`)
      console.log(`    + ${newLines[i] ?? '<EOF>'}`)
      shown++
    }
  }
  if (origLines.length !== newLines.length) {
    console.log(`  length: ${origLines.length} lines -> ${newLines.length} lines`)
  }
}

if (failed > 0) {
  console.log(`\n${failed} file(s) failed roundtrip.`)
  process.exit(1)
}
console.log('\nAll roundtrips byte-identical.')

// --- Mutation tests on Character.tres ---

const characterPath = join(SAVE_DIR, 'Character.tres')
if (existsSync(characterPath)) {
  console.log('\nMutation tests:')
  const src = parseTresFile(readFileSync(characterPath, 'utf8'))
  const data = parseCharacter(src)

  // 1. Edit health; reparse and confirm it survived
  const mutated = { ...data, health: 42 }
  const after = parseCharacter(serializeCharacter(mutated, src))
  console.log(
    `  health 42 edit:        ${after.health === 42 ? 'ok' : 'FAIL'} (got ${after.health})`
  )

  // 2. Move first inventory item to equipment, reparse, confirm it's in equipment
  if (data.inventory.length > 0 && data.equipment.length > 0) {
    const first = data.inventory[0]
    const moved = {
      ...data,
      inventory: data.inventory.slice(1),
      equipment: [...data.equipment, { ...first, slot: 'Primary' }]
    }
    const afterMove = parseCharacter(serializeCharacter(moved, src))
    const inInv = afterMove.inventory.some((i) => i.id === first.id)
    const inEq = afterMove.equipment.some((i) => i.id === first.id)
    console.log(
      `  move inv -> equipment: ${!inInv && inEq ? 'ok' : 'FAIL'} (inInv=${inInv}, inEq=${inEq})`
    )
  }

  // 3. Remove first inventory item entirely, confirm its SubResource is GC'd
  if (data.inventory.length > 0) {
    const first = data.inventory[0]
    const removed = { ...data, inventory: data.inventory.slice(1) }
    const afterRemove = serializeCharacter(removed, src)
    const stillExists = afterRemove.subResources.some((s) => s.id === first.id)
    console.log(
      `  remove item:           ${!stillExists ? 'ok' : 'FAIL'} (sub-resource still present: ${stillExists})`
    )
  }

  // 4. Unchanged roundtrip preserves original raw numeric tokens (health = 88.56666...)
  const noChange = serializeTresFile(serializeCharacter(data, src))
  const matchOriginal = noChange === readFileSync(characterPath, 'utf8')
  console.log(`  untouched raw roundtrip: ${matchOriginal ? 'ok' : 'FAIL'}`)
}
