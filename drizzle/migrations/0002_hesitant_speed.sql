ALTER TABLE "transactions" ALTER COLUMN "transaction_date" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "embedding" vector(768);