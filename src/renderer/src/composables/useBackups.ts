import { ref } from 'vue'
import { init } from './useTresFileLoader'

type BackupEntry = Awaited<ReturnType<typeof window.api.listBackups>>[number]

const backups = ref<BackupEntry[]>([])
const isLoading = ref(false)

export function useBackups() {
  async function loadBackups() {
    isLoading.value = true
    try {
      backups.value = await window.api.listBackups()
    } finally {
      isLoading.value = false
    }
  }

  async function restoreBackup(folderName: string) {
    await window.api.restoreBackup(folderName)
    await init()
    await loadBackups()
  }

  function openBackupsDir() {
    window.api.openBackupsDir()
  }

  return { backups, isLoading, loadBackups, restoreBackup, openBackupsDir }
}
