// api/auth/createBlog
import prisma from "@/connection/db";
import { getAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

interface BlogType {
  userId: number;
  title: string;
  content: string;
  author: string;
  published: boolean;
}

export async function POST(req: Request) {
  const auth = await getAuth();
  if (!auth)
    return NextResponse.json(
      { success: false, message: "Unauthorized User" },
      { status: 401 },
    );

  const body = await req.json();

  const { title, content, published } = body as BlogType;

  if (!title || !content) {
    return NextResponse.json(
      { success: false, message: "All fields are required" },
      { status: 400 },
    );
  }

  try {
    const verifyUser = await prisma.user.findUnique({ where: { id: auth.id } });
    if (!verifyUser) {
      return NextResponse.json(
        { success: false, message: "Invalid User" },
        { status: 404 },
      );
    }

    const newBlog = await prisma.blog.create({
      data: {
        userId: verifyUser.id,
        title,
        content,
        author: verifyUser.name,
        published,
      },
      include: {
        user: {
          select: { name: true, email: true },
        },
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
