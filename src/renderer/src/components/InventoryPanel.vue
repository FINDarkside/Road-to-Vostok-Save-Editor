<script setup lang="ts">
import { computed } from 'vue'
import { useSaveEditor } from '../composables/useSaveEditor'
import { useDragDrop } from '../composables/useDragDrop'
import { Button } from '../components/ui/button'
import EquipmentPanel from './EquipmentPanel.vue'
import InventoryGrid from './InventoryGrid.vue'
import InventoryGridItem from './InventoryGridItem.vue'

const CELL_SIZE = 48

const { items } = useSaveEditor()
const { dragState } = useDragDrop()

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
    left: `${ds.clientX - (gp.w * CELL_SIZE) / 2}px`,
    top: `${ds.clientY - (gp.h * CELL_SIZE) / 2}px`
  }
})

defineEmits<{
  openAddDialog: []
}>()
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center gap-2 mb-2">
      <h2 class="text-sm font-semibold">Inventory ({{ items.length }})</h2>
      <Button size="sm" class="ml-auto h-7 text-xs" @click="$emit('openAddDialog')">
        + Add Item
      </Button>
    </div>

    <div class="flex gap-4 flex-1 min-h-0 overflow-auto">
      <EquipmentPanel />
      <InventoryGrid ref="gridRef" />
    </div>

    <!-- Drag ghost (teleported to body, follows cursor) -->
    <Teleport to="body">
      <div
        v-if="dragState && ghostStyle && ghostPlacement"
        class="fixed pointer-events-none z-50"
        :style="ghostStyle"
      >
        <InventoryGridItem :placement="ghostPlacement" :cell-size="CELL_SIZE" ghost />
      </div>
    </Teleport>
  </div>
</template>
