---
description: "Scaffolda uma nova feature completa seguindo a Feature-Based Architecture do projeto. Use quando: criar feature, novo módulo, nova página, novo domínio de negócio."
argument-hint: "Nome da feature (ex: shipment-tracking, seller-onboarding) e uma breve descrição do que ela faz"
---

# Scaffoldar Nova Feature

Crie uma feature completa em `src/modules/root/pages/$ARGUMENTS` seguindo a arquitetura do projeto.

## Passos

1. **Explore o contexto** — leia `.github/ARCHITECTURE.md` e `.github/instructions/new-feature.instructions.md` para garantir conformidade

2. **Crie a estrutura de pastas** com todos os arquivos necessários:

```
src/modules/root/pages/<feature-name>/
├── components/
│   └── __tests__/
├── hooks/
│   └── __tests__/
├── mutations/
│   └── __tests__/
├── queries/
│   └── __tests__/
├── schema/
├── services/
│   └── __tests__/
├── types/
├── views/
└── index.ts
```

3. **Gere os arquivos** na seguinte ordem:
   - `types/<nome>.types.ts` — interfaces TypeScript
   - `schema/<nome>-schema.ts` — validação Zod (formulário + resposta da API)
   - `services/get-<nome>.service.ts` — chamada HTTP com validação Zod na resposta
   - `queries/use-<nome>-query.ts` — hook TanStack Query
   - `components/<nome>-card.tsx` (ou nome adequado ao domínio)
   - `views/<nome>.view.tsx` — container principal
   - `index.ts` — Public API

4. **Gere os testes** seguindo `.github/instructions/testing.instructions.md`:
   - `services/__tests__/get-<nome>.service.spec.ts`
   - `queries/__tests__/use-<nome>-query.spec.ts`

5. **Valide** antes de entregar:
   - Nenhum `any` no TypeScript
   - Resposta da API validada com Zod no service
   - Public API no `index.ts` exporta apenas o necessário
   - View não acessa HTTP nem stores diretamente
   - Testes mockam todas as dependências com `vi.mock()`

## Resultado esperado

Lista de todos os arquivos criados com o caminho completo e um resumo do que cada camada faz na feature.
