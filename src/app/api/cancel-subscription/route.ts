import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { subscriptionPlans } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import stripe from '@/lib/stripe';

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { planId } = await request.json();

        const [plan] = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, planId));

        if (!plan) {
            return NextResponse.json({ error: 'Invalid subscription plan' }, { status: 400 });
        }

        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: plan.stripePriceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription?canceled=true`,
            client_reference_id: session.user.email,
        });

        return NextResponse.json({ sessionId: checkoutSession.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
    }
}

