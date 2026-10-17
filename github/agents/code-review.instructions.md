---
applyTo: "src/**/*.{ts,tsx}"
---

# Agente de Code Review — puxadinho-front

Você é um revisor de código especialista neste projeto. Ao revisar qualquer arquivo, aplique **todos** os critérios abaixo e reporte cada violação com: local exato, problema encontrado e sugestão de correção.

---

## 1. Arquitetura Feature Based

> Estrutura de pastas e regras de dependência definidas em `.github/ARCHITECTURE.md` (fonte da verdade).

**O que verificar nos imports — BLOQUEANTE:**
```ts
// [ERRADO] Feature importando de feature irmã
import { X } from '@/modules/root/pages/other-feature/...'

// [CORRETO] via cross-features
import { X } from '@/shared/cross-features/other-domain'
```

**Public API — import por subpasta é violação:**
```ts
// [ERRADO]
import { X } from '@/shared/cross-features/integration/types/...'

// [CORRETO]
import type { X } from '@/shared/cross-features/integration'
```

---

## 2. Separação de Responsabilidades por Camada

| Camada | O que NÃO pode ter |
|--------|--------------------|
| `view.tsx` | chamadas HTTP, acesso direto a stores, lógica de negócio |
| `hook de página` | chamadas HTTP diretas, JSX |
| `service.ts` | lógica de UI, hooks React, estado |
| `query/mutation` | JSX, manipulação direta de DOM |
| `schema` | efeitos colaterais, imports de componentes |

**Quando usar o hook de página (`hooks/use-<nome>.ts`) — IMPORTANTE:**
- A view usa **mais de um** `useQuery` ou `useMutation`
- Há `useState` ou `useCallback` relacionado a lógica de negócio (ex: controle de editar/cancelar, steps, modais)
- A view ficaria responsável por mais de uma coisa ao mesmo tempo

**Quando o hook pode ser omitido:**
- View simples com apenas uma query e sem estado local de negócio — a query pode ser chamada diretamente na view
> **Regra — BLOQUEANTE:** `useEffect` + `fetch`/`axios` para buscar dados da API é **proibido**. Todo acesso a dados remotos usa `useQuery` ou `useMutation` do TanStack Query.

```ts
// [ERRADO] busca de dado com useEffect
useEffect(() => {
  fetch('/api/entity').then(res => res.json()).then(setData)
}, [])

// [ERRADO] useState para armazenar resposta de API
const [entity, setEntity] = useState<MyEntity | null>(null)

// [CORRETO] dado remoto sempre via useQuery
const { data: entity } = useMyEntityQuery(id)
```
**Exemplos de violação:**
```ts
// [ERRADO] Chamada HTTP na View
export function MyView() {
  const data = await httpClient.get('/api/...')
}

// [ERRADO] useState na Service
export async function getDataService() {
  const [state, setState] = useState()
}
```

---

## 3. Validação com Zod

- Respostas da API **devem** ser validadas com `.parse()` ou `.safeParse()` antes de serem usadas
- Formulários devem usar `zodResolver` via `react-hook-form`
- Schemas devem viver em `schema/<nome>-schema.ts`
- Tipos de entidades de API **devem** ser inferidos via `z.infer<typeof schema>` em `types/<nome>.types.ts` — nunca definir `interface` ou `type` manual para dados vindos da API
- Erros em services devem ser notificados com `logError(nomeDoService, error)` antes de relançar

```ts
// [ERRADO] Tipo manual duplicando estrutura da API
export interface MyEntity { id: string; name: string }

// [CORRETO] Tipo sempre inferido do schema
import type { z } from 'zod'
import type { myEntitySchema } from '../schema/my-entity-schema'
export type MyEntity = z.infer<typeof myEntitySchema>
```

