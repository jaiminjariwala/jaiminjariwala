import test from "node:test";
import assert from "node:assert/strict";
import {
  STAMP_PLACEMENT_MS,
  stampPlacementPose,
  stampRegionExposed,
} from "./stampPlacement";

test("placement unfurls monotonically and meets the exact final stamp pose", () => {
  for (const width of [130, 160, 228]) {
    let flat = 0;
    for (let t = 0; t <= STAMP_PLACEMENT_MS; t += 5) {
      const p = stampPlacementPose(t, width);
      assert.ok(p.flat >= flat && p.flat <= width);
      assert.ok(p.offsetX <= 0 && p.offsetY >= 0 && p.radius >= 0);
      flat = p.flat;
    }
    assert.deepEqual(stampPlacementPose(STAMP_PLACEMENT_MS, width), {
      progress: 1,
      flat: width,
      offsetX: 0,
      offsetY: 0,
      radius: 0,
      done: true,
    });
    for (const hz of [30, 60, 120])
      assert.equal(
        stampPlacementPose(
          Math.ceil(STAMP_PLACEMENT_MS / (1000 / hz)) * (1000 / hz),
          width,
        ).done,
        true,
      );
  }
});

test("the entrance rises from the bottom left and curves into its final position", () => {
  for (const [width, height] of [
    [130, 130],
    [160, 160],
    [180, 140],
  ]) {
    const start = stampPlacementPose(0, width, height);
    const middle = stampPlacementPose(STAMP_PLACEMENT_MS / 2, width, height);
    const finish = stampPlacementPose(STAMP_PLACEMENT_MS, width, height);

    assert.ok(start.offsetX < 0 && start.offsetY > 0);
    assert.ok(middle.offsetX > start.offsetX && middle.offsetX < 0);
    assert.ok(middle.offsetY > 0 && middle.offsetY < start.offsetY);
    assert.ok(
      middle.offsetY / start.offsetY < middle.offsetX / start.offsetX,
      "the upward travel leads the rightward approach rather than a straight diagonal",
    );
    assert.equal(finish.offsetX, 0);
    assert.equal(finish.offsetY, 0);
  }
});

test("placement waits for the entire rotated stamp region to be uncovered", () => {
  const stamp = { x: 30, y: 40, width: 160, height: 160, rotation: -0.07 };
  assert.equal(stampRegionExposed(stamp, []), false);
  assert.equal(
    stampRegionExposed(stamp, [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 300 },
      { x: 0, y: 300 },
    ]),
    false,
  );
  const full = [
    { x: 0, y: 0 },
    { x: 250, y: 0 },
    { x: 250, y: 300 },
    { x: 0, y: 300 },
  ];
  assert.equal(stampRegionExposed(stamp, full), true);
  assert.equal(stampRegionExposed(stamp, full.toReversed()), true);
});
