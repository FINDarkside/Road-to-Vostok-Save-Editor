import type { TresFile, TresValue, Property, SubResource } from '../types'

/**
 * A bidirectional codec for a single property value.
 *
 * `parse` reads a TresValue (or undefined when the property is absent) and
 * produces the typed value. `serialize` takes the current typed value plus the
 * original source TresValue (if it was present on the parsed file) and returns
 * either a TresValue to emit, or `null` to omit the property entirely.
 *
 * Omitting when absent-in-source and value-equals-default is how we preserve
 * the game's convention of omitting default-valued fields.
 */
export interface FieldCodec<T> {
  readonly default: T
  parse(value: TresValue | undefined, ctx: ParseCtx): T
  serialize(current: T, source: TresValue | undefined, ctx: SerializeCtx): TresValue | null
}

export interface ResourceCodec<T> {
  readonly fields: Record<string, FieldCodec<unknown>>
  parse(props: Property[], ctx: ParseCtx): T
  /**
   * Serialize a typed value back to Property[].
   *
   * When `source` is non-null, walks it in order (preserving unknown keys and
   * original ordering). When `source` is null (freshly created resource),
   * emits only fields whose value differs from their default.
   */
  serialize(current: T, source: Property[] | null, ctx: SerializeCtx): Property[]
}

export interface ParseCtx {
  readonly tres: TresFile
}

export interface SerializeCtx {
  /** Mutable target — codecs append to extResources/subResources as needed. */
  readonly tres: TresFile
}

/** Maps a record of FieldCodecs to a record of their typed values. */
export type InferFields<S extends Record<string, FieldCodec<unknown>>> = {
  [K in keyof S]: S[K] extends FieldCodec<infer T> ? T : never
}

export type Infer<R> =
  R extends ResourceCodec<infer T> ? T : R extends FieldCodec<infer T> ? T : never

/**
 * Helper shape for sub-resource schemas — each parsed sub-resource is tagged
 * with its `id` so downstream code can address it stably.
 */
export type WithId<T> = { id: string } & T

export type SubResourceCodec<T> = ResourceCodec<T> & {
  /** Parses a specific SubResource (by id) into typed form. */
  parseSubResource(sub: SubResource, ctx: ParseCtx): T
}
