<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import type { SlotItem } from '../lib/types'
import { ITEMS_META, ITEMS_BY_PATH } from '../data/items'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import ItemIcon from './ItemIcon.vue'

const props = defineProps<{
  item: SlotItem
  showDelete?: boolean
}>()

const emit = defineEmits<{
  delete: [subResourceId: string]
  update: [subResourceId: string, updates: { condition?: number; amount?: number }]
}>()

const meta = computed(() => ITEMS_META.get(props.item.itemPath))
const iconFile = computed(() => ITEMS_BY_PATH.get(props.item.itemPath)?.iconFile ?? '')

const editingField = ref<'condition' | 'amount' | null>(null)
const editValue = ref('')
const editInput = ref<InstanceType<typeof Input> | null>(null)

function conditionColor(value: number): string {
  if (value > 70) return 'text-green-400'
  if (value > 30) return 'text-yellow-400'
  return 'text-red-400'
}

function startEdit(field: 'condition' | 'amount'): void {
  editingField.value = field
  editValue.value = String(props.item[field])
  nextTick(() => {
    const el = editInput.value?.$el as HTMLInputElement | undefined
    el?.select()
  })
}

function commitEdit(): void {
  if (!editingField.value) return
  const value = parseInt(editValue.value, 10)
  if (!isNaN(value)) {
    emit('update', props.item.subResourceId, { [editingField.value]: value })
  }
  editingField.value = null
}

function cancelEdit(): void {
  editingField.value = null
}
</script>

<template>
  <tr class="border-b border-border hover:bg-muted/50">
    <td class="px-1 py-1.5 w-8 text-center">
      <ItemIcon v-if="iconFile" :icon-file="iconFile" class="h-6 inline-block" />
    </td>
    <td class="px-3 py-1.5 text-sm">{{ item.itemName }}</td>
    <td class="px-3 py-1.5">
      <Badge variant="secondary" class="text-xs">{{ item.category || '—' }}</Badge>
    </td>
    <td class="px-3 py-1.5 text-sm text-right">
      <template v-if="meta?.showCondition">
        <Input
          v-if="editingField === 'condition'"
          ref="editInput"
          v-model="editValue"
          type="number"
          class="h-6 w-16 text-xs text-right ml-auto"
          min="0"
          max="100"
          @blur="commitEdit"
          @keydown.enter="commitEdit"
          @keydown.escape="cancelEdit"
        />
        <span
          v-else
          :class="conditionColor(item.condition)"
          class="cursor-pointer hover:underline"
          @click="startEdit('condition')"
        >
          {{ Math.round(item.condition) }}
        </span>
      </template>
      <span v-else class="text-muted-foreground">—</span>
    </td>
    <td class="px-3 py-1.5 text-sm text-right">
      <template v-if="meta?.showAmount">
        <Input
          v-if="editingField === 'amount'"
          ref="editInput"
          v-model="editValue"
          type="number"
          class="h-6 w-16 text-xs text-right ml-auto"
          min="0"
          :max="meta?.maxAmount"
          @blur="commitEdit"
          @keydown.enter="commitEdit"
          @keydown.escape="cancelEdit"
        />
        <span v-else class="cursor-pointer hover:underline" @click="startEdit('amount')">
          {{ item.amount }}
        </span>
      </template>
      <span v-else class="text-muted-foreground">—</span>
    </td>
    <td class="px-3 py-1.5 text-sm">{{ item.slot || '—' }}</td>
    <td v-if="showDelete" class="px-3 py-1.5 text-right whitespace-nowrap space-x-1">
      <Button
        v-if="meta?.repairs"
        variant="ghost"
        size="sm"
        class="h-6 px-2 text-xs"
        :disabled="item.condition >= 100"
        @click="$emit('update', item.subResourceId, { condition: 100 })"
      >
        Repair
      </Button>
      <Button
        variant="ghost"
        size="sm"
        class="h-6 px-2 text-xs text-destructive-foreground"
        @click="$emit('delete', item.subResourceId)"
      >
        Remove
      </Button>
    </td>
  </tr>
</template>
