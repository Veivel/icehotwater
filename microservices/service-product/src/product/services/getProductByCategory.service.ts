import { InternalServerErrorResponse } from "@src/shared/commons/patterns";
import { getProductByCategory } from "../dao/getProductByCategory.dao";

export const getProductByCategoryService = async (
    category_id: string,
    page = 1,
    size = 10
) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            return new InternalServerErrorResponse('Server Tenant ID not found').generate();
        }

        const offset = (page - 1) * size;
        const result = await getProductByCategory(SERVER_TENANT_ID, category_id, offset, size);

        return {
            data: {
                products: result.data,
                pagination: result.pagination
            },
            status: 200
        };
    } catch (err: any) {
        return new InternalServerErrorResponse(err).generate();
    }
};