import { InternalServerErrorResponse, NotFoundResponse } from "@src/shared/commons/patterns";
import { getAllUserWishlist } from "../dao/getAllUserWishlist.dao";
import { User } from "@src/shared/types";

export const getAllUserWishlistService = async (
    user: User,
    page = 1,
    size = 10
) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            return new InternalServerErrorResponse('Server tenant ID is missing').generate();
        }

        if (!user.id) {
            return new NotFoundResponse('User ID is missing').generate();
        }

        const offset = (page - 1) * size;
        const result = await getAllUserWishlist(SERVER_TENANT_ID, user.id, offset, size);

        return {
            data: {
                wishlists: result.data,
                pagination: result.pagination
            },
            status: 200,
        };
    } catch (err: any) {
        return new InternalServerErrorResponse(err).generate();
    }
};