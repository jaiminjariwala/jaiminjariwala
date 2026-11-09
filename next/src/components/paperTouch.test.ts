import { includesSource } from "../lib/sourceContract.test-utils.ts";
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { preventPaperNativeTouch } from "./paperTouch.ts";
type MockTouch = {
  cancelable: boolean;
  touches: ArrayLike<unknown>;
  prevented?: boolean;
  preventDefault(): void;
};

test("a single-finger paper gesture claims native scrolling immediately", () => {
  const event: MockTouch = {
    cancelable: true,
    touches: [{}],
    preventDefault() {
      this.prevented = true;
    },
  };
  preventPaperNativeTouch(event);
  assert.equal(event.prevented, true);
});
test("noncancelable and multi-touch events are not prevented", () => {
  for (const [cancelable, touches] of [
    [false, [{}]],
    [true, [{}, {}]],
    [true, []],
  ] as const) {
    const event: MockTouch = {
      cancelable,
      touches,
      preventDefault() {
        this.prevented = true;
      },
    };
    preventPaperNativeTouch(event);
    assert.equal(event.prevented, undefined);
  }
});
test("touch prevention is scoped to paper handles and preserves tap activation", () => {
  const source = readFileSync(
    new URL("./PaperPeel.tsx", import.meta.url),
    "utf8",
  );
  assert.ok(
    includesSource(
      source,
      "target.addEventListener('touchstart',start,{passive:false})",
    ),
  );
  assert.ok(
    includesSource(source, "target.removeEventListener('touchstart',start)"),
  );
  assert.ok(
    includesSource(
      source,
      "if(state.current.dragging)preventPaperNativeTouch(event)",
    ),
  );
  assert.ok(
    includesSource(
      source,
      "if(event.pointerType==='touch'&&event.currentTarget===handle.current){s.moved=true;callbacks.current.onOpenChange(!open);}",
    ),
  );
  assert.ok(!includesSource(source, "document.addEventListener('touchmove'"));
  assert.ok(!includesSource(source, "window.addEventListener('touchmove'"));
});
