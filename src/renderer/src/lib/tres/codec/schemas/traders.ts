import { f } from '../fields'
import { resource } from '../resource'
import type { Infer } from '../types'

const TASK_DATA_SCRIPT = 'res://Scripts/TaskData.gd'

/** Schema for the [resource] section of Traders.tres (`TraderSave`). */
export const tradersSchema = resource({
  generalist: f.stringArray({ default: [] }),
  doctor: f.stringArray({ default: [] }),
  gunsmith: f.stringArray({ default: [] }),
  grandma: f.stringArray({ default: [] }),
  taskNotes: f.extRefArray({ default: [], elementTypePath: TASK_DATA_SCRIPT })
})

export type TradersResource = Infer<typeof tradersSchema>
