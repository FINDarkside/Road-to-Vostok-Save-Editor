import { ref, computed } from 'vue'
import type { TresFile, ExtResource, SubResource, Property } from '../lib/tres/types'
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
import { ATTACHMENT_SUBTYPE } from '../data/attachment-subtypes'
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

function getStringProp(props: Property[], key: string): string {
  const prop = props.find((p) => p.key === key)
  if (!prop) return ''
  return prop.value.kind === 'string' ? prop.value.value : ''
}

function getNumberProp(props: Property[], key: string): number {
  const prop = props.find((p) => p.key === key)
  if (!prop) return 0
  if (prop.value.kind === 'int' || prop.value.kind === 'float') return prop.value.value
  return 0
}

function getBoolProp(props: Property[], key: string): boolean {
  const prop = props.find((p) => p.key === key)
  if (!prop) return false
  return prop.value.kind === 'bool' ? prop.value.value : false
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
    condition: getNumberProp(sub.properties, 'condition'),
    showCondition: ITEMS_META.get(itemPath)?.showCondition ?? false,
    amount: getNumberProp(sub.properties, 'amount'),
    showAmount: ITEMS_META.get(itemPath)?.showAmount ?? false,
    chamber: getBoolProp(sub.properties, 'chamber'),
    gridPosition: {
      x: getVector2Prop(sub.properties, 'gridPosition')?.x ?? 0,
      y: getVector2Prop(sub.properties, 'gridPosition')?.y ?? 0
    },
    gridRotated: getBoolProp(sub.properties, 'gridRotated'),
    slot: getStringProp(sub.properties, 'slot'),
    nested: resolveNestedPaths(tres, sub)
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
    health: getNumberProp(res, 'health'),
    energy: getNumberProp(res, 'energy'),
    hydration: getNumberProp(res, 'hydration'),
    temperature: getNumberProp(res, 'temperature'),
    mental: getNumberProp(res, 'mental')
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
    cat: getNumberProp(res, 'cat'),
    catFound: getBoolProp(res, 'catFound'),
    catDead: getBoolProp(res, 'catDead')
  }
})

