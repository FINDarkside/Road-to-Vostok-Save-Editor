import { ITEMS } from './items'
import type { GameItem } from '../lib/types'

/** Map from equipment slot name to the items that can be placed in it, sorted by displayName */
export const ITEMS_BY_SLOT = new Map<string, GameItem[]>()

for (const item of ITEMS) {
  if (!item.slots) continue
  for (const slot of item.slots) {
    let list = ITEMS_BY_SLOT.get(slot)
    if (!list) {
      list = []
      ITEMS_BY_SLOT.set(slot, list)
    }
    list.push(item)
  }
}

for (const list of ITEMS_BY_SLOT.values()) {
  list.sort((a, b) => a.displayName.localeCompare(b.displayName))
}
