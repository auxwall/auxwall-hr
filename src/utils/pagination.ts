export const getPagination = (page: any, size: any) => {
    const limit = size ? +size : 10;
    const offset = page ? (page - 1) * limit : 0;
    return { limit, offset };
}

export const getPaginationResponse = (data: any, page: any, limit: number) => {
    const { count: totalItems, rows: items } = data;
    const currentPage = page ? +page : 1;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, items, totalPages, currentPage };
}
