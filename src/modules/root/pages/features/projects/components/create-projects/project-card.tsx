import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";
import { Box, Card, CardContent, Typography } from "@mui/material";
import type { Project } from "../../types/project.types";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid #e8eaf2",
        borderRadius: "16px",
        bgcolor: "#fff",
        transition:
          "border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease",
        "&:hover": {
          borderColor: "#d5d0fb",
          boxShadow: "0 12px 32px rgba(35, 43, 77, 0.08)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Box
          sx={{
            width: 42,
            height: 42,
            display: "grid",
            placeItems: "center",
            mb: 2.5,
            borderRadius: "12px",
            color: "#6958db",
            bgcolor: "#f1efff",
          }}
        >
          <FolderOpenRoundedIcon />
        </Box>
        <Typography
          component="h2"
          sx={{ color: "#252941", fontSize: 16, fontWeight: 700 }}
        >
          {project.name}
        </Typography>
        <Typography
          sx={{ mt: 0.75, color: "#777d91", fontSize: 13, lineHeight: 1.6 }}
        >
          {project.description}
        </Typography>
        {project.createdAt && (
          <Typography sx={{ mt: 1.25, color: "#989cad", fontSize: 12 }}>
            Criado em {project.createdAt}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
