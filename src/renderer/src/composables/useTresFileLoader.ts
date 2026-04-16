import { parseTresFile } from '../lib/tres/parser'
import { serializeTresFile } from '../lib/tres/serializer'
import {
  parseCharacter,
  serializeCharacter,
  parseWorld,
  serializeWorld,
  parseTraders,
  serializeTraders
} from '../lib/tres/codec'
import {
  currentFile,
  tresFile,
  worldFile,
  tradersFile,
  character,
  world,
  traders,
  isLoading,
  isDirty,
  loadError,
  worldLoadError,
  tradersLoadError
} from './saveEditorState'

export async function init(): Promise<void> {
  isLoading.value = true
  loadError.value = null
  worldLoadError.value = null
  tradersLoadError.value = null

  try {
    const content = await window.api.loadSave('Character.tres')
    const tres = parseTresFile(content)
    tresFile.value = tres
    character.value = parseCharacter(tres)
    currentFile.value = 'Character.tres'
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

export async function saveFile(): Promise<void> {
  if (!character.value || !tresFile.value || !currentFile.value) return
  await window.api.backupSave()

  const newCharTres = serializeCharacter(character.value, tresFile.value)
  await window.api.saveSave(currentFile.value, serializeTresFile(newCharTres))
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
