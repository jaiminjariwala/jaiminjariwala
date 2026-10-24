# TypeScript migration

The portfolio's authored application code is TypeScript. Pages and React components use `.tsx`; API routes, content, geometry, animation helpers, SEO utilities, scripts, and tests use `.ts`.

## Type checking

- `npm run typecheck` generates Next.js route/environment definitions first, then runs `tsc --noEmit` with `strict: true` and `allowJs: false`. It does not require a prior production build on a fresh clone.
- `npm test` runs the regression suite through `tsx`, including the geometry, mobile gestures, sticker motion, media controls, accessibility, and SEO checks.
- `npm run build` also runs Next.js's production TypeScript validation. Build errors are not ignored.
- `npm run lint` includes Next.js's TypeScript lint configuration.

Shared types describe portfolio sections, projects and gallery data, API responses, pointer gestures, paper state, and GPU renderer inputs. DOM references and React events are explicitly typed. No blanket `any`, `@ts-ignore`, or `@ts-nocheck` was added to bypass the migration.

## Deliberate JavaScript boundaries

`src/components/reference-paper/pageEngine.js`, `paperMath.js`, and `gpuKernel.js` are compiled third-party runtime code. They remain JavaScript so the renderer's implementation and approved animation are preserved. Adjacent declaration files type the public interfaces consumed by the TypeScript app. Their provenance remains documented in that directory's README.

`public/vendor/pdf.worker.min.mjs` is a generated third-party PDF worker. ESLint excludes these compiled vendor files, not first-party TypeScript. ESLint and PostCSS configuration files remain standard `.mjs` tooling configuration; `next.config.ts` is typed.

The dependency lockfile pins TypeScript 5.9 for this Next.js 16.1 app. This migration does not upgrade the framework or install an experimental compiler. Next.js strips TypeScript syntax and produces JavaScript for the browser; type checking does not add runtime response validation or automatically accelerate page animations.

## Local verification

```bash
npm ci
npm run typecheck
npm test
npm run lint
npm run build
npm run start -- --port 3010
```

From another terminal, use `npm run test:seo -- http://127.0.0.1:3010` to check the production server. Check desktop and mobile layouts after changes to the paper interaction, since automated geometry checks alone do not measure device GPU performance.
