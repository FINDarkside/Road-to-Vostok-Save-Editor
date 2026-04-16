import { ref, computed } from 'vue'
import type { TresFile } from '../lib/tres/types'
import type {
  SlotItem,
  CharacterStats,
  StatusEffects,
  CatStatus,
  WorldState,
  SaveFileInfo
} from '../lib/types'
import { parseTresFile } from '../lib/tres/parser'
import { serializeTresFile } from '../lib/tres/serializer'
import {
  parseCharacter,
  serializeCharacter,
  parseWorld,
  serializeWorld,
  parseTraders,
  serializeTraders,
  newSubResourceId,
  type CharacterResource,
  type WorldResource,
  type TradersResource,
  type SlotItemData
} from '../lib/tres/codec'
import { ITEMS_BY_PATH, ITEMS_META } from '../data/items'
import { ATTACHMENT_SUBTYPE, getWeaponSlots } from '../data/attachment-subtypes'
import type { TraderKey } from '../data/quests'

const currentFile = ref<SaveFileInfo | null>(null)

// Source TresFiles — kept for overlay-based serialization and for legacy
// consumers that still null-check these refs. Not the source of truth for
// edits; all mutations flow through the typed `character`/`world`/`traders`.
const tresFile = ref<TresFile | null>(null)
const worldFile = ref<TresFile | null>(null)
const tradersFile = ref<TresFile | null>(null)

// Typed resource state — the authoritative, user-facing data
const character = ref<CharacterResource | null>(null)
const world = ref<WorldResource | null>(null)
const traders = ref<TradersResource | null>(null)

const isLoading = ref(false)
const isDirty = ref(false)
const loadError = ref<string | null>(null)
const worldLoadError = ref<string | null>(null)
const tradersLoadError = ref<string | null>(null)

// ---------- View-model projection ----------

function slotItemDataToSlotItem(data: SlotItemData): SlotItem {
  const itemPath = data.itemData
  const catalogItem = ITEMS_BY_PATH.get(itemPath)
  const itemMeta = ITEMS_META.get(itemPath)
  const armorPlatePath = data.nested.find((p) => ITEMS_BY_PATH.get(p)?.plate) ?? ''
  const armorPlate = armorPlatePath ? ITEMS_BY_PATH.get(armorPlatePath) : undefined
  const isPlatedRig = catalogItem?.carrier === true && !!armorPlate

  return {
    subResourceId: data.id,
    itemPath,
    itemName:
      catalogItem?.displayName ?? itemPath.split('/').pop()?.replace('.tres', '') ?? 'Unknown',
    nameInventory: catalogItem?.nameInventory ?? catalogItem?.displayName ?? 'Unknown',
    nameRotated:
      catalogItem?.nameRotated ??
      catalogItem?.nameInventory ??
      catalogItem?.displayName ??
      'Unknown',
    nameEquipment:
      catalogItem?.nameEquipment ??
      catalogItem?.nameInventory ??
      catalogItem?.displayName ??
      'Unknown',
    category: catalogItem?.category ?? '',
    condition: data.condition,
    showCondition: (itemMeta?.showCondition ?? false) || isPlatedRig,
    amount: data.amount,
    showAmount: itemMeta?.showAmount ?? false,
    chamber: data.chamber,
    gridPosition: { x: data.gridPosition.x, y: data.gridPosition.y },
    gridRotated: data.gridRotated,
    slot: data.slot,
    nested: data.nested,
    armorRating: armorPlate?.armorRating ?? catalogItem?.armorRating ?? '',
    carrier: catalogItem?.carrier ?? false,
    armorPlatePath
  }
}

const items = computed<SlotItem[]>(() =>
  character.value ? character.value.inventory.map(slotItemDataToSlotItem) : []
)

const equipment = computed<SlotItem[]>(() =>
  character.value ? character.value.equipment.map(slotItemDataToSlotItem) : []
)

const catalogItems = computed<SlotItem[]>(() =>
  character.value ? character.value.catalog.map(slotItemDataToSlotItem) : []
)

