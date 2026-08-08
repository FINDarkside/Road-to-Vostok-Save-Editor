<script setup lang="ts">
import { world } from '../composables/saveEditorState'
import { updateWorldProp } from '../composables/useWorldProps'
import {
  SAFEHOUSES,
  currentSafehouse,
  hasLockedSafehouses,
  isSafehouseUnlocked,
  safehousesLoaded,
  safehousesLoadError,
  teleportToSafehouse,
  unlockAllSafehouses,
  unlockSafehouse,
  type SafehouseLocation
} from '../composables/useSafehouses'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
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
  Check,
  Cloud,
  House,
  Lock,
  LockOpen,
  Navigation
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

const safehouseRegions = [...new Set(SAFEHOUSES.map((safehouse) => safehouse.location))].map(
  (location) => ({
    location,
    safehouses: SAFEHOUSES.filter((safehouse) => safehouse.location === location)
  })
)

function getUnlockedCount(location: SafehouseLocation) {
  return SAFEHOUSES.filter(
    (safehouse) => safehouse.location === location && isSafehouseUnlocked(safehouse.name)
  ).length
}

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

    <!-- Safehouses -->
    <div class="space-y-3">
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <House class="h-4 w-4 text-muted-foreground" />
          <div>
            <h3 class="text-sm font-medium">Safehouses</h3>
            <p class="text-xs text-muted-foreground">
              Unlock safehouses or teleport between regions
            </p>
          </div>
        </div>
        <Button
          v-if="safehousesLoaded"
          variant="outline"
          size="sm"
          :class="!hasLockedSafehouses() ? 'invisible' : ''"
          :disabled="!hasLockedSafehouses()"
          @click="unlockAllSafehouses"
        >
          <LockOpen class="h-3.5 w-3.5" />
          Unlock all
        </Button>
      </div>

      <p v-if="safehousesLoadError" class="text-sm text-destructive">
        Could not load safehouse status: {{ safehousesLoadError }}
      </p>

      <div v-else class="overflow-hidden rounded-md border border-border">
        <section
          v-for="(region, regionIndex) in safehouseRegions"
          :key="region.location"
          :class="regionIndex > 0 ? 'border-t border-border' : ''"
        >
          <div class="flex min-h-9 items-center gap-2 bg-muted/50 px-3 py-1.5">
            <h4 class="text-xs font-medium">{{ region.location }}</h4>
            <span class="text-xs text-muted-foreground">
              {{ getUnlockedCount(region.location) }} of {{ region.safehouses.length }} unlocked
            </span>
          </div>

          <div
            v-for="safehouse in region.safehouses"
            :key="safehouse.name"
            class="grid min-h-13 grid-cols-[minmax(0,1fr)_8.5rem_5.5rem] items-center gap-3 border-t border-border px-3 py-2"
            :class="currentSafehouse === safehouse.name ? 'bg-primary/5' : ''"
          >
            <span
              class="truncate text-sm font-medium"
              :class="!isSafehouseUnlocked(safehouse.name) ? 'text-muted-foreground' : ''"
            >
              {{ safehouse.name }}
            </span>

            <span
              v-if="currentSafehouse === safehouse.name"
              class="flex items-center gap-1.5 text-xs font-medium"
            >
              <Navigation class="h-3.5 w-3.5" />
              Current location
            </span>
            <span
              v-else-if="!isSafehouseUnlocked(safehouse.name)"
              class="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <Lock class="h-3.5 w-3.5" />
              Locked
            </span>
            <span v-else class="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Check class="h-3.5 w-3.5" />
              Available
            </span>

            <div class="flex justify-end">
              <Button
                v-if="!isSafehouseUnlocked(safehouse.name)"
                size="sm"
                class="w-20"
                :disabled="!safehousesLoaded"
                @click="unlockSafehouse(safehouse.name)"
              >
                Unlock
              </Button>
              <Button
                v-else-if="currentSafehouse !== safehouse.name"
                variant="outline"
                size="sm"
                class="w-20"
                @click="teleportToSafehouse(safehouse.name)"
              >
                Teleport
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>

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
  </div>
</template>
