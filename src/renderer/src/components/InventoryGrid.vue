<script setup lang="ts">
import { ref, computed, inject, onMounted, onUnmounted, watch } from 'vue'
import {
  useInventoryGrid,
  GRID_COLS,
  GRID_ROWS,
  CATALOG_COLS,
  CATALOG_ROWS,
  CELL_SIZE,
  CATALOG_CELL_SIZE
} from '../composables/useInventoryGrid'
import { useDragDrop } from '../composables/useDragDrop'
import { useSaveEditor } from '../composables/useSaveEditor'
import { useToast } from '../composables/useToast'
import { WEAPON_ATTACHMENT_LAYOUTS } from '../data/weapon-attachments'
import { ATTACHMENT_SUBTYPE } from '../data/attachment-subtypes'
import { ITEMS_BY_PATH, getItemSize } from '../data/items'
import InventoryGridItem from './InventoryGridItem.vue'
import ItemContextMenu from './ItemContextMenu.vue'
import type { AttachmentRemoveOption, GridItemPlacement, SlotItem } from '../lib/types'

const props = withDefaults(
  defineProps<{
    mode?: 'inventory' | 'catalog'
  }>(),
  { mode: 'inventory' }
)

const {
  updateItemGridPosition,
  removeItem,
  addItem,
  addCatalogItem,
  setRigArmorPlate,
  removeWeaponAttachment,
  items: inventoryItems,
  catalogItems
} = useSaveEditor()
const toast = useToast()

const sourceItems = props.mode === 'catalog' ? catalogItems : inventoryItems
const gridCols = props.mode === 'catalog' ? CATALOG_COLS : GRID_COLS
const gridRows = props.mode === 'catalog' ? CATALOG_ROWS : GRID_ROWS
const cellSize = props.mode === 'catalog' ? CATALOG_CELL_SIZE : CELL_SIZE
const addFn = props.mode === 'catalog' ? addCatalogItem : addItem

const containerRef = ref<HTMLElement | null>(null)
const gridInstance = useInventoryGrid({
  items: sourceItems,
  cols: gridCols,
  rows: gridRows,
  cellSize
})
const { gridPlacements, canPlace, findFreeSlot, getConflicts } = gridInstance
const {
  dragState,
  startDragFromGrid,
  setGridContainer,
  enterGrid,
  leaveGrid,
  enterPlateTarget,
  leavePlateTarget,
  enterAttachmentTarget,
  leaveAttachmentTarget,
  onKeyDown,
  cancelDrag
} = useDragDrop()
const openWorkbench = inject<(weapon: SlotItem) => void>('openWorkbench')
const openRigArmorWorkbench = inject<(rig: SlotItem) => void>('openRigArmorWorkbench')

const contextMenu = ref<{ placement: GridItemPlacement; x: number; y: number } | null>(null)

const showEditLoadout = computed(() => {
  if (!contextMenu.value) return false
  const p = contextMenu.value.placement
  return (p.category === 'Weapons' && WEAPON_ATTACHMENT_LAYOUTS.has(p.itemPath)) || p.carrier
})

const editLoadoutLabel = computed(() => {
  if (!contextMenu.value) return 'Edit Loadout'
  return contextMenu.value.placement.carrier ? 'Edit Armor' : 'Edit Loadout'
})

const removePlateLabel = computed(() => {
  const platePath = contextMenu.value?.placement.armorPlatePath
  if (!platePath) return ''
  const plate = ITEMS_BY_PATH.get(platePath)
  return `Remove ${plate?.armorRating ? `${plate.armorRating} plate` : (plate?.displayName ?? 'plate')}`
})

const removeAttachmentOptions = computed<AttachmentRemoveOption[]>(() => {
  if (!contextMenu.value || props.mode !== 'inventory') return []
  const placement = contextMenu.value.placement
  if (placement.category !== 'Weapons') return []

  return placement.nested
    .filter((path) => ATTACHMENT_SUBTYPE.has(path))
    .map((path) => ({
      path,
      label: `Remove ${ITEMS_BY_PATH.get(path)?.displayName ?? path.split('/').pop()?.replace('.tres', '') ?? 'attachment'}`
    }))
})

const canDuplicate = computed(() => {
  if (!contextMenu.value) return false
  return contextMenu.value.placement.itemPath !== ''
})

function handleEditLoadout() {
  if (!contextMenu.value) return
  const item = sourceItems.value.find(
    (i) => i.subResourceId === contextMenu.value!.placement.subResourceId
  )
  if (item?.carrier) {
    openRigArmorWorkbench?.(item)
  } else if (item) {
    openWorkbench?.(item)
  }
  contextMenu.value = null
}

function onItemContextMenu(placement: GridItemPlacement, event: MouseEvent) {
  contextMenu.value = { placement, x: event.clientX, y: event.clientY }
}

function handleDuplicate() {
  if (!contextMenu.value) return
  const p = contextMenu.value.placement
  if (p.itemPath === '') return
  const original = sourceItems.value.find((i) => i.subResourceId === p.subResourceId)
  if (!original) return
  const catalogItem = ITEMS_BY_PATH.get(original.itemPath)
  const size = catalogItem ? getItemSize(catalogItem) : { w: p.w, h: p.h }
  const slot = findFreeSlot(size.w, size.h)
  if (!slot) return
  addFn(original.itemPath, {
    condition: original.condition,
    amount: original.amount,
    gridCol: slot.col,
    gridRow: slot.row,
    gridRotated: slot.rotated,
    nestedPaths: original.nested
  })
  contextMenu.value = null
}

