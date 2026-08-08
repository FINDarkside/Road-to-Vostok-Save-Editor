<script setup lang="ts">
import { world } from '../composables/saveEditorState'
import { updateWorldProp } from '../composables/useWorldProps'
import {
  SAFEHOUSES,
  hasLockedSafehouses,
  isSafehouseUnlocked,
  safehousesLoaded,
  safehousesLoadError,
  unlockAllSafehouses,
  unlockSafehouse
} from '../composables/useSafehouses'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../components/ui/select'
import {
  Shield,
  Skull,
  Sun,
  Snowflake,
  Calendar,
  Cloud,
  House,
  MapPin,
  LockOpen
} from 'lucide-vue-next'

const difficulties = [
  { value: 1, label: 'Standard', description: 'Normal starting conditions' },
  { value: 2, label: 'Darkness', description: 'Random start time and weather, reduced vitals' },
  { value: 3, label: 'Ironman', description: 'Permadeath — dying erases all save data' }
] as const

const seasons = [
  { value: 1, label: 'Summer', icon: Sun },
  { value: 2, label: 'Winter', icon: Snowflake }
] as const

const weathers = ['Neutral', 'Overcast', 'Rain', 'Storm', 'Wind', 'Aurora', 'Fog'] as const

function onDayInput(event: Event): void {
  const value = parseInt((event.target as HTMLInputElement).value, 10)
  if (!isNaN(value) && value >= 1) {
    updateWorldProp('day', value)
  }
}
</script>

<template>
  <div v-if="world" class="max-w-xl space-y-6">
    <h2 class="text-lg font-semibold">World</h2>

    <!-- Difficulty -->
    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <Shield class="h-4 w-4 text-muted-foreground" />
        <label class="text-sm font-medium">Difficulty</label>
      </div>
      <div class="grid grid-cols-3 gap-2">
        <label
          v-for="d in difficulties"
          :key="d.value"
          class="flex flex-col items-center gap-1 text-sm cursor-pointer select-none rounded-md border border-border px-3 py-2 hover:bg-muted/50 transition-colors"
          :class="world.difficulty === d.value ? 'border-primary bg-primary/10' : ''"
        >
          <input
            type="radio"
            name="difficulty"
            :value="d.value"
            :checked="world.difficulty === d.value"
            class="sr-only"
            @change="updateWorldProp('difficulty', d.value)"
          />
          <span class="flex items-center gap-1.5 font-medium">
            <Skull v-if="d.value === 3" class="h-3.5 w-3.5" />
            {{ d.label }}
          </span>
          <span class="text-xs text-muted-foreground text-center">{{ d.description }}</span>
        </label>
      </div>
    </div>

    <!-- Season -->
    <div class="space-y-2">
      <label class="text-sm font-medium">Season</label>
      <div class="grid grid-cols-2 gap-2">
        <label
          v-for="s in seasons"
          :key="s.value"
          class="flex items-center justify-center gap-2 text-sm cursor-pointer select-none rounded-md border border-border px-3 py-2 hover:bg-muted/50 transition-colors"
          :class="world.season === s.value ? 'border-primary bg-primary/10' : ''"
        >
          <input
            type="radio"
            name="season"
            :value="s.value"
            :checked="world.season === s.value"
            class="sr-only"
            @change="updateWorldProp('season', s.value)"
          />
          <component :is="s.icon" class="h-3.5 w-3.5" />
          {{ s.label }}
        </label>
      </div>
    </div>

    <!-- Day -->
    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <Calendar class="h-4 w-4 text-muted-foreground" />
        <label class="text-sm font-medium">Day</label>
      </div>
      <Input
        type="number"
        :model-value="String(world.day)"
        class="w-28"
        min="1"
        step="1"
        @change="onDayInput"
      />
    </div>

    <!-- Weather -->
    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <Cloud class="h-4 w-4 text-muted-foreground" />
        <label class="text-sm font-medium">Weather</label>
      </div>
      <Select
        :model-value="world.weather"
        @update:model-value="
          (v) => {
            if (typeof v === 'string') updateWorldProp('weather', v)
          }
        "
      >
        <SelectTrigger class="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="w in weathers" :key="w" :value="w">
            {{ w }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- Safehouses -->
    <div class="space-y-3 border-t border-border pt-5">
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <House class="h-4 w-4 text-muted-foreground" />
          <div>
            <h3 class="text-sm font-medium">Safehouses</h3>
            <p class="text-xs text-muted-foreground">Unlock safehouses without using their keys</p>
          </div>
        </div>
        <Button
          v-if="safehousesLoaded && hasLockedSafehouses()"
          variant="outline"
          size="sm"
          @click="unlockAllSafehouses"
        >
          <LockOpen class="h-3.5 w-3.5" />
          Unlock all
        </Button>
      </div>

      <p v-if="safehousesLoadError" class="text-sm text-destructive">
        Could not load safehouse status: {{ safehousesLoadError }}
      </p>

      <div v-else class="space-y-2">
        <div
          v-for="safehouse in SAFEHOUSES"
          :key="safehouse.name"
          class="flex items-center justify-between gap-4 rounded-md border border-border px-3 py-2.5"
        >
          <div>
            <div class="text-sm font-medium">{{ safehouse.name }}</div>
            <div class="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin class="h-3 w-3" />
              {{ safehouse.location }}
            </div>
          </div>

          <Badge
            v-if="isSafehouseUnlocked(safehouse.name)"
            variant="outline"
            class="border-green-600/40 bg-green-500/10 text-green-600 dark:text-green-400"
          >
            Unlocked
          </Badge>
          <Button
            v-else
            size="sm"
            :disabled="!safehousesLoaded"
            @click="unlockSafehouse(safehouse.name)"
          >
            Unlock
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
