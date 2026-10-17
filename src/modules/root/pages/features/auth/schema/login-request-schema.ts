import { loginSchema } from "./login-schema";

export const loginRequestSchema = loginSchema.pick({
  email: true,
  password: true,
});
