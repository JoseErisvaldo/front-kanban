import { apiClient } from "../../../../../../shared/services/api-client";
import { handleApiError, logError } from "../../../../../../shared/utils";
import { loginRequestSchema } from "../schema/login-request-schema";
import { loginResponseSchema } from "../schema/login-response-schema";
import type { AuthSession } from "../types/login.types";

const LOGIN_ENDPOINT = "http://localhost:3000/session";

export async function loginService(input: unknown): Promise<AuthSession> {
  try {
    const credentials = loginRequestSchema.parse(input);
    const { data } = await apiClient.post<unknown>(LOGIN_ENDPOINT, credentials);
    return loginResponseSchema.parse(data);
  } catch (error) {
    const apiError = handleApiError(error);
    logError("loginService", apiError);
    throw new Error(apiError.message);
  }
}
