import { f } from '../fields'
import { resource } from '../resource'
import type { Infer, WithId } from '../types'

/** Godot script paths that appear as ext_resource refs on slot items. */
export const SLOT_DATA_SCRIPT = 'res://Scripts/SlotData.gd'
export const ITEM_DATA_SCRIPT = 'res://Scripts/ItemData.gd'

/**
 * Schema for a single inventory / equipment / catalog slot item. Mirrors the
 * 16-property template the game writes — all fields have defaults matching
 * the game's omit-when-default convention, so parsed-but-absent fields round
 * trip correctly and fresh items only emit non-default values.
 */
export const slotItemSchema = resource({
  // Slot items live in Array[SlotData]. Without the script property Godot
  // treats a new sub-resource as a generic Resource and rejects the entire
  // typed array when loading the save.
  script: f.extRef({ default: SLOT_DATA_SCRIPT, required: true }),
  itemData: f.extRef({ default: '' }),
  nested: f.extRefArray({ default: [], elementTypePath: ITEM_DATA_SCRIPT }),
  storage: f.extRefArray({ default: [], elementTypePath: SLOT_DATA_SCRIPT }),
  condition: f.int({ default: 0 }),
  amount: f.int({ default: 0 }),
  position: f.int({ default: 0 }),
  mode: f.int({ default: 1 }),
  zoom: f.int({ default: 1 }),
  chamber: f.bool({ default: false }),
  casing: f.bool({ default: false }),
  state: f.string({ default: '' }),
  gridPosition: f.vector2({ default: { x: 0, y: 0 } }),
  gridRotated: f.bool({ default: false }),
  slot: f.string({ default: '' })
})

export type StoredSlotItem = Infer<typeof slotItemSchema>
export type SlotItemData = WithId<StoredSlotItem>
