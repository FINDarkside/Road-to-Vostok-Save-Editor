<script setup lang="ts">
import { catalogItems } from '../composables/saveEditorState'
import { addCatalogItem, removeItem } from '../composables/useInventoryItems'
import {
  useInventoryGrid,
  CATALOG_COLS,
  CATALOG_ROWS,
  CATALOG_CELL_SIZE
} from '../composables/useInventoryGrid'
import { ITEMS_BY_PATH, getItemSize } from '../data/items'
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow
} from './ui/table'
import { Button } from './ui/button'
import ItemIcon from './ItemIcon.vue'

// Headless grid instance only used to find a free slot when duplicating.
const { findFreeSlot } = useInventoryGrid({
  items: catalogItems,
  cols: CATALOG_COLS,
  rows: CATALOG_ROWS,
  cellSize: CATALOG_CELL_SIZE
})

function iconFor(itemPath: string): string {
  return ITEMS_BY_PATH.get(itemPath)?.iconFile ?? ''
}

function sizeLabel(itemPath: string): string {
  const game = ITEMS_BY_PATH.get(itemPath)
  if (!game) return '—'
  const { w, h } = getItemSize(game)
  return `${w}×${h}`
}

function storageLabel(itemPath: string): string {
  const cs = ITEMS_BY_PATH.get(itemPath)?.containerSize
  return cs ? `${cs.w}×${cs.h}` : '—'
}

function handleDuplicate(itemPath: string, condition: number, amount: number): void {
  if (!itemPath) return
  const game = ITEMS_BY_PATH.get(itemPath)
  if (!game) return
  const { w, h } = getItemSize(game)
  const slot = findFreeSlot(w, h)
  if (!slot) return
  addCatalogItem(itemPath, {
    condition,
    amount,
    gridCol: slot.col,
    gridRow: slot.row,
    gridRotated: slot.rotated
  })
}
</script>

<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead class="w-12"></TableHead>
        <TableHead>Name</TableHead>
        <TableHead class="w-20 text-right">Size</TableHead>
        <TableHead class="w-24 text-right">Storage</TableHead>
        <TableHead class="w-[160px] text-right"></TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableEmpty v-if="catalogItems.length === 0" :colspan="5">
        <span class="text-sm text-muted-foreground">No furniture in catalog.</span>
      </TableEmpty>
      <TableRow v-for="item in catalogItems" v-else :key="item.subResourceId">
        <TableCell class="w-12 text-center">
          <ItemIcon
            v-if="iconFor(item.itemPath)"
            :icon-file="iconFor(item.itemPath)"
            class="h-6 inline-block"
          />
        </TableCell>
        <TableCell class="text-sm">{{ item.itemName }}</TableCell>
        <TableCell class="text-sm text-muted-foreground text-right">
          {{ sizeLabel(item.itemPath) }}
        </TableCell>
        <TableCell class="text-sm text-muted-foreground text-right">
          {{ storageLabel(item.itemPath) }}
        </TableCell>
        <TableCell class="text-right whitespace-nowrap space-x-1">
          <Button
            variant="ghost"
            size="sm"
            class="h-6 px-2 text-xs"
            :disabled="!item.itemPath"
            @click="handleDuplicate(item.itemPath, item.condition, item.amount)"
          >
            Duplicate
          </Button>
          <Button
            variant="ghost"
            size="sm"
            class="h-6 px-2 text-xs text-destructive-foreground"
            @click="removeItem(item.subResourceId)"
          >
            Remove
          </Button>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
