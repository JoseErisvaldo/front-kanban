# Fluxo de Dados — Do Schema à View

Este documento mostra como o código se organiza em camadas, do mais baixo nível (contrato com a API) até o que o usuário vê na tela.

> Use como referência rápida ao criar qualquer feature nova.

---

## Visão Geral

```
API  →  schema  →  types  →  service  →  query/mutation  →  hooks  →  view
```

Cada camada tem **uma responsabilidade única** e só conhece a camada anterior.

| Camada | Responsabilidade |
|--------|-----------------|
| `schema` | Contrato com a API — valida o formato do dado em tempo de execução |
| `types` | Tipo TypeScript gerado automaticamente a partir do schema |
| `service` | Chamada HTTP — único lugar que conhece a URL e o `httpClient` |
| `endpoints-keys` | Identificadores de cache — usados para invalidar queries por domínio |
| `query` | Hook de leitura — gerencia loading, erro, cache e refetch |
| `mutation` | Hook de escrita — executa ações e invalida o cache após sucesso |
| `hooks` | Orquestração da página — combina queries, mutations e estado local |
| `view` | Renderização — sem lógica, sem HTTP, só monta o que o usuário vê |

---

## Exemplo prático: feature "Pedido"

Imagine que precisamos mostrar os detalhes de um pedido na tela. Veja como cada camada funciona:

---

### 1. `schema/` — O contrato com a API

**O que faz:** Define o formato exato que a API retorna e valida em tempo de execução.
Se a API mudar e retornar um campo diferente do esperado, o erro aparece aqui — não em produção.

```ts
// schema/order-schema.ts
import { z } from 'zod'

export const orderSchema = z.object({
  id: z.string(),
  customerName: z.string(),
  total: z.number(),
  status: z.enum(['pending', 'shipped', 'delivered']),
  createdAt: z.string(),
})
```

> Pense no schema como um "fiscal": ele confere se o que veio da API é exatamente o que esperamos.

---

### 2. `types/` — O tipo TypeScript do dado

**O que faz:** Gera automaticamente o tipo TypeScript a partir do schema. Nunca digitado à mão.

```ts
// types/order.types.ts
import type { z } from 'zod'
import type { orderSchema } from '../schema/order-schema'

export type Order = z.infer<typeof orderSchema>
// Resultado: { id: string; customerName: string; total: number; status: 'pending' | 'shipped' | 'delivered'; createdAt: string }
```

> Se o schema mudar, o tipo muda junto automaticamente. Sem necessidade de atualizar em dois lugares.

---

### 3. `services/` — A chamada HTTP

**O que faz:** Faz a requisição para a API, valida a resposta com o schema e retorna o dado tipado.
É o único lugar que conhece a URL e o `httpClient`.

```ts
// services/get-order.service.ts
import { httpClient } from '@/shared/services'
import { logError } from '@/shared/utils'
import { orderSchema } from '../schema/order-schema'
import type { Order } from '../types/order.types'

export async function getOrderService(id: string): Promise<Order> {
  try {
    const response = await httpClient.get(`/v1/orders/${id}`)
    return orderSchema.parse(response.data)  // valida antes de retornar
  } catch (error) {
    logError('getOrderService', error)        // sempre logar antes de relançar
    throw error
  }
}
```

> O service não sabe que existe um React, um componente ou uma tela. Ele só busca e valida dado.

---

### 4. `endpoints-keys/` — As chaves de cache

**O que faz:** Define identificadores únicos para o cache de cada query.
Usado para saber o que invalidar quando um dado muda.

```ts
// endpoints-keys/order.keys.ts
export const orderQueryKeys = {
  all: ['order'] as const,
  lists: () => ['order', 'list'] as const,
  detail: (id: string) => ['order', 'detail', id] as const,
}
```

> Pense nas keys como "etiquetas" dos dados em cache. `all` invalida tudo de pedido de uma vez.

---

### 5. `queries/` — O hook de leitura

**O que faz:** Conecta o service ao React. Gerencia loading, erro, cache e refetch automaticamente.

```ts
// queries/use-order-query.ts
import { useQuery } from '@tanstack/react-query'
import { cacheTime } from '@/shared/services/queries'
import { getOrderService } from '../services/get-order.service'
import { orderQueryKeys } from '../endpoints-keys/order.keys'

export function useOrderQuery(id: string) {
  return useQuery({
    queryKey: orderQueryKeys.detail(id),
    queryFn: () => getOrderService(id),
    staleTime: cacheTime.TEN_MINUTES,   // usa constante — nunca número direto
    gcTime: cacheTime.TWENTY_MINUTES,
  })
}
```

> O query hook não sabe que existe um botão ou uma tabela. Ele só expõe `{ data, isLoading, isError }`.

---

### 6. `mutations/` — O hook de escrita

