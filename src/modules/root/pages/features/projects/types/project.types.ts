import type { z } from "zod";
import type { createProjectSchema, projectSchema } from "../schema/project-schema";

export type CreateProjectPayload = z.infer<typeof createProjectSchema>;
export type Project = z.infer<typeof projectSchema>;
