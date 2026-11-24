/**
 * Runs once when the Next.js server starts. Opens the MongoDB connection and creates the
 * orders collection's indexes up front, so the first customer after a deploy doesn't wait.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || !process.env.MONGODB_URI) return;
  try {
    const { getOrdersCollection } = await import("@/lib/orders");
    await getOrdersCollection();
  } catch (err) {
    // Never block server start; the first request will retry
    console.warn("[instrumentation] DB warm-up failed:", err instanceof Error ? err.message : err);
  }
}
