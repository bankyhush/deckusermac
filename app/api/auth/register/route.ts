import prisma from "@/connection/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";
import { setTokenCookies } from "@/lib/setTokenCookies";

export async function POST(req: Request) {
  try {
    const { email, name, password } = await req.json();

    if (!email || !name || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 },
      );
    }

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already exists, use a different one",
        },
        { status: 403 },
      );
    }

    const hashedpass = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { email, name, password: hashedpass },
    });

    const payload = { id: newUser.id, email: newUser.email };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    const response = NextResponse.json(
      {
        success: true,
        message: "Registration successful!",
        data: { email: newUser.email, name: newUser.name },
      },
      { status: 201 },
    );

    return setTokenCookies(response, accessToken, refreshToken); // ✅ set both cookies
  } catch (error) {
    console.error("Unable to register user", error);
    return NextResponse.json(
      { success: false, message: "Invalid Registration Protocol" },
      { status: 500 },
    );
  }
}
