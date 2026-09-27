# Crayon Earth animation

Generated with the built-in image-generation tool using the user's Earth
illustration as a style reference. The resulting complete world-map texture is
wrapped onto a sphere by `profile/render-earth.cjs`, with 80 frames per rotation.

Prompt: Create a flat 2:1 equirectangular world map texture for wrapping onto a
rotating 3D Earth sphere. Match the reference's rough oil-pastel/crayon aesthetic:
cornflower-blue oceans, forest-green land, thick rough black continent outlines,
and speckled grain. Show all continents in their usual world-map arrangement,
with no labels, margins, globe circle, shadows, or baked-in lighting. Fill the
rectangle edge to edge; the blue ocean at the left and right edges should tile
seamlessly. Longitude runs -180 to +180 and latitude +90 to -90.
