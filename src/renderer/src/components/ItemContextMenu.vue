<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Copy, Hammer, ShieldX, Trash2, Unplug, Wrench } from 'lucide-vue-next'
import type { AttachmentRemoveOption } from '../lib/types'

withDefaults(
  defineProps<{
    x: number
    y: number
    showEditLoadout?: boolean
    editLoadoutLabel?: string
    removePlateLabel?: string
    removeAttachmentOptions?: AttachmentRemoveOption[]
    showFullCondition?: boolean
    canDuplicate?: boolean
  }>(),
  {
    showEditLoadout: false,
    editLoadoutLabel: 'Edit Loadout',
    removePlateLabel: '',
    removeAttachmentOptions: () => [],
    showFullCondition: false,
    canDuplicate: true
  }
)

const emit = defineEmits<{
  duplicate: []
  delete: []
  editLoadout: []
  removePlate: []
  removeAttachment: [path: string]
  fullCondition: []
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
      class="fixed z-50 min-w-[170px] rounded-md border border-border bg-popover p-1 shadow-md"
      :style="{ left: `${x}px`, top: `${y}px` }"
    >
      <button
        v-if="showFullCondition"
        class="flex w-full items-center gap-2 whitespace-nowrap rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
        @click="emit('fullCondition')"
      >
        <Hammer class="h-3.5 w-3.5" />
        Set Full Condition
      </button>
      <button
        v-if="showEditLoadout"
        class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
        @click="emit('editLoadout')"
      >
        <Wrench class="h-3.5 w-3.5" />
        {{ editLoadoutLabel }}
      </button>
      <button
        v-if="removePlateLabel"
        class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
        @click="emit('removePlate')"
      >
        <ShieldX class="h-3.5 w-3.5" />
        {{ removePlateLabel }}
      </button>
      <button
        v-for="option in removeAttachmentOptions"
        :key="option.path"
        class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
        @click="emit('removeAttachment', option.path)"
      >
        <Unplug class="h-3.5 w-3.5" />
        {{ option.label }}
      </button>
      <button
        class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-inherit"
        :disabled="!canDuplicate"
        :title="canDuplicate ? undefined : 'Cannot duplicate modded items'"
        @click="canDuplicate && emit('duplicate')"
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
