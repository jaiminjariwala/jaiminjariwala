# Personal website release

The active website uses a rolling-paper interface for Introduction, Travel,
Experience, Education, and Projects. Travel folders contain horizontal photo
strips. Project media includes Sharded Raft KV, Codex Lite, the component
library, and URL Shortener.

## Maintained files

Application code and regression tests live in `next/src`. Public assets contain
only artwork, fonts, cursors, photos, and media used by the current interface.
The root README uses assets in `profile/assets`; its guestbook and language
statistics are maintained by the workflows in `.github`.

Retired pages, the old 3D scene and weather endpoint, unused dependencies,
draft artwork, superseded README animations, and their obsolete generators
have been removed. The live travel folder is maintained in `GlassFolder.tsx`.

## Provenance

The paper renderer, James Hand font, and car artwork originated from jm.sv.
Their reuse permissions have not been established. The user directed release
after this was explained. See
[`next/src/components/reference-paper/README.md`](next/src/components/reference-paper/README.md)
for renderer source URLs. This note does not grant or assert a third-party
license.

The school-bus image was supplied by the user. The user-supplied Snoopy image
was prepared as a transparent cutout; its edit prompt remains alongside the
image. README artwork sources are documented in
[`profile/assets/card-artwork-notes.md`](profile/assets/card-artwork-notes.md)
and [`profile/assets/retro/SOURCE.md`](profile/assets/retro/SOURCE.md).

## Checks

Run from `next/`:

```bash
npm ci
npm run typecheck
npm test
npm run lint
npm run build
npm run start -- --port 3010
```

With the production server running, use
`npm run test:seo -- http://127.0.0.1:3010`. Check desktop and mobile layouts,
page transitions, travel folders, project media, and the GitHub hover card
when changing shared styles or rendering code.
