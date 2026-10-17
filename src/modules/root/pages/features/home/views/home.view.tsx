import { Button, Paper, Typography } from "@mui/material";
import { useAuthStore } from "../../auth";
import "../home.css";

export function HomeView() {
  const clearSession = useAuthStore((state) => state.clearSession);

  return (
    <main className="home-page">
      <Paper className="home-card" elevation={0}>
        <div className="home-brand">
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </span>
          Fluxtiva
        </div>
        <Typography component="p" className="home-eyebrow">
          SEU ESPAÇO DE TRABALHO
        </Typography>
        <Typography component="h1" variant="h3" className="home-title">
          Bem-vindo à Fluxtiva
        </Typography>
        <Typography component="p" className="home-description">
          Seu login foi realizado e a sessão está salva neste dispositivo.
        </Typography>
        <Button
          variant="outlined"
          onClick={() => {
            clearSession();
          }}
        >
          Sair da conta
        </Button>
      </Paper>
    </main>
  );
}
