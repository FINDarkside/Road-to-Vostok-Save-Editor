<script setup lang="ts">
import { useToast } from '../composables/useToast'
import { X } from 'lucide-vue-next'

const { toasts, dismiss } = useToast()
</script>

<template>
  <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
    <TransitionGroup
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-2 opacity-0"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="flex items-start gap-2 rounded-md border px-4 py-3 shadow-lg text-sm"
        :class="{
          'border-destructive/50 bg-destructive/10 text-destructive': toast.type === 'error',
          'border-green-500/50 bg-green-500/10 text-green-400': toast.type === 'success'
        }"
      >
        <span class="flex-1">{{ toast.message }}</span>
        <button class="opacity-50 hover:opacity-100 shrink-0 mt-0.5" @click="dismiss(toast.id)">
          <X class="h-3.5 w-3.5" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>
