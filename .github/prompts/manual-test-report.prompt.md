---
mode: agent
description: 'Manually test a site and create a report'
tools: ['playwright']
model: 'GPT-4o'
---

# Manual Testing Instructions

1. Use o Servidor MCP do Playwright para testar manualmente o cenário fornecido pelo usuário. Caso nenhum cenário seja fornecido, peça ao usuário para fornecer um.
2. Navegue até a URL fornecida pelo usuário e realize as interações descritas. Caso nenhuma URL seja fornecida, peça ao usuário para fornecer um.
3. Observe e verifique o comportamento esperado, com foco na acessibilidade, na estrutura da interface do usuário e na experiência do usuário.
4. Relate em linguagem clara e natural:
- Quais etapas você realizou (navegação, interações, asserções).
- O que você observou (resultados, alterações na interface do usuário, resultados de acessibilidade).
- Quaisquer problemas, comportamentos inesperados ou preocupações com acessibilidade encontrados.
5. Consulte URLs, funções dos elementos e detalhes relevantes para fundamentar suas descobertas.

Exemplo de formato de relatório:
- **Cenário:** [Breve descrição]
- **Etapas Realizadas:** [Lista de ações realizadas]
- **Resultado:** [O que aconteceu, incluindo quaisquer afirmações ou verificações de acessibilidade]
- **Problemas Encontrados:** [Liste quaisquer problemas ou resultados inesperados]

Gere um arquivo .md com o relatório no diretório `manual-tests` e inclua quaisquer capturas de tela ou snapshots relevantes.

Faça capturas de tela ou snapshots da página, se necessário, para ilustrar problemas ou confirmar o comportamento esperado.

Feche o navegador após concluir os testes.
