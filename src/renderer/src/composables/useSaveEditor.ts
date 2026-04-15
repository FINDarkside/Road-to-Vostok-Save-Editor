import { ref, computed } from 'vue'
import type { TresFile, SubResource, Property, TresTypedArray } from '../lib/tres/types'
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
import { ITEMS_BY_PATH, ITEMS_META } from '../data/items'
import { ATTACHMENT_SUBTYPE, getWeaponSlots } from '../data/attachment-subtypes'
import type { TraderKey } from '../data/quests'

const currentFile = ref<SaveFileInfo | null>(null)
const tresFile = ref<TresFile | null>(null)
const worldFile = ref<TresFile | null>(null)
const tradersFile = ref<TresFile | null>(null)
const isLoading = ref(false)
const isDirty = ref(false)
const loadError = ref<string | null>(null)
const worldLoadError = ref<string | null>(null)
const tradersLoadError = ref<string | null>(null)

function getStringProp(props: Property[], key: string, fallback = ''): string {
  const prop = props.find((p) => p.key === key)
  if (!prop) return fallback
  return prop.value.kind === 'string' ? prop.value.value : fallback
}

function getNumberProp(props: Property[], key: string, fallback = 0): number {
  const prop = props.find((p) => p.key === key)
  if (!prop) return fallback
  if (prop.value.kind === 'int' || prop.value.kind === 'float') return prop.value.value
  return fallback
}

function getBoolProp(props: Property[], key: string, fallback = false): boolean {
  const prop = props.find((p) => p.key === key)
  if (!prop) return fallback
  return prop.value.kind === 'bool' ? prop.value.value : fallback
}

function resolveItemPath(tres: TresFile, sub: SubResource): string {
  const itemDataProp = sub.properties.find((p) => p.key === 'itemData')
  if (!itemDataProp || itemDataProp.value.kind !== 'ext_resource') return ''
  const extId = itemDataProp.value.id
  const ext = tres.extResources.find((e) => e.id === extId)
  return ext?.path ?? ''
}

function resolveNestedPaths(tres: TresFile, sub: SubResource): string[] {
  const nestedProp = sub.properties.find((p) => p.key === 'nested')
  if (!nestedProp || nestedProp.value.kind !== 'typed_array') return []
  return nestedProp.value.elements
    .filter((el): el is { kind: 'ext_resource'; id: string } => el.kind === 'ext_resource')
    .map((el) => {
      const ext = tres.extResources.find((e) => e.id === el.id)
      return ext?.path ?? ''
    })
    .filter(Boolean)
}

function subResourceToSlotItem(tres: TresFile, sub: SubResource): SlotItem {
  const itemPath = resolveItemPath(tres, sub)
  const catalogItem = ITEMS_BY_PATH.get(itemPath)
  const itemMeta = ITEMS_META.get(itemPath)
  const nested = resolveNestedPaths(tres, sub)
  const armorPlatePath = nested.find((path) => ITEMS_BY_PATH.get(path)?.plate) ?? ''
  const armorPlate = armorPlatePath ? ITEMS_BY_PATH.get(armorPlatePath) : undefined
  const isPlatedRig = catalogItem?.carrier === true && !!armorPlate

  return {
    subResourceId: sub.id,
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
    condition: getNumberProp(sub.properties, 'condition', itemMeta?.defaultCondition ?? 0),
    showCondition: (itemMeta?.showCondition ?? false) || isPlatedRig,
    amount: getNumberProp(sub.properties, 'amount', itemMeta?.defaultAmount ?? 0),
    showAmount: itemMeta?.showAmount ?? false,
    chamber: getBoolProp(sub.properties, 'chamber'),
    gridPosition: {
      x: getVector2Prop(sub.properties, 'gridPosition')?.x ?? 0,
      y: getVector2Prop(sub.properties, 'gridPosition')?.y ?? 0
    },
    gridRotated: getBoolProp(sub.properties, 'gridRotated'),
    slot: getStringProp(sub.properties, 'slot'),
    nested,
    armorRating: armorPlate?.armorRating ?? catalogItem?.armorRating ?? '',
    carrier: catalogItem?.carrier ?? false,
    armorPlatePath
  }
}

function getVector2Prop(props: Property[], key: string): { x: number; y: number } | null {
  const prop = props.find((p) => p.key === key)
  if (!prop || prop.value.kind !== 'vector2') return null
  return { x: prop.value.x, y: prop.value.y }
}

