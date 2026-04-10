import { ref, readonly } from 'vue'

type IconStatus = 'idle' | 'extracting' | 'done' | 'error' | 'not-found'

const status = ref<IconStatus>('idle')
const progress = ref(0)
const total = ref(0)
const error = ref<string | null>(null)

// Cache of item ID → base64 data URL (loaded lazily)
const iconCache = new Map<string, string | null>()
// Track pending loads to avoid duplicate requests
const pendingLoads = new Map<string, Promise<string | null>>()

let initialized = false
let cleanupProgressListener: (() => void) | null = null

async function initIcons(): Promise<void> {
  if (initialized) return
  initialized = true

  const result = await window.api.getIconStatus()

  if (result.status === 'not-found') {
    status.value = 'not-found'
    return
  }

  if (result.status === 'done') {
    status.value = 'done'
    return
  }

  // Need to extract
  await startExtraction()
}

async function startExtraction(force = false): Promise<void> {
  status.value = 'extracting'
  progress.value = 0
  total.value = 0
  error.value = null

  // Listen for progress events
  cleanupProgressListener?.()
  cleanupProgressListener = window.api.onIconProgress((data) => {
    progress.value = data.current
    total.value = data.total
  })

  try {
    await window.api.extractIcons(force)
    status.value = 'done'
    // Clear cache so icons are re-fetched
    iconCache.clear()
    pendingLoads.clear()
  } catch (err) {
    status.value = 'error'
    error.value = err instanceof Error ? err.message : String(err)
  } finally {
    cleanupProgressListener?.()
    cleanupProgressListener = null
  }
}

/** Retry after an error (respects cache) */
async function retry(): Promise<void> {
  initialized = false
  iconCache.clear()
  pendingLoads.clear()
  await initIcons()
}

/** Force re-extract all icons from PCK, ignoring cache */
async function reload(): Promise<void> {
  iconCache.clear()
  pendingLoads.clear()
  await startExtraction(true)
}

/**
 * Get a cached icon data URL for an item ID.
 * Returns null if not loaded yet — call loadIcon to trigger async load.
 */
function getCachedIcon(itemId: string): string | null {
  return iconCache.get(itemId) ?? null
}

/**
 * Load an icon for an item ID. Returns a data URL or null.
 * Results are cached — subsequent calls return immediately.
 */
async function loadIcon(itemId: string): Promise<string | null> {
  if (iconCache.has(itemId)) return iconCache.get(itemId)!

  // Deduplicate concurrent requests
  let pending = pendingLoads.get(itemId)
  if (!pending) {
    pending = window.api.getIcon(itemId).then((result) => {
      iconCache.set(itemId, result)
      pendingLoads.delete(itemId)
      return result
    })
    pendingLoads.set(itemId, pending)
  }

  return pending
}

export function useItemIcons() {
  // Start initialization on first use
  initIcons()

  return {
    status: readonly(status),
    progress: readonly(progress),
    total: readonly(total),
    error: readonly(error),
    getCachedIcon,
    loadIcon,
    retry,
    reload
  }
}
