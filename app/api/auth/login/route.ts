import prisma from "@/connection/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";
import { setTokenCookies } from "@/lib/setTokenCookies";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid user details" },
        { status: 400 },
      );
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { success: false, message: "Invalid user details" },
        { status: 400 },
      );
    }

    const payload = { id: user.id, email: user.email };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    const { password: _, ...safeUser } = user;

    const response = NextResponse.json(
      { success: true, message: "Login successful", data: safeUser },
      { status: 200 },
    );

    return setTokenCookies(response, accessToken, refreshToken);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
