<script setup lang="ts">
import { computed } from 'vue'
import type { SlotItem } from '../lib/types'
import { ITEMS_META, ITEMS_BY_PATH } from '../data/items'
import { useDragDrop } from '../composables/useDragDrop'
import ItemIcon from './ItemIcon.vue'

const props = withDefaults(
  defineProps<{
    slotName: string
    item: SlotItem | null
    size?: 'normal' | 'large'
  }>(),
  { size: 'normal' }
)

const { dragState, startDragFromEquipment, enterEquipmentSlot, leaveEquipmentSlot } = useDragDrop()

const meta = computed(() => (props.item ? ITEMS_META.get(props.item.itemPath) : undefined))
const iconFile = computed(() =>
  props.item ? (ITEMS_BY_PATH.get(props.item.itemPath)?.iconFile ?? '') : ''
)

const isDragging = computed(
  () => dragState.value?.source.item.subResourceId === props.item?.subResourceId
)

const isHovered = computed(
  () =>
    dragState.value &&
    dragState.value.equipmentHover?.slotName === props.slotName &&
    dragState.value.source.item.subResourceId !== props.item?.subResourceId
)

function conditionColor(value: number): string {
  if (value > 50) return 'bg-green-500'
  if (value > 25) return 'bg-yellow-500'
  return 'bg-red-500'
}

function conditionTextColor(value: number): string {
  if (value > 50) return 'text-green-500'
  if (value > 25) return 'text-yellow-300'
  return 'text-red-400'
}

function onPointerDown(event: PointerEvent): void {
  if (!props.item) return
  startDragFromEquipment(props.item, props.slotName, event)
}

function onPointerEnter(): void {
  if (!dragState.value) return
  enterEquipmentSlot(props.slotName)
}

function onPointerLeave(): void {
  leaveEquipmentSlot(props.slotName)
}
</script>

<template>
  <div
    class="rounded border flex flex-col transition-colors overflow-hidden"
    :class="[
      isHovered
        ? 'border-green-500 bg-green-500/10'
        : item
          ? 'border-border bg-muted/30'
          : 'border-border border-dashed bg-muted/10',
      isDragging ? 'opacity-30' : '',
      item ? 'cursor-grab' : '',
      size === 'large' ? 'h-[72px]' : 'h-[60px]'
    ]"
    @pointerdown="onPointerDown"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
  >
    <div class="flex items-center gap-2 flex-1 min-h-0 px-2 py-1.5">
      <div v-if="item && iconFile" class="relative shrink-0">
        <ItemIcon
          :icon-file="iconFile"
          :class="size === 'large' ? 'h-10 w-10' : 'h-7 w-7'"
        />
        <span
          v-if="meta?.showCondition"
          class="absolute -top-1 -right-2 text-[8px] leading-none font-medium"
          :class="conditionTextColor(item.condition)"
        >
          {{ Math.round(item.condition) }}%
        </span>
      </div>
      <div class="flex flex-col min-w-0 flex-1">
        <span
          class="text-[10px] font-medium text-muted-foreground uppercase tracking-wider leading-none"
        >
          {{ slotName }}
        </span>
        <span v-if="item" class="text-xs font-medium truncate mt-0.5">{{ item.itemName }}</span>
        <span v-else class="text-[10px] text-muted-foreground mt-0.5">Empty</span>
      </div>
    </div>
    <div v-if="item && meta?.showCondition" class="px-2 pb-1.5 flex items-center gap-2">
      <div class="flex-1 h-1 rounded-full bg-secondary overflow-hidden">
        <div
          :class="conditionColor(item.condition)"
          class="h-full rounded-full transition-all"
          :style="{ width: `${item.condition}%` }"
        />
      </div>
      <span class="text-[9px] text-muted-foreground">{{ Math.round(item.condition) }}%</span>
    </div>
  </div>
</template>
