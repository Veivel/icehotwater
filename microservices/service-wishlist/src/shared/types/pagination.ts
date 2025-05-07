export interface PaginationResult<T> {
    data: T[];
    pagination: {
        total: number;
        page: number;
        size: number;
        totalPages: number;
    };
}