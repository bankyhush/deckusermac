// api/auth/createBlog
import prisma from "@/connection/db";
import { NextResponse } from "next/server";

interface BlogType {
  userId: number;
  title: string;
  content: string;
}

export async function POST(req: Request) {
  const body = await req.json();

  const { userId, title, content } = body as BlogType;

  if (!userId || !title || !content) {
    return NextResponse.json(
      { success: false, message: "All fields are required" },
      { status: 400 },
    );
  }

  try {
    const verifyUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!verifyUser) {
      return NextResponse.json(
        { success: false, message: "Invalid User" },
        { status: 404 },
      );
    }

    const newBlog = await prisma.blog.create({
      data: {
        userId,
        title,
        content,
      },
    });

    return NextResponse.json(
      { success: true, message: "Blog created successfully!", data: newBlog },
      { status: 201 },
    );
  } catch (error) {
    console.error("Unable to create blog", error);
    return NextResponse.json(
      { success: false, message: "Invalid Blog Protocol" },
      { status: 500 },
    );
  }
}
