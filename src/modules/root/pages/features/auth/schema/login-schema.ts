import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Informe um endereço de e-mail válido."),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
  rememberMe: z.boolean(),
});
