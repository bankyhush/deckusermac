import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    { success: true, message: "Logged out" },
    { status: 200 },
  );

  // ✅ clear both tokens
  response.cookies.set("access_token", "", { maxAge: 0, path: "/" });
  response.cookies.set("refresh_token", "", {
    maxAge: 0,
    path: "/api/auth/refresh",
  });

  return response;
}
