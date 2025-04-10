import { NextResponse } from "next/server";

export async function middleware() {
  // Place any non-authentication logic here if needed

  return NextResponse.next(); // Allow all access
}

export const config = {
  matcher: ["/dashboard/:path*"], // Apply this middleware to dashboard routes
};
