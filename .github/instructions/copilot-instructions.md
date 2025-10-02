# Instruções do Framework de Testes Playwright MCP

## Arquitetura e Propósito do Projeto
Este é um framework de testes E2E com Playwright projetado para **criação manual e assistida por IA**, especificamente voltado para o sistema de reservas de hotéis Falkensteiner. O projeto segue uma **abordagem orientada por planos de teste** onde cenários detalhados em `test_plans/` guiam a implementação dos arquivos `tests/*.spec.ts` correspondentes.

## Padrão de Fluxo de Trabalho Essencial
1. **Comece com planos de teste**: Leia arquivos `test_plans/*.md` para entender fluxos de negócio
2. **Converta em testes**: Transforme passos detalhados em blocos `test.describe()` com agrupamentos `test.step()`
3. **Siga localizadores acessibility-first**: Use `getByRole()`, `getByLabel()`, `getByText()` ao invés de seletores CSS
4. **Execute iterativamente**: Use `npm run test:ui` para desenvolvimento interativo, `npm run test:debug` para investigar falhas

## Scripts e Comandos Principais
```bash
npm run test:ui          # Runner interativo de testes (preferido para desenvolvimento)
npm run test:debug       # Pausa em page.pause() para inspeção
npm run test:headed      # Visualiza browsers durante execução dos testes
npm run health          # Diagnostica problemas de instalação de browsers
```

## Convenções de Estrutura de Testes
- **Nomenclatura de arquivos**: `nome-funcionalidade.spec.ts` (ex: `swimming-booking.spec.ts`)
- **Blocos describe**: Use formato `test.describe('Funcionalidade - cenário')`
- **Agrupamento de passos**: Envolva ações relacionadas em `test.step('Descrição da ação')`
- **Asserções**: Sempre use `await expect()` com asserções web-first (`toHaveText`, `toHaveURL`, `toHaveCount`)

## Notas Críticas de Configuração
- **Browser único padrão**: Apenas Chromium habilitado na config (Firefox/WebKit comentados)
- **Otimização para CI**: 1 worker, 2 tentativas, `forbidOnly` no CI
- **Coleta de trace**: `trace: 'on-first-retry'` - captura automaticamente info de debug nas falhas
- **Diretório de testes**: `./tests` (crie este diretório se implementando novos testes)

## Padrão de Integração com Planos de Teste
Cada arquivo `test_plans/*.md` deve mapear para um arquivo de teste correspondente:
- `SWIMMING_BOOKING.md` → `tests/swimming-booking.spec.ts`
- Use passos detalhados dos arquivos `*_STEPS.md` como checklist de implementação
- Converta pontos de verificação em asserções específicas

## Gerenciamento de Browser e Ambiente
- **Diagnósticos de saúde**: Use `npm run health` para verificar caminhos de instalação de browsers
- **Cache local vs global**: Browsers podem instalar em `node_modules/.cache/ms-playwright` ou `$HOME/.cache/ms-playwright`
- **Dependências Linux**: Script trata erros comuns de libs ausentes (`libgtk-4.so.1`, etc.)

## Padrões Comuns para Testes de Reserva de Hotel
- **Consentimento de cookies**: Sempre trate com `await page.getByRole('button', { name: /accept/i }).click()`
- **Fluxos de navegação**: Processos de reserva multi-etapa requerem agrupamento cuidadoso de passos
- **Seleção de datas**: Widgets de calendário precisam de estratégias robustas de espera e seleção
- **Interações de formulário**: Use seletores baseados em role para dropdowns, inputs, botões

## Integração CI/CD
- **GitHub Actions**: Workflow pré-configurado executa testes Chromium em push/PR
- **Artefatos**: Relatórios HTML e traces automaticamente enviados nas falhas
- **Timeout**: Timeout de job de 30 minutos para lidar com fluxos complexos de reserva

## Ao Criar Novos Testes
1. Verifique se existe plano de teste correspondente em `test_plans/`
2. Siga a hierarquia de localizadores accessibility-first de `.github/instructions/playwright.instructions.md`
3. Use `beforeEach` para configuração comum (navegação, estado de login)
4. Agrupe ações relacionadas com `test.step()` para melhor relatório
5. Teste localmente com `npm run test:ui` antes de fazer commit

## Debugando Testes com Falha
1. Use `npm run test:debug` e adicione `await page.pause()` nos pontos de falha
2. Verifique saída do `npm run health` se o browser não iniciar
3. Revise traces no relatório HTML: `npm run report`
4. Use modo `--headed` para ver interações reais do browser durante desenvolvimento

## Modos de Chat e Prompts Especializados
Este projeto inclui prompts e modos de chat pré-configurados em `.github/` para diferentes fluxos de trabalho:

### Modos de Chat Disponíveis (`/.github/chatmodes/`)
- **test-generator**: Gera testes Playwright explorando sites sistematicamente
- **test-explorer**: Explora sites para mapeamento de funcionalidades
- **playwright-tester**: Modo completo para exploração + geração + execução de testes
- **test-generator-from-plan**: Converte planos de teste manuais em testes automatizados

### Prompts Especializados (`/.github/prompts/`)
- **generate-tests.prompt.md**: Geração sistemática de testes baseada em cenários
- **manual-test-report.prompt.md**: Criação de relatórios de teste manual
- **explore-website.prompt.md**: Exploração estruturada de websites
- **book-swimming-lesson.prompt.md**: Exemplo específico de automação de reserva

## Script de Diagnóstico Avançado (`scripts/health.js`)
O script `npm run health` fornece diagnóstico detalhado:
- **Detecção de cache**: Local (`node_modules/.cache/`) vs global (`$HOME/.cache/`)
- **Verificação de libs Linux**: Detecta bibliotecas ausentes (`libgtk-4.so.1`, etc.)
- **Caminho de binários**: Mostra localização exata do executável Chromium
- **Variáveis de ambiente**: Verifica `PLAYWRIGHT_BROWSERS_PATH`

## Integração MCP (Model Context Protocol)
Projeto otimizado para trabalhar com servidores MCP:
- **Playwright MCP**: Controle programático de browsers via protocol MCP
- **Context7**: Integração para documentação atualizada de bibliotecas
- **Exploração interativa**: Navegação e teste através de interfaces MCP

## Configuração de Regras Automáticas para Context7
Para invocar automaticamente o Context7 ao solicitar documentação ou exemplos de código, configure regras no seu editor:

### VS Code (GitHub Copilot Chat)
No VS Code com GitHub Copilot, configure nas configurações do workspace ou usuário:
```json
{
  "github.copilot.chat.rules": [
    {
      "name": "Context7 Auto-invoke",
      "description": "Automaticamente invocar Context7 para documentação e exemplos",
      "pattern": "documentação|exemplos|código|configuração|API|biblioteca",
      "action": "invoke-context7"
    }
  ]
}
```

Ou adicione ao arquivo `.vscode/settings.json` do projeto:
```json
{
  "github.copilot.chat.welcomeMessage": "Para documentação do Playwright ou exemplos de código, digite '@context7' seguido da sua pergunta.",
  "github.copilot.chat.instructions": "Quando solicitado documentação de APIs, exemplos de código ou configuração, sempre considere usar o Context7 para obter informações atualizadas."
}
```

### Outros Editores MCP
Configure regras similares para invocar Context7 automaticamente em questões relacionadas a:
- Documentação de APIs do Playwright
- Exemplos de localizadores e asserções
- Configuração de testes E2E
- Padrões de boas práticas