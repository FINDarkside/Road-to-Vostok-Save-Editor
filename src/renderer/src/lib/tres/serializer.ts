import type { TresFile } from './types'
import { serializeValue } from './values'

/**
 * Serialize a TresFile back to a .tres file string.
 * Preserves formatting for exact roundtrip.
 */
export function serializeTresFile(file: TresFile): string {
  const lines: string[] = []

  // Header
  lines.push(file.header.raw)

  // Blank line after header
  lines.push('')

  // ext_resources
  for (const ext of file.extResources) {
    lines.push(ext.raw)
  }

  // sub_resources (blank line before each)
  for (const sub of file.subResources) {
    lines.push('')
    lines.push(`[sub_resource type="${sub.type}" id="${sub.id}"]`)
    for (const prop of sub.properties) {
      lines.push(`${prop.key} = ${serializeValue(prop.value)}`)
    }
  }

  // [resource] section
  lines.push('')
  lines.push('[resource]')
  for (const prop of file.resource) {
    lines.push(`${prop.key} = ${serializeValue(prop.value)}`)
  }

  // Trailing newline
  lines.push('')

  return lines.join('\n')
}
