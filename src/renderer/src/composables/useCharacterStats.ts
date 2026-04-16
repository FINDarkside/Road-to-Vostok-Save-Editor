import { character, markDirty } from './saveEditorState'

export function updateStat(
  key: 'health' | 'energy' | 'hydration' | 'temperature' | 'mental',
  value: number
): void {
  if (!character.value) return
  character.value[key] = value
  markDirty()
}

export function updateStatusEffect(
  key:
    | 'starvation'
    | 'dehydration'
    | 'bleeding'
    | 'fracture'
    | 'burn'
    | 'frostbite'
    | 'insanity'
    | 'rupture'
    | 'headshot',
  value: boolean
): void {
  if (!character.value) return
  character.value[key] = value
  markDirty()
}

export function updateCatHealth(value: number): void {
  if (!character.value) return
  character.value.cat = value
  markDirty()
}

export function reviveCat(): void {
  if (!character.value) return
  character.value.catDead = false
  character.value.cat = 100
  markDirty()
}

export function killCat(): void {
  if (!character.value) return
  character.value.catDead = true
  markDirty()
}

export function maxAllStats(): void {
  if (!character.value) return
  character.value.health = 100
  character.value.energy = 100
  character.value.hydration = 100
  character.value.temperature = 100
  character.value.mental = 100
  markDirty()
}
