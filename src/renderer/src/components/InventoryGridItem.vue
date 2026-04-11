<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useItemIcons } from '../composables/useItemIcons'
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

const { status, loadIcon } = useItemIcons()
const iconUrl = ref<string | null>(null)

async function load() {
  if (status.value !== 'done' || !props.placement.itemId) return
  iconUrl.value = await loadIcon(props.placement.itemId)
}

onMounted(load)
watch([() => status.value, () => props.placement.itemId], () => {
  iconUrl.value = null
  load()
})
</script>

<template>
  <div
    class="absolute select-none"
    :class="[
      ghost ? 'pointer-events-none z-30' : 'cursor-grab z-10 hover:z-20 hover:ring-1 hover:ring-primary/50',
      dimmed ? 'opacity-30' : ''
    ]"
    :style="{
      left: `${placement.col * cellSize}px`,
      top: `${placement.row * cellSize}px`,
      width: `${placement.w * cellSize}px`,
      height: `${placement.h * cellSize}px`
    }"
    :title="`${placement.itemName}${placement.condition ? ` (${placement.condition}%)` : ''}`"
    @pointerdown.prevent="!ghost && $emit('dragstart', placement, $event)"
  >
    <div class="w-full h-full rounded-sm border border-border/60 bg-muted/40 relative">
      <!-- Non-rotated icon -->
      <img
        v-if="iconUrl && !placement.rotated"
        :src="iconUrl"
        :alt="placement.itemName"
        class="absolute inset-[2px] object-contain"
        draggable="false"
      />
      <!-- Rotated icon: sized to natural (un-rotated) dimensions, then CSS-rotated into place -->
      <img
        v-else-if="iconUrl"
        :src="iconUrl"
        :alt="placement.itemName"
        class="absolute max-w-none object-contain"
        :style="{
          top: '2px',
          left: '2px',
          width: `${placement.h * cellSize - 4}px`,
          height: `${placement.w * cellSize - 4}px`,
          transformOrigin: '0 0',
          transform: 'rotate(-90deg) translateX(-100%)'
        }"
        draggable="false"
      />
      <div
        v-else
        class="absolute inset-0 flex items-center justify-center text-[8px] text-muted-foreground text-center leading-tight px-0.5 truncate"
      >
        {{ placement.itemName }}
      </div>
    </div>
  </div>
</template>
