import { Box } from "@mui/material";
import { useState } from "react";
import { CreateProjectDialog } from "../components/create-projects/create-project-dialog";
import { ProjectsEmptyState } from "../components/create-projects/projects-empty-state";
import { ProjectsHeader } from "../components/create-projects/projects-header";
import { ProjectsList } from "../components/create-projects/projects-list";
import { ProjectsSearch } from "../components/create-projects/projects-search";
import { useCreateProject } from "../hooks/handle-create-project";

export function ProjectsView() {
  const [search, setSearch] = useState("");

  const {
    isCreateDialogOpen,
    projectName,
    projectDescription,
    createProjectError,
    isCreatingProject,
    setProjectName,
    setProjectDescription,
    handleCreateProject,
    handleOpenCreateDialog,
    handleCloseCreateDialog,
  } = useCreateProject();

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        px: { xs: 2.5, sm: 4, lg: 6 },
        pt: { xs: 3, md: 6 },
        pb: 6,
        background:
          "radial-gradient(circle at 10% 90%, rgba(111, 92, 231, 0.08), transparent 26%), #f4f6fb",
      }}
    >
      <Box sx={{ width: "min(100%, 1120px)", mx: "auto" }}>
        <ProjectsHeader onCreateClick={handleOpenCreateDialog} />
        <ProjectsSearch value={search} onChange={setSearch} />
        <ProjectsList projects={[]} />
        <ProjectsEmptyState
          hasSearch={Boolean(search.trim())}
          onCreateClick={handleOpenCreateDialog}
        />
      </Box>

      <CreateProjectDialog
        open={isCreateDialogOpen}
        projectName={projectName}
        projectDescription={projectDescription}
        error={createProjectError}
        isSubmitting={isCreatingProject}
        onProjectNameChange={setProjectName}
        onProjectDescriptionChange={setProjectDescription}
        onClose={handleCloseCreateDialog}
        onSubmit={handleCreateProject}
      />
    </Box>
  );
}