const worldState = computed<WorldState>(() => {
  if (!worldFile.value) return { difficulty: 1, season: 1, day: 1, weather: 'Neutral' }
  const res = worldFile.value.resource
  return {
    difficulty: getNumberProp(res, 'difficulty'),
    season: getNumberProp(res, 'season'),
    day: getNumberProp(res, 'day'),
    weather: getStringProp(res, 'weather')
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
    } = {}
  ): void {
    if (!tresFile.value) return
    const tres = tresFile.value

    // Find or create ext_resource for this item path
    let extId = tres.extResources.find((e) => e.path === resourcePath)?.id
    if (!extId) {
      extId = String(Math.max(0, ...tres.extResources.map((e) => parseInt(e.id, 10))) + 1)
      const newExt: ExtResource = {
        id: extId,
        type: 'Resource',
        path: resourcePath,
        raw: `[ext_resource type="Resource" path="${resourcePath}" id="${extId}"]`
      }
      tres.extResources.push(newExt)
    }

    // Find the SlotData script ext_resource id
    const slotDataExt = tres.extResources.find((e) => e.path.endsWith('SlotData.gd'))
    const slotDataId = slotDataExt?.id ?? '1'

    // Find the ItemData script ext_resource id (for typed arrays)
    const itemDataExt = tres.extResources.find((e) => e.path.endsWith('ItemData.gd'))
    const itemDataId = itemDataExt?.id ?? '3'

    // Generate unique sub_resource ID
    let subId: string
    do {
      subId = 'Resource_' + randomAlphanumeric(5)
    } while (tres.subResources.some((s) => s.id === subId))

    const meta = ITEMS_META.get(resourcePath)
    const condition = opts.condition ?? meta?.defaultCondition ?? 0
    const amount = opts.amount ?? meta?.defaultAmount ?? 0

    const newSub: SubResource = {
      id: subId,
      type: 'Resource',
      properties: [
        { key: 'script', value: { kind: 'ext_resource', id: slotDataId } },
        { key: 'itemData', value: { kind: 'ext_resource', id: extId } },
        {
          key: 'nested',
          value: { kind: 'typed_array', elementType: `ExtResource("${itemDataId}")`, elements: [] }
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
            x: (opts.gridCol ?? 0) * 64,
            y: (opts.gridRow ?? 0) * 64,
            raw: `Vector2(${(opts.gridCol ?? 0) * 64}, ${(opts.gridRow ?? 0) * 64})`
          }
        },
        { key: 'gridRotated', value: { kind: 'bool', value: opts.gridRotated ?? false } },
        { key: 'slot', value: { kind: 'string', value: '' } }
      ]
    }

    tres.subResources.push(newSub)

    // Add to inventory array
    const invProp = tres.resource.find((p) => p.key === 'inventory')
    if (invProp && invProp.value.kind === 'typed_array') {
      invProp.value.elements.push({ kind: 'sub_resource', id: subId })
    }

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
    } = {}
  ): void {
    if (!tresFile.value) return
    const tres = tresFile.value

    // Find or create ext_resource for this item path
    let extId = tres.extResources.find((e) => e.path === resourcePath)?.id
    if (!extId) {
      extId = String(Math.max(0, ...tres.extResources.map((e) => parseInt(e.id, 10))) + 1)
      const newExt: ExtResource = {
        id: extId,
        type: 'Resource',
        path: resourcePath,
        raw: `[ext_resource type="Resource" path="${resourcePath}" id="${extId}"]`
      }
      tres.extResources.push(newExt)
    }

    const slotDataExt = tres.extResources.find((e) => e.path.endsWith('SlotData.gd'))
    const slotDataId = slotDataExt?.id ?? '1'
    const itemDataExt = tres.extResources.find((e) => e.path.endsWith('ItemData.gd'))
    const itemDataId = itemDataExt?.id ?? '3'

    let subId: string
    do {
      subId = 'Resource_' + randomAlphanumeric(5)
    } while (tres.subResources.some((s) => s.id === subId))

    const meta = ITEMS_META.get(resourcePath)
    const condition = opts.condition ?? meta?.defaultCondition ?? 0
    const amount = opts.amount ?? meta?.defaultAmount ?? 0

    const newSub: SubResource = {
      id: subId,
      type: 'Resource',
      properties: [
        { key: 'script', value: { kind: 'ext_resource', id: slotDataId } },
        { key: 'itemData', value: { kind: 'ext_resource', id: extId } },
        {
          key: 'nested',
          value: { kind: 'typed_array', elementType: `ExtResource("${itemDataId}")`, elements: [] }
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
            x: (opts.gridCol ?? 0) * 64,
            y: (opts.gridRow ?? 0) * 64,
            raw: `Vector2(${(opts.gridCol ?? 0) * 64}, ${(opts.gridRow ?? 0) * 64})`
          }
        },
        { key: 'gridRotated', value: { kind: 'bool', value: opts.gridRotated ?? false } },
        { key: 'slot', value: { kind: 'string', value: '' } }
      ]
    }

    tres.subResources.push(newSub)

    // Add to catalog array (create if missing)
    let catProp = tres.resource.find((p) => p.key === 'catalog')
    if (!catProp) {
      catProp = {
        key: 'catalog',
        value: { kind: 'typed_array', elementType: `ExtResource("${slotDataId}")`, elements: [] }
      }
      tres.resource.push(catProp)
    }
    if (catProp.value.kind === 'typed_array') {
      catProp.value.elements.push({ kind: 'sub_resource', id: subId })
    }

    updateLoadSteps(tres)

    isDirty.value = true
    tresFile.value = { ...tres }
  }

  function addEquipmentItem(
    resourcePath: string,
    slotName: string,
    opts: { condition?: number; amount?: number } = {}
  ): void {
    if (!tresFile.value) return
    const tres = tresFile.value

    // Find or create ext_resource for this item path
    let extId = tres.extResources.find((e) => e.path === resourcePath)?.id
    if (!extId) {
      extId = String(Math.max(0, ...tres.extResources.map((e) => parseInt(e.id, 10))) + 1)
      const newExt: ExtResource = {
        id: extId,
        type: 'Resource',
        path: resourcePath,
        raw: `[ext_resource type="Resource" path="${resourcePath}" id="${extId}"]`
      }
      tres.extResources.push(newExt)
    }

    const slotDataExt = tres.extResources.find((e) => e.path.endsWith('SlotData.gd'))
    const slotDataId = slotDataExt?.id ?? '1'
    const itemDataExt = tres.extResources.find((e) => e.path.endsWith('ItemData.gd'))
    const itemDataId = itemDataExt?.id ?? '3'

    let subId: string
    do {
      subId = 'Resource_' + randomAlphanumeric(5)
    } while (tres.subResources.some((s) => s.id === subId))

    const meta = ITEMS_META.get(resourcePath)
    const condition = opts.condition ?? meta?.defaultCondition ?? 0
    const amount = opts.amount ?? meta?.defaultAmount ?? 0

    const newSub: SubResource = {
      id: subId,
      type: 'Resource',
      properties: [
        { key: 'script', value: { kind: 'ext_resource', id: slotDataId } },
        { key: 'itemData', value: { kind: 'ext_resource', id: extId } },
        {
          key: 'nested',
          value: { kind: 'typed_array', elementType: `ExtResource("${itemDataId}")`, elements: [] }
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
          value: { kind: 'vector2', x: 0, y: 0, raw: 'Vector2(0, 0)' }
        },
        { key: 'gridRotated', value: { kind: 'bool', value: false } },
        { key: 'slot', value: { kind: 'string', value: slotName } }
      ]
    }

    tres.subResources.push(newSub)

    // Add to equipment array
    const eqProp = tres.resource.find((p) => p.key === 'equipment')
    if (eqProp && eqProp.value.kind === 'typed_array') {
      eqProp.value.elements.push({ kind: 'sub_resource', id: subId })
    }

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

  function updateStat(key: keyof CharacterStats, value: number): void {
    if (!tresFile.value) return
    const prop = tresFile.value.resource.find((p) => p.key === key)
    if (prop && (prop.value.kind === 'float' || prop.value.kind === 'int')) {
      prop.value = { kind: 'float', value, raw: String(value) }
      isDirty.value = true
      tresFile.value = { ...tresFile.value }
    }
  }

  function updateStatusEffect(key: keyof StatusEffects, value: boolean): void {
    if (!tresFile.value) return
    const prop = tresFile.value.resource.find((p) => p.key === key)
    if (prop && prop.value.kind === 'bool') {
      prop.value = { kind: 'bool', value }
      isDirty.value = true
      tresFile.value = { ...tresFile.value }
    }
  }

  function updateCatHealth(value: number): void {
    if (!tresFile.value) return
    const prop = tresFile.value.resource.find((p) => p.key === 'cat')
    if (prop && (prop.value.kind === 'float' || prop.value.kind === 'int')) {
      prop.value = { kind: 'float', value, raw: String(value) }
      isDirty.value = true
      tresFile.value = { ...tresFile.value }
    }
  }

  function reviveCat(): void {
    if (!tresFile.value) return
    const deadProp = tresFile.value.resource.find((p) => p.key === 'catDead')
    if (deadProp && deadProp.value.kind === 'bool') {
      deadProp.value = { kind: 'bool', value: false }
    }
    const healthProp = tresFile.value.resource.find((p) => p.key === 'cat')
    if (healthProp && (healthProp.value.kind === 'float' || healthProp.value.kind === 'int')) {
      healthProp.value = { kind: 'float', value: 100, raw: '100' }
    }
    isDirty.value = true
    tresFile.value = { ...tresFile.value }
  }

  function killCat(): void {
    if (!tresFile.value) return
    const deadProp = tresFile.value.resource.find((p) => p.key === 'catDead')
    if (deadProp && deadProp.value.kind === 'bool') {
      deadProp.value = { kind: 'bool', value: true }
    }
    isDirty.value = true
    tresFile.value = { ...tresFile.value }
  }

  function toggleQuestCompletion(traderKey: TraderKey, questName: string): void {
    if (!tradersFile.value) return
    const tres = tradersFile.value
    const prop = tres.resource.find((p) => p.key === traderKey)
    if (!prop || prop.value.kind !== 'typed_array') return

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
    const prop = tres.resource.find((p) => p.key === traderKey)
    if (!prop || prop.value.kind !== 'typed_array') return

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
    const prop = worldFile.value.resource.find((p) => p.key === key)
    if (!prop) return
    if (typeof value === 'string') {
      prop.value = { kind: 'string', value }
    } else {
      prop.value = { kind: 'int', value, raw: String(value) }
    }
    isDirty.value = true
    worldFile.value = { ...worldFile.value }
  }

  function maxAllStats(): void {
    if (!tresFile.value) return
    const keys: (keyof CharacterStats)[] = [
      'health',
      'energy',
      'hydration',
      'temperature',
      'mental'
    ]
    for (const key of keys) {
      const prop = tresFile.value.resource.find((p) => p.key === key)
      if (prop && (prop.value.kind === 'float' || prop.value.kind === 'int')) {
        prop.value = { kind: 'float', value: 100, raw: '100' }
      }
    }
    isDirty.value = true
    tresFile.value = { ...tresFile.value }
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

    const posProp = sub.properties.find((p) => p.key === 'gridPosition')
    if (posProp) {
      posProp.value = {
        kind: 'vector2',
        x: pixelX,
        y: pixelY,
        raw: `Vector2(${pixelX}, ${pixelY})`
      }
    }

    const rotProp = sub.properties.find((p) => p.key === 'gridRotated')
    if (rotProp) {
      rotProp.value = { kind: 'bool', value: gridRotated }
    }

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
      const prop = sub.properties.find((p) => p.key === 'condition')
      if (prop) {
        prop.value = {
          kind: 'int',
          value: updates.condition,
          raw: String(updates.condition)
        }
      }
    }
    if (updates.amount !== undefined) {
      const prop = sub.properties.find((p) => p.key === 'amount')
      if (prop) {
        prop.value = {
          kind: 'int',
          value: updates.amount,
          raw: String(updates.amount)
        }
      }
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
    const slotProp = sub.properties.find((p) => p.key === 'slot')
    if (slotProp) {
      slotProp.value = { kind: 'string', value: '' }
    }

    // Set grid position
    const pixelX = col * 64
    const pixelY = row * 64
    const posProp = sub.properties.find((p) => p.key === 'gridPosition')
    if (posProp) {
      posProp.value = {
        kind: 'vector2',
        x: pixelX,
        y: pixelY,
        raw: `Vector2(${pixelX}, ${pixelY})`
      }
    }
    const rotProp = sub.properties.find((p) => p.key === 'gridRotated')
    if (rotProp) {
      rotProp.value = { kind: 'bool', value: rotated }
    }

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
    const slotProp = sub.properties.find((p) => p.key === 'slot')
    if (slotProp) {
      slotProp.value = { kind: 'string', value: slotName }
    }

    // Clear grid position
    const posProp = sub.properties.find((p) => p.key === 'gridPosition')
    if (posProp) {
      posProp.value = { kind: 'vector2', x: 0, y: 0, raw: 'Vector2(0, 0)' }
    }
    const rotProp = sub.properties.find((p) => p.key === 'gridRotated')
    if (rotProp) {
      rotProp.value = { kind: 'bool', value: false }
    }

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

function randomAlphanumeric(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}
