<script setup lang="ts">
import { computed } from 'vue'
import { useSaveEditor } from '../composables/useSaveEditor'
import EquipmentSlot from './EquipmentSlot.vue'
import type { SlotItem } from '../lib/types'

const { equipment } = useSaveEditor()

const slotGroups = [
  { label: 'Weapons', slots: ['Primary', 'Secondary', 'Knife'] },
  { label: 'Clothing', slots: ['Head', 'Torso', 'Legs', 'Feet', 'Hands'] },
  { label: 'Gear', slots: ['Backpack', 'Rig', 'Belt'] },
  { label: 'Tools', slots: ['Light', 'Map', 'Matches', 'Time'] }
]

const equipmentBySlot = computed(() => {
  const map = new Map<string, SlotItem>()
  for (const item of equipment.value) {
    if (item.slot) map.set(item.slot, item)
  }
  return map
})
</script>

<template>
  <div class="space-y-6 max-w-3xl">
    <div v-for="group in slotGroups" :key="group.label">
      <h3 class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        {{ group.label }}
      </h3>
      <div class="grid grid-cols-3 gap-2">
        <EquipmentSlot
          v-for="slot in group.slots"
          :key="slot"
          :slot-name="slot"
          :item="equipmentBySlot.get(slot) ?? null"
        />
      </div>
    </div>
  </div>
</template>
