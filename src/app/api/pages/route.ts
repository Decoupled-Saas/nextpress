import { NextResponse } from "next/server";
import { createPage, getPages } from "@/lib/pages";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const allPages = await getPages(true);
    return NextResponse.json(allPages);
  } catch (error) {
    console.error("Error fetching pages:", error);
    return NextResponse.json(
      { error: "Failed to fetch pages" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !["admin", "editor"].includes(session.user?.role as string)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();
  const { title, content, slug, status } = body;

  if (!title || !content || !slug || !status) {
    return NextResponse.json(
      { error: "Title, content, slug, and status are required" },
      { status: 400 },
    );
  }

  const newPage = await createPage({ title, content, slug, status });
  return NextResponse.json(newPage, { status: 201 });
}
