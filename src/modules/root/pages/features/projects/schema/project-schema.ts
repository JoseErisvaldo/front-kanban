import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome do projeto."),
  description: z.string().trim().min(1, "Informe a descrição do projeto."),
});

export const projectSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  name: z.string(),
  description: z.string(),
  createdAt: z.string().optional(),
});
