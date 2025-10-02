#!/usr/bin/env node
/*
 * Playwright health / environment diagnostic script
 * - Verifica versão do @playwright/test
 * - Lista browsers baixados
 * - Testa import básico
 * - Opcional: checa libs do sistema (Linux) para Chromium
 */

const fs = require('fs')
const path = require('path')

function log(title, value) {
	const pad = 20
	console.log(title.padEnd(pad, ' ') + ': ' + value)
}

function exists(p) {
	try {
		fs.accessSync(p)
		return true
	} catch {
		return false
	}
}

// 1. Versão do Playwright
let pwVersion = 'N/A'
try {
	pwVersion = require('@playwright/test/package.json').version
} catch (e) {
	pwVersion = 'Não encontrado (rode npm install)'
}
log('Playwright versão', pwVersion)

// 2. Cache de browsers
const cacheDir = path.join('node_modules', '.cache', 'ms-playwright')
if (exists(cacheDir)) {
	const entries = fs
		.readdirSync(cacheDir)
		.filter((f) => fs.statSync(path.join(cacheDir, f)).isDirectory())
	log('Browsers baixados', entries.length ? entries.join(', ') : 'Nenhum')
} else {
	log('Browsers baixados', 'Cache não existe')
}

// 3. Teste de import
try {
	require('@playwright/test')
	log('Import @playwright/test', 'OK')
} catch (e) {
	log('Import @playwright/test', 'FALHOU')
}

// 4. (Opcional) checar binário Chromium e libs faltantes (sem dependência externa)
function findChromiumBinary(dir, depth = 0, maxDepth = 6) {
	if (depth > maxDepth) return null
	if (!exists(dir)) return null
	for (const entry of fs.readdirSync(dir)) {
		const full = path.join(dir, entry)
		let stat
		try {
			stat = fs.statSync(full)
		} catch {
			continue
		}
		if (stat.isDirectory()) {
			if (/chromium/i.test(entry)) {
				const candidate = path.join(full, 'chrome-linux', 'chrome')
				if (exists(candidate)) return candidate
			}
			const deeper = findChromiumBinary(full, depth + 1, maxDepth)
			if (deeper) return deeper
		}
	}
	return null
}

try {
	const chrome = findChromiumBinary(cacheDir)
	if (chrome) {
		log('Chromium binário', chrome)
		if (process.platform === 'linux') {
			const { execSync } = require('child_process')
			try {
				const out = execSync(`ldd "${chrome}"`, { stdio: 'pipe' }).toString()
				const missing = out.split('\n').filter((l) => l.includes('not found'))
				if (missing.length) {
					log('Libs faltando', '\n' + missing.join('\n'))
				} else {
					log('Libs faltando', 'Nenhuma')
				}
			} catch (e) {
				log('Checagem libs', 'Falha ao executar ldd')
			}
		}
	} else {
		log('Chromium binário', 'Não localizado (talvez não instalado)')
	}
} catch (e) {
	log('Checagem Chromium', 'Erro: ' + e.message)
}

// 5. Sugestão final
// 5. Detectar caches globais e variável de ambiente
const envPath = process.env.PLAYWRIGHT_BROWSERS_PATH || '(não definida)'
log('ENV PLAYWRIGHT_BROWSERS_PATH', envPath)

function listDirSafe(dir) {
	try {
		return fs
			.readdirSync(dir)
			.filter((f) => {
				try {
					return fs.statSync(path.join(dir, f)).isDirectory()
				} catch {
					return false
				}
			})
			.join(', ')
	} catch {
		return ''
	}
}

const possibleCaches = []
const homeCache = path.join(process.env.HOME || '', '.cache', 'ms-playwright')
if (homeCache && exists(homeCache)) possibleCaches.push(homeCache)
if (process.env.XDG_CACHE_HOME) {
	const xdg = path.join(process.env.XDG_CACHE_HOME, 'ms-playwright')
	if (exists(xdg)) possibleCaches.push(xdg)
}
if (exists(cacheDir)) possibleCaches.push(cacheDir)

if (possibleCaches.length) {
	console.log('\nCaches detectados:')
	for (const c of possibleCaches) {
		console.log(' - ' + c + ' => ' + (listDirSafe(c) || '(vazio)'))
	}
} else {
	console.log('\nNenhum cache detectado (local ou global).')
}

// 6. Caminho reportado pelo Playwright para o Chromium
try {
	const { chromium } = require('@playwright/test')
	const exe = chromium.executablePath()
	log('Chromium exec path', exe || 'N/A')
} catch (e) {
	log('Chromium exec path', 'Indisponível: ' + e.message)
}

console.log(
	'\nSugestão: se libs faltando, instale dependências de sistema e rode: npx playwright install --with-deps'
)
