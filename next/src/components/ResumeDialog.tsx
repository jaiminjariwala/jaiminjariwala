"use client";

import { useEffect, useRef } from "react";
import styles from "./PortfolioV2.module.css";

type ResumeGesture = Event & { scale: number; clientX: number; clientY: number };

export default function ResumeDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const documentView = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const modal = dialog.current!;
    const viewport = documentView.current!;
    const image = viewport.querySelector("img")!;
    let zoom = 1;
    let gestureStartZoom = 1;

    const zoomAt = (next: number, clientX: number, clientY: number) => {
      const scale = Math.min(3, Math.max(0.6, next));
      if (scale === zoom) return;
      const before = viewport.getBoundingClientRect();
      const anchorX = Number.isFinite(clientX) ? clientX : before.left + before.width / 2;
      const anchorY = Number.isFinite(clientY) ? clientY : before.top + before.height / 2;
      const x = viewport.scrollLeft + anchorX - before.left;
      const y = viewport.scrollTop + anchorY - before.top;
      const imageWidth = image.getBoundingClientRect().width;

      zoom = scale;
      modal.style.setProperty("--resume-zoom", String(zoom));

      const after = viewport.getBoundingClientRect();
      const ratio = image.getBoundingClientRect().width / imageWidth;
      viewport.scrollTo(x * ratio - (anchorX - after.left), y * ratio - (anchorY - after.top));
    };

    const wheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewport.clientHeight : 1;
      zoomAt(zoom * Math.exp(-event.deltaY * unit / 250), event.clientX, event.clientY);
    };
    const gestureStart = (event: Event) => {
      event.preventDefault();
      gestureStartZoom = zoom;
    };
    const gestureChange = (event: Event) => {
      event.preventDefault();
      const { scale, clientX, clientY } = event as ResumeGesture;
      if (Number.isFinite(scale)) zoomAt(gestureStartZoom * scale, clientX, clientY);
    };
    const gestureEnd = (event: Event) => event.preventDefault();

    viewport.addEventListener("wheel", wheel, { passive: false });
    viewport.addEventListener("gesturestart", gestureStart, { passive: false });
    viewport.addEventListener("gesturechange", gestureChange, { passive: false });
    viewport.addEventListener("gestureend", gestureEnd, { passive: false });
    const previousOverflow = document.body.style.overflow;
    modal.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      viewport.removeEventListener("wheel", wheel);
      viewport.removeEventListener("gesturestart", gestureStart);
      viewport.removeEventListener("gesturechange", gestureChange);
      viewport.removeEventListener("gestureend", gestureEnd);
      modal.style.removeProperty("--resume-zoom");
      modal.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <dialog
      ref={dialog}
      className={styles.resumeDialog}
      data-resume-dialog
      aria-label="Resume"
      onClose={onClose}
      onClick={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < bounds.left || event.clientX > bounds.right ||
          event.clientY < bounds.top || event.clientY > bounds.bottom
        ) onClose();
      }}
    >
      {open && (
        <div ref={documentView} className={styles.resumeDocument}>
          <img
            src="/JAIMIN_RESUME.png"
            alt="Jaimin Jariwala's resume"
          />
        </div>
      )}
    </dialog>
  );
}
