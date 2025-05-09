import { db } from "@src/db";
import { and, eq, sql, desc } from "drizzle-orm";
import * as schema from "@db/schema/order";
import { PaginationResult } from "@src/shared/types/pagination";
import { Order } from "@db/schema/order";

export const getAllOrders = async (
    tenant_id: string,
    user_id: string,
    offset = 0,
    limit = 10
): Promise<PaginationResult<Order>> => {
    const result = await db
        .select()
        .from(schema.order)
        .where(and(
            eq(schema.order.tenant_id, tenant_id),
            eq(schema.order.user_id, user_id),
        ))
        .orderBy(desc(schema.order.order_date))
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
            page_number: Math.floor(offset / limit) + 1,
            page_size: limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};