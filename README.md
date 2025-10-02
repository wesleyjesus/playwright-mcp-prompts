# playwright-mcp-prompts

Coleção e fluxo de trabalho para criação **manual** e **assistida/automatizada** de testes end‑to‑end com Playwright.

## 🎯 Objetivo
Fornecer uma base simples para:
- Rodar testes E2E em linha de comando, UI runner ou modo debug
- Gerar esboços de testes automaticamente (codegen / UI)
- Escrever testes manualmente seguindo boas práticas de locators e assertions
- Reaproveitar planos de teste em `test_plans/` como guia de cobertura

---
## 📂 Estrutura do Projeto

```
.
├── playwright.config.ts        # Configuração do Playwright
├── package.json                # Scripts e dependências
├── test_plans/                 # Planos de teste em formato Markdown
│   ├── SWIMMING_BOOKING.md
│   └── SWIMMING_BOOKING_STEPS.md
└── tests/                      # (Crie aqui seus arquivos *.spec.ts)
```

Se a pasta `tests/` ainda não existir, basta criá‑la.

---
## 🧩 Requisitos

1. Node.js (LTS recomendada)
2. Dependências nativas para browsers (Linux) – se faltar, o Playwright avisa (ex: `libgtk-4.so.1`, `libgraphene-1.0.so.0`, `libavif.so.16`). Veja seção Troubleshooting.

---
## ⚙️ Instalação

```bash
npm install            # Instala dependências e (via postinstall) baixa browsers
# (Opcional) repetir instalação dos browsers
npm run browsers       # Equivale a: npx playwright install
```

Verificar versão:
```bash
npx playwright --version
```

### Cache de Browsers
O Playwright pode armazenar os navegadores:
1. Dentro do projeto: `node_modules/.cache/ms-playwright` (se variável `PLAYWRIGHT_BROWSERS_PATH=0` ou padrão e primeira instalação local)
2. Em cache global: `$HOME/.cache/ms-playwright` (reutilização entre múltiplos projetos)
3. Caminho custom: se você definir `PLAYWRIGHT_BROWSERS_PATH=/algum/caminho`

Se o instalador disser "already downloaded" e o diretório local não existir, provavelmente está usando o cache global.

Para forçar cache local dentro do repositório:
```bash
export PLAYWRIGHT_BROWSERS_PATH=.pw-browsers
npx playwright install --force
```
Depois rode `npm run health` para ver o caminho do executável.

---
## 🚀 Scripts Disponíveis

| Script | Comando | Descrição |
|--------|---------|-----------|
| `test` | `npm test` | Executa todos os testes em modo headless |
| `test:headed` | `npm run test:headed` | Abre browsers com interface |
| `test:debug` | `npm run test:debug` | Pausa em `page.pause()` / inspector |
| `test:ui` | `npm run test:ui` | UI runner interativo (escolher/filtrar testes) |
| `report` | `npm run report` | Abre o relatório gerado (`playwright-report/`) |
| `browsers` | `npm run browsers` | (Re)instala os executáveis de browsers |
| `health` | `npm run health` | Diagnóstico de ambiente e caches |

Execução granular:
```bash
npx playwright test tests/smoke.spec.ts --project=chromium
npx playwright test -g "buscar filme"   # Filtra pelo título do teste
```

---
## 🛠️ Formas de Criar/Gerar Testes

### 1. Manual (recomendado para solidez)
Crie um arquivo em `tests/`:
```
tests/
	exemplo.spec.ts
```
Modelo básico:
```ts
import { test, expect } from '@playwright/test';

test.describe('Página Example', () => {
	test('deve exibir o título correto', async ({ page }) => {
		await page.goto('https://example.com');
		await expect(page).toHaveTitle(/Example Domain/);
	});
});
```

### 2. Via Codegen (gerar esqueleto a partir de cliques)
```bash
npx playwright codegen https://example.com
```
Edite o resultado substituindo locators frágeis (ex: `nth-child`) por locators de acessibilidade.

### 3. UI Runner (escrever e rodar incrementalmente)
```bash
npm run test:ui
```
Permite re‑execução rápida, inspeção de trace e filtering.

### 4. Ajustando Testes Gerados
Sempre revise:
- Remover ações redundantes (ex: cliques em `<body>`)
- Substituir `page.waitForTimeout` por assertions (`await expect(...)`)
- Garantir que URLs e textos sejam assertivos (nem sobre-específicos, nem vagos)

---
## ✅ Boas Práticas (Resumo)
Baseado em `.github/instructions/playwright.instructions.md`:
1. Prefira locators de acessibilidade: `getByRole`, `getByLabel`, `getByPlaceholder`, `getByText`.
2. Use `test.step()` para agrupar ações relevantes.
3. Assertions web‑first com `await expect(...)` (não adicionar sleeps manuais).
4. Use `toHaveURL`, `toHaveText`, `toContainText`, `toHaveCount` conforme o contexto.
5. Títulos de testes claros: `Recurso - comportamento esperado`.
6. Um arquivo por feature principal facilita manutenção.

Exemplo de passo agrupado:
```ts
await test.step('Pesquisar por Garfield', async () => {
	await page.getByRole('search').click();
	await page.getByRole('textbox', { name: 'Search Input' }).fill('Garfield');
	await page.keyboard.press('Enter');
	await expect(page.getByText('Garfield')).toBeVisible();
});
```

