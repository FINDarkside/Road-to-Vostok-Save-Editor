<script setup lang="ts">
import { computed } from 'vue'
import type { SlotItem } from '../lib/types'
import { ITEMS_META, ITEMS_BY_PATH } from '../data/items'
import ItemIcon from './ItemIcon.vue'

const props = defineProps<{
  slotName: string
  item: SlotItem | null
}>()

const meta = computed(() => (props.item ? ITEMS_META.get(props.item.itemPath) : undefined))
const itemId = computed(() =>
  props.item ? (ITEMS_BY_PATH.get(props.item.itemPath)?.id ?? '') : ''
)

function conditionColor(value: number): string {
  if (value > 70) return 'bg-green-500'
  if (value > 30) return 'bg-yellow-500'
  return 'bg-red-500'
}
</script>

<template>
  <div
    class="rounded-lg border border-border p-3 min-h-[80px] flex flex-col"
    :class="item ? 'bg-muted/30' : 'bg-muted/10 border-dashed'"
  >
    <span class="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
      {{ slotName }}
    </span>
    <template v-if="item">
      <ItemIcon v-if="itemId" :item-id="itemId" class="h-8 mb-1" />
      <span class="text-sm font-medium truncate">{{ item.itemName }}</span>
      <div v-if="meta?.showCondition" class="mt-auto pt-1.5 flex items-center gap-2">
        <div class="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
          <div
            :class="conditionColor(item.condition)"
            class="h-full rounded-full transition-all"
            :style="{ width: `${item.condition}%` }"
          />
        </div>
        <span class="text-[10px] text-muted-foreground">{{ item.condition }}%</span>
      </div>
    </template>
    <span v-else class="text-xs text-muted-foreground mt-auto">Empty</span>
  </div>
</template>