const stats = computed<CharacterStats>(() => {
  const c = character.value
  if (!c) return { health: 0, energy: 0, hydration: 0, temperature: 0, mental: 0 }
  return {
    health: c.health,
    energy: c.energy,
    hydration: c.hydration,
    temperature: c.temperature,
    mental: c.mental
  }
})

const statusEffects = computed<StatusEffects>(() => {
  const c = character.value
  if (!c)
    return {
      starvation: false,
      dehydration: false,
      bleeding: false,
      fracture: false,
      burn: false,
      frostbite: false,
      insanity: false,
      rupture: false,
      headshot: false
    }
  return {
    starvation: c.starvation,
    dehydration: c.dehydration,
    bleeding: c.bleeding,
    fracture: c.fracture,
    burn: c.burn,
    frostbite: c.frostbite,
    insanity: c.insanity,
    rupture: c.rupture,
    headshot: c.headshot
  }
})

const catStatus = computed<CatStatus>(() => {
  const c = character.value
  if (!c) return { cat: 0, catFound: false, catDead: false }
  return { cat: c.cat, catFound: c.catFound, catDead: c.catDead }
})

const worldState = computed<WorldState>(() => {
  const w = world.value
  if (!w) return { difficulty: 1, season: 1, day: 1, weather: 'Neutral' }
  return { difficulty: w.difficulty, season: w.season, day: w.day, weather: w.weather }
})

const questCompletion = computed<Record<TraderKey, string[]>>(() => {
  const t = traders.value
  if (!t) return { generalist: [], doctor: [], gunsmith: [], grandma: [] }
  return {
    generalist: t.generalist,
    doctor: t.doctor,
    gunsmith: t.gunsmith,
    grandma: t.grandma
  }
})

// ---------- Composable ----------

