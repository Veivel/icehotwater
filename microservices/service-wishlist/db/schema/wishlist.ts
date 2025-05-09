import { pgTable, text, uuid, index } from "drizzle-orm/pg-core";

export const wishlist = pgTable('wishlist', {
    id: uuid('id').defaultRandom().primaryKey(),
    tenant_id: uuid('tenant_id').notNull(),
    user_id: uuid('user_id').notNull(),
    name: text('name').notNull(),
}, (table) => ({
    // Add indexes
    tenantIdx: index('idx_wishlist_tenant_id').on(table.tenant_id),
    userIdx: index('idx_wishlist_user_id').on(table.user_id),
    nameIdx: index('idx_wishlist_name').on(table.name),
    tenantUserIdx: index('idx_wishlist_tenant_user').on(table.tenant_id, table.user_id),
}));

export type Wishlist = typeof wishlist.$inferSelect;
export type NewWishlist = typeof wishlist.$inferInsert;