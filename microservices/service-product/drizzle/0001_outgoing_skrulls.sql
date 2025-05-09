CREATE INDEX IF NOT EXISTS "idx_categories_tenant_id" ON "categories" ("tenant_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_categories_name" ON "categories" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_products_tenant_id" ON "products" ("tenant_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_products_category_id" ON "products" ("category_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_products_name" ON "products" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_products_tenant_category" ON "products" ("tenant_id","category_id");