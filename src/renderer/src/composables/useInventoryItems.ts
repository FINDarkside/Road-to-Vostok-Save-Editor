import {
  character,
  markDirty,
  findAndRemove,
  findItemInAnyArray,
  freshSlotItem
} from './saveEditorState'

export function addItem(
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

export function addCatalogItem(
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

export function addEquipmentItem(
  resourcePath: string,
  slotName: string,
  opts: { condition?: number; amount?: number; nestedPaths?: string[] } = {}
): void {
  if (!character.value) return
  character.value.equipment.push(freshSlotItem(resourcePath, { ...opts, slot: slotName }))
  markDirty()
}

export function removeItem(subResourceId: string): void {
  if (!character.value) return
  findAndRemove(subResourceId)
  markDirty()
}

export function updateItem(
  subResourceId: string,
  updates: { condition?: number; amount?: number }
): void {
  const item = findItemInAnyArray(subResourceId)
  if (!item) return
  if (updates.condition !== undefined) item.condition = updates.condition
  if (updates.amount !== undefined) item.amount = updates.amount
  markDirty()
}

export function updateItemGridPosition(
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

export function moveToInventory(
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

export function moveToEquipment(subResourceId: string, slotName: string): void {
  if (!character.value) return
  const item = findAndRemove(subResourceId)
  if (!item) return
  item.slot = slotName
  item.gridPosition = { x: 0, y: 0 }
  item.gridRotated = false
  character.value.equipment.push(item)
  markDirty()
}

export function setEquipmentSlot(subResourceId: string, slotName: string): void {
  const item = findItemInAnyArray(subResourceId)
  if (!item) return
  item.slot = slotName
  markDirty()
}

export function swapEquipmentSlots(id1: string, slot1: string, id2: string, slot2: string): void {
  const a = findItemInAnyArray(id1)
  const b = findItemInAnyArray(id2)
  if (!a || !b) return
  a.slot = slot2
  b.slot = slot1
  markDirty()
}
