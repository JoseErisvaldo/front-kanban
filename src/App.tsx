import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { LoginView } from "./modules/root/pages/features/auth";
import { HomeView } from "./modules/root/pages/features/home";
import { NotFoundView } from "./modules/root/pages/features/not-found";
import { ProjectsView } from "./modules/root/pages/features/projects";
import { AppLayout } from "./shared/components/layout";
import { useAuthStore } from "./shared/store";

function LoginRoute() {
  const session = useAuthStore((state) => state.session);

  return session ? <Navigate to="/home" replace /> : <LoginView />;
}

function ProtectedHomeRoute() {
  const session = useAuthStore((state) => state.session);

  if (!session) return <Navigate to="/" replace />;

  return <Outlet />;
}

function AuthenticatedLayout() {
  const clearSession = useAuthStore((state) => state.clearSession);

  return (
    <AppLayout
      onLogout={() => {
        clearSession();
      }}
    />
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginRoute />} />
        <Route element={<ProtectedHomeRoute />}>
          <Route element={<AuthenticatedLayout />}>
            <Route path="/home" element={<HomeView />} />
            <Route path="/projects" element={<ProjectsView />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
