"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const HIGHLIGHT_COLOR = "#73c951";

// Resolves a selection boundary to the exact equivalent position inside a text
// node, WITHOUT changing where it points. When the browser reports a boundary
// on an element (e.g. you start the drag slightly above a letter), we translate
// it to the matching text position instead of expanding to the whole node.
const normalizeBoundary = (container, offset) => {
  if (container.nodeType === 3) return { node: container, offset };
  if (container.nodeType !== 1) return { node: container, offset };

  const child = container.childNodes[offset];
  if (child) {
    let node = child;
    while (node && node.nodeType !== 3) node = node.firstChild;
    if (node) return { node, offset: 0 };
  }

  // offset points past the last child: land at the end of the previous child.
  let node = container.childNodes[offset - 1];
  while (node && node.nodeType !== 3) node = node.lastChild;
  if (node) return { node, offset: node.textContent.length };

  return { node: container, offset };
};

// Returns a cloned range whose endpoints are normalized to exact text
// positions (so an element-reported boundary doesn't expand to a whole node).
const normalizeRange = (range) => {
  const r = range.cloneRange();
  const start = normalizeBoundary(range.startContainer, range.startOffset);
  const end = normalizeBoundary(range.endContainer, range.endOffset);
  try {
    r.setStart(start.node, start.offset);
    r.setEnd(end.node, end.offset);
  } catch {
    return range.cloneRange();
  }
  return r;
};

// Builds highlight rectangles (in page coordinates) by measuring each selected
// NON-whitespace character and unioning them per visual line. Because
// whitespace characters never contribute, the highlight can't extend past the
// first/last glyph on a line, so leading/trailing spaces are never painted.
// Interior spaces stay covered because they sit between two measured glyphs.
const buildLineRects = (range) => {
  const rootBase =
    range.commonAncestorContainer.nodeType === 3
      ? range.commonAncestorContainer.parentNode
      : range.commonAncestorContainer;
  if (!rootBase) return [];

  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const lines = new Map();
  const charRange = document.createRange();

  const walker = document.createTreeWalker(rootBase, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    if (!range.intersectsNode(node)) continue;
    const text = node.textContent;
    const from = node === range.startContainer ? range.startOffset : 0;
    const to = node === range.endContainer ? range.endOffset : text.length;

    for (let k = from; k < to; k += 1) {
      if (/\s/.test(text[k])) continue;
      charRange.setStart(node, k);
      charRange.setEnd(node, k + 1);
      const rect = charRange.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) continue;

      const key = Math.round(rect.top);
      const cur = lines.get(key);
      if (!cur) {
        lines.set(key, {
          top: rect.top,
          bottom: rect.bottom,
          left: rect.left,
          right: rect.right,
        });
      } else {
        cur.top = Math.min(cur.top, rect.top);
        cur.bottom = Math.max(cur.bottom, rect.bottom);
        cur.left = Math.min(cur.left, rect.left);
        cur.right = Math.max(cur.right, rect.right);
      }
    }
  }

  return Array.from(lines.values()).map((l) => ({
    left: l.left + scrollX,
    top: l.top + scrollY,
    width: l.right - l.left,
    height: l.bottom - l.top,
  }));
};

// Renders a React-driven selection highlight that hugs the actual selected
// text on every wrapped line (native ::selection paints edge-to-edge on
// interior lines of a multi-line selection, which is what we're replacing).
const TextSelectionHighlight = () => {
  const [mounted, setMounted] = useState(false);
  const [rects, setRects] = useState([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return undefined;

    let rafId = null;

    const isExcluded = (node) => {
      if (!node) return false;
      const el = node.nodeType === 1 ? node : node.parentElement;
      return !!el?.closest('[data-native-selection="true"]');
    };

    const computeAndSet = () => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
        setRects((prev) => (prev.length ? [] : prev));
        return;
      }

      const rawRange = sel.getRangeAt(0);
      if (isExcluded(rawRange.startContainer) || isExcluded(rawRange.endContainer)) {
        setRects((prev) => (prev.length ? [] : prev));
        return;
      }

      // Normalize boundaries, then build per-line rects from the non-whitespace
      // glyphs. Rects are in page coordinates so the absolutely-positioned
      // overlay scrolls with the content without per-frame repositioning.
      const range = normalizeRange(rawRange);
      if (!range || range.collapsed) {
        setRects((prev) => (prev.length ? [] : prev));
        return;
      }

      const next = buildLineRects(range);
      setRects(next);
    };

    const scheduleUpdate = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        computeAndSet();
      });
    };

    // No scroll listener is needed: because rects are in page coordinates and
    // the overlay is position:absolute, plain scrolling moves the highlights
    // with the content automatically. We only recompute when the selection
    // itself changes or the layout reflows.
    document.addEventListener("selectionchange", scheduleUpdate);
    window.addEventListener("resize", scheduleUpdate);

    const onMouseMove = (e) => {
      if (e.buttons === 1) scheduleUpdate();
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      document.removeEventListener("selectionchange", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        pointerEvents: "none",
        zIndex: 2147483000,
        mixBlendMode: "multiply",
      }}
    >
      {rects.map((r, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: r.left,
            top: r.top,
            width: r.width,
            height: r.height,
            background: HIGHLIGHT_COLOR,
          }}
        />
      ))}
    </div>,
    document.body
  );
};

export default TextSelectionHighlight;
