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
  }>(),
  { rotated: false }
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
  const atts = resolvedAttachments.value
  if (atts.length > 0) {
    const loaded: { att: ResolvedAttachment; url: string }[] = []
    for (const att of atts) {
      const url = await loadIcon(att.iconFile)
      if (url) loaded.push({ att, url })
    }
    loadedAttachments.value = loaded
  }
}

onMounted(load)
watch([() => status.value, () => props.iconFile], () => {
  iconUrl.value = null
  load()
})

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
    </template>
  </div>
</template>
