<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useItemIcons } from '../composables/useItemIcons'
import { Button } from '../components/ui/button'
import { LoaderCircle, FolderOpen } from 'lucide-vue-next'

const { status, progress, total, error, reload } = useItemIcons()

const saveDir = ref('')

const openSaveDir = () => window.api.openSaveDir()

onMounted(async () => {
  saveDir.value = await window.api.getSaveDir()
})
</script>

<template>
  <div class="space-y-4 p-1">
    <!-- Save Location -->
    <div class="flex items-center gap-3">
      <span class="text-sm text-muted-foreground shrink-0">Save location</span>
      <span class="text-sm truncate select-text" :title="saveDir">{{ saveDir }}</span>
      <Button variant="ghost" size="icon" class="h-7 w-7 shrink-0" @click="openSaveDir">
        <FolderOpen class="h-4 w-4" />
      </Button>
    </div>

    <!-- Item Icons -->
    <div class="flex items-center gap-3">
      <span class="text-sm text-muted-foreground shrink-0">Item icons</span>

      <span v-if="status === 'done'" class="text-sm text-green-400">Loaded</span>
      <span
        v-else-if="status === 'extracting'"
        class="text-sm text-yellow-400 flex items-center gap-1.5"
      >
        <LoaderCircle class="h-3.5 w-3.5 animate-spin" />
        Extracting{{ total > 0 ? ` (${progress}/${total})` : '...' }}
      </span>
      <span v-else-if="status === 'error'" class="text-sm text-destructive">{{ error }}</span>
      <span v-else-if="status === 'not-found'" class="text-sm text-muted-foreground">
        Game not found
      </span>
      <span v-else class="text-sm text-muted-foreground">Idle</span>

      <Button
        variant="outline"
        size="sm"
        class="text-xs shrink-0"
        :disabled="status === 'extracting'"
        @click="reload"
      >
        Reload
      </Button>
    </div>

    <!-- Extraction progress bar -->
    <div v-if="status === 'extracting'" class="h-1.5 rounded-full bg-secondary overflow-hidden">
      <div
        class="h-full rounded-full bg-primary"
        :style="{ width: total > 0 ? `${(progress / total) * 100}%` : '0%' }"
      />
    </div>

    <!-- Not found explanation -->
    <p v-if="status === 'not-found'" class="text-xs text-muted-foreground">
      Icons are extracted from the game's PCK file and require the game to be installed via Steam.
    </p>
  </div>
</template>
