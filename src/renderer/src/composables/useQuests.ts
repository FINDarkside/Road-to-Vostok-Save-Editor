import { traders, markTradersDirty } from './saveEditorState'
import type { TraderKey } from '../data/quests'

export function toggleQuestCompletion(traderKey: TraderKey, questName: string): void {
  if (!traders.value) return
  const list = traders.value[traderKey]
  const idx = list.indexOf(questName)
  if (idx >= 0) list.splice(idx, 1)
  else list.push(questName)
  markTradersDirty()
}

export function setAllQuestsForTrader(
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
