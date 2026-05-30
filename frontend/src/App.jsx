import { BrowserRouter, Routes, Route } from "react-router-dom";

function HomePage() {
  return <h1>Hello World</h1>;
}

function LoginPage() {
  return <h1>Login Page</h1>;
}

function DashboardPage() {
  return <h1>Dashboard Page</h1>;
}

function NotFoundPage() {
  return <h1>404 Not Found</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;