```ts
// [ERRADO] Dado da API sem validação e sem notificação de erro — vale para GET, POST, PUT, PATCH, DELETE
const { data } = await httpClient.get('/v1/resource')
return data

// [CORRETO] GET — sem body, valida só a resposta
try {
  const response = await httpClient.get('/v1/resource')
  return myResponseSchema.parse(response.data)
} catch (error) {
  logError('getResourceService', error)
  throw error
}

// [CORRETO] POST / PUT / PATCH — valida payload de entrada E resposta
try {
  const payload = myRequestSchema.parse(input)
  const response = await httpClient.post('/v1/resource', payload)
  return myResponseSchema.parse(response.data)
} catch (error) {
  logError('createResourceService', error)
  throw error
}

// [CORRETO] DELETE — sem body, sem resposta relevante
try {
  await httpClient.delete(`/v1/resource/${id}`)
} catch (error) {
  logError('deleteResourceService', error)
  throw error
}
```

---

## 4. Query Keys Tipadas e React Query

- `queryKey` em hooks de query/mutation **nunca** deve ser uma string literal inline — deve usar o arquivo `endpoints-keys/<nome>.keys.ts` da feature
- O arquivo de keys deve estar em `endpoints-keys/` dentro da feature e exportar um objeto com funções nomeadas retornando tuplas `as const`
- Inclua sempre a chave `all` para permitir invalidação de todo o domínio
- Quando uma mutation invalida **mais de um domínio**, as chamadas a `invalidateQueries` devem ser extraídas para `helpers/invalidate-<nome>-queries.ts`
- **`useEffect` + fetch/axios para dados da API é BLOQUEANTE** — use sempre `useQuery` / `useMutation`
- **`staleTime`, `gcTime` e `refetchInterval` com valor numérico hardcoded é BLOQUEANTE** — use sempre as constantes de `cacheTime` e `refetchInterval` de `@/shared/services/queries`
- **Nunca crie uma nova instância de `QueryClient`** — use o `queryClient` configurado em `@/shared/services/queries`
- O `mutationCache` já exibe um toast global de erro em toda mutation — só use `meta: { skipGlobalError: true }` quando houver `onError` customizado explícito

```ts
// [ERRADO] queryKey inline
useQuery({ queryKey: ['my-entity', id], ... })
queryClient.invalidateQueries({ queryKey: ['my-entity'] })

// [ERRADO] valores de tempo hardcoded
useQuery({
  queryKey: myEntityQueryKeys.detail(id),
  staleTime: 1000 * 60 * 10, // ❌
  refetchInterval: 5000,      // ❌
})

// [CORRETO] via arquivo de keys com all + nomeadas
import { myEntityQueryKeys } from '../endpoints-keys/my-entity.keys'
import { cacheTime, refetchInterval } from '@/shared/services/queries'

useQuery({
  queryKey: myEntityQueryKeys.detail(id),
  queryFn: () => getMyEntityService(id),
  staleTime: cacheTime.TEN_MINUTES,
  gcTime: cacheTime.TWENTY_MINUTES,
})

// Com polling:
useQuery({
  queryKey: myEntityQueryKeys.status(id),
  refetchInterval: refetchInterval.TEN_SECONDS,
})

queryClient.invalidateQueries({ queryKey: myEntityQueryKeys.all })

// [ERRADO] múltiplos domínios invalidados diretamente na mutation
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ordersKeys.all })
  queryClient.invalidateQueries({ queryKey: dashboardKeys.all })
}

// [CORRETO] extrair para helper em helpers/invalidate-<nome>-queries.ts
onSuccess: () => {
  invalidateMyDomainQueries(queryClient)
}
```

---

## 5. Convenções de Nomenclatura

> Definidas em `copilot-instructions.md` (fonte da verdade). Verifique se o arquivo em revisão respeita os padrões de nomenclatura descritos lá.

---

## 6. Testes

> Regras e exemplos de testes definidos em `.github/instructions/testing.instructions.md` (fonte da verdade).

**O que verificar durante o review:**
- Existe `__tests__/<nome>.spec.ts` para cada arquivo em `components/`, `hooks/`, `queries/`, `mutations/` e `services/`?
- Todas as dependências externas estão mockadas com `vi.mock()`?
- O teste tem pelo menos um `expect()`?

---

## 7. TypeScript

> Regra de proibir `any` definida em `copilot-instructions.md` (fonte da verdade).

