import { ref } from 'vue'
import { markDirty, world } from './saveEditorState'

export const SAFEHOUSES = [
  { name: 'Cabin', location: 'Village', fileName: 'Cabin.tres', requiresUnlock: false },
  { name: 'Attic', location: 'Village', fileName: 'Attic.tres', requiresUnlock: true },
  { name: 'Classroom', location: 'School', fileName: 'Classroom.tres', requiresUnlock: true },
  { name: 'Tent', location: 'Outpost', fileName: 'Tent.tres', requiresUnlock: false },
  { name: 'Bunker', location: 'Outpost', fileName: 'Bunker.tres', requiresUnlock: true }
] as const

export type SafehouseName = (typeof SAFEHOUSES)[number]['name']
export type SafehouseLocation = (typeof SAFEHOUSES)[number]['location']

const ALL_SAFEHOUSE_FILES = SAFEHOUSES.map((safehouse) => safehouse.fileName)

interface ShelterSnapshot {
  fileName: string
  content: string
  lastVisit: number
}

function createShelterSave(lastVisit?: number) {
  const visitLine = lastVisit === undefined ? '' : `lastVisit = ${lastVisit}\n`

  return `[gd_resource type="Resource" script_class="ShelterSave" load_steps=2 format=3]

[ext_resource type="Script" path="res://Scripts/ShelterSave.gd" id="1"]

[resource]
script = ExtResource("1")
initialVisit = true
${visitLine}`
}

function readLastVisit(content: string) {
  const resourceIndex = content.lastIndexOf('[resource]')
  if (resourceIndex < 0) return 0

  const match = content.slice(resourceIndex).match(/^lastVisit\s*=\s*(-?\d+)/m)
  return match ? Number.parseInt(match[1], 10) : 0
}

function setLastVisit(content: string, lastVisit: number) {
  const resourceIndex = content.lastIndexOf('[resource]')
  if (resourceIndex < 0) throw new Error('Shelter save is missing its [resource] section')

  const beforeResource = content.slice(0, resourceIndex)
  const resource = content.slice(resourceIndex)
  const existing = /^lastVisit\s*=.*$/m
  if (existing.test(resource)) {
    return beforeResource + resource.replace(existing, `lastVisit = ${lastVisit}`)
  }

  const lineEnding = content.includes('\r\n') ? '\r\n' : '\n'
  const anchor = /^initialVisit\s*=.*$/m
  if (anchor.test(resource)) {
    return (
      beforeResource +
      resource.replace(anchor, (line) => `${line}${lineEnding}lastVisit = ${lastVisit}`)
    )
  }

  return (
    beforeResource +
    resource.replace('[resource]', `[resource]${lineEnding}lastVisit = ${lastVisit}`)
  )
}

async function readShelterSnapshots() {
  const saves = await window.api.listSaves()
  const safehouseFiles = new Set<string>(ALL_SAFEHOUSE_FILES)
  const existingShelters = saves
    .map((save) => save.fileName)
    .filter((fileName) => safehouseFiles.has(fileName))

  return Promise.all(
    existingShelters.map(async (fileName): Promise<ShelterSnapshot> => {
      const content = await window.api.loadSave(fileName)
      return { fileName, content, lastVisit: readLastVisit(content) }
    })
  )
}

function findCurrentSafehouse(snapshots: ShelterSnapshot[]) {
  let highestVisit = 0
  let current: SafehouseName | null = null

  // The game scans the save directory and only replaces the current shelter
  // when it finds a strictly newer visit. Mirroring that behavior also makes
  // tied timestamps resolve to one location instead of producing ambiguity.
  for (const snapshot of snapshots) {
    if (snapshot.lastVisit <= highestVisit) continue

    highestVisit = snapshot.lastVisit
    current = SAFEHOUSES.find((safehouse) => safehouse.fileName === snapshot.fileName)?.name ?? null
  }

  return current
}

export const unlockedSafehouses = ref<Set<SafehouseName>>(new Set())
export const currentSafehouse = ref<SafehouseName | null>(null)
export const safehousesLoaded = ref(false)
export const safehousesLoadError = ref<string | null>(null)

