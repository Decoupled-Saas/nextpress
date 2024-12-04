ALTER TABLE "pages" ADD COLUMN "status" text DEFAULT 'draft' NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "status" text DEFAULT 'draft' NOT NULL;