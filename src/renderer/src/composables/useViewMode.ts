import { ref, watch } from 'vue'

export type ViewMode = 'grid' | 'list'

export function useViewMode(key: string, defaultMode: ViewMode = 'list') {
  const stored = localStorage.getItem(`viewMode:${key}`) as ViewMode | null
  const viewMode = ref<ViewMode>(stored === 'grid' || stored === 'list' ? stored : defaultMode)
  watch(viewMode, (m) => localStorage.setItem(`viewMode:${key}`, m))
  return { viewMode }
}
