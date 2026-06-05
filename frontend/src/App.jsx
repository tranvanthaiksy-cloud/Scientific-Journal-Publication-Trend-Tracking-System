import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
      <div className="dashboard">
        <h1>Dashboard</h1>

        <button
            className="logout-btn"
            onClick={handleLogout}
        >
          Logout
        </button>
      </div>
  );
}

function App() {
  const token = localStorage.getItem("token");

  return (
      <BrowserRouter>
        <Routes>
          <Route
              path="/"
              element={
                token
                    ? <Navigate to="/dashboard" />
                    : <Navigate to="/login" />
              }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;