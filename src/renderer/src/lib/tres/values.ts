import type { TresValue } from './types'

/**
 * Parse a Godot value string into a TresValue.
 * Handles: strings, bools, ints, floats, Vector2, Vector3,
 * ExtResource refs, SubResource refs, typed arrays, dicts, null.
 */
export function parseValue(raw: string): TresValue {
  raw = raw.trim()

  // null
  if (raw === 'null') {
    return { kind: 'null' }
  }

  // Boolean
  if (raw === 'true') return { kind: 'bool', value: true }
  if (raw === 'false') return { kind: 'bool', value: false }

  // String
  if (raw.startsWith('"')) {
    return { kind: 'string', value: parseGodotString(raw) }
  }

  // Vector2
  if (raw.startsWith('Vector2(')) {
    const inner = raw.slice(8, -1)
    const [x, y] = inner.split(',').map((s) => parseFloat(s.trim()))
    return { kind: 'vector2', x, y, raw }
  }

  // Vector3
  if (raw.startsWith('Vector3(')) {
    const inner = raw.slice(8, -1)
    const [x, y, z] = inner.split(',').map((s) => parseFloat(s.trim()))
    return { kind: 'vector3', x, y, z, raw }
  }

  // ExtResource reference
  if (raw.startsWith('ExtResource(')) {
    const id = raw.slice(13, -2) // ExtResource("X") -> X
    return { kind: 'ext_resource', id }
  }

  // SubResource reference
  if (raw.startsWith('SubResource(')) {
    const id = raw.slice(13, -2) // SubResource("X") -> X
    return { kind: 'sub_resource', id }
  }

  // Typed array: Array[Type]([...])
  if (raw.startsWith('Array[')) {
    return parseTypedArray(raw)
  }

  // Dict (store raw for roundtrip)
  if (raw.startsWith('{')) {
    return { kind: 'dict', raw }
  }

  // Number — float if contains '.', otherwise int
  if (/^-?\d/.test(raw)) {
    if (raw.includes('.')) {
      return { kind: 'float', value: parseFloat(raw), raw }
    }
    return { kind: 'int', value: parseInt(raw, 10), raw }
  }

  // Fallback: treat as string
  return { kind: 'string', value: raw }
}

function parseGodotString(raw: string): string {
  // Remove surrounding quotes and unescape
  return raw.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\')
}

function parseTypedArray(raw: string): TresValue {
  // Array[ExtResource("1")]([SubResource("x"), SubResource("y")])
  // Array[String](["a", "b"])
  // Array[ExtResource("3")]([])
  const bracketClose = raw.indexOf(']')
  const elementType = raw.slice(6, bracketClose) // e.g. ExtResource("1") or String

  // Find the contents between ([ and ])
  const contentStart = raw.indexOf('([', bracketClose) + 2
  const contentEnd = raw.lastIndexOf('])')
  const content = raw.slice(contentStart, contentEnd).trim()

  if (content === '') {
    return { kind: 'typed_array', elementType, elements: [] }
  }

  // Split elements carefully — can't just split on ',' because of nested parens
  const elements = splitArrayElements(content).map((el) => parseValue(el.trim()))
  return { kind: 'typed_array', elementType, elements }
}

/**
 * Split a comma-separated list of values, respecting parentheses and quotes.
 */
function splitArrayElements(content: string): string[] {
  const elements: string[] = []
  let depth = 0
  let inString = false
  let current = ''

  for (let i = 0; i < content.length; i++) {
    const ch = content[i]

    if (inString) {
      current += ch
      if (ch === '"' && content[i - 1] !== '\\') {
        inString = false
      }
      continue
    }

    if (ch === '"') {
      inString = true
      current += ch
    } else if (ch === '(' || ch === '[') {
      depth++
      current += ch
    } else if (ch === ')' || ch === ']') {
      depth--
      current += ch
    } else if (ch === ',' && depth === 0) {
      elements.push(current)
      current = ''
    } else {
      current += ch
    }
  }

  if (current.trim()) {
    elements.push(current)
  }

  return elements
}

/**
 * Serialize a TresValue back to its Godot string representation.
 */
export function serializeValue(val: TresValue): string {
  switch (val.kind) {
    case 'null':
      return 'null'
    case 'bool':
      return val.value ? 'true' : 'false'
    case 'string':
      return `"${val.value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
    case 'int':
      return val.raw
    case 'float':
      return val.raw
    case 'vector2':
      return val.raw
    case 'vector3':
      return val.raw
    case 'ext_resource':
      return `ExtResource("${val.id}")`
    case 'sub_resource':
      return `SubResource("${val.id}")`
    case 'typed_array': {
      const elems = val.elements.map(serializeValue).join(', ')
      return `Array[${val.elementType}]([${elems}])`
    }
    case 'dict':
      return val.raw
  }
}
