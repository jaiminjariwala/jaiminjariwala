import { includesSource } from "../lib/sourceContract.test-utils.ts";
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { portfolioProjects } from "./portfolioProjects.ts";
import { projectFramePath, videoPosition, videoTime } from "./projectMedia.ts";

test("all three projects use existing local media with real source links", () => {
  assert.deepEqual(
    portfolioProjects.map((p) => p.id),
    ["codex-lite", "component-library", "url-shortener"],
  );
  for (const project of portfolioProjects) {
    assert.ok(project.description.length > 50);
    for (const link of project.links)
      assert.equal(new URL(link.href).protocol, "https:");
    for (const item of project.media) {
      assert.ok(item.label);
      assert.ok(item.src.startsWith("/"));
      assert.ok(
        existsSync(new URL(`../../public${item.src}`, import.meta.url)),
        item.src,
      );
      if (item.poster)
        assert.ok(
          existsSync(new URL(`../../public${item.poster}`, import.meta.url)),
        );
    }
  }
  assert.equal(
    portfolioProjects[0].media.filter((m) => m.type === "video").length,
    2,
  );
  assert.equal(
    portfolioProjects[2].links.length,
    1,
    "local-only shortener must not advertise a deployed service",
  );
  assert.ok(
    !portfolioProjects[2].description.includes(
      "so I can understand what each request actually does",
    ),
  );
});

test("Projects uses the existing roll navigation", () => {
  const source = readFileSync(
    new URL("./PortfolioV2.tsx", import.meta.url),
    "utf8",
  );
  assert.ok(
    includesSource(
      source,
      'aria-label="Open projects" onClick={()=>navigate("projects")}',
    ),
  );
  assert.ok(
    includesSource(source, '{page==="projects"&&<PortfolioV2Projects/>}'),
  );
  assert.ok(!includesSource(source, "Projects (adding soon)"));
});

test("Projects restores the original folder drawing in lavender on both stamp sizes", () => {
  const source = readFileSync(
    new URL("./PortfolioV2.tsx", import.meta.url),
    "utf8",
  );
  const css = readFileSync(
    new URL("./PortfolioV2.module.css", import.meta.url),
    "utf8",
  );
  assert.ok(
    includesSource(
      source,
      'if(kind==="projects")return <svg className={styles.projectsArtwork} viewBox="0 0 200 200"',
    ),
  );
  assert.ok(includesSource(source, 'fill="#c9bdf8" stroke="#9e89d8"'));
  assert.ok(includesSource(source, 'fill="#b8a5ee" stroke="#9e89d8"'));
  assert.ok(includesSource(source, '<g stroke="#125cd6" strokeWidth="5">'));
  assert.ok(
    includesSource(source, "m80 94-19 18 19 17m42-34 19 17-19 18m-14-40-13 45"),
  );
  assert.ok(
    includesSource(
      css,
      ".stamp .projectsArtwork,.homeStamp .projectsArtwork{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}",
    ),
  );
  assert.ok(!includesSource(source, 'src="/images/projects-computer-red.png"'));
});

test("Projects keeps its white scalloped paper without a noisy or colored border", () => {
  const source = readFileSync(
    new URL("./PortfolioV2.tsx", import.meta.url),
    "utf8",
  );
  const css = readFileSync(
    new URL("./PortfolioV2.module.css", import.meta.url),
    "utf8",
  );
  assert.ok(includesSource(source, '<StampRim/><StampArt kind="projects"/>'));
  assert.ok(!includesSource(source, "projectsStampMask"));
  assert.ok(!includesSource(css, "background:#e11931"));
  assert.ok(
    !includesSource(source, "stampArtworkEdge"),
    "do not apply the textured fade to Projects",
  );
});

test("Projects stamps tilt right without changing the other stamp rotations", () => {
  const source = readFileSync(
    new URL("./PortfolioV2.tsx", import.meta.url),
    "utf8",
  );
  const css = readFileSync(
    new URL("./PortfolioV2.module.css", import.meta.url),
    "utf8",
  );
  assert.ok(
    includesSource(
      source,
      'className={`${styles.stamp} ${styles.projectsStamp}`} aria-label="Open projects"',
    ),
  );
  assert.ok(
    includesSource(source, 'page==="projects"?styles.projectsStamp:""'),
  );
  assert.ok(
    includesSource(
      css,
      ".stamp.projectsStamp,.homeStamp.projectsStamp{transform:rotate(4deg)}",
    ),
  );
});

test("project galleries preserve mobile framing and avoid automatic video playback", () => {
  const source = readFileSync(
    new URL("./PortfolioV2Projects.tsx", import.meta.url),
    "utf8",
  );
  const player = readFileSync(
    new URL("./ProjectVideoPlayer.tsx", import.meta.url),
    "utf8",
  );
  const css = readFileSync(
    new URL("./PortfolioV2.module.css", import.meta.url),
    "utf8",
  );
  assert.ok(includesSource(player, 'playsInline preload="metadata"'));
  assert.ok(!includesSource(player, "autoPlay"));
  assert.ok(!includesSource(player, " controls playsInline"));
  assert.ok(includesSource(source, "key={item.src}"));
  assert.ok(includesSource(source, "aria-pressed={i===index}"));
  assert.ok(includesSource(source, "entry.borderBoxSize[0]"));
  assert.ok(
    includesSource(css, ".projectMediaFrame{padding:20px;filter:none}"),
  );
  assert.ok(includesSource(css, "overscroll-behavior-x:contain"));
});

test("project paper uses inward semicircular cutouts at both phone and desktop sizes", () => {
  for (const [width, height] of [
    [316, 213],
    [720, 480],
    [980, 640],
  ]) {
    const path = projectFramePath(width, height);
    assert.ok(path.startsWith("M"));
    assert.ok(path.endsWith(" Z"));
    assert.ok(!/NaN|Infinity/.test(path));
    assert.equal(
      (path.match(/ A/g) || []).length,
      2 * Math.round(width / 16) + 2 * Math.round(height / 16),
    );
    assert.ok(
      !path.includes(" 0 0 1 "),
      "arcs must cut into the paper, not protrude outside it",
    );
  }
});

test("video seek clamps invalid and out-of-range media times", () => {
  assert.equal(videoPosition(3, 5), 3);
  assert.equal(videoPosition(8, 5), 5);
  assert.equal(videoPosition(-1, 5), 0);
  assert.equal(videoPosition(2, 0), 0);
  assert.equal(videoPosition(NaN, 5), 0);
  assert.equal(videoPosition(1, Infinity), 0);
  assert.equal(videoTime(65.99), "1:05");
  assert.equal(videoTime(NaN), "0:00");
});

test("floating controls support playback, keyboard seek, fullscreen, and cleanup", () => {
  const source = readFileSync(
    new URL("./ProjectVideoPlayer.tsx", import.meta.url),
    "utf8",
  );
  const css = readFileSync(
    new URL("./PortfolioV2.module.css", import.meta.url),
    "utf8",
  );
  assert.ok(includesSource(source, 'type="range"'));
  assert.ok(includesSource(source, "aria-valuetext="));
  assert.ok(includesSource(source, "video.current.currentTime=next"));
  assert.ok(includesSource(source, "onEnded={()=>setPlaying(false)}"));
  assert.ok(includesSource(source, "requestFullscreen()"));
  assert.ok(includesSource(source, "webkitEnterFullscreen()"));
  assert.ok(includesSource(source, "element.pause();"));
  assert.ok(includesSource(css, "background:#fff;border-radius:999px"));
  assert.ok(includesSource(css, ".projectVideoPlayer:fullscreen"));
});
