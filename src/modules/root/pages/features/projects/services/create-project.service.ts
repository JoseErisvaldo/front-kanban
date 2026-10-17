import { apiClient } from "../../../../../../shared/services/api-client";
import { handleApiError, logError } from "../../../../../../shared/utils";
import { createProjectSchema, projectSchema } from "../schema/project-schema";
import type { CreateProjectPayload, Project } from "../types/project.types";

export async function createProjectService(
  input: CreateProjectPayload,
): Promise<Project> {
  try {
    const payload = createProjectSchema.parse(input);
    const response = await apiClient.post<Project>("/projects", payload);
    return projectSchema.parse(response.data);
  } catch (error) {
    console.error("Erro original em createProjectService:", error);

    const apiError = handleApiError(error);
    logError("createProjectService", apiError);

    throw new Error(apiError.message);
  }
}
