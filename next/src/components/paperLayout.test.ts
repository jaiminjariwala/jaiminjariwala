import { includesSource } from "../lib/sourceContract.test-utils.ts";
import test from "node:test";
import assert from "node:assert/strict";
import { paperViewportWidth } from "./paperLayout.ts";
import { readFileSync } from "node:fs";

test("mobile sheet dimensions remain unchanged", () => {
  for (const width of [320, 390, 640, 760])
    assert.equal(paperViewportWidth(width), width);
});
test("desktop paper and curl end at the seven percent right gutter", () => {
  for (const width of [1024, 1440, 1920, 2560]) {
    assert.ok(
      Math.abs(paperViewportWidth(width) - 12.8 - width * 0.93) < 0.00001,
    );
  }
});
test("all desktop sections share a wider column capped inside the paper", () => {
  const css = readFileSync(
    new URL("./PortfolioV2.module.css", import.meta.url),
    "utf8",
  );
  assert.ok(
    includesSource(
      css,
      "--article-width:calc(5 * var(--col-width) + 4 * var(--gu) + 6rem)",
    ),
  );
  assert.ok(
    includesSource(
      css,
      "--article-width:calc(4 * var(--col-width) + 3 * var(--gu) + 6rem)",
    ),
  );
  assert.ok(
    includesSource(
      css,
      "width:min(var(--article-width),calc(93vw - 3rem - var(--article-left)))",
    ),
  );
});
