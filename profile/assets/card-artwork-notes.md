# Profile card artwork

The built-in image-editing tool prepared the supplied illustrations; `profile/render-card-animations.cjs` assembles the GIFs. All outputs are 256 × 256 and displayed at 120 × 120.

- Portrait prompt: preserve the supplied cartoon and its crayon styling; remove the white spot at the left temple and excess skin outside the left black cheek outline; center on transparent background. Produce registered open-eye and closed-eye frames. The GIF uses only the eye patches from the second frame to prevent body jitter.
- Tree prompt: remove the exterior white background while preserving the supplied tree, crayon grain, trunk, and silhouette; center on transparent square canvas. Texture displacement is restricted to green pixels; the trunk and silhouette stay fixed.
- Beach ball: retain the existing app-icon frames and increase every frame delay to 140 ms (6.72 seconds per revolution).

Outputs: `portfolio-blink.gif`, `component-tree.gif`, `codex-lite-slow.gif`.

Tech-stack brand icons come from [Devicon](https://github.com/devicons/devicon), revision `7330accdbc47e2dc0c19789a48533c4a3c50fe58` (MIT), and [Simple Icons](https://github.com/simple-icons/simple-icons) (Ollama, CC0). Generic concepts use original line icons. Names and logos belong to their respective owners. Generated SVG rows embed icons so they have no external image dependencies.
