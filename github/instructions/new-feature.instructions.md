---
applyTo: "src/modules/root/pages/**"
---

# Criando Nova Feature — puxadinho-front

Ao criar ou expandir qualquer feature em `src/modules/root/pages/`, siga rigorosamente esta estrutura e os padrões abaixo.

---

## Estrutura de Pastas e Checklist

> Definidos em `.github/ARCHITECTURE.md` (fonte da verdade). Consulte a seção **"Estrutura de uma Feature"** e o **"Checklist para Nova Feature"** antes de começar.

---

## Padrões por Camada

### `schema/<nome>-schema.ts`
```ts
import { z } from 'zod'

export const myEntitySchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  status: z.string(),
  createdAt: z.string(),
})
```

### `types/<nome>.types.ts`
```ts
import type { z } from 'zod'
import type { myEntitySchema } from '../schema/my-entity-schema'

// Tipos sempre inferidos do schema — nunca definir interface manualmente para dados da API
export type MyEntity = z.infer<typeof myEntitySchema>
```

> **Regra:** `types/<nome>.types.ts` existe mas **nunca** define `interface` ou `type` manual para entidades da API. Sempre use `z.infer<typeof schema>` importando do arquivo de schema.

### `services/<acao>-<nome>.service.ts`
```ts
import { httpClient } from '@/shared/services'
import { logError } from '@/shared/utils'
import { myEntityResponseSchema } from '../schema/my-entity-schema'
import type { MyEntity } from '../types/my-entity.types'

export async function getMyEntityService(id: string): Promise<MyEntity> {
  try {
    const response = await httpClient.get(`/v1/my-entity/${id}`)
    return myEntityResponseSchema.parse(response.data)
  } catch (error) {
    logError('getMyEntityService', error)
    throw error
  }
}
```

### `endpoints-keys/<nome>.keys.ts`
```ts
export const myEntityQueryKeys = {
  all: ['my-entity'] as const,                                    // invalida todo o domínio
  lists: () => ['my-entity', 'list'] as const,                   // invalida todas as listas
  detail: (id: string) => ['my-entity', 'detail', id] as const,  // invalida item específico
}
```

### `queries/use-<nome>-query.ts`

> **Regra:** Nesta arquitetura **nunca** use `useEffect` + `fetch`/`axios` para buscar dados da API. Todo acesso a dados remotos usa `useQuery` ou `useMutation` do TanStack Query.

```ts
// [ERRADO] buscar dado com useEffect
useEffect(() => {
  fetch('/api/entity').then(res => res.json()).then(setData)
}, [])

// [ERRADO] staleTime/gcTime/refetchInterval com valor numérico hardcoded
useQuery({
  queryKey: myEntityQueryKeys.detail(id),
  queryFn: () => getMyEntityService(id),
  staleTime: 1000 * 60 * 10, // ❌ hardcoded
  refetchInterval: 5000,      // ❌ hardcoded
})

// [CORRETO]
import { useQuery } from '@tanstack/react-query'
import { cacheTime, refetchInterval } from '@/shared/services/queries'
import { getMyEntityService } from '../services/get-my-entity.service'
import { myEntityQueryKeys } from '../endpoints-keys/my-entity.keys'

export function useMyEntityQuery(id: string) {
  return useQuery({
    queryKey: myEntityQueryKeys.detail(id),
    queryFn: () => getMyEntityService(id),
    staleTime: cacheTime.TEN_MINUTES,
    gcTime: cacheTime.TWENTY_MINUTES,
  })
}

// Com polling:
export function useMyEntityStatusQuery(id: string) {
  return useQuery({
    queryKey: myEntityQueryKeys.status(id),
    queryFn: () => getMyEntityStatusService(id),
    refetchInterval: refetchInterval.TEN_SECONDS,
  })
}
```

### `mutations/use-<nome>-mutation.ts`
```ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateMyEntityService } from '../services/update-my-entity.service'
import { myEntityQueryKeys } from '../endpoints-keys/my-entity.keys'

export function useUpdateMyEntityMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateMyEntityService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myEntityQueryKeys.lists() })
    },
  })
}

// Quando precisar tratar o erro manualmente (sem o toast global):
export function useUpdateMyEntityMutationSilent() {
  return useMutation({
    mutationFn: updateMyEntityService,
    meta: { skipGlobalError: true }, // suprime o toast global do mutationCache
    onError: (error) => {
      // tratamento de erro customizado aqui
    },
  })
}```

> **Regra:** O `mutationCache` do `queryClient` exibe automaticamente um toast de erro para toda mutation que falhar. Só use `meta: { skipGlobalError: true }` quando houver tratamento de erro customizado explícito no `onError`.
```

> Quando a mutation precisar invalidar **mais de um domínio** de queries, extraia as chamadas para um helper dedicado — veja a seção **Utils e Helpers** abaixo.

### `helpers/invalidate-<nome>-queries.ts`

Use quando uma mutation (ou hook) precisa invalidar queries de **múltiplos domínios** ao mesmo tempo:

```ts
import type { QueryClient } from '@tanstack/react-query'
import { myEntityQueryKeys } from '../endpoints-keys/my-entity.keys'
import { otherDomainKeys } from '@/shared/cross-features/other-domain/endpoints-keys/other-domain.keys'

export function invalidateMyEntityQueries(queryClient: QueryClient): void {
  queryClient.invalidateQueries({ queryKey: myEntityQueryKeys.all })
  queryClient.invalidateQueries({ queryKey: otherDomainKeys.all })
}
```

```ts
// Uso na mutation
import { invalidateMyEntityQueries } from '../helpers/invalidate-my-entity-queries'

