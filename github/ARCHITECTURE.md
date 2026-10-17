# Arquitetura por Feature Based

Este documento descreve a arquitetura adotada no projeto, baseada em **Feature Based** adaptado, e serve como guia para novas implementações.

---

## Estrutura Global

```
src/
├── app/                    # Configurações e bootstrap da aplicação
│   ├── entry/              # Inicialização (client, expose)
│   ├── i18n/               # Internacionalização e traduções
│   ├── providers/          # Contextos globais (QueryClient, Theme, etc)
│   └── routes/             # Definição de rotas da aplicação
├── assets/                 # Arquivos estáticos (imagens, SVG, estilos globais)
├── commons/                # Constantes globais, utilitários transversais
├── modules/root/pages/     # Módulos isolados por domínio de negócio  ← foco principal
├── modules/root/shared     # Recursos compartilhados apenas dentro do módulo root (layouts, páginas globais, componentes e utilitários internos)
├── services/               # Infraestrutura compartilhada (HTTP client)
└── shared/                 # Código reutilizável por toda a aplicação
```

---

## Shared — Código Reutilizável

Tudo que **não pertence a nenhum domínio específico** vive aqui.

```
shared/
├── components/
│   ├── ui/                 # Componentes base  (button.tsx, input.tsx, modal.tsx)
│   └── layout/             # Estrutura visual  (sidebar.tsx, header.tsx)
├── hooks/                  # Hooks genéricos   (use-debounce.ts, use-disclosure.ts)
├── services/               # Instância Axios / HTTP client  (api.ts)
└── utils/                  # Formatadores      (format-date.ts, format-currency.ts)
```

> **Regra:** `shared` nunca importa de `features`. O fluxo de dependência é sempre de fora para dentro.

---

## Features — Módulos de Domínio

Cada feature é uma **fatia vertical** autossuficiente do negócio. Todo código relacionado a um domínio fica dentro da sua pasta — sem dependências cruzadas entre features.

### Estrutura de uma Feature

```
features/<nome-da-feature>/
├── components/             # Componentes exclusivos desta feature
│   └── __tests__/
├── hooks/                  # Hooks de lógica de UI (controle de modais, estados locais)
│   └── __tests__/
├── endpoints-keys/         # Query keys tipadas (ex: my-feature.keys.ts)
├── helpers/                # Funções auxiliares puras — ex: invalidate-<domain>-queries.ts
│   └── __tests__/
├── mutations/              # Hooks React Query — useMutation
│   └── __tests__/
├── queries/                # Hooks React Query — useQuery
│   └── __tests__/
├── schema/                 # Validações Zod (formulários e DTOs)
├── services/               # Chamadas HTTP diretas (Axios/Fetch)
│   └── __tests__/
├── store/                  # Estado global da feature (Zustand/Context) — quando necessário
├── types/                  # Interfaces e Types TypeScript
├── views/                  # Componentes de página / containers principais
└── index.ts                # Public API — único ponto de exportação da feature
```

---

## Exemplos de Features

### `modules/root/pages/features)/user/`

```
features/user/
├── components/
│   ├── __tests__/
│   ├── user-card.tsx
│   └── user-form.tsx
├── hooks/
│   ├── __tests__/
│   └── use-user-modal.ts
├── endpoints-keys/
│   └── user.keys.ts
├── helpers/
│   ├── __tests__/
│   └── invalidate-user-queries.ts
├── mutations/
│   ├── __tests__/
│   └── use-update-user-mutation.ts
├── queries/
│   ├── __tests__/
│   └── use-users-query.ts
├── schema/
│   └── user-schema.ts
├── services/
│   ├── __tests__/
│   ├── get-users.service.ts
│   └── update-user.service.ts
├── types/
│   └── user.types.ts
├── views/
│   └── users-list.view.tsx
└── index.ts
```

---

## Fluxo de Dados

O fluxo segue uma hierarquia **unidirecional** para facilitar debug e rastreabilidade:

```
View → Hook → Query / Mutation → Service → API
                                    ↑
                               Schema (Zod)
                          valida entrada e saída
```

| Camada          | Responsabilidade                                              |
|-----------------|---------------------------------------------------------------|
| **View**        | Renderiza UI, chama hooks e queries                           |
| **Hook**        | Gerencia estado local de UI (modais, steps, toggles)          |
| **Query**       | Cache e estado de carregamento via React Query (`useQuery`)   |
| **Mutation**    | Escrita na API via React Query (`useMutation`)                |
| **Service**     | Executa a requisição HTTP (Axios/Fetch) — sem lógica de UI    |
| **Schema**      | Valida dados de formulário e respostas da API (Zod)           |
| **Store**       | Estado global persistente da feature (Zustand) — uso pontual |

