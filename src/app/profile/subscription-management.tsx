"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: number;
}

// interface User {
//   id: string
//   name: string
//   email: string
//   subscriptionStatus: string
//   subscriptionEndDate: string | null
// }

interface StripeSubscription {
  id: string;
  status: string;
  current_period_end: number;
  cancel_at_period_end: boolean;
  plan: {
    nickname: string;
    amount: number;
    interval: string;
  };
}

interface Invoice {
  id: string;
  number: string;
  amount_paid: number;
  status: string;
  created: number;
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export default function SubscriptionManagement() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [stripeSubscription, setStripeSubscription] =
    useState<StripeSubscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSubscriptionInfo();
  }, []);

  const fetchSubscriptionInfo = async () => {
    try {
      const response = await fetch("/api/subscriptions");
      if (!response.ok) {
        throw new Error("Failed to fetch subscription information");
      }
      const data = await response.json();
      setPlans(data.plans);
      setStripeSubscription(data.stripeSubscription);
      setInvoices(data.invoices);
    } catch (error) {
      console.error("Error fetching subscription info:", error);
      toast.error("Failed to fetch subscription information");
    }
  };

  const handleSubscribe = async (planId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { sessionId } = await response.json();
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error("Stripe failed to initialize");
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to process subscription");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/cancel-subscription", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to cancel subscription");
      }

      toast.success("Subscription cancelled successfully");
      fetchSubscriptionInfo();
    } catch (error) {
      console.error("Cancellation error:", error);
      toast.error("Failed to cancel subscription");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePaymentMethod = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/create-portal-session", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to create portal session");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Update payment method error:", error);
      toast.error("Failed to update payment method");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Current Subscription</h2>
        {stripeSubscription ? (
          <Card>
            <CardHeader>
              <CardTitle>{stripeSubscription.plan.nickname}</CardTitle>
              <CardDescription>
                ${stripeSubscription.plan.amount / 100} /{" "}
                {stripeSubscription.plan.interval}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Status: {stripeSubscription.status}</p>
              <p>
                Current period end:{" "}
                {new Date(
                  stripeSubscription.current_period_end * 1000,
                ).toLocaleDateString()}
              </p>
              {stripeSubscription.cancel_at_period_end && (
                <p className="text-yellow-500">
                  Your subscription will cancel at the end of the current
                  period.
                </p>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={handleUpdatePaymentMethod} disabled={isLoading}>
                Update Payment Method
              </Button>
              {!stripeSubscription.cancel_at_period_end && (
                <Button
                  onClick={handleCancelSubscription}
                  disabled={isLoading}
                  variant="destructive"
                >
                  Cancel Subscription
                </Button>
              )}
            </CardFooter>
          </Card>
        ) : (
          <p>No active subscription</p>
        )}
      </div>

      {!stripeSubscription && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id}>
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>
                    ${plan.price / 100} for {plan.duration} days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Add more plan details here if needed */}
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : "Subscribe"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {invoices.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Invoice History</h2>
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice Number</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.number}</TableCell>
                  <TableCell>
                    {new Date(invoice.created * 1000).toLocaleDateString()}
                  </TableCell>
                  <TableCell>${invoice.amount_paid / 100}</TableCell>
                  <TableCell>{invoice.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
