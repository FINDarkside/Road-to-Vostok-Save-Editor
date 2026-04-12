<script setup lang="ts">
import { useSaveEditor } from '../composables/useSaveEditor'
import { useToast } from '../composables/useToast'
import { Button } from '../components/ui/button'
import { Star } from 'lucide-vue-next'

const { isDirty, isLoading, saveFile, init } = useSaveEditor()
const toast = useToast()

async function handleSave() {
  try {
    await saveFile()
  } catch (e) {
    toast.show(`Save failed: ${e instanceof Error ? e.message : e}`)
  }
}
</script>

<template>
  <div class="flex items-center gap-3 border-b border-border px-4 py-2">
    <h1 class="text-sm font-semibold whitespace-nowrap">Road to Vostok Save Editor</h1>

    <div v-if="isDirty" class="text-xs text-muted-foreground">Unsaved changes</div>

    <div class="ml-auto flex items-center gap-2">
      <a
        href="https://github.com/FINDarkside/Road-to-Vostok-Save-Editor"
        target="_blank"
        class="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <Star :size="14" />
        Star on GitHub
      </a>
      <Button :disabled="isLoading" variant="outline" size="sm" @click="init">Refresh</Button>
      <Button :disabled="!isDirty || isLoading" size="sm" @click="handleSave">Save</Button>
    </div>
  </div>
</template>
