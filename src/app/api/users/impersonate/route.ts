import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getToken } from "next-auth/jwt";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const [userToImpersonate] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (!userToImpersonate) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create a new session for the impersonated user
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token) {
      return NextResponse.json(
        { error: "Failed to create impersonation token" },
        { status: 500 },
      );
    }

    const impersonatedToken = {
      ...token,
      sub: userToImpersonate.id,
      name: userToImpersonate.name,
      email: userToImpersonate.email,
      role: userToImpersonate.role,
      isImpersonating: true,
      originalUser: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
      },
    };

    const response = NextResponse.json(
      { message: "Impersonation successful" },
      { status: 200 },
    );
    response.cookies.set(
      "next-auth.session-token",
      JSON.stringify(impersonatedToken),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      },
    );

    return response;
  } catch (error) {
    console.error("Error impersonating user:", error);
    return NextResponse.json(
      { error: "Failed to impersonate user" },
      { status: 500 },
    );
  }
}
