import { integer, pgTable, uuid, index } from "drizzle-orm/pg-core";
import { order } from "./order";

export const orderDetail = pgTable('order_detail', {
    id: uuid('id').defaultRandom().primaryKey(),
    tenant_id: uuid('tenant_id').notNull(),
    order_id: uuid('order_id').notNull().references(() => order.id),
    product_id: uuid('product_id').notNull(),
    quantity: integer('quantity').notNull(),
    unit_price: integer('unit_price').notNull(),
}, (table) => ({
    // Add indexes
    tenantIdx: index('idx_order_detail_tenant_id').on(table.tenant_id),
    orderIdx: index('idx_order_detail_order_id').on(table.order_id),
    productIdx: index('idx_order_detail_product_id').on(table.product_id),
}));

export type OrderDetail = typeof orderDetail.$inferSelect;
export type NewOrderDetail = typeof orderDetail.$inferInsert;