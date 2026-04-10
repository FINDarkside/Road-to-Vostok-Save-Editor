<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSaveEditor } from '../composables/useSaveEditor'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import ItemRow from './ItemRow.vue'

const { items, removeItem, updateItem } = useSaveEditor()

const search = ref('')
const selectedCategory = ref<string | null>(null)

const categories = computed(() => {
  const cats = new Set<string>()
  for (const item of items.value) {
    if (item.category) cats.add(item.category)
  }
  return [...cats].sort()
})

const filteredItems = computed(() => {
  let result = items.value
  if (selectedCategory.value) {
    result = result.filter((i) => i.category === selectedCategory.value)
  }
  if (search.value) {
    const q = search.value.toLowerCase()
    result = result.filter(
      (i) => i.itemName.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)
    )
  }
  return result
})

function toggleCategory(cat: string): void {
  selectedCategory.value = selectedCategory.value === cat ? null : cat
}

function onUpdate(subResourceId: string, updates: { condition?: number; amount?: number }): void {
  updateItem(subResourceId, updates)
}

defineEmits<{
  openAddDialog: []
}>()
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center gap-2 mb-2">
      <h2 class="text-sm font-semibold">Inventory ({{ items.length }})</h2>
      <Input v-model="search" placeholder="Filter items..." class="h-7 text-xs max-w-[200px]" />
      <Button size="sm" class="ml-auto h-7 text-xs" @click="$emit('openAddDialog')">
        + Add Item
      </Button>
    </div>

    <div v-if="categories.length > 0" class="flex flex-wrap gap-1 mb-2">
      <Badge
        v-for="cat in categories"
        :key="cat"
        :variant="selectedCategory === cat ? 'default' : 'secondary'"
        class="text-xs cursor-pointer select-none"
        @click="toggleCategory(cat)"
      >
        {{ cat }}
      </Badge>
    </div>

    <div class="flex-1 min-h-0 overflow-y-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-border text-xs text-muted-foreground sticky top-0 bg-background z-10">
            <th class="px-1 py-1 w-8"></th>
            <th class="px-3 py-1 text-left font-medium">Name</th>
            <th class="px-3 py-1 text-left font-medium">Category</th>
            <th class="px-3 py-1 text-right font-medium">Condition</th>
            <th class="px-3 py-1 text-right font-medium">Amount</th>
            <th class="px-3 py-1 text-left font-medium">Slot</th>
            <th class="px-3 py-1 text-right font-medium w-20"></th>
          </tr>
        </thead>
        <tbody>
          <ItemRow
            v-for="item in filteredItems"
            :key="item.subResourceId"
            :item="item"
            :show-delete="true"
            @delete="removeItem"
            @update="onUpdate"
          />
        </tbody>
      </table>
      <div
        v-if="filteredItems.length === 0"
        class="text-sm text-muted-foreground text-center py-8"
      >
        {{ search || selectedCategory ? 'No matching items' : 'Inventory is empty' }}
      </div>
    </div>
  </div>
</template>
