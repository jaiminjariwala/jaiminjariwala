import { includesSource } from "../lib/sourceContract.test-utils.ts";
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

test("the degree wraps naturally without a forced Engineering continuation", () => {
  assert.ok(includesSource(source, '"Bachelor of Technology in Computer Science and Engineering"'));
  assert.ok(includesSource(source, "<span>{degree}</span>"));
  assert.ok(!includesSource(source, "degreeContinuation"));
  assert.ok(!includesSource(css, "degreeContinuation"));
});

test("the Alexa team is a separate bulleted line after the role", () => {
  assert.ok(
    includesSource(
      readFileSync(new URL("./PortfolioV2Experience.tsx", import.meta.url), "utf8"),
      "<span>{entry.role}</span>{entry.team&&<span className={styles.experienceTeam}>· {entry.team}</span>}",
    ),
  );
  assert.ok(includesSource(css, ".experience .experienceTeam{display:block}"));
  assert.ok(
    !includesSource(css, ".experience .experienceTeam{display:inline}"),
  );
  assert.ok(!includesSource(css, ".experienceTeam:before"));
});
