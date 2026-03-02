# AGENTS.md

## Cursor Cloud specific instructions

This is a React + TypeScript design system built with Vite and Storybook.

### Services

| Service | Command | Port | Purpose |
|---------|---------|------|---------|
| Storybook | `pnpm storybook` | 6006 | Component development & documentation |
| Vite dev server | `pnpm dev` | 5173 | App development preview |

### Key commands

See `package.json` scripts for all available commands:

- **Lint**: `pnpm lint`
- **Test**: `pnpm test` (unit tests via Vitest + jsdom)
- **Build**: `pnpm build` (TypeScript check + Vite production build)
- **Storybook**: `pnpm storybook` (component dev environment on port 6006)

### Caveats

- The `pnpm.onlyBuiltDependencies` field in `package.json` allows `esbuild` to run build scripts. If new native dependencies are added, they may need to be added there or `pnpm install` will warn about ignored build scripts.
- Vitest cleanup between tests requires the explicit `afterEach(cleanup)` call in `src/test-setup.ts` — do not remove it.
- The Storybook addon-vitest integration expects Playwright browser binaries for browser-based story tests (`vitest --project=storybook`). These are not installed by default. The standard `pnpm test` command runs unit tests only (jsdom-based) and does not require Playwright.

### Project structure

- `src/components/` — design system components (each with `.tsx`, `.css`, `.test.tsx`, `.stories.ts`)
- `src/stories/` — Storybook example components (auto-generated)
- `.storybook/` — Storybook configuration
