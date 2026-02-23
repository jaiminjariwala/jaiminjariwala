"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import { useContactDraft } from "@/components/ContactDraftContext";

function getFileExt(name = "") {
  const parts = name.split(".");
  if (parts.length < 2) return "FILE";
  return parts.pop().toUpperCase();
}

function isPdfAttachment(file) {
  const ext = getFileExt(file?.name || "").toLowerCase();
  return file?.type === "application/pdf" || ext === "pdf";
}

function isWordAttachment(file) {
  const ext = getFileExt(file?.name || "").toLowerCase();
  return (
    ext === "doc" ||
    ext === "docx" ||
    file?.type === "application/msword" ||
    file?.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  );
}

function ensurePromiseWithResolversPolyfill() {
  if (typeof Promise.withResolvers === "function") return;
  Promise.withResolvers = function withResolvers() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

function AttachmentPreview({ attachment }) {
  const [pdfThumb, setPdfThumb] = useState("");
  const [pdfError, setPdfError] = useState(false);
  const [docHtml, setDocHtml] = useState("");
  const [docError, setDocError] = useState(false);
  const isPdf = isPdfAttachment(attachment.file);
  const isWord = isWordAttachment(attachment.file);

  useEffect(() => {
    let active = true;

    const renderPdfPreview = async () => {
      if (!isPdf) {
        setPdfThumb("");
        setPdfError(false);
        return;
      }

      try {
        ensurePromiseWithResolversPolyfill();
        let pdfjs;
        try {
          pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
        } catch {
          pdfjs = await import("pdfjs-dist/build/pdf.mjs");
        }

        if (pdfjs?.GlobalWorkerOptions) {
          pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        }

        const buffer = await attachment.file.arrayBuffer();
        const loadingTask = pdfjs.getDocument({ data: new Uint8Array(buffer) });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const baseViewport = page.getViewport({ scale: 1 });
        const targetWidth = 320;
        const scale = targetWidth / baseViewport.width;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const context = canvas.getContext("2d", { alpha: false, willReadFrequently: false });
        if (!context) throw new Error("Canvas context unavailable");

        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: context, viewport, intent: "display" }).promise;

        if (!active) return;
        setPdfThumb(canvas.toDataURL("image/jpeg", 0.9));
        setPdfError(false);
      } catch {
        if (!active) return;
        setPdfError(true);
      }
    };

    renderPdfPreview();
    return () => {
      active = false;
    };
  }, [attachment.file, attachment.id, isPdf]);

  useEffect(() => {
    let active = true;

    const renderWordPreview = async () => {
      if (!isWord) return;

      try {
        const mammoth = await import("mammoth/mammoth.browser.js");
        const buffer = await attachment.file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer: buffer });
        if (!active) return;
        const html = String(result.value || "").trim();
        setDocHtml(html);
        setDocError(false);
      } catch {
        if (!active) return;
        setDocError(true);
      }
    };

    renderWordPreview();
    return () => {
      active = false;
    };
  }, [attachment.file, attachment.id, isWord]);

  if (attachment.isImage && attachment.previewUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={attachment.previewUrl} alt={attachment.file.name} className="h-full w-full object-cover" />;
  }

  if (isPdf && pdfThumb) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={pdfThumb} alt={attachment.file.name} className="h-full w-full object-contain bg-white" />
    );
  }

  if (isPdf && !pdfError) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-white text-[11px] font-medium text-[#6a7280]">
        Loading...
      </div>
    );
  }

  if (isPdf && attachment.previewUrl) {
    return (
      <div className="relative h-full w-full overflow-hidden bg-white">
        <iframe
          title={attachment.file.name}
          src={`${attachment.previewUrl}#toolbar=0&navpanes=0&scrollbar=0&page=1&view=FitH`}
          className="h-full w-full border-0 pointer-events-none"
        />
      </div>
    );
  }

  if (isWord) {
    if (docHtml && !docError) {
      return (
        <div className="h-full w-full overflow-hidden bg-white">
          <div
            className="doc-thumb-render origin-top-left w-[260%] scale-[0.385] text-[#1f2329]"
            dangerouslySetInnerHTML={{ __html: docHtml }}
          />
        </div>
      );
    }

    if (!docError) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-white text-[11px] font-medium text-[#6a7280]">
          Loading...
        </div>
      );
    }
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-[#f5f6f8] to-[#e0e4ea]">
      <span className="rounded-[6px] bg-white px-[10px] py-[4px] text-[12px] font-semibold tracking-[0.04em] text-[#5d6470]">
        {getFileExt(attachment.file.name)}
      </span>
    </div>
  );
}

