import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = headers().get('Stripe-Signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err) {
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    switch (event.type) {
        case 'checkout.session.completed':
            const checkoutSession = event.data.object as Stripe.Checkout.Session;
            if (checkoutSession.mode === 'subscription') {
                const subscriptionId = checkoutSession.subscription as string;
                const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                const userId = checkoutSession.client_reference_id;

                if (userId) {
                    await db.update(users)
                        .set({
                            subscriptionStatus: 'active',
                            subscriptionEndDate: new Date(subscription.current_period_end * 1000),
                            stripeSubscriptionId: subscriptionId,
                        })
                        .where(eq(users.id, userId));
                }
            }
            break;
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
            const subscription = event.data.object as Stripe.Subscription;
            const userId = subscription.metadata.userId;

            if (userId) {
                await db.update(users)
                    .set({
                        subscriptionStatus: subscription.status === 'active' ? 'active' : 'inactive',
                        subscriptionEndDate: subscription.status === 'active' ? new Date(subscription.current_period_end * 1000) : null,
                    })
                    .where(eq(users.id, userId));
            }
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
}

