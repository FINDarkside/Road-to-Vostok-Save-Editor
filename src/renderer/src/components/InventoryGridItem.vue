<script setup lang="ts">
import { useDragDrop } from '../composables/useDragDrop'
import CompositeIcon from './CompositeIcon.vue'
import type { GridItemPlacement } from '../lib/types'

const props = defineProps<{
  placement: GridItemPlacement
  cellSize: number
  ghost?: boolean
  dimmed?: boolean
}>()

defineEmits<{
  dragstart: [placement: GridItemPlacement, event: PointerEvent]
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
    :title="`${placement.itemName}${placement.condition ? ` (${Math.round(placement.condition)}%)` : ''}`"
    @pointerdown.prevent="!ghost && $emit('dragstart', placement, $event)"
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
      <!-- Fallback name when no icon -->
      <div
        v-if="!placement.iconFile"
        class="absolute inset-0 flex items-center justify-center text-[8px] text-muted-foreground text-center leading-tight px-0.5 truncate"
      >
        {{ placement.itemName }}
      </div>
      <!-- Item name label -->
      <span
        v-if="!ghost"
        class="absolute bottom-0 left-0 text-[8px] leading-none text-foreground/80 px-[3px] pb-[4px] max-w-full overflow-hidden whitespace-nowrap z-10"
        style="text-overflow: '.'"
      >
        {{ placement.rotated ? placement.nameRotated : placement.nameInventory }}
      </span>
    </div>
  </div>
</template>
