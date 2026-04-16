<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { setWeaponNested } from '../composables/useWeaponAttachments'
import { useItemIcons } from '../composables/useItemIcons'
import { ITEMS_BY_PATH, getItemSize } from '../data/items'
import { WEAPON_ATTACHMENT_LAYOUTS } from '../data/weapon-attachments'
import {
  getWeaponSlots,
  resolveItemPath,
  ATTACHMENT_SUBTYPE,
  type AttachmentSubtype,
  type AttachmentOption
} from '../data/attachment-subtypes'
import CompositeIcon from './CompositeIcon.vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog'
import { Popover, PopoverTrigger } from '../components/ui/popover'
import PopoverContent from '../components/ui/popover/PopoverContent.vue'
import type { SlotItem } from '../lib/types'

const CELL_SIZE = 100
const NONE = '__none__'
const PAD = 60

const props = defineProps<{
  open: boolean
  weapon: SlotItem | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const { loadIcon, getCachedIcon, status: iconStatus } = useItemIcons()

const selectedPaths = ref(new Set<string>())
const openPopover = ref<AttachmentSubtype | null>(null)

watch(
  () => props.open,
  (open) => {
    if (open && props.weapon) {
      selectedPaths.value = new Set(props.weapon.nested)
      loadAllIcons()
    } else {
      openPopover.value = null
    }
  }
)

async function loadAllIcons() {
  if (iconStatus.value !== 'done' || !props.weapon) return
  const allSlots = getWeaponSlots(props.weapon.itemPath)
  for (const [, options] of allSlots) {
    for (const opt of options) {
      const item = ITEMS_BY_PATH.get(opt.itemPath)
      if (item?.iconFile) await loadIcon(item.iconFile)
    }
  }
}

const weaponSize = computed(() => {
  if (!props.weapon) return { w: 1, h: 1 }
  const item = ITEMS_BY_PATH.get(props.weapon.itemPath)
  return item ? getItemSize(item) : { w: 1, h: 1 }
})

const MAX_AREA_W = 700

const weaponPxW = computed(() => weaponSize.value.w * CELL_SIZE)
const weaponPxH = computed(() => weaponSize.value.h * CELL_SIZE)
const areaW = computed(() => weaponPxW.value + PAD * 2)
const areaH = computed(() => weaponPxH.value + PAD * 2)
const areaScale = computed(() => Math.min(1, MAX_AREA_W / areaW.value))

const slots = computed(() => {
  if (!props.weapon) return new Map<AttachmentSubtype, AttachmentOption[]>()
  return getWeaponSlots(props.weapon.itemPath)
})

const previewNested = computed(() => [...selectedPaths.value])

interface SlotPosition {
  subtype: AttachmentSubtype
  ax: number
  ay: number
  bx: number
  by: number
}

const slotPositions = computed<SlotPosition[]>(() => {
  if (!props.weapon) return []
  const layouts = WEAPON_ATTACHMENT_LAYOUTS.get(props.weapon.itemPath)
  if (!layouts) return []

  const factor = CELL_SIZE / 64
  const cx = areaW.value / 2
  const cy = areaH.value / 2

  const wTop = PAD
  const wBottom = PAD + weaponPxH.value

  const groups = new Map<AttachmentSubtype, { x: number; y: number }[]>()
  for (const layout of layouts) {
    const itemPath = resolveItemPath(layout.attachmentPath)
    const subtype = ATTACHMENT_SUBTYPE.get(itemPath)
    if (!subtype) continue
    if (!groups.has(subtype)) groups.set(subtype, [])
    groups.get(subtype)!.push({
      x: cx + 0.5 * layout.position[0] * factor,
      y: cy + 0.5 * layout.position[1] * factor
    })
  }

  const result: SlotPosition[] = []
  for (const [subtype, positions] of groups) {
    const ax = positions.reduce((s, p) => s + p.x, 0) / positions.length
    const ay = positions.reduce((s, p) => s + p.y, 0) / positions.length

    const distTop = ay - wTop
    const distBottom = wBottom - ay
    const minDist = Math.min(distTop, distBottom)

    let bx: number, by: number
    if (minDist === distBottom) {
      bx = ax
      by = areaH.value - PAD / 2
    } else {
      bx = ax
      by = PAD / 2
    }

    result.push({ subtype, ax, ay, bx, by })
  }
  return result
})

function selectedForSubtype(subtype: AttachmentSubtype): AttachmentOption | null {
  const options = slots.value.get(subtype)
  if (!options) return null
  return options.find((opt) => selectedPaths.value.has(opt.itemPath)) ?? null
}

function getIconUrl(itemPath: string): string | null {
  const item = ITEMS_BY_PATH.get(itemPath)
  if (!item?.iconFile) return null
  return getCachedIcon(item.iconFile)
}

function selectAttachment(subtype: AttachmentSubtype, value: string) {
  if (!props.weapon) return
  const next = new Set(selectedPaths.value)

  const options = slots.value.get(subtype)
  if (options) {
    for (const opt of options) {
      next.delete(opt.itemPath)
    }
  }

  if (value !== NONE) {
    next.add(value)
  }

  selectedPaths.value = next
  setWeaponNested(props.weapon.subResourceId, [...next])
  openPopover.value = null
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-w-3xl flex flex-col gap-4">
      <DialogHeader>
        <DialogTitle>Edit Loadout — {{ weapon?.itemName }}</DialogTitle>
      </DialogHeader>

      <!-- Weapon area with slot buttons and lines -->
      <div
        v-if="weapon"
        class="mx-auto overflow-hidden"
        :style="{ width: `${areaW * areaScale}px`, height: `${areaH * areaScale}px` }"
      >
        <div
          class="relative origin-top-left"
          :style="{
            width: `${areaW}px`,
            height: `${areaH}px`,
            transform: areaScale < 1 ? `scale(${areaScale})` : undefined
          }"
        >
          <!-- Weapon image -->
          <div
            class="absolute"
            :style="{
              left: `${PAD}px`,
              top: `${PAD}px`,
              width: `${weaponPxW}px`,
              height: `${weaponPxH}px`
            }"
          >
            <CompositeIcon
              :icon-file="ITEMS_BY_PATH.get(weapon.itemPath)?.iconFile ?? ''"
              :item-path="weapon.itemPath"
              :nested="previewNested"
              :w="weaponSize.w"
              :h="weaponSize.h"
              :cell-size="CELL_SIZE"
              no-fit
            />
          </div>

          <!-- SVG lines -->
          <svg class="absolute inset-0 pointer-events-none" :width="areaW" :height="areaH">
            <line
              v-for="sp in slotPositions"
              :key="sp.subtype"
              :x1="sp.bx"
              :y1="sp.by"
              :x2="sp.ax"
              :y2="sp.ay"
              stroke="currentColor"
              class="text-muted-foreground/40"
              stroke-width="1"
            />
            <circle
              v-for="sp in slotPositions"
              :key="sp.subtype + '-dot'"
              :cx="sp.ax"
              :cy="sp.ay"
              r="3"
              fill="currentColor"
              class="text-muted-foreground/60"
            />
          </svg>

          <!-- Slot buttons with Popover -->
          <Popover
            v-for="sp in slotPositions"
            :key="sp.subtype"
            :open="openPopover === sp.subtype"
            @update:open="openPopover = $event ? sp.subtype : null"
          >
            <PopoverTrigger as-child>
              <button
                class="absolute flex flex-col items-center justify-center w-12 h-12 -ml-6 -mt-6 rounded-md border bg-background transition-colors overflow-hidden z-10"
                :class="
                  openPopover === sp.subtype
                    ? 'border-primary ring-1 ring-primary'
                    : 'border-input hover:bg-accent'
                "
                :style="{ left: `${sp.bx}px`, top: `${sp.by}px` }"
              >
                <template v-if="selectedForSubtype(sp.subtype)">
                  <img
                    v-if="getIconUrl(selectedForSubtype(sp.subtype)!.itemPath)"
                    :src="getIconUrl(selectedForSubtype(sp.subtype)!.itemPath)!"
                    class="w-full h-full object-contain p-0.5"
                    draggable="false"
                  />
                  <div v-else class="w-full h-full bg-muted" />
                </template>
                <span v-else class="text-[9px] text-muted-foreground leading-tight text-center">{{
                  sp.subtype
                }}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent :collision-padding="12">
              <div class="flex flex-wrap gap-2" style="max-width: 380px">
                <!-- None option -->
                <button
                  class="relative flex items-center justify-center w-20 h-20 rounded-md border transition-colors"
                  :class="
                    !selectedForSubtype(sp.subtype)
                      ? 'border-primary ring-1 ring-primary bg-accent'
                      : 'border-border hover:bg-accent'
                  "
                  @click="selectAttachment(sp.subtype, NONE)"
                >
                  <span class="text-xs text-muted-foreground">None</span>
                </button>
                <!-- Attachment options -->
                <button
                  v-for="opt in slots.get(sp.subtype)"
                  :key="opt.itemPath"
                  class="relative w-20 h-20 rounded-md border transition-colors overflow-hidden"
                  :class="
                    selectedPaths.has(opt.itemPath)
                      ? 'border-primary ring-1 ring-primary bg-accent'
                      : 'border-border hover:bg-accent'
                  "
                  @click="selectAttachment(sp.subtype, opt.itemPath)"
                >
                  <img
                    v-if="getIconUrl(opt.itemPath)"
                    :src="getIconUrl(opt.itemPath)!"
                    class="w-full h-full object-contain p-1.5"
                    draggable="false"
                  />
                  <div v-else class="w-full h-full bg-muted" />
                  <span
                    class="absolute bottom-0 left-0 right-0 text-[10px] leading-none text-foreground/80 text-center pb-[3px] truncate px-[3px]"
                  >
                    {{ opt.displayName }}
                  </span>
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
