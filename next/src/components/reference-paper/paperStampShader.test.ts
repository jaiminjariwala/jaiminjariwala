import {
  includesSource,
  indexOfSource,
} from "../../lib/sourceContract.test-utils.ts";
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { withSurfaceStamp } from "./paperStampShader.ts";

test("stamp hover uses shared surface deformation instead of a lifted flat image", () => {
  const source = readFileSync(
    new URL("../StickerButton.tsx", import.meta.url),
    "utf8",
  );
  assert.ok(includesSource(source, '<feDisplacementMap in="SourceGraphic"'));
  assert.ok(
    includesSource(source, "stepBuckle(s.position,s.velocity,s.target"),
  );
});

test("refresh waits for the real curl instead of flashing the fallback renderer", () => {
  const source = readFileSync(
    new URL("../PaperPeel.tsx", import.meta.url),
    "utf8",
  );
  assert.match(
    source,
    /const rendererStatus\s*=\s*useRef(?:<[^>]+>)?\([\s]*["']pending["']/,
  );
  const pending = indexOfSource(
    source,
    "if(rendererStatus.current==='pending')return;",
  );
  assert.ok(
    pending > 0 && pending < indexOfSource(source, "engine.paint(frame"),
  );
  assert.ok(
    indexOfSource(source, "gpuCanvas.current.style.opacity='1'") >
      indexOfSource(source, "engine.whenIdle().then("),
  );
  assert.ok(includesSource(source, "rendererStatus.current='fallback'"));
  assert.ok(
    includesSource(source, "style={{visibility:'hidden',opacity:0,zIndex:7}}"),
  );
});

test("stationary and rolled stamp ink share one mesh without blanking the article", () => {
  const source = readFileSync(
    new URL("./pageEngine.js", import.meta.url),
    "utf8",
  );
  const patched = withSurfaceStamp(source);
  assert.ok(patched.includes("if(materialDepth<0.0){"));
  assert.ok(!patched.includes("alpha*=stationaryInk.a"));
  assert.ok(patched.includes("f32(ij.x)-24.0"));
  assert.ok(!patched.includes("o.original/p.size"));
});
test("unrolling reveals the DOM photo before presenting the receding roll", () => {
  const source = readFileSync(
    new URL("../PaperPeel.tsx", import.meta.url),
    "utf8",
  );
  const reveal = indexOfSource(
    source,
    "if(s.velocity>0)callbacks.current.onClipChange(clip,progress);",
  );
  assert.ok(reveal >= 0);
  assert.ok(reveal < indexOfSource(source, "engine.paint(frame"));
  assert.ok(includesSource(source, "foldDistance-2"));
});
test("unexpected renderer changes fail explicitly instead of silently duplicating the stamp", () => {
  assert.throws(
    () => withSurfaceStamp("unrecognized shader"),
    /source changed/,
  );
});

test("mobile tip droop changes world depth rather than the camera tilt", () => {
  const source = readFileSync(
    new URL("./pageEngine.js", import.meta.url),
    "utf8",
  );
  const peel = readFileSync(
    new URL("../PaperPeel.tsx", import.meta.url),
    "utf8",
  );
  assert.ok(includesSource(source, "z-=min(p.tipAngle*p.gu"));
  assert.ok(includesSource(source, "i.tipDropGu??0"));
  assert.ok(includesSource(peel, "materialSettings.tipDropGu=mobile?.85:0"));
  assert.ok(!includesSource(peel, "mobile?12:"));
});

test("rolled sheets meet at zero height without a synthetic crease shadow", () => {
  const source = readFileSync(
    new URL("./pageEngine.js", import.meta.url),
    "utf8",
  );
  assert.ok(
    includesSource(
      source,
      "let contactLift=smoothstep(0.0,p.gu*2.0,max(0.0,distance))",
    ),
  );
  assert.ok(includesSource(source, "offset*cos(theta))*contactLift"));
  assert.ok(includesSource(source, "x=-distance;z=0.0;theta=0.0;"));
  assert.ok(
    includesSource(source, "seam*(0.022/0.03)),0.0,p.rollAngle>0.0001)"),
  );
  assert.ok(!includesSource(source, "alpha*=smoothstep(p.pixelSize*2.0"));
});

test("stamp capture resets absolute offsets and restores visibility only on the clone", () => {
  const source = readFileSync(
    new URL("../PaperPeel.tsx", import.meta.url),
    "utf8",
  );
  assert.ok(includesSource(source, "position:'relative',top:'0px',left:'0px'"));
  assert.ok(includesSource(source, "transition:'none',opacity:'1'"));
  assert.ok(includesSource(source, "if(stamp)stamp.style.opacity=''"));
});

test("mobile scroll keeps document clipping and the GPU viewport stable", () => {
  const peel = readFileSync(
    new URL("../PaperPeel.tsx", import.meta.url),
    "utf8",
  );
  const engine = readFileSync(
    new URL("./pageEngine.js", import.meta.url),
    "utf8",
  );
  assert.ok(
    includesSource(
      peel,
      "stationaryPaperPolygon(w,paperHeight,right,s.originY??inset",
    ),
  );
  assert.ok(!includesSource(peel, "p.y+window.scrollY-inset"));
  assert.ok(
    includesSource(
      peel,
      "s.width===paperViewportWidth(window.innerWidth)&&s.height&&window.matchMedia('(pointer: coarse)').matches",
    ),
  );
  assert.ok(
    includesSource(peel, "viewportHeight:()=>state.current.renderHeight"),
  );
  assert.ok(includesSource(engine, "r.viewportHeight?.()??innerHeight"));
  assert.ok(includesSource(engine, "r.viewportTop?.()??scrollY"));
  assert.ok(includesSource(peel, "viewportTop:()=>0"));
  assert.ok(!includesSource(peel, "paperScrollY()"));
  assert.ok(!includesSource(peel, 'window.addEventListener("scroll",render'));
  const css = readFileSync(
    new URL("../PortfolioV2.module.css", import.meta.url),
    "utf8",
  );
  assert.ok(
    includesSource(css, ".peelCanvas{position:absolute;inset:0 auto auto 0}"),
  );
  assert.ok(includesSource(peel, "position:'absolute',inset:'0 auto auto 0'"));
  assert.ok(
    includesSource(
      peel,
      "if(!state.current.raf&&(state.current.dragging||state.current.open))update()",
    ),
  );
});

test("photos reveal once and avoid filter churn on touch devices", () => {
  const entrance = readFileSync(
    new URL("../usePhotoEntrance.ts", import.meta.url),
    "utf8",
  );
  const css = readFileSync(
    new URL("../PortfolioV2.module.css", import.meta.url),
    "utf8",
  );
  assert.ok(includesSource(entrance, "if(!entry.isIntersecting)continue"));
  assert.ok(includesSource(entrance, "observer.unobserve(card)"));
  assert.ok(includesSource(entrance, "if(!touch)card.style.setProperty"));
  assert.ok(
    includesSource(
      css,
      "@media(hover:none) and (pointer:coarse){.photoPrint{filter:none;transition:none}",
    ),
  );
});

test("photo sizing reserves the full scalloped frame on mobile", () => {
  const css = readFileSync(
    new URL("../PortfolioV2.module.css", import.meta.url),
    "utf8",
  );
  assert.ok(
    includesSource(
      css,
      ".photoPrint img{position:absolute;left:22px;top:22px;",
    ),
  );
  assert.ok(
    includesSource(
      css,
      ".photoPrint{flex-basis:180px;width:180px;padding:19px 19px 24px}",
    ),
  );
  assert.ok(includesSource(css, "height:calc(100% - 43px)"));
});

test("photo scallops keep a stamp-like thin outline on desktop and mobile", () => {
  const css = readFileSync(
    new URL("../PortfolioV2.module.css", import.meta.url),
    "utf8",
  );
  assert.ok(
    includesSource(
      css,
      ".photoRim path{stroke:#dededb;stroke-width:.7;vector-effect:non-scaling-stroke}",
    ),
  );
  assert.ok(
    includesSource(
      css,
      ".photoRim{position:absolute;inset:0;width:100%;height:100%;z-index:-1;overflow:visible}",
    ),
  );
  assert.ok(
    !includesSource(css, ".photoRim path{stroke:#ececec;stroke-width:.5}"),
  );
});

test("page changes reuse the GPU renderer instead of resetting the animation", () => {
  const source = readFileSync(
    new URL("../PaperPeel.tsx", import.meta.url),
    "utf8",
  );
  const render = source.slice(
    indexOfSource(source, "const render = useCallback"),
    indexOfSource(
      source,
      "useEffect(()=>{",
      indexOfSource(source, "const render = useCallback"),
    ),
  );
  assert.ok(includesSource(render, "variantRef.current"));
  assert.ok(includesSource(render, "}, []);"));
  assert.ok(includesSource(source, "colors:PAPER_COLORS"));
  assert.ok(includesSource(source, "palettes:[PAPER_COLORS]"));
  assert.ok(!includesSource(source, "colorsFor(variant)"));
  assert.ok(includesSource(source, "const engine=await engineReady.current"));
  const upload = indexOfSource(
    source,
    "engine.updateUndersideInk(state.current.arrivalActive?plain:ink);",
  );
  const ready = indexOfSource(
    source,
    "callbacks.current.onContentReady?.(variant);",
    upload,
  );
  assert.ok(upload >= 0 && ready > upload);
  assert.ok(source.slice(upload, ready).includes("await engine.whenIdle();"));
});