---
## 🗂️ Uso dos Planos de Teste (`test_plans/`)
1. Leia o arquivo principal (ex: `SWIMMING_BOOKING.md`) para entender o fluxo macro.
2. Use o arquivo de passos detalhados (`*_STEPS.md`) como checklist de cenários.
3. Para cada cenário converta em um `test()` ou `test.describe()` agrupado.
4. Marque cenários críticos primeiro (ex: reserva feliz / fluxo principal) antes de casos de borda.

Sugestão de mapeamento:
| Plano | Arquivo de teste sugerido |
|-------|---------------------------|
| SWIMMING_BOOKING | `tests/swimming-booking.spec.ts` |

---
## 🧪 Estrutura Recomendada de Arquivos
```
tests/
	swimming-booking.spec.ts     # Fluxos principais
	swimming-booking-edge.spec.ts# Casos de erro/borda
	common/fixtures.ts           # (Opcional) fixtures customizadas
```

Para fixtures customizadas:
```ts
// tests/common/fixtures.ts
import { test as base } from '@playwright/test';
export const test = base.extend<{ /* fixture types */ }>({});
export { expect } from '@playwright/test';
```

---
## 📊 Relatórios & Trace
Depois de rodar testes:
```bash
npx playwright show-report
```
Gerar trace em falhas / sempre:
```bash
npx playwright test --trace=on
```
Abrir trace:
```bash
npx playwright show-trace trace.zip
```

---
## 🛠️ Troubleshooting

| Problema | Causa | Solução |
|----------|-------|---------|
| `Cannot find module '@playwright/test'` | Dependências não instaladas | `npm install` |
| `command not found: browsers` | Usou script sem `npm run` | `npm run browsers` |
| `Missing libraries: libgtk-4.so.1 ...` | Bibliotecas nativas ausentes | Instalar libs do sistema (ver abaixo) |
| UI não abre | Ambiente headless sem libs | Instalar dependências ou usar container oficial |
| Cache global mas sem pasta local | Playwright reutiliza `$HOME/.cache/ms-playwright` | Rodar `npm run health` para confirmar |

### Linux (Debian/Ubuntu) – libs comuns
```bash
sudo apt-get update
sudo apt-get install -y libgtk-4-1 libgraphene-1.0-0 libavif16 \
	libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libxkbcommon0 \
	libxdamage1 libxcomposite1 libxrandr2 libxext6 libxfixes3 libxshmfence1 \
	libasound2 libdrm2 libgbm1 libpango-1.0-0 libcairo2 libx11-xcb1
```

Reinstalar navegadores com dependências:
```bash
sudo npx playwright install --with-deps
```

### Usando Docker (alternativa)
```bash
docker run -it --rm -v "$PWD":"/work" -w /work mcr.microsoft.com/playwright:v1.55.1-jammy bash
npm ci
npx playwright test
```

---
## 🧱 Convenções de Nome
| Tipo | Convenção |
|------|-----------|
| Arquivo de teste | `feature-name.spec.ts` |
| Bloco describe | `Feature - cenário` |
| Teste | frase declarativa do comportamento |

---
## 🧪 Exemplo Completo
```ts
import { test, expect } from '@playwright/test';

test.describe('Busca de Filmes - fluxo feliz', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('https://debs-obrien.github.io/playwright-movies-app');
	});

	test('pesquisar por Garfield e ver resultado', async ({ page }) => {
		await test.step('Executar a busca', async () => {
			await page.getByRole('search').click();
			await page.getByRole('textbox', { name: 'Search Input' }).fill('Garfield');
			await page.keyboard.press('Enter');
		});
		await expect(page.getByText(/Garfield/i)).toBeVisible();
	});
});
```

---
## 🔍 Próximos Passos Sugeridos
1. Criar pasta `tests/` (se ainda não existir).
2. Converter cenários de `SWIMMING_BOOKING_STEPS.md` em testes.
3. Adicionar trace somente em falhas (`trace: 'on-first-retry'`) no `playwright.config.ts` (opcional).
4. Integrar em CI (GitHub Actions) – já há exemplo abaixo.

---
## 🌀 Integração Contínua (GitHub Actions)
Pipeline de exemplo criado em `.github/workflows/playwright.yml`:

Características:
- Roda em `push` e `pull_request` para `main`.
- Usa Node 20 + `npm ci` (cache do npm ativo).
- Instala browsers com `--with-deps` (garante libs no runner).
- Executa somente projeto `chromium` (ajuste em `--project=` para incluir mais browsers).
- Publica artefatos: relatório HTML (`playwright-report/`) e traces (pasta `traces/` se existir).

Para habilitar múltiplos browsers, descomente no `playwright.config.ts` as seções de `firefox` e `webkit` e altere o passo:
```yaml
			- name: Run tests (All browsers)
				run: npx playwright test --reporter=line
```

Se quiser falhar mais cedo em PRs longos, pode restringir workers:
```yaml
				env:
					CI: true
```
(`forbidOnly` e `retries` já dependem dessa variável.)

Adicionar badge ao topo do README:
```markdown
![Playwright Tests](https://github.com/SEU_USUARIO/playwright-mcp-prompts/actions/workflows/playwright.yml/badge.svg)
```

---
## 📜 Licença
MIT – ver `package.json`.

---
## 🙋 Suporte
Se precisar de exemplos adicionais ou integração em pipeline CI peça aqui que adicionamos.

