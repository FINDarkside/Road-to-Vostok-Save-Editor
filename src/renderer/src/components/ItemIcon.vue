<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useItemIcons } from '../composables/useItemIcons'

const props = defineProps<{
  /** Icon filename from game data (e.g. "Icon_AK-12.png") */
  iconFile: string
  /** CSS class for sizing (default: h-6) */
  class?: string
}>()

const { status, loadIcon } = useItemIcons()
const iconUrl = ref<string | null>(null)

async function load(): Promise<void> {
  if (status.value !== 'done' || !props.iconFile) return
  iconUrl.value = await loadIcon(props.iconFile)
}

onMounted(load)

watch([() => status.value, () => props.iconFile], () => {
  iconUrl.value = null
  load()
})
</script>

<template>
  <img
    v-if="iconUrl"
    :src="iconUrl"
    :alt="iconFile"
    :class="props.class ?? 'h-6'"
    class="object-contain"
  />
  <div v-else :class="props.class ?? 'h-6 w-6'" />
</template>
