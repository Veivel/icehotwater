import { pgTable, uuid, index } from "drizzle-orm/pg-core";
import { wishlist } from "./wishlist";

export const wishlistDetail = pgTable('wishlist_detail', {
    id: uuid('id').defaultRandom().primaryKey(),
    wishlist_id: uuid('wishlist_id').notNull().references(() => wishlist.id),
    product_id: uuid('product_id').notNull(),
}, (table) => ({
    // Add indexes
    wishlistIdx: index('idx_wishlist_detail_wishlist_id').on(table.wishlist_id),
    productIdx: index('idx_wishlist_detail_product_id').on(table.product_id),
}));

export type WishlistDetail = typeof wishlistDetail.$inferSelect;
export type NewWishlistDetail = typeof wishlistDetail.$inferInsert;