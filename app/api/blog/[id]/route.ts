import prisma from "@/connection/db";
import { getAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

interface Params {
  id: string; // URL params are always strings
}

interface blogUpdate {
  title: string;
  content: string;
  published: boolean;
}

export async function GET(
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
    const blog = await prisma.blog.findUnique({
      where: { id: parsedId },
      select: { title: true, content: true, published: true },
    });

    return NextResponse.json(
      { success: true, message: "Blog viewed successfully", data: blog },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Unable to view blog post" },
      { status: 500 },
    );
  }
}

// PUT BLOG

export async function PUT(
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

  const body = await req.json();
  const { title, content, published } = body as blogUpdate;

  if (!title || !content || published === undefined) {
    return NextResponse.json(
      { success: false, message: "All fields required" },
      { status: 403 },
    );
  }

  try {
    const updatedBlog = await prisma.blog.update({
      where: { id: parsedId },
      data: { title, content, published },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Blog updated successfully",
        data: updatedBlog,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Unable to update blog" },
      { status: 500 },
    );
  }
}
