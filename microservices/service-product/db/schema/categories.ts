import { pgTable, primaryKey, uuid, varchar, index } from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
    id: uuid('id').defaultRandom(),
    name: varchar('name').notNull(),
    tenant_id: uuid('tenant_id').notNull(),
}, (table) => {
    return {
        pk: primaryKey({ columns: [table.id, table.tenant_id] }),
        // Add indexes
        tenantIdx: index('idx_categories_tenant_id').on(table.tenant_id),
        nameIdx: index('idx_categories_name').on(table.name),
    }
});

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;