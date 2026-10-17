import {
  Alert,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { useLoginForm } from "../hooks/use-login-form";

function MailIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <rect x="2.5" y="4" width="15" height="12" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m4 6 6 4.5L16 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EyeIcon({ isVisible }: { isVisible: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path
        d="M2.2 10s2.8-5 7.8-5 7.8 5 7.8 5-2.8 5-7.8 5-7.8-5-7.8-5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.5" />
      {isVisible && (
        <path d="m3 3 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      )}
    </svg>
  );
}

export function LoginForm() {
  const {
    control,
    formState: { errors, isSubmitting },
    isPasswordVisible,
    notice,
    isRequestError,
    onSubmit,
    togglePasswordVisibility,
    showPasswordRecoveryNotice,
  } = useLoginForm();

  return (
    <form className="login-form" onSubmit={onSubmit} noValidate>
      <div className="login-form__field">
        <label className="login-form__label" htmlFor="login-email">
          E-mail
        </label>
        <Controller
          control={control}
          name="email"
          render={({ field }) => {
            const { ref, ...fieldProps } = field;
            return (
              <TextField
                {...fieldProps}
                inputRef={ref}
                id="login-email"
                className="login-field"
                type="email"
                placeholder="voce@empresa.com"
                autoComplete="email"
                fullWidth
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                slotProps={{
                  htmlInput: { "aria-label": "E-mail" },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <span className="login-field__icon">
                          <MailIcon />
                        </span>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            );
          }}
        />
      </div>

      <div className="login-form__field">
        <label className="login-form__label" htmlFor="login-password">
          Senha
        </label>
        <Controller
          control={control}
          name="password"
          render={({ field }) => {
            const { ref, ...fieldProps } = field;
            return (
              <TextField
                {...fieldProps}
                inputRef={ref}
                id="login-password"
                className="login-field"
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Digite sua senha"
                autoComplete="current-password"
                fullWidth
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
                slotProps={{
                  htmlInput: { "aria-label": "Senha" },
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          className="login-field__visibility"
                          aria-label={isPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
                          aria-pressed={isPasswordVisible}
                          onClick={togglePasswordVisibility}
                          edge="end"
                        >
                          <EyeIcon isVisible={isPasswordVisible} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            );
          }}
        />
      </div>

      <div className="login-form__options">
        <FormControlLabel
          className="login-form__remember"
          control={
            <Controller
              control={control}
              name="rememberMe"
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  size="small"
                  className="login-checkbox"
                  slotProps={{ input: { "aria-label": "Manter conectado" } }}
                />
              )}
            />
          }
          label="Manter conectado"
        />
        <button className="login-form__forgot" type="button" onClick={showPasswordRecoveryNotice}>
          Esqueceu a senha?
        </button>
      </div>

      {notice && (
        <Alert
          className="login-form__notice"
          severity={isRequestError ? "error" : "info"}
          role="status"
        >
          {notice}
        </Alert>
      )}

      <Button
        className="login-form__submit"
        type="submit"
        variant="contained"
        fullWidth
        disableElevation
        disabled={isSubmitting}
      >
        {isSubmitting ? "Validando…" : "Entrar na plataforma"}
        <span aria-hidden="true" className="login-form__submit-arrow">
          →
        </span>
      </Button>

      <p className="login-form__security">
        <svg aria-hidden="true" viewBox="0 0 16 16" fill="none">
          <rect x="3" y="7" width="10" height="7" rx="2" stroke="currentColor" strokeWidth="1.4" />
          <path d="M5.5 7V4.8a2.5 2.5 0 0 1 5 0V7" stroke="currentColor" strokeWidth="1.4" />
        </svg>
        Seus dados são protegidos com criptografia
      </p>
    </form>
  );
}