function handleRemovePlate() {
  if (!contextMenu.value) return
  const rig = sourceItems.value.find(
    (i) => i.subResourceId === contextMenu.value!.placement.subResourceId
  )
  if (!rig?.armorPlatePath) return

  const plate = ITEMS_BY_PATH.get(rig.armorPlatePath)
  const size = plate ? getItemSize(plate) : { w: 1, h: 1 }
  const slot = findFreeSlot(size.w, size.h)
  if (!slot) {
    toast.show('No inventory space for removed armor plate')
    contextMenu.value = null
    return
  }

  addItem(rig.armorPlatePath, {
    condition: rig.condition,
    gridCol: slot.col,
    gridRow: slot.row,
    gridRotated: slot.rotated
  })
  setRigArmorPlate(rig.subResourceId, null)
  contextMenu.value = null
}

function handleRemoveAttachment(path: string) {
  if (!contextMenu.value) return
  const weapon = sourceItems.value.find(
    (i) => i.subResourceId === contextMenu.value!.placement.subResourceId
  )
  if (!weapon) return

  const attachment = ITEMS_BY_PATH.get(path)
  const size = attachment ? getItemSize(attachment) : { w: 1, h: 1 }
  const slot = findFreeSlot(size.w, size.h)
  if (!slot) {
    toast.show('No inventory space for removed attachment')
    contextMenu.value = null
    return
  }

  if (!removeWeaponAttachment(weapon.subResourceId, path, slot)) {
    toast.show('Failed to remove attachment')
  }
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
  setGridContainer(containerRef.value, gridInstance)
  startDragFromGrid(placement, event, props.mode)
}

function handleGridEnter(event: PointerEvent): void {
  if (dragState.value) {
    dragState.value.clientX = event.clientX
    dragState.value.clientY = event.clientY
    setGridContainer(containerRef.value, gridInstance)
    enterGrid(canPlace)
  }
}

function handleGridLeave(): void {
  leaveGrid()
}

function handleItemPointerEnter(placement: GridItemPlacement): void {
  if (!dragState.value) return
  const draggedPath = dragState.value.source.item.itemPath
  if (ITEMS_BY_PATH.get(draggedPath)?.plate && placement.carrier) {
    enterPlateTarget(placement)
    return
  }
  if (
    props.mode === 'inventory' &&
    ATTACHMENT_SUBTYPE.has(draggedPath) &&
    placement.category === 'Weapons'
  ) {
    enterAttachmentTarget(placement)
  }
}

function handleItemPointerLeave(placement: GridItemPlacement): void {
  leavePlateTarget(placement.subResourceId)
  leaveAttachmentTarget(placement.subResourceId)
}

function handleKeyDown(event: KeyboardEvent): void {
  onKeyDown(event)
}

onMounted(() => {
  setGridContainer(containerRef.value, gridInstance)
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
        setGridContainer(containerRef.value, gridInstance)
        enterGrid(canPlace)
      }
    }
  }
)

const gridWidth = gridCols * cellSize
const gridHeight = gridRows * cellSize

// Build cell classes for drag highlighting
function cellHighlight(col: number, row: number): string {
  if (dragState.value?.plateHover || dragState.value?.attachmentHover) return ''
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
  for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col < gridCols; col++) {
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
      class="relative border border-border rounded bg-muted/20 shrink-0"
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
          left: `${cell.col * cellSize}px`,
          top: `${cell.row * cellSize}px`,
          width: `${cellSize}px`,
          height: `${cellSize}px`
        }"
      />

      <!-- Items -->
      <InventoryGridItem
        v-for="p in gridPlacements"
        :key="p.subResourceId"
        :placement="p"
        :cell-size="cellSize"
        :dimmed="dragState?.source.item.subResourceId === p.subResourceId"
        :class="{
          'ring-1 ring-amber-500/60': conflictIds.has(p.subResourceId),
          'ring-2 ring-green-500':
            (dragState?.plateHover?.targetSubResourceId === p.subResourceId &&
              dragState.plateHover.isValid) ||
            (dragState?.attachmentHover?.targetSubResourceId === p.subResourceId &&
              dragState.attachmentHover.isValid),
          'ring-2 ring-red-500':
            (dragState?.plateHover?.targetSubResourceId === p.subResourceId &&
              !dragState.plateHover.isValid) ||
            (dragState?.attachmentHover?.targetSubResourceId === p.subResourceId &&
              !dragState.attachmentHover.isValid)
        }"
        @dragstart="onItemDragStart"
        @pointerenter="handleItemPointerEnter"
        @pointerleave="handleItemPointerLeave"
        @contextmenu="onItemContextMenu"
      />
    </div>

    <ItemContextMenu
      v-if="contextMenu"
      :x="contextMenu.x"
      :y="contextMenu.y"
      :show-edit-loadout="showEditLoadout"
      :edit-loadout-label="editLoadoutLabel"
      :remove-plate-label="removePlateLabel"
      :remove-attachment-options="removeAttachmentOptions"
      :can-duplicate="canDuplicate"
      @edit-loadout="handleEditLoadout"
      @remove-plate="handleRemovePlate"
      @remove-attachment="handleRemoveAttachment"
      @duplicate="handleDuplicate"
      @delete="handleDelete"
      @close="contextMenu = null"
    />
  </div>
</template>
