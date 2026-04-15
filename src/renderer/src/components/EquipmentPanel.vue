<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { useSaveEditor } from '../composables/useSaveEditor'
import { useDragDrop } from '../composables/useDragDrop'
import { useInventoryGrid, CELL_SIZE } from '../composables/useInventoryGrid'
import { useToast } from '../composables/useToast'
import { ITEMS_BY_PATH, getItemSize } from '../data/items'
import { ITEMS_BY_SLOT } from '../data/equipment-slots'
import { WEAPON_ATTACHMENT_LAYOUTS } from '../data/weapon-attachments'
import { ATTACHMENT_SUBTYPE } from '../data/attachment-subtypes'
import CompositeIcon from './CompositeIcon.vue'
import ItemContextMenu from './ItemContextMenu.vue'
import { Popover } from '../components/ui/popover'
import { PopoverAnchor } from 'reka-ui'
import PopoverContent from '../components/ui/popover/PopoverContent.vue'
import { ChevronDown } from 'lucide-vue-next'
import type { AttachmentRemoveOption, SlotItem, GameItem } from '../lib/types'

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

const {
  equipment,
  updateItem,
  removeItem,
  addItem,
  addEquipmentItem,
  setRigArmorPlate,
  removeWeaponAttachment
} = useSaveEditor()
const {
  dragState,
  startDragFromEquipment,
  enterEquipmentSlot,
  leaveEquipmentSlot,
  enterPlateTarget,
  leavePlateTarget,
  enterAttachmentTarget,
  leaveAttachmentTarget
} = useDragDrop()
const { findFreeSlot } = useInventoryGrid()
const toast = useToast()
const openWorkbench = inject<(weapon: SlotItem) => void>('openWorkbench')
const openRigArmorWorkbench = inject<(rig: SlotItem) => void>('openRigArmorWorkbench')

const contextMenu = ref<{ item: SlotItem; x: number; y: number } | null>(null)
const openPopover = ref<string | null>(null)
let popoverClosedSlot = null as { name: string; at: number } | null

const DRAG_THRESHOLD = 5

const showEditLoadout = computed(() => {
  if (!contextMenu.value) return false
  const item = contextMenu.value.item
  return (
    (item.category === 'Weapons' && WEAPON_ATTACHMENT_LAYOUTS.has(item.itemPath)) || item.carrier
  )
})

const editLoadoutLabel = computed(() => {
  if (!contextMenu.value) return 'Edit Loadout'
  return contextMenu.value.item.carrier ? 'Edit Armor' : 'Edit Loadout'
})

const removePlateLabel = computed(() => {
  const platePath = contextMenu.value?.item.armorPlatePath
  if (!platePath) return ''
  const plate = ITEMS_BY_PATH.get(platePath)
  return `Remove ${plate?.armorRating ? `${plate.armorRating} plate` : (plate?.displayName ?? 'plate')}`
})

const removeAttachmentOptions = computed<AttachmentRemoveOption[]>(() => {
  const item = contextMenu.value?.item
  if (!item || item.category !== 'Weapons') return []

  return item.nested
    .filter((path) => ATTACHMENT_SUBTYPE.has(path))
    .map((path) => ({
      path,
      label: `Remove ${ITEMS_BY_PATH.get(path)?.displayName ?? path.split('/').pop()?.replace('.tres', '') ?? 'attachment'}`
    }))
})

const canDuplicate = computed(() => {
  if (!contextMenu.value) return false
  return contextMenu.value.item.itemPath !== ''
})

const showFullCondition = computed(() => {
  const item = contextMenu.value?.item
  return !!item?.showCondition && item.condition < 100
})

function handleEditLoadout() {
  if (!contextMenu.value) return
  if (contextMenu.value.item.carrier) {
    openRigArmorWorkbench?.(contextMenu.value.item)
  } else {
    openWorkbench?.(contextMenu.value.item)
  }
  contextMenu.value = null
}

