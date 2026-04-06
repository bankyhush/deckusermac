import { cookies, headers } from "next/headers";
import { verifyToken, JwtPayload } from "@/lib/jwt";

// ✅ reads token from cookie (recommended — more secure)
export async function getAuthFromCookie(): Promise<JwtPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

// ✅ reads token from Authorization header (for API clients / mobile)
// usage: Authorization: Bearer <token>
export async function getAuthFromHeader(): Promise<JwtPayload | null> {
  const headerStore = await headers();
  const authHeader = headerStore.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.split(" ")[1]; // grab just the token part
  return verifyToken(token);
}

// ✅ use this in your API routes — checks cookie first, then header
export async function getAuth(): Promise<JwtPayload | null> {
  return (await getAuthFromCookie()) ?? (await getAuthFromHeader());
}
