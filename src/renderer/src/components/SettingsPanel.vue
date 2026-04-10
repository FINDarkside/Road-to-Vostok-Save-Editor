<script setup lang="ts">
import { useItemIcons } from '../composables/useItemIcons'
import { Button } from '../components/ui/button'
import { LoaderCircle } from 'lucide-vue-next'

const { status, progress, total, error, reload } = useItemIcons()
</script>

<template>
  <div class="max-w-lg space-y-6">
    <div>
      <h2 class="text-sm font-semibold mb-3">Item Icons</h2>

      <div class="rounded-lg border border-border p-4 space-y-3">
        <!-- Status display -->
        <div class="flex items-center gap-2">
          <span class="text-sm text-muted-foreground">Status:</span>
          <span v-if="status === 'done'" class="text-sm text-green-400">Loaded</span>
          <span v-else-if="status === 'extracting'" class="text-sm text-yellow-400 flex items-center gap-1.5">
            <LoaderCircle class="h-3.5 w-3.5 animate-spin" />
            Extracting{{ total > 0 ? ` (${progress}/${total})` : '...' }}
          </span>
          <span v-else-if="status === 'error'" class="text-sm text-destructive">Error</span>
          <span v-else-if="status === 'not-found'" class="text-sm text-muted-foreground">
            Game not found
          </span>
          <span v-else class="text-sm text-muted-foreground">Idle</span>
        </div>

        <!-- Progress bar during extraction -->
        <div v-if="status === 'extracting'" class="h-1.5 rounded-full bg-secondary overflow-hidden">
          <div
            class="h-full rounded-full bg-primary transition-all"
            :style="{ width: total > 0 ? `${(progress / total) * 100}%` : '0%' }"
          />
        </div>

        <!-- Error message -->
        <p v-if="status === 'error'" class="text-xs text-destructive">{{ error }}</p>

        <!-- Not found explanation -->
        <p v-if="status === 'not-found'" class="text-xs text-muted-foreground">
          Could not find the Road to Vostok game installation. Icons are extracted from the game's
          PCK file and require the game to be installed via Steam.
        </p>

        <!-- Reload button -->
        <Button
          variant="outline"
          size="sm"
          class="text-xs"
          :disabled="status === 'extracting'"
          @click="reload"
        >
Reload Icons
        </Button>
      </div>
    </div>
  </div>
</template>
