import { character, markDirty, findItemInAnyArray } from './saveEditorState'

export function setRigArmorPlate(
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
