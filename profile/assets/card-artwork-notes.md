# Profile card artwork

## Coastal shirt revision

Built-in image editing changed only the shirt to white and muted medium-dark denim blue horizontal stripes (target #38658A), preserving the character, 2 × 2 eye-state registration, and transparent canvas. Prompt: replace bright sky blue with deeper dusty coastal blue; keep white stripes, all facial details, black contours, scale and transparency unchanged. Saved source: `portrait-coastal-sheet.png`; assembled blinking output: `portrait-coastal.gif`.

## Transparent portrait and jumping books revision

Built-in image editing removed the red background from the portrait sheet, preserving the cartoon and eye states (`portrait-transparent-sheet.png`). Prompt: remove all red surroundings to genuine alpha; preserve the same 2 × 2 layout, character contours, colors, scale and open/closed eyes, without halos or shadows.

Built-in image editing separated the yellow and pink notebooks (`separate-books-sheet.png`). Prompt: isolate complete yellow and pink notebooks from the backpack reference into separate transparent square cells, reconstructing obscured portions and preserving the illustration style.

Final assets: `portrait-transparent.gif` and `library-bag-jump.gif`. Yellow translates straight up without rotation; pink rotates right independently; the protractor rotates left. The roughly one-second packing loop uses rapid 40 ms movement steps, a short outward hold and a deeper landing dip behind the foreground pocket. The portrait keeps its faster blink timing. All surrounding canvases are transparent.

## September 29 update

The built-in image-generation tool edited the supplied backpack and new portrait. `profile/render-new-cards.cjs` assembles the generated layers into `library-bag.gif` and `portrait-fast.gif` (256 × 256). The existing slow beach ball is retained. The bag and ball have transparent canvases; the portrait intentionally retains the requested softly blurred red backdrop. README embeds specify width only: GitHub adds a gray fallback background when both width and height are supplied.

Bag prompt: preserve the exact blue backpack illustration and colors; produce four transparent animation layers in a 2 × 2 sheet: rear bag, books, protractor, foreground pocket/flap. No background or shadow. The assembler keeps the bag stationary while books fan right and the protractor fans left, then return.

Portrait prompt: preserve the supplied portrait, hair, face, outlines and colors; produce a square 2 × 2 sheet of registered open-eye and closed-eye frames against the same softly blurred red background, with the whole head visible. The assembler swaps only eye patches and uses 1.7/2.1-second open-eye intervals and 110 ms blinks.

The joined tech grid uses one transparent SVG, fixed 110 × 108 cells, 48-pixel icons and 14-pixel labels. Centered group rows share adjoining boundaries without image-line spacing.

## Previous artwork

The built-in image-editing tool prepared the supplied illustrations; `profile/render-card-animations.cjs` assembles the GIFs. All outputs are 256 × 256 and displayed at 120 × 120.

- Portrait prompt: preserve the supplied cartoon and its crayon styling; remove the white spot at the left temple and excess skin outside the left black cheek outline; center on transparent background. Produce registered open-eye and closed-eye frames. The GIF uses only the eye patches from the second frame to prevent body jitter.
- Tree prompt: remove the exterior white background while preserving the supplied tree, crayon grain, trunk, and silhouette; center on transparent square canvas. Texture displacement is restricted to green pixels; the trunk and silhouette stay fixed.
- Beach ball: retain the existing app-icon frames and increase every frame delay to 140 ms (6.72 seconds per revolution).

Outputs: `portfolio-blink.gif`, `component-tree.gif`, `codex-lite-slow.gif`.

Tech-stack brand icons come from [Devicon](https://github.com/devicons/devicon), revision `7330accdbc47e2dc0c19789a48533c4a3c50fe58` (MIT), and [Simple Icons](https://github.com/simple-icons/simple-icons) (Ollama, CC0). Generic concepts use original line icons. Names and logos belong to their respective owners. Generated SVG rows embed icons so they have no external image dependencies.
