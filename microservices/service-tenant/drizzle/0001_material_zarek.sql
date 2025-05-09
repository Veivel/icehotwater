CREATE INDEX IF NOT EXISTS "idx_tenant_details_tenant_id" ON "tenantDetails" ("tenant_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_tenant_details_name" ON "tenantDetails" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_tenants_owner_id" ON "tenants" ("owner_id");