import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type AuthSession = Record<string, unknown>;

type AuthState = {
  session: AuthSession | null;
  setSession: (session: AuthSession) => void;
  getSession: () => AuthSession | null;
  getAccessToken: () => string | null;
  updateSession: (session: Partial<AuthSession>) => void;
  clearSession: () => void;
};

const SESSION_TOKEN_FIELDS = [
  "accessToken",
  "access_token",
  "authToken",
  "auth_token",
  "bearerToken",
  "jwt",
  "jwtToken",
  "sessionToken",
  "session_token",
  "token",
] as const;

function findToken(value: unknown, depth = 0): string | null {
  if (typeof value !== "object" || value === null || Array.isArray(value) || depth > 6) {
    return null;
  }

  const record = value as Record<string, unknown>;
  for (const field of SESSION_TOKEN_FIELDS) {
    const token = record[field];
    if (typeof token === "string" && token.trim()) return token.trim();
  }

  for (const nestedValue of Object.values(record)) {
    const token = findToken(nestedValue, depth + 1);
    if (token) return token;
  }

  return null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      session: null,
      setSession: (session) => set({ session }),
      getSession: () => get().session,
      getAccessToken: () => findToken(get().session),
      updateSession: (sessionUpdate) => {
        const currentSession = get().session;
        if (currentSession) set({ session: { ...currentSession, ...sessionUpdate } });
      },
      clearSession: () => set({ session: null }),
    }),
    {
      name: "fluxtiva-auth-session",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ session: state.session }),
    },
  ),
);
