CREATE INDEX IF NOT EXISTS "idx_cart_tenant_id" ON "cart" ("tenant_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_cart_user_id" ON "cart" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_cart_product_id" ON "cart" ("product_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_cart_tenant_user" ON "cart" ("tenant_id","user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_order_tenant_id" ON "order" ("tenant_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_order_user_id" ON "order" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_order_status" ON "order" ("order_status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_order_date" ON "order" ("order_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_order_tenant_user" ON "order" ("tenant_id","user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_order_detail_tenant_id" ON "order_detail" ("tenant_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_order_detail_order_id" ON "order_detail" ("order_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_order_detail_product_id" ON "order_detail" ("product_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_payment_tenant_id" ON "payment" ("tenant_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_payment_order_id" ON "payment" ("order_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_payment_date" ON "payment" ("payment_date");