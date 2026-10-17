import { z } from "zod";

export const loginResponseSchema = z.record(z.string(), z.unknown());
