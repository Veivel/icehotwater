import { foreignKey, integer, pgTable, uuid, varchar, index } from "drizzle-orm/pg-core";
import { categories } from "./categories";

export const products = pgTable("products", {
  id: uuid('id').defaultRandom().primaryKey(),
  tenant_id: uuid('tenant_id').notNull(),
  name: varchar('name').notNull(),
  description: varchar('description'),
  price: integer('price').notNull(),
  quantity_available: integer('quantity_available').notNull(),
  category_id: uuid('category_id'),
}, (table) => {
  return {
    categoryReference: foreignKey({
      columns: [table.tenant_id, table.category_id],
      foreignColumns: [categories.tenant_id, categories.id],
      name: 'products_category_id_fkey',
    }),
    // Add indexes
    tenantIdx: index('idx_products_tenant_id').on(table.tenant_id),
    categoryIdx: index('idx_products_category_id').on(table.category_id),
    nameIdx: index('idx_products_name').on(table.name),
    tenantCategoryIdx: index('idx_products_tenant_category').on(table.tenant_id, table.category_id),
  }
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;