function getSubResourceIds(tres: TresFile, arrayKey: string): string[] {
  const prop = tres.resource.find((p) => p.key === arrayKey)
  if (!prop || prop.value.kind !== 'typed_array') return []
  return prop.value.elements
    .filter((el): el is { kind: 'sub_resource'; id: string } => el.kind === 'sub_resource')
    .map((el) => el.id)
}

const items = computed<SlotItem[]>(() => {
  if (!tresFile.value) return []
  const tres = tresFile.value
  const ids = getSubResourceIds(tres, 'inventory')
  return ids
    .map((id) => tres.subResources.find((s) => s.id === id))
    .filter((s): s is SubResource => !!s)
    .map((s) => subResourceToSlotItem(tres, s))
})

const equipment = computed<SlotItem[]>(() => {
  if (!tresFile.value) return []
  const tres = tresFile.value
  const ids = getSubResourceIds(tres, 'equipment')
  return ids
    .map((id) => tres.subResources.find((s) => s.id === id))
    .filter((s): s is SubResource => !!s)
    .map((s) => subResourceToSlotItem(tres, s))
})

const catalogItems = computed<SlotItem[]>(() => {
  if (!tresFile.value) return []
  const tres = tresFile.value
  const ids = getSubResourceIds(tres, 'catalog')
  return ids
    .map((id) => tres.subResources.find((s) => s.id === id))
    .filter((s): s is SubResource => !!s)
    .map((s) => subResourceToSlotItem(tres, s))
})

const stats = computed<CharacterStats>(() => {
  if (!tresFile.value) return { health: 0, energy: 0, hydration: 0, temperature: 0, mental: 0 }
  const res = tresFile.value.resource
  return {
    health: getNumberProp(res, 'health', 100),
    energy: getNumberProp(res, 'energy', 100),
    hydration: getNumberProp(res, 'hydration', 100),
    temperature: getNumberProp(res, 'temperature', 100),
    mental: getNumberProp(res, 'mental', 100)
  }
})

const statusEffects = computed<StatusEffects>(() => {
  if (!tresFile.value)
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
  const res = tresFile.value.resource
  return {
    starvation: getBoolProp(res, 'starvation'),
    dehydration: getBoolProp(res, 'dehydration'),
    bleeding: getBoolProp(res, 'bleeding'),
    fracture: getBoolProp(res, 'fracture'),
    burn: getBoolProp(res, 'burn'),
    frostbite: getBoolProp(res, 'frostbite'),
    insanity: getBoolProp(res, 'insanity'),
    rupture: getBoolProp(res, 'rupture'),
    headshot: getBoolProp(res, 'headshot')
  }
})

const catStatus = computed<CatStatus>(() => {
  if (!tresFile.value) return { cat: 0, catFound: false, catDead: false }
  const res = tresFile.value.resource
  return {
    cat: getNumberProp(res, 'cat', 100),
    catFound: getBoolProp(res, 'catFound'),
    catDead: getBoolProp(res, 'catDead')
  }
})

const worldState = computed<WorldState>(() => {
  if (!worldFile.value) return { difficulty: 1, season: 1, day: 1, weather: 'Neutral' }
  const res = worldFile.value.resource
  return {
    difficulty: getNumberProp(res, 'difficulty', 1),
    season: getNumberProp(res, 'season', 1),
    day: getNumberProp(res, 'day', 1),
    weather: getStringProp(res, 'weather', 'Neutral')
  }
})

function getStringArrayProp(props: Property[], key: string): string[] {
  const prop = props.find((p) => p.key === key)
  if (!prop || prop.value.kind !== 'typed_array') return []
  return prop.value.elements
    .filter((el): el is { kind: 'string'; value: string } => el.kind === 'string')
    .map((el) => el.value)
}

const questCompletion = computed<Record<TraderKey, string[]>>(() => {
  if (!tradersFile.value) return { generalist: [], doctor: [], gunsmith: [], grandma: [] }
  const res = tradersFile.value.resource
  return {
    generalist: getStringArrayProp(res, 'generalist'),
    doctor: getStringArrayProp(res, 'doctor'),
    gunsmith: getStringArrayProp(res, 'gunsmith'),
    grandma: getStringArrayProp(res, 'grandma')
  }
})

