import prisma from "@/connection/db";
import { getAuth } from "@/lib/auth";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

interface PasswordType {
  currentPassword: string;
  newPassword: string;
}

export async function PUT(req: Request) {
  const auth = await getAuth();

  if (!auth) {
    return NextResponse.json(
      { success: false, message: "Unauthorized User" },
      { status: 401 },
    );
  }

  const body = await req.json();
  const { currentPassword, newPassword } = body as PasswordType;

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { success: false, message: "All fields are required" },
      { status: 400 },
    );
  }

  if (newPassword.length < 3) {
    return NextResponse.json(
      { success: false, message: "New password must be at least 3 characters" },
      { status: 400 },
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: auth.id },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    //  verify current password is correct
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { success: false, message: "Current password is incorrect" },
        { status: 400 },
      );
    }

    // prevent using the same password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return NextResponse.json(
        {
          success: false,
          message: "New password must be different from current password",
        },
        { status: 400 },
      );
    }

    //  hash and save
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: auth.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json(
      { success: true, message: "Password updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Password update error" },
      { status: 500 },
    );
  }
}
