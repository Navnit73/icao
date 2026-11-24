import { NextResponse, type NextRequest } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { getPlanPricing } from "@/lib/config/pricing";
import { isSupportedCurrency, resolveCurrencyFromHeaders } from "@/lib/currency";
import { isMailConfigured, MAIL_TO, sendMail } from "@/lib/mail";
import { adminEmail, customerEmail } from "@/lib/order-emails";
import { insertOrderOnce, isDbConfigured, updateOrderMail, type OrderRecord } from "@/lib/orders";
import { verifyPayPalOrder } from "@/lib/paypal-verify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/orders — called by the preview page right after PayPal captures a payment
 * in the browser. Records the order in MongoDB and emails the customer (photo link) and
 * the shop (MAIL_TO). Idempotent per PayPal order id.
 */

const OrderSchema = z.object({
  orderID: z.string().trim().min(5).max(64).regex(/^[A-Za-z0-9-]+$/),
  email: z.string().trim().toLowerCase().email().max(254),
  plan: z.enum(["standard", "expert_edit"]),
  amount: z.number().int().positive().max(1_000_000),
  currency: z.string().trim().toUpperCase().length(3),
  resultId: z.string().trim().min(1).max(200),
  countryCode: z.string().trim().min(2).max(3),
  countryName: z.string().trim().min(1).max(80),
  documentType: z.string().trim().min(1).max(40),
  dimensions: z.string().trim().max(20),
  imageUrl: z.string().url().max(1000),
  payerEmail: z.string().trim().max(254).optional(),
  payerName: z.string().trim().max(120).optional(),
  payerID: z.string().trim().max(40).optional(),
});

/** Photo links we will put in emails: Cloudinary and the photo API's own host. */
function isAllowedImageUrl(raw: string): boolean {
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:") return false;
    const allowed = new Set(["res.cloudinary.com"]);
    const apiUrl = process.env.PIXPASSPORT_API_URL || process.env.PIX_PASSPORT_API_URL;
    if (apiUrl) allowed.add(new URL(apiUrl).host);
    return allowed.has(url.host) || url.host.endsWith(".pixpassport.com");
  } catch {
    return false;
  }
}

// Simple per-IP limit: enough for real customers, stops the endpoint being used to spam.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 8;
const hits = new Map<string, number[]>();
function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const ipHash = crypto
    .createHash("sha256")
    .update(`${process.env.IP_HASH_SALT || "id-photo-maker"}:${ip}`)
    .digest("hex")
    .slice(0, 20);
  if (rateLimited(ipHash)) {
    return NextResponse.json({ ok: false, error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }
  const parsed = OrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message || "Invalid order data.", field: parsed.error.issues[0]?.path?.[0] },
      { status: 422 }
    );
  }
  const d = parsed.data;
  if (!isAllowedImageUrl(d.imageUrl)) {
    return NextResponse.json({ ok: false, error: "Invalid photo link." }, { status: 422 });
  }

  // Expected price for this visitor, from our own price table (never trust the browser's number)
  const { country: visitorCountry } = resolveCurrencyFromHeaders(req.headers);
  const expected = isSupportedCurrency(d.currency)
    ? getPlanPricing(d.plan, d.currency, visitorCountry).amountInSubunits
    : -1;
  const priceMatches = expected === d.amount;

  const verification = await verifyPayPalOrder(d.orderID, {
    value: (d.amount / 100).toFixed(2),
    currency: d.currency,
  });

  const base: Omit<OrderRecord, "createdAt" | "updatedAt" | "mail"> = {
    orderId: d.orderID,
    status: "paid",
    verification: verification.status,
    ...(verification.note ? { verificationNote: verification.note } : {}),
    plan: d.plan,
    amount: d.amount,
    currency: d.currency,
    expectedAmount: expected,
    priceMatches,
    customerEmail: d.email,
    payerEmail: d.payerEmail || undefined,
    payerName: d.payerName || undefined,
    payerId: d.payerID || undefined,
    resultId: d.resultId,
    documentCountryCode: d.countryCode.toUpperCase(),
    documentCountryName: d.countryName,
    documentType: d.documentType,
    dimensions: d.dimensions,
    imageUrl: d.imageUrl,
    visitorCountry,
    ipHash,
    userAgent: req.headers.get("user-agent")?.slice(0, 300) || undefined,
  };
  const now = new Date();
  const record: OrderRecord = { ...base, mail: { customer: "skipped", admin: "skipped" }, createdAt: now, updatedAt: now };

  // 1. Save (idempotent). A DB outage must not stop the customer getting their email.
  let firstTime = true;
  let dbSaved = false;
  if (isDbConfigured()) {
    try {
      const res = await insertOrderOnce(base);
      firstTime = res.inserted;
      dbSaved = true;
      if (!res.inserted && res.existing) {
        return NextResponse.json({
          ok: true,
          duplicate: true,
          emailed: res.existing.mail?.customer === "sent",
        });
      }
    } catch (err) {
      console.error("[orders] DB save failed:", err instanceof Error ? err.message : err);
    }
  } else {
    console.warn("[orders] MONGODB_URI not set: order not stored", d.orderID);
  }

  // 2. Emails (customer + shop)
  const mail: OrderRecord["mail"] = { customer: "skipped", admin: "skipped" };
  if (firstTime && isMailConfigured()) {
    const replyTo = process.env.NEXT_PUBLIC_CONTACT_EMAIL || MAIL_TO();
    const [c, a] = await Promise.allSettled([
      sendMail({ to: d.email, replyTo, ...customerEmail(record) }),
      MAIL_TO() ? sendMail({ to: MAIL_TO(), replyTo: d.email, ...adminEmail(record) }) : Promise.reject(new Error("MAIL_TO empty")),
    ]);
    mail.customer = c.status === "fulfilled" ? "sent" : "failed";
    mail.admin = a.status === "fulfilled" ? "sent" : "failed";
    const errors = [c, a]
      .filter((r): r is PromiseRejectedResult => r.status === "rejected")
      .map((r) => (r.reason instanceof Error ? r.reason.message : String(r.reason)));
    if (errors.length) {
      mail.error = errors.join(" | ").slice(0, 500);
      console.error("[orders] mail error:", mail.error);
    }
  } else if (!isMailConfigured()) {
    console.warn("[orders] SMTP not configured: no emails sent for", d.orderID);
  }

  if (dbSaved) {
    try {
      await updateOrderMail(d.orderID, mail);
    } catch (err) {
      console.error("[orders] mail status update failed:", err instanceof Error ? err.message : err);
    }
  }

  return NextResponse.json({ ok: true, emailed: mail.customer === "sent", saved: dbSaved });
}
