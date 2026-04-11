import { ref, computed } from 'vue'
import type { TresFile, ExtResource, SubResource, Property } from '../lib/tres/types'
import type { SlotItem, CharacterStats, StatusEffects, CatStatus, SaveFileInfo } from '../lib/types'
import { parseTresFile } from '../lib/tres/parser'
import { serializeTresFile } from '../lib/tres/serializer'
import { ITEMS_BY_PATH, ITEMS_META } from '../data/items'

const currentFile = ref<SaveFileInfo | null>(null)
const tresFile = ref<TresFile | null>(null)
const isLoading = ref(false)
const isDirty = ref(false)
const loadError = ref<string | null>(null)

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
    amount: getNumberProp(sub.properties, 'amount'),
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

export function useSaveEditor() {
  async function init(): Promise<void> {
    isLoading.value = true
    loadError.value = null
    try {
      const content = await window.api.loadSave('Character.tres')
      tresFile.value = parseTresFile(content)
      currentFile.value = { fileName: 'Character.tres' }
      isDirty.value = false
    } catch (e) {
      loadError.value = e instanceof Error ? e.message : 'Failed to load Character.tres'
    } finally {
      isLoading.value = false
    }
  }

  async function saveFile(): Promise<void> {
    if (!tresFile.value || !currentFile.value) return
    const content = serializeTresFile(tresFile.value)
    await window.api.saveSave(currentFile.value.fileName, content)
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
    stats,
    statusEffects,
    catStatus,
    isLoading,
    isDirty,
    loadError,
    tresFile,
    init,
    saveFile,
    addItem,
    removeItem,
    updateStat,
    maxAllStats,
    updateStatusEffect,
    updateCatHealth,
    reviveCat,
    killCat,
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
