import { db } from "@src/db";
import { eq, sql } from "drizzle-orm";
import * as schema from '@db/schema/categories';
import { PaginationResult } from "@src/shared/types/pagination";
import { Category } from "@db/schema/categories";

export const getAllCategoriesByTenantId = async (
    tenantId: string,
    offset = 0,
    limit = 10
): Promise<PaginationResult<Category>> => {
    // Get categories with pagination
    const result = await db
        .select()
        .from(schema.categories)
        .where(eq(schema.categories.tenant_id, tenantId))
        .limit(limit)
        .offset(offset);

    // Get total count for pagination
    const countResult = await db
        .select({ count: sql`count(*)` })
        .from(schema.categories)
        .where(eq(schema.categories.tenant_id, tenantId));

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