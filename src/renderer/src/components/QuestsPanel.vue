<script setup lang="ts">
import { useSaveEditor } from '../composables/useSaveEditor'
import { TRADERS, QUESTS_BY_TRADER, type TraderKey, type QuestItem } from '../data/quests'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { ScrollText } from 'lucide-vue-next'

const { tradersFile, questCompletion, toggleQuestCompletion, setAllQuestsForTrader } =
  useSaveEditor()

const tradersWithQuests = TRADERS.filter((t) => (QUESTS_BY_TRADER.get(t.key)?.length ?? 0) > 0)

function isCompleted(traderKey: TraderKey, questName: string): boolean {
  return questCompletion.value[traderKey].includes(questName)
}

function completedCount(traderKey: TraderKey): number {
  const quests = QUESTS_BY_TRADER.get(traderKey) ?? []
  return quests.filter((q) => isCompleted(traderKey, q.name)).length
}

function completeTrader(traderKey: TraderKey): void {
  const names = (QUESTS_BY_TRADER.get(traderKey) ?? []).map((q) => q.name)
  setAllQuestsForTrader(traderKey, names, true)
}

function resetTrader(traderKey: TraderKey): void {
  const names = (QUESTS_BY_TRADER.get(traderKey) ?? []).map((q) => q.name)
  setAllQuestsForTrader(traderKey, names, false)
}

function completeAll(): void {
  for (const trader of tradersWithQuests) {
    completeTrader(trader.key)
  }
}

function resetAll(): void {
  for (const trader of tradersWithQuests) {
    resetTrader(trader.key)
  }
}

function formatItems(items: QuestItem[]): string {
  return items.map((i) => (i.count > 1 ? `${i.name} x${i.count}` : i.name)).join(', ')
}

function difficultyVariant(difficulty: string) {
  if (difficulty === 'Easy') return 'secondary' as const
  if (difficulty === 'Hard') return 'destructive' as const
  return 'default' as const
}
</script>

<template>
  <div v-if="tradersFile" class="max-w-3xl space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <ScrollText class="h-5 w-5 text-muted-foreground" />
        <h2 class="text-lg font-semibold">Quests</h2>
      </div>
      <div class="flex gap-2">
        <Button size="sm" variant="secondary" @click="completeAll">Complete All</Button>
        <Button size="sm" variant="outline" @click="resetAll">Reset All</Button>
      </div>
    </div>

    <div v-for="trader in tradersWithQuests" :key="trader.key" class="space-y-2">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <h3 class="text-sm font-semibold">{{ trader.displayName }}</h3>
          <span class="text-xs text-muted-foreground">
            {{ completedCount(trader.key) }}/{{ QUESTS_BY_TRADER.get(trader.key)?.length ?? 0 }}
            completed
          </span>
        </div>
        <div class="flex gap-1.5">
          <Button size="sm" variant="ghost" class="h-7 text-xs" @click="completeTrader(trader.key)">
            Complete All
          </Button>
          <Button size="sm" variant="ghost" class="h-7 text-xs" @click="resetTrader(trader.key)">
            Reset
          </Button>
        </div>
      </div>

      <div class="space-y-1">
        <label
          v-for="quest in QUESTS_BY_TRADER.get(trader.key)"
          :key="quest.name"
          class="flex items-center gap-3 text-sm cursor-pointer select-none rounded-md border border-border px-3 py-2 hover:bg-muted/50 transition-colors"
          :class="isCompleted(trader.key, quest.name) ? 'border-primary/50 bg-primary/5' : ''"
        >
          <input
            type="checkbox"
            :checked="isCompleted(trader.key, quest.name)"
            class="accent-primary"
            @change="toggleQuestCompletion(trader.key, quest.name)"
          />
          <span class="w-5 text-muted-foreground text-xs text-right shrink-0">
            {{ quest.order }}.
          </span>
          <span class="font-medium shrink-0">{{ quest.name }}</span>
          <Badge :variant="difficultyVariant(quest.difficulty)" class="text-[10px] shrink-0">
            {{ quest.difficulty }}
          </Badge>
          <span class="text-xs text-muted-foreground truncate ml-auto">
            {{ formatItems(quest.deliver) }}
            <span class="mx-1">&rarr;</span>
            {{ formatItems(quest.receive) }}
          </span>
        </label>
      </div>
    </div>
  </div>
</template>
