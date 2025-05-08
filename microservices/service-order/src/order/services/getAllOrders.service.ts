import { InternalServerErrorResponse } from "@src/shared/commons/patterns";
import { getAllOrders } from "../dao/getAllOrders.dao";
import { User } from "@src/shared/types";

export const getAllOrdersService = async (
    user: User,
    page = 1,
    size = 10
) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            throw new Error("SERVER_TENANT_ID is not defined");
        }

        if (!user.id) {
            return new InternalServerErrorResponse("User ID is not defined").generate();
        }

        const offset = (page - 1) * size;
        const result = await getAllOrders(SERVER_TENANT_ID, user.id, offset, size);

        return {
            data: {
                orders: result.data,
                pagination: result.pagination
            },
            status: 200,
        };
    } catch (err: any) {
        return new InternalServerErrorResponse(err).generate();
    }
};