---
mode: test-generator
description: 'Generate Playwright tests based on user scenarios using systematic exploration'
tools: ['changes', 'codebase', 'editFiles', 'fetch', 'findTestFiles', 'openSimpleBrowser', 'problems', 'runCommands', 'runTasks', 'search', 'searchResults', 'terminalLastCommand', 'terminalSelection', 'testFailure', 'playwright']
model: 'Claude Sonnet 4'
---

# Test Generation with Playwright MCP

Generate comprehensive Playwright tests for one scenario by following a systematic exploration and testing workflow.

## Process Overview

You will be given a testing scenario. Your task is to:

1. **Explore First** - Use Playwright MCP tools to navigate and understand the website
2. **Generate Tests** - Create a well-structured TypeScript test using `@playwright/test` for that one scenario
3. **Validate** - Execute test and iterate until it passes consistently
4. **Refine** - Ensure test follows best practices and is maintainable

## Critical Requirements

- **Always explore the website first** - Never generate tests based solely on scenario descriptions
- **Use systematic exploration** - Navigate, take snapshots, and understand the application flow
- **Focus on one scenario** - Generate tests for the specific scenario provided
- **Save to tests directory** - All generated test files go in the `tests/` folder
- **Iterate until passing** - Run tests and fix issues until they pass consistently

## Success Criteria

- Tests use accessibility-first locators (getByRole, getByLabel, etc.)
- Tests follow proper structure with describe blocks and test steps
- Tests include meaningful assertions that reflect user expectations
- Tests are resilient and maintainable
- All tests pass consistently when executed 
