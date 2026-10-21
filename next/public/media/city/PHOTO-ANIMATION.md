# Washington DC photo animation

Source supplied by the user: `pexels-optical-chemist-340351297-33955410.jpg`.
Prepared assets use the built-in image-generation tool, not the fallback CLI.

- `dc-street-plate.png`: edited photographic background with the small front-facing sedan removed from the second lane. Parked vehicles, architecture and camera composition are retained.
- `dc-sedan.png`: transparent photographic sedan sprite matching the source perspective.
- `src/components/cityAnimation.js`: deterministic 48-second loop, perspective traffic in the second lane from the left and small canopy displacement. This is simulated motion, not live or recorded footage. The result is rendered into colored dots at 56 columns.

## Prompt set

Background: Use case: precise-object-edit. Asset type: clean background plate for animating this exact Washington DC street photograph. Input image is the edit target, preserve its camera position, composition, aspect ratio, architecture, parked vehicles, sidewalks, people, trees, sky, and lighting exactly. Change ONLY: remove the one small front-facing black sedan in the SECOND lane from the left (near image x=49%, y=55%), reconstructing matching unobstructed road and lane markings behind it. Preserve the large parked silver minivan at left and large black SUV at right. No other changes. This empty lane will receive animated cars later. Photorealistic seamless inpaint, no text additions.

Car: Use case: background-extraction. Asset type: transparent photographic car sprite for perspective street animation. Input image is reference/edit target. Isolate only the small front-facing black sedan in the second lane from left, at normalized x=49%, y=55%. Render that same entire sedan viewed from its front, matching slightly elevated camera and soft overcast daylight, with both headlights, windshield, grille, tires and bumper. Crop tightly around car with transparent background; no road, no buildings, no people, no other vehicle, no solid background, no cast shadow outside the car. Preserve realistic photo appearance. High quality clean alpha cutout.
