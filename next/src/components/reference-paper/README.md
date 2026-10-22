# Reference renderer provenance

These modules adapt the publicly served **jm.sv** paper renderer. They are third-party implementation code, not code authored from scratch for this portfolio. A reuse-permission review on October 22, 2026 did not identify an explicit license for the current renderer. The user subsequently instructed that the modified renderer be retained for release. That instruction is not a license from the original author; reuse rights remain unverified.

Retrieved October 21, 2026:

- `pageEngine.js`: https://jm.sv/_next/static/chunks/13s94dkb74gp3.js — module 926268 (`createPageEngine`), with its bundler imports converted to isolated ES-module imports.
- `gpuKernel.js`: https://jm.sv/_next/static/chunks/155pnlope_-h~.js — module 651342, the renderer's GPU abstraction.
- `paperMath.js`: https://jm.sv/_next/static/chunks/0hrsnrc9el_2w.js — module 798840, roll math and defaults; the theme dependency is replaced with the reference's five-sheet brownstone palette.

The thin export registry preserves the served modules' export declarations without using `eval` or sharing the app's bundler runtime. All rendering runs locally. These modules do not fetch reference-site code at runtime.

`PaperPeel.jsx` owns this portfolio's interaction, clipping, bounded open position, reverse drag, resize handling, and fallback renderer. The original reference engine supplies the GPU mesh, surface lighting, contact shadow, and cast-shadow passes. A Canvas 2D fallback remains for browsers without WebGPU.
