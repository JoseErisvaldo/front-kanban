import { Box } from "@mui/material";
import { useState } from "react";
import { CreateProjectDialog } from "../components/create-project-dialog";
import { ProjectsEmptyState } from "../components/projects-empty-state";
import { ProjectsHeader } from "../components/projects-header";
import { ProjectsList } from "../components/projects-list";
import { ProjectsSearch } from "../components/projects-search";
import { useCreateProjectMutation } from "../mutations/use-create-project-mutation";
import type { Project } from "../types/project.types";

export function ProjectsView() {
  const createProjectMutation = useCreateProjectMutation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);

  async function handleCreateProject(): Promise<void> {
    const name = projectName.trim();
    const description = projectDescription.trim();
    if (!name || !description || createProjectMutation.isPending) return;

    try {
      const createdProject = await createProjectMutation.mutateAsync({
        name,
        description,
      });
      setProjects((currentProjects) => [
        ...currentProjects,
        {
          ...createdProject,
          createdAt:
            createdProject.createdAt ??
            new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date()),
        },
      ]);
      setProjectName("");
      setProjectDescription("");
      setIsCreateDialogOpen(false);
    } catch {
      // Keep the dialog open so the user can review the error and retry.
    }
  }

  const filteredProjects = projects.filter((project) =>
    project.name.toLocaleLowerCase("pt-BR").includes(search.trim().toLocaleLowerCase("pt-BR")),
  );

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
        <ProjectsHeader onCreateClick={() => setIsCreateDialogOpen(true)} />
        <ProjectsSearch value={search} onChange={setSearch} />
        {filteredProjects.length > 0 ? (
          <ProjectsList projects={filteredProjects} />
        ) : (
          <ProjectsEmptyState
            hasSearch={Boolean(search.trim())}
            onCreateClick={() => setIsCreateDialogOpen(true)}
          />
        )}
      </Box>
      <CreateProjectDialog
        open={isCreateDialogOpen}
        projectName={projectName}
        projectDescription={projectDescription}
        error={createProjectMutation.error?.message ?? null}
        isSubmitting={createProjectMutation.isPending}
        onProjectNameChange={setProjectName}
        onProjectDescriptionChange={setProjectDescription}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateProject}
      />
    </Box>
  );
}
