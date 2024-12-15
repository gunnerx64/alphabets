CREATE TABLE IF NOT EXISTS "alphabets_account" (
	"user_id" uuid NOT NULL,
	"type" varchar(64) NOT NULL,
	"provider" varchar(64) NOT NULL,
	"provider_account_id" varchar(64) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "alphabets_account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "alphabets_card" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lastname" varchar(128) NOT NULL,
	"firstname" varchar(128) NOT NULL,
	"middlename" varchar(128),
	"token" varchar(32),
	"birthdate" date NOT NULL,
	"rank_comment" varchar(255),
	"region_id" uuid NOT NULL,
	"admission_year" integer NOT NULL,
	"graduate_year" integer,
	"exclusion_date" date,
	"exclusion_comment" varchar(255),
	"scan_url" varchar(128) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by_id" uuid,
	"updated_at" timestamp DEFAULT NULL,
	"updated_by_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "alphabets_region" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(128) NOT NULL,
	"state" varchar(128),
	"sort" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "alphabets_session" (
	"session_token" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "alphabets_user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(128),
	"email" varchar(64) NOT NULL,
	"email_verified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255),
	"active" boolean DEFAULT true NOT NULL,
	"role" "role" DEFAULT 'guest' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "alphabets_verification_token" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "alphabets_verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "alphabets_account" ADD CONSTRAINT "alphabets_account_user_id_alphabets_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."alphabets_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "alphabets_card" ADD CONSTRAINT "alphabets_card_region_id_alphabets_region_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."alphabets_region"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "alphabets_card" ADD CONSTRAINT "alphabets_card_created_by_id_alphabets_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."alphabets_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "alphabets_card" ADD CONSTRAINT "alphabets_card_updated_by_id_alphabets_user_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."alphabets_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "alphabets_session" ADD CONSTRAINT "alphabets_session_user_id_alphabets_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."alphabets_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_user_id_idx" ON "alphabets_account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "lastname_idx" ON "alphabets_card" USING btree ("lastname");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "admission_idx" ON "alphabets_card" USING btree ("admission_year");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "graduate_idx" ON "alphabets_card" USING btree ("graduate_year");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_user_id_idx" ON "alphabets_session" USING btree ("user_id");