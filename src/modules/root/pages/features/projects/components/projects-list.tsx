import { Box } from "@mui/material";
import type { Project } from "../types/project.types";
import { ProjectCard } from "./project-card";

type ProjectsListProps = {
  projects: Project[];
};

export function ProjectsList({ projects }: ProjectsListProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        },
        gap: 2,
        mt: 3,
      }}
    >
      {projects.map((project) => (
        <ProjectCard key={project.id ?? project.name} project={project} />
      ))}
    </Box>
  );
}
