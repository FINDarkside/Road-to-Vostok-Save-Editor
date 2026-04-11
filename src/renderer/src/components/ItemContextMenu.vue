<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Copy, Trash2, Wrench } from 'lucide-vue-next'

withDefaults(
  defineProps<{
    x: number
    y: number
    showEditLoadout?: boolean
  }>(),
  { showEditLoadout: false }
)

const emit = defineEmits<{
  duplicate: []
  delete: []
  editLoadout: []
  close: []
}>()

const menuRef = ref<HTMLElement | null>(null)

function onClickOutside(e: MouseEvent) {
  if (menuRef.value && !menuRef.value.contains(e.target as Node)) {
    emit('close')
  }
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => {
  document.addEventListener('pointerdown', onClickOutside, true)
  document.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('pointerdown', onClickOutside, true)
  document.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
  <Teleport to="body">
    <div
      ref="menuRef"
      class="fixed z-50 min-w-[140px] rounded-md border border-border bg-popover p-1 shadow-md"
      :style="{ left: `${x}px`, top: `${y}px` }"
    >
      <button
        v-if="showEditLoadout"
        class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
        @click="emit('editLoadout')"
      >
        <Wrench class="h-3.5 w-3.5" />
        Edit Loadout
      </button>
      <button
        class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
        @click="emit('duplicate')"
      >
        <Copy class="h-3.5 w-3.5" />
        Duplicate
      </button>
      <button
        class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-400"
        @click="emit('delete')"
      >
        <Trash2 class="h-3.5 w-3.5" />
        Delete
      </button>
    </div>
  </Teleport>
</template>
