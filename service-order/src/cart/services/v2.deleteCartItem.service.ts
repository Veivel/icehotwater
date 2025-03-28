import { InternalServerErrorResponse, NotFoundResponse } from "@src/shared/commons/patterns";
import { User } from "@src/shared/types";
import { deleteCartItemByProductId } from "../dao/deleteCartItemByProductId.dao";
import { getCartItemsByProductId } from "../dao/getCartItemsByProductId.dao";

export const deleteCartItemServiceV2 = async (
    user: User,
    product_id: string,
) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            return new InternalServerErrorResponse('Tenant ID not found').generate();
        }

        if (!user.id) {
            return new NotFoundResponse('User not found').generate();
        }

        // check if product id exists in cart
        const currentCart = await getCartItemsByProductId(SERVER_TENANT_ID, user.id, product_id)
        if (currentCart.length == 0) {
            return new NotFoundResponse("Product ID not found in cart").generate();
        }

        const cart = await deleteCartItemByProductId(SERVER_TENANT_ID, user.id, product_id);

        return {
            data: cart,
            status: 200,
        }
    } catch (err: any) {
        return new InternalServerErrorResponse(err).generate();
    }
}