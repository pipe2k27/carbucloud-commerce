import { NextResponse } from "next/server";
import { getToken, JWT } from "next-auth/jwt";
import { getOrCreateUser, User } from "./dynamo-db/user.db";

const userCheck = async (jwt: JWT): Promise<User | false> => {
  // case 1 userIs logged in but does not have a user on db or does not have a company asdsigned yet

  if (!jwt.sub || !jwt.email) {
    return false;
  }

  const user = await getOrCreateUser({
    userId: jwt.sub,
    name: jwt.name || jwt.email || "Sin Nombre",
    email: jwt.email || "Sin Email",
  }); // Create user if not exists

  if (!user || user.status === 500 || !user.data) {
    return false;
  }

  return user.data as User;
};

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url)); // Redirect to login if not authenticated
  }

  const user = await userCheck(token);

  if (!user) {
    return NextResponse.redirect(new URL("/error", req.url)); // Redirect to login if not authenticated
  }

  if (user.companyId === "0000") {
    return NextResponse.redirect(new URL("/user-unverified", req.url)); // Redirect to login if not authenticated
  }

  return NextResponse.next(); // Allow access if authenticated
}

export const config = {
  matcher: ["/dashboard/:path*"], // Protect all routes under /protected
};
