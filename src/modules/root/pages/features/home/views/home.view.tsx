import {
  AppBar,
  Box,
  IconButton,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppSidebar,
  FLUXTIVA_SIDEBAR_CONFIG,
} from "../../../../../../shared/components/layout";
import { useAuthStore } from "../../auth";

function MenuGlyph() {
  return (
    <Box
      component="svg"
      aria-hidden="true"
      viewBox="0 0 24 24"
      sx={{ width: 22, height: 22 }}
    >
      <path
        d="M4 7h16M4 12h16M4 17h16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Box>
  );
}

function BrandMark() {
  return (
    <Box
      aria-hidden="true"
      sx={{
        width: 30,
        height: 30,
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gridTemplateRows: "repeat(2, 1fr)",
        gap: "3px",
        p: "3px",
        overflow: "hidden",
        border: "1px solid",
        borderColor: "rgba(116, 99, 232, 0.2)",
        borderRadius: "10px",
        background: "linear-gradient(145deg, #8979ff, #6955e8)",
        boxShadow: "0 5px 15px rgba(91, 75, 222, 0.2)",
        transform: "rotate(-5deg)",
        "& > span": { borderRadius: "2px", bgcolor: "#fff" },
        "& > span:nth-of-type(2), & > span:nth-of-type(3)": { opacity: 0.68 },
        "& > span:nth-of-type(4)": { bgcolor: "#c9c3ff" },
      }}
    >
      <Box component="span" />
      <Box component="span" />
      <Box component="span" />
      <Box component="span" />
    </Box>
  );
}

export function HomeView() {
  const clearSession = useAuthStore((state) => state.clearSession);
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  function handleLogout() {
    clearSession();
    void navigate("/", { replace: true });
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f4f6fb" }}>
      <AppSidebar
        config={FLUXTIVA_SIDEBAR_CONFIG}
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        onItemClick={() => setMobileSidebarOpen(false)}
        onAction={(action) => {
          if (action === "logout") handleLogout();
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
            <MenuGlyph />
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
          display: "grid",
          placeItems: "center",
          ml: { xs: 0, md: "264px" },
          p: { xs: "84px 20px 32px", sm: "84px 5vw 32px", md: "5vw" },
          background:
            "radial-gradient(circle at 10% 90%, rgba(111, 92, 231, 0.1), transparent 26%), #f4f6fb",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "min(100%, 680px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 2.5,
            p: { xs: 3.5, sm: 6, md: 8 },
            border: "1px solid #e8eaf2",
            borderRadius: "24px",
            bgcolor: "#fff",
            boxShadow: "0 24px 70px rgba(35, 43, 77, 0.09)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <BrandMark />
            <Typography
              component="span"
              sx={{
                color: "#242842",
                fontFamily: 'Manrope, "DM Sans", sans-serif',
                fontSize: 20,
                fontWeight: 800,
              }}
            >
              Fluxtiva
            </Typography>
          </Box>
          <Typography
            component="p"
            sx={{
              mt: 2.25,
              mb: -1,
              color: "#7463e8",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "1.4px",
            }}
          >
            SEU ESPAÇO DE TRABALHO
          </Typography>
          <Typography
            component="h1"
            variant="h3"
            sx={{
              color: "#20243a",
              fontSize: "clamp(30px, 5vw, 46px)",
              fontWeight: 700,
              letterSpacing: "-1.7px",
            }}
          >
            Bem-vindo à Fluxtiva
          </Typography>
          <Typography
            component="p"
            sx={{
              mt: -1.25,
              mb: 1.25,
              color: "#777d91",
              fontSize: 15,
              lineHeight: 1.7,
            }}
          >
            Seu espaço está pronto. Organize suas tarefas e acompanhe o
            progresso do time em um só lugar.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}
