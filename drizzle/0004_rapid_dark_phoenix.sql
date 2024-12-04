ALTER TABLE "subscription_plans" ADD COLUMN "stripe_product_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "subscription_plans" ADD COLUMN "stripe_price_id" text NOT NULL;