import "server-only";
import { escapeHtml } from "@/lib/mail";
import { formatMoney } from "@/lib/currency";
import type { OrderRecord } from "@/lib/orders";
import { getSiteUrl } from "@/lib/site";

const SITE_URL = () => getSiteUrl();
const SITE_NAME = "ID Photo Maker";

function layout(title: string, body: string): string {
  return `<!doctype html><html><body style="margin:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#111">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:16px;overflow:hidden">
<tr><td style="padding:24px 28px;border-bottom:1px solid #eee;font-weight:700;font-size:18px">${SITE_NAME}</td></tr>
<tr><td style="padding:28px">
<h1 style="margin:0 0 16px;font-size:22px;line-height:1.3">${title}</h1>
${body}
</td></tr>
<tr><td style="padding:18px 28px;background:#fafafa;color:#666;font-size:12px;line-height:1.5">
${SITE_NAME} is an independent photo service, not affiliated with ICAO or any government.<br>
<a href="${SITE_URL()}" style="color:#b45309">${SITE_URL().replace(/^https?:\/\//, "")}</a>
</td></tr></table></td></tr></table></body></html>`;
}

function row(label: string, value: string): string {
  return `<tr><td style="padding:6px 0;color:#666;font-size:14px;width:40%">${escapeHtml(label)}</td><td style="padding:6px 0;font-size:14px;font-weight:600">${escapeHtml(value)}</td></tr>`;
}

const planName = (o: Pick<OrderRecord, "plan">) => (o.plan === "expert_edit" ? "Expert-checked photo" : "ICAO digital photo");

export function customerEmail(o: OrderRecord): { subject: string; html: string; text: string } {
  const price = formatMoney(o.amount, o.currency);
  const expert = o.plan === "expert_edit";
  const subject = `Your ICAO photo is ready — order ${o.orderId}`;
  const html = layout(
    "Your ICAO photo is ready",
    `<p style="margin:0 0 20px;font-size:15px;line-height:1.6">Thank you for your order. Your ${escapeHtml(
      o.documentCountryName
    )} ${escapeHtml(o.documentType)} photo is ready to download.</p>
<p style="margin:0 0 24px"><a href="${escapeHtml(o.imageUrl)}" style="display:inline-block;background:#fbbf24;color:#000;text-decoration:none;font-weight:700;padding:14px 22px;border-radius:12px">Download your photo (${escapeHtml(
      o.dimensions
    )} px)</a></p>
${
  expert
    ? `<p style="margin:0 0 20px;padding:14px;background:#fffbeb;border-radius:12px;font-size:14px;line-height:1.6"><strong>Expert review:</strong> our team is checking your photo and will email the reviewed version within one working day. If an official portal rejects it, reply to this email with the rejection message and we will remake it free.</p>`
    : ""
}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #eee;padding-top:8px">
${row("Order reference (PayPal)", o.orderId)}
${row("Plan", planName(o))}
${row("Photo", `${o.documentCountryName} ${o.documentType}, ${o.dimensions} px`)}
${row("Paid", price)}
</table>
<p style="margin:20px 0 0;font-size:13px;color:#666;line-height:1.6">Tip: upload the JPEG as it is. Do not crop, resize or add filters, or the ICAO check may fail again. Questions? Just reply to this email.</p>`
  );
  const text = [
    "Your ICAO photo is ready",
    "",
    `Download your photo (${o.dimensions} px): ${o.imageUrl}`,
    "",
    expert ? "Expert review: our team will email the reviewed version within one working day.\n" : "",
    `Order reference (PayPal): ${o.orderId}`,
    `Plan: ${planName(o)}`,
    `Photo: ${o.documentCountryName} ${o.documentType}, ${o.dimensions} px`,
    `Paid: ${price}`,
    "",
    "Upload the JPEG as it is. Questions? Reply to this email.",
    SITE_URL(),
  ].join("\n");
  return { subject, html, text };
}

export function adminEmail(o: OrderRecord): { subject: string; html: string; text: string } {
  const price = formatMoney(o.amount, o.currency);
  const flags = [
    o.plan === "expert_edit" ? "EXPERT REVIEW NEEDED" : "",
    o.priceMatches ? "" : `PRICE MISMATCH (expected ${formatMoney(o.expectedAmount, o.currency)})`,
    o.verification === "verified" ? "" : `PayPal ${o.verification}${o.verificationNote ? `: ${o.verificationNote}` : ""}`,
  ].filter(Boolean);
  const subject = `${o.plan === "expert_edit" ? "[EXPERT] " : ""}New order ${price} — ${o.documentCountryName} ${o.dimensions}`;
  const html = layout(
    `New order: ${escapeHtml(price)}`,
    `${
      flags.length
        ? `<p style="margin:0 0 16px;padding:12px;background:#fef2f2;color:#991b1b;border-radius:10px;font-size:14px;font-weight:600">${flags
            .map(escapeHtml)
            .join("<br>")}</p>`
        : ""
    }
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${row("PayPal order", o.orderId)}
${row("Plan", planName(o))}
${row("Amount", `${price} (${o.currency})`)}
${row("Customer email", o.customerEmail)}
${row("PayPal payer", [o.payerName, o.payerEmail].filter(Boolean).join(" · ") || "—")}
${row("Document", `${o.documentCountryName} ${o.documentType} (${o.documentCountryCode})`)}
${row("Size", `${o.dimensions} px`)}
${row("Visitor country", o.visitorCountry || "unknown")}
${row("Verification", o.verification)}
</table>
<p style="margin:20px 0 0"><a href="${escapeHtml(o.imageUrl)}" style="color:#b45309;font-weight:600">Open the customer’s photo</a></p>`
  );
  const text = [
    `New order ${price}`,
    ...flags,
    `PayPal order: ${o.orderId}`,
    `Plan: ${planName(o)}`,
    `Customer email: ${o.customerEmail}`,
    `PayPal payer: ${[o.payerName, o.payerEmail].filter(Boolean).join(" · ") || "-"}`,
    `Document: ${o.documentCountryName} ${o.documentType} ${o.dimensions} px`,
    `Visitor country: ${o.visitorCountry || "unknown"}`,
    `Verification: ${o.verification}`,
    `Photo: ${o.imageUrl}`,
  ].join("\n");
  return { subject, html, text };
}
