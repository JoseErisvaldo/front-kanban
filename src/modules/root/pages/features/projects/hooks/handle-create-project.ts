import { useState } from "react";
import { useCreateProjectMutation } from "../mutations/use-create-project-mutation";

export function useCreateProject() {
  const createProjectMutation = useCreateProjectMutation();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  async function handleCreateProject(): Promise<void> {
    const name = projectName.trim();
    const description = projectDescription.trim();

    if (!name || !description || createProjectMutation.isPending) return;

    try {
      await createProjectMutation.mutateAsync({
        name,
        description,
      });

      setProjectName("");
      setProjectDescription("");
      setIsCreateDialogOpen(false);
    } catch {
      return;
    }
  }

  function handleCloseCreateDialog(): void {
    setIsCreateDialogOpen(false);
  }

  function handleOpenCreateDialog(): void {
    setIsCreateDialogOpen(true);
  }

  return {
    isCreateDialogOpen,
    projectName,
    projectDescription,
    createProjectError: createProjectMutation.error?.message ?? null,
    isCreatingProject: createProjectMutation.isPending,
    setProjectName,
    setProjectDescription,
    handleCreateProject,
    handleOpenCreateDialog,
    handleCloseCreateDialog,
  };
}
