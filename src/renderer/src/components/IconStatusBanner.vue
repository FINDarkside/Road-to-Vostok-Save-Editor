<script setup lang="ts">
import { useItemIcons } from '../composables/useItemIcons'
import { Button } from '../components/ui/button'
import { ref } from 'vue'

const { status, progress, total, error, retry } = useItemIcons()

const dismissed = ref(false)

function dismiss(): void {
  dismissed.value = true
}
</script>

<template>
  <!-- Extracting: progress bar -->
  <div
    v-if="status === 'extracting'"
    class="mt-auto px-4 py-1.5 bg-muted border-t border-border flex items-center gap-3 text-xs text-muted-foreground"
  >
    <span class="whitespace-nowrap">
      Extracting item icons{{ total > 0 ? `... (${progress}/${total})` : '...' }}
    </span>
    <div class="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
      <div
        class="h-full rounded-full bg-primary transition-all"
        :style="{ width: total > 0 ? `${(progress / total) * 100}%` : '0%' }"
      />
    </div>
  </div>

  <!-- Error: red banner with retry -->
  <div
    v-else-if="status === 'error' && !dismissed"
    class="mt-auto px-4 py-1.5 bg-destructive/10 border-t border-destructive/30 flex items-center gap-3 text-xs"
  >
    <span class="flex-1 text-destructive">Failed to extract item icons: {{ error }}</span>
    <Button variant="outline" size="sm" class="h-6 px-2 text-xs" @click="retry">Retry</Button>
    <Button variant="ghost" size="sm" class="h-6 px-2 text-xs" @click="dismiss">Dismiss</Button>
  </div>

  <!-- Not found: subtle info -->
  <div
    v-else-if="status === 'not-found' && !dismissed"
    class="mt-auto px-4 py-1 bg-muted/50 border-t border-border flex items-center gap-3 text-xs text-muted-foreground"
  >
    <span class="flex-1">Game installation not found — item icons unavailable</span>
    <Button variant="ghost" size="sm" class="h-6 px-2 text-xs" @click="dismiss">Dismiss</Button>
  </div>
</template>
