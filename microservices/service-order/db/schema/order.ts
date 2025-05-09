import { integer, pgEnum, pgTable, text, timestamp, uuid, index } from "drizzle-orm/pg-core";

export const orderStatusEnum = pgEnum('order_status', ['PENDING', 'PAID', 'CANCELLED', 'REFUNDED']);
export const shippingProviderEnum = pgEnum('shipping_provider', ['JNE', 'TIKI', 'SICEPAT', 'GOSEND', 'GRAB_EXPRESS']);
export const shippingStatusEnum = pgEnum('shipping_status', ['PENDING', 'SHIPPED', 'DELIVERED', 'RETURNED']);

export const order = pgTable('order', {
    id: uuid('id').defaultRandom().primaryKey(),
    tenant_id: uuid('tenant_id').notNull(),
    user_id: uuid('user_id').notNull(),
    order_date: timestamp('order_date', { withTimezone: true }).defaultNow(),
    total_amount: integer('total_amount').notNull(),
    order_status: orderStatusEnum('order_status').default('PENDING').notNull(),
    shipping_provider: shippingProviderEnum('shipping_provider').notNull(),
    shipping_code: text('shipping_code'),
    shipping_status: shippingStatusEnum('shipping_status'),
}, (table) => ({
    // Add indexes
    tenantIdx: index('idx_order_tenant_id').on(table.tenant_id),
    userIdx: index('idx_order_user_id').on(table.user_id),
    statusIdx: index('idx_order_status').on(table.order_status),
    dateIdx: index('idx_order_date').on(table.order_date),
    tenantUserIdx: index('idx_order_tenant_user').on(table.tenant_id, table.user_id),
}));

export type Order = typeof order.$inferSelect;
export type NewOrder = typeof order.$inferInsert;