type ApiErrorResponse = {
  message?: string;
  status?: number;
  response?: {
    status?: number;
    data?: unknown;
  };
};

type HandleApiErrorReturn = {
  status?: number;
  message: string;
};

const ERROR_MESSAGES: Record<number, string> = {
  400: "Dados inválidos. Verifique os campos preenchidos.",
  401: "Você não tem permissão para essa ação.",
  404: "O recurso solicitado não foi encontrado.",
  409: "Já existe um registro com esses dados.",
  500: "Erro interno do servidor. Tente novamente mais tarde.",
};

export const DEFAULT_ERROR_MESSAGE = "Ops! Algo deu errado. Tente novamente em instantes.";

function getServerMessage(data: unknown): string | null {
  if (typeof data === "string" && data.trim()) return data.trim();
  if (typeof data !== "object" || data === null || Array.isArray(data)) return null;

  const payload = data as Record<string, unknown>;
  for (const field of ["message", "error"]) {
    const value = payload[field];
    if (typeof value === "string" && value.trim()) return value.trim();
  }

  return null;
}

export function handleApiError(err: unknown): HandleApiErrorReturn {
  const error = err as ApiErrorResponse;
  const status = error?.response?.status ?? error?.status;
  const message =
    getServerMessage(error?.response?.data) ??
    (status ? ERROR_MESSAGES[status] : null) ??
    (err instanceof Error && err.message ? err.message : DEFAULT_ERROR_MESSAGE);

  return {
    status,
    message,
  };
}

export function logError(serviceName: string, error: unknown): void {
  console.error(`[${serviceName}]`, error);
}
