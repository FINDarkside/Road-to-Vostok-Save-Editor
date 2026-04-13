import { ref } from 'vue'
import type {
  GridItemPlacement,
  GridSnapState,
  DragDropState,
  DragSource,
  SlotItem
} from '../lib/types'
import { ITEMS_BY_PATH, getItemSize } from '../data/items'
import { CELL_SIZE, useInventoryGrid } from './useInventoryGrid'
import { useSaveEditor } from './useSaveEditor'

type ActiveGrid = ReturnType<typeof useInventoryGrid>

const dragState = ref<DragDropState | null>(null)

// Module-level references set by InventoryGrid

let gridContainer: HTMLElement | null = null

let activeGrid: ActiveGrid | null = null
let canPlaceFn:
  | ((col: number, row: number, w: number, h: number, excludeId?: string) => boolean)
  | null = null

function getActiveCellSize(): number {
  return activeGrid?.cellSize ?? CELL_SIZE
}

function buildPlacementFromSlotItem(item: SlotItem): GridItemPlacement {
  const catalogItem = ITEMS_BY_PATH.get(item.itemPath)
  const baseSize = catalogItem ? getItemSize(catalogItem) : { w: 1, h: 1 }
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
    col: 0,
    row: 0,
    w: baseSize.w,
    h: baseSize.h,
    rotated: false,
    nested: item.nested
  }
}

function snapToGrid(ds: DragDropState) {
  if (!gridContainer || !ds.gridSnap) return

  const rect = gridContainer.getBoundingClientRect()
  const relX = ds.clientX - rect.left
  const relY = ds.clientY - rect.top

  const snap = ds.gridSnap
  const cellSize = getActiveCellSize()
  const col = Math.round((relX - (snap.w * cellSize) / 2) / cellSize)
  const row = Math.round((relY - (snap.h * cellSize) / 2) / cellSize)
  const cols = activeGrid?.cols ?? 8
  const rows = activeGrid?.rows ?? 13
  snap.col = Math.max(0, Math.min(cols - snap.w, col))
  snap.row = Math.max(0, Math.min(rows - snap.h, row))
}

function findSwapTarget(snap: GridSnapState, source: DragSource): GridItemPlacement | null {
  if (!activeGrid) return null
  const { occupancyMap, gridPlacements, cols, rows } = activeGrid
  const excludeId = source.origin === 'grid' ? source.item.subResourceId : undefined

  const occupantIds = new Set<string>()
  for (let r = snap.row; r < snap.row + snap.h; r++) {
    for (let c = snap.col; c < snap.col + snap.w; c++) {
      const occ = occupancyMap.value.get(`${c},${r}`)
      if (occ && occ !== excludeId) occupantIds.add(occ)
    }
  }

  if (occupantIds.size !== 1) return null

  const occupantId = [...occupantIds][0]
  const occupant = gridPlacements.value.find((p) => p.subResourceId === occupantId)
  if (!occupant || occupant.w !== snap.w || occupant.h !== snap.h) return null

  // For grid→grid, verify occupant fits at source position (exclude both moving items)
  if (source.origin === 'grid') {
    const src = source.item
    const bothExclude = new Set([src.subResourceId, occupantId])
    for (let r = src.row; r < src.row + occupant.h; r++) {
      for (let c = src.col; c < src.col + occupant.w; c++) {
        if (c < 0 || r < 0 || c >= cols || r >= rows) return null
        const occ = occupancyMap.value.get(`${c},${r}`)
        if (occ && !bothExclude.has(occ)) return null
      }
    }
  }

  return occupant
}

function updateGridValidity() {
  if (!dragState.value?.gridSnap || !canPlaceFn) return
  const snap = dragState.value.gridSnap
  const excludeId =
    dragState.value.source.origin === 'grid' ? dragState.value.source.item.subResourceId : undefined
  snap.isValid =
    canPlaceFn(snap.col, snap.row, snap.w, snap.h, excludeId) ||
    !!findSwapTarget(snap, dragState.value.source)
}

function onDocumentPointerMove(event: PointerEvent) {
  if (!dragState.value) return
  dragState.value.clientX = event.clientX
  dragState.value.clientY = event.clientY

  if (dragState.value.gridSnap) {
    snapToGrid(dragState.value)
    updateGridValidity()
  }
}