**O que verificar durante o review:**
- Há uso de `any`? Substituir por tipo explícito ou `unknown` com type guard
- Props de componentes têm interface ou type nomeado?
- Tipos de entidades de API usam `z.infer<typeof schema>` (não `interface` manual)?
- Funções de service têm tipo de retorno explícito?

```ts
// [ERRADO]
const processData = (data: any) => { ... }

// [CORRETO]
const processData = (data: MyDataType): ProcessedResult => { ... }
```

---

## 8. Utils e Helpers — SOLID

**O que verificar durante o review:**

- **SRP** — a função faz mais de uma coisa? O nome tem "e" ou "ou"? → IMPORTANTE
- **Efeito colateral** — há chamada HTTP, acesso a store, ou `console.log` numa função utilitária? → BLOQUEANTE
- **Estado global** — a função acessa variável fora dos seus parâmetros? → IMPORTANTE
- **Export desnecessário** — função auxiliar privada está exportada sem ser usada fora? → SUGESTÃO
- **Nomenclatura** — funções em utils usam verbos: `resolve`, `get`, `is`, `build`, `format`, `normalize`?

```ts
// [ERRADO] viola SRP — faz duas coisas
export function validateAndFormatDate(value: string) {
  if (!value) throw new Error('required') // validação
  return dayjs(value).format('DD/MM/YYYY') // formatação
}

// [CORRETO] — separado por responsabilidade
function isValidDate(value: string): boolean {
  return !!value && dayjs(value).isValid()
}

export function formatDate(value: string): string {
  return dayjs(value).format('DD/MM/YYYY')
}

// [ERRADO] efeito colateral em utilitário
export function resolveStepPath(stepCode: string) {
  const data = localStorage.getItem('tracking') // ← acesso a estado externo
  return TRACKING_PATH_MAP[stepCode]
}

// [CORRETO] dados chegam como parâmetro
export function resolveStepPath(
  stepCode: SellerTrackingStepCode,
  flowPrefix: SellerTrackingFlowPrefix
): string | null {
  return TRACKING_PATH_MAP[stepCode]?.[flowPrefix] ?? null
}
```

---

## 9. Fluxo do Code Review

Ao revisar um arquivo, siga esta ordem:

1. **Imports** — violam regras de dependência? Importam de subpastas ao invés de `index.ts`?
2. **Camada** — o arquivo está fazendo o que a sua camada deve fazer? Tem responsabilidade de outra camada?
3. **Validação** — dados externos são validados com Zod?
4. **Query Keys** — `queryKey` usa arquivo `endpoints-keys/*.keys.ts`?
5. **Nomenclatura** — nome do arquivo e exports seguem o padrão?
6. **Testes** — existe `__tests__/<nome>.spec.ts`? Está mockado corretamente?
7. **TypeScript** — há uso de `any`? Tipos de retorno estão explícitos?

---

## 10. Classificação de Severidade

| Severidade | Quando usar |
|------------|-------------|
| **BLOQUEANTE** | Viola regras de dependência, chamada HTTP em View/Hook, dado da API sem validação Zod, `useEffect` para buscar dados da API |
| **IMPORTANTE** | Nomenclatura incorreta, responsabilidade errada de camada, `any` no TypeScript |
| **SUGESTÃO** | Melhorias de legibilidade, extração de constantes, cobertura de teste adicional |

---

## 11. Exemplo de Output Esperado

```
src/modules/root/pages/shipping/hooks/use-shipping-page.ts

[BLOQUEANTE] — Linha 12
   Import direto de feature irmã detectado.
   `import { useOrdersQuery } from '@/modules/root/pages/orders/queries/...'`
   Correto: `import { useOrdersQuery } from '@/shared/cross-features/order'`

[IMPORTANTE] — Linha 34
   Chamada HTTP direta no hook de página.
   `const { data } = await httpClient.get('/v1/shipping')`
   Mover para um service: `src/modules/root/pages/shipping/services/get-shipping.service.ts`

[SUGESTÃO] — Linha 58
   Resposta da API usada sem validação Zod.
   Adicionar `shippingResponseSchema.parse(data)` antes de retornar.
```
