import { createContext, useCallback, useEffect, useState } from "react";

export const AuthContext = createContext();

/**
 * Kiểm tra JWT còn hạn hay không bằng cách decode phần payload (base64).
 * Trả về true nếu token hợp lệ và chưa hết hạn.
 */
function isTokenValid(token) {
    if (!token) return false;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        // payload.exp là Unix timestamp (giây)
        return payload.exp * 1000 > Date.now();
    } catch {
        return false;
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    // loading để tránh flash redirect trước khi đọc xong localStorage
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        const savedRefreshToken = localStorage.getItem("refreshToken");
        const savedUser = localStorage.getItem("user");

        if (isTokenValid(savedToken)) {
            setToken(savedToken);
            setRefreshToken(savedRefreshToken);
            if (savedUser) {
                try {
                    setUser(JSON.parse(savedUser));
                } catch {
                    // dữ liệu user bị corrupt → bỏ qua
                }
            }
        } else if (savedRefreshToken) {
            // Access token hết hạn nhưng có refresh token → vẫn giữ refresh token
            // để axios interceptor có thể tự động refresh
            setRefreshToken(savedRefreshToken);
            if (savedUser) {
                try {
                    setUser(JSON.parse(savedUser));
                } catch {
                    // dữ liệu user bị corrupt → bỏ qua
                }
            }
        } else {
            // Không có token nào → dọn sạch
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
        }

        setLoading(false);
    }, []);

    const login = useCallback((accessToken, newRefreshToken, userData) => {
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        localStorage.setItem("user", JSON.stringify(userData));
        setToken(accessToken);
        setRefreshToken(newRefreshToken);
        setUser(userData);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        setToken(null);
        setRefreshToken(null);
        setUser(null);
    }, []);

    /**
     * Cập nhật tokens sau khi refresh thành công.
     * Được gọi từ axios interceptor.
     */
    const updateTokens = useCallback((newAccessToken, newRefreshToken) => {
        localStorage.setItem("token", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        setToken(newAccessToken);
        setRefreshToken(newRefreshToken);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                refreshToken,
                isAuthenticated: !!token || !!refreshToken,
                loading,
                login,
                logout,
                updateTokens,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}