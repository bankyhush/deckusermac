import prisma from "@/connection/db";
import { getAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

interface profileType {
  name: string;
  email: string;
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
  const { name, email } = body as profileType;

  if (!name || !email) {
    return NextResponse.json(
      { success: false, message: "Fields can't be empty" },
      { status: 403 },
    );
  }

  try {
    const loggedUser = await prisma.user.findUnique({
      where: { id: auth.id },
    });

    if (!loggedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    const updated = await prisma.user.update({
      where: { id: loggedUser.id },
      data: { name, email },
      select: { id: true, name: true, email: true, createdAt: true }, // ✅ never return password
    });

    return NextResponse.json(
      { success: true, message: "Profile updated successfully", data: updated },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Profile update error" },
      { status: 500 },
    );
  }
}
