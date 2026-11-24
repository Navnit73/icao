"use client";

import { useEffect, useRef, useState } from "react";
import { PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { AlertCircle, CheckCircle2, Info, Loader2 } from "lucide-react";

/**
 * PayPal Smart Buttons (PayPal + debit/credit card), same client-side flow as
 * deedpoll.uk: the order is created and captured in the browser with the public
 * client ID, and the captured amount/currency is checked before onSuccess fires.
 */

// Live client ID from the environment, or PayPal's "test" sandbox client.
const CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test";

export interface PaidOrder {
  orderID: string;
  payerID: string;
  name: string;
  email: string;
}

export interface PaymentButtonProps {
  /** Amount in minor units (pence/cents), e.g. 599 for $5.99. */
  amount: number;
  /** ISO 4217 currency PayPal supports, e.g. "USD". */
  currency: string;
  /** Shown on the PayPal checkout and receipt (max 127 chars). */
  description: string;
  /** Our reference for the order (shown in PayPal transaction details), e.g. the photo result id. */
  customId?: string;
  disabled?: boolean;
  onSuccess: (order: PaidOrder) => void;
}

type Toast = { message: string; type: "success" | "error" | "info" } | null;

/** Shown when the PayPal SDK fails to load, e.g. an invalid client ID or a blocked script. */
function ScriptStatus() {
  const [{ isPending, isRejected }] = usePayPalScriptReducer();
  if (isRejected) {
    return (
      <p role="alert" className="flex items-start gap-2 rounded-xl bg-red-50 p-3.5 text-sm text-red-800">
        <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        Payment is temporarily unavailable. Please refresh the page or try again later.
      </p>
    );
  }
  if (isPending) {
    return (
      <p className="flex items-center justify-center gap-2 py-4 text-sm text-gray-500" aria-live="polite">
        <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Loading secure checkout…
      </p>
    );
  }
  return null;
}

export default function PaymentButton({
  amount,
  currency,
  description,
  customId,
  disabled = false,
  onSuccess,
}: PaymentButtonProps) {
  const [toast, setToast] = useState<Toast>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const expectedValue = (amount / 100).toFixed(2);

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    []
  );

  const showToast = (message: string, type: NonNullable<Toast>["type"] = "info") => {
    // Clear the previous timer so it can't hide a newer message early.
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 6000);
  };

  return (
    <div className="w-full">
      {CLIENT_ID === "test" && (
        <p className="mb-3 rounded-xl bg-amber-50 p-3 text-xs font-medium text-amber-900 ring-1 ring-amber-200 ring-inset">
          PayPal sandbox mode: no real money will be taken. Set NEXT_PUBLIC_PAYPAL_CLIENT_ID to go live.
        </p>
      )}

      {/* Re-mount the SDK when the currency changes: PayPal loads one currency per script. */}
      <PayPalScriptProvider key={currency} options={{ clientId: CLIENT_ID, currency, intent: "capture" }}>
        <ScriptStatus />
        <PayPalButtons
          style={{ layout: "vertical", shape: "rect", color: "gold", label: "pay" }}
          disabled={disabled}
          forceReRender={[amount, currency, disabled, description]}
          onClick={(_data, actions) => {
            // The disabled prop only greys the button out; block the click as well.
            return disabled ? actions.reject() : actions.resolve();
          }}
          createOrder={(_data, actions) =>
            actions.order.create({
              intent: "CAPTURE",
              purchase_units: [
                {
                  amount: { currency_code: currency, value: expectedValue },
                  description: description.slice(0, 127),
                  ...(customId ? { custom_id: customId.slice(0, 127) } : {}),
                },
              ],
              application_context: { shipping_preference: "NO_SHIPPING" },
            })
          }
          onApprove={async (data, actions) => {
            if (!actions.order) return;
            showToast("Processing payment…", "info");

            let details;
            try {
              details = await actions.order.capture();
            } catch (err) {
              // PayPal recommends restarting checkout when the funding source is declined,
              // so the buyer can pick another way to pay.
              if (String(err).includes("INSTRUMENT_DECLINED")) {
                showToast("Your payment method was declined. Please try another card or account.", "error");
                return actions.restart();
              }
              console.error("PayPal capture error:", err);
              showToast("Payment could not be completed. You have not been charged.", "error");
              return;
            }

            const capture = details?.purchase_units?.[0]?.payments?.captures?.[0];
            const orderOk = details?.status === "COMPLETED" || details?.status === "APPROVED";
            const captureOk = !capture?.status || capture.status === "COMPLETED" || capture.status === "PENDING";
            const amountOk =
              !capture?.amount?.value ||
              (Number(capture.amount.value) === Number(expectedValue) &&
                (!capture.amount.currency_code || capture.amount.currency_code === currency));

            if (!orderOk || !captureOk || !amountOk) {
              console.error("PayPal capture not accepted:", details?.status, capture?.status, capture?.amount);
              showToast("Payment was not completed. Please contact support if you were charged.", "error");
              return;
            }

            const name = details.payer?.name?.given_name
              ? `${details.payer.name.given_name} ${details.payer.name.surname || ""}`.trim()
              : "";

            showToast("Payment successful! Preparing your photo…", "success");
            onSuccess({
              orderID: details.id || data.orderID,
              payerID: details.payer?.payer_id || "",
              name,
              email: details.payer?.email_address || "",
            });
          }}
          onError={(err) => {
            console.error("PayPal error:", err);
            showToast("Payment failed or was cancelled. You have not been charged.", "error");
          }}
          onCancel={() => showToast("Payment cancelled. You can try again any time.", "info")}
        />
      </PayPalScriptProvider>

      {toast && (
        <div
          role={toast.type === "error" ? "alert" : "status"}
          className={`mt-3 flex items-start gap-2.5 rounded-xl p-3.5 text-sm ${
            toast.type === "success"
              ? "bg-amber-50 text-black ring-1 ring-amber-200 ring-inset"
              : toast.type === "error"
                ? "bg-red-50 text-red-800"
                : "bg-gray-100 text-gray-700"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden="true" />
          ) : toast.type === "error" ? (
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          ) : (
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
