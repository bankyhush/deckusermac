import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "09802093uiedjfdnei";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "xbncnskjswow9838972";

export interface JwtPayload {
  id: number;
  email: string;
}

// ✅ access token — short lived (15 minutes)
export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
}

// ✅ refresh token — long lived (7 days)
export function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
}

// ✅ verify access token
export function verifyAccessToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

// ✅ verify refresh token
export function verifyRefreshToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}
