import { db } from "@src/db";
import { and, eq, sql } from "drizzle-orm";
import * as schema from '@db/schema/products';
import { PaginationResult } from "@src/shared/types/pagination";
import { Product } from "@db/schema/products";

export const getProductByCategory = async (
    tenantId: string,
    category_id: string,
    offset = 0,
    limit = 10
): Promise<PaginationResult<Product>> => {
    // Get products with pagination
    const result = await db
        .select()
        .from(schema.products)
        .where(
            and(
                eq(schema.products.tenant_id, tenantId),
                eq(schema.products.category_id, category_id)
            )
        )
        .limit(limit)
        .offset(offset);

    // Get total count
    const countResult = await db
        .select({ count: sql`count(*)` })
        .from(schema.products)
        .where(
            and(
                eq(schema.products.tenant_id, tenantId),
                eq(schema.products.category_id, category_id)
            )
        );

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