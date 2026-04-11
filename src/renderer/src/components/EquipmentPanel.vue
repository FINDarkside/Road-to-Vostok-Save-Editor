<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSaveEditor } from '../composables/useSaveEditor'
import { useDragDrop } from '../composables/useDragDrop'
import { useInventoryGrid } from '../composables/useInventoryGrid'
import { ITEMS_BY_PATH } from '../data/items'
import CompositeIcon from './CompositeIcon.vue'
import ItemContextMenu from './ItemContextMenu.vue'
import type { SlotItem } from '../lib/types'

const CELL_SIZE = 48
const COLS = 6
const ROWS = 8

interface SlotDef {
  name: string
  label?: string
  col: number
  row: number
  w: number
  h: number
}

const slots: SlotDef[] = [
  { name: 'Primary', col: 0, row: 0, w: 6, h: 2 },
  { name: 'Secondary', col: 0, row: 2, w: 4, h: 2 },
  { name: 'Knife', col: 4, row: 2, w: 2, h: 1 },
  { name: 'Grenade_1', label: 'Grenade', col: 4, row: 3, w: 1, h: 1 },
  { name: 'Grenade_2', label: 'Grenade', col: 5, row: 3, w: 1, h: 1 },
  { name: 'Backpack', col: 0, row: 4, w: 2, h: 2 },
  { name: 'Rig', col: 2, row: 4, w: 2, h: 2 },
  { name: 'Helmet', col: 4, row: 4, w: 2, h: 2 },
  { name: 'Head', col: 0, row: 6, w: 1, h: 1 },
  { name: 'Torso', col: 1, row: 6, w: 1, h: 1 },
  { name: 'Legs', col: 2, row: 6, w: 1, h: 1 },
  { name: 'Belt', col: 3, row: 6, w: 1, h: 1 },
  { name: 'Feet', col: 4, row: 6, w: 1, h: 1 },
  { name: 'Hands', col: 5, row: 6, w: 1, h: 1 },
  { name: 'Matches', col: 0, row: 7, w: 1, h: 1 },
  { name: 'Light', col: 1, row: 7, w: 1, h: 1 },
  { name: 'NVG', col: 2, row: 7, w: 1, h: 1 },
  { name: 'Time', col: 3, row: 7, w: 1, h: 1 },
  { name: 'Map', col: 4, row: 7, w: 1, h: 1 },
  { name: 'Player', col: 5, row: 7, w: 1, h: 1 }
]

const { equipment, removeItem, addItem } = useSaveEditor()
const { dragState, startDragFromEquipment, enterEquipmentSlot, leaveEquipmentSlot } = useDragDrop()
const { findFreeSlot } = useInventoryGrid()

const contextMenu = ref<{ item: SlotItem; x: number; y: number } | null>(null)

function onSlotContextMenu(slot: SlotDef, event: MouseEvent) {
  const item = equipmentBySlot.value.get(slot.name)
  if (!item) return
  event.preventDefault()
  contextMenu.value = { item, x: event.clientX, y: event.clientY }
}

function handleDuplicate() {
  if (!contextMenu.value) return
  const item = contextMenu.value.item
  const catalogItem = ITEMS_BY_PATH.get(item.itemPath)
  const w = catalogItem?.sizeW ?? 1
  const h = catalogItem?.sizeH ?? 1
  const slot = findFreeSlot(w, h)
  if (!slot) return
  addItem(item.itemPath, {
    condition: item.condition,
    amount: item.amount,
    gridCol: slot.col,
    gridRow: slot.row,
    gridRotated: slot.rotated
  })
  contextMenu.value = null
}

function handleDelete() {
  if (!contextMenu.value) return
  removeItem(contextMenu.value.item.subResourceId)
  contextMenu.value = null
}

const equipmentBySlot = computed(() => {
  const map = new Map<string, SlotItem>()
  for (const item of equipment.value) {
    if (item.slot) map.set(item.slot, item)
  }
  return map
})

