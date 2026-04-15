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
  | 'Furniture'
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
  /** Name shown in inventory (normal orientation) */
  nameInventory?: string
  /** Name shown in inventory (rotated) */
  nameRotated?: string
  /** Name shown in equipment slots */
  nameEquipment?: string
  resourcePath: string
  /** Grid size width. Default: 1 */
  sizeW?: number
  /** Grid size height. Default: 1 */
  sizeH?: number
  /** Icon filename stem from the game data (e.g. "Icon_AK-12" → used for PCK cache lookup) */
  iconFile?: string
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
  /** Equipment slots this item can be placed in (e.g. ["Primary", "Secondary"]) */
  slots?: string[]
  /** Resource paths this item accepts through the game's combine/nested system */
  compatible?: string[]
  /** Armor plate item usable inside compatible carrier rigs */
  plate?: boolean
  /** Rig that can contain one armor plate */
  carrier?: boolean
  /** Armor rating label shown by the game, e.g. "III+" */
  armorRating?: string
  /** Storage container grid size for storage furniture (lockers, cabinets, fridge, etc.) */
  containerSize?: { w: number; h: number }
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
  /** Name for inventory label (normal orientation) */
  nameInventory: string
  /** Name for inventory label (rotated) */
  nameRotated: string
  /** Name for equipment slot label */
  nameEquipment: string
  /** Item category from the catalog */
  category: string
  condition: number
  /** Whether condition is meaningful for this item type */
  showCondition: boolean
  amount: number
  /** Whether amount is meaningful for this item type */
  showAmount: boolean
  /** Whether a round is chambered (weapons only) */
  chamber: boolean
  gridPosition: { x: number; y: number }
  gridRotated: boolean
  /** Equipment slot ("Primary", "Head", etc.) or "" for inventory items */
  slot: string
  /** Resource paths of nested items (magazine, attachments) */
  nested: string[]
  /** Armor rating label for plates or plated rigs */
  armorRating: string
  /** Whether this item is a rig that can contain an armor plate */
  carrier: boolean
  /** Nested armor plate path, when this item is a plated rig */
  armorPlatePath: string
}

export interface GridItemPlacement {
  subResourceId: string
  itemPath: string
  iconFile: string
  itemName: string
  nameInventory: string
  nameRotated: string
  nameEquipment: string
  category: string
  condition: number
  showCondition: boolean
  amount: number
  showAmount: boolean
  chamber: boolean
  col: number
  row: number
  w: number
  h: number
  rotated: boolean
  /** Resource paths of nested items (magazine, attachments) */
  nested: string[]
  /** Armor rating label for plates or plated rigs */
  armorRating: string
  /** Whether this item is a rig that can contain an armor plate */
  carrier: boolean
  /** Nested armor plate path, when this item is a plated rig */
  armorPlatePath: string
}

export interface DragSource {
  origin: 'grid' | 'equipment'
  item: GridItemPlacement
  /** If origin is 'equipment', the slot name the item was dragged from */
  equipmentSlot?: string
}

export interface GridSnapState {
  col: number
  row: number
  w: number
  h: number
  rotated: boolean
  isValid: boolean
}

export interface EquipmentHoverState {
  slotName: string
  isValid: boolean
}

export interface PlateHoverState {
  targetSubResourceId: string
  isValid: boolean
}

export interface DragDropState {
  source: DragSource
  /** Mouse position in document (client) coordinates */
  clientX: number
  clientY: number
  /** Grid snap info — set when pointer is over the inventory grid */
  gridSnap: GridSnapState | null
  /** Equipment slot hover — set when pointer is over an equipment slot */
  equipmentHover: EquipmentHoverState | null
  /** Rig hover — set when dragging an armor plate over a compatible carrier rig */
  plateHover: PlateHoverState | null
  /** Whether the pointer is over the delete zone */
  deleteHover: boolean
  /** Current ghost dimensions (updated by grid snap / rotation) */
  ghostW: number
  ghostH: number
  ghostRotated: boolean
  /** UI cell size used to render the ghost */
  ghostCellSize: number
  /** Grab offset for ghost rendering */
  offsetX: number
  offsetY: number
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
  headshot: boolean
}

export interface CatStatus {
  cat: number
  catFound: boolean
  catDead: boolean
}

export interface WorldState {
  difficulty: number
  season: number
  day: number
  weather: string
}
