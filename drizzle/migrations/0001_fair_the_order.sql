ALTER TABLE "transactions" RENAME COLUMN "balance" TO "amount";--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "type" varchar(256);