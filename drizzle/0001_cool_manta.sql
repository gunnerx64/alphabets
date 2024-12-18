ALTER TABLE "alphabets_card" DROP CONSTRAINT "alphabets_card_updated_by_id_alphabets_user_id_fk";
--> statement-breakpoint
ALTER TABLE "alphabets_card" ALTER COLUMN "graduate_year" SET DEFAULT NULL;--> statement-breakpoint
ALTER TABLE "alphabets_card" ALTER COLUMN "exclusion_date" SET DEFAULT NULL;--> statement-breakpoint
ALTER TABLE "alphabets_card" ADD COLUMN "updated_by" varchar(64);--> statement-breakpoint
ALTER TABLE "alphabets_card" DROP COLUMN IF EXISTS "updated_by_id";