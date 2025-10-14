import axios from "axios";

// Biến dùng để lưu dữ liệu categories sau khi tải về để tránh gọi API nhiều lần
let categoriesCache = null;

// Biến dùng để theo dõi Promise hiện tại nếu nhiều request đến cùng lúc (tránh gọi API trùng lặp)
let inFlightPromise = null;

/**
 * Hàm gọi API để lấy danh sách tất cả categories
 * - Sử dụng cache để không gọi lại API nếu đã có dữ liệu
 * - Nếu nhiều nơi gọi cùng lúc khi dữ liệu chưa có, chỉ gửi 1 request duy nhất
 */
export const getAllCategories = async () => {
  // ✅ Nếu đã có dữ liệu cache, trả về luôn (không gọi API)
  if (categoriesCache) return categoriesCache;

  // ✅ Nếu đang có request đang gửi đi (inFlightPromise chưa hoàn thành),
  //    trả về promise đó để các request khác chờ cùng kết quả
  if (inFlightPromise) return inFlightPromise;

  // ✅ Nếu chưa có cache và chưa có request nào đang chạy → bắt đầu gọi API
  inFlightPromise = axios
    .get("/api/v1/categories/get-all-categories") // gọi API
    .then((response) => {
      // Khi thành công → lấy dữ liệu từ response
      categoriesCache = response.data; // lưu lại vào cache
      return response.data; // trả về dữ liệu
    })
    .catch((error) => {
      // Nếu có lỗi khi gọi API → log ra console
      console.error("Error fetching categories:", error);
      throw error; // ném lỗi ra để nơi gọi có thể xử lý
    })
    .finally(() => {
      // Sau khi request hoàn tất (thành công hoặc thất bại)
      // reset inFlightPromise để lần sau có thể gọi lại API nếu cần
      inFlightPromise = null;
    });

  // ✅ Trả về promise để các request khác có thể chờ cùng kết quả
  return inFlightPromise;
};

/**
 * Hàm xóa cache thủ công
 * - Gọi hàm này nếu cần làm mới dữ liệu categories (ví dụ: admin thêm category mới)
 */
export const clearCategoriesCache = () => {
  categoriesCache = null;
};
