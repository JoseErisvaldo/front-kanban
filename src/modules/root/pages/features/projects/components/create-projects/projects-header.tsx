import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Box, Button, Typography } from "@mui/material";

type ProjectsHeaderProps = {
  onCreateClick: () => void;
};

export function ProjectsHeader({ onCreateClick }: ProjectsHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "stretch", sm: "center" },
        justifyContent: "space-between",
        gap: 2.5,
      }}
    >
      <Box>
        <Typography
          component="p"
          sx={{
            color: "#7463e8",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "1.4px",
          }}
        >
          ESPAÇO DE TRABALHO
        </Typography>
        <Typography
          component="h1"
          sx={{
            mt: 1,
            color: "#20243a",
            fontFamily: 'Manrope, "DM Sans", sans-serif',
            fontSize: "clamp(30px, 4vw, 40px)",
            fontWeight: 700,
            letterSpacing: "-1.6px",
          }}
        >
          Projetos
        </Typography>
        <Typography sx={{ mt: 0.75, color: "#777d91", fontSize: 14 }}>
          Reúna tarefas e acompanhe o trabalho do seu time.
        </Typography>
      </Box>
      <Button
        variant="contained"
        startIcon={<AddRoundedIcon />}
        onClick={onCreateClick}
        sx={{
          minHeight: 44,
          alignSelf: { xs: "flex-start", sm: "auto" },
          px: 2.25,
          borderRadius: "9px",
          bgcolor: "#6c5ce7",
          fontWeight: 600,
          textTransform: "none",
          boxShadow: "0 8px 17px rgba(105, 87, 220, 0.19)",
          "&:hover": { bgcolor: "#5949d0" },
        }}
      >
        Novo projeto
      </Button>
    </Box>
  );
}
