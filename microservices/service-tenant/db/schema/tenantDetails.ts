import { pgTable, uuid, varchar, index } from "drizzle-orm/pg-core";
import { tenants } from "./tenants";

export const tenantDetails = pgTable('tenantDetails', {
    id: uuid('id').defaultRandom().primaryKey(),
    tenant_id: uuid('tenant_id').references(() => tenants.id, { onUpdate: 'cascade', onDelete: 'cascade' }).notNull(),
    name: varchar('name').notNull(),
}, (table) => ({
    // Add indexes
    tenantIdx: index('idx_tenant_details_tenant_id').on(table.tenant_id),
    nameIdx: index('idx_tenant_details_name').on(table.name),
}));

export type TenantDetail = typeof tenantDetails.$inferSelect;
export type NewTenantDetail = typeof tenantDetails.$inferInsert;