---

## Public API — `index.ts`

Cada feature expõe **somente** o que outras partes da aplicação precisam consumir.

```ts
// features/user/index.ts
export { UserCard } from './components/user-card';
export { useUsersQuery } from './queries/use-users-query';
export type { User } from './types/user.types';
```

> **Regra:** nunca importe diretamente de subpastas de outra feature (`features/user/components/user-card`). Sempre use o `index.ts` (`features/user`).

---

## Regras de Dependência

```
app  →  features  →  shared  →  commons / services
```

| Camada      | Pode importar de                | Não pode importar de  |
|-------------|--------------------------------|-----------------------|
| `app`       | `features`, `shared`           | —                     |
| `features`  | `shared`, `commons`, `services`| outras `features`     |
| `shared`    | `commons`, `services`          | `features`, `app`     |
| `commons`   | — (sem dependências internas)  | —                     |

---

## Convenções de Nomenclatura

| Tipo          | Padrão                          | Exemplo                        |
|---------------|---------------------------------|--------------------------------|
| Arquivos      | `kebab-case`                    | `user-table.tsx`               |
| Componentes   | `kebab-case`                    | `user-card`                    |
| Hooks         | `use-` prefix                   | `use-user-modal.ts`            |
| Services      | `.service.ts` suffix            | `get-users.service.ts`         |
| Queries       | `use-` + nome + `-query.ts`     | `use-users-query.ts`           |
| Mutations     | `use-` + nome + `-mutation.ts`  | `use-update-user-mutation.ts`  |
| Schema        | nome + `-schema.ts`             | `user-schema.ts`               |
| Types         | nome + `.types.ts`              | `user.types.ts`                |
| Views         | nome + `.view.tsx`              | `users-list.view.tsx`          |
| Testes        | nome + `.spec.ts` em `__tests__/` | `user-card.spec.tsx`         |

---

## Checklist para Nova Feature

- [ ] Criar pasta em `modules/root/pages -> features/<nome-da-feature>/`
- [ ] Criar schema Zod em `schema/<nome>-schema.ts`
- [ ] Definir tipos em `types/<nome>.types.ts` via `z.infer<typeof schema>` (nunca `interface` manual para dados de API)
- [ ] Implementar serviço HTTP em `services/<acao>-<nome>.service.ts`
- [ ] Criar query/mutation em `queries/` ou `mutations/`
- [ ] Implementar componentes em `components/`
- [ ] Criar view em `views/<nome>.view.tsx`
- [ ] Expor Public API via `index.ts`
- [ ] Cobrir cada camada com testes em `__tests__/`

---

# Comunicação entre Camadas e Padrões do Projeto

Esta seção documenta **como as camadas se comunicam**, com exemplos reais extraídos do projeto.

---

## Visão Geral do Fluxo

```
┌──────────────────────────────────────────────────────────────┐
│                          Feature                             │
│                                                              │
│   view.tsx  ──→  use-*-page.ts  ──→  use-*-query.ts         │
│                        │                    │                │
│                  use-*-hook.ts         service.ts            │
│                                             │                │
│                                         httpClient           │
│                                             │                │
│                                            API               │
│                                             ↑                │
│                                        schema (Zod)          │
└──────────────────────────────────────────────────────────────┘
```
---

## Resumo dos Padrões de Comunicação

| De                     | Para                         | Como                                           |
|------------------------|------------------------------|------------------------------------------------|
| `view`                 | `hook de página`             | Desestruturação direta do hook                 |
| `hook de página`       | `queries / mutations`        | Chamada de hooks React Query                   |
| `hook de página`       | `shared/cross-features`      | Import pelo `index.ts` da cross-feature        |
| `query / mutation`     | `service`                    | Função assíncrona retornando dado parseado     |
| `service`              | `httpClient`                 | `httpClient.get / .post / .patch`              |
| `service`              | `schema (Zod)`               | `.parse(data)` para validar resposta da API    |
| `feature A`            | `feature B`                  | ❌ Proibido — usar `shared/cross-features`      |
| qualquer camada        | `shared/components`          | Import pelo `index.ts` do componente           |

---

## Anti-Padrões a Evitar

```
❌ Importar de subpastas de outra feature
   import { UserCard } from '@/features/user/components/user-card';
   // correto ↓
   import { UserCard } from '@/features/user';

❌ Lógica de negócio na View
   // correto: mover para hook de página

❌ Chamada HTTP no Hook ou View
   // correto: mover para service

❌ Importar diretamente de feature irmã
   import { useOrdersQuery } from '@/features/orders/queries/...';
   // correto: compartilhar via shared/cross-features/order
```
