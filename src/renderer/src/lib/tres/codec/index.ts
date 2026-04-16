import type { TresFile } from '../types'
import { characterSchema, type CharacterResource } from './schemas/character'
import { worldSchema, type WorldResource } from './schemas/world'
import { tradersSchema, type TradersResource } from './schemas/traders'

export type { CharacterResource } from './schemas/character'
export type { WorldResource } from './schemas/world'
export type { TradersResource } from './schemas/traders'
export type { StoredSlotItem, SlotItemData } from './schemas/slotItem'
export { characterSchema } from './schemas/character'
export { worldSchema } from './schemas/world'
export { tradersSchema } from './schemas/traders'
export { slotItemSchema } from './schemas/slotItem'
export { f } from './fields'
export { resource } from './resource'
export type { FieldCodec, ResourceCodec, Infer, InferFields, WithId } from './types'

/**
 * Parse the [resource] section of a Character.tres file into a typed object.
 */
export function parseCharacter(tres: TresFile): CharacterResource {
  return characterSchema.parse(tres.resource, { tres })
}

/**
 * Serialize a typed CharacterResource back to a TresFile. Overlays on the
 * `source` file so unknown properties, original `raw` tokenization, and
 * sub-resources not touched by the schema are preserved.
 *
 * Returns a new TresFile (shallow-copied from `source` and then mutated) —
 * does not mutate the input.
 */
export function serializeCharacter(data: CharacterResource, source: TresFile): TresFile {
  const tres = cloneTresFile(source)
  tres.resource = characterSchema.serialize(data, source.resource, { tres })
  updateLoadSteps(tres)
  return tres
}

export function parseWorld(tres: TresFile): WorldResource {
  return worldSchema.parse(tres.resource, { tres })
}

export function serializeWorld(data: WorldResource, source: TresFile): TresFile {
  const tres = cloneTresFile(source)
  tres.resource = worldSchema.serialize(data, source.resource, { tres })
  updateLoadSteps(tres)
  return tres
}

export function parseTraders(tres: TresFile): TradersResource {
  return tradersSchema.parse(tres.resource, { tres })
}

export function serializeTraders(data: TradersResource, source: TresFile): TresFile {
  const tres = cloneTresFile(source)
  tres.resource = tradersSchema.serialize(data, source.resource, { tres })
  updateLoadSteps(tres)
  return tres
}

/** Generate a fresh, unique `Resource_xxxxx` id for a new sub-resource. */
export function newSubResourceId(tres: TresFile): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let id: string
  do {
    let suffix = ''
    for (let i = 0; i < 5; i++) suffix += chars[Math.floor(Math.random() * chars.length)]
    id = 'Resource_' + suffix
  } while (tres.subResources.some((s) => s.id === id))
  return id
}

function cloneTresFile(source: TresFile): TresFile {
  return {
    header: { ...source.header },
    extResources: source.extResources.map((e) => ({ ...e })),
    subResources: source.subResources.map((s) => ({
      id: s.id,
      type: s.type,
      properties: s.properties.map((p) => ({ ...p }))
    })),
    resource: []
  }
}

function updateLoadSteps(tres: TresFile): void {
  if (tres.header.loadSteps === undefined) return
  tres.header.loadSteps = tres.extResources.length + tres.subResources.length + 1
  tres.header.raw = tres.header.raw.replace(/load_steps=\d+/, `load_steps=${tres.header.loadSteps}`)
}
