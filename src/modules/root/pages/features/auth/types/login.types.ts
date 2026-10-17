import type { z } from "zod";
import type { loginSchema } from "../schema/login-schema";

export type LoginFormValues = z.infer<typeof loginSchema>;