let savedSafehouses = new Set<SafehouseName>()
let savedCurrentSafehouse: SafehouseName | null = null

export async function loadSafehouses() {
  safehousesLoaded.value = false
  safehousesLoadError.value = null

  try {
    const snapshots = await readShelterSnapshots()
    const fileNames = new Set(snapshots.map((snapshot) => snapshot.fileName))
    const unlocked = SAFEHOUSES.filter(
      (safehouse) => !safehouse.requiresUnlock || fileNames.has(safehouse.fileName)
    ).map((safehouse) => safehouse.name)
    const current = findCurrentSafehouse(snapshots)

    savedSafehouses = new Set(unlocked)
    savedCurrentSafehouse = current
    unlockedSafehouses.value = new Set(unlocked)
    currentSafehouse.value = current
    safehousesLoaded.value = true
  } catch (error) {
    unlockedSafehouses.value = new Set()
    currentSafehouse.value = null
    safehousesLoadError.value =
      error instanceof Error ? error.message : 'Failed to load safehouse status'
  }
}

export function isSafehouseUnlocked(name: SafehouseName) {
  return unlockedSafehouses.value.has(name)
}

export function unlockSafehouse(name: SafehouseName) {
  const safehouse = SAFEHOUSES.find((candidate) => candidate.name === name)
  if (!safehousesLoaded.value || !safehouse?.requiresUnlock || unlockedSafehouses.value.has(name)) {
    return
  }

  unlockedSafehouses.value = new Set(unlockedSafehouses.value).add(name)
  markDirty()
}

export function unlockAllSafehouses() {
  if (!safehousesLoaded.value) return

  const unlocked = new Set(unlockedSafehouses.value)
  for (const safehouse of SAFEHOUSES) {
    if (safehouse.requiresUnlock) unlocked.add(safehouse.name)
  }

  if (unlocked.size === unlockedSafehouses.value.size) return

  unlockedSafehouses.value = unlocked
  markDirty()
}

export function teleportToSafehouse(name: SafehouseName) {
  if (
    !safehousesLoaded.value ||
    !unlockedSafehouses.value.has(name) ||
    currentSafehouse.value === name
  ) {
    return
  }

  currentSafehouse.value = name
  markDirty()
}

export function hasLockedSafehouses() {
  return SAFEHOUSES.some(
    (safehouse) => safehouse.requiresUnlock && !unlockedSafehouses.value.has(safehouse.name)
  )
}

export async function saveSafehouseChanges() {
  const pending = SAFEHOUSES.filter(
    (safehouse) =>
      unlockedSafehouses.value.has(safehouse.name) && !savedSafehouses.has(safehouse.name)
  )

  const current = currentSafehouse.value
  const currentChanged = current !== savedCurrentSafehouse

  if (currentChanged && current) {
    const snapshots = await readShelterSnapshots()
    const worldVisit = world.value ? Math.trunc(world.value.day * 10000 + world.value.time) : 0
    const lastVisit = Math.max(worldVisit, ...snapshots.map((snapshot) => snapshot.lastVisit)) + 1
    const currentSafehouseDefinition = SAFEHOUSES.find((safehouse) => safehouse.name === current)
    if (!currentSafehouseDefinition) throw new Error(`Unknown safehouse: ${current}`)

    const existing = snapshots.find(
      (snapshot) => snapshot.fileName === currentSafehouseDefinition.fileName
    )

    if (existing) {
      await window.api.saveSave(existing.fileName, setLastVisit(existing.content, lastVisit))
    } else {
      const created = await window.api.createSave(
        currentSafehouseDefinition.fileName,
        createShelterSave(lastVisit)
      )

      if (!created) {
        const content = await window.api.loadSave(currentSafehouseDefinition.fileName)
        await window.api.saveSave(
          currentSafehouseDefinition.fileName,
          setLastVisit(content, lastVisit)
        )
      }
    }
  }

  for (const safehouse of pending) {
    if (currentChanged && safehouse.name === current) continue
    await window.api.createSave(safehouse.fileName, createShelterSave())
  }

  savedSafehouses = new Set(unlockedSafehouses.value)
  savedCurrentSafehouse = currentSafehouse.value
}
