// import { db } from "@src/db";
// import { eq, and } from "drizzle-orm";
// import * as schema from '@db/schema/products'

// export const getProductById = async (tenantId: string, id: string) => {
//     const result = await db
//         .select()
//         .from(schema.products)
//         .where(
//             and(
//                 eq(schema.products.tenant_id, tenantId),
//                 eq(schema.products.id, id)
//             )
//         )
//     return result?.[0];
// }

import { db } from "@src/db";
import { and, eq } from "drizzle-orm";
import * as schema from '@db/schema/categories'

export const getCategoryById = async (tenantId: string, categoryId: string) => {
    const result = await db
        .select()
        .from(schema.categories)
        .where(and(
            eq(schema.categories.tenant_id, tenantId),
            eq(schema.categories.id, categoryId)
        ))
    return result;
}