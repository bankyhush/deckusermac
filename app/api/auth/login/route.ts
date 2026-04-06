import prisma from "@/connection/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

interface LoginType {
  email: string;
  password: string;
}

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body as LoginType;

  if (!email || !password) {
    return NextResponse.json(
      {
        success: false,
        message: "All fields are required",
      },
      { status: 400 },
    );
  }

  try {
    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid user details" },
        { status: 400 },
      );
    }

    // Verify password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { success: false, message: "Invalid user details" },
        { status: 401 },
      );
    }

    // Success response
    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Unable to login user", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
