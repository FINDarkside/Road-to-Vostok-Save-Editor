<script setup lang="ts">
import { useSaveEditor } from '../composables/useSaveEditor'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Slider } from '../components/ui/slider'
import { Cat, Skull, Search } from 'lucide-vue-next'

const { catStatus, tresFile, updateCatHealth, reviveCat } = useSaveEditor()

function onSliderChange(value: number[] | undefined): void {
  if (value) updateCatHealth(value[0])
}

function onInputChange(event: Event): void {
  const value = parseFloat((event.target as HTMLInputElement).value)
  if (!isNaN(value)) {
    updateCatHealth(Math.max(0, Math.min(100, value)))
  }
}
</script>

<template>
  <div v-if="tresFile" class="max-w-xl space-y-6">
    <h2 class="text-lg font-semibold">Cat Companion</h2>

    <!-- Not found -->
    <div v-if="!catStatus.catFound" class="flex items-center gap-3 py-12 text-muted-foreground">
      <Search class="h-12 w-12" />
      <p class="text-sm">You haven't found the cat yet.</p>
    </div>

    <!-- Dead -->
    <div v-else-if="catStatus.catDead" class="flex items-center gap-4">
      <Skull class="h-10 w-10 text-muted-foreground" />
      <p class="text-sm text-muted-foreground">Your cat has died.</p>
      <Button variant="secondary" size="sm" @click="reviveCat">Revive Cat</Button>
    </div>

    <!-- Alive -->
    <div v-else class="space-y-4">
      <div class="flex items-center gap-3">
        <Cat class="h-8 w-8 text-green-500" />
        <span class="text-sm text-muted-foreground">Your cat is alive and well.</span>
      </div>

      <div class="space-y-1.5">
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium flex-1">Health</label>
          <Input
            type="number"
            :model-value="String(Math.round(catStatus.cat * 10) / 10)"
            class="h-7 w-20 text-xs text-right"
            min="0"
            max="100"
            step="1"
            @change="onInputChange($event)"
          />
        </div>
        <Slider
          :model-value="[catStatus.cat]"
          :max="100"
          :step="1"
          class="[&_[data-orientation=horizontal]>.absolute]:bg-green-500"
          @update:model-value="onSliderChange($event)"
        />
      </div>
    </div>
  </div>
</template>
