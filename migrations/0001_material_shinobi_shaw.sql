ALTER TABLE "universities" ADD COLUMN "join_code" text NOT NULL;--> statement-breakpoint
ALTER TABLE "universities" ADD CONSTRAINT "universities_join_code_unique" UNIQUE("join_code");