import { apiFetch } from "../utils/api";

export const categoriesApi = {
  // Lấy danh sách categories
  getCategories: async () => {
    return await apiFetch("/v1/categories");
  },
};
