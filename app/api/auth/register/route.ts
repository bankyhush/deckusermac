// api/auth/register
import prisma from "@/connection/db";
import { NextResponse } from "next/server";

interface RegisterType {
  email: string;
  name: string;
  password: string;
}

export async function POST(req: Request) {
  const body = await req.json();
  const { email, name, password } = body as RegisterType;
  try {
    if (!email || !name || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 },
      );
    }

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already existing, use a different one",
        },
        { status: 403 },
      );
    }

    // save data

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Registration successfully!",
        data: newUser,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Unable to register user", error);
    return NextResponse.json(
      {
        success: false,
        message: "Invalid Registration Protocol",
      },
      { status: 500 },
    );
  }
}
