<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSaveEditor } from './composables/useSaveEditor'
import TitleBar from './components/TitleBar.vue'
import StatsPanel from './components/StatsPanel.vue'
import InventoryPanel from './components/InventoryPanel.vue'
import SettingsPanel from './components/SettingsPanel.vue'
import BackupsPanel from './components/BackupsPanel.vue'
import CatPanel from './components/CatPanel.vue'
import AddItemDialog from './components/AddItemDialog.vue'
import IconStatusBanner from './components/IconStatusBanner.vue'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs'

const { tresFile, isLoading, loadError, init } = useSaveEditor()

const addDialogOpen = ref(false)
const defaultTab = computed(() => (loadError.value ? 'backups' : 'inventory'))

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
      v-else-if="loadError || tresFile"
      :default-value="defaultTab"
      class="flex-1 flex flex-col min-h-0"
    >
      <div class="border-b border-border px-4">
        <TabsList class="bg-transparent h-9">
          <TabsTrigger value="character" :disabled="!!loadError">Character</TabsTrigger>
          <TabsTrigger value="inventory" :disabled="!!loadError">Inventory</TabsTrigger>
          <TabsTrigger value="cat" :disabled="!!loadError">Cat</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="backups">Backups</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent v-if="loadError" value="character" class="flex-1 min-h-0 p-4 mt-0" />
      <TabsContent v-else value="character" class="flex-1 min-h-0 p-4 mt-0 overflow-auto">
        <StatsPanel />
      </TabsContent>

      <TabsContent v-if="loadError" value="inventory" class="flex-1 min-h-0 p-4 mt-0" />
      <TabsContent v-else value="inventory" class="flex-1 min-h-0 p-4 mt-0">
        <InventoryPanel @open-add-dialog="addDialogOpen = true" />
      </TabsContent>

      <TabsContent v-if="loadError" value="cat" class="flex-1 min-h-0 p-4 mt-0" />
      <TabsContent v-else value="cat" class="flex-1 min-h-0 p-4 mt-0 overflow-auto">
        <CatPanel />
      </TabsContent>

      <TabsContent value="settings" class="flex-1 min-h-0 p-4 mt-0 overflow-auto">
        <SettingsPanel />
      </TabsContent>

      <TabsContent value="backups" class="flex-1 min-h-0 p-4 mt-0 overflow-auto">
        <BackupsPanel />
      </TabsContent>
    </Tabs>

    <IconStatusBanner />
    <AddItemDialog v-model:open="addDialogOpen" />
  </div>
</template>
