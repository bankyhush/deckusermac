import prisma from "@/connection/db";
import { getAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

interface Params {
  id: string; // URL params are always strings
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<Params> },
) {
  const auth = await getAuth();
  if (!auth)
    return NextResponse.json(
      { success: false, message: "Unauthorized User" },
      { status: 401 },
    );

  const { id } = await params;
  const parsedId = parseInt(id); // convert string to number

  if (isNaN(parsedId)) {
    return NextResponse.json(
      { success: false, message: "Invalid blog ID" },
      { status: 400 },
    );
  }

  try {
    await prisma.blog.delete({
      where: { id: parsedId },
    });

    return NextResponse.json(
      { success: true, message: "Blog deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Unable to delete blog" },
      { status: 500 },
    );
  }
}
