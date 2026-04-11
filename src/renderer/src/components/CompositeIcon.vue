<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useItemIcons } from '../composables/useItemIcons'
import { ITEMS_BY_PATH, getItemSize } from '../data/items'
import { WEAPON_ATTACHMENT_LAYOUTS } from '../data/weapon-attachments'
import type { AttachmentOverlay } from '../data/weapon-attachments'

const props = withDefaults(
  defineProps<{
    iconFile: string
    itemPath: string
    nested: string[]
    /** Grid width in cells */
    w: number
    /** Grid height in cells */
    h: number
    cellSize: number
    rotated?: boolean
    /** Disable auto-scaling when attachments overflow */
    noFit?: boolean
  }>(),
  { rotated: false, noFit: false }
)

const { status, loadIcon } = useItemIcons()
const iconUrl = ref<string | null>(null)

interface ResolvedAttachment extends AttachmentOverlay {
  iconFile: string
  attW: number
  attH: number
}

const resolvedAttachments = computed<ResolvedAttachment[]>(() => {
  if (props.nested.length === 0) return []
  const layouts = WEAPON_ATTACHMENT_LAYOUTS.get(props.itemPath)
  if (!layouts) return []

  const result: ResolvedAttachment[] = []
  for (const nestedPath of props.nested) {
    const overlay = layouts.find((l) => l.attachmentPath === nestedPath)
    if (!overlay) continue
    const item = ITEMS_BY_PATH.get(nestedPath)
    if (!item?.iconFile) continue
    const size = getItemSize(item)
    result.push({ ...overlay, iconFile: item.iconFile, attW: size.w, attH: size.h })
  }
  return result
})

const loadedAttachments = ref<{ att: ResolvedAttachment; url: string }[]>([])

async function load() {
  if (status.value !== 'done') return
  if (props.iconFile) {
    iconUrl.value = await loadIcon(props.iconFile)
  }
  await loadAttachments()
}

async function loadAttachments() {
  if (status.value !== 'done') return
  const atts = resolvedAttachments.value
  const loaded: { att: ResolvedAttachment; url: string }[] = []
  for (const att of atts) {
    const url = await loadIcon(att.iconFile)
    if (url) loaded.push({ att, url })
  }
  loadedAttachments.value = loaded
}

onMounted(load)
watch([() => status.value, () => props.iconFile], () => {
  iconUrl.value = null
  load()
})
watch(() => props.nested, loadAttachments)

const wrapperStyle = computed(() => {
  if (!props.rotated) {
    return { inset: '2px' }
  }
  return {
    top: '2px',
    left: '2px',
    width: `${props.h * props.cellSize - 4}px`,
    height: `${props.w * props.cellSize - 4}px`,
    transformOrigin: '0 0',
    transform: 'rotate(-90deg) translateX(-100%)'
  }
})

// Compute auto-fit scale when attachments overflow the weapon area
const fitTransform = computed(() => {
  if (props.noFit) return undefined
  const atts = resolvedAttachments.value
  if (atts.length === 0) return undefined

  const factor = props.cellSize / 64
  // When rotated, the wrapper is h×w (pre-rotation dimensions)
  const wrapW = (props.rotated ? props.h : props.w) * props.cellSize - 4
  const wrapH = (props.rotated ? props.w : props.h) * props.cellSize - 4

  // Bounding box starts with the base weapon (fills the wrapper)
  let minX = 0
  let maxX = wrapW
  let minY = 0
  let maxY = wrapH

  for (const att of atts) {
    const cx = wrapW / 2 + 0.5 * att.position[0] * factor
    const cy = wrapH / 2 + 0.5 * att.position[1] * factor
    const aw = att.attW * props.cellSize * att.scale
    const ah = att.attH * props.cellSize * att.scale
    minX = Math.min(minX, cx - aw / 2)
    maxX = Math.max(maxX, cx + aw / 2)
    minY = Math.min(minY, cy - ah / 2)
    maxY = Math.max(maxY, cy + ah / 2)
  }

  const bboxW = maxX - minX
  const bboxH = maxY - minY

  const scaleX = wrapW / bboxW
  const scaleY = wrapH / bboxH
  const s = Math.min(scaleX, scaleY, 1)
  if (s >= 0.99) return undefined

  // Offset so the bounding box center maps to the wrapper center
  const bboxCx = (minX + maxX) / 2
  const bboxCy = (minY + maxY) / 2
  const tx = wrapW / 2 - bboxCx * s
  const ty = wrapH / 2 - bboxCy * s

  return {
    transform: `translate(${tx}px, ${ty}px) scale(${s})`,
    transformOrigin: '0 0'
  }
})

function attStyle(att: ResolvedAttachment) {
  const factor = props.cellSize / 64
  return {
    left: `calc(50% + ${0.5 * att.position[0] * factor}px)`,
    top: `calc(50% + ${0.5 * att.position[1] * factor}px)`,
    width: `${att.attW * props.cellSize * att.scale}px`,
    height: `${att.attH * props.cellSize * att.scale}px`,
    transform: `translate(-50%, -50%)${att.rotation ? ` rotate(${att.rotation}rad)` : ''}`,
    zIndex: att.behind ? 0 : 2
  }
}
</script>

<template>
  <div class="absolute" :style="wrapperStyle">
    <template v-if="iconUrl">
      <div class="absolute inset-0" :style="fitTransform">
        <img
          :src="iconUrl"
          class="absolute inset-0 w-full h-full object-contain"
          style="z-index: 1"
          draggable="false"
        />
        <img
          v-for="(entry, i) in loadedAttachments"
          :key="i"
          :src="entry.url"
          class="absolute object-contain pointer-events-none"
          :style="attStyle(entry.att)"
          draggable="false"
        />
      </div>
    </template>
  </div>
</template>
