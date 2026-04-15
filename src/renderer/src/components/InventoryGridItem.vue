<script setup lang="ts">
import { useDragDrop } from '../composables/useDragDrop'
import CompositeIcon from './CompositeIcon.vue'
import type { GridItemPlacement } from '../lib/types'

defineProps<{
  placement: GridItemPlacement
  cellSize: number
  ghost?: boolean
  dimmed?: boolean
}>()

defineEmits<{
  dragstart: [placement: GridItemPlacement, event: PointerEvent]
  contextmenu: [placement: GridItemPlacement, event: MouseEvent]
  pointerenter: [placement: GridItemPlacement]
  pointerleave: [placement: GridItemPlacement]
}>()

const { dragState } = useDragDrop()
</script>

<template>
  <div
    class="absolute select-none"
    :class="[
      ghost ? 'pointer-events-none z-30' : 'cursor-grab z-10',
      !ghost && !dragState ? 'hover:z-20 hover:bg-primary/15' : '',
      dimmed ? 'opacity-30' : ''
    ]"
    :style="{
      left: `${placement.col * cellSize}px`,
      top: `${placement.row * cellSize}px`,
      width: `${placement.w * cellSize}px`,
      height: `${placement.h * cellSize}px`
    }"
    :title="`${placement.itemName}${placement.showCondition ? ` (${Math.round(placement.condition)}%)` : ''}`"
    @pointerdown.prevent="!ghost && $event.button === 0 && $emit('dragstart', placement, $event)"
    @pointerenter="!ghost && $emit('pointerenter', placement)"
    @pointerleave="!ghost && $emit('pointerleave', placement)"
    @contextmenu.prevent="!ghost && $emit('contextmenu', placement, $event)"
  >
    <div
      class="w-full h-full relative"
      :class="ghost ? '' : 'rounded-sm border border-border/60 bg-muted/40'"
    >
      <CompositeIcon
        :icon-file="placement.iconFile"
        :item-path="placement.itemPath"
        :nested="placement.nested"
        :w="placement.w"
        :h="placement.h"
        :cell-size="cellSize"
        :rotated="placement.rotated"
      />
      <!-- Condition percentage -->
      <span
        v-if="!ghost && placement.showCondition"
        class="absolute top-0 right-0 text-[10px] leading-none font-medium px-[3px] pt-[2px] z-10"
        :class="
          placement.condition > 50
            ? 'text-green-500'
            : placement.condition > 25
              ? 'text-yellow-300'
              : 'text-red-400'
        "
      >
        {{ Math.round(placement.condition) }}%
      </span>
      <!-- Fallback name when no icon -->
      <div
        v-if="!placement.iconFile"
        class="absolute inset-0 flex items-center justify-center text-[10px] text-muted-foreground text-center leading-tight px-0.5 truncate"
      >
        {{ placement.itemName }}
      </div>
      <!-- Ammo count -->
      <span
        v-if="!ghost && placement.category === 'Weapons'"
        class="absolute bottom-0 right-0 text-[10px] leading-none font-medium text-green-500 px-[3px] pb-[4px] z-10"
      >
        {{ placement.amount }} + {{ placement.chamber ? 1 : 0 }}
      </span>
      <span
        v-else-if="!ghost && placement.showAmount"
        class="absolute bottom-0 right-0 text-[10px] leading-none font-medium text-green-500 px-[3px] pb-[4px] z-10"
      >
        {{ placement.amount }}
      </span>
      <span
        v-else-if="!ghost && placement.armorRating"
        class="absolute bottom-0 right-0 text-[10px] leading-none font-medium text-green-500 px-[3px] pb-[4px] z-10"
      >
        {{ placement.armorRating }}
      </span>
      <!-- Item name label -->
      <span
        v-if="!ghost"
        class="absolute bottom-0 left-0 text-[10px] leading-none text-foreground/80 px-[3px] pb-[4px] max-w-full overflow-hidden whitespace-nowrap z-10"
        style="text-overflow: '.'"
      >
        {{ placement.rotated ? placement.nameRotated : placement.nameInventory }}
      </span>
    </div>
  </div>
</template>
