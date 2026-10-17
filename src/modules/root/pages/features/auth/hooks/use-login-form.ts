import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { loginSchema } from "../schema/login-schema";
import type { LoginFormValues } from "../types/login.types";

export function useLoginForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
    mode: "onBlur",
  });

  const onSubmit = form.handleSubmit(() => {
    setNotice(
      "Seus dados foram validados. A integração com o serviço de autenticação ainda será conectada.",
    );
  });

  function togglePasswordVisibility() {
    setIsPasswordVisible((visible) => !visible);
  }

  function showPasswordRecoveryNotice() {
    setNotice(
      "A recuperação de senha estará disponível após a integração com o serviço de autenticação.",
    );
  }

  return {
    ...form,
    isPasswordVisible,
    notice,
    onSubmit,
    togglePasswordVisibility,
    showPasswordRecoveryNotice,
  };
}
