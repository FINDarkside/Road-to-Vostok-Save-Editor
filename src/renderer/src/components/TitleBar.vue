<script setup lang="ts">
import { useSaveEditor } from '../composables/useSaveEditor'
import { Button } from '../components/ui/button'

const { isDirty, isLoading, saveFile, init } = useSaveEditor()
</script>

<template>
  <div class="flex items-center gap-3 border-b border-border px-4 py-2">
    <h1 class="text-sm font-semibold whitespace-nowrap">RTV Save Editor</h1>

    <div v-if="isDirty" class="text-xs text-muted-foreground">Unsaved changes</div>

    <div class="ml-auto flex items-center gap-2">
      <Button :disabled="isLoading" variant="outline" size="sm" @click="init">Refresh</Button>
      <Button :disabled="!isDirty || isLoading" size="sm" @click="saveFile">Save</Button>
    </div>
  </div>
</template>
