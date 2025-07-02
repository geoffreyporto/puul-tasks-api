import { PaginatedResult } from '../interfaces/paginated-result.interface';
export declare class PaginationHelper {
    static createPaginatedResult<T>(data: T[], total: number, page: number, limit: number): PaginatedResult<T>;
}
