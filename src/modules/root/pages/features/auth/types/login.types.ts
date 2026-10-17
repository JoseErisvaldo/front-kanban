import type { z } from "zod";
import type { loginResponseSchema } from "../schema/login-response-schema";
import type { loginSchema } from "../schema/login-schema";

export type LoginFormValues = z.infer<typeof loginSchema>;
export type AuthSession = z.infer<typeof loginResponseSchema>;