function onDocumentPointerUp() {
  if (!dragState.value) return

  const ds = dragState.value
  const { updateItemGridPosition, moveToInventory, moveToEquipment, equipment, removeItem } =
    useSaveEditor()

  if (ds.deleteHover) {
    removeItem(ds.source.item.subResourceId)
    cleanup()
    return
  }

  if (ds.gridSnap?.isValid) {
    const snap = ds.gridSnap
    if (!activeGrid) {
      cleanup()
      return
    }
    const { canPlace } = activeGrid
    const excludeId = ds.source.origin === 'grid' ? ds.source.item.subResourceId : undefined

    if (canPlace(snap.col, snap.row, snap.w, snap.h, excludeId)) {
      // Direct placement on empty cells
      if (ds.source.origin === 'grid') {
        updateItemGridPosition(ds.source.item.subResourceId, snap.col, snap.row, snap.rotated)
      } else {
        moveToInventory(ds.source.item.subResourceId, snap.col, snap.row, snap.rotated)
      }
    } else {
      // Same-size swap
      const occupant = findSwapTarget(snap, ds.source)
      if (occupant) {
        if (ds.source.origin === 'grid') {
          const src = ds.source.item
          updateItemGridPosition(occupant.subResourceId, src.col, src.row, occupant.rotated)
          updateItemGridPosition(src.subResourceId, occupant.col, occupant.row, snap.rotated)
        } else if (ds.source.origin === 'equipment') {
          moveToEquipment(occupant.subResourceId, ds.source.equipmentSlot!)
          moveToInventory(ds.source.item.subResourceId, occupant.col, occupant.row, snap.rotated)
        }
      }
    }
  } else if (ds.equipmentHover) {
    const slotName = ds.equipmentHover.slotName
    if (ds.source.origin === 'grid') {
      // Grid to equipment — handle swap if slot is occupied
      const occupant = equipment.value.find((e) => e.slot === slotName)
      if (occupant) {
        if (!activeGrid) {
          cleanup()
          return
        }
        const { canPlace, findFreeSlot } = activeGrid
        const occupantCatalog = ITEMS_BY_PATH.get(occupant.itemPath)
        const occupantSize = occupantCatalog ? getItemSize(occupantCatalog) : { w: 1, h: 1 }
        const src = ds.source.item

        // Try to place displaced item at the source item's original position
        if (canPlace(src.col, src.row, occupantSize.w, occupantSize.h, src.subResourceId)) {
          moveToInventory(occupant.subResourceId, src.col, src.row, false)
        } else if (
          occupantSize.w !== occupantSize.h &&
          canPlace(src.col, src.row, occupantSize.h, occupantSize.w, src.subResourceId)
        ) {
          moveToInventory(occupant.subResourceId, src.col, src.row, true)
        } else {
          // Fall back to first free slot
          const freeSlot = findFreeSlot(occupantSize.w, occupantSize.h, src.subResourceId)
          if (!freeSlot) {
            cleanup()
            return
          }
          moveToInventory(occupant.subResourceId, freeSlot.col, freeSlot.row, freeSlot.rotated)
        }
      }
      moveToEquipment(ds.source.item.subResourceId, slotName)
    } else {
      // Equipment to equipment
      const occupant = equipment.value.find((e) => e.slot === slotName)
      if (occupant && occupant.subResourceId !== ds.source.item.subResourceId) {
        swapEquipmentSlots(
          ds.source.item.subResourceId,
          ds.source.equipmentSlot!,
          occupant.subResourceId,
          slotName
        )
      } else if (!occupant) {
        changeEquipmentSlot(ds.source.item.subResourceId, slotName)
      }
    }
  }

  cleanup()
}

function swapEquipmentSlots(id1: string, slot1: string, id2: string, slot2: string) {
  const { tresFile, isDirty } = useSaveEditor()
  if (!tresFile.value) return
  const tres = tresFile.value

  const sub1 = tres.subResources.find((s) => s.id === id1)
  const sub2 = tres.subResources.find((s) => s.id === id2)
  if (!sub1 || !sub2) return

  const slotProp1 = sub1.properties.find((p) => p.key === 'slot')
  const slotProp2 = sub2.properties.find((p) => p.key === 'slot')
  if (slotProp1) slotProp1.value = { kind: 'string', value: slot2 }
  if (slotProp2) slotProp2.value = { kind: 'string', value: slot1 }

  isDirty.value = true
  tresFile.value = { ...tres }
}

function changeEquipmentSlot(subResourceId: string, slotName: string) {
  const { tresFile, isDirty } = useSaveEditor()
  if (!tresFile.value) return
  const tres = tresFile.value

  const sub = tres.subResources.find((s) => s.id === subResourceId)
  if (!sub) return

  const slotProp = sub.properties.find((p) => p.key === 'slot')
  if (slotProp) slotProp.value = { kind: 'string', value: slotName }

  isDirty.value = true
  tresFile.value = { ...tres }
}

function cleanup() {
  dragState.value = null
  canPlaceFn = null
  document.removeEventListener('pointermove', onDocumentPointerMove)
  document.removeEventListener('pointerup', onDocumentPointerUp)
}

