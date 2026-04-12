import { ref } from 'vue'

export interface Toast {
  id: number
  message: string
  type: 'error' | 'success'
}

const toasts = ref<Toast[]>([])
let nextId = 0

export function useToast() {
  function show(message: string, type: Toast['type'] = 'error') {
    const id = nextId++
    toasts.value.push({ id, message, type })
    setTimeout(() => dismiss(id), 5000)
  }

  function dismiss(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return { toasts, show, dismiss }
}
