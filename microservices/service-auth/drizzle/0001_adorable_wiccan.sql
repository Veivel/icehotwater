CREATE INDEX IF NOT EXISTS "idx_users_tenant_id" ON "users" ("tenant_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_users_email" ON "users" ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_users_username" ON "users" ("username");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_users_tenant_username" ON "users" ("tenant_id","username");