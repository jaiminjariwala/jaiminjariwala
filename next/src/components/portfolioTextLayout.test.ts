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

test("the Engineering continuation starts a new desktop line without forcing a mobile break", () => {
  assert.ok(
    includesSource(
      source,
      '"Bachelor of Technology in Computer Science and Engineering"',
    ),
  );
  assert.ok(includesSource(source, 'const continuation=" and Engineering"'));
  assert.ok(includesSource(source, "degree.slice(0,-continuation.length)"));
  assert.ok(
    includesSource(
      source,
      "<span className={styles.degreeContinuation}>{continuation}</span>",
    ),
  );
  assert.ok(includesSource(source, "<EducationDegree degree={degree}/>"));
  assert.ok(
    includesSource(css, ".experience .degreeContinuation{display:inline}"),
  );
  assert.ok(
    includesSource(
      css,
      "@media(min-width:761px){.experience .degreeContinuation{display:block}}",
    ),
  );
});

test("the Alexa team is a separate bulleted line after the role", () => {
  assert.ok(
    includesSource(
      source,
      "<span>{role}</span>{team&&<span className={styles.experienceTeam}>· {team}</span>}",
    ),
  );
  assert.ok(includesSource(css, ".experience .experienceTeam{display:block}"));
  assert.ok(
    !includesSource(css, ".experience .experienceTeam{display:inline}"),
  );
  assert.ok(!includesSource(css, ".experienceTeam:before"));
});