export function useSaveEditor() {
  async function init(): Promise<void> {
    isLoading.value = true
    loadError.value = null
    worldLoadError.value = null
    tradersLoadError.value = null

    try {
      const content = await window.api.loadSave('Character.tres')
      const tres = parseTresFile(content)
      tresFile.value = tres
      character.value = parseCharacter(tres)
      currentFile.value = { fileName: 'Character.tres' }
      isDirty.value = false
    } catch (e) {
      loadError.value = e instanceof Error ? e.message : 'Failed to load Character.tres'
    }

    try {
      const worldContent = await window.api.loadSave('World.tres')
      const tres = parseTresFile(worldContent)
      worldFile.value = tres
      world.value = parseWorld(tres)
    } catch (e) {
      worldLoadError.value = e instanceof Error ? e.message : 'Failed to load World.tres'
    }

    try {
      const tradersContent = await window.api.loadSave('Traders.tres')
      const tres = parseTresFile(tradersContent)
      tradersFile.value = tres
      traders.value = parseTraders(tres)
    } catch (e) {
      tradersLoadError.value = e instanceof Error ? e.message : 'Failed to load Traders.tres'
    }

    isLoading.value = false
  }

  async function saveFile(): Promise<void> {
    if (!character.value || !tresFile.value || !currentFile.value) return
    await window.api.backupSave()

    const newCharTres = serializeCharacter(character.value, tresFile.value)
    await window.api.saveSave(currentFile.value.fileName, serializeTresFile(newCharTres))
    tresFile.value = newCharTres

    if (world.value && worldFile.value) {
      const newWorldTres = serializeWorld(world.value, worldFile.value)
      await window.api.saveSave('World.tres', serializeTresFile(newWorldTres))
      worldFile.value = newWorldTres
    }

    if (traders.value && tradersFile.value) {
      const newTradersTres = serializeTraders(traders.value, tradersFile.value)
      await window.api.saveSave('Traders.tres', serializeTresFile(newTradersTres))
      tradersFile.value = newTradersTres
    }

    isDirty.value = false
  }

  // --- Inventory / equipment / catalog mutations ---

  function findAndRemove(id: string): SlotItemData | null {
    const c = character.value
    if (!c) return null
    for (const target of ['inventory', 'equipment', 'catalog'] as const) {
      const arr = c[target]
      const idx = arr.findIndex((i) => i.id === id)
      if (idx >= 0) {
        const [removed] = arr.splice(idx, 1)
        return removed
      }
    }
    return null
  }

  function markDirty(): void {
    isDirty.value = true
    if (character.value) character.value = { ...character.value }
  }

  function markWorldDirty(): void {
    isDirty.value = true
    if (world.value) world.value = { ...world.value }
  }

  function markTradersDirty(): void {
    isDirty.value = true
    if (traders.value) traders.value = { ...traders.value }
  }

  function freshSlotItem(
    resourcePath: string,
    opts: {
      condition?: number
      amount?: number
      gridCol?: number
      gridRow?: number
      gridRotated?: boolean
      nestedPaths?: string[]
      slot?: string
    }
  ): SlotItemData {
    const meta = ITEMS_META.get(resourcePath)
    return {
      id: tresFile.value
        ? newSubResourceId(tresFile.value)
        : 'Resource_' + Math.random().toString(36).slice(2, 7),
      script: 'res://Scripts/SlotData.gd',
      itemData: resourcePath,
      nested: opts.nestedPaths ?? [],
      storage: [],
      condition: opts.condition ?? meta?.defaultCondition ?? 0,
      amount: opts.amount ?? meta?.defaultAmount ?? 0,
      position: 0,
      mode: 1,
      zoom: 1,
      chamber: false,
      casing: false,
      state: '',
      gridPosition: { x: (opts.gridCol ?? 0) * 64, y: (opts.gridRow ?? 0) * 64 },
      gridRotated: opts.gridRotated ?? false,
      slot: opts.slot ?? ''
    }
  }

  function addItem(
    resourcePath: string,
    opts: {
      condition?: number
      amount?: number
      gridCol?: number
      gridRow?: number
      gridRotated?: boolean
      nestedPaths?: string[]
    } = {}
  ): void {
    if (!character.value) return
    character.value.inventory.push(freshSlotItem(resourcePath, opts))
    markDirty()
  }

  function addCatalogItem(
    resourcePath: string,
    opts: {
      condition?: number
      amount?: number
      gridCol?: number
      gridRow?: number
      gridRotated?: boolean
      nestedPaths?: string[]
    } = {}
  ): void {
    if (!character.value) return
    character.value.catalog.push(freshSlotItem(resourcePath, opts))
    markDirty()
  }

  function addEquipmentItem(
    resourcePath: string,
    slotName: string,
    opts: { condition?: number; amount?: number; nestedPaths?: string[] } = {}
  ): void {
    if (!character.value) return
    character.value.equipment.push(freshSlotItem(resourcePath, { ...opts, slot: slotName }))
    markDirty()
  }

  function removeItem(subResourceId: string): void {
    if (!character.value) return
    findAndRemove(subResourceId)
    markDirty()
  }

  function findItemInAnyArray(id: string): SlotItemData | undefined {
    const c = character.value
    if (!c) return undefined
    return (
      c.inventory.find((i) => i.id === id) ??
      c.equipment.find((i) => i.id === id) ??
      c.catalog.find((i) => i.id === id)
    )
  }

  // --- Weapon / rig operations ---

  function setWeaponNested(subResourceId: string, nestedPaths: string[]): void {
    if (!character.value) return
    const weapon = findItemInAnyArray(subResourceId)
    if (!weapon) return

    const oldMag = weapon.nested.find((p) => ATTACHMENT_SUBTYPE.get(p) === 'Magazine')
    const newMag = nestedPaths.find((p) => ATTACHMENT_SUBTYPE.get(p) === 'Magazine')

    weapon.nested = [...nestedPaths]

    if (oldMag !== newMag) {
      weapon.amount = newMag ? (ITEMS_META.get(newMag)?.defaultAmount ?? 0) : 0
    }
    markDirty()
  }

  function installWeaponAttachment(
    weaponSubResourceId: string,
    attachmentSubResourceId: string,
    ejectedSlot?: { col: number; row: number; rotated: boolean } | null
  ): boolean {
    if (!character.value) return false
    const weapon = findItemInAnyArray(weaponSubResourceId)
    const attachment = findItemInAnyArray(attachmentSubResourceId)
    if (!weapon || !attachment) return false

    const subtype = ATTACHMENT_SUBTYPE.get(attachment.itemData)
    if (!subtype) return false

    const compatible = getWeaponSlots(weapon.itemData)
      .get(subtype)
      ?.some((o) => o.itemPath === attachment.itemData)
    if (!compatible) return false

    const ejectedPath = weapon.nested.find((path) => ATTACHMENT_SUBTYPE.get(path) === subtype)
    if (ejectedPath && !ejectedSlot) return false

    const nextNested = weapon.nested.filter((path) => ATTACHMENT_SUBTYPE.get(path) !== subtype)
    nextNested.push(attachment.itemData)

    const oldWeaponAmount = weapon.amount
    const looseAttachmentAmount = attachment.amount

    // Eject existing attachment back to inventory
    if (ejectedPath && ejectedSlot) {
      character.value.inventory.push(
        freshSlotItem(ejectedPath, {
          amount: subtype === 'Magazine' ? oldWeaponAmount : undefined,
          gridCol: ejectedSlot.col,
          gridRow: ejectedSlot.row,
          gridRotated: ejectedSlot.rotated
        })
      )
    }

    weapon.nested = nextNested
    if (subtype === 'Magazine') {
      weapon.amount = looseAttachmentAmount
    }
    findAndRemove(attachmentSubResourceId)

    markDirty()
    return true
  }

  function removeWeaponAttachment(
    weaponSubResourceId: string,
    attachmentPath: string,
    slot: { col: number; row: number; rotated: boolean }
  ): boolean {
    if (!character.value) return false
    const weapon = findItemInAnyArray(weaponSubResourceId)
    if (!weapon) return false
    if (!weapon.nested.includes(attachmentPath)) return false

    const subtype = ATTACHMENT_SUBTYPE.get(attachmentPath)
    const amount = subtype === 'Magazine' ? weapon.amount : undefined

    character.value.inventory.push(
      freshSlotItem(attachmentPath, {
        amount,
        gridCol: slot.col,
        gridRow: slot.row,
        gridRotated: slot.rotated
      })
    )

    weapon.nested = weapon.nested.filter((p) => p !== attachmentPath)
    if (subtype === 'Magazine') {
      weapon.amount = 0
    }

    markDirty()
    return true
  }

  function setRigArmorPlate(
    subResourceId: string,
    platePath: string | null,
    condition?: number
  ): void {
    if (!character.value) return
    const rig = findItemInAnyArray(subResourceId)
    if (!rig) return

    rig.nested = platePath ? [platePath] : []
    rig.condition = platePath ? (condition ?? rig.condition) : 100

    markDirty()
  }

  // --- Stats / status / cat / world ---

  function updateStat(key: keyof CharacterStats, value: number): void {
    if (!character.value) return
    character.value[key] = value
    markDirty()
  }

  function updateStatusEffect(key: keyof StatusEffects, value: boolean): void {
    if (!character.value) return
    character.value[key] = value
    markDirty()
  }

  function updateCatHealth(value: number): void {
    if (!character.value) return
    character.value.cat = value
    markDirty()
  }

  function reviveCat(): void {
    if (!character.value) return
    character.value.catDead = false
    character.value.cat = 100
    markDirty()
  }

  function killCat(): void {
    if (!character.value) return
    character.value.catDead = true
    markDirty()
  }

  function maxAllStats(): void {
    if (!character.value) return
    character.value.health = 100
    character.value.energy = 100
    character.value.hydration = 100
    character.value.temperature = 100
    character.value.mental = 100
    markDirty()
  }

  function updateWorldProp(key: keyof WorldState, value: number | string): void {
    if (!world.value) return
    if (key === 'weather' && typeof value === 'string') {
      world.value.weather = value
    } else if (typeof value === 'number' && key !== 'weather') {
      world.value[key] = value
    }
    markWorldDirty()
  }

  // --- Item field edits / moves ---

  function updateItem(
    subResourceId: string,
    updates: { condition?: number; amount?: number }
  ): void {
    const item = findItemInAnyArray(subResourceId)
    if (!item) return
    if (updates.condition !== undefined) item.condition = updates.condition
    if (updates.amount !== undefined) item.amount = updates.amount
    markDirty()
  }

  function updateItemGridPosition(
    subResourceId: string,
    col: number,
    row: number,
    gridRotated: boolean
  ): void {
    const item = findItemInAnyArray(subResourceId)
    if (!item) return
    item.gridPosition = { x: col * 64, y: row * 64 }
    item.gridRotated = gridRotated
    markDirty()
  }

  function moveToInventory(
    subResourceId: string,
    col: number,
    row: number,
    rotated: boolean
  ): void {
    if (!character.value) return
    const item = findAndRemove(subResourceId)
    if (!item) return
    item.slot = ''
    item.gridPosition = { x: col * 64, y: row * 64 }
    item.gridRotated = rotated
    character.value.inventory.push(item)
    markDirty()
  }

  function moveToEquipment(subResourceId: string, slotName: string): void {
    if (!character.value) return
    const item = findAndRemove(subResourceId)
    if (!item) return
    item.slot = slotName
    item.gridPosition = { x: 0, y: 0 }
    item.gridRotated = false
    character.value.equipment.push(item)
    markDirty()
  }

  function setEquipmentSlot(subResourceId: string, slotName: string): void {
    const item = findItemInAnyArray(subResourceId)
    if (!item) return
    item.slot = slotName
    markDirty()
  }

  function swapEquipmentSlots(id1: string, slot1: string, id2: string, slot2: string): void {
    const a = findItemInAnyArray(id1)
    const b = findItemInAnyArray(id2)
    if (!a || !b) return
    a.slot = slot2
    b.slot = slot1
    markDirty()
  }

  // --- Quests ---

  function toggleQuestCompletion(traderKey: TraderKey, questName: string): void {
    if (!traders.value) return
    const list = traders.value[traderKey]
    const idx = list.indexOf(questName)
    if (idx >= 0) list.splice(idx, 1)
    else list.push(questName)
    markTradersDirty()
  }

  function setAllQuestsForTrader(
    traderKey: TraderKey,
    questNames: string[],
    completed: boolean
  ): void {
    if (!traders.value) return
    if (completed) {
      const existing = new Set(traders.value[traderKey])
      for (const name of questNames) {
        if (!existing.has(name)) traders.value[traderKey].push(name)
      }
    } else {
      const toRemove = new Set(questNames)
      traders.value[traderKey] = traders.value[traderKey].filter((q) => !toRemove.has(q))
    }
    markTradersDirty()
  }

  return {
    currentFile,
    items,
    equipment,
    catalogItems,
    stats,
    statusEffects,
    catStatus,
    worldState,
    worldFile,
    worldLoadError,
    tradersFile,
    tradersLoadError,
    questCompletion,
    toggleQuestCompletion,
    setAllQuestsForTrader,
    isLoading,
    isDirty,
    loadError,
    tresFile,
    init,
    saveFile,
    addItem,
    addCatalogItem,
    addEquipmentItem,
    removeItem,
    setWeaponNested,
    installWeaponAttachment,
    removeWeaponAttachment,
    setRigArmorPlate,
    updateStat,
    maxAllStats,
    updateStatusEffect,
    updateCatHealth,
    reviveCat,
    killCat,
    updateWorldProp,
    updateItem,
    updateItemGridPosition,
    moveToInventory,
    moveToEquipment,
    setEquipmentSlot,
    swapEquipmentSlots
  }
}
