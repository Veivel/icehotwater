CREATE INDEX IF NOT EXISTS "idx_wishlist_tenant_id" ON "wishlist" ("tenant_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_wishlist_user_id" ON "wishlist" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_wishlist_name" ON "wishlist" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_wishlist_tenant_user" ON "wishlist" ("tenant_id","user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_wishlist_detail_wishlist_id" ON "wishlist_detail" ("wishlist_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_wishlist_detail_product_id" ON "wishlist_detail" ("product_id");