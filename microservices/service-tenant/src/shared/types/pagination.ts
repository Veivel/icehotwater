export interface PaginationResult<T> {
    data: T[];
    pagination: {
        total: number;
        page_number: number;
        page_size: number;
        totalPages: number;
    };
}