function onSlotContextMenu(slot: SlotDef, event: MouseEvent) {
  const item = equipmentBySlot.value.get(slot.name)
  if (!item) return
  event.preventDefault()
  contextMenu.value = { item, x: event.clientX, y: event.clientY }
}

function handleDuplicate() {
  if (!contextMenu.value) return
  const item = contextMenu.value.item
  if (item.itemPath === '') return
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
    gridRotated: slot.rotated,
    nestedPaths: item.nested
  })
  contextMenu.value = null
}

function handleRemovePlate() {
  if (!contextMenu.value) return
  const rig = contextMenu.value.item
  if (!rig.armorPlatePath) return

  const plate = ITEMS_BY_PATH.get(rig.armorPlatePath)
  const size = plate ? { w: plate.sizeW ?? 1, h: plate.sizeH ?? 1 } : { w: 1, h: 1 }
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
  const weapon = contextMenu.value.item

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

function handleFullCondition() {
  if (!contextMenu.value) return
  updateItem(contextMenu.value.item.subResourceId, { condition: 100 })
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

function onPopoverUpdate(slotName: string, open: boolean) {
  if (open) {
    openPopover.value = slotName
  } else {
    openPopover.value = null
    popoverClosedSlot = { name: slotName, at: Date.now() }
  }
}

function togglePopover(slotName: string) {
  if (openPopover.value === slotName) {
    openPopover.value = null
  } else if (
    !popoverClosedSlot ||
    popoverClosedSlot.name !== slotName ||
    Date.now() - popoverClosedSlot.at > 200
  ) {
    openPopover.value = slotName
  }
}

function onSlotClick(slot: SlotDef) {
  // For empty slots, toggle the picker on click (occupied slots use the drag-threshold handler)
  if (!equipmentBySlot.value.get(slot.name) && ITEMS_BY_SLOT.has(slot.name)) {
    togglePopover(slot.name)
  }
}

function onSlotPointerDown(slot: SlotDef, event: PointerEvent) {
  if (event.button !== 0) return
  const maybeItem = equipmentBySlot.value.get(slot.name)
  if (!maybeItem) return
  const item = maybeItem

  // Use drag threshold to distinguish click (open picker) from drag (move item)
  event.preventDefault()
  const startX = event.clientX
  const startY = event.clientY

  function onMove(e: PointerEvent) {
    if (Math.abs(e.clientX - startX) + Math.abs(e.clientY - startY) > DRAG_THRESHOLD) {
      teardown()
      startDragFromEquipment(item, slot.name, e)
    }
  }

  function onUp() {
    teardown()
    togglePopover(slot.name)
  }

  function teardown() {
    document.removeEventListener('pointermove', onMove)
    document.removeEventListener('pointerup', onUp)
  }

  document.addEventListener('pointermove', onMove)
  document.addEventListener('pointerup', onUp)
}

// --- Equipment item picker ---

function getPickerIconUrl(iconFile: string | undefined) {
  if (!iconFile) return null
  return `app-icon:///${encodeURIComponent(iconFile + '.png')}`
}

function selectEquipmentItem(slotName: string, item: GameItem | null) {
  const existing = equipmentBySlot.value.get(slotName)
  if (existing) removeItem(existing.subResourceId)
  if (item) addEquipmentItem(item.resourcePath, slotName)
  openPopover.value = null
}

function onSlotPointerEnter(slot: SlotDef) {
  if (!dragState.value) return
  const item = equipmentBySlot.value.get(slot.name)
  if (item) {
    const draggedPath = dragState.value.source.item.itemPath
    if (item.carrier && ITEMS_BY_PATH.get(draggedPath)?.plate) {
      enterPlateTarget(item)
      return
    }
    if (item.category === 'Weapons' && ATTACHMENT_SUBTYPE.has(draggedPath)) {
      enterAttachmentTarget(item)
      return
    }
  }
  enterEquipmentSlot(slot.name)
}

function onSlotPointerLeave(slot: SlotDef) {
  const item = equipmentBySlot.value.get(slot.name)
  if (item) {
    leavePlateTarget(item.subResourceId)
    leaveAttachmentTarget(item.subResourceId)
  }
  leaveEquipmentSlot(slot.name)
}

function isSlotDragging(slot: SlotDef): boolean {
  if (!dragState.value) return false
  const item = equipmentBySlot.value.get(slot.name)
  return item?.subResourceId === dragState.value.source.item.subResourceId
}

function isSlotHovered(slot: SlotDef): boolean {
  if (!dragState.value) return false
  const item = equipmentBySlot.value.get(slot.name)
  if (item && dragState.value.plateHover?.targetSubResourceId === item.subResourceId) return true
  if (item && dragState.value.attachmentHover?.targetSubResourceId === item.subResourceId) {
    return true
  }
  return (
    dragState.value.equipmentHover?.slotName === slot.name &&
    dragState.value.source.item.subResourceId !==
      equipmentBySlot.value.get(slot.name)?.subResourceId
  )
}

function isSlotHoverValid(slot: SlotDef): boolean {
  const item = equipmentBySlot.value.get(slot.name)
  if (item && dragState.value?.plateHover?.targetSubResourceId === item.subResourceId) {
    return dragState.value.plateHover.isValid
  }
  if (item && dragState.value?.attachmentHover?.targetSubResourceId === item.subResourceId) {
    return dragState.value.attachmentHover.isValid
  }
  return dragState.value?.equipmentHover?.isValid ?? false
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
    <Popover
      v-for="slot in slots"
      :key="slot.name"
      :open="openPopover === slot.name"
      @update:open="onPopoverUpdate(slot.name, $event)"
    >
      <PopoverAnchor as-child>
        <div
          class="group absolute border rounded-sm overflow-hidden transition-colors select-none"
          :class="[
            openPopover === slot.name ? 'z-20' : 'z-10',
            isSlotHovered(slot)
              ? isSlotHoverValid(slot)
                ? 'border-green-500 bg-green-500/10'
                : 'border-red-500 bg-red-500/10'
              : openPopover === slot.name
                ? 'border-primary ring-1 ring-primary'
                : equipmentBySlot.get(slot.name)
                  ? 'border-border/60 bg-muted/40'
                  : 'border-border/60 bg-background',
            isSlotDragging(slot) ? 'opacity-30' : '',
            equipmentBySlot.get(slot.name)
              ? 'cursor-grab'
              : ITEMS_BY_SLOT.has(slot.name)
                ? 'cursor-pointer'
                : ''
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
          @click="onSlotClick(slot)"
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
            <!-- Condition percentage -->
            <span
              v-if="equipmentBySlot.get(slot.name)!.showCondition"
              class="absolute top-0 right-0 text-[10px] leading-none font-medium px-[3px] pt-[2px] z-10"
              :class="
                equipmentBySlot.get(slot.name)!.condition > 50
                  ? 'text-green-500'
                  : equipmentBySlot.get(slot.name)!.condition > 25
                    ? 'text-yellow-300'
                    : 'text-red-400'
              "
            >
              {{ Math.round(equipmentBySlot.get(slot.name)!.condition) }}%
            </span>
            <!-- Ammo count -->
            <span
              v-if="equipmentBySlot.get(slot.name)!.category === 'Weapons'"
              class="absolute bottom-0 right-0 text-[10px] leading-none font-medium text-green-500 px-[3px] pb-[4px] z-10"
            >
              {{ equipmentBySlot.get(slot.name)!.amount }} +
              {{ equipmentBySlot.get(slot.name)!.chamber ? 1 : 0 }}
            </span>
            <span
              v-else-if="equipmentBySlot.get(slot.name)!.showAmount"
              class="absolute bottom-0 right-0 text-[10px] leading-none font-medium text-green-500 px-[3px] pb-[4px] z-10"
            >
              {{ equipmentBySlot.get(slot.name)!.amount }}
            </span>
            <span
              v-else-if="equipmentBySlot.get(slot.name)!.armorRating"
              class="absolute bottom-0 right-0 text-[10px] leading-none font-medium text-green-500 px-[3px] pb-[4px] z-10"
            >
              {{ equipmentBySlot.get(slot.name)!.armorRating }}
            </span>
            <!-- Item name label -->
            <span
              class="absolute bottom-0 left-0 text-[10px] leading-none text-foreground/80 px-[3px] pb-[4px] max-w-full overflow-hidden whitespace-nowrap z-10"
              style="text-overflow: '.'"
            >
              {{ equipmentBySlot.get(slot.name)!.nameEquipment }}
            </span>
          </div>
          <span
            v-else
            class="text-[10px] text-muted-foreground/60 uppercase flex items-center justify-center w-full h-full"
            >{{ slot.label ?? slot.name }}</span
          >
          <!-- Picker button (visible on slot hover) -->
          <button
            v-if="ITEMS_BY_SLOT.has(slot.name)"
            class="absolute top-0 right-0 z-20 flex items-center justify-center w-5 h-5 rounded-bl-sm bg-muted/80 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
            @pointerdown.stop
            @click.stop="togglePopover(slot.name)"
          >
            <ChevronDown class="w-3 h-3" />
          </button>
        </div>
      </PopoverAnchor>
      <PopoverContent
        v-if="ITEMS_BY_SLOT.has(slot.name)"
        :collision-padding="12"
        class="max-h-[400px] overflow-y-auto"
      >
        <div class="flex flex-wrap gap-2 w-[344px]">
          <!-- None / remove option (only when slot is occupied) -->
          <button
            v-if="equipmentBySlot.get(slot.name)"
            class="relative flex items-center justify-center w-20 h-20 rounded-md border transition-colors"
            :class="'border-border hover:bg-accent'"
            @click="selectEquipmentItem(slot.name, null)"
          >
            <span class="text-xs text-muted-foreground">None</span>
          </button>
          <!-- Item options -->
          <button
            v-for="item in ITEMS_BY_SLOT.get(slot.name)"
            :key="item.resourcePath"
            class="relative w-20 h-20 rounded-md border transition-colors overflow-hidden"
            :class="
              equipmentBySlot.get(slot.name)?.itemPath === item.resourcePath
                ? 'border-primary ring-1 ring-primary bg-accent'
                : 'border-border hover:bg-accent'
            "
            @click="selectEquipmentItem(slot.name, item)"
          >
            <img
              v-if="getPickerIconUrl(item.iconFile)"
              :src="getPickerIconUrl(item.iconFile)!"
              class="w-full h-full object-contain p-1.5"
              draggable="false"
            />
            <div v-else class="w-full h-full bg-muted" />
            <span
              class="absolute bottom-0 left-0 right-0 text-[10px] leading-none text-foreground/80 text-center pb-[3px] truncate px-[3px]"
            >
              {{ item.displayName }}
            </span>
          </button>
        </div>
      </PopoverContent>
    </Popover>

    <ItemContextMenu
      v-if="contextMenu"
      :x="contextMenu.x"
      :y="contextMenu.y"
      :show-edit-loadout="showEditLoadout"
      :edit-loadout-label="editLoadoutLabel"
      :remove-plate-label="removePlateLabel"
      :remove-attachment-options="removeAttachmentOptions"
      :show-full-condition="showFullCondition"
      :can-duplicate="canDuplicate"
      @full-condition="handleFullCondition"
      @edit-loadout="handleEditLoadout"
      @remove-plate="handleRemovePlate"
      @remove-attachment="handleRemoveAttachment"
      @duplicate="handleDuplicate"
      @delete="handleDelete"
      @close="contextMenu = null"
    />
  </div>
</template>
