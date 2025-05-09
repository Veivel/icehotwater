import { db } from "@src/db";
import { eq, and } from "drizzle-orm";
import * as schema from '@db/schema/wishlist';

export const getWishlistById = async (
    tenant_id: string,
    id: string,
) => {
    const result = await db
        .select()
        .from(schema.wishlist)
        .where(and(
            eq(schema.wishlist.tenant_id, tenant_id),
            eq(schema.wishlist.id, id)
        ))
        .limit(1) // Add limit since we only need one result
    return result?.[0];
}