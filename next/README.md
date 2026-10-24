# Jaimin Jariwala's Portfolio

Personal portfolio built with Next.js, React, and TypeScript, with an interactive rolling-paper interface, travel photos, projects, work experience, and education.

[Visit the website](https://jaiminjariwala.netlify.app).

## Local development

Run from this directory:

```bash
npm install
npm run dev -- --port 3010
```

Open [localhost:3010](http://localhost:3010).

## Checks

```bash
npm run typecheck
npm test
npm run lint
```

The app, API routes, animation helpers, and regression tests use strict TypeScript (`allowJs: false`). Tests run through `tsx` so they work on the deployed Node 20 toolchain as well as newer Node releases. See [TypeScript migration notes](docs/TYPESCRIPT.md) for the intentional third-party JavaScript boundary.

TypeScript checks code during development; Next.js still builds JavaScript for browsers. Migrating languages is not a browser-performance optimization by itself.

## Production build

```bash
npm run build
npm run start -- --port 3010
```

With the production server running, `npm run test:seo -- http://127.0.0.1:3010` checks crawlable pages, metadata, structured data, and discovery endpoints.

Deployment is configured in the repository's `netlify.toml`. See [release notes](../PORTFOLIO-V2-RELEASE.md) for release details and asset provenance.
