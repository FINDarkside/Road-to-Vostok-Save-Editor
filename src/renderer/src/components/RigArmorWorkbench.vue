<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { setRigArmorPlate } from '../composables/useArmorPlates'
import { useItemIcons } from '../composables/useItemIcons'
import { ITEMS_BY_PATH } from '../data/items'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog'
import { Input } from '../components/ui/input'
import type { GameItem, SlotItem } from '../lib/types'

const props = defineProps<{
  open: boolean
  rig: SlotItem | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const { loadIcon, getCachedIcon, status: iconStatus } = useItemIcons()

const selectedPlatePath = ref<string | null>(null)
const condition = ref(100)
const iconTick = ref(0)

const rigMeta = computed(() => (props.rig ? ITEMS_BY_PATH.get(props.rig.itemPath) : undefined))

const plateOptions = computed(() => {
  const compatible = rigMeta.value?.compatible ?? []
  if (compatible.length === 0) return []
  return compatible
    .map((path) => ITEMS_BY_PATH.get(path))
    .filter((item): item is GameItem => !!item?.plate)
})

const selectedPlate = computed(() =>
  selectedPlatePath.value ? ITEMS_BY_PATH.get(selectedPlatePath.value) : null
)

function getIcon(iconFile: string | undefined) {
  if (!iconFile) return null
  void iconTick.value
  return getCachedIcon(iconFile)
}

watch(
  () => props.open,
  async (open) => {
    if (!open || !props.rig) return
    selectedPlatePath.value = props.rig.armorPlatePath || null
    condition.value = props.rig.armorPlatePath ? props.rig.condition : 100

    if (iconStatus.value !== 'done') return
    const toLoad = plateOptions.value.filter(
      (item) => item.iconFile && !getCachedIcon(item.iconFile)
    )
    await Promise.all(toLoad.map((item) => loadIcon(item.iconFile!)))
    iconTick.value++
  }
)

function selectPlate(path: string | null): void {
  if (!props.rig) return
  selectedPlatePath.value = path
  if (!path) {
    condition.value = 100
    setRigArmorPlate(props.rig.subResourceId, null)
    return
  }
  setRigArmorPlate(props.rig.subResourceId, path, condition.value)
}

function commitCondition(): void {
  if (!props.rig || !selectedPlatePath.value) return
  condition.value = Math.max(0, Math.min(100, Math.round(condition.value)))
  setRigArmorPlate(props.rig.subResourceId, selectedPlatePath.value, condition.value)
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-w-lg flex flex-col gap-4">
      <DialogHeader>
        <DialogTitle>Edit Armor - {{ rig?.itemName }}</DialogTitle>
      </DialogHeader>

      <div v-if="rig" class="flex flex-col gap-3">
        <div class="flex flex-wrap gap-2">
          <button
            class="relative flex items-center justify-center w-20 h-20 rounded-md border transition-colors"
            :class="
              !selectedPlatePath
                ? 'border-primary ring-1 ring-primary bg-accent'
                : 'border-border hover:bg-accent'
            "
            @click="selectPlate(null)"
          >
            <span class="text-xs text-muted-foreground">None</span>
          </button>

          <button
            v-for="plate in plateOptions"
            :key="plate.resourcePath"
            class="relative w-20 h-20 rounded-md border transition-colors overflow-hidden"
            :class="
              selectedPlatePath === plate.resourcePath
                ? 'border-primary ring-1 ring-primary bg-accent'
                : 'border-border hover:bg-accent'
            "
            @click="selectPlate(plate.resourcePath)"
          >
            <img
              v-if="getIcon(plate.iconFile)"
              :src="getIcon(plate.iconFile)!"
              class="w-full h-full object-contain p-1.5"
              draggable="false"
            />
            <div v-else class="w-full h-full bg-muted" />
            <span
              class="absolute bottom-0 left-0 right-0 text-[10px] leading-none text-foreground/80 text-center pb-[3px] truncate px-[3px]"
            >
              {{ plate.displayName }}
            </span>
          </button>
        </div>

        <div class="flex items-center gap-2">
          <label class="text-xs text-muted-foreground">Condition</label>
          <Input
            v-model.number="condition"
            type="number"
            min="0"
            max="100"
            class="h-7 w-20 text-xs"
            :disabled="!selectedPlate"
            @change="commitCondition"
            @keydown.enter="commitCondition"
            @blur="commitCondition"
          />
          <span v-if="selectedPlate?.armorRating" class="text-xs text-muted-foreground">
            {{ selectedPlate.armorRating }}
          </span>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
