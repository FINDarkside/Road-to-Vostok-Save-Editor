<script setup lang="ts">
import { onMounted } from 'vue'
import { useBackups } from '../composables/useBackups'
import { Button } from '../components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../components/ui/table'
import { FolderOpen, RotateCcw } from 'lucide-vue-next'

const { backups, isLoading, loadBackups, restoreBackup, openBackupsDir } = useBackups()

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleString()
}

async function handleRestore(folderName: string) {
  await restoreBackup(folderName)
}

onMounted(() => {
  loadBackups()
})
</script>

<template>
  <div class="space-y-4 p-1">
    <div class="flex items-center gap-3">
      <span class="text-sm text-muted-foreground shrink-0">Backup folder</span>
      <Button variant="ghost" size="icon" class="h-7 w-7 shrink-0" @click="openBackupsDir">
        <FolderOpen class="h-4 w-4" />
      </Button>
    </div>

    <div v-if="isLoading" class="text-sm text-muted-foreground">Loading...</div>

    <p v-else-if="backups.length === 0" class="text-sm text-muted-foreground">
      No backups yet. Backups are created automatically when you save.
    </p>

    <Table v-else>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Size</TableHead>
          <TableHead class="w-[80px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="backup in backups" :key="backup.folderName">
          <TableCell class="text-sm">{{ formatDate(backup.timestamp) }}</TableCell>
          <TableCell class="text-sm text-muted-foreground">{{ formatSize(backup.size) }}</TableCell>
          <TableCell>
            <Button
              variant="outline"
              size="sm"
              class="text-xs gap-1.5"
              @click="handleRestore(backup.folderName)"
            >
              <RotateCcw class="h-3.5 w-3.5" />
              Restore
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
