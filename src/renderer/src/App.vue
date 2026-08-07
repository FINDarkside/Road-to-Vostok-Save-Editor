<script setup lang="ts">
import { ref, computed, provide, onMounted } from 'vue'
import { character, world, traders, isLoading, loadError } from './composables/saveEditorState'
import { init } from './composables/useTresFileLoader'
import TitleBar from './components/TitleBar.vue'
import StatsPanel from './components/StatsPanel.vue'
import InventoryPanel from './components/InventoryPanel.vue'
import FurniturePanel from './components/FurniturePanel.vue'
import SettingsPanel from './components/SettingsPanel.vue'
import BackupsPanel from './components/BackupsPanel.vue'
import ChangelogPanel from './components/ChangelogPanel.vue'
import CatPanel from './components/CatPanel.vue'
import WorldPanel from './components/WorldPanel.vue'
import QuestsPanel from './components/QuestsPanel.vue'
import AddItemDialog from './components/AddItemDialog.vue'
import WeaponWorkbench from './components/WeaponWorkbench.vue'
import RigArmorWorkbench from './components/RigArmorWorkbench.vue'
import IconStatusBanner from './components/IconStatusBanner.vue'
import ToastContainer from './components/ToastContainer.vue'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs'
import type { SlotItem } from './lib/types'

const addDialogOpen = ref(false)
const addDialogTarget = ref<'inventory' | 'catalog'>('inventory')
const workbenchOpen = ref(false)
const workbenchWeapon = ref<SlotItem | null>(null)
const rigArmorWorkbenchOpen = ref(false)
const rigArmorWorkbenchRig = ref<SlotItem | null>(null)
const defaultTab = computed(() => (loadError.value ? 'backups' : 'inventory'))

function openInventoryAddDialog() {
  addDialogTarget.value = 'inventory'
  addDialogOpen.value = true
}

function openFurnitureAddDialog() {
  addDialogTarget.value = 'catalog'
  addDialogOpen.value = true
}

provide('openWorkbench', (weapon: SlotItem) => {
  workbenchWeapon.value = weapon
  workbenchOpen.value = true
})

provide('openRigArmorWorkbench', (rig: SlotItem) => {
  rigArmorWorkbenchRig.value = rig
  rigArmorWorkbenchOpen.value = true
})

onMounted(() => {
  init()
})
</script>

<template>
  <div class="h-screen flex flex-col bg-background text-foreground">
    <TitleBar />

    <div v-if="isLoading" class="flex-1 flex items-center justify-center text-muted-foreground">
      Loading...
    </div>

    <Tabs
      v-else-if="loadError || character"
      :default-value="defaultTab"
      class="flex-1 flex flex-col min-h-0"
    >
      <div class="border-b border-border">
        <TabsList class="bg-transparent h-full p-0">
          <TabsTrigger value="character" :disabled="!!loadError">Character</TabsTrigger>
          <TabsTrigger value="inventory" :disabled="!!loadError">Inventory</TabsTrigger>
          <TabsTrigger value="furniture" :disabled="!!loadError">Furniture</TabsTrigger>
          <TabsTrigger value="cat" :disabled="!!loadError">Cat</TabsTrigger>
          <TabsTrigger value="world" :disabled="!!loadError || !world">World</TabsTrigger>
          <TabsTrigger value="quests" :disabled="!!loadError || !traders">Quests</TabsTrigger>
          <div class="w-px self-stretch bg-border" />
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="backups">Backups</TabsTrigger>
          <TabsTrigger value="changelog">Changelog</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent v-if="loadError" value="character" class="flex-1 min-h-0 p-4 mt-0" />
      <TabsContent v-else value="character" class="flex-1 min-h-0 p-4 mt-0 overflow-auto">
        <StatsPanel />
      </TabsContent>

      <TabsContent v-if="loadError" value="inventory" class="flex-1 min-h-0 p-4 mt-0" />
      <TabsContent v-else value="inventory" class="flex-1 min-h-0 p-4 mt-0">
        <InventoryPanel @open-add-dialog="openInventoryAddDialog" />
      </TabsContent>

      <TabsContent v-if="loadError" value="furniture" class="flex-1 min-h-0 p-4 mt-0" />
      <TabsContent v-else value="furniture" class="flex-1 min-h-0 p-4 mt-0">
        <FurniturePanel @open-add-dialog="openFurnitureAddDialog" />
      </TabsContent>

      <TabsContent v-if="loadError" value="cat" class="flex-1 min-h-0 p-4 mt-0" />
      <TabsContent v-else value="cat" class="flex-1 min-h-0 p-4 mt-0 overflow-auto">
        <CatPanel />
      </TabsContent>

      <TabsContent v-if="loadError || !world" value="world" class="flex-1 min-h-0 p-4 mt-0" />
      <TabsContent v-else value="world" class="flex-1 min-h-0 p-4 mt-0 overflow-auto">
        <WorldPanel />
      </TabsContent>

      <TabsContent v-if="loadError || !traders" value="quests" class="flex-1 min-h-0 p-4 mt-0" />
      <TabsContent v-else value="quests" class="flex-1 min-h-0 p-4 mt-0 overflow-auto">
        <QuestsPanel />
      </TabsContent>

      <TabsContent value="settings" class="flex-1 min-h-0 p-4 mt-0 overflow-auto">
        <SettingsPanel />
      </TabsContent>

      <TabsContent value="backups" class="flex-1 min-h-0 p-4 mt-0 overflow-auto">
        <BackupsPanel />
      </TabsContent>

      <TabsContent value="changelog" class="flex-1 min-h-0 p-4 mt-0 overflow-auto">
        <ChangelogPanel />
      </TabsContent>
    </Tabs>

    <IconStatusBanner />
    <AddItemDialog v-model:open="addDialogOpen" :target="addDialogTarget" />
    <WeaponWorkbench v-model:open="workbenchOpen" :weapon="workbenchWeapon" />
    <RigArmorWorkbench v-model:open="rigArmorWorkbenchOpen" :rig="rigArmorWorkbenchRig" />
    <ToastContainer />
  </div>
</template>
