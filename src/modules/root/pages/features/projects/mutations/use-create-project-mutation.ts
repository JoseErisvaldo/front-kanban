import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectQueryKeys } from "../endpoints-keys/project.keys";
import { createProjectService } from "../services/create-project.service";

export function useCreateProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProjectService,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: projectQueryKeys.lists(),
      });
    },
  });
}
