import type { TresFile, TresHeader, ExtResource, SubResource, Property } from './types'
import { parseValue } from './values'

/**
 * Parse a Godot .tres file string into a TresFile structure.
 */
export function parseTresFile(content: string): TresFile {
  const lines = content.split('\n')
  let i = 0

  // --- Parse header ---
  const header = parseHeader(lines[i])
  i++

  const extResources: ExtResource[] = []
  const subResources: SubResource[] = []
  const resource: Property[] = []

  while (i < lines.length) {
    const line = lines[i].trim()

    // Skip blank lines
    if (line === '') {
      i++
      continue
    }

    // ext_resource
    if (line.startsWith('[ext_resource')) {
      extResources.push(parseExtResource(line))
      i++
      continue
    }

    // sub_resource
    if (line.startsWith('[sub_resource')) {
      const { subResource, nextIndex } = parseSubResource(lines, i)
      subResources.push(subResource)
      i = nextIndex
      continue
    }

    // [resource] section
    if (line === '[resource]') {
      i++
      while (i < lines.length) {
        const propLine = lines[i]
        if (propLine.trim() === '' || propLine.trim().startsWith('[')) {
          i++
          continue
        }
        const prop = parseProperty(propLine)
        if (prop) resource.push(prop)
        i++
      }
      continue
    }

    i++
  }

  return { header, extResources, subResources, resource }
}

function parseHeader(line: string): TresHeader {
  const raw = line
  const type = extractAttr(line, 'type') ?? 'Resource'
  const scriptClass = extractAttr(line, 'script_class')
  const formatStr = extractAttr(line, 'format')
  const format = formatStr ? parseInt(formatStr, 10) : 3
  const loadStepsStr = extractAttr(line, 'load_steps')
  const loadSteps = loadStepsStr ? parseInt(loadStepsStr, 10) : undefined

  return { type, scriptClass, format, loadSteps, raw }
}

function parseExtResource(line: string): ExtResource {
  return {
    id: extractAttr(line, 'id') ?? '',
    type: extractAttr(line, 'type') ?? '',
    path: extractAttr(line, 'path') ?? '',
    uid: extractAttr(line, 'uid'),
    raw: line
  }
}

function parseSubResource(
  lines: string[],
  startIndex: number
): { subResource: SubResource; nextIndex: number } {
  const headerLine = lines[startIndex]
  const id = extractAttr(headerLine, 'id') ?? ''
  const type = extractAttr(headerLine, 'type') ?? 'Resource'
  const properties: Property[] = []

  let i = startIndex + 1
  while (i < lines.length) {
    const line = lines[i]
    // Stop at next section header or blank line (sub_resources are separated by blank lines)
    if (line.trim() === '' || line.trim().startsWith('[')) {
      break
    }
    const prop = parseProperty(line)
    if (prop) properties.push(prop)
    i++
  }

  return { subResource: { id, type, properties }, nextIndex: i }
}

function parseProperty(line: string): Property | null {
  const eqIndex = line.indexOf(' = ')
  if (eqIndex === -1) return null
  const key = line.slice(0, eqIndex).trim()
  const valueStr = line.slice(eqIndex + 3)
  return { key, value: parseValue(valueStr) }
}

/**
 * Extract a named attribute from a [...] header line.
 * Handles both quoted and unquoted values.
 */
function extractAttr(line: string, name: string): string | undefined {
  // Match name="value" or name=value
  const quotedRegex = new RegExp(`${name}="([^"]*)"`)
  const quotedMatch = line.match(quotedRegex)
  if (quotedMatch) return quotedMatch[1]

  const unquotedRegex = new RegExp(`${name}=(\\S+?)(?=[\\s\\]])`)
  const unquotedMatch = line.match(unquotedRegex)
  if (unquotedMatch) return unquotedMatch[1]

  return undefined
}
