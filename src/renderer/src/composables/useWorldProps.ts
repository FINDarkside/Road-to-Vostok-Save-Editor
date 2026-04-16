import { world, markWorldDirty } from './saveEditorState'

export function updateWorldProp(
  key: 'difficulty' | 'season' | 'day' | 'weather',
  value: number | string
): void {
  if (!world.value) return
  if (key === 'weather' && typeof value === 'string') {
    world.value.weather = value
  } else if (typeof value === 'number' && key !== 'weather') {
    world.value[key] = value
  }
  markWorldDirty()
}
