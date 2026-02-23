import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

const CONTACT_TO_EMAIL = "jaiminjariwala5@icloud.com";
const MAX_FILES = 10;
const MAX_TOTAL_BYTES = 15 * 1024 * 1024; // 15 MB
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const runtime = "nodejs";

function getRequiredEnv(name) {
  const value = process.env[name];
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function createTransporter() {
  const host = getRequiredEnv("SMTP_HOST");
  const portRaw = getRequiredEnv("SMTP_PORT");
  const user = getRequiredEnv("SMTP_USER");
  const pass = getRequiredEnv("SMTP_PASS");
  const secure = getRequiredEnv("SMTP_SECURE") === "true";

  const missing = [];
  if (!host) missing.push("SMTP_HOST");
  if (!portRaw) missing.push("SMTP_PORT");
  if (!user) missing.push("SMTP_USER");
  if (!pass) missing.push("SMTP_PASS");

  if (missing.length > 0) {
    throw new Error(`Missing SMTP configuration: ${missing.join(", ")}`);
  }

  const port = Number(portRaw);
  if (!Number.isFinite(port)) {
    throw new Error("Invalid SMTP_PORT: must be a number");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const senderEmail = String(formData.get("from") || "").trim();
    const senderSubject = String(formData.get("subject") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const files = formData
      .getAll("attachments")
      .filter((value) => value && typeof value.arrayBuffer === "function");

    if (!senderEmail) {
      return NextResponse.json({ error: "From email is required." }, { status: 400 });
    }
    if (!EMAIL_REGEX.test(senderEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email in From." },
        { status: 400 }
      );
    }

    if (!message && files.length === 0) {
      return NextResponse.json(
        { error: "Please write a message or attach a file." },
        { status: 400 }
      );
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Maximum ${MAX_FILES} attachments allowed.` },
        { status: 400 }
      );
    }

    let totalBytes = 0;
    const attachments = [];

    for (const file of files) {
      const size = Number(file.size || 0);
      totalBytes += size;
      if (totalBytes > MAX_TOTAL_BYTES) {
        return NextResponse.json(
          { error: "Total attachment size must be 15MB or less." },
          { status: 400 }
        );
      }

      attachments.push({
        filename: file.name || "attachment",
        content: Buffer.from(await file.arrayBuffer()),
        contentType: file.type || undefined,
      });
    }

    const transporter = createTransporter();
    const fromAddress = getRequiredEnv("SMTP_FROM") || getRequiredEnv("SMTP_USER");
    if (!fromAddress) {
      throw new Error("Missing SMTP_FROM/SMTP_USER");
    }

    const textLines = [
      `From: ${senderEmail}`,
      `Subject: ${senderSubject || "(not provided)"}`,
      "",
      message || "(No message body provided)",
    ];
    if (attachments.length > 0) {
      textLines.push("", `Attached files (${attachments.length}):`);
      attachments.forEach((file) => textLines.push(`- ${file.filename}`));
    }

    const mailSubject = senderSubject || `Portfolio Contact Message from ${senderEmail}`;

    await transporter.sendMail({
      from: fromAddress,
      to: CONTACT_TO_EMAIL,
      replyTo: senderEmail,
      subject: mailSubject,
      text: textLines.join("\n"),
      attachments,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact send failed:", error);
    const message = String(error?.message || "");

    if (message.startsWith("Missing SMTP configuration")) {
      return NextResponse.json({ error: message }, { status: 500 });
    }
    if (message.startsWith("Invalid SMTP_PORT")) {
      return NextResponse.json({ error: message }, { status: 500 });
    }
    if (message.includes("Invalid login") || error?.code === "EAUTH") {
      return NextResponse.json(
        { error: "SMTP auth failed. Check SMTP_USER and SMTP_PASS (app-specific password)." },
        { status: 500 }
      );
    }
    if (error?.code === "ESOCKET" || message.includes("getaddrinfo")) {
      return NextResponse.json(
        { error: "SMTP connection failed. Check SMTP_HOST, SMTP_PORT and SMTP_SECURE." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Unable to send right now. Please try again in a minute." },
      { status: 500 }
    );
  }
}
