import { InternalServerErrorResponse, NotFoundResponse } from "@src/shared/commons/patterns";
import { getAllCartItems } from "../dao/getAllCartItems.dao";
import { User } from "@src/shared/types";

export const getAllCartItemsService = async (
    user: User,
) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            return new InternalServerErrorResponse('Tenant ID not found').generate();
        }

        if (!user.id) {
            return new NotFoundResponse('User not found').generate();
        }

        const items = await getAllCartItems(SERVER_TENANT_ID, user.id);

        return {
            data: items,
            status: 200,
        }
    } catch (err: any) {
        console.log("new error, pls see:", err)
        return new InternalServerErrorResponse(err).generate();
    }
}