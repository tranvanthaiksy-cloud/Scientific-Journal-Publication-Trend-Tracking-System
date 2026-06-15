import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// ─── Request Interceptor ─────────────────────────────────────────────────────
// Tự động gắn Authorization: Bearer <token> vào mọi request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ─── Response Interceptor — Auto Refresh Token ──────────────────────────────
// Khi nhận 401 → tự động gọi /auth/refresh → retry request gốc
// Nếu refresh cũng fail → logout và redirect /login

let isRefreshing = false;
let failedQueue = [];

/**
 * Xử lý hàng đợi các request bị fail trong lúc đang refresh token.
 * Khi refresh thành công, tất cả request trong queue sẽ được retry với token mới.
 * Khi refresh thất bại, tất cả sẽ bị reject.
 */
const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Bỏ qua nếu: không phải 401, hoặc là request login/refresh, hoặc đã retry rồi
        const isAuthRequest =
            originalRequest?.url?.includes("/auth/login") ||
            originalRequest?.url?.includes("/auth/refresh");

        if (error.response?.status !== 401 || isAuthRequest || originalRequest._retry) {
            return Promise.reject(error);
        }

        // Đánh dấu đã retry để tránh vòng lặp vô hạn
        originalRequest._retry = true;

        const refreshToken = localStorage.getItem("refreshToken");

        // Không có refresh token → logout ngay
        if (!refreshToken) {
            forceLogout();
            return Promise.reject(error);
        }

        // Nếu đang refresh → xếp request vào hàng đợi
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then((newToken) => {
                originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                return axiosInstance(originalRequest);
            });
        }

        isRefreshing = true;

        try {
            // Gọi refresh token endpoint
            // Dùng axios.create() mới để tránh interceptor loop
            const response = await axios.post(
                `${axiosInstance.defaults.baseURL}/auth/refresh`,
                { token: refreshToken },
                { headers: { "Content-Type": "application/json" } }
            );

            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.body;

            // Lưu token mới
            localStorage.setItem("token", newAccessToken);
            localStorage.setItem("refreshToken", newRefreshToken);

            // Cập nhật header cho request gốc
            originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

            // Xử lý các request đang chờ trong queue
            processQueue(null, newAccessToken);

            // Retry request gốc
            return axiosInstance(originalRequest);
        } catch (refreshError) {
            // Refresh thất bại → logout
            processQueue(refreshError, null);
            forceLogout();
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

/**
 * Xóa dữ liệu xác thực và redirect về trang login.
 * Dùng window.location.href để reset toàn bộ React state.
 */
function forceLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
}

export default axiosInstance;