export default function ContactPage() {
  const { message, setMessage, attachments, setAttachments } = useContactDraft();
  const [from, setFrom] = useState("");
  const [fromError, setFromError] = useState("");
  const [messageError, setMessageError] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const textareaRef = useRef(null);
  const sentinelRef = useRef(null);
  const fileInputRef = useRef(null);
  const attachmentsStripRef = useRef(null);
  const attachmentsDragRef = useRef({
    dragging: false,
    startX: 0,
    startScrollLeft: 0,
    pointerId: null,
  });
  const [isDraggingAttachments, setIsDraggingAttachments] = useState(false);
  const fromIsInvalid = Boolean(fromError && from.trim());
  const fromHasText = from.length > 0;

  const onFileChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const next = files.map((file, index) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${index}`,
      file,
      isImage: file.type.startsWith("image/"),
      previewUrl: URL.createObjectURL(file),
    }));

    setAttachments((prev) => [...prev, ...next]);
    if (messageError) setMessageError(false);
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
    if (!from.trim()) {
      setFromError("Please enter a valid email address.");
      setError("From email is required.");
      return;
    }

    if (from.trim() && !EMAIL_RE.test(from.trim())) {
      setFromError("Please enter a valid email address.");
      return;
    }
    if (!message.trim() && attachments.length === 0) {
      setMessageError(true);
      setError("");
      return;
    }

    setMessageError(false);
    setError("");
    setSending(true);
    setSent(false);

    try {
      const formData = new FormData();
      formData.set("from", from.trim());
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
    setMessageError(false);
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

  // useLayoutEffect: fires synchronously after DOM mutations, before paint
  // Keep the bottom typing line visible without manual page scroll.
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    // Reset then grow
    el.style.height = "0px";
    el.style.height = el.scrollHeight + "px";

    // Scroll using the card sentinel (after Add file row) for accurate bottom visibility.
    const target = sentinelRef.current || el;
    const rect = target.getBoundingClientRect();
    const safeBottom = window.innerHeight - 16;
    const overflow = rect.bottom - safeBottom;
    if (overflow > 0) {
      window.scrollTo({ top: window.scrollY + overflow, behavior: "auto" });
    }
  }, [message]);

  const onAttachmentsPointerMove = (event) => {
    const strip = attachmentsStripRef.current;
    if (!strip || !attachmentsDragRef.current.dragging) return;

    const deltaX = event.clientX - attachmentsDragRef.current.startX;
    strip.scrollLeft = attachmentsDragRef.current.startScrollLeft - deltaX;
  };

  return (
    <section className="min-h-screen bg-white text-black">
      {/* Desktop overrides — bypasses Tailwind JIT for guaranteed rendering */}
      <style>{`
        .cp-from-input::placeholder,
        .cp-textarea::placeholder {
          -webkit-text-stroke: 0 transparent !important;
        }

        .doc-thumb-render {
          transform-origin: top left;
          line-height: 1.25;
        }

        .doc-thumb-render p,
        .doc-thumb-render li {
          margin: 0 0 8px;
          font-size: 14px;
        }

        .doc-thumb-render h1,
        .doc-thumb-render h2,
        .doc-thumb-render h3,
        .doc-thumb-render h4,
        .doc-thumb-render h5,
        .doc-thumb-render h6 {
          margin: 0 0 10px;
          font-size: 18px;
          line-height: 1.15;
        }

        @media (min-width: 768px) {
          .cp-from-row        { height: 44px !important; }
          .cp-from-label      { font-size: 20px !important; }
          .cp-from-input      { font-size: 20px !important; line-height: 44px !important; }
          .cp-textarea        { font-size: 20px !important; min-height: 234px !important; height: auto !important; }
          .cp-att-btn         { width: 150px !important; height: 150px !important; top: -8px !important; right: 18px !important; }
          .cp-paperclip-wrap  { right: -46px !important; top: -36px !important; }
          .cp-paperclip-img   { height: 110px !important; }
          .cp-textarea-pr-att { padding-right: 178px !important; }
        }
      `}</style>

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
            className="overflow-visible rounded-[8px] border border-[#cfd4dd] bg-[#f9f9f8] shadow-[0_4px_10px_rgba(0,0,0,0.08)] md:rounded-[16px]"
            data-sr-skip="true"
          >
            {/* ── Toolbar ── */}
            <div className="grid grid-cols-[80px_1fr_80px] items-center bg-transparent px-[8px] py-[8px] md:grid-cols-[120px_1fr_120px] md:px-[12px] md:py-[12px]">
              <button
                type="button"
                onClick={onCancel}
                disabled={sending}
                className="h-auto rounded-[7px] border border-[#c9cfda] bg-[#f9f9f8] px-[10px] py-[8px] text-[18px] font-black leading-none tracking-[-0.01em] text-[#000000] shadow-[inset_0_1px_0_rgba(255,255,255,0.92),inset_0_-1px_0_rgba(164,174,188,0.32)] transition-transform active:scale-[0.98] disabled:opacity-60 md:h-auto md:rounded-[8px] md:px-[18px] md:py-[10px] md:text-[22px] md:font-black md:shadow-[inset_0_1px_0_rgba(255,255,255,0.92),inset_0_-1px_0_rgba(164,174,188,0.32)]"
              >
                Cancel
              </button>

              <div
                className="text-center font-black tracking-[-0.02em]"
                style={{
                  fontSize: "clamp(18px, 6vw, 22px)",
                  fontWeight: 900,
                  color: "#000000",
                }}
              >
                Mail
              </div>

              <button
                type="button"
                onClick={onSend}
                disabled={sending}
                className="h-auto rounded-[7px] border border-[#6f97d9] bg-gradient-to-b from-[#8FC0FF] via-[#5C9CF4] to-[#2F72E2] px-[10px] py-[8px] text-[18px] text-[#ffffff] leading-none shadow-[inset_0_1px_0_rgba(255,255,255,0.62),inset_0_-1px_0_rgba(25,67,154,0.45),0_1px_1px_rgba(29,72,157,0.28)] transition-transform active:scale-[0.98] disabled:opacity-60 md:h-auto md:rounded-[8px] md:px-[18px] md:py-[10px] md:text-[22px] md:font-black [-webkit-text-stroke:0.6px_#ffffff]"
              >
                {sending ? "..." : sent ? "Sent" : "Send"}
              </button>
            </div>

            <div className="h-[2px] bg-gradient-to-r from-[#f1c0c0] via-[#eb9a9a] to-[#f1c0c0]" />

            {/* ── From row ── */}
            <div className="cp-from-row flex h-[36px] items-center border-b border-[rgba(188,195,207,0.44)] px-[10px] md:px-[12px]">
              <span
                className={`cp-from-label shrink-0 pr-[6px] font-semibold tracking-[-0.01em] text-[#1f2329] text-[18px] [-webkit-text-stroke:0.3px_#000000] md:inline ${
                  from.length > 0 ? "hidden" : "inline"
                }`}
              >
                From:
              </span>
              <input
                type="email"
                value={from}
                onChange={onFromChange}
                onBlur={onFromBlur}
                placeholder={
                  fromError && !from.trim()
                    ? fromError
                    : from.length === 0
                    ? "your@email.com"
                    : "your@email.com"
                }
                className={`cp-from-input flex-1 appearance-none border-0 bg-transparent text-[18px] leading-[36px] tracking-[-0.01em] outline-none ring-0 focus:outline-none focus:ring-0 ${
                  fromError && !from.trim()
                    ? "placeholder:text-[#d53030]"
                    : "placeholder:text-[#a1a8b3]"
                }`}
                style={{
                  border: "none",
                  boxShadow: "none",
                  color: fromIsInvalid ? "#d53030" : "#1f2329",
                  WebkitTextStroke: fromHasText
                    ? fromIsInvalid
                      ? "0.3px #d53030"
                      : "0.3px #000000"
                    : "0px transparent",
                }}
              />
            </div>

            {/* ── Message area ── */}
            <div className="relative flex items-start overflow-visible">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(event) => {
                  setMessage(event.target.value);
                  if (messageError && event.target.value.trim().length > 0) {
                    setMessageError(false);
                  }
                }}
                placeholder={messageError ? "Don't forget to add your message or files..." : "Write your message..."}
                rows={6}
                className={`cp-textarea ${attachments.length > 0 ? "cp-textarea-pr-att" : ""} min-h-[117px] w-full resize-none appearance-none border-0 bg-transparent pl-[12px] max-md:pl-[10px] pt-0 pb-[1em] text-[18px] leading-[1.82] tracking-[-0.01em] text-[#1f2329] shadow-none outline-none ring-0 ${messageError ? "placeholder:text-[#d53030]" : "placeholder:text-[#a1a8b3]"} focus:border-0 focus:shadow-none focus:outline-none focus:ring-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
                  attachments.length > 0 ? "pr-[116px]" : "pr-[12px] max-md:pr-[10px]"
                }`}
                style={{
                  border: "none",
                  boxShadow: "none",
                  WebkitTextStroke: message.length > 0 ? "0.3px #000000" : "0px transparent",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, transparent 0, transparent calc(1.82em - 0.05em), rgba(188,195,207,0.44) calc(1.82em - 0.05em), rgba(188,195,207,0.44) 1.82em)",
                  backgroundAttachment: "local",
                  backgroundSize: "100% 1.82em",
                  backgroundPosition: "0 0",
                  backgroundRepeat: "repeat-y",
                }}
              />

              {attachments.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(true)}
                  className="cp-att-btn absolute top-[-4px] right-[10px] overflow-visible appearance-none border-0 bg-transparent p-0 shadow-none outline-none h-[96px] w-[96px]"
                  aria-label="Open attachments"
                >
                  <div className="relative h-full w-full overflow-visible">
                    {attachments.slice(-3).reverse().map((att, index) => {
                      const rotate = index === 0 ? 4 : index === 1 ? -6 : 10;
                      const shift = index * 4;

                      return (
                        <div
                          key={att.id}
                          className="absolute inset-0 overflow-hidden rounded-[4px] bg-white shadow-[0_2px_6px_rgba(0,0,0,0.12)]"
                          style={{
                            transform: `rotate(${rotate}deg) translate(${shift}px, ${-shift}px)`,
                            zIndex: 10 - index,
                          }}
                        >
                          <AttachmentPreview attachment={att} />
                        </div>
                      );
                    })}

                    <div className="cp-paperclip-wrap pointer-events-none absolute -right-[30px] -top-[22px] z-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/paper-clip.png"
                        alt=""
                        aria-hidden="true"
                        className="cp-paperclip-img h-[68px] w-auto object-contain drop-shadow-[0_1px_1px_rgba(0,0,0,0.22)]"
                      />
                    </div>
                  </div>
                </button>
              )}
            </div>

            {/* ── Add file bar ── */}
            <div
              className="relative flex items-center justify-start bg-transparent px-[10px] py-[7px] md:px-[12px] md:py-[9px]"
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
                className="relative z-[1] inline-flex items-center gap-[6px] font-medium tracking-[-0.01em] text-[#616161] text-[18px] md:text-[26px] [-webkit-text-stroke:0.3px_#616161]"
              >
                <span className="text-[18px] md:text-[24px] px-[8px] py-[6px]">Add file</span>
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
          {/* Sentinel — placed after the full card including Add file bar */}
          <div ref={sentinelRef} />

          {/* ── Attachments dialog ── */}
          {isDialogOpen && attachments.length > 0 ? (
            <div className="mt-[10px] w-full overflow-hidden rounded-[14px] border border-[#cfd4dd] bg-[#f9f9f8] shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
              <div className="grid grid-cols-[70px_1fr_70px] items-center px-[8px] py-[8px] md:grid-cols-[90px_1fr_90px] md:px-[10px] md:py-[10px]">
                <div className="flex h-[40px] items-center justify-start">
                  <span className="text-[14px] font-black leading-none tracking-[-0.01em] text-[#4c5564] md:text-[18px]">
                    {attachments.length}
                  </span>
                </div>

                <div
                  className="text-center text-[16px] font-black tracking-[-0.02em] text-[#2b3139] [-webkit-text-stroke:0.6px_#2b3139] md:text-[22px]"
                  style={{ textShadow: "0 0 0 #2b3139" }}
                >
                  Attachments
                </div>

                <button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="justify-self-end h-auto rounded-[7px] border border-[#6f97d9] bg-gradient-to-b from-[#8FC0FF] via-[#5C9CF4] to-[#2F72E2] px-[10px] py-[8px] text-[18px] text-[#ffffff] leading-none shadow-[inset_0_1px_0_rgba(255,255,255,0.62),inset_0_-1px_0_rgba(25,67,154,0.45),0_1px_1px_rgba(29,72,157,0.28)] transition-transform active:scale-[0.98] md:h-auto md:rounded-[8px] md:px-[18px] md:py-[10px] md:text-[22px] md:font-black [-webkit-text-stroke:0.6px_#ffffff]"
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
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    touchAction: "pan-x",
                    WebkitOverflowScrolling: "touch",
                    overscrollBehaviorX: "contain",
                  }}
                >
                  <div className="flex w-max gap-[10px]">
                    {attachments.map((att) => (
                      <div
                        key={att.id}
                        className="w-[120px] shrink-0 rounded-[8px] border border-[#d2d8e1] bg-white p-[8px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] md:w-[154px]"
                      >
                        <div className="relative h-[74px] w-full overflow-hidden rounded-[5px] bg-white md:h-[94px]">
                          <AttachmentPreview attachment={att} />

                          <button
                            type="button"
                            onClick={() => removeAttachment(att.id)}
                            className="absolute right-[6px] top-[6px] flex h-6 w-6 items-center justify-center rounded-full border border-[#d7dbe3] bg-white/95 text-[15px] leading-none text-[#d94f4f]"
                            aria-label={`Remove ${att.file.name}`}
                          >
                            ×
                          </button>
                        </div>

                        <p className="mt-[6px] mb-0 truncate text-[12px] font-medium tracking-[-0.01em] text-[#2d333c]">
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
