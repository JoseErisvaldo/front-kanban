---
applyTo: "src/**/*.spec.{ts,tsx}"
---

# Testes — puxadinho-front

Ao criar ou revisar testes, siga rigorosamente as regras abaixo. O projeto usa **Vitest** + **Testing Library**.

---

## Regras Obrigatórias

1. **Toda dependência externa deve ser mockada** com `vi.mock()` — sem chamadas reais a APIs, stores ou módulos de terceiros
2. **Sem implementação real nos mocks** — use `vi.fn()`, `vi.mocked()` e valores fixos
3. Cobrir sempre: caminho feliz, erros esperados e edge cases relevantes
4. Assertions com `expect()` — nunca deixar teste sem assertion

---

## Estrutura de um Teste de Service

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { httpClient } from '@/shared/services'
import { logError } from '@/shared/utils'
import { getMyEntityService } from '../get-my-entity.service'
import { myEntityResponseSchema } from '../../schema/my-entity-schema'

vi.mock('@/shared/services', () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

vi.mock('@/shared/utils', () => ({
  logError: vi.fn(),
}))

vi.mock('../../schema/my-entity-schema', () => ({
  myEntityResponseSchema: { parse: vi.fn() },
}))

describe('getMyEntityService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve chamar o endpoint correto e retornar o dado parseado', async () => {
    const responseData = {
      id: 'ent-001',
      name: 'Entidade Exemplo',
      status: 'ACTIVE',
      createdAt: '2024-01-15T10:30:00Z',
    }

    vi.mocked(httpClient.get).mockResolvedValue({ data: responseData })
    vi.mocked(myEntityResponseSchema.parse).mockReturnValue(responseData)

    const result = await getMyEntityService('ent-001')

    expect(httpClient.get).toHaveBeenCalledWith('/v1/my-entity/ent-001')
    expect(myEntityResponseSchema.parse).toHaveBeenCalledWith(responseData)
    expect(result).toEqual(responseData)
  })

  it('deve registrar e relançar erro quando a requisição falha', async () => {
    const error = new Error('Network Error')
    vi.mocked(httpClient.get).mockRejectedValue(error)

    await expect(getMyEntityService('ent-001')).rejects.toThrow('Network Error')

    expect(logError).toHaveBeenCalledWith('getMyEntityService', error)
  })

  it('deve registrar e relançar erro quando o schema falha', async () => {
    const responseData = { id: 'ent-001', name: 'Entidade Exemplo' }
    const error = new Error('schema inválido')

    vi.mocked(httpClient.get).mockResolvedValue({ data: responseData })
    vi.mocked(myEntityResponseSchema.parse).mockImplementation(() => {
      throw error
    })

    await expect(getMyEntityService('ent-001')).rejects.toThrow('schema inválido')

    expect(logError).toHaveBeenCalledWith('getMyEntityService', error)
  })
})
```

---

## Estrutura de um Teste de Query Hook

```ts
import { renderHook, waitFor } from '@testing-library/react'
import { useQuery } from '@tanstack/react-query'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useMyEntityQuery } from '../use-my-entity-query'
import { myEntityQueryKeys } from '../../endpoints-keys/my-entity.keys'
import type { MyEntity } from '../../types/my-entity.types'
import { createQueryWrapper } from '@/shared/mock'

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}))

