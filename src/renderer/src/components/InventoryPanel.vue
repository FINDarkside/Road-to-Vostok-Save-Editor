<script setup lang="ts">
import { computed } from 'vue'
import { useSaveEditor } from '../composables/useSaveEditor'
import { useDragDrop } from '../composables/useDragDrop'
import { Button } from '../components/ui/button'
import { Hammer, Trash2 } from 'lucide-vue-next'
import EquipmentPanel from './EquipmentPanel.vue'
import InventoryGrid from './InventoryGrid.vue'
import InventoryGridItem from './InventoryGridItem.vue'

const { items, equipment, updateItem } = useSaveEditor()
const { dragState, enterDeleteZone, leaveDeleteZone } = useDragDrop()

const repairableItems = computed(() =>
  [...items.value, ...equipment.value].filter((item) => item.showCondition && item.condition < 100)
)

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

function repairAll(): void {
  for (const item of repairableItems.value) {
    updateItem(item.subResourceId, { condition: 100 })
  }
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center gap-2 mb-2">
      <h2 class="text-sm font-semibold">Inventory ({{ items.length }})</h2>
    </div>

    <div class="flex gap-4 flex-1 min-h-0 overflow-auto">
      <EquipmentPanel />
      <InventoryGrid ref="gridRef" />

      <div class="flex w-28 shrink-0 flex-col gap-2 mr-2">
        <Button size="sm" class="h-7 w-full text-xs" @click="$emit('openAddDialog')">
          + Add Item
        </Button>
        <Button
          size="sm"
          variant="secondary"
          class="h-7 w-full text-xs"
          :disabled="repairableItems.length === 0"
          @click="repairAll"
        >
          <Hammer class="h-3.5 w-3.5" />
          Repair All
        </Button>

        <!-- Delete zone: visible during drag, fills remaining side panel space -->
        <div
          v-if="dragState"
          class="flex flex-1 items-center justify-center rounded border-2 border-dashed transition-colors"
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
