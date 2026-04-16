import { ref, computed } from 'vue'
import type { TresFile } from '../lib/tres/types'
import type { SlotItem } from '../lib/types'
import {
  newSubResourceId,
  type CharacterResource,
  type WorldResource,
  type TradersResource,
  type SlotItemData
} from '../lib/tres/codec'
import { ITEMS_BY_PATH, ITEMS_META } from '../data/items'

// ---------- Module-level reactive state ----------

export const currentFile = ref<string | null>(null)

// Source TresFiles — kept for overlay-based serialization. Not the source of
// truth for edits; all mutations flow through the typed resources.
export const tresFile = ref<TresFile | null>(null)
export const worldFile = ref<TresFile | null>(null)
export const tradersFile = ref<TresFile | null>(null)

// Typed resource state — the authoritative, user-facing data
export const character = ref<CharacterResource | null>(null)
export const world = ref<WorldResource | null>(null)
export const traders = ref<TradersResource | null>(null)

export const isLoading = ref(false)
export const isDirty = ref(false)
export const loadError = ref<string | null>(null)
export const worldLoadError = ref<string | null>(null)
export const tradersLoadError = ref<string | null>(null)

// ---------- View-model projection ----------

export function slotItemDataToSlotItem(data: SlotItemData): SlotItem {
  const itemPath = data.itemData
  const catalogItem = ITEMS_BY_PATH.get(itemPath)
  const itemMeta = ITEMS_META.get(itemPath)
  const armorPlatePath = data.nested.find((p) => ITEMS_BY_PATH.get(p)?.plate) ?? ''
  const armorPlate = armorPlatePath ? ITEMS_BY_PATH.get(armorPlatePath) : undefined
  const isPlatedRig = catalogItem?.carrier === true && !!armorPlate

  return {
    subResourceId: data.id,
    itemPath,
    itemName:
      catalogItem?.displayName ?? itemPath.split('/').pop()?.replace('.tres', '') ?? 'Unknown',
    nameInventory: catalogItem?.nameInventory ?? catalogItem?.displayName ?? 'Unknown',
    nameRotated:
      catalogItem?.nameRotated ??
      catalogItem?.nameInventory ??
      catalogItem?.displayName ??
      'Unknown',
    nameEquipment:
      catalogItem?.nameEquipment ??
      catalogItem?.nameInventory ??
      catalogItem?.displayName ??
      'Unknown',
    category: catalogItem?.category ?? '',
    condition: data.condition,
    showCondition: (itemMeta?.showCondition ?? false) || isPlatedRig,
    amount: data.amount,
    showAmount: itemMeta?.showAmount ?? false,
    chamber: data.chamber,
    gridPosition: { x: data.gridPosition.x, y: data.gridPosition.y },
    gridRotated: data.gridRotated,
    slot: data.slot,
    nested: data.nested,
    armorRating: armorPlate?.armorRating ?? catalogItem?.armorRating ?? '',
    carrier: catalogItem?.carrier ?? false,
    armorPlatePath
  }
}

export const items = computed<SlotItem[]>(() =>
  character.value ? character.value.inventory.map(slotItemDataToSlotItem) : []
)

export const equipment = computed<SlotItem[]>(() =>
  character.value ? character.value.equipment.map(slotItemDataToSlotItem) : []
)

export const catalogItems = computed<SlotItem[]>(() =>
  character.value ? character.value.catalog.map(slotItemDataToSlotItem) : []
)

// ---------- Shared helpers ----------

export function markDirty(): void {
  isDirty.value = true
  if (character.value) character.value = { ...character.value }
}

export function markWorldDirty(): void {
  isDirty.value = true
  if (world.value) world.value = { ...world.value }
}

export function markTradersDirty(): void {
  isDirty.value = true
  if (traders.value) traders.value = { ...traders.value }
}

export function findAndRemove(id: string): SlotItemData | null {
  const c = character.value
  if (!c) return null
  for (const target of ['inventory', 'equipment', 'catalog'] as const) {
    const arr = c[target]
    const idx = arr.findIndex((i) => i.id === id)
    if (idx >= 0) {
      const [removed] = arr.splice(idx, 1)
      return removed
    }
  }
  return null
}

export function findItemInAnyArray(id: string): SlotItemData | undefined {
  const c = character.value
  if (!c) return undefined
  return (
    c.inventory.find((i) => i.id === id) ??
    c.equipment.find((i) => i.id === id) ??
    c.catalog.find((i) => i.id === id)
  )
}

export function freshSlotItem(
  resourcePath: string,
  opts: {
    condition?: number
    amount?: number
    gridCol?: number
    gridRow?: number
    gridRotated?: boolean
    nestedPaths?: string[]
    slot?: string
  }
): SlotItemData {
  const meta = ITEMS_META.get(resourcePath)
  return {
    id: tresFile.value
      ? newSubResourceId(tresFile.value)
      : 'Resource_' + Math.random().toString(36).slice(2, 7),
    script: 'res://Scripts/SlotData.gd',
    itemData: resourcePath,
    nested: opts.nestedPaths ?? [],
    storage: [],
    condition: opts.condition ?? meta?.defaultCondition ?? 0,
    amount: opts.amount ?? meta?.defaultAmount ?? 0,
    position: 0,
    mode: 1,
    zoom: 1,
    chamber: false,
    casing: false,
    state: '',
    gridPosition: { x: (opts.gridCol ?? 0) * 64, y: (opts.gridRow ?? 0) * 64 },
    gridRotated: opts.gridRotated ?? false,
    slot: opts.slot ?? ''
  }
}