describe('useMyEntityQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve chamar useQuery com a queryKey e queryFn corretas', () => {
    useMyEntityQuery('ent-001')

    expect(vi.mocked(useQuery)).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: myEntityQueryKeys.detail('ent-001'),
        retry: false,
      })
    )
  })

  it('deve retornar os dados quando o serviço resolve', async () => {
    const responseData: MyEntity = {
      id: 'ent-001',
      name: 'Entidade Exemplo',
      status: 'ACTIVE',
      createdAt: '2024-01-15T10:30:00Z',
    }
    vi.mocked(useQuery).mockReturnValueOnce({
      data: responseData,
      isSuccess: true,
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useMyEntityQuery>)

    const { result } = renderHook(() => useMyEntityQuery('ent-001'), {
      wrapper: createQueryWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(responseData)
  })

  it('deve retornar o valor retornado pelo useQuery', () => {
    const expected = { data: undefined, isLoading: true, isSuccess: false }
    vi.mocked(useQuery).mockReturnValueOnce(expected as never)

    expect(useMyEntityQuery('ent-001')).toBe(expected)
  })
})
```

---

## Estrutura de um Teste de Componente

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { MyComponent } from '../my-component'

describe('MyComponent', () => {
  it('deve renderizar o título corretamente', () => {
    render(<MyComponent title="Teste" onSubmit={vi.fn()} />)

    expect(screen.getByText('Teste')).toBeInTheDocument()
  })

  it('deve chamar onSubmit ao clicar no botão', async () => {
    const onSubmit = vi.fn()
    render(<MyComponent title="Teste" onSubmit={onSubmit} />)

    await userEvent.click(screen.getByRole('button', { name: /confirmar/i }))

    expect(onSubmit).toHaveBeenCalledOnce()
  })
})
```

---

## Estrutura de um Teste de Mutation Hook

```ts
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, act } from '@testing-library/react'
import React from 'react'
import { type Mock, describe, it, expect, vi, beforeEach } from 'vitest'
import { useUpdateMyEntityMutation } from '../use-update-my-entity-mutation'
import { updateMyEntityService } from '../../services/update-my-entity.service'
import { myEntityQueryKeys } from '../../endpoints-keys/my-entity.keys'

vi.mock('../../services/update-my-entity.service', () => ({
  updateMyEntityService: vi.fn(),
}))

vi.mock('../../endpoints-keys/my-entity.keys', () => ({
  myEntityQueryKeys: {
    all: ['my-entity'],
  },
}))

describe('useUpdateMyEntityMutation', () => {
  let queryClient: QueryClient

  const createWrapper = () =>
    ({ children }: { children: React.ReactNode }) =>
      React.createElement(QueryClientProvider, { client: queryClient }, children)

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
    vi.clearAllMocks()
  })

  it('deve inicializar com estado ocioso', () => {
    const { result } = renderHook(() => useUpdateMyEntityMutation(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isIdle).toBe(true)
    expect(result.current.isPending).toBe(false)
  })

  it('deve chamar o serviço com o payload correto', async () => {
    const payload = { id: 'ent-001', name: 'Nome Atualizado' }
    ;(updateMyEntityService as Mock).mockResolvedValue(undefined)

    const { result } = renderHook(() => useUpdateMyEntityMutation(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.mutate(payload)
    })

    expect(updateMyEntityService).toHaveBeenCalledWith(payload)
    expect(updateMyEntityService).toHaveBeenCalledTimes(1)
  })

  it('deve invalidar as queries corretas ao ter sucesso', async () => {
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries')
    ;(updateMyEntityService as Mock).mockResolvedValue(undefined)

    const { result } = renderHook(() => useUpdateMyEntityMutation(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.mutate({ id: 'ent-001', name: 'Nome Atualizado' })
    })

    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: myEntityQueryKeys.all,
    })
  })

  it('não deve invalidar queries quando o serviço falha', async () => {
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries')
    ;(updateMyEntityService as Mock).mockRejectedValue(new Error('Falha na API'))

    const { result } = renderHook(() => useUpdateMyEntityMutation(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      result.current.mutate({ id: 'ent-001', name: 'Nome Atualizado' })
    })

    expect(invalidateQueries).not.toHaveBeenCalled()
  })

  it('deve expor isError quando o serviço falha', async () => {
    ;(updateMyEntityService as Mock).mockRejectedValue(new Error('Falha na API'))

    const { result } = renderHook(() => useUpdateMyEntityMutation(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      result.current.mutate({ id: 'ent-001', name: 'Nome Atualizado' })
    })

    expect(result.current.isError).toBe(true)
  })
})
```

---

## Estrutura de um Teste de Helper de Invalidação

Use quando testar `helpers/invalidate-<nome>-queries.ts` — funções que agrupam invalidações de múltiplos domínios:

```ts
import type { QueryClient } from '@tanstack/react-query'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { myEntityQueryKeys } from '../../endpoints-keys/my-entity.keys'
import { otherDomainKeys } from '@/shared/cross-features/other-domain/endpoints-keys/other-domain.keys'
import { invalidateMyEntityQueries } from '../invalidate-my-entity-queries'

describe('invalidateMyEntityQueries', () => {
  let mockQueryClient: { invalidateQueries: ReturnType<typeof vi.fn> }

  beforeEach(() => {
    mockQueryClient = { invalidateQueries: vi.fn() }
  })

  it('deve invalidar queries do domínio my-entity', () => {
    invalidateMyEntityQueries(mockQueryClient as unknown as QueryClient)

    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: myEntityQueryKeys.all,
    })
  })

  it('deve invalidar queries do domínio other-domain', () => {
    invalidateMyEntityQueries(mockQueryClient as unknown as QueryClient)

    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: otherDomainKeys.all,
    })
  })

  it('deve chamar invalidateQueries o número correto de vezes', () => {
    invalidateMyEntityQueries(mockQueryClient as unknown as QueryClient)

    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledTimes(2)
  })

  it('deve invalidar as queries na ordem correta', () => {
    invalidateMyEntityQueries(mockQueryClient as unknown as QueryClient)

    const calls = mockQueryClient.invalidateQueries.mock.calls
    expect(calls[0]).toEqual([{ queryKey: myEntityQueryKeys.all }])
    expect(calls[1]).toEqual([{ queryKey: otherDomainKeys.all }])
  })

  it('não deve lançar erro ao executar', () => {
    expect(() =>
      invalidateMyEntityQueries(mockQueryClient as unknown as QueryClient)
    ).not.toThrow()
  })
})
```

---

## O que NÃO fazer

```ts
// ❌ Chamada HTTP real — sem mock
it('busca dados', async () => {
  const result = await getMyEntityService('123') // requisição real!
})

// ❌ Teste sem assertion
it('renderiza componente', () => {
  render(<MyComponent />)
  // nenhum expect!
})

// ❌ any em mock
vi.mock('@/shared/services', () => ({
  httpClient: {} as any,
}))
```
