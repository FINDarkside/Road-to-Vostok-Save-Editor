<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSaveEditor } from './composables/useSaveEditor'
import TitleBar from './components/TitleBar.vue'
import StatsPanel from './components/StatsPanel.vue'
import InventoryPanel from './components/InventoryPanel.vue'
import EquipmentPanel from './components/EquipmentPanel.vue'
import SettingsPanel from './components/SettingsPanel.vue'
import AddItemDialog from './components/AddItemDialog.vue'
import IconStatusBanner from './components/IconStatusBanner.vue'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs'

const { tresFile, isLoading, loadError, init } = useSaveEditor()

const addDialogOpen = ref(false)

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

    <div
      v-else-if="loadError"
      class="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-2"
    >
      <p class="text-destructive">Failed to load save file</p>
      <p class="text-sm">{{ loadError }}</p>
    </div>

    <template v-else-if="tresFile">
      <Tabs default-value="inventory" class="flex-1 flex flex-col min-h-0">
        <div class="border-b border-border px-4">
          <TabsList class="bg-transparent h-9">
            <TabsTrigger value="character">Character</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="character" class="flex-1 min-h-0 p-4 mt-0 overflow-auto">
          <StatsPanel />
        </TabsContent>

        <TabsContent value="inventory" class="flex-1 min-h-0 p-4 mt-0">
          <InventoryPanel @open-add-dialog="addDialogOpen = true" />
        </TabsContent>

        <TabsContent value="equipment" class="flex-1 min-h-0 p-4 mt-0 overflow-auto">
          <EquipmentPanel />
        </TabsContent>

        <TabsContent value="settings" class="flex-1 min-h-0 p-4 mt-0 overflow-auto">
          <SettingsPanel />
        </TabsContent>
      </Tabs>
    </template>

    <IconStatusBanner />
    <AddItemDialog v-model:open="addDialogOpen" />
  </div>
</template>
