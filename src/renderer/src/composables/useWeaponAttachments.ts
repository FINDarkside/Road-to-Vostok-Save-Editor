import {
  character,
  markDirty,
  findItemInAnyArray,
  findAndRemove,
  freshSlotItem
} from './saveEditorState'
import { ATTACHMENT_SUBTYPE, getWeaponSlots } from '../data/attachment-subtypes'
import { ITEMS_META } from '../data/items'

export function setWeaponNested(subResourceId: string, nestedPaths: string[]): void {
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

export function installWeaponAttachment(
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

export function removeWeaponAttachment(
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
