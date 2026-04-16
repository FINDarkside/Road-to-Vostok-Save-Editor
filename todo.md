# Refactoring TODO

Ordered by payoff. Do top-down — each step makes the next one easier.

## 1. ~~Split `useSaveEditor.ts` along feature seams~~ — done

Split into `saveEditorState.ts` (shared refs + helpers) and 7 feature modules: `useTresFileLoader`, `useInventoryItems`, `useCharacterStats`, `useWeaponAttachments`, `useArmorPlates`, `useQuests`, `useWorldProps`. All 17 consumers updated to import directly — no barrel re-export.

---

## 2. Extract `EquipmentSlot` from `EquipmentPanel.vue`

`src/renderer/src/components/EquipmentPanel.vue` is 540 lines and growing — recent commits (`b3a4770` repair-all, `694622f` attachment DnD, `b211fe9` rig plates) all landed here. It currently renders slots, owns drag handlers, defines context-menu actions, manages plate install/remove, and renders attachment visuals.

**Plan:**
- Extract `EquipmentSlot.vue` owning one slot + its drop target + context menu.
- Move the context-action list into a plain TS module that takes a `SlotItem` and returns action descriptors — keeps the `.vue` focused on layout.

**Scope:** medium.

---

## Not prioritized (reviewed, leaving alone)

- `src/renderer/src/lib/tres/parser.ts` (158 lines) and `values.ts` (175 lines) — actually tidy; `TresValue` union is well-modeled. Leave alone.
- IPC surface (`src/main/ipc/*`) — small and focused, no refactor needed.
- `src/renderer/src/composables/useDragDrop.ts` (604 lines) — big but not causing reported bugs; revisit only if it keeps growing.
- `src/renderer/src/data/items.ts` (2,933 lines) — only worth touching if the data is generated from game files; if hand-curated, fine as-is.

---

## Done

- ~~Extract shared item-creation helper~~ — commit `6ecd500`. `addSlotItem` at `useSaveEditor.ts:825`; the three public functions are now thin wrappers.
- ~~Introduce a typed-property access layer~~ — schema-driven codec at `src/renderer/src/lib/tres/codec/`. Typed resource objects (`CharacterResource`, `WorldResource`, `TradersResource`, `SlotItemData`) replace the hand-written `props.find` / value-kind narrowing in `useSaveEditor.ts`. Byte-identical roundtrip via overlay-on-source serializer; verified against real save files with `scripts/verify-codec-roundtrip.ts`.
