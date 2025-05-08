import { db } from "@src/db";
import { and, eq, sql } from "drizzle-orm";
import * as schema from "@db/schema/order";
import { PaginationResult } from "@src/shared/types/pagination";
import { Order } from "@db/schema/order";

export const getAllOrders = async (
    tenant_id: string,
    user_id: string,
    offset = 0,
    limit = 10
): Promise<PaginationResult<Order>> => {
    // Get orders with pagination
    const result = await db
        .select()
        .from(schema.order)
        .where(and(
            eq(schema.order.tenant_id, tenant_id),
            eq(schema.order.user_id, user_id),
        ))
        .limit(limit)
        .offset(offset);

    // Get total count for pagination
    const countResult = await db
        .select({ count: sql`count(*)` })
        .from(schema.order)
        .where(and(
            eq(schema.order.tenant_id, tenant_id),
            eq(schema.order.user_id, user_id),
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