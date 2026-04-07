import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import prisma from "@/connection/db";

export async function GET() {
  const auth = await getAuth();
  if (!auth) {
    return NextResponse.json(
      { success: false, message: "Unauthorized User" },
      { status: 401 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: auth.id },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  if (!user) {
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, data: user }, { status: 200 });
}
