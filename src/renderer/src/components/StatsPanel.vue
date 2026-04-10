<script setup lang="ts">
import { useSaveEditor } from '../composables/useSaveEditor'
import type { CharacterStats, StatusEffects } from '../lib/types'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Slider } from '../components/ui/slider'
import { Heart, Zap, Droplets, Thermometer, Brain } from 'lucide-vue-next'
import type { Component } from 'vue'

const { stats, statusEffects, tresFile, updateStat, maxAllStats, updateStatusEffect } =
  useSaveEditor()

interface StatConfig {
  key: keyof CharacterStats
  label: string
  color: string
  trackColor: string
  icon: Component
}

const statConfigs: StatConfig[] = [
  {
    key: 'health',
    label: 'Health',
    color: 'bg-red-500',
    trackColor: '[&_[data-orientation=horizontal]>.absolute]:bg-red-500',
    icon: Heart
  },
  {
    key: 'energy',
    label: 'Energy',
    color: 'bg-amber-500',
    trackColor: '[&_[data-orientation=horizontal]>.absolute]:bg-amber-500',
    icon: Zap
  },
  {
    key: 'hydration',
    label: 'Hydration',
    color: 'bg-blue-500',
    trackColor: '[&_[data-orientation=horizontal]>.absolute]:bg-blue-500',
    icon: Droplets
  },
  {
    key: 'temperature',
    label: 'Temperature',
    color: 'bg-orange-500',
    trackColor: '[&_[data-orientation=horizontal]>.absolute]:bg-orange-500',
    icon: Thermometer
  },
  {
    key: 'mental',
    label: 'Mental',
    color: 'bg-violet-500',
    trackColor: '[&_[data-orientation=horizontal]>.absolute]:bg-violet-500',
    icon: Brain
  }
]

interface EffectConfig {
  key: keyof StatusEffects
  label: string
}

const effectConfigs: EffectConfig[] = [
  { key: 'bleeding', label: 'Bleeding' },
  { key: 'fracture', label: 'Fracture' },
  { key: 'burn', label: 'Burn' },
  { key: 'frostbite', label: 'Frostbite' },
  { key: 'starvation', label: 'Starvation' },
  { key: 'dehydration', label: 'Dehydration' },
  { key: 'insanity', label: 'Insanity' },
  { key: 'rupture', label: 'Rupture' }
]

function onSliderChange(key: keyof CharacterStats, value: number[] | undefined): void {
  if (value) updateStat(key, value[0])
}

function onInputChange(key: keyof CharacterStats, event: Event): void {
  const value = parseFloat((event.target as HTMLInputElement).value)
  if (!isNaN(value)) {
    updateStat(key, Math.max(0, Math.min(100, value)))
  }
}
</script>

<template>
  <div v-if="tresFile" class="max-w-xl space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold">Character Stats</h2>
      <Button size="sm" variant="secondary" @click="maxAllStats">Max All</Button>
    </div>

    <div class="space-y-4">
      <div v-for="stat in statConfigs" :key="stat.key" class="space-y-1.5">
        <div class="flex items-center gap-2">
          <component :is="stat.icon" class="h-4 w-4 text-muted-foreground" />
          <label class="text-sm font-medium flex-1">{{ stat.label }}</label>
          <Input
            type="number"
            :model-value="String(Math.round(stats[stat.key] * 10) / 10)"
            class="h-7 w-20 text-xs text-right"
            min="0"
            max="100"
            step="1"
            @change="onInputChange(stat.key, $event)"
          />
        </div>
        <Slider
          :model-value="[stats[stat.key]]"
          :max="100"
          :step="1"
          :class="stat.trackColor"
          @update:model-value="onSliderChange(stat.key, $event)"
        />
      </div>
    </div>

    <div class="pt-2">
      <h3 class="text-sm font-semibold text-muted-foreground mb-3">Status Effects</h3>
      <div class="grid grid-cols-2 gap-2">
        <label
          v-for="effect in effectConfigs"
          :key="effect.key"
          class="flex items-center gap-2 text-sm cursor-pointer select-none rounded-md border border-border px-3 py-2 hover:bg-muted/50 transition-colors"
          :class="statusEffects[effect.key] ? 'border-destructive bg-destructive/10' : ''"
        >
          <input
            type="checkbox"
            :checked="statusEffects[effect.key]"
            class="accent-destructive"
            @change="updateStatusEffect(effect.key, ($event.target as HTMLInputElement).checked)"
          />
          {{ effect.label }}
        </label>
      </div>
    </div>
  </div>
</template>