export function useSaveEditor() {
  async function init(): Promise<void> {
    isLoading.value = true
    loadError.value = null
    worldLoadError.value = null
    try {
      const content = await window.api.loadSave('Character.tres')
      tresFile.value = parseTresFile(content)
      currentFile.value = { fileName: 'Character.tres' }
      isDirty.value = false
    } catch (e) {
      loadError.value = e instanceof Error ? e.message : 'Failed to load Character.tres'
    }
    try {
      const worldContent = await window.api.loadSave('World.tres')
      worldFile.value = parseTresFile(worldContent)
    } catch (e) {
      worldLoadError.value = e instanceof Error ? e.message : 'Failed to load World.tres'
    }
    try {
      const tradersContent = await window.api.loadSave('Traders.tres')
      tradersFile.value = parseTresFile(tradersContent)
    } catch (e) {
      tradersLoadError.value = e instanceof Error ? e.message : 'Failed to load Traders.tres'
    }
    isLoading.value = false
  }

  async function saveFile(): Promise<void> {
    if (!tresFile.value || !currentFile.value) return
    await window.api.backupSave()
    const content = serializeTresFile(tresFile.value)
    await window.api.saveSave(currentFile.value.fileName, content)
    if (worldFile.value) {
      const worldContent = serializeTresFile(worldFile.value)
      await window.api.saveSave('World.tres', worldContent)
    }
    if (tradersFile.value) {
      const tradersContent = serializeTresFile(tradersFile.value)
      await window.api.saveSave('Traders.tres', tradersContent)
    }
    isDirty.value = false
  }

  function removeItem(subResourceId: string): void {
    if (!tresFile.value) return
    const tres = tresFile.value

    // Remove from inventory array
    const invProp = tres.resource.find((p) => p.key === 'inventory')
    if (invProp && invProp.value.kind === 'typed_array') {
      invProp.value.elements = invProp.value.elements.filter(
        (el) => !(el.kind === 'sub_resource' && el.id === subResourceId)
      )
    }

    // Remove from equipment array
    const eqProp = tres.resource.find((p) => p.key === 'equipment')
    if (eqProp && eqProp.value.kind === 'typed_array') {
      eqProp.value.elements = eqProp.value.elements.filter(
        (el) => !(el.kind === 'sub_resource' && el.id === subResourceId)
      )
    }

    // Remove from catalog array
    const catProp = tres.resource.find((p) => p.key === 'catalog')
    if (catProp && catProp.value.kind === 'typed_array') {
      catProp.value.elements = catProp.value.elements.filter(
        (el) => !(el.kind === 'sub_resource' && el.id === subResourceId)
      )
    }

    // Remove the sub_resource itself
    tres.subResources = tres.subResources.filter((s) => s.id !== subResourceId)

    // Update load_steps if present
    updateLoadSteps(tres)

    isDirty.value = true
    // Trigger reactivity
    tresFile.value = { ...tres }
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
    if (!tresFile.value) return
    const tres = tresFile.value
    addSlotItem(tres, 'inventory', resourcePath, opts)
    updateLoadSteps(tres)
    isDirty.value = true
    tresFile.value = { ...tres }
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
    if (!tresFile.value) return
    const tres = tresFile.value
    addSlotItem(tres, 'catalog', resourcePath, opts)
    updateLoadSteps(tres)
    isDirty.value = true
    tresFile.value = { ...tres }
  }

  function addEquipmentItem(
    resourcePath: string,
    slotName: string,
    opts: { condition?: number; amount?: number; nestedPaths?: string[] } = {}
  ): void {
    if (!tresFile.value) return
    const tres = tresFile.value
    addSlotItem(tres, 'equipment', resourcePath, { ...opts, slot: slotName })
    updateLoadSteps(tres)
    isDirty.value = true
    tresFile.value = { ...tres }
  }

  function setWeaponNested(subResourceId: string, nestedPaths: string[]): void {
    if (!tresFile.value) return
    const tres = tresFile.value

    const sub = tres.subResources.find((s) => s.id === subResourceId)
    if (!sub) return

    // Resolve current nested to detect magazine changes
    const oldNested = resolveNestedPaths(tres, sub)
    const oldMag = oldNested.find((p) => ATTACHMENT_SUBTYPE.get(p) === 'Magazine')
    const newMag = nestedPaths.find((p) => ATTACHMENT_SUBTYPE.get(p) === 'Magazine')

    // Ensure ext_resources exist for each nested path
    const extIds: string[] = []
    for (const path of nestedPaths) {
      let extId = tres.extResources.find((e) => e.path === path)?.id
      if (!extId) {
        extId = String(Math.max(0, ...tres.extResources.map((e) => parseInt(e.id, 10))) + 1)
        tres.extResources.push({
          id: extId,
          type: 'Resource',
          path,
          raw: `[ext_resource type="Resource" path="${path}" id="${extId}"]`
        })
      }
      extIds.push(extId)
    }

    // Rebuild nested typed_array
    const nestedProp = sub.properties.find((p) => p.key === 'nested')
    if (nestedProp && nestedProp.value.kind === 'typed_array') {
      nestedProp.value.elements = extIds.map((id) => ({ kind: 'ext_resource' as const, id }))
    }

    // Handle magazine ammo changes
    if (oldMag !== newMag) {
      const amountProp = sub.properties.find((p) => p.key === 'amount')
      if (amountProp && (amountProp.value.kind === 'int' || amountProp.value.kind === 'float')) {
        const newAmount = newMag ? (ITEMS_META.get(newMag)?.defaultAmount ?? 0) : 0
        amountProp.value = { kind: 'int', value: newAmount, raw: String(newAmount) }
      }
    }

    updateLoadSteps(tres)
    isDirty.value = true
    tresFile.value = { ...tres }
  }

  function installWeaponAttachment(
    weaponSubResourceId: string,
    attachmentSubResourceId: string,
    ejectedSlot?: { col: number; row: number; rotated: boolean } | null
  ): boolean {
    if (!tresFile.value) return false
    const tres = tresFile.value
    const weaponSub = tres.subResources.find((s) => s.id === weaponSubResourceId)
    const attachmentSub = tres.subResources.find((s) => s.id === attachmentSubResourceId)
    if (!weaponSub || !attachmentSub) return false

    const weaponPath = resolveItemPath(tres, weaponSub)
    const attachmentPath = resolveItemPath(tres, attachmentSub)
    const subtype = ATTACHMENT_SUBTYPE.get(attachmentPath)
    if (!subtype) return false

    const compatible = getWeaponSlots(weaponPath)
      .get(subtype)
      ?.some((o) => o.itemPath === attachmentPath)
    if (!compatible) return false

    const oldNested = resolveNestedPaths(tres, weaponSub)
    const ejectedPath = oldNested.find((path) => ATTACHMENT_SUBTYPE.get(path) === subtype)
    if (ejectedPath && !ejectedSlot) return false

    const nextNested = oldNested.filter((path) => ATTACHMENT_SUBTYPE.get(path) !== subtype)
    nextNested.push(attachmentPath)

    const oldWeaponAmount = getNumberProp(weaponSub.properties, 'amount')
    const looseAttachmentAmount = getNumberProp(attachmentSub.properties, 'amount')

    if (ejectedPath && ejectedSlot) {
      addSlotItem(tres, 'inventory', ejectedPath, {
        amount: subtype === 'Magazine' ? oldWeaponAmount : undefined,
        gridCol: ejectedSlot.col,
        gridRow: ejectedSlot.row,
        gridRotated: ejectedSlot.rotated
      })
    }

    setNestedPaths(tres, weaponSub, nextNested)
    if (subtype === 'Magazine') {
      setNumberProperty(weaponSub, 'amount', looseAttachmentAmount)
    }
    removeSubResource(tres, attachmentSubResourceId)

    updateLoadSteps(tres)
    isDirty.value = true
    tresFile.value = { ...tres }
    return true
  }

  function removeWeaponAttachment(
    weaponSubResourceId: string,
    attachmentPath: string,
    slot: { col: number; row: number; rotated: boolean }
  ): boolean {
    if (!tresFile.value) return false
    const tres = tresFile.value
    const weaponSub = tres.subResources.find((s) => s.id === weaponSubResourceId)
    if (!weaponSub) return false

    const oldNested = resolveNestedPaths(tres, weaponSub)
    if (!oldNested.includes(attachmentPath)) return false

    const subtype = ATTACHMENT_SUBTYPE.get(attachmentPath)
    const amount =
      subtype === 'Magazine' ? getNumberProp(weaponSub.properties, 'amount') : undefined
    addSlotItem(tres, 'inventory', attachmentPath, {
      amount,
      gridCol: slot.col,
      gridRow: slot.row,
      gridRotated: slot.rotated
    })

    const nextNested = [...oldNested]
    nextNested.splice(nextNested.indexOf(attachmentPath), 1)
    setNestedPaths(tres, weaponSub, nextNested)
    if (subtype === 'Magazine') {
      setNumberProperty(weaponSub, 'amount', 0)
    }

    updateLoadSteps(tres)
    isDirty.value = true
    tresFile.value = { ...tres }
    return true
  }

  function setRigArmorPlate(
    subResourceId: string,
    platePath: string | null,
    condition?: number
  ): void {
    if (!tresFile.value) return
    const tres = tresFile.value
    const sub = tres.subResources.find((s) => s.id === subResourceId)
    if (!sub) return

    const slotDataExt = tres.extResources.find((e) => e.path.endsWith('SlotData.gd'))
    const slotDataId = slotDataExt?.id ?? '1'
    const itemDataExt = tres.extResources.find((e) => e.path.endsWith('ItemData.gd'))
    const itemDataId = itemDataExt?.id ?? '3'
    const nestedExtIds = platePath ? ensureExtResourceIds(tres, [platePath]) : []

    let nestedProp = sub.properties.find((p) => p.key === 'nested')
    if (!nestedProp) {
      nestedProp = {
        key: 'nested',
        value: { kind: 'typed_array', elementType: `ExtResource("${itemDataId}")`, elements: [] }
      }
      sub.properties.splice(Math.min(2, sub.properties.length), 0, nestedProp)
    }
    if (nestedProp.value.kind === 'typed_array') {
      nestedProp.value.elementType = `ExtResource("${itemDataId}")`
      nestedProp.value.elements = nestedExtIds.map((id) => ({ kind: 'ext_resource' as const, id }))
    }

    let storageProp = sub.properties.find((p) => p.key === 'storage')
    if (!storageProp) {
      storageProp = {
        key: 'storage',
        value: { kind: 'typed_array', elementType: `ExtResource("${slotDataId}")`, elements: [] }
      }
      sub.properties.splice(Math.min(3, sub.properties.length), 0, storageProp)
    }

    const nextCondition = platePath
      ? (condition ?? getNumberProp(sub.properties, 'condition'))
      : 100
    setNumberProperty(sub, 'condition', nextCondition)

    updateLoadSteps(tres)
    isDirty.value = true
    tresFile.value = { ...tres }
  }

  function updateStat(key: keyof CharacterStats, value: number): void {
    if (!tresFile.value) return
    setResourceNumberProperty(tresFile.value.resource, key, value)
    isDirty.value = true
    tresFile.value = { ...tresFile.value }
  }

  function updateStatusEffect(key: keyof StatusEffects, value: boolean): void {
    if (!tresFile.value) return
    setResourceBoolProperty(tresFile.value.resource, key, value)
    isDirty.value = true
    tresFile.value = { ...tresFile.value }
  }

  function updateCatHealth(value: number): void {
    if (!tresFile.value) return
    setResourceNumberProperty(tresFile.value.resource, 'cat', value)
    isDirty.value = true
    tresFile.value = { ...tresFile.value }
  }

  function reviveCat(): void {
    if (!tresFile.value) return
    setResourceBoolProperty(tresFile.value.resource, 'catDead', false)
    setResourceNumberProperty(tresFile.value.resource, 'cat', 100)
    isDirty.value = true
    tresFile.value = { ...tresFile.value }
  }

  function killCat(): void {
    if (!tresFile.value) return
    setResourceBoolProperty(tresFile.value.resource, 'catDead', true)
    isDirty.value = true
    tresFile.value = { ...tresFile.value }
  }

  function toggleQuestCompletion(traderKey: TraderKey, questName: string): void {
    if (!tradersFile.value) return
    const tres = tradersFile.value
    const prop = ensureStringArrayProperty(tres.resource, traderKey)

    const idx = prop.value.elements.findIndex(
      (el) => el.kind === 'string' && el.value === questName
    )
    if (idx >= 0) {
      prop.value.elements.splice(idx, 1)
    } else {
      prop.value.elements.push({ kind: 'string', value: questName })
    }
    isDirty.value = true
    tradersFile.value = { ...tres }
  }

  function setAllQuestsForTrader(
    traderKey: TraderKey,
    questNames: string[],
    completed: boolean
  ): void {
    if (!tradersFile.value) return
    const tres = tradersFile.value
    const prop = ensureStringArrayProperty(tres.resource, traderKey)

    if (completed) {
      const existing = new Set(
        prop.value.elements
          .filter((el): el is { kind: 'string'; value: string } => el.kind === 'string')
          .map((el) => el.value)
      )
      for (const name of questNames) {
        if (!existing.has(name)) {
          prop.value.elements.push({ kind: 'string', value: name })
        }
      }
    } else {
      const toRemove = new Set(questNames)
      prop.value.elements = prop.value.elements.filter(
        (el) => !(el.kind === 'string' && toRemove.has(el.value))
      )
    }
    isDirty.value = true
    tradersFile.value = { ...tres }
  }

  function updateWorldProp(key: keyof WorldState, value: number | string): void {
    if (!worldFile.value) return
    if (typeof value === 'string') {
      setResourceStringProperty(worldFile.value.resource, key, value)
    } else {
      setResourceNumberProperty(worldFile.value.resource, key, value, 'int')
    }
    isDirty.value = true
    worldFile.value = { ...worldFile.value }
  }

  function maxAllStats(): void {
    const keys: (keyof CharacterStats)[] = [
      'health',
      'energy',
      'hydration',
      'temperature',
      'mental'
    ]
    for (const key of keys) {
      updateStat(key, 100)
    }
  }

  function updateItemGridPosition(
    subResourceId: string,
    col: number,
    row: number,
    gridRotated: boolean
  ): void {
    if (!tresFile.value) return
    const tres = tresFile.value
    const sub = tres.subResources.find((s) => s.id === subResourceId)
    if (!sub) return

    const pixelX = col * 64
    const pixelY = row * 64

    setVector2Property(sub, 'gridPosition', pixelX, pixelY)
    setBoolProperty(sub, 'gridRotated', gridRotated)

    isDirty.value = true
    tresFile.value = { ...tres }
  }

  function updateItem(
    subResourceId: string,
    updates: { condition?: number; amount?: number }
  ): void {
    if (!tresFile.value) return
    const tres = tresFile.value
    const sub = tres.subResources.find((s) => s.id === subResourceId)
    if (!sub) return

    if (updates.condition !== undefined) {
      setNumberProperty(sub, 'condition', updates.condition)
    }
    if (updates.amount !== undefined) {
      setNumberProperty(sub, 'amount', updates.amount)
    }

    isDirty.value = true
    tresFile.value = { ...tres }
  }

  function moveToInventory(
    subResourceId: string,
    col: number,
    row: number,
    rotated: boolean
  ): void {
    if (!tresFile.value) return
    const tres = tresFile.value
    const sub = tres.subResources.find((s) => s.id === subResourceId)
    if (!sub) return

    // Remove from equipment array
    const eqProp = tres.resource.find((p) => p.key === 'equipment')
    if (eqProp && eqProp.value.kind === 'typed_array') {
      eqProp.value.elements = eqProp.value.elements.filter(
        (el) => !(el.kind === 'sub_resource' && el.id === subResourceId)
      )
    }

    // Add to inventory array
    const invProp = tres.resource.find((p) => p.key === 'inventory')
    if (invProp && invProp.value.kind === 'typed_array') {
      invProp.value.elements.push({ kind: 'sub_resource', id: subResourceId })
    }

    // Clear slot
    setStringProperty(sub, 'slot', '')

    // Set grid position
    const pixelX = col * 64
    const pixelY = row * 64
    setVector2Property(sub, 'gridPosition', pixelX, pixelY)
    setBoolProperty(sub, 'gridRotated', rotated)

    isDirty.value = true
    tresFile.value = { ...tres }
  }

  function moveToEquipment(subResourceId: string, slotName: string): void {
    if (!tresFile.value) return
    const tres = tresFile.value
    const sub = tres.subResources.find((s) => s.id === subResourceId)
    if (!sub) return

    // Remove from inventory array
    const invProp = tres.resource.find((p) => p.key === 'inventory')
    if (invProp && invProp.value.kind === 'typed_array') {
      invProp.value.elements = invProp.value.elements.filter(
        (el) => !(el.kind === 'sub_resource' && el.id === subResourceId)
      )
    }

    // Add to equipment array
    const eqProp = tres.resource.find((p) => p.key === 'equipment')
    if (eqProp && eqProp.value.kind === 'typed_array') {
      eqProp.value.elements.push({ kind: 'sub_resource', id: subResourceId })
    }

    // Set slot
    setStringProperty(sub, 'slot', slotName)

    // Clear grid position
    setVector2Property(sub, 'gridPosition', 0, 0)
    setBoolProperty(sub, 'gridRotated', false)

    isDirty.value = true
    tresFile.value = { ...tres }
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
    moveToEquipment
  }
}

