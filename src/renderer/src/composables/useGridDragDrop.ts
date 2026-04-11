import { ref } from 'vue'
import type { GridItemPlacement, DragState } from '../lib/types'
import { getItemSize } from '../data/itemSizes'
import { GRID_COLS, GRID_ROWS } from './useInventoryGrid'

export function useGridDragDrop(
  cellSize: number,
  canPlace: (col: number, row: number, w: number, h: number, excludeId?: string) => boolean,
  onDrop: (subResourceId: string, col: number, row: number, rotated: boolean) => void
) {
  const dragState = ref<DragState | null>(null)

  function snapToGrid(ds: DragState) {
    const col = Math.round((ds.pointerX - ds.offsetX) / cellSize)
    const row = Math.round((ds.pointerY - ds.offsetY) / cellSize)
    ds.col = Math.max(0, Math.min(GRID_COLS - ds.w, col))
    ds.row = Math.max(0, Math.min(GRID_ROWS - ds.h, row))
    ds.isValid = canPlace(ds.col, ds.row, ds.w, ds.h, ds.item.subResourceId)
  }

  function startDrag(
    placement: GridItemPlacement,
    event: PointerEvent,
    containerEl: HTMLElement
  ) {
    const rect = containerEl.getBoundingClientRect()
    const pointerX = event.clientX - rect.left
    const pointerY = event.clientY - rect.top

    dragState.value = {
      item: placement,
      col: placement.col,
      row: placement.row,
      rotated: placement.rotated,
      w: placement.w,
      h: placement.h,
      isValid: true,
      offsetX: pointerX - placement.col * cellSize,
      offsetY: pointerY - placement.row * cellSize,
      pointerX,
      pointerY
    }

    containerEl.setPointerCapture(event.pointerId)
  }

  function onPointerMove(event: PointerEvent, containerEl: HTMLElement) {
    if (!dragState.value) return

    const rect = containerEl.getBoundingClientRect()
    const ds = dragState.value
    ds.pointerX = event.clientX - rect.left
    ds.pointerY = event.clientY - rect.top
    snapToGrid(ds)
  }

  function onPointerUp() {
    if (!dragState.value) return

    const ds = dragState.value
    if (ds.isValid) {
      onDrop(ds.item.subResourceId, ds.col, ds.row, ds.rotated)
    }

    dragState.value = null
  }

  function onKeyDown(event: KeyboardEvent) {
    if (!dragState.value) return
    if (event.key !== 'r' && event.key !== 'R') return

    event.preventDefault()
    const ds = dragState.value
    const baseSize = getItemSize(ds.item.itemId)

    ds.rotated = !ds.rotated
    ds.w = ds.rotated ? baseSize.h : baseSize.w
    ds.h = ds.rotated ? baseSize.w : baseSize.h

    // Re-center grab point on the new dimensions
    ds.offsetX = (ds.w * cellSize) / 2
    ds.offsetY = (ds.h * cellSize) / 2

    // Recompute position from stored pointer location
    snapToGrid(ds)
  }

  function cancelDrag() {
    dragState.value = null
  }

  return {
    dragState,
    startDrag,
    onPointerMove,
    onPointerUp,
    onKeyDown,
    cancelDrag
  }
}
