import {
  includesSource,
  indexOfSource,
} from "../lib/sourceContract.test-utils.ts";
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const source = readFileSync(
  new URL("./PaperPeel.tsx", import.meta.url),
  "utf8",
);

test("incoming stamp applies in one bounded curl without CSS tilt correction", () => {
  assert.ok(
    includesSource(
      source,
      "engine.updateUndersideInk(state.current.arrivalActive?plain:ink)",
    ),
  );
  assert.ok(
    includesSource(source, "stampRegionExposed(s.stampSnapshot,polygon)"),
  );
  assert.ok(includesSource(source, "data-stamp-placement"));
  assert.ok(!includesSource(source, "data-stamp-arrival"));
  assert.ok(!includesSource(source, "drawStampArrival"));
  const css = readFileSync(
    new URL("./PortfolioV2.module.css", import.meta.url),
    "utf8",
  );
  assert.ok(includesSource(css, ".homeStamp{transition:none}"));
});

test("GPU rendering skips full-page fallback canvas clearing and caps desktop fill cost", () => {
  assert.ok(
    indexOfSource(source, "engine.paint(frame") <
      indexOfSource(source, "ctx.clearRect(0,0,w,s.renderHeight)"),
  );
  assert.ok(includesSource(source, "window.innerWidth<=760?1.25:1.5"));
});
