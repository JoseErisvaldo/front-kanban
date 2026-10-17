import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { DEFAULT_ERROR_MESSAGE } from "../../../../../../shared/utils";
import { loginSchema } from "../schema/login-schema";
import { loginService } from "../services/login.service";
import { useAuthStore } from "../store/auth-store";
import type { LoginFormValues } from "../types/login.types";

export function useLoginForm() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [isRequestError, setIsRequestError] = useState(false);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
    mode: "onBlur",
  });

  const onSubmit = form.handleSubmit(async ({ email, password }) => {
    setNotice(null);
    setIsRequestError(false);

    try {
      const session = await loginService({ email, password });
      setSession(session);
      await navigate("/home", { replace: true });
    } catch (error) {
      setIsRequestError(true);
      setNotice(error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE);
    }
  });

  function togglePasswordVisibility() {
    setIsPasswordVisible((visible) => !visible);
  }

  function showPasswordRecoveryNotice() {
    setIsRequestError(false);
    setNotice(
      "A recuperação de senha estará disponível após a integração com o serviço de autenticação.",
    );
  }

  return {
    ...form,
    isPasswordVisible,
    notice,
    isRequestError,
    onSubmit,
    togglePasswordVisibility,
    showPasswordRecoveryNotice,
  };
}
