import { computed } from 'vue'
import { useSaveEditor } from './useSaveEditor'
import { ITEMS_BY_PATH, getItemSize } from '../data/items'
import type { GridItemPlacement } from '../lib/types'

export const GRID_COLS = 8
export const GRID_ROWS = 13
export const GAME_CELL_SIZE = 64

export function useInventoryGrid() {
  const { items } = useSaveEditor()

  const gridPlacements = computed<GridItemPlacement[]>(() => {
    return items.value.map((item) => {
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
        amount: item.amount,
        col: Math.round(item.gridPosition.x / GAME_CELL_SIZE),
        row: Math.round(item.gridPosition.y / GAME_CELL_SIZE),
        w,
        h,
        rotated: item.gridRotated,
        nested: item.nested
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
    if (col < 0 || row < 0 || col + w > GRID_COLS || row + h > GRID_ROWS) return false
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
    for (let row = 0; row <= GRID_ROWS - h; row++) {
      for (let col = 0; col <= GRID_COLS - w; col++) {
        if (canPlace(col, row, w, h, excludeId)) return { col, row, rotated: false }
      }
    }
    // Try rotated orientation (only if dimensions differ)
    if (w !== h) {
      for (let row = 0; row <= GRID_ROWS - w; row++) {
        for (let col = 0; col <= GRID_COLS - h; col++) {
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
      if (p.col < 0 || p.row < 0 || p.col + p.w > GRID_COLS || p.row + p.h > GRID_ROWS) {
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
    gridPlacements,
    occupancyMap,
    canPlace,
    findFreeSlot,
    getConflicts
  }
}