function updateLoadSteps(tres: TresFile): void {
  if (tres.header.loadSteps !== undefined) {
    tres.header.loadSteps = tres.extResources.length + tres.subResources.length + 1
    // Update the raw header line
    tres.header.raw = tres.header.raw.replace(
      /load_steps=\d+/,
      `load_steps=${tres.header.loadSteps}`
    )
  }
}

type SlotItemTarget = 'inventory' | 'catalog' | 'equipment'

function addSlotItem(
  tres: TresFile,
  target: SlotItemTarget,
  resourcePath: string,
  opts: {
    condition?: number
    amount?: number
    gridCol?: number
    gridRow?: number
    gridRotated?: boolean
    nestedPaths?: string[]
    /** Equipment slot name; defaults to ''. Only meaningful when target is 'equipment'. */
    slot?: string
  } = {}
): string {
  const extId = ensureExtResourceIds(tres, [resourcePath])[0]
  const slotDataExt = tres.extResources.find((e) => e.path.endsWith('SlotData.gd'))
  const slotDataId = slotDataExt?.id ?? '1'
  const itemDataExt = tres.extResources.find((e) => e.path.endsWith('ItemData.gd'))
  const itemDataId = itemDataExt?.id ?? '3'
  const nestedExtIds = ensureExtResourceIds(tres, opts.nestedPaths ?? [])

  let subId: string
  do {
    subId = 'Resource_' + randomAlphanumeric(5)
  } while (tres.subResources.some((s) => s.id === subId))

  const meta = ITEMS_META.get(resourcePath)
  const condition = opts.condition ?? meta?.defaultCondition ?? 0
  const amount = opts.amount ?? meta?.defaultAmount ?? 0
  const gridCol = opts.gridCol ?? 0
  const gridRow = opts.gridRow ?? 0

  const newSub: SubResource = {
    id: subId,
    type: 'Resource',
    properties: [
      { key: 'script', value: { kind: 'ext_resource', id: slotDataId } },
      { key: 'itemData', value: { kind: 'ext_resource', id: extId } },
      {
        key: 'nested',
        value: {
          kind: 'typed_array',
          elementType: `ExtResource("${itemDataId}")`,
          elements: nestedExtIds.map((id) => ({ kind: 'ext_resource' as const, id }))
        }
      },
      {
        key: 'storage',
        value: { kind: 'typed_array', elementType: `ExtResource("${slotDataId}")`, elements: [] }
      },
      { key: 'condition', value: { kind: 'int', value: condition, raw: String(condition) } },
      { key: 'amount', value: { kind: 'int', value: amount, raw: String(amount) } },
      { key: 'position', value: { kind: 'int', value: 0, raw: '0' } },
      { key: 'mode', value: { kind: 'int', value: 1, raw: '1' } },
      { key: 'zoom', value: { kind: 'int', value: 1, raw: '1' } },
      { key: 'chamber', value: { kind: 'bool', value: false } },
      { key: 'casing', value: { kind: 'bool', value: false } },
      { key: 'state', value: { kind: 'string', value: '' } },
      {
        key: 'gridPosition',
        value: {
          kind: 'vector2',
          x: gridCol * 64,
          y: gridRow * 64,
          raw: `Vector2(${gridCol * 64}, ${gridRow * 64})`
        }
      },
      { key: 'gridRotated', value: { kind: 'bool', value: opts.gridRotated ?? false } },
      { key: 'slot', value: { kind: 'string', value: opts.slot ?? '' } }
    ]
  }

  tres.subResources.push(newSub)

  let arrayProp = tres.resource.find((p) => p.key === target)
  if (!arrayProp && target === 'catalog') {
    arrayProp = {
      key: 'catalog',
      value: { kind: 'typed_array', elementType: `ExtResource("${slotDataId}")`, elements: [] }
    }
    tres.resource.push(arrayProp)
  }
  if (arrayProp && arrayProp.value.kind === 'typed_array') {
    arrayProp.value.elements.push({ kind: 'sub_resource', id: subId })
  }

  return subId
}

