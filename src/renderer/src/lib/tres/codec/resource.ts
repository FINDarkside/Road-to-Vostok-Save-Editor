import type { Property } from '../types'
import type { FieldCodec, InferFields, ParseCtx, ResourceCodec, SerializeCtx } from './types'

/**
 * Compose a set of field codecs into a ResourceCodec.
 *
 * Parse: for each declared field, reads its value (or default when absent).
 * Properties outside the schema are ignored on the typed side but preserved by
 * the overlay serializer on roundtrip.
 *
 * Serialize:
 * - If `source` is provided (parsed resource), walks it in order. For keys in
 *   the schema, asks the field codec to produce the new TresValue (which may
 *   be the source value itself when unchanged, or `null` to omit). Keys not in
 *   the schema pass through unchanged.
 * - For schema fields absent from source, appends them at the end when the
 *   codec returns a non-null value.
 * - If `source` is null, emits schema fields in declaration order, omitting
 *   any the codec returns `null` for (default-valued).
 */
export function resource<S extends Record<string, FieldCodec<unknown>>>(
  fields: S
): ResourceCodec<InferFields<S>> {
  const entries = Object.entries(fields) as [string, FieldCodec<unknown>][]

  return {
    fields: fields as Record<string, FieldCodec<unknown>>,
    parse(props: Property[], ctx: ParseCtx): InferFields<S> {
      const out = {} as Record<string, unknown>
      for (const [key, codec] of entries) {
        const prop = props.find((p) => p.key === key)
        out[key] = codec.parse(prop?.value, ctx)
      }
      return out as InferFields<S>
    },
    serialize(current: InferFields<S>, source: Property[] | null, ctx: SerializeCtx): Property[] {
      const typed = current as Record<string, unknown>
      const out: Property[] = []

      if (source) {
        const emittedKeys = new Set<string>()

        // Godot must see a resource's script before script-defined properties
        // such as itemData. Preserve valid files as-is while also normalizing
        // missing or misplaced script properties to the first position.
        const scriptCodec = fields.script
        if (scriptCodec) {
          const sourceScript = source.find((prop) => prop.key === 'script')
          const next = scriptCodec.serialize(typed.script, sourceScript?.value, ctx)
          if (next !== null) out.push({ key: 'script', value: next })
          emittedKeys.add('script')
        }

        for (const prop of source) {
          if (prop.key === 'script' && scriptCodec) continue
          const codec = fields[prop.key]
          if (codec) {
            const next = codec.serialize(typed[prop.key], prop.value, ctx)
            if (next !== null) out.push({ key: prop.key, value: next })
            emittedKeys.add(prop.key)
          } else {
            // Unknown field — pass through for roundtrip preservation
            out.push(prop)
          }
        }
        // Append schema fields that weren't present in source
        for (const [key, codec] of entries) {
          if (emittedKeys.has(key)) continue
          const next = codec.serialize(typed[key], undefined, ctx)
          if (next !== null) out.push({ key, value: next })
        }
      } else {
        // No source — emit schema fields in declaration order, skipping defaults
        for (const [key, codec] of entries) {
          const next = codec.serialize(typed[key], undefined, ctx)
          if (next !== null) out.push({ key, value: next })
        }
      }

      return out
    }
  }
}
