import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { subscriptionPlans } from "@/lib/db/schema";
import stripe from "@/lib/stripe";

export async function GET() {
  try {
    const plans = await db.select().from(subscriptionPlans);
    return NextResponse.json(plans);
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { name, price, duration, stripeProductId, stripePriceId } =
      await request.json();

    if (!name || !price || !duration || !stripeProductId || !stripePriceId) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    // Verify that the Stripe Product and Price exist
    await stripe.products.retrieve(stripeProductId);
    await stripe.prices.retrieve(stripePriceId);

    const [newPlan] = await db
      .insert(subscriptionPlans)
      .values({ name, price, duration, stripeProductId, stripePriceId })
      .returning();

    return NextResponse.json(newPlan, { status: 201 });
  } catch (error) {
    console.error("Error creating plan:", error);
    return NextResponse.json(
      { error: "Failed to create plan" },
      { status: 500 },
    );
  }
}
