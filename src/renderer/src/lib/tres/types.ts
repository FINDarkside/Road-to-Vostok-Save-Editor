export interface TresFile {
  header: TresHeader
  extResources: ExtResource[]
  subResources: SubResource[]
  /** Key-value pairs from the [resource] section */
  resource: Property[]
}

export interface TresHeader {
  type: string
  scriptClass?: string
  format: number
  loadSteps?: number
  /** Any other attributes on the header line we don't explicitly model */
  raw: string
}

export interface ExtResource {
  id: string
  type: string
  path: string
  /** UID if present (e.g. uid="uid://...") */
  uid?: string
  /** The full raw line for exact roundtrip */
  raw: string
}

export interface SubResource {
  id: string
  type: string
  properties: Property[]
}

/** A key-value pair preserving insertion order */
export interface Property {
  key: string
  value: TresValue
}

// --- TresValue discriminated union ---

export type TresValue =
  | TresString
  | TresInt
  | TresFloat
  | TresBool
  | TresVector2
  | TresVector3
  | TresExtResourceRef
  | TresSubResourceRef
  | TresTypedArray
  | TresDict
  | TresNull

export interface TresString {
  kind: 'string'
  value: string
}

export interface TresInt {
  kind: 'int'
  value: number
  raw: string
}

export interface TresFloat {
  kind: 'float'
  value: number
  raw: string
}

export interface TresBool {
  kind: 'bool'
  value: boolean
}

export interface TresVector2 {
  kind: 'vector2'
  x: number
  y: number
  raw: string
}

export interface TresVector3 {
  kind: 'vector3'
  x: number
  y: number
  z: number
  raw: string
}

export interface TresExtResourceRef {
  kind: 'ext_resource'
  id: string
}

export interface TresSubResourceRef {
  kind: 'sub_resource'
  id: string
}

export interface TresTypedArray {
  kind: 'typed_array'
  /** The raw type annotation string, e.g. 'ExtResource("1")' or 'String' */
  elementType: string
  elements: TresValue[]
}

export interface TresDict {
  kind: 'dict'
  /** Store raw string for roundtrip — dict parsing not needed for MVP */
  raw: string
}

export interface TresNull {
  kind: 'null'
}
