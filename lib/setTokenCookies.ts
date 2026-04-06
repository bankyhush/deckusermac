import { NextResponse } from "next/server";

export function setTokenCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string,
) {
  // access token — short lived, readable only by server
  response.cookies.set("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 15, // 15 minutes in seconds
    path: "/",
  });

  // refresh token — long lived, only sent to /api/auth/refresh
  response.cookies.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    path: "/api/auth/refresh", // ✅ only sent to this endpoint — more secure
  });

  return response;
}
