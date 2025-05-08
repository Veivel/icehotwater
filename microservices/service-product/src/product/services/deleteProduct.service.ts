import { InternalServerErrorResponse } from "@src/shared/commons/patterns"
import { deleteProductById } from "../dao/deleteProductById.dao";
import {deleteCacheByPattern} from "@src/shared/utils/redis";

export const deleteProductService = async (
    id: string,
) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            return new InternalServerErrorResponse('Server Tenant ID not found').generate();
        }

        const product = await deleteProductById(SERVER_TENANT_ID, id);

        // Invalidate product caches
        await deleteCacheByPattern('/api/product*');

        return {
            data: {
                ...product,
            },
            status: 200,
        }
    } catch (err: any) {
        return new InternalServerErrorResponse(err).generate();
    }
}