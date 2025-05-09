import { pgTable, uuid, index } from "drizzle-orm/pg-core";

export const tenants = pgTable('tenants', {
    id: uuid('id').defaultRandom().primaryKey(),
    owner_id: uuid('owner_id').notNull(),
}, (table) => ({
    // Add index
    ownerIdx: index('idx_tenants_owner_id').on(table.owner_id),
}));

export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;