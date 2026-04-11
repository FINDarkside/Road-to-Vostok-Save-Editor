<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useInventoryGrid, GRID_COLS, GRID_ROWS } from '../composables/useInventoryGrid'
import { useGridDragDrop } from '../composables/useGridDragDrop'
import { useSaveEditor } from '../composables/useSaveEditor'
import InventoryGridItem from './InventoryGridItem.vue'
import type { GridItemPlacement } from '../lib/types'

const CELL_SIZE = 48

const containerRef = ref<HTMLElement | null>(null)
const { gridPlacements, canPlace, findFreeSlot, getConflicts } = useInventoryGrid()
const { updateItemGridPosition } = useSaveEditor()

const { dragState, startDrag, onPointerMove, onPointerUp, onKeyDown, cancelDrag } = useGridDragDrop(
  CELL_SIZE,
  canPlace,
  (id, col, row, rotated) => {
    updateItemGridPosition(id, col, row, rotated)
  }
)

const conflicts = computed(() => getConflicts())
const conflictIds = computed(() => new Set(conflicts.value.map((c) => c.subResourceId)))

function autoFixConflicts(): void {
  for (const item of conflicts.value) {
    const slot = findFreeSlot(item.w, item.h, item.subResourceId)
    if (slot) {
      updateItemGridPosition(
        item.subResourceId,
        slot.col,
        slot.row,
        slot.rotated !== undefined ? (slot.rotated ? !item.rotated : item.rotated) : item.rotated
      )
    }
  }
}

function onItemDragStart(placement: GridItemPlacement, event: PointerEvent): void {
  if (!containerRef.value) return
  startDrag(placement, event, containerRef.value)
}

function handlePointerMove(event: PointerEvent): void {
  if (!containerRef.value) return
  onPointerMove(event, containerRef.value)
}

function handleKeyDown(event: KeyboardEvent): void {
  onKeyDown(event)
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

const gridWidth = GRID_COLS * CELL_SIZE
const gridHeight = GRID_ROWS * CELL_SIZE

// Build cell classes for drag highlighting
function cellHighlight(col: number, row: number): string {
  if (!dragState.value) return ''
  const ds = dragState.value
  if (col >= ds.col && col < ds.col + ds.w && row >= ds.row && row < ds.row + ds.h) {
    return ds.isValid ? 'bg-green-500/20' : 'bg-red-500/20'
  }
  return ''
}

// Generate grid cells array
const gridCells = computed(() => {
  const cells: { col: number; row: number }[] = []
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      cells.push({ col, row })
    }
  }
  return cells
})

// Ghost placement for drag preview
const dragGhostPlacement = computed<GridItemPlacement | null>(() => {
  if (!dragState.value) return null
  const ds = dragState.value
  return {
    ...ds.item,
    col: ds.col,
    row: ds.row,
    w: ds.w,
    h: ds.h,
    rotated: ds.rotated
  }
})

defineExpose({ findFreeSlot })
</script>

<template>
  <div class="flex flex-col gap-2">
    <div
      v-if="conflicts.length > 0"
      class="flex items-center gap-2 text-xs text-amber-500 bg-amber-500/10 border border-amber-500/30 rounded px-2 py-1.5"
    >
      <span>{{ conflicts.length }} item(s) have overlapping or out-of-bounds positions.</span>
      <button class="underline hover:no-underline font-medium" @click="autoFixConflicts">
        Auto-fix
      </button>
    </div>

    <div
      ref="containerRef"
      class="relative border border-border rounded bg-muted/20"
      :style="{ width: `${gridWidth}px`, height: `${gridHeight}px` }"
      @pointermove="handlePointerMove"
      @pointerup="onPointerUp"
      @pointercancel="cancelDrag"
    >
      <!-- Grid cells -->
      <div
        v-for="cell in gridCells"
        :key="`${cell.col},${cell.row}`"
        class="absolute border border-border/20 transition-colors duration-75"
        :class="cellHighlight(cell.col, cell.row)"
        :style="{
          left: `${cell.col * CELL_SIZE}px`,
          top: `${cell.row * CELL_SIZE}px`,
          width: `${CELL_SIZE}px`,
          height: `${CELL_SIZE}px`
        }"
      />

      <!-- Items -->
      <InventoryGridItem
        v-for="p in gridPlacements"
        :key="p.subResourceId"
        :placement="p"
        :cell-size="CELL_SIZE"
        :dimmed="dragState?.item.subResourceId === p.subResourceId"
        :class="{ 'ring-1 ring-amber-500/60': conflictIds.has(p.subResourceId) }"
        @dragstart="onItemDragStart"
      />

      <!-- Drag ghost -->
      <InventoryGridItem
        v-if="dragState && dragGhostPlacement"
        :placement="dragGhostPlacement"
        :cell-size="CELL_SIZE"
        ghost
        :class="dragState.isValid ? 'ring-2 ring-green-500/60' : 'ring-2 ring-red-500/60'"
      />
    </div>
  </div>
</template>