function getIconFile(item: SlotItem): string {
  return ITEMS_BY_PATH.get(item.itemPath)?.iconFile ?? ''
}

function onSlotPointerDown(slot: SlotDef, event: PointerEvent) {
  if (event.button !== 0) return
  const item = equipmentBySlot.value.get(slot.name)
  if (!item) return
  startDragFromEquipment(item, slot.name, event)
}

function onSlotPointerEnter(slot: SlotDef) {
  if (!dragState.value) return
  enterEquipmentSlot(slot.name)
}

function onSlotPointerLeave(slot: SlotDef) {
  leaveEquipmentSlot(slot.name)
}

function isSlotDragging(slot: SlotDef): boolean {
  if (!dragState.value) return false
  const item = equipmentBySlot.value.get(slot.name)
  return item?.subResourceId === dragState.value.source.item.subResourceId
}

function isSlotHovered(slot: SlotDef): boolean {
  if (!dragState.value) return false
  return (
    dragState.value.equipmentHover?.slotName === slot.name &&
    dragState.value.source.item.subResourceId !==
      equipmentBySlot.value.get(slot.name)?.subResourceId
  )
}

const gridWidth = COLS * CELL_SIZE
const gridHeight = ROWS * CELL_SIZE
</script>

<template>
  <div
    class="relative border border-border rounded bg-muted/20 shrink-0"
    :style="{ width: `${gridWidth}px`, height: `${gridHeight}px` }"
  >
    <!-- Equipment slots -->
    <div
      v-for="slot in slots"
      :key="slot.name"
      class="absolute z-10 border rounded-sm overflow-hidden transition-colors select-none"
      :class="[
        isSlotHovered(slot)
          ? dragState?.equipmentHover?.isValid
            ? 'border-green-500 bg-green-500/10'
            : 'border-red-500 bg-red-500/10'
          : equipmentBySlot.get(slot.name)
            ? 'border-border/60 bg-muted/40'
            : 'border-border/60 bg-background',
        isSlotDragging(slot) ? 'opacity-30' : '',
        equipmentBySlot.get(slot.name) ? 'cursor-grab' : ''
      ]"
      :style="{
        left: `${slot.col * CELL_SIZE}px`,
        top: `${slot.row * CELL_SIZE}px`,
        width: `${slot.w * CELL_SIZE}px`,
        height: `${slot.h * CELL_SIZE}px`
      }"
      @pointerdown="onSlotPointerDown(slot, $event)"
      @pointerenter="onSlotPointerEnter(slot)"
      @pointerleave="onSlotPointerLeave(slot)"
      @contextmenu="onSlotContextMenu(slot, $event)"
    >
      <div v-if="equipmentBySlot.get(slot.name)" class="relative w-full h-full">
        <CompositeIcon
          :icon-file="getIconFile(equipmentBySlot.get(slot.name)!)"
          :item-path="equipmentBySlot.get(slot.name)!.itemPath"
          :nested="equipmentBySlot.get(slot.name)!.nested"
          :w="slot.w"
          :h="slot.h"
          :cell-size="CELL_SIZE"
        />
        <span
          class="absolute bottom-0 left-0 text-[8px] leading-none text-foreground/80 px-[3px] pb-[4px] max-w-full overflow-hidden whitespace-nowrap z-10"
          style="text-overflow: '.'"
        >
          {{ equipmentBySlot.get(slot.name)!.nameEquipment }}
        </span>
      </div>
      <span v-else class="text-[9px] text-muted-foreground/60 uppercase flex items-center justify-center w-full h-full">{{ slot.label ?? slot.name }}</span>
    </div>

    <ItemContextMenu
      v-if="contextMenu"
      :x="contextMenu.x"
      :y="contextMenu.y"
      @duplicate="handleDuplicate"
      @delete="handleDelete"
      @close="contextMenu = null"
    />
  </div>
</template>
