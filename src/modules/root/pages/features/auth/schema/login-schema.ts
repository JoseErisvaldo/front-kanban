import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Informe um endereço de e-mail válido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
  rememberMe: z.boolean(),
});
