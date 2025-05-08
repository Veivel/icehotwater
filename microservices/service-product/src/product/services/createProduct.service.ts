import { NewProduct } from "@db/schema/products";
import { InternalServerErrorResponse } from "@src/shared/commons/patterns";
import { createNewProduct } from "../dao/createNewProduct.dao";
import { deleteCacheByPattern } from "@src/shared/utils/redis"; // Import cache function

export const createProductService = async (
    name: string,
    description: string,
    price: number,
    quantity_available: number,
    category_id?: string,
) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            return new InternalServerErrorResponse('Server Tenant ID not found').generate()
        }

        const productData: NewProduct = {
            tenant_id: SERVER_TENANT_ID,
            name,
            description,
            price,
            quantity_available,
        }
        if (category_id) {
            productData.category_id = category_id;
        }

        const newProduct = await createNewProduct(productData)

        // Invalidate product caches
        await deleteCacheByPattern('/api/product*');

        return {
            data: newProduct,
            status: 201,
        }
    } catch (err: any) {
        return new InternalServerErrorResponse(err).generate()
    }
}