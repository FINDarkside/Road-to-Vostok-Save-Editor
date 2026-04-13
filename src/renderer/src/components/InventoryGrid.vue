<script setup lang="ts">
import { ref, computed, inject, onMounted, onUnmounted, watch } from 'vue'
import { useInventoryGrid, GRID_COLS, GRID_ROWS, CELL_SIZE } from '../composables/useInventoryGrid'
import { useDragDrop } from '../composables/useDragDrop'
import { useSaveEditor } from '../composables/useSaveEditor'
import { WEAPON_ATTACHMENT_LAYOUTS } from '../data/weapon-attachments'
import { ITEMS_BY_PATH, getItemSize } from '../data/items'
import InventoryGridItem from './InventoryGridItem.vue'
import ItemContextMenu from './ItemContextMenu.vue'
import type { GridItemPlacement, SlotItem } from '../lib/types'

const containerRef = ref<HTMLElement | null>(null)
const { gridPlacements, canPlace, findFreeSlot, getConflicts } = useInventoryGrid()
const {
  dragState,
  startDragFromGrid,
  setGridContainer,
  enterGrid,
  leaveGrid,
  onKeyDown,
  cancelDrag
} = useDragDrop()
const { updateItemGridPosition, removeItem, addItem, items: allItems } = useSaveEditor()
const openWorkbench = inject<(weapon: SlotItem) => void>('openWorkbench')

const contextMenu = ref<{ placement: GridItemPlacement; x: number; y: number } | null>(null)

const showEditLoadout = computed(() => {
  if (!contextMenu.value) return false
  const p = contextMenu.value.placement
  return p.category === 'Weapons' && WEAPON_ATTACHMENT_LAYOUTS.has(p.itemPath)
})

const canDuplicate = computed(() => {
  if (!contextMenu.value) return false
  return contextMenu.value.placement.itemPath !== ''
})

function handleEditLoadout() {
  if (!contextMenu.value) return
  const item = allItems.value.find(
    (i) => i.subResourceId === contextMenu.value!.placement.subResourceId
  )
  if (item) openWorkbench?.(item)
  contextMenu.value = null
}

function onItemContextMenu(placement: GridItemPlacement, event: MouseEvent) {
  contextMenu.value = { placement, x: event.clientX, y: event.clientY }
}

function handleDuplicate() {
  if (!contextMenu.value) return
  const p = contextMenu.value.placement
  if (p.itemPath === '') return
  const original = allItems.value.find((i) => i.subResourceId === p.subResourceId)
  if (!original) return
  const catalogItem = ITEMS_BY_PATH.get(original.itemPath)
  const size = catalogItem ? getItemSize(catalogItem) : { w: p.w, h: p.h }
  const slot = findFreeSlot(size.w, size.h)
  if (!slot) return
  addItem(original.itemPath, {
    condition: original.condition,
    amount: original.amount,
    gridCol: slot.col,
    gridRow: slot.row,
    gridRotated: slot.rotated
  })
  contextMenu.value = null
}

function handleDelete() {
  if (!contextMenu.value) return
  removeItem(contextMenu.value.placement.subResourceId)
  contextMenu.value = null
}

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
  startDragFromGrid(placement, event)
}

function handleGridEnter(): void {
  if (dragState.value) {
    enterGrid(canPlace)
  }
}

function handleGridLeave(): void {
  leaveGrid()
}

function handleKeyDown(event: KeyboardEvent): void {
  onKeyDown(event)
}

onMounted(() => {
  setGridContainer(containerRef.value)
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  setGridContainer(null)
  window.removeEventListener('keydown', handleKeyDown)
})

// When a drag starts from equipment and the pointer is already over the grid,
// pointerenter won't fire. Watch for drag state changes to handle this.
watch(
  () => dragState.value,
  (ds) => {
    if (ds && !ds.gridSnap && containerRef.value) {
      const rect = containerRef.value.getBoundingClientRect()
      if (
        ds.clientX >= rect.left &&
        ds.clientX <= rect.right &&
        ds.clientY >= rect.top &&
        ds.clientY <= rect.bottom
      ) {
        enterGrid(canPlace)
      }
    }
  }
)

const gridWidth = GRID_COLS * CELL_SIZE
const gridHeight = GRID_ROWS * CELL_SIZE

// Build cell classes for drag highlighting
function cellHighlight(col: number, row: number): string {
  const snap = dragState.value?.gridSnap
  if (!snap) return ''
  if (col >= snap.col && col < snap.col + snap.w && row >= snap.row && row < snap.row + snap.h) {
    return snap.isValid ? 'bg-green-500/20' : 'bg-red-500/20'
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
      @pointerenter="handleGridEnter"
      @pointerleave="handleGridLeave"
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
        :dimmed="dragState?.source.item.subResourceId === p.subResourceId"
        :class="{ 'ring-1 ring-amber-500/60': conflictIds.has(p.subResourceId) }"
        @dragstart="onItemDragStart"
        @contextmenu="onItemContextMenu"
      />
    </div>

    <ItemContextMenu
      v-if="contextMenu"
      :x="contextMenu.x"
      :y="contextMenu.y"
      :show-edit-loadout="showEditLoadout"
      :can-duplicate="canDuplicate"
      @edit-loadout="handleEditLoadout"
      @duplicate="handleDuplicate"
      @delete="handleDelete"
      @close="contextMenu = null"
    />
  </div>
</template>