function removeSubResource(tres: TresFile, subResourceId: string): void {
  for (const key of ['inventory', 'equipment', 'catalog']) {
    const prop = tres.resource.find((p) => p.key === key)
    if (prop?.value.kind === 'typed_array') {
      prop.value.elements = prop.value.elements.filter(
        (el) => !(el.kind === 'sub_resource' && el.id === subResourceId)
      )
    }
  }
  tres.subResources = tres.subResources.filter((s) => s.id !== subResourceId)
}

function setNestedPaths(tres: TresFile, sub: SubResource, nestedPaths: string[]): void {
  const itemDataExt = tres.extResources.find((e) => e.path.endsWith('ItemData.gd'))
  const itemDataId = itemDataExt?.id ?? '3'
  const extIds = ensureExtResourceIds(tres, nestedPaths)
  let nestedProp = sub.properties.find((p) => p.key === 'nested')
  if (!nestedProp) {
    nestedProp = {
      key: 'nested',
      value: { kind: 'typed_array', elementType: `ExtResource("${itemDataId}")`, elements: [] }
    }
    sub.properties.splice(Math.min(2, sub.properties.length), 0, nestedProp)
  }
  nestedProp.value = {
    kind: 'typed_array',
    elementType: `ExtResource("${itemDataId}")`,
    elements: extIds.map((id) => ({ kind: 'ext_resource' as const, id }))
  }
}