**O que faz:** Gerencia ações que alteram dados (criar, atualizar, deletar).
Após o sucesso, invalida o cache para que a tela atualize automaticamente.

```ts
// mutations/use-update-order-mutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateOrderService } from '../services/update-order.service'
import { orderQueryKeys } from '../endpoints-keys/order.keys'

export function useUpdateOrderMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateOrderService,
    onSuccess: () => {
      // invalida o cache → a query busca o dado atualizado automaticamente
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.lists() })
    },
  })
}
```

> O toast de erro já aparece automaticamente para o usuário quando a mutation falha — sem precisar fazer nada.

---

### 7. `hooks/` — A orquestração da página

**O que faz:** Combina queries, mutations e estado local (`useState`) em uma API limpa para a view.
Use quando a view precisaria de lógica para compor ou coordenar múltiplos dados — isso sai da view e vai para o hook.

**Não faz:** chamada HTTP, JSX, acesso direto ao `httpClient`.

```ts
// hooks/use-order-detail.ts
import { useState } from 'react'
import { useOrderQuery } from '../queries/use-order-query'
import { useUpdateOrderMutation } from '../mutations/use-update-order-mutation'

export function useOrderDetail(orderId: string) {
  const [isEditing, setIsEditing] = useState(false)

  const { data: order, isLoading } = useOrderQuery(orderId)
  const { mutate: updateOrder, isPending: isSaving } = useUpdateOrderMutation()

  function handleSave(payload: UpdateOrderPayload) {
    updateOrder(payload, {
      onSuccess: () => setIsEditing(false),
    })
  }

  return {
    order,
    isLoading,
    isEditing,
    isSaving,
    onEdit: () => setIsEditing(true),
    onCancel: () => setIsEditing(false),
    onSave: handleSave,
  }
}
```

> O hook é a "cola" entre os dados e a tela. A view só desestrutura o retorno e renderiza.

**Quando usar o hook de página:**
- A view precisa de **mais de um** `useQuery` ou `useMutation`
- Há `useState` ou `useCallback` relacionado a lógica de negócio (ex: controle de editar/cancelar, steps, modais)
- A view ficaria com mais de uma responsabilidade visível

**Quando o hook pode ser omitido:**
- View simples com apenas uma query e sem estado local de negócio — a query pode ser usada diretamente na view

---

### 8. `views/` — A tela

**O que faz:** Monta o que o usuário vê. Usa os hooks de página e componentes visuais.
**Não faz:** chamada HTTP, lógica de negócio, validação de dado.

```tsx
// views/order-detail.view.tsx
import PageLoading from '@/shared/components/layout/page-loading/page-loading.view'
import { PageError } from '@/shared/components'
import { useOrderDetail } from '../hooks/use-order-detail'
import { OrderCard } from '../components/order-card'

export function OrderDetailView({ orderId }: { orderId: string }) {
  const { order, isLoading, isError, isEditing, isSaving, onEdit, onCancel, onSave } = useOrderDetail(orderId)

  if (isLoading) return <PageLoading />
  if (isError) return <PageError />
  if (!order) return null

  return (
    <OrderCard
      order={order}
      isEditing={isEditing}
      isSaving={isSaving}
      onEdit={onEdit}
      onCancel={onCancel}
      onSave={onSave}
    />
  )
}
```

> A view é "burra" de propósito. Ela não sabe onde o dado veio nem como foi validado — só renderiza.

---

## Resumo do fluxo

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  schema         Define o contrato com a API (Zod)                  │
│     ↓                                                               │
│  types          Tipo TypeScript gerado automaticamente              │
│     ↓                                                               │
│  service        Faz o HTTP, valida com schema, loga erros           │
│     ↓                                                               │
│  endpoints-keys Etiquetas de cache por domínio                      │
│     ↓                                                               │
│  query          Hook de leitura (useQuery) — loading/cache/erro     │
│  mutation       Hook de escrita (useMutation) — invalida cache      │
│     ↓                                                               │
│  hooks          Orquestra queries, mutations e estado local          │
│     ↓                                                               │
│  view           Renderiza o dado — sem lógica, sem HTTP             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## O que nunca fazer

| Errado | Correto |
|--------|---------|
| Buscar dado com `useEffect` + `fetch` na view | Usar `useQuery` |
| Definir `interface Order { ... }` manualmente | Usar `z.infer<typeof orderSchema>` |
| Hardcodar `staleTime: 600000` | Usar `cacheTime.TEN_MINUTES` |
| Importar service direto na view | Passar pelo hook de query |
| Silenciar erros no `catch` | Chamar `logError(...)` e relançar |
| `if (isLoading) return <span>Carregando...</span>` | `if (isLoading) return <PageLoading />` |
| `if (isError) return <span>Erro</span>` | `if (isError) return <PageError />` |
