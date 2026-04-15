import { computed, type Ref } from 'vue'
import { useSaveEditor } from './useSaveEditor'
import { ITEMS_BY_PATH, getItemSize } from '../data/items'
import type { GridItemPlacement, SlotItem } from '../lib/types'

export const GRID_COLS = 8
export const GRID_ROWS = 13
export const CATALOG_COLS = 24
export const CATALOG_ROWS = 39
export const GAME_CELL_SIZE = 64
/** UI cell size in pixels for the inventory grid */
export const CELL_SIZE = 56
/** UI cell size in pixels for the catalog grid (smaller because furniture is large) */
export const CATALOG_CELL_SIZE = 32

export interface UseInventoryGridOptions {
  items?: Ref<SlotItem[]>
  cols?: number
  rows?: number
  cellSize?: number
}

export function useInventoryGrid(opts: UseInventoryGridOptions = {}) {
  const { items: defaultItems } = useSaveEditor()
  const sourceItems = opts.items ?? defaultItems
  const cols = opts.cols ?? GRID_COLS
  const rows = opts.rows ?? GRID_ROWS
  const cellSize = opts.cellSize ?? CELL_SIZE

  const gridPlacements = computed<GridItemPlacement[]>(() => {
    return sourceItems.value.map((item) => {
      const catalogItem = ITEMS_BY_PATH.get(item.itemPath)
      const baseSize = catalogItem ? getItemSize(catalogItem) : { w: 1, h: 1 }
      const w = item.gridRotated ? baseSize.h : baseSize.w
      const h = item.gridRotated ? baseSize.w : baseSize.h

      return {
        subResourceId: item.subResourceId,
        itemPath: item.itemPath,
        iconFile: catalogItem?.iconFile ?? '',
        itemName: item.itemName,
        nameInventory: item.nameInventory,
        nameRotated: item.nameRotated,
        nameEquipment: item.nameEquipment,
        category: item.category,
        condition: item.condition,
        showCondition: item.showCondition,
        amount: item.amount,
        showAmount: item.showAmount,
        chamber: item.chamber,
        col: Math.round(item.gridPosition.x / GAME_CELL_SIZE),
        row: Math.round(item.gridPosition.y / GAME_CELL_SIZE),
        w,
        h,
        rotated: item.gridRotated,
        nested: item.nested,
        armorRating: item.armorRating,
        carrier: item.carrier,
        armorPlatePath: item.armorPlatePath
      }
    })
  })

  const occupancyMap = computed<Map<string, string>>(() => {
    const map = new Map<string, string>()
    for (const p of gridPlacements.value) {
      for (let r = p.row; r < p.row + p.h; r++) {
        for (let c = p.col; c < p.col + p.w; c++) {
          map.set(`${c},${r}`, p.subResourceId)
        }
      }
    }
    return map
  })

  function canPlace(col: number, row: number, w: number, h: number, excludeId?: string): boolean {
    if (col < 0 || row < 0 || col + w > cols || row + h > rows) return false
    for (let r = row; r < row + h; r++) {
      for (let c = col; c < col + w; c++) {
        const occupant = occupancyMap.value.get(`${c},${r}`)
        if (occupant && occupant !== excludeId) return false
      }
    }
    return true
  }

  function findFreeSlot(
    w: number,
    h: number,
    excludeId?: string
  ): { col: number; row: number; rotated: boolean } | null {
    // Try normal orientation
    for (let row = 0; row <= rows - h; row++) {
      for (let col = 0; col <= cols - w; col++) {
        if (canPlace(col, row, w, h, excludeId)) return { col, row, rotated: false }
      }
    }
    // Try rotated orientation (only if dimensions differ)
    if (w !== h) {
      for (let row = 0; row <= rows - w; row++) {
        for (let col = 0; col <= cols - h; col++) {
          if (canPlace(col, row, h, w, excludeId)) return { col, row, rotated: true }
        }
      }
    }
    return null
  }

  function getConflicts(): GridItemPlacement[] {
    const conflicts = new Set<string>()
    const cellOwner = new Map<string, string>()

    for (const p of gridPlacements.value) {
      // Out of bounds check
      if (p.col < 0 || p.row < 0 || p.col + p.w > cols || p.row + p.h > rows) {
        conflicts.add(p.subResourceId)
        continue
      }
      // Overlap check
      for (let r = p.row; r < p.row + p.h; r++) {
        for (let c = p.col; c < p.col + p.w; c++) {
          const key = `${c},${r}`
          const existing = cellOwner.get(key)
          if (existing) {
            conflicts.add(p.subResourceId)
            conflicts.add(existing)
          } else {
            cellOwner.set(key, p.subResourceId)
          }
        }
      }
    }

    return gridPlacements.value.filter((p) => conflicts.has(p.subResourceId))
  }

  return {
    cols,
    rows,
    cellSize,
    gridPlacements,
    occupancyMap,
    canPlace,
    findFreeSlot,
    getConflicts
  }
}
