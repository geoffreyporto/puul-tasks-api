"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationHelper = void 0;
class PaginationHelper {
    static createPaginatedResult(data, total, page, limit) {
        const totalPages = Math.ceil(total / limit);
        return {
            data,
            total,
            page,
            limit,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
        };
    }
}
exports.PaginationHelper = PaginationHelper;
//# sourceMappingURL=pagination.helper.js.map