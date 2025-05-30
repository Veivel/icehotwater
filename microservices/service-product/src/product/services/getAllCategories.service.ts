import { InternalServerErrorResponse } from "@src/shared/commons/patterns";
import { getAllCategoriesByTenantId } from "../dao/getAllCategoriesByTenantId.dao";

export const getAllCategoriesService = async (
    page = 1,
    size = 10
) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            return new InternalServerErrorResponse('Server Tenant ID not found').generate();
        }

        const offset = (page - 1) * size;
        const result = await getAllCategoriesByTenantId(SERVER_TENANT_ID, offset, size);

        return {
            data: {
                categories: result.data,
                pagination: result.pagination
            },
            status: 200
        };
    } catch (err: any) {
        return new InternalServerErrorResponse(err).generate();
    }
};