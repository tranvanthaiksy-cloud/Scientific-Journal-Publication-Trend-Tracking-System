import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function ProtectedRoute({
                            children,
                            role,
                        }) {
    const { isAuthenticated, user } =
        useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (
        role &&
        user?.role !== role
    ) {
        return (
            <div
                style={{
                    textAlign: "center",
                    marginTop: "100px",
                }}
            >
                <h1>403</h1>
                <p>
                    Bạn không có quyền truy cập
                </p>
            </div>
        );
    }

    return children;
}

export default ProtectedRoute;