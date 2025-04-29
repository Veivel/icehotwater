import { NewProduct } from "@db/schema/products";
import { InternalServerErrorResponse, NotFoundResponse } from "@src/shared/commons/patterns";
import { createNewProduct } from "../dao/createNewProduct.dao";
import { getCategoryById } from "../dao/getCategoryById.dao";

export const createProductServiceV2 = async (
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

        // if category was supplied, make sure it exists
        if (Boolean(category_id)) {
            const categories = await getCategoryById(SERVER_TENANT_ID, String(category_id))
            if (categories.length == 0) {
                return new NotFoundResponse("Category id not found").generate();
            }
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

        return {
            data: newProduct,
            status: 201,
        }
    } catch (err: any) {
        return new InternalServerErrorResponse(err).generate()
    }
}