import { f } from '../fields'
import { resource } from '../resource'
import type { Infer } from '../types'
import { slotItemSchema, SLOT_DATA_SCRIPT } from './slotItem'

/** Schema for the [resource] section of Character.tres (`CharacterSave`). */
export const characterSchema = resource({
  health: f.float({ default: 100 }),
  energy: f.float({ default: 100 }),
  hydration: f.float({ default: 100 }),
  temperature: f.float({ default: 100 }),
  mental: f.float({ default: 100 }),

  cat: f.float({ default: 100 }),
  catFound: f.bool({ default: false }),
  catDead: f.bool({ default: false }),

  bodyStamina: f.float({ default: 100 }),
  armStamina: f.float({ default: 100 }),

  overweight: f.bool({ default: false }),
  starvation: f.bool({ default: false }),
  dehydration: f.bool({ default: false }),
  bleeding: f.bool({ default: false }),
  fracture: f.bool({ default: false }),
  burn: f.bool({ default: false }),
  frostbite: f.bool({ default: false }),
  insanity: f.bool({ default: false }),
  rupture: f.bool({ default: false }),
  headshot: f.bool({ default: false }),

  initialSpawn: f.bool({ default: false }),

  inventory: f.subRefArray(slotItemSchema, { elementTypePath: SLOT_DATA_SCRIPT }),
  equipment: f.subRefArray(slotItemSchema, { elementTypePath: SLOT_DATA_SCRIPT }),
  catalog: f.subRefArray(slotItemSchema, { elementTypePath: SLOT_DATA_SCRIPT }),

  primary: f.bool({ default: false }),
  secondary: f.bool({ default: false }),
  knife: f.bool({ default: false }),
  grenade1: f.bool({ default: false }),
  grenade2: f.bool({ default: false }),
  flashlight: f.bool({ default: false }),
  NVG: f.bool({ default: false }),
  weaponPosition: f.int({ default: 1 })

  // Note: `startingKit: LootTable` is also a field on CharacterSave but has
  // no primitive default (nullable resource ref). Unmodeled — passes through
  // via the overlay if present.
})

export type CharacterResource = Infer<typeof characterSchema>
