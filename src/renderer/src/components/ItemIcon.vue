<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useItemIcons } from '../composables/useItemIcons'

const props = defineProps<{
  /** Item ID matching the icon filename (e.g. "AK-12", "Ammo_12x70") */
  itemId: string
  /** CSS class for sizing (default: h-6) */
  class?: string
}>()

const { status, loadIcon } = useItemIcons()
const iconUrl = ref<string | null>(null)

async function load(): Promise<void> {
  if (status.value !== 'done') return
  iconUrl.value = await loadIcon(props.itemId)
}

onMounted(load)

// Re-load when extraction finishes or itemId changes
watch([() => status.value, () => props.itemId], () => {
  iconUrl.value = null
  load()
})
</script>

<template>
  <img
    v-if="iconUrl"
    :src="iconUrl"
    :alt="itemId"
    :class="props.class ?? 'h-6'"
    class="object-contain"
  />
  <div v-else :class="props.class ?? 'h-6 w-6'" />
</template>
