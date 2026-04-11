# Road to Vostok Save Editor

A desktop save file editor for the game "Road to Vostok", built with Electron.

## Tech Stack

- **Framework**: Electron + electron-vite (https://electron-vite.org)
- **Frontend**: Vue 3 + TypeScript
- **Package Manager**: pnpm
- **Build**: electron-builder
- **Linting**: ESLint + Prettier

## Project Structure

- `src/main/` — Electron main process
- `src/preload/` — Preload scripts (bridge between main and renderer)
- `src/renderer/` — Vue frontend (renderer process)
- `resources/` — Static assets bundled with the app
- `out/` — Build output (gitignored)

## Rules

- Do NOT start the dev server (`pnpm run dev`). The user will run it themselves.
- Prefer implicit typing when reasonable — let TypeScript infer return types, variable types, etc. Only add explicit type annotations when they improve clarity or are required.

## Commands

- `pnpm run dev` — Start dev mode with hot reload
- `pnpm run build` — Typecheck and build for production
- `pnpm run build:win` — Build Windows distributable
- `pnpm run lint` — Run ESLint
- `pnpm run format` — Format code with Prettier
- `pnpm run typecheck` — Run TypeScript type checking

@import CLAUDE.local.md
