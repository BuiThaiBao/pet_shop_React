import { apiFetch } from "../utils/api";

export const productsApi = {
  // Lấy danh sách products với phân trang và filter
  getProducts: async (params = {}) => {
    const queryParams = new URLSearchParams({
      pageNumber: params.pageNumber || 1,
      size: params.size || 10,
      ...(params.categoryId && { categoryId: params.categoryId }),
      ...(params.minPrice && { minPrice: params.minPrice }),
      ...(params.maxPrice && { maxPrice: params.maxPrice }),
      ...(params.search && { search: params.search }),
      ...(params.sort && { sort: params.sort }),
    }).toString();
    return await apiFetch(`/v1/products?${queryParams}`);
  },

  // Lấy chi tiết 1 product
  getProductById: async (id) => {
    return await apiFetch(`/v1/products/${id}`);
  },
};
