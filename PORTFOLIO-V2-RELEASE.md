# Portfolio V2 release

Prepared October 22, 2026 on portfolio-v2-release, based on the latest
origin/main. The original portfolio-v2 branch and its individual development
commits remain local and unchanged.

## Included

- Introduction, Travel, Experience, and Education stamp pages.
- Paper roll/unroll navigation, edge dragging, and mobile curl refinements.
- Scalloped photo strips, entrance animation, and horizontal mouse dragging.
- Arrow, pointing-glove, open-glove, and closed-glove custom cursors.
- Inter body text, James Hand headings, and copy-email interaction.

The ABC Monument Grotesk font is excluded from this release and its history.
Inter is already supplied by this project's next/font/google integration.
Existing production profile files and legacy assets are preserved.

## Provenance

The paper renderer, James Hand font, and car artwork originated from jm.sv.
Their reuse permissions have not been established. The user directed release
after this was explained. See next/src/components/reference-paper/README.md
for renderer source URLs. This note does not grant or assert a third-party
license.

The school-bus image was supplied by the user. The user-supplied Snoopy image
was prepared as a transparent cutout; its edit prompt is retained alongside
the image.

## Checks

From next/:

    node --test src/components/paperMotion.test.mjs src/components/paperDragGeometry.test.mjs src/components/reference-paper/paperStampShader.test.mjs
    npm run build
    npm run start -- --port 3010

The build explicitly selects Webpack because the local Turbopack build failed
to resolve its generated Google Font modules. Projects and Skills are not yet
implemented.
