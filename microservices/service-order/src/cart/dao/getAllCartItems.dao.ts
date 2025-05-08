import { db } from "@src/db";
import { eq, and, sql } from "drizzle-orm";
import * as schema from '@db/schema/cart';
import { PaginationResult } from "@src/shared/types/pagination";
import { Cart } from "@db/schema/cart";

export const getAllCartItems = async (
    tenant_id: string,
    user_id: string,
    offset = 0,
    limit = 10
): Promise<PaginationResult<Cart>> => {
    // Get cart items with pagination
    const result = await db
        .select()
        .from(schema.cart)
        .where(and(
            eq(schema.cart.tenant_id, tenant_id),
            eq(schema.cart.user_id, user_id)
        ))
        .limit(limit)
        .offset(offset);

    // Get total count for pagination
    const countResult = await db
        .select({ count: sql`count(*)` })
        .from(schema.cart)
        .where(and(
            eq(schema.cart.tenant_id, tenant_id),
            eq(schema.cart.user_id, user_id)
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