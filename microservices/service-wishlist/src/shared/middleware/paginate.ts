import { Request, Response, NextFunction } from "express";

export interface PaginationParams {
    page: number;
    size: number;
    offset: number;
}

declare global {
    namespace Express {
        interface Request {
            pagination: PaginationParams;
        }
    }
}

export const paginate = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Get page and size from query parameters
    const page = parseInt(req.query.page as string) || 1;
    const size = Math.min(parseInt(req.query.size as string) || 10, 100);

    // Calculate offset (0-based)
    const offset = (page - 1) * size;

    // Add pagination parameters to request object
    req.pagination = {
        page,
        size,
        offset
    };

    next();
};