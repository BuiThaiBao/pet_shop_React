import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { apiFetch as baseApiFetch } from "../utils/api";
import { useToast } from "./ToastContext";
import { jwtDecode } from "jwt-decode";

// Tạo context để chia sẻ trạng thái đăng nhập giữa các component
const AuthContext = createContext();

// Hook tiện dụng để sử dụng AuthContext trong component khác
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

// Component cung cấp dữ liệu đăng nhập cho toàn ứng dụng
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // Lưu thông tin user (email, name,...)
  const [loading, setLoading] = useState(false); // Trạng thái loading khi login/register
  const [token, setToken] = useState(null);      // Token JWT hiện tại
  const { showToast } = useToast();              // Hiển thị thông báo toast

  // --- 1️⃣ Khi trang load lên: lấy dữ liệu từ localStorage ---
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");

    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        const exp = decoded.exp * 1000; // JWT exp là tính theo giây → nhân 1000 để ra mili
        const now = Date.now();

        // Nếu token còn hạn ít nhất 10 giây thì dùng được
        if (exp - now > 10 * 1000) {
          setToken(storedToken);
          scheduleTokenRefresh(storedToken); // lên lịch tự refresh token
        } else {
          // Token hết hạn rồi → gọi refresh ngay
          console.log("⚠️ Token expired, trying to refresh immediately...");
          refreshToken();
        }
      } catch (err) {
        // Token không hợp lệ → đăng xuất
        console.error("Invalid token on startup, logging out...");
        logout();
      }
    }

    // Khôi phục thông tin user từ localStorage (nếu có)
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("auth_user");
      }
    }
  }, []);

  // --- 2️⃣ Hàm login ---
  const login = async (email, password) => {
    setLoading(true);
    try {
      // Gọi API đăng nhập
      const response = await baseApiFetch("/v1/auth/login", {
        method: "POST",
        body: { identifier: email, password }, // body gửi đi
      });

      // API trả về { result: { token, authenticated }, success, message }
      const receivedToken = response?.result?.token;
      const authenticated = response?.result?.authenticated;

      // Nếu không có token hoặc login sai → báo lỗi
      if (!receivedToken || authenticated === false) {
        throw new Error("Email hoặc mật khẩu không đúng");
      }

      // Lưu token vào state + localStorage
      setToken(receivedToken);
      localStorage.setItem("auth_token", receivedToken);
      scheduleTokenRefresh(receivedToken); // đặt lịch refresh token

      // Sau khi login thành công → lấy thông tin chi tiết của user
      try {
        const loaded = await loadMyInfo(receivedToken);
        return loaded;
      } catch (e) {
        // Nếu không load được, chỉ lưu lại email đơn giản
        const nextUser = { email };
        setUser(nextUser);
        localStorage.setItem("auth_user", JSON.stringify(nextUser));
        return nextUser;
      }
    } finally {
      setLoading(false);
    }
  };

  // --- 3️⃣ Hàm logout ---
  const logout = async () => {
  try {
    if (token) {
      // Gửi request logout kèm token hiện tại
      await baseApiFetch("/v1/auth/logout", {
        method: "POST",
        body: { token } // gửi Bearer token trong body
      });
    }
  } catch (err) {
    console.warn("⚠️ Logout API failed (có thể token đã hết hạn):", err.message);
  } finally {
    // Dù API fail vẫn xóa local để tránh bị kẹt
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    showToast("Đăng xuất thành công", "success");
  }
};


  // --- 4️⃣ Hàm register (giả lập, có thể đổi sang API thật) ---
  const register = async (userData) => {
    setLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Registering user:", userData);
        setLoading(false);
        resolve({
          id: Date.now(),
          ...userData,
        });
      }, 1000);
    });
  };

  // --- 5️⃣ Đặt lịch refresh token ---
  const scheduleTokenRefresh = useCallback(
    (tokenToUse) => {
      try {
        const decoded = jwtDecode(tokenToUse);
        const exp = decoded.exp * 1000;
        const now = Date.now();

        // Tự refresh token trước khi nó hết hạn 1 phút
        const refreshTime = exp - now - 60 * 1000;

        if (refreshTime > 0) {
          console.log(
            `⏰ Will refresh token in ${Math.round(refreshTime / 1000)} seconds`
          );

          // Đặt hẹn giờ để gọi API refresh
          setTimeout(async () => {
            await refreshToken();
          }, refreshTime);
        }
      } catch (err) {
        console.error("Cannot decode token", err);
      }
    },
    []
  );

  // --- 6️⃣ Hàm refresh token ---
  const refreshToken = useCallback(async () => {
    // Lấy token hiện tại từ localStorage (tránh trường hợp token cũ trong state)
    const currentToken = localStorage.getItem("auth_token");
    if (!currentToken) return null;

    try {
      // Gọi API refresh token
      const res = await baseApiFetch("/v1/auth/refresh-token", {
        method: "POST",
        body: { token: currentToken },
      });

      const newToken = res?.result?.token;
      if (newToken) {
        // Cập nhật token mới
        setToken(newToken);
        localStorage.setItem("auth_token", newToken);

        // Đặt lại lịch refresh cho token mới
        scheduleTokenRefresh(newToken);

        console.log("✅ Token refreshed successfully");
        return newToken;
      }
    } catch (err) {
      console.error("❌ Refresh token failed", err);
      logout(); // Nếu refresh thất bại → logout luôn
    }
    return null;
  }, [logout, scheduleTokenRefresh]);

  // --- 7️⃣ Hàm gọi API có tự động gắn token ---
  const apiFetch = useCallback(
    (path, options = {}) => {
      return baseApiFetch(path, {
        ...options,
        token,
        onTokenRefresh: refreshToken, // nếu token hết hạn, tự gọi refresh
      });
    },
    [token, refreshToken]
  );

  // --- 8️⃣ Hàm load thông tin user hiện tại ---
  const loadMyInfo = useCallback(
    async (overrideToken) => {
      const useToken = overrideToken || token;
      if (!useToken) throw new Error("No auth token");

      // Gọi API /v1/users/myInfo
      const res = await baseApiFetch("/v1/users/myInfo", { token: useToken });
      const userData = res?.result || res;

      // Nếu có dữ liệu → lưu vào state + localStorage
      if (userData) {
        setUser(userData);
        localStorage.setItem("auth_user", JSON.stringify(userData));
      }
      return userData;
    },
    [token]
  );

  // --- 9️⃣ Khi có token mà chưa có user → tự load user info ---
  useEffect(() => {
    if (token && !user) {
      loadMyInfo().catch(() => {
        // Nếu token không hợp lệ → xóa
        setToken(null);
        localStorage.removeItem("auth_token");
      });
    }
  }, [token, user, loadMyInfo]);

  // --- 🔟 Cung cấp toàn bộ giá trị ra ngoài context ---
  const value = {
    user,
    loading,
    token,
    login,
    logout,
    register,
    apiFetch,
    loadMyInfo,
  };

  // Bao toàn bộ app trong AuthContext
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
