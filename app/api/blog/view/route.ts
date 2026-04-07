import prisma from "@/connection/db";
import { getAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const auth = await getAuth();
  if (!auth)
    return NextResponse.json(
      { success: false, message: "Unauthorized User" },
      { status: 401 },
    );

  try {
    const viewBlog = await prisma.blog.findMany();
    return NextResponse.json(
      { success: true, message: "Blog retrived successfully", data: viewBlog },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Unable to view blogs" },
      { status: 500 },
    );
  }
}
