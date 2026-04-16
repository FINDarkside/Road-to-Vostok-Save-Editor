import { f } from '../fields'
import { resource } from '../resource'
import type { Infer } from '../types'

/** Schema for the [resource] section of World.tres (`WorldSave`). */
export const worldSchema = resource({
  difficulty: f.int({ default: 1 }),
  season: f.int({ default: 1 }),
  day: f.int({ default: 1 }),
  time: f.float({ default: 1200 }),
  weather: f.string({ default: 'Neutral' }),
  weatherTime: f.float({ default: 600 }),
  shelters: f.int({ default: 0 })
})

export type WorldResource = Infer<typeof worldSchema>
