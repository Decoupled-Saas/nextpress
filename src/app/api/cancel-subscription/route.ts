import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/lib/auth"
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import stripe from '@/lib/stripe';

export async function POST() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const [user] = await db.select().from(users).where(eq(users.id, session.user.id));

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (user.subscriptionStatus !== 'active') {
            return NextResponse.json({ error: 'No active subscription to cancel' }, { status: 400 });
        }

        // Retrieve the Stripe subscription ID (you'll need to store this when creating the subscription)
        const stripeSubscriptionId = user.stripeSubscriptionId;

        if (!stripeSubscriptionId) {
            return NextResponse.json({ error: 'No Stripe subscription found' }, { status: 400 });
        }

        // Cancel the subscription in Stripe
        await stripe.subscriptions.cancel(stripeSubscriptionId);

        // Update the user's subscription status in the database
        await db.update(users)
            .set({
                subscriptionStatus: 'canceled',
                subscriptionEndDate: null,
                stripeSubscriptionId: null,
            })
            .where(eq(users.id, user.id));

        return NextResponse.json({ message: 'Subscription cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling subscription:', error);
        return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 });
    }
}

