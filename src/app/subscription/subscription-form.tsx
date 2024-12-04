'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { loadStripe } from '@stripe/stripe-js'

interface SubscriptionPlan {
    id: string
    name: string
    price: number
    duration: number
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function SubscriptionForm() {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([])
    const [currentStatus, setCurrentStatus] = useState<string>('')
    const [endDate, setEndDate] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        fetchSubscriptionInfo()
    }, [])

    const fetchSubscriptionInfo = async () => {
        try {
            const response = await fetch('/api/subscriptions')
            if (!response.ok) {
                throw new Error('Failed to fetch subscription information')
            }
            const data = await response.json()
            setPlans(data.plans)
            setCurrentStatus(data.subscriptionStatus)
            setEndDate(data.subscriptionEndDate)
        } catch (error) {
            console.error('Error fetching subscription info:', error)
            toast.error('Failed to fetch subscription information')
        }
    }

    const handleSubscribe = async (planId: string) => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planId }),
            })

            if (!response.ok) {
                throw new Error('Failed to create checkout session')
            }

            const { sessionId } = await response.json()
            const stripe = await stripePromise

            if (!stripe) {
                throw new Error('Stripe failed to initialize')
            }

            const { error } = await stripe.redirectToCheckout({ sessionId })

            if (error) {
                throw error
            }
        } catch (error) {
            console.error('Subscription error:', error)
            toast.error('Failed to process subscription')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-semibold mb-2">Current Subscription</h2>
                <p>Status: {currentStatus}</p>
                {endDate && <p>End Date: {new Date(endDate).toLocaleDateString()}</p>}
            </div>

            <div>
                <h2 className="text-2xl font-semibold mb-4">Available Plans</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                        <Card key={plan.id}>
                            <CardHeader>
                                <CardTitle>{plan.name}</CardTitle>
                                <CardDescription>${plan.price / 100} for {plan.duration} days</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {/* Add more plan details here if needed */}
                            </CardContent>
                            <CardFooter>
                                <Button onClick={() => handleSubscribe(plan.id)} disabled={isLoading || currentStatus === 'active'}>
                                    {isLoading ? 'Processing...' : 'Subscribe'}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}

