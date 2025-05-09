import { integer, pgTable, uuid, index } from "drizzle-orm/pg-core";

export const cart = pgTable('cart', {
    id: uuid('id').defaultRandom().primaryKey(),
    tenant_id: uuid('tenant_id').notNull(),
    user_id: uuid('user_id').notNull(),
    product_id: uuid('product_id').notNull(),
    quantity: integer('quantity').notNull(),
}, (table) => ({
    // Add indexes
    tenantIdx: index('idx_cart_tenant_id').on(table.tenant_id),
    userIdx: index('idx_cart_user_id').on(table.user_id),
    productIdx: index('idx_cart_product_id').on(table.product_id),
    tenantUserIdx: index('idx_cart_tenant_user').on(table.tenant_id, table.user_id),
}));

export type Cart = typeof cart.$inferSelect;
export type NewCart = typeof cart.$inferInsert;