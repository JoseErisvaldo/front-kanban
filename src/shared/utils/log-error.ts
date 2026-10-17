type ApiErrorResponse = {
  status?: number;
  response?: {
    status?: number;
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

export function handleApiError(err: unknown): HandleApiErrorReturn {
  const error = err as ApiErrorResponse;
  const status = error?.response?.status ?? error?.status;
  const message = (status ? ERROR_MESSAGES[status] : null) ?? DEFAULT_ERROR_MESSAGE;

  return {
    status,
    message,
  };
}

export function logError(serviceName: string, error: unknown): void {
  console.error(`[${serviceName}]`, error);
}