export function useDragDrop() {
  function startDragFromGrid(placement: GridItemPlacement, event: PointerEvent) {
    event.preventDefault()
    const cellSize = getActiveCellSize()

    dragState.value = {
      source: { origin: 'grid', item: placement },
      clientX: event.clientX,
      clientY: event.clientY,
      gridSnap: null,
      equipmentHover: null,
      deleteHover: false,
      ghostW: placement.w,
      ghostH: placement.h,
      ghostRotated: placement.rotated,
      ghostCellSize: cellSize,
      offsetX: (placement.w * cellSize) / 2,
      offsetY: (placement.h * cellSize) / 2
    }

    document.addEventListener('pointermove', onDocumentPointerMove)
    document.addEventListener('pointerup', onDocumentPointerUp)
  }

  function startDragFromEquipment(item: SlotItem, slotName: string, event: PointerEvent) {
    event.preventDefault()

    const placement = buildPlacementFromSlotItem(item)
    const cellSize = getActiveCellSize()

    dragState.value = {
      source: { origin: 'equipment', item: placement, equipmentSlot: slotName },
      clientX: event.clientX,
      clientY: event.clientY,
      gridSnap: null,
      equipmentHover: null,
      deleteHover: false,
      ghostW: placement.w,
      ghostH: placement.h,
      ghostRotated: placement.rotated,
      ghostCellSize: cellSize,
      offsetX: (placement.w * cellSize) / 2,
      offsetY: (placement.h * cellSize) / 2
    }

    document.addEventListener('pointermove', onDocumentPointerMove)
    document.addEventListener('pointerup', onDocumentPointerUp)
  }

  function setGridContainer(el: HTMLElement | null, grid: ActiveGrid | null = null) {
    gridContainer = el
    activeGrid = el ? grid : null
  }

  function enterGrid(
    canPlace: (col: number, row: number, w: number, h: number, excludeId?: string) => boolean
  ) {
    if (!dragState.value) return

    const cellSize = getActiveCellSize()
    canPlaceFn = canPlace
    // Use last known ghost dimensions (preserves R-key rotations across grid re-entry)
    dragState.value.gridSnap = {
      col: 0,
      row: 0,
      w: dragState.value.ghostW,
      h: dragState.value.ghostH,
      rotated: dragState.value.ghostRotated,
      isValid: false
    }

    dragState.value.ghostCellSize = cellSize
    dragState.value.offsetX = (dragState.value.ghostW * cellSize) / 2
    dragState.value.offsetY = (dragState.value.ghostH * cellSize) / 2

    snapToGrid(dragState.value)
    updateGridValidity()
  }

  function leaveGrid() {
    if (!dragState.value) return
    dragState.value.gridSnap = null
    canPlaceFn = null
  }

  function enterEquipmentSlot(slotName: string) {
    if (!dragState.value) return

    let isValid = true
    if (dragState.value.source.origin === 'grid') {
      const { equipment } = useSaveEditor()
      const occupant = equipment.value.find((e) => e.slot === slotName)
      if (occupant) {
        if (!activeGrid) return
        const { canPlace, findFreeSlot } = activeGrid
        const occupantCatalog = ITEMS_BY_PATH.get(occupant.itemPath)
        const occupantSize = occupantCatalog ? getItemSize(occupantCatalog) : { w: 1, h: 1 }
        const src = dragState.value.source.item
        isValid =
          canPlace(src.col, src.row, occupantSize.w, occupantSize.h, src.subResourceId) ||
          (occupantSize.w !== occupantSize.h &&
            canPlace(src.col, src.row, occupantSize.h, occupantSize.w, src.subResourceId)) ||
          !!findFreeSlot(occupantSize.w, occupantSize.h, src.subResourceId)
      }
    }

    dragState.value.equipmentHover = { slotName, isValid }
  }

  function leaveEquipmentSlot(slotName: string) {
    if (!dragState.value) return
    if (dragState.value.equipmentHover?.slotName === slotName) {
      dragState.value.equipmentHover = null
    }
  }

  function onKeyDown(event: KeyboardEvent) {
    if (!dragState.value) return
    if (event.key !== 'r' && event.key !== 'R') return
    if (!dragState.value.gridSnap) return

    event.preventDefault()
    const snap = dragState.value.gridSnap
    const src = dragState.value.source.item

    const baseW = src.rotated ? src.h : src.w
    const baseH = src.rotated ? src.w : src.h

    snap.rotated = !snap.rotated
    snap.w = snap.rotated ? baseH : baseW
    snap.h = snap.rotated ? baseW : baseH

    // Sync ghost state so rotation persists when leaving grid
    dragState.value.ghostW = snap.w
    dragState.value.ghostH = snap.h
    dragState.value.ghostRotated = snap.rotated

    const cellSize = getActiveCellSize()
    dragState.value.ghostCellSize = cellSize
    dragState.value.offsetX = (snap.w * cellSize) / 2
    dragState.value.offsetY = (snap.h * cellSize) / 2

    snapToGrid(dragState.value)
    updateGridValidity()
  }

  function enterDeleteZone() {
    if (!dragState.value) return
    dragState.value.deleteHover = true
  }

  function leaveDeleteZone() {
    if (!dragState.value) return
    dragState.value.deleteHover = false
  }

  function cancelDrag() {
    cleanup()
  }

  return {
    dragState,
    startDragFromGrid,
    startDragFromEquipment,
    setGridContainer,
    enterGrid,
    leaveGrid,
    enterEquipmentSlot,
    leaveEquipmentSlot,
    enterDeleteZone,
    leaveDeleteZone,
    onKeyDown,
    cancelDrag
  }
}
