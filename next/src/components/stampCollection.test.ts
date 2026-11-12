import {
  compactWhitespace,
  includesSource,
  indexOfSource,
} from "../lib/sourceContract.test-utils.ts";
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(
  new URL("./PortfolioV2.tsx", import.meta.url),
  "utf8",
);
const css = readFileSync(
  new URL("./PortfolioV2.module.css", import.meta.url),
  "utf8",
);
const collection = source.slice(
  indexOfSource(source, 'aria-label="Stamp collection"'),
  indexOfSource(source, "<div className={styles.paperShadow}>"),
);

test("the mobile collection uses one centered column with larger, spaced stamps", () => {
  assert.match(
    compactWhitespace(css),
    /@media\(max-width:760px\)\{\.stampGrid\{grid-template-columns:minmax\(0,1fr\);padding:01.75rem;gap:2.75rem;margin:5.625remauto5rem;?\}\.stampGrid\.stamp\{width:min\(62vw,16.25rem\);height:min\(62vw,16.25rem\);?\}/,
  );
  assert.ok(
    includesSource(css, "grid-template-columns:repeat(3,1fr)"),
    "desktop retains its three-column layout",
  );
  assert.ok(
    !/\.stampGrid\{[^}]*grid-template-columns:repeat\(2,1fr\)/.test(
      css.slice(css.lastIndexOf("grid-template-columns:minmax(0,1fr)")),
    ),
    "later rules must not restore a two-column collection",
  );
});

test("collection captions are removed while every stamp keeps its accessible name", () => {
  assert.equal((collection.match(/data-stamp-item/g) || []).length, 5);
  assert.ok(!collection.includes("<figcaption>"));
  assert.ok(!collection.includes("comingSoon"));
  for (const label of [
    "Open travel",
    "Open introduction",
    "Open experience",
    "Open education",
    "Open projects",
  ]) {
    assert.ok(collection.includes(`aria-label="${label}"`), label);
  }
  assert.ok(!collection.includes("Skills"));
});
