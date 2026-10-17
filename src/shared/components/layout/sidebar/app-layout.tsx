import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./app-sidebar";
import { FLUXTIVA_SIDEBAR_CONFIG } from "./sidebar-config";

type AppLayoutProps = {
  onLogout: () => void;
};

export function AppLayout({ onLogout }: AppLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f4f6fb" }}>
      <AppSidebar
        config={FLUXTIVA_SIDEBAR_CONFIG}
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        onItemClick={() => setMobileSidebarOpen(false)}
        onAction={(action) => {
          if (action === "logout") onLogout();
        }}
      />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          display: { xs: "block", md: "none" },
          color: "#242842",
          bgcolor: "rgba(255, 255, 255, 0.94)",
          borderBottom: "1px solid #eceef5",
          backdropFilter: "blur(14px)",
        }}
      >
        <Toolbar sx={{ minHeight: "62px !important" }}>
          <IconButton
            aria-label="Abrir navegação"
            onClick={() => setMobileSidebarOpen(true)}
            edge="start"
            sx={{ width: 42, height: 42, mr: 1.25, color: "#5f52bd" }}
          >
            <MenuRoundedIcon />
          </IconButton>
          <Typography
            component="span"
            sx={{
              fontFamily: 'Manrope, "DM Sans", sans-serif',
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: "-0.6px",
            }}
          >
            Fluxtiva
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          minHeight: "100vh",
          ml: { xs: 0, md: "264px" },
          pt: { xs: "62px", md: 0 },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
