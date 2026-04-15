# Road to Vostok Save Editor

A desktop save file editor for the game "Road to Vostok", built with Electron.

## Tech Stack

- **Framework**: Electron + electron-vite (https://electron-vite.org)
- **Frontend**: Vue 3 + TypeScript
- **Package Manager**: npm
- **Build**: electron-builder
- **Linting**: ESLint + Prettier

## Project Structure

- `src/main/` - Electron main process
- `src/preload/` - Preload scripts (bridge between main and renderer)
- `src/renderer/` - Vue frontend (renderer process)
- `resources/` - Static assets bundled with the app
- `out/` - Build output (gitignored)

## Rules

- Do NOT start the dev server (`npm run dev`). The user will run it themselves.
- Prefer implicit typing when reasonable - let TypeScript infer return types, variable types, etc. Only add explicit type annotations when they improve clarity or are required.
- If `CLAUDE.local.md` exists, read it for local/private instructions. Those instructions are intentionally untracked and should stay out of git.

## Commands

- `npm run dev` - Start dev mode with hot reload
- `npm run build` - Typecheck and build for production
- `npm run build:win` - Build Windows distributable
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Run TypeScript type checking
