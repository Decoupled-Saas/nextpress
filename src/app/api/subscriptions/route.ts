import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, subscriptionPlans } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import stripe from "@/lib/stripe";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id));

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const plans = await db.select().from(subscriptionPlans);

    let stripeSubscription = null;
    let invoices = [];

    if (user.stripeSubscriptionId) {
      stripeSubscription = await stripe.subscriptions.retrieve(
        user.stripeSubscriptionId,
      );

      const invoicesList = await stripe.invoices.list({
        customer: user.stripeCustomerId,
        limit: 5,
      });
      invoices = invoicesList.data;
    }

    return NextResponse.json({
      subscriptionStatus: user.subscriptionStatus,
      subscriptionEndDate: user.subscriptionEndDate,
      plans: plans,
      stripeSubscription: stripeSubscription,
      invoices: invoices,
    });
  } catch (error) {
    console.error("Error fetching subscription info:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription information" },
      { status: 500 },
    );
  }
}
