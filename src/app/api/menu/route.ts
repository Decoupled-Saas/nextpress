import { NextRequest, NextResponse } from "next/server";
import {
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItems,
} from "@/lib/menu";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const items = await getMenuItems();
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu items" },
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
  const { label, url, order } = body;

  if (!label || !url) {
    return NextResponse.json(
      { error: "Label and URL are required" },
      { status: 400 },
    );
  }

  try {
    const newItem = await createMenuItem({ label, url, order: order || 0 });
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error creating menu item:", error);
    return NextResponse.json(
      { error: "Failed to create menu item" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !["admin", "editor"].includes(session.user?.role as string)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();
  const { id, ...updateData } = body;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const updatedItem = await updateMenuItem(id, updateData);
    if (!updatedItem) {
      return NextResponse.json(
        { error: "Menu item not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error) {
    console.error("Error updating menu item:", error);
    return NextResponse.json(
      { error: "Failed to update menu item" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !["admin", "editor"].includes(session.user?.role as string)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    await deleteMenuItem(id);
    return NextResponse.json(
      { message: "Menu item deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return NextResponse.json(
      { error: "Failed to delete menu item" },
      { status: 500 },
    );
  }
}