function setResourceNumberProperty(
  props: Property[],
  key: string,
  value: number,
  numberKind: 'float' | 'int' = 'float'
): void {
  const prop = props.find((p) => p.key === key)
  const raw = String(value)
  if (prop) {
    prop.value = { kind: numberKind, value, raw }
  } else {
    props.push({ key, value: { kind: numberKind, value, raw } })
  }
}

function setResourceStringProperty(props: Property[], key: string, value: string): void {
  const prop = props.find((p) => p.key === key)
  if (prop) {
    prop.value = { kind: 'string', value }
  } else {
    props.push({ key, value: { kind: 'string', value } })
  }
}

function setResourceBoolProperty(props: Property[], key: string, value: boolean): void {
  const prop = props.find((p) => p.key === key)
  if (prop) {
    prop.value = { kind: 'bool', value }
  } else {
    props.push({ key, value: { kind: 'bool', value } })
  }
}

function ensureStringArrayProperty(
  props: Property[],
  key: string
): Property & { value: TresTypedArray } {
  const existing = props.find((p) => p.key === key)
  if (existing?.value.kind === 'typed_array') {
    return existing as Property & { value: TresTypedArray }
  }

  const value: TresTypedArray = { kind: 'typed_array', elementType: 'String', elements: [] }
  if (existing) {
    existing.value = value
    return existing as Property & { value: TresTypedArray }
  }

  const prop: Property & { value: TresTypedArray } = { key, value }
  props.push(prop)
  return prop
}

