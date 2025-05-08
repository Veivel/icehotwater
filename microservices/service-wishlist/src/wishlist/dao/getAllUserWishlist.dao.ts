import { db } from "@src/db";
import { eq, and, sql } from "drizzle-orm";
import * as schema from '@db/schema/wishlist';
import { PaginationResult } from "@src/shared/types/pagination";
import { Wishlist } from "@db/schema/wishlist";

export const getAllUserWishlist = async (
    tenant_id: string,
    user_id: string,
    offset = 0,
    limit = 10
): Promise<PaginationResult<Wishlist>> => {
    // Get wishlist items with pagination
    const result = await db
        .select()
        .from(schema.wishlist)
        .where(and(
            eq(schema.wishlist.tenant_id, tenant_id),
            eq(schema.wishlist.user_id, user_id)
        ))
        .limit(limit)
        .offset(offset);

    // Get total count for pagination
    const countResult = await db
        .select({ count: sql`count(*)` })
        .from(schema.wishlist)
        .where(and(
            eq(schema.wishlist.tenant_id, tenant_id),
            eq(schema.wishlist.user_id, user_id)
        ));

    const total = Number(countResult[0].count);

    return {
        data: result,
        pagination: {
            total,
            page: Math.floor(offset / limit) + 1,
            size: limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};