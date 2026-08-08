import { ref } from 'vue'
import { markDirty } from './saveEditorState'

export const SAFEHOUSES = [
  { name: 'Attic', location: 'Village', fileName: 'Attic.tres' },
  { name: 'Classroom', location: 'School', fileName: 'Classroom.tres' },
  { name: 'Bunker', location: 'Outpost', fileName: 'Bunker.tres' }
] as const

export type SafehouseName = (typeof SAFEHOUSES)[number]['name']

const shelterSave = `[gd_resource type="Resource" script_class="ShelterSave" load_steps=2 format=3]

[ext_resource type="Script" path="res://Scripts/ShelterSave.gd" id="1"]

[resource]
script = ExtResource("1")
initialVisit = true
`

export const unlockedSafehouses = ref<Set<SafehouseName>>(new Set())
export const safehousesLoaded = ref(false)
export const safehousesLoadError = ref<string | null>(null)

let savedSafehouses = new Set<SafehouseName>()

export async function loadSafehouses() {
  safehousesLoaded.value = false
  safehousesLoadError.value = null

  try {
    const saves = await window.api.listSaves()
    const fileNames = new Set(saves.map((save) => save.fileName))
    const unlocked = SAFEHOUSES.filter((safehouse) => fileNames.has(safehouse.fileName)).map(
      (safehouse) => safehouse.name
    )

    savedSafehouses = new Set(unlocked)
    unlockedSafehouses.value = new Set(unlocked)
    safehousesLoaded.value = true
  } catch (error) {
    unlockedSafehouses.value = new Set()
    safehousesLoadError.value =
      error instanceof Error ? error.message : 'Failed to load safehouse status'
  }
}

export function isSafehouseUnlocked(name: SafehouseName) {
  return unlockedSafehouses.value.has(name)
}

export function unlockSafehouse(name: SafehouseName) {
  if (!safehousesLoaded.value || unlockedSafehouses.value.has(name)) return

  unlockedSafehouses.value = new Set(unlockedSafehouses.value).add(name)
  markDirty()
}

export function unlockAllSafehouses() {
  if (!safehousesLoaded.value) return

  const unlocked = new Set(unlockedSafehouses.value)
  for (const safehouse of SAFEHOUSES) unlocked.add(safehouse.name)

  if (unlocked.size === unlockedSafehouses.value.size) return

  unlockedSafehouses.value = unlocked
  markDirty()
}

export function hasLockedSafehouses() {
  return SAFEHOUSES.some((safehouse) => !unlockedSafehouses.value.has(safehouse.name))
}

export async function saveSafehouseUnlocks() {
  const pending = SAFEHOUSES.filter(
    (safehouse) =>
      unlockedSafehouses.value.has(safehouse.name) && !savedSafehouses.has(safehouse.name)
  )

  for (const safehouse of pending) {
    await window.api.createSave(safehouse.fileName, shelterSave)
  }

  savedSafehouses = new Set(unlockedSafehouses.value)
}
