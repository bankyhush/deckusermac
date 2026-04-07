import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/jwt";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) redirect("/login");

  const user = verifyAccessToken(token);

  if (!user) redirect("/login");

  return user; // { id, email }
}
