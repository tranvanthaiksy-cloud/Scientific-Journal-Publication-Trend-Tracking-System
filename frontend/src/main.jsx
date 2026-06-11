import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import "./index.css";

import { AuthProvider } from "./context/AuthContext.jsx";

// StrictMode đã bị bỏ vì nó khiến useEffect chạy 2 lần trong môi trường dev,
// gây ra race condition với auth redirect logic.
createRoot(document.getElementById("root")).render(
    <AuthProvider>
        <App />
    </AuthProvider>
);