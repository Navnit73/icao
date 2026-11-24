import "server-only";
import type { VerificationStatus } from "@/lib/orders";

/**
 * Optional server-side check of a PayPal order. Payments are captured in the browser;
 * when PAYPAL_CLIENT_SECRET is set, the server also asks PayPal whether the order was
 * really captured for the expected amount. Without the secret the order is recorded
 * as "unverified".
 *
 * PAYPAL_ENV=sandbox switches to the sandbox API (default: live).
 */

const API_BASE = () =>
  process.env.PAYPAL_ENV === "sandbox" ? "https://api-m.sandbox.paypal.com" : "https://api-m.paypal.com";

interface PayPalOrder {
  status?: string;
  purchase_units?: Array<{
    payments?: { captures?: Array<{ status?: string; amount?: { value?: string; currency_code?: string } }> };
  }>;
}

export async function verifyPayPalOrder(
  orderId: string,
  expected: { value: string; currency: string }
): Promise<{ status: VerificationStatus; note?: string }> {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !secret || clientId === "test") return { status: "unverified", note: "no PAYPAL_CLIENT_SECRET" };

  try {
    const tokenRes = await fetch(`${API_BASE()}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${secret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
      cache: "no-store",
    });
    if (!tokenRes.ok) return { status: "verification_failed", note: `token ${tokenRes.status}` };
    const { access_token } = (await tokenRes.json()) as { access_token: string };

    const orderRes = await fetch(`${API_BASE()}/v2/checkout/orders/${encodeURIComponent(orderId)}`, {
      headers: { Authorization: `Bearer ${access_token}` },
      cache: "no-store",
    });
    if (!orderRes.ok) return { status: "verification_failed", note: `order ${orderRes.status}` };
    const order = (await orderRes.json()) as PayPalOrder;

    const capture = order.purchase_units?.[0]?.payments?.captures?.[0];
    const ok =
      order.status === "COMPLETED" &&
      (capture?.status === "COMPLETED" || capture?.status === "PENDING") &&
      Number(capture?.amount?.value) === Number(expected.value) &&
      capture?.amount?.currency_code === expected.currency;
    return ok
      ? { status: "verified" }
      : {
          status: "verification_failed",
          note: `status=${order.status} capture=${capture?.status} amount=${capture?.amount?.value} ${capture?.amount?.currency_code}`,
        };
  } catch (err) {
    return { status: "verification_failed", note: err instanceof Error ? err.message : "error" };
  }
}
