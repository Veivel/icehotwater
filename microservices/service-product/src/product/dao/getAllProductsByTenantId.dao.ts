import { db } from "@src/db";
import { eq, sql } from "drizzle-orm";
import * as schema from '@db/schema/products';
import { PaginationResult } from "@src/shared/types/pagination";
import { Product } from "@db/schema/products";

export const getAllProductsByTenantId = async (
    tenantId: string,
    offset = 0,
    limit = 10
): Promise<PaginationResult<Product>> => {
    // Get products with pagination
    const result = await db
        .select()
        .from(schema.products)
        .where(eq(schema.products.tenant_id, tenantId))
        .limit(limit)
        .offset(offset);

    // Get total count for pagination
    const countResult = await db
        .select({ count: sql`count(*)` })
        .from(schema.products)
        .where(eq(schema.products.tenant_id, tenantId));

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