function ensureExtResourceIds(tres: TresFile, resourcePaths: string[]): string[] {
  return resourcePaths.map((path) => {
    let extId = tres.extResources.find((e) => e.path === path)?.id
    if (extId) return extId

    extId = String(Math.max(0, ...tres.extResources.map((e) => parseInt(e.id, 10))) + 1)
    tres.extResources.push({
      id: extId,
      type: 'Resource',
      path,
      raw: `[ext_resource type="Resource" path="${path}" id="${extId}"]`
    })
    return extId
  })
}

function setNumberProperty(sub: SubResource, key: string, value: number): void {
  const prop = sub.properties.find((p) => p.key === key)
  const raw = String(value)
  if (prop) {
    prop.value = { kind: Number.isInteger(value) ? 'int' : 'float', value, raw }
  } else {
    sub.properties.push({
      key,
      value: { kind: Number.isInteger(value) ? 'int' : 'float', value, raw }
    })
  }
}

function setStringProperty(sub: SubResource, key: string, value: string): void {
  const prop = sub.properties.find((p) => p.key === key)
  if (prop) {
    prop.value = { kind: 'string', value }
  } else {
    sub.properties.push({ key, value: { kind: 'string', value } })
  }
}

function setBoolProperty(sub: SubResource, key: string, value: boolean): void {
  const prop = sub.properties.find((p) => p.key === key)
  if (prop) {
    prop.value = { kind: 'bool', value }
  } else {
    sub.properties.push({ key, value: { kind: 'bool', value } })
  }
}

function setVector2Property(sub: SubResource, key: string, x: number, y: number): void {
  const raw = `Vector2(${x}, ${y})`
  const prop = sub.properties.find((p) => p.key === key)
  if (prop) {
    prop.value = { kind: 'vector2', x, y, raw }
  } else {
    sub.properties.push({ key, value: { kind: 'vector2', x, y, raw } })
  }
}

function randomAlphanumeric(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}