export function useCreateMyEntityMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createMyEntityService,
    onSuccess: () => {
      invalidateMyEntityQueries(queryClient)
    },
  })
}
```

### `hooks/use-<nome>.ts`

> **Quando usar:** sempre que a view precisar de mais de um `useQuery`/`useMutation`, ou tiver `useState`/`useCallback` relacionado a lógica de negócio (editar, confirmar, cancelar). Para views simples com apenas uma query, o hook pode ser omitido e a query usada diretamente na view.

> **Não faz:** chamada HTTP, JSX, acesso direto ao `httpClient`.

```ts
// hooks/use-my-entity-detail.ts
import { useState } from 'react'
import { useMyEntityQuery } from '../queries/use-my-entity-query'
import { useUpdateMyEntityMutation } from '../mutations/use-update-my-entity-mutation'

export function useMyEntityDetail(id: string) {
  const [isEditing, setIsEditing] = useState(false)

  const { data, isLoading, isError } = useMyEntityQuery(id)
  const { mutate: update, isPending: isSaving } = useUpdateMyEntityMutation()

  function handleSave(payload: UpdateMyEntityPayload) {
    update(payload, { onSuccess: () => setIsEditing(false) })
  }

  return {
    data,
    isLoading,
    isError,
    isEditing,
    isSaving,
    onEdit: () => setIsEditing(true),
    onCancel: () => setIsEditing(false),
    onSave: handleSave,
  }
}
```

### `views/<nome>.view.tsx`
```tsx
import PageLoading from '@/shared/components/layout/page-loading/page-loading.view'
import { PageError } from '@/shared/components'
import { useMyEntityDetail } from '../hooks/use-my-entity-detail'
import { MyEntityCard } from '../components/my-entity-card'

export function MyEntityView({ id }: { id: string }) {
  const { data, isLoading, isError, isEditing, isSaving, onEdit, onCancel, onSave } = useMyEntityDetail(id)

  if (isLoading) return <PageLoading />
  if (isError) return <PageError />

  return (
    <MyEntityCard
      entity={data}
      isEditing={isEditing}
      isSaving={isSaving}
      onEdit={onEdit}
      onCancel={onCancel}
      onSave={onSave}
    />
  )
}
```

```ts
// Exporte apenas o que outras partes da aplicação precisam
export { MyEntityView } from './views/my-entity.view'
export type { MyEntity } from './types/my-entity.types'
```

---

## Regras de Dependência

> Definidas em `copilot-instructions.md` (fonte da verdade). Resumo: features nunca importam de outras features — use `@/shared/cross-features/<dominio>`. Imports sempre via `index.ts`, nunca por subpasta.

---

## Componentes de UI

Prefira primitivos do Jetstream antes de criar componentes customizados:

```tsx
import { Button, TextField, Typography } from '@maas-ds/jetstream-material'
```

Crie componente customizado somente se não houver equivalente no Jetstream.

---

## i18n

Textos exibidos ao usuário devem usar i18next:

```tsx
import { useTranslation } from 'react-i18next'

export function MyComponent() {
  const { t } = useTranslation()
  return <span>{t('my-feature.label')}</span>
}
```

---

## Utils e Helpers

Funções utilitárias ficam em `utils/` ou `helpers/` dentro da feature ou em `shared/`. Siga os princípios SOLID:

### Regras

- **SRP** — cada função faz **uma única coisa**. Se o nome precisar de "e" ou "ou", quebre em duas funções
- **Funções puras** — sem efeitos colaterais, sem chamadas HTTP, sem acesso a estado externo
- **Dados como parâmetros** — nunca buscar estado global dentro da função; receba tudo via argumento
- **Funções privadas** compõem a função pública exportada — não exporte o que só serve internamente
- **Nomenclatura** — use verbos descritivos: `resolve`, `get`, `is`, `build`, `format`, `normalize`

### Exemplo real do projeto

```ts
// utils/seller-tracking-route.ts

// ✅ SRP — cada função faz uma coisa
function isStepCompleted(status: string, completedAt: string | null): boolean {
  const normalizedStatus = status.toUpperCase()
  return (
    completedAt !== null ||
    normalizedStatus === 'COMPLETED' ||
    normalizedStatus === 'SKIPPED'
  )
}

function resolveFirstAvailableStepCode(
  tracking: SellerTrackingResponse
): SellerTrackingStepCode {
  const orderedSteps = [...tracking.steps].sort(
    (left, right) => left.order - right.order
  )
  return (
    orderedSteps.find((step) => !isStepCompleted(step.status, step.completed_at))?.code ??
    tracking.current_step ??
    'ACCOUNT_RELEASE'
  )
}

// ✅ Função pública orquestra as privadas
export function resolveTrackingNavigationPath(
  pathname: string,
  tracking: SellerTrackingResponse
): string | null {
  if (tracking.is_finalized) return pathname

  const flowPrefix = getTrackingFlowPrefixFromPath(pathname)
  const availableStepCode = resolveFirstAvailableStepCode(tracking)

  return resolveTrackingStepPath(availableStepCode, flowPrefix)
}
```

```ts
// ❌ ERRADO — função fazendo mais de uma coisa (viola SRP)
export function getAndValidateAndRedirectStep(
  pathname: string,
  tracking: SellerTrackingResponse
) {
  // resolve step + valida permissão + decide redirect — 3 responsabilidades
}
```
