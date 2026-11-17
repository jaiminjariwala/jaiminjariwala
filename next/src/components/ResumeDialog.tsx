"use client";

import { useEffect, useRef } from "react";
import styles from "./PortfolioV2.module.css";

export default function ResumeDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!open) return;
    const modal = dialog.current!;
    const previousOverflow = document.body.style.overflow;
    modal.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      modal.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <dialog
      ref={dialog}
      className={styles.resumeDialog}
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
        <div className={styles.resumeDocument}>
          <img
            src="/JAIMIN_RESUME.png"
            alt="Jaimin Jariwala's resume"
          />
        </div>
      )}
    </dialog>
  );
}
