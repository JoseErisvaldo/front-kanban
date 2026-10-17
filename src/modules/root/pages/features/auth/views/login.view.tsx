import { LoginForm } from "../components/login-form";
import "../login.css";

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}

function BoardPreview() {
  return (
    <div className="board-preview" aria-hidden="true">
      <div className="board-preview__topbar">
        <div className="board-preview__dots">
          <span className="board-preview__dot board-preview__dot--red" />
          <span className="board-preview__dot board-preview__dot--yellow" />
          <span className="board-preview__dot board-preview__dot--green" />
        </div>
        <span className="board-preview__topbar-title">Sprint de produto</span>
        <span className="board-preview__more">•••</span>
      </div>

      <div className="board-preview__columns">
        <div className="board-column">
          <div className="board-column__heading">
            <span className="board-column__dot board-column__dot--violet" />
            <span>A fazer</span>
            <span className="board-column__count">2</span>
          </div>
          <div className="task-card">
            <span className="task-card__tag task-card__tag--purple">DESIGN</span>
            <span className="task-card__title">Revisar fluxo de onboarding</span>
            <span className="task-card__meta">
              <span className="task-card__clock">◷</span> Hoje, 16:00
            </span>
          </div>
          <div className="task-card task-card--short">
            <span className="task-card__tag task-card__tag--blue">PRODUTO</span>
            <span className="task-card__title">Mapear jornada do usuário</span>
            <span className="task-card__avatar task-card__avatar--blue">LM</span>
          </div>
        </div>

        <div className="board-column">
          <div className="board-column__heading">
            <span className="board-column__dot board-column__dot--amber" />
            <span>Em progresso</span>
            <span className="board-column__count">1</span>
          </div>
          <div className="task-card task-card--highlight">
            <span className="task-card__tag task-card__tag--orange">DESENVOLVIMENTO</span>
            <span className="task-card__title">Dashboard de métricas</span>
            <span className="task-card__progress">
              <span className="task-card__progress-value" />
            </span>
            <span className="task-card__progress-label">
              Progresso <strong>68%</strong>
            </span>
            <span className="task-card__avatar task-card__avatar--pink">AC</span>
          </div>
          <div className="board-add">
            ＋ <span className="board-add__label">Adicionar tarefa</span>
          </div>
        </div>
      </div>

      <div className="board-preview__sparkle board-preview__sparkle--one">✳</div>
      <div className="board-preview__sparkle board-preview__sparkle--two">✳</div>
    </div>
  );
}

export function LoginView() {
  return (
    <main className="login-page">
      <div className="login-layout">
        <section className="login-showcase" aria-label="Apresentação da plataforma">
          <div className="login-showcase__glow login-showcase__glow--one" />
          <div className="login-showcase__glow login-showcase__glow--two" />

          <a className="brand" href="#inicio" aria-label="Fluxtiva, início">
            <BrandMark />
            <span>Fluxtiva</span>
          </a>

          <div className="login-showcase__content">
            <span className="eyebrow">
              <span /> SEU TRABALHO, EM FLUXO
            </span>
            <h1>
              Ideias em movimento.
              <br />
              <span className="login-showcase__headline-accent">Times em sintonia.</span>
            </h1>
            <p className="login-showcase__description">
              Organize projetos, acompanhe cada avanço e faça grandes coisas acontecerem — juntos.
            </p>
            <BoardPreview />
            <div className="login-showcase__social-proof">
              <div className="avatar-stack" aria-hidden="true">
                <span className="avatar-stack__avatar avatar-stack__avatar--one">MA</span>
                <span className="avatar-stack__avatar avatar-stack__avatar--two">JP</span>
                <span className="avatar-stack__avatar avatar-stack__avatar--three">LC</span>
                <span className="avatar-stack__avatar avatar-stack__avatar--four">+</span>
              </div>
              <p>
                <strong>Times que fazem acontecer.</strong>
                <br />
                Um espaço para cada grande ideia.
              </p>
            </div>
          </div>

          <p className="login-showcase__copyright">
            © 2026 Fluxtiva, feito para criar em conjunto.
          </p>
        </section>

        <section className="login-panel" aria-labelledby="login-title">
          <div className="login-panel__content">
            <div className="login-panel__mobile-brand brand">
              <BrandMark />
              <span>Fluxtiva</span>
            </div>
            <span className="login-panel__welcome">BEM-VINDO DE VOLTA</span>
            <h2 id="login-title">
              Que bom ter você aqui<span>.</span>
            </h2>
            <p className="login-panel__subtitle">
              Entre com seus dados para continuar de onde parou.
            </p>
            <LoginForm />
            <p className="login-panel__signup">
              Ainda não tem uma conta? <button type="button">Fale com seu administrador</button>
            </p>
          </div>
          <p className="login-panel__footer">
            Ao continuar, você concorda com nossos <a href="#termos">Termos de uso</a> e{" "}
            <a href="#privacidade">Política de privacidade</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
