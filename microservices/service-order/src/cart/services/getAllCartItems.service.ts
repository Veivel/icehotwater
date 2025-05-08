import { InternalServerErrorResponse, NotFoundResponse } from "@src/shared/commons/patterns";
import { getAllCartItems } from "../dao/getAllCartItems.dao";
import { User } from "@src/shared/types";

export const getAllCartItemsService = async (
    user: User,
    page = 1,
    size = 10
) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            return new InternalServerErrorResponse('Tenant ID not found').generate();
        }

        if (!user.id) {
            return new NotFoundResponse('User not found').generate();
        }

        const offset = (page - 1) * size;
        const result = await getAllCartItems(SERVER_TENANT_ID, user.id, offset, size);

        return {
            data: {
                items: result.data,
                pagination: result.pagination
            },
            status: 200,
        };
    } catch (err: any) {
        console.log("new error, pls see:", err);
        return new InternalServerErrorResponse(err).generate();
    }
};