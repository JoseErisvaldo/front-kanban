# Instruções Globais — puxadinho-front

## Idioma
- Responda **sempre em português (pt-BR)**.
- Comentários de código, mensagens de commit e nomes de variáveis seguem o projeto (inglês no código, português nas explicações).

## Stack Tecnológica
- **Framework:** React 19 com TypeScript
- **Build:** Rsbuild com Module Federation
- **Estilo:** MUI v7 + Emotion + Jetstream Design System (`@maas-ds/*`)
- **Estado servidor:** TanStack Query v5 (`useQuery` / `useMutation`) — configurado via `@/shared/services/queries`
- **Estado global:** Zustand v5 (uso pontual, por feature)
- **Formulários:** React Hook Form + Zod (`zodResolver`)
- **HTTP:** Axios
- **Roteamento:** React Router v7
- **Testes:** Vitest + Testing Library
- **Linter/Formatter:** Biome
- **i18n:** i18next + react-i18next

## Arquitetura
Este projeto segue **Feature-Based Architecture**. Consulte `.github/ARCHITECTURE.md` para a referência completa.

Regra de ouro de dependências:
```
app  →  features  →  shared  →  commons / services
```
- Features **nunca** importam de outras features diretamente — usam `shared/cross-features/`
- `shared/` **nunca** importa de `features/` ou `app/`
- Imports de outros módulos sempre via `index.ts` (Public API), nunca por subpasta

## Convenções de Código
- Arquivos: `kebab-case`
- Hooks: prefixo `use-`, sufixo `.ts`
- Services: sufixo `.service.ts`
- Queries: `use-<nome>-query.ts`
- Mutations: `use-<nome>-mutation.ts`
- Views: `<nome>.view.tsx`
- Schemas Zod: `<nome>-schema.ts`
- Types: `<nome>.types.ts`
- Testes: `<nome>.spec.ts` em `__tests__/`

**Proibido:**
- `any` — usar tipos explícitos ou `unknown` com type guard
- `useEffect` + `fetch`/`axios` para buscar dados da API — usar sempre `useQuery` / `useMutation` do TanStack Query
- `interface` ou `type` manual para entidades de API — usar `z.infer<typeof schema>`

## Padrões de Query

- Ao definir `staleTime` ou `gcTime`, usar sempre as constantes de `cacheTime` de `@/shared/services/queries` — nunca valores numéricos hardcoded
- Ao definir `refetchInterval`, usar sempre as constantes de `refetchInterval` de `@/shared/services/queries`
- O `queryClient` configurado vive em `@/shared/services/queries` — nunca criar uma nova instância
- O `mutationCache` do `queryClient` já exibe um toast global de erro em toda mutation que falhar — para suprimir em casos específicos, usar `meta.skipGlobalError: true` na mutation

```ts
import { cacheTime, refetchInterval } from '@/shared/services/queries'

useQuery({
  queryKey: myEntityQueryKeys.list(),
  queryFn: getMyEntityService,
  staleTime: cacheTime.TEN_MINUTES,
  gcTime: cacheTime.TWENTY_MINUTES,
})

// Com polling:
useQuery({
  queryKey: myEntityQueryKeys.status(id),
  queryFn: () => getMyEntityStatusService(id),
  refetchInterval: refetchInterval.TEN_SECONDS,
})

// Para suprimir o toast global de erro em uma mutation específica:
useMutation({
  mutationFn: createMyEntityService,
  meta: { skipGlobalError: true },
  onError: (error) => { /* tratamento customizado */ },
})
```

## Padrões de Erro

- Todo bloco `catch` em services deve chamar `logError(serviceName, error)` de `@/shared/utils`
- O `serviceName` é uma string literal que identifica o service (ex: `'getShippingService'`)
- Após o log, relançar ou tratar o erro conforme o contexto — nunca silenciar silenciosamente

```ts
import { logError } from '@/shared/utils'

export async function getMyEntityService(): Promise<MyEntity[]> {
  try {
    const { data } = await httpClient.get('/my-entity')
    return myEntitySchema.array().parse(data)
  } catch (error) {
    logError('getMyEntityService', error)
    throw error
  }
}
```

## Comportamento do Agente
- Ao criar código novo, seguir **exatamente** a estrutura de pastas de features descrita em ARCHITECTURE.md
- Ao revisar código, aplicar os critérios de `.github/code-review.instructions.md`
- Ao criar componentes, preferir primitivos do Jetstream (`@maas-ds/jetstream-material`) antes de criar novos
- Ao criar testes, sempre mockar dependências externas com `vi.mock()`
- Validar sempre respostas de API com `.parse()` ou `.safeParse()` do Zod antes de usar os dados
