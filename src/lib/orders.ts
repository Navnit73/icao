import "server-only";
import type { Collection } from "mongodb";
import { getClientPromise } from "@/lib/db/mongodb";
import type { PlanType } from "@/lib/currency";

/**
 * PayPal order records for id-photo-maker.com.
 * Lives in its own collection so it never clashes with other apps sharing the database.
 */

const COLLECTION = "id_photo_maker_orders";

export type VerificationStatus = "verified" | "unverified" | "verification_failed";
export type MailStatus = "sent" | "failed" | "skipped";

export interface OrderRecord {
  /** PayPal order id (unique). */
  orderId: string;
  status: "paid";
  verification: VerificationStatus;
  verificationNote?: string;
  plan: PlanType;
  /** Amount PayPal reported to the browser, in minor units. */
  amount: number;
  currency: string;
  /** What our price table says this plan costs for the visitor's country. */
  expectedAmount: number;
  priceMatches: boolean;
  customerEmail: string;
  payerEmail?: string;
  payerName?: string;
  payerId?: string;
  resultId: string;
  documentCountryCode: string;
  documentCountryName: string;
  documentType: string;
  dimensions: string;
  imageUrl: string;
  visitorCountry: string | null;
  ipHash?: string;
  userAgent?: string;
  mail: { customer: MailStatus; admin: MailStatus; error?: string };
  createdAt: Date;
  updatedAt: Date;
}

let indexesReady: Promise<unknown> | null = null;

export function isDbConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI);
}

export async function getOrdersCollection(): Promise<Collection<OrderRecord>> {
  const client = await getClientPromise();
  const db = client.db(process.env.MONGODB_DB || process.env.MONGODB_DB_NAME || "id_photo_maker");
  const col = db.collection<OrderRecord>(COLLECTION);
  indexesReady ??= Promise.all([
    col.createIndex({ orderId: 1 }, { unique: true, name: "orderId_unique" }),
    col.createIndex({ customerEmail: 1, createdAt: -1 }, { name: "customerEmail_createdAt" }),
    col.createIndex({ createdAt: -1 }, { name: "createdAt_desc" }),
  ]).catch((err) => {
    indexesReady = null; // retry on the next request
    throw err;
  });
  await indexesReady;
  return col;
}

/**
 * Inserts the order once. Returns false when this PayPal order id was already recorded
 * (a retry or a refresh), so callers don't send the emails twice.
 */
export async function insertOrderOnce(
  record: Omit<OrderRecord, "createdAt" | "updatedAt" | "mail">
): Promise<{ inserted: boolean; existing?: OrderRecord }> {
  const col = await getOrdersCollection();
  const now = new Date();
  const res = await col.updateOne(
    { orderId: record.orderId },
    { $setOnInsert: { ...record, mail: { customer: "skipped", admin: "skipped" }, createdAt: now, updatedAt: now } },
    { upsert: true }
  );
  if (res.upsertedCount === 1) return { inserted: true };
  const existing = await col.findOne({ orderId: record.orderId });
  return { inserted: false, existing: existing ?? undefined };
}

export async function updateOrderMail(orderId: string, mail: OrderRecord["mail"]) {
  const col = await getOrdersCollection();
  await col.updateOne({ orderId }, { $set: { mail, updatedAt: new Date() } });
}
