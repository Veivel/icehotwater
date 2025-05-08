import { Request, Response, NextFunction } from "express";

export interface PaginationParams {
    page_number: number;
    page_size: number;
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
    const page_number = parseInt(req.query.page_number as string) || 1;
    const page_size = Math.min(parseInt(req.query.page_size as string) || 10, 100);

    // Calculate offset (0-based)
    const offset = (page_number - 1) * page_size;

    // Add pagination parameters to request object
    req.pagination = {
        page_number,
        page_size,
        offset
    };

    next();
};