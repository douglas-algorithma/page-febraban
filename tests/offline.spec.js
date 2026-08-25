/**
 * A TV do estande pode nao ter rede. Esta suite prova que a pagina nao
 * depende de nenhuma: se algum dia alguem colar um <script src> de CDN, uma
 * @import de Google Fonts ou um fetch de telemetria, quebra aqui.
 */
import { test, expect } from '@playwright/test'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { SCENES } from '../js/data/scenes.js'
import { irPara } from './helpers.js'

const RAIZ = fileURLToPath(new URL('..', import.meta.url))
const IGNORAR = new Set(['node_modules', '.git', '.ingest', 'test-results', 'playwright-report', 'vendor', 'assets'])

function* varrer (dir) {
  for (const nome of readdirSync(dir)) {
    if (IGNORAR.has(nome) || nome.startsWith('.')) continue
    const p = join(dir, nome)
    if (statSync(p).isDirectory()) yield* varrer(p)
    else if (['.js', '.mjs', '.css', '.html'].includes(extname(nome))) yield p
  }
}

test('nenhum arquivo do projeto referencia uma origem externa', async () => {
  const suspeitos = []
  for (const arquivo of varrer(RAIZ)) {
    const texto = readFileSync(arquivo, 'utf8')
    const rel = arquivo.slice(RAIZ.length)
    // scripts/ pode falar de brew/URLs em comentario; o que importa e o que
    // o browser carrega. Checamos so o que vira requisicao.
    for (const [re, oque] of [
      [/<script[^>]+src\s*=\s*["']https?:\/\//i, 'script de origem externa'],
      [/<link[^>]+href\s*=\s*["']https?:\/\//i, 'link de origem externa'],
      [/@import\s+(url\()?["']?https?:\/\//i, '@import externo'],
      [/url\(\s*["']?https?:\/\//i, 'url() externa em CSS']
    ]) {
      if (re.test(texto)) suspeitos.push(`${rel}: ${oque}`)
    }
  }
  expect(suspeitos, suspeitos.join('\n')).toEqual([])
})

test('o import map aponta apenas para caminhos locais', async ({ page }) => {
  await page.goto('/')
  const mapa = await page.evaluate(() => {
    const el = document.querySelector('script[type="importmap"]')
    return JSON.parse(el.textContent).imports
  })
  expect(Object.keys(mapa).length).toBeGreaterThan(0)
  for (const [nome, destino] of Object.entries(mapa)) {
    expect(destino, `"${nome}" resolve para fora do projeto`).toMatch(/^\.\//)
  }
})

test('carregar e percorrer todas as cenas nao gera requisicao externa', async ({ page }) => {
  const externas = []
  page.on('request', (req) => {
    const url = req.url()
    if (!url.startsWith('http://127.0.0.1:4173') && !url.startsWith('data:') && !url.startsWith('blob:')) {
      externas.push(`${req.method()} ${url}`)
    }
  })

  await irPara(page, SCENES[0].id)
  for (const cena of SCENES) {
    await page.evaluate((id) => globalThis.__cpqd.store.irPara(id, 'teste'), cena.id)
  }
  await page.click('#btn-menu')
  await page.waitForTimeout(300)

  expect(externas, `requisicoes para fora:\n${externas.join('\n')}`).toEqual([])
})

test('com toda a rede externa bloqueada a pagina continua inteira', async ({ page }) => {
  // Deixa passar so o proprio servidor. Qualquer outra coisa: conexao recusada.
  await page.route('**/*', (rota) => {
    const url = rota.request().url()
    if (url.startsWith('http://127.0.0.1:4173')) return rota.continue()
    return rota.abort('connectionrefused')
  })

  const problemas = []
  page.on('pageerror', (e) => problemas.push('pageerror: ' + e.message))
  page.on('console', (m) => { if (m.type() === 'error') problemas.push('console: ' + m.text()) })

  await irPara(page, SCENES[0].id)
  await expect(page.locator('.cena h1')).toBeVisible()

  // three e gsap precisam ter carregado de verdade, nao so "nao ter quebrado".
  const vivo = await page.evaluate(() => ({
    temPalco: Boolean(globalThis.__cpqd?.stage?.idAtual),
    quadros: globalThis.__cpqd?.stage?.info?.render?.frame ?? 0
  }))
  expect(vivo.temPalco, 'a cena 3D nao montou sem rede').toBe(true)
  expect(vivo.quadros, 'o renderer nao desenhou nenhum quadro').toBeGreaterThan(0)

  await page.click('#btn-proxima')
  await page.waitForSelector('#app[data-scene-settled="true"]')
  expect(problemas).toEqual([])
})

test('as libs vendorizadas estao no repositorio, nao em node_modules', async () => {
  const vendor = join(RAIZ, 'js', 'vendor')
  const arquivos = readdirSync(vendor)
  expect(arquivos).toContain('three.module.js')
  expect(arquivos).toContain('three.core.js')
  expect(readdirSync(join(vendor, 'gsap'))).toContain('gsap-core.js')

  // three.module.js importa ./three.core.js — os dois precisam existir juntos.
  const three = readFileSync(join(vendor, 'three.module.js'), 'utf8')
  expect(three).toMatch(/from '\.\/three\.core\.js'/)
})
