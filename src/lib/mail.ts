import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

/**
 * SMTP mailer (Gmail or any SMTP server), configured from env:
 * SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, MAIL_FROM, MAIL_TO.
 */

let transporter: Transporter | null = null;

export function isMailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function getTransporter(): Transporter {
  if (!isMailConfigured()) throw new Error("SMTP is not configured (SMTP_HOST, SMTP_USER, SMTP_PASS).");
  transporter ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    // true for port 465, false for 587 (STARTTLS)
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    pool: true,
    maxConnections: 2,
  });
  return transporter;
}

export const MAIL_FROM = () => process.env.MAIL_FROM || process.env.SMTP_USER || "";
/** Where new-order notifications go (comma-separated allowed). */
export const MAIL_TO = () => process.env.MAIL_TO || process.env.SMTP_USER || "";

export interface MailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

/** Sends one email and returns the SMTP message id. */
export async function sendMail(msg: MailMessage): Promise<string> {
  const info = await getTransporter().sendMail({ from: MAIL_FROM(), ...msg });
  return info.messageId;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
