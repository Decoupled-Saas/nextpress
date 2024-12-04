import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import { db } from '@/lib/db'
import { users, subscriptionPlans } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { planId } = await request.json()

        const [plan] = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, planId))

        if (!plan) {
            return NextResponse.json({ error: 'Invalid subscription plan' }, { status: 400 })
        }

        // Here you would integrate with a payment provider (e.g., Stripe)
        // For this example, we'll assume the payment was successful

        const subscriptionEndDate = new Date()
        subscriptionEndDate.setDate(subscriptionEndDate.getDate() + plan.duration)

        const [updatedUser] = await db.update(users)
            .set({
                subscriptionStatus: 'active',
                subscriptionEndDate: subscriptionEndDate,
            })
            .where(eq(users.id, session.user.id))
            .returning()

        return NextResponse.json({ message: 'Subscription successful', user: updatedUser })
    } catch (error) {
        console.error('Subscription error:', error)
        return NextResponse.json({ error: 'Failed to process subscription' }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const [user] = await db.select().from(users).where(eq(users.id, session.user.id))

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const plans = await db.select().from(subscriptionPlans)

        return NextResponse.json({
            subscriptionStatus: user.subscriptionStatus,
            subscriptionEndDate: user.subscriptionEndDate,
            plans: plans,
        })
    } catch (error) {
        console.error('Error fetching subscription info:', error)
        return NextResponse.json({ error: 'Failed to fetch subscription information' }, { status: 500 })
    }
}

