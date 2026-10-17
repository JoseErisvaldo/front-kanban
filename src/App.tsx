import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LoginView, useAuthStore } from "./modules/root/pages/features/auth";
import { HomeView } from "./modules/root/pages/features/home";

function LoginRoute() {
  const session = useAuthStore((state) => state.session);

  return session ? <Navigate to="/home" replace /> : <LoginView />;
}

function ProtectedHomeRoute() {
  const session = useAuthStore((state) => state.session);

  return session ? <HomeView /> : <Navigate to="/" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginRoute />} />
        <Route path="/home" element={<ProtectedHomeRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
