import { db } from "@src/db";
import { eq, and } from "drizzle-orm";
import * as schema from "@db/schema/order";

export const getOrderByIdOnly = async (
    order_id: string
) => {
    const result = await db
        .select()
        .from(schema.order)
        .where(
            eq(schema.order.id, order_id)
        )
    return result[0];
}