import { WEAPON_ATTACHMENT_LAYOUTS } from './weapon-attachments'
import { ITEMS_BY_PATH } from './items'

export type AttachmentSubtype = 'Optic' | 'Muzzle' | 'Laser' | 'Magazine'

/** Maps attachment resource path to its subtype. Derived from game ItemData.subtype fields. */
export const ATTACHMENT_SUBTYPE = new Map<string, AttachmentSubtype>([
  // Optics
  ['res://Items/Attachments/ACOG/ACOG.tres', 'Optic'],
  ['res://Items/Attachments/EXPS/EXPS.tres', 'Optic'],
  ['res://Items/Attachments/HMR/HMR.tres', 'Optic'],
  ['res://Items/Attachments/Kobra/Kobra.tres', 'Optic'],
  ['res://Items/Attachments/Leopard/Leopard.tres', 'Optic'],
  ['res://Items/Attachments/Micro/Micro.tres', 'Optic'],
  ['res://Items/Attachments/MRO/MRO.tres', 'Optic'],
  ['res://Items/Attachments/POSP/POSP.tres', 'Optic'],
  ['res://Items/Attachments/PRO/PRO.tres', 'Optic'],
  ['res://Items/Attachments/PU/PU.tres', 'Optic'],
  ['res://Items/Attachments/RMR/RMR.tres', 'Optic'],
  ['res://Items/Attachments/SRO/SRO.tres', 'Optic'],
  ['res://Items/Attachments/Vudu/Vudu.tres', 'Optic'],
  // Muzzles
  ['res://Items/Attachments/Hybrid/Hybrid.tres', 'Muzzle'],
  ['res://Items/Attachments/Monster/Monster.tres', 'Muzzle'],
  ['res://Items/Attachments/Navy/Navy.tres', 'Muzzle'],
  ['res://Items/Attachments/PBS/PBS.tres', 'Muzzle'],
  ['res://Items/Attachments/PTN/PTN.tres', 'Muzzle'],
  ['res://Items/Attachments/Rider/Rider.tres', 'Muzzle'],
  ['res://Items/Attachments/Salvo/Salvo.tres', 'Muzzle'],
  ['res://Items/Attachments/SOCOM/SOCOM.tres', 'Muzzle'],
  ['res://Items/Attachments/Thor/Thor.tres', 'Muzzle'],
  // Lasers
  ['res://Items/Attachments/ANPEQ/ANPEQ.tres', 'Laser'],
  ['res://Items/Attachments/OZ5/OZ5.tres', 'Laser'],
  // Magazines
  ['res://Items/Weapons/AK-12/AK-12_Magazine.tres', 'Magazine'],
  ['res://Items/Weapons/AKM/AKM_Magazine.tres', 'Magazine'],
  ['res://Items/Weapons/AKS-74U/AKS-74U_Magazine.tres', 'Magazine'],
  ['res://Items/Weapons/Colt_1911/Colt_1911_Magazine.tres', 'Magazine'],
  ['res://Items/Weapons/Glock_17/Glock_17_Magazine.tres', 'Magazine'],
  ['res://Items/Weapons/KAR-21/KAR-21_223_Magazine.tres', 'Magazine'],
  ['res://Items/Weapons/KAR-21/KAR-21_308_Magazine.tres', 'Magazine'],
  ['res://Items/Weapons/KP-31/KP-31_Drum.tres', 'Magazine'],
  ['res://Items/Weapons/M4A1/STANAG_Magazine.tres', 'Magazine'],
  ['res://Items/Weapons/M78/M78_Magazine.tres', 'Magazine'],
  ['res://Items/Weapons/MP5/MP5_Magazine.tres', 'Magazine'],
  ['res://Items/Weapons/MP7/MP7_Magazine.tres', 'Magazine'],
  ['res://Items/Weapons/Makarov/Makarov_Magazine.tres', 'Magazine'],
  ['res://Items/Weapons/P320/P320_Magazine.tres', 'Magazine'],
  ['res://Items/Weapons/RK-62/RK_Magazine.tres', 'Magazine'],
  ['res://Items/Weapons/SVD/SVD_Magazine.tres', 'Magazine'],
  ['res://Items/Weapons/VSS/VSS_Magazine.tres', 'Magazine']
])

/**
 * Layout paths in WEAPON_ATTACHMENT_LAYOUTS that differ from the actual ItemData path.
 * These weapons use a shared magazine (STANAG) but have weapon-specific visual scenes.
 */
const MAGAZINE_VISUAL_ALIASES = new Map<string, string>([
  [
    'res://Items/Weapons/HK416/HK416_Magazine.tres',
    'res://Items/Weapons/M4A1/STANAG_Magazine.tres'
  ],
  ['res://Items/Weapons/MK18/MK18_Magazine.tres', 'res://Items/Weapons/M4A1/STANAG_Magazine.tres'],
  ['res://Items/Weapons/M4A1/M4A1_Magazine.tres', 'res://Items/Weapons/M4A1/STANAG_Magazine.tres']
])

/** Resolves a layout path to the actual ItemData resource path */
export function resolveItemPath(layoutPath: string): string {
  return MAGAZINE_VISUAL_ALIASES.get(layoutPath) ?? layoutPath
}

/** Resolves an item path back to the visual layout path for a specific weapon */
export function resolveLayoutPath(itemPath: string, weaponPath: string): string | undefined {
  const layouts = WEAPON_ATTACHMENT_LAYOUTS.get(weaponPath)
  if (!layouts) return undefined
  // Direct match
  if (layouts.some((l) => l.attachmentPath === itemPath)) return itemPath
  // Check visual aliases
  for (const layout of layouts) {
    if (MAGAZINE_VISUAL_ALIASES.get(layout.attachmentPath) === itemPath) {
      return layout.attachmentPath
    }
  }
  return undefined
}

export interface AttachmentOption {
  itemPath: string
  layoutPath: string
  displayName: string
}

const SUBTYPE_ORDER: AttachmentSubtype[] = ['Magazine', 'Optic', 'Muzzle', 'Laser']

/**
 * Returns compatible attachments for a weapon, grouped by subtype.
 * Entries are ordered: Magazine, Optic, Muzzle, Laser.
 */
export function getWeaponSlots(weaponPath: string): Map<AttachmentSubtype, AttachmentOption[]> {
  const layouts = WEAPON_ATTACHMENT_LAYOUTS.get(weaponPath)
  if (!layouts) return new Map()

  const grouped = new Map<AttachmentSubtype, AttachmentOption[]>()
  const seen = new Set<string>()

  for (const layout of layouts) {
    const itemPath = resolveItemPath(layout.attachmentPath)
    if (seen.has(itemPath)) continue
    seen.add(itemPath)

    const subtype = ATTACHMENT_SUBTYPE.get(itemPath)
    if (!subtype) continue

    const item = ITEMS_BY_PATH.get(itemPath)
    if (!grouped.has(subtype)) grouped.set(subtype, [])
    grouped.get(subtype)!.push({
      itemPath,
      layoutPath: layout.attachmentPath,
      displayName: item?.displayName ?? itemPath.split('/').pop()?.replace('.tres', '') ?? itemPath
    })
  }

  // Return in consistent order
  const ordered = new Map<AttachmentSubtype, AttachmentOption[]>()
  for (const subtype of SUBTYPE_ORDER) {
    const options = grouped.get(subtype)
    if (options) ordered.set(subtype, options)
  }
  return ordered
}
