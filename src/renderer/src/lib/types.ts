export interface SaveFileInfo {
  fileName: string
}

export type ItemCategory =
  | 'Ammo'
  | 'Armor'
  | 'Attachments'
  | 'Backpacks'
  | 'Belts'
  | 'Books'
  | 'Clothing'
  | 'Consumables'
  | 'Electronics'
  | 'Fishing'
  | 'Grenades'
  | 'Helmets'
  | 'Instruments'
  | 'Keys'
  | 'Knives'
  | 'Lore'
  | 'Medical'
  | 'Misc'
  | 'Rigs'
  | 'Weapons'

export interface GameItem {
  category: ItemCategory
  id: string
  displayName: string
  resourcePath: string
  /** Item stacks in inventory (ammo + matches). Default: false */
  stackable?: boolean
  /** Condition is meaningful (weapons, armor, electronics). Default: false */
  showCondition?: boolean
  /** Amount is meaningful (stackable items, magazines, weapons). Default: false */
  showAmount?: boolean
  /** Default amount when spawning. Default: 0 */
  defaultAmount?: number
  /** Maximum amount value. Default: undefined */
  maxAmount?: number
  /** Item can be repaired to full condition. Default: false */
  repairs?: boolean
}

export interface ResolvedItemMeta {
  stackable: boolean
  showCondition: boolean
  showAmount: boolean
  defaultAmount: number
  defaultCondition: number
  maxAmount: number | undefined
  repairs: boolean
}

export interface SlotItem {
  /** sub_resource ID in the TresFile, e.g. "Resource_vtrgw" */
  subResourceId: string
  /** Resource path from the ext_resource, e.g. "res://Items/Weapons/RK-95/RK-95.tres" */
  itemPath: string
  /** Human-readable name resolved from the item catalog */
  itemName: string
  /** Item category from the catalog */
  category: string
  condition: number
  amount: number
  gridPosition: { x: number; y: number }
  gridRotated: boolean
  /** Equipment slot ("Primary", "Head", etc.) or "" for inventory items */
  slot: string
  /** Resource paths of nested items (magazine, attachments) */
  nested: string[]
}

export interface CharacterStats {
  health: number
  energy: number
  hydration: number
  temperature: number
  mental: number
}

export interface StatusEffects {
  starvation: boolean
  dehydration: boolean
  bleeding: boolean
  fracture: boolean
  burn: boolean
  frostbite: boolean
  insanity: boolean
  rupture: boolean
}
