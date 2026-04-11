<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useSaveEditor } from '../composables/useSaveEditor'
import { useInventoryGrid } from '../composables/useInventoryGrid'
import { ITEMS, resolveItemMeta, getItemSize } from '../data/items'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '../components/ui/dialog'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { useItemIcons } from '../composables/useItemIcons'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const { addItem } = useSaveEditor()
const { findFreeSlot } = useInventoryGrid()
const { getCachedIcon, loadIcon } = useItemIcons()

const iconTick = ref(0)

function getIcon(iconFile: string) {
  void iconTick.value // reactive dependency
  return getCachedIcon(iconFile)
}

watch(
  () => props.open,
  async (open) => {
    if (!open) return
    const toLoad = ITEMS.filter((i) => i.iconFile && !getCachedIcon(i.iconFile))
    if (!toLoad.length) return
    await Promise.all(toLoad.map((i) => loadIcon(i.iconFile!)))
    iconTick.value++
  }
)

const search = ref('')
const selectedCategory = ref<string | null>(null)
const selectedIndex = ref(0)
const condition = ref(100)
const amount = ref(1)
const listRef = ref<HTMLElement | null>(null)
const addError = ref<string | null>(null)

const categories = computed(() => {
  const cats = new Set<string>()
  for (const item of ITEMS) cats.add(item.category)
  return [...cats].sort()
})

const filteredItems = computed(() => {
  let result = ITEMS as typeof ITEMS
  if (selectedCategory.value) {
    result = result.filter((i) => i.category === selectedCategory.value)
  }
  if (search.value) {
    const q = search.value.toLowerCase()
    result = result.filter(
      (i) => i.displayName.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)
    )
  }
  return result
})

function toggleCategory(cat: string): void {
  selectedCategory.value = selectedCategory.value === cat ? null : cat
  selectedIndex.value = 0
  addError.value = null
}

const selectedItem = computed(() => filteredItems.value[selectedIndex.value] ?? null)

const selectedMeta = computed(() =>
  selectedItem.value ? resolveItemMeta(selectedItem.value) : null
)

watch(search, () => {
  selectedIndex.value = 0
  addError.value = null
})

watch(selectedItem, (item) => {
  if (!item) return
  const meta = resolveItemMeta(item)
  condition.value = meta.defaultCondition
  amount.value = meta.defaultAmount
  addError.value = null
})

function scrollToSelected(): void {
  nextTick(() => {
    const el = listRef.value?.children[selectedIndex.value] as HTMLElement | undefined
    el?.scrollIntoView({ block: 'nearest' })
  })
}

function onKeydown(e: KeyboardEvent): void {
  const len = filteredItems.value.length
  if (!len) return

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    selectedIndex.value = (selectedIndex.value + 1) % len
    scrollToSelected()
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    selectedIndex.value = (selectedIndex.value - 1 + len) % len
    scrollToSelected()
  } else if (e.key === 'Enter') {
    e.preventDefault()
    confirm()
  }
}

function confirm(): void {
  if (!selectedItem.value || !selectedMeta.value) return

  const size = getItemSize(selectedItem.value)
  const slot = findFreeSlot(size.w, size.h)

  if (!slot) {
    addError.value = 'No space available in inventory grid'
    return
  }

  const opts: {
    condition?: number
    amount?: number
    gridCol?: number
    gridRow?: number
    gridRotated?: boolean
  } = {
    gridCol: slot.col,
    gridRow: slot.row,
    gridRotated: slot.rotated
  }

  if (selectedMeta.value.showCondition) opts.condition = condition.value
  if (selectedMeta.value.showAmount) opts.amount = amount.value
  addItem(selectedItem.value.resourcePath, opts)
  addError.value = null
  reset()
  emit('update:open', false)
}

function reset(): void {
  search.value = ''
  selectedCategory.value = null
  selectedIndex.value = 0
  condition.value = 100
  amount.value = 1
  addError.value = null
}
</script>

<template>
  <Dialog
    :open="props.open"
    @update:open="
      (v) => {
        emit('update:open', v)
        if (!v) reset()
      }
    "
  >
    <DialogContent class="max-w-lg h-[80vh] flex flex-col">
      <DialogHeader>
        <DialogTitle>Add Item</DialogTitle>
      </DialogHeader>

      <div class="flex flex-col gap-3 flex-1 min-h-0">
        <Input
          v-model="search"
          placeholder="Search items..."
          class="h-8 text-sm"
          @keydown="onKeydown"
        />

        <div class="flex flex-wrap gap-1">
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

        <div
          ref="listRef"
          class="flex-1 border border-border rounded-md min-h-0 overflow-y-auto p-1"
        >
          <button
            v-for="(item, i) in filteredItems"
            :key="item.id"
            class="w-full flex items-center gap-2 px-2 py-1 rounded text-sm text-left hover:bg-accent"
            :class="{ 'bg-accent': i === selectedIndex }"
            @click="selectedIndex = i"
          >
            <span class="flex-1 truncate">{{ item.displayName }}</span>
            <img
              v-if="item.iconFile && getIcon(item.iconFile)"
              :src="getIcon(item.iconFile)!"
              loading="lazy"
              class="h-5 w-16 shrink-0 object-contain"
            />
            <div v-else class="h-5 w-16 shrink-0" />
            <Badge variant="secondary" class="text-xs shrink-0 w-24 justify-center">{{
              item.category
            }}</Badge>
          </button>
        </div>

        <div v-if="selectedItem && selectedMeta" class="flex gap-3">
          <div v-if="selectedMeta.showCondition" class="flex items-center gap-1.5">
            <label class="text-xs text-muted-foreground">Condition</label>
            <Input
              v-model.number="condition"
              type="number"
              min="0"
              max="100"
              class="h-7 w-20 text-xs"
            />
          </div>
          <div v-if="selectedMeta.showAmount" class="flex items-center gap-1.5">
            <label class="text-xs text-muted-foreground">Amount</label>
            <Input
              v-model.number="amount"
              type="number"
              min="0"
              :max="selectedMeta.maxAmount"
              class="h-7 w-20 text-xs"
            />
          </div>
        </div>

        <div
          v-if="addError"
          class="text-xs text-red-500 bg-red-500/10 border border-red-500/30 rounded px-2 py-1.5"
        >
          {{ addError }}
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" size="sm" @click="emit('update:open', false)">Cancel</Button>
        <Button size="sm" :disabled="!selectedItem" @click="confirm">
          Add {{ selectedItem?.displayName ?? 'Item' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
