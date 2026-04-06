import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export interface JwtPayload {
  id: number;
  email: string;
}

// call this after login to CREATE a token
export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

// call this to CHECK a token — returns the payload or null
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, SECRET) as JwtPayload;
  } catch {
    return null; // expired or tampered = null
  }
}
