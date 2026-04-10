# Road to Vostok Save Editor

A desktop save file editor for the game "Road to Vostok", built with Electron.

## Tech Stack

- **Framework**: Electron + electron-vite (https://electron-vite.org)
- **Frontend**: Vue 3 + TypeScript
- **Build**: electron-builder
- **Linting**: ESLint + Prettier

## Project Structure

- `src/main/` — Electron main process
- `src/preload/` — Preload scripts (bridge between main and renderer)
- `src/renderer/` — Vue frontend (renderer process)
- `resources/` — Static assets bundled with the app
- `out/` — Build output (gitignored)

## Rules

- Do NOT start the dev server (`npm run dev`). The user will run it themselves.

## Commands

- `npm run dev` — Start dev mode with hot reload
- `npm run build` — Typecheck and build for production
- `npm run build:win` — Build Windows distributable
- `npm run lint` — Run ESLint
- `npm run format` — Format code with Prettier
- `npm run typecheck` — Run TypeScript type checking
