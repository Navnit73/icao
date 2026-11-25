import { NextResponse, type NextRequest } from "next/server";
import { detectCountry } from "@/lib/currency";

/**
 * Visitor's geo-IP country, fetched by the photo tool in the browser so the
 * marketing pages themselves can be static and cached.
 */
export function GET(request: NextRequest) {
  return NextResponse.json(
    { country: detectCountry(request.headers) },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}
