"use client";

import { useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import { useContactDraft } from "@/components/ContactDraftContext";

function getFileExt(name = "") {
  const parts = name.split(".");
  if (parts.length < 2) return "FILE";
  return parts.pop().toUpperCase();
}

export default function ContactPage() {
  const { message, setMessage, attachments, setAttachments } = useContactDraft();
  const [from, setFrom] = useState("");
  const [fromError, setFromError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = useRef(null);
  const attachmentsStripRef = useRef(null);
  const attachmentsDragRef = useRef({
    dragging: false,
    startX: 0,
    startScrollLeft: 0,
    pointerId: null,
  });
  const [isDraggingAttachments, setIsDraggingAttachments] = useState(false);

  const onFileChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const next = files.map((file, index) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${index}`,
      file,
      isImage: file.type.startsWith("image/"),
      previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
    }));

    setAttachments((prev) => [...prev, ...next]);
    event.target.value = "";
  };

  const removeAttachment = (idToRemove) => {
    setAttachments((prev) => {
      const toRemove = prev.find((att) => att.id === idToRemove);
      if (toRemove?.previewUrl) URL.revokeObjectURL(toRemove.previewUrl);
      const filtered = prev.filter((att) => att.id !== idToRemove);
      if (filtered.length === 0) setIsDialogOpen(false);
      return filtered;
    });
  };

  const clearAllAttachments = () => {
    setAttachments((prev) => {
      prev.forEach((att) => {
        if (att.previewUrl) URL.revokeObjectURL(att.previewUrl);
      });
      return [];
    });
  };

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const onFromChange = (e) => {
    const val = e.target.value;
    setFrom(val);
    if (fromError && EMAIL_RE.test(val.trim())) setFromError("");
  };

  const onFromBlur = () => {
    if (from.trim() && !EMAIL_RE.test(from.trim())) {
      setFromError("Please enter a valid email address.");
    }
  };

  const onSend = async () => {
    if (from.trim() && !EMAIL_RE.test(from.trim())) {
      setFromError("Please enter a valid email address.");
      return;
    }
    if (!message.trim() && attachments.length === 0) {
      setError("Please write a message or attach a file.");
      return;
    }

    setError("");
    setSending(true);
    setSent(false);

    try {
      const formData = new FormData();
      formData.set("message", message.trim());
      attachments.forEach((att) => {
        formData.append("attachments", att.file);
      });

      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(payload.error || "Unable to send right now. Please try again.");
        return;
      }

      setMessage("");
      clearAllAttachments();
      setIsDialogOpen(false);
      setSent(true);
      setTimeout(() => setSent(false), 2200);
    } catch {
      setError("Unable to send right now. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const onCancel = () => {
    setFrom("");
    setFromError("");
    setMessage("");
    clearAllAttachments();
    setError("");
    setSent(false);
    setIsDialogOpen(false);
  };

  const stopAttachmentsDrag = (event) => {
    const strip = attachmentsStripRef.current;
    if (!strip || !attachmentsDragRef.current.dragging) return;

    if (attachmentsDragRef.current.pointerId !== null) {
      try {
        strip.releasePointerCapture?.(attachmentsDragRef.current.pointerId);
      } catch {}
    }

    attachmentsDragRef.current.dragging = false;
    attachmentsDragRef.current.pointerId = null;
    setIsDraggingAttachments(false);
  };

  const onAttachmentsPointerDown = (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    const target = event.target;
    if (target instanceof HTMLElement && target.closest("button")) return;

    const strip = attachmentsStripRef.current;
    if (!strip) return;

    attachmentsDragRef.current.dragging = true;
    attachmentsDragRef.current.startX = event.clientX;
    attachmentsDragRef.current.startScrollLeft = strip.scrollLeft;
    attachmentsDragRef.current.pointerId = event.pointerId;
    strip.setPointerCapture?.(event.pointerId);
    setIsDraggingAttachments(true);
  };

  const onAttachmentsPointerMove = (event) => {
    const strip = attachmentsStripRef.current;
    if (!strip || !attachmentsDragRef.current.dragging) return;

    const deltaX = event.clientX - attachmentsDragRef.current.startX;
    strip.scrollLeft = attachmentsDragRef.current.startScrollLeft - deltaX;
  };

  return (
    <section className="min-h-screen bg-white text-black">
      <Navbar />

      <div
        className="mx-auto w-full max-w-[689px] pb-[80px]"
        style={{
          paddingLeft: "clamp(0px, calc((768px - 100vw) * 9999), 20px)",
          paddingRight: "clamp(0px, calc((768px - 100vw) * 9999), 20px)",
        }}
      >
        <div className="mt-[34px] md:mt-[42px]">
          <div
            className="overflow-visible rounded-[16px] border border-[#cfd4dd] bg-[#f9f9f8] shadow-[0_4px_10px_rgba(0,0,0,0.08)]"
            data-sr-skip="true"
          >
            <div className="grid grid-cols-[102px_1fr_102px] items-center bg-transparent px-[10px] py-[10px]">
              <button
                type="button"
                onClick={onCancel}
                disabled={sending}
                className="h-[40px] rounded-[9px] border border-[#c9cfda] bg-[#f9f9f8] px-[14px] text-[18px] font-black leading-none tracking-[-0.01em] text-[#4c5564] shadow-[inset_0_1px_0_rgba(255,255,255,0.92),inset_0_-1px_0_rgba(164,174,188,0.32)] transition-transform active:scale-[0.98] disabled:opacity-60"
              >
                Cancel
              </button>
              <div
                className="text-center text-[22px] font-black tracking-[-0.02em] text-[#2b3139] [-webkit-text-stroke:0.6px_#2b3139]"
                style={{ textShadow: "0 0 0 #2b3139" }}
              >
                Mail
              </div>
              <button
                type="button"
                onClick={onSend}
                disabled={sending}
                className="h-[40px] rounded-[9px] border border-[#6f97d9] bg-gradient-to-b from-[#8FC0FF] via-[#5C9CF4] to-[#2F72E2] px-[14px] text-[18px] font-black leading-none tracking-[-0.01em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.62),inset_0_-1px_0_rgba(25,67,154,0.45),0_1px_1px_rgba(29,72,157,0.28)] transition-transform active:scale-[0.98] disabled:opacity-60"
              >
                {sending ? "..." : sent ? "Sent" : "Send"}
              </button>
            </div>

            <div className="h-[2px] bg-gradient-to-r from-[#f1c0c0] via-[#eb9a9a] to-[#f1c0c0]" />

            {/* ── From row — same height as one notebook line ── */}
            <div className="flex h-[40px] items-center border-b border-[rgba(188,195,207,0.44)] px-[12px]">
              <span className="shrink-0 pr-[6px] text-[22px] font-semibold tracking-[-0.01em] text-[#1f2329]">
                From:
              </span>
              <input
                type="email"
                value={from}
                onChange={onFromChange}
                onBlur={onFromBlur}
                placeholder={fromError && !from.trim() ? fromError : "your@email.com"}
                className={`flex-1 appearance-none border-0 bg-transparent text-[22px] leading-[40px] tracking-[-0.01em] outline-none ring-0 focus:outline-none focus:ring-0 ${
                  fromError && !from.trim()
                    ? "placeholder:text-[#d53030]"
                    : "placeholder:text-[#a1a8b3]"
                }`}
                style={{
                  border: "none",
                  boxShadow: "none",
                  color: fromError && from.trim() ? "#d53030" : "#1f2329",
                }}
              />
            </div>

            <div className="relative overflow-visible">
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Write your message..."
                rows={6}
                className={`h-[240px] w-full resize-none appearance-none border-0 bg-transparent px-[12px] py-0 text-[22px] leading-[1.82] tracking-[-0.01em] text-[#1f2329] shadow-none outline-none ring-0 placeholder:text-[#a1a8b3] focus:border-0 focus:shadow-none focus:outline-none focus:ring-0 ${
                  attachments.length > 0 ? "pr-[170px]" : "pr-[12px]"
                } [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden`}
                style={{
                  border: "none",
                  boxShadow: "none",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, transparent 0, transparent calc(1.82em - 0.05em), rgba(188,195,207,0.44) calc(1.82em - 0.05em), rgba(188,195,207,0.44) 1.82em)",
                  backgroundAttachment: "local",
                  backgroundSize: "100% 1.82em",
                  backgroundRepeat: "repeat-y",
                }}
              />

              {attachments.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(true)}
                  className="absolute right-[18px] top-[-8px] z-40 h-[132px] w-[132px] appearance-none overflow-visible border-0 bg-transparent p-0 shadow-none outline-none"
                  aria-label="Open attachments"
                >
                  <div className="relative h-full w-full overflow-visible">
                    {attachments.slice(-3).reverse().map((att, index) => {
                      const rotate = index === 0 ? 4 : index === 1 ? -6 : 10;
                      const shift = index * 4;

                      return (
                        <div
                          key={att.id}
                          className="absolute inset-0 overflow-hidden rounded-[4px] bg-transparent shadow-[0_2px_6px_rgba(0,0,0,0.12)]"
                          style={{
                            transform: `rotate(${rotate}deg) translate(${shift}px, ${-shift}px)`,
                            zIndex: 10 - index,
                          }}
                        >
                          {att.isImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={att.previewUrl} alt={att.file.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-[#f5f6f8] to-[#e0e4ea]">
                              <span className="rounded-[6px] bg-white px-[8px] py-[3px] text-[11px] font-semibold tracking-[0.04em] text-[#5d6470]">
                                {getFileExt(att.file.name)}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    <div className="pointer-events-none absolute -right-[42px] -top-[32px] z-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/paper-clip.png"
                        alt=""
                        aria-hidden="true"
                        className="h-[94px] w-auto object-contain drop-shadow-[0_1px_1px_rgba(0,0,0,0.22)]"
                      />
                    </div>
                  </div>
                </button>
              )}
            </div>

            <div
              className="relative flex items-center justify-start bg-transparent px-[12px] py-[9px]"
              style={{
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.72)",
              }}
            >
              <div
                className="pointer-events-none absolute bottom-0 left-0 right-0 h-[132px]"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.11) 28%, rgba(0,0,0,0.05) 56%, rgba(0,0,0,0) 86%)",
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="relative z-[1] inline-flex items-center gap-[6px] text-[26px] font-medium tracking-[-0.01em] text-[#606773]"
              >
                <span className="text-[24px]">Add file</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                className="hidden"
                onChange={onFileChange}
              />
            </div>
          </div>

          {isDialogOpen && attachments.length > 0 ? (
            <div className="mt-[10px] w-full overflow-hidden rounded-[14px] border border-[#cfd4dd] bg-[#f9f9f8] shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
              <div className="grid grid-cols-[90px_1fr_90px] items-center px-[10px] py-[10px]">
                <div className="flex h-[40px] items-center justify-start">
                  <span className="text-[18px] font-black leading-none tracking-[-0.01em] text-[#4c5564]">
                    {attachments.length}
                  </span>
                </div>

                <div
                  className="text-center text-[22px] font-black tracking-[-0.02em] text-[#2b3139] [-webkit-text-stroke:0.6px_#2b3139]"
                  style={{ textShadow: "0 0 0 #2b3139" }}
                >
                  Attachments
                </div>

                <button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="justify-self-end h-[40px] rounded-[9px] border border-[#6f97d9] bg-gradient-to-b from-[#8FC0FF] via-[#5C9CF4] to-[#2F72E2] px-[14px] text-[18px] font-black leading-none tracking-[-0.01em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.62),inset_0_-1px_0_rgba(25,67,154,0.45),0_1px_1px_rgba(29,72,157,0.28)] transition-transform active:scale-[0.98]"
                >
                  Done
                </button>
              </div>

              <div className="h-[2px] bg-gradient-to-r from-[#f1c0c0] via-[#eb9a9a] to-[#f1c0c0]" />

              <div className="px-[12px] py-[12px]">
                <div
                  ref={attachmentsStripRef}
                  onPointerDown={onAttachmentsPointerDown}
                  onPointerMove={onAttachmentsPointerMove}
                  onPointerUp={stopAttachmentsDrag}
                  onPointerCancel={stopAttachmentsDrag}
                  onPointerLeave={stopAttachmentsDrag}
                  className={`overflow-x-auto overflow-y-hidden select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
                    isDraggingAttachments ? "cursor-grabbing" : "cursor-grab"
                  }`}
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none", touchAction: "pan-y" }}
                >
                  <div className="flex w-max gap-[10px] pb-[4px]">
                    {attachments.map((att) => (
                      <div
                        key={att.id}
                        className="w-[154px] shrink-0 rounded-[8px] border border-[#d2d8e1] bg-white p-[8px] shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                      >
                        <div className="relative h-[94px] w-full overflow-hidden rounded-[5px] bg-[#eceff4]">
                          {att.isImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={att.previewUrl} alt={att.file.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-[#f5f6f8] to-[#e0e4ea]">
                              <span className="rounded-[6px] bg-white px-[10px] py-[4px] text-[12px] font-semibold tracking-[0.04em] text-[#5d6470]">
                                {getFileExt(att.file.name)}
                              </span>
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => removeAttachment(att.id)}
                            className="absolute right-[6px] top-[6px] flex h-6 w-6 items-center justify-center rounded-full border border-[#d7dbe3] bg-white/95 text-[15px] leading-none text-[#d94f4f]"
                            aria-label={`Remove ${att.file.name}`}
                          >
                            ×
                          </button>
                        </div>

                        <p className="mt-[6px] truncate text-[12px] font-medium tracking-[-0.01em] text-[#2d333c]">
                          {att.file.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {error ? (
            <p className="mt-[10px] text-[14px] leading-none tracking-[-0.01em] text-[#d53030]">
              {error}
            </p>
          ) : null}
        </div>
      </div>

    </section>
  );
}
