import AddRoundedIcon from "@mui/icons-material/AddRounded";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";
import { Box, Button, Paper, Typography } from "@mui/material";

type ProjectsEmptyStateProps = {
  hasSearch: boolean;
  onCreateClick: () => void;
};

export function ProjectsEmptyState({ hasSearch, onCreateClick }: ProjectsEmptyStateProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        mt: 3,
        minHeight: 310,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
        py: 5,
        border: "1px dashed #dfe2ec",
        borderRadius: "16px",
        bgcolor: "rgba(255,255,255,0.68)",
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          width: 60,
          height: 60,
          display: "grid",
          placeItems: "center",
          mb: 2,
          borderRadius: "18px",
          color: "#6c5ce7",
          bgcolor: "#f1efff",
        }}
      >
        <FolderOpenRoundedIcon sx={{ fontSize: 30 }} />
      </Box>
      <Typography component="h2" sx={{ color: "#292d45", fontSize: 17, fontWeight: 700 }}>
        {hasSearch ? "Nenhum projeto encontrado" : "Seus projetos começam aqui"}
      </Typography>
      <Typography
        sx={{
          maxWidth: 400,
          mt: 1,
          color: "#858a9d",
          fontSize: 13,
          lineHeight: 1.7,
        }}
      >
        {hasSearch
          ? "Tente outro termo de busca."
          : "Crie um projeto para organizar tarefas, compartilhar ideias e manter o time em sintonia."}
      </Typography>
      {!hasSearch && (
        <Button
          variant="outlined"
          startIcon={<AddRoundedIcon />}
          onClick={onCreateClick}
          sx={{
            mt: 2.5,
            borderRadius: "9px",
            color: "#6554d5",
            borderColor: "#d8d3fa",
            textTransform: "none",
          }}
        >
          Criar primeiro projeto
        </Button>
      )}
    </Paper>
  );
}
