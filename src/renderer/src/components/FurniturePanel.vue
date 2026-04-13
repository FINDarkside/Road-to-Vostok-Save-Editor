<script setup lang="ts">
import { computed } from 'vue'
import { useSaveEditor } from '../composables/useSaveEditor'
import { useDragDrop } from '../composables/useDragDrop'
import { Button } from '../components/ui/button'
import { Trash2 } from 'lucide-vue-next'
import InventoryGrid from './InventoryGrid.vue'
import InventoryGridItem from './InventoryGridItem.vue'
const { catalogItems } = useSaveEditor()
const { dragState, enterDeleteZone, leaveDeleteZone } = useDragDrop()

const ghostPlacement = computed(() => {
  if (!dragState.value) return null
  const ds = dragState.value
  return {
    ...ds.source.item,
    col: 0,
    row: 0,
    w: ds.ghostW,
    h: ds.ghostH,
    rotated: ds.ghostRotated
  }
})

const ghostStyle = computed(() => {
  if (!dragState.value || !ghostPlacement.value) return null
  const ds = dragState.value
  const gp = ghostPlacement.value
  return {
    left: `${ds.clientX - (gp.w * ds.ghostCellSize) / 2}px`,
    top: `${ds.clientY - (gp.h * ds.ghostCellSize) / 2}px`
  }
})

defineEmits<{
  openAddDialog: []
}>()
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center gap-2 mb-2">
      <h2 class="text-sm font-semibold">Furniture ({{ catalogItems.length }})</h2>
      <Button size="sm" class="ml-auto h-7 text-xs" @click="$emit('openAddDialog')">
        + Add Furniture
      </Button>
    </div>

    <div class="flex gap-4 flex-1 min-h-0 overflow-auto">
      <InventoryGrid mode="catalog" />

      <!-- Delete zone: visible during drag, fills remaining space -->
      <div
        v-if="dragState"
        class="sticky top-0 flex items-center justify-center flex-1 mr-2 rounded border-2 border-dashed transition-colors self-start h-20"
        :class="
          dragState.deleteHover
            ? 'border-red-500 bg-red-500/15 text-red-400'
            : 'border-muted-foreground/30 text-muted-foreground/40'
        "
        @pointerenter="enterDeleteZone"
        @pointerleave="leaveDeleteZone"
      >
        <Trash2 class="h-5 w-5" />
      </div>
    </div>

    <!-- Drag ghost (teleported to body, follows cursor) -->
    <Teleport to="body">
      <div
        v-if="dragState && ghostStyle && ghostPlacement"
        class="fixed pointer-events-none z-50"
        :style="ghostStyle"
      >
        <InventoryGridItem :placement="ghostPlacement" :cell-size="dragState.ghostCellSize" ghost />
        <!-- Red tint overlay when over delete zone -->
        <div
          v-if="dragState.deleteHover"
          class="absolute inset-0 rounded-sm bg-red-500/30 pointer-events-none"
        />
      </div>
    </Teleport>
  </div>
</template>
