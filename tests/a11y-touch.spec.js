/** Regras de TV touch: alvo de 88px, nada dependente de hover, foco e ARIA. */
import { test, expect } from '@playwright/test'
import { SCENES, LAYOUTS } from '../js/data/scenes.js'
import { irPara, caixas } from './helpers.js'

const ALVO_MINIMO = 88

test('todo controle do HUD tem pelo menos 88x88px', async ({ page }) => {
  await irPara(page, SCENES[0].id)
  const botoes = await caixas(page, '#hud-base .botao')
  expect(botoes.length).toBeGreaterThanOrEqual(4)
  for (const b of botoes) {
    expect(b.width, `botao "${b.texto}" com ${b.width}px de largura`).toBeGreaterThanOrEqual(ALVO_MINIMO)
    expect(b.height, `botao "${b.texto}" com ${b.height}px de altura`).toBeGreaterThanOrEqual(ALVO_MINIMO)
  }
})

test('os itens da mandala sao alvos de toque validos', async ({ page }) => {
  const mandala = SCENES.find((s) => s.layout === LAYOUTS.MANDALA)
  await irPara(page, mandala.id)
  for (const i of await caixas(page, '.mandala__item')) {
    expect(i.height, `"${i.texto}" com ${i.height}px de altura`).toBeGreaterThanOrEqual(ALVO_MINIMO)
    expect(i.width, `"${i.texto}" com ${i.width}px de largura`).toBeGreaterThanOrEqual(ALVO_MINIMO)
  }
})

test('os itens do menu sao alvos de toque validos', async ({ page }) => {
  await irPara(page, SCENES[0].id)
  await page.click('#btn-menu')
  for (const i of await caixas(page, '.menu__item')) {
    expect(i.height, `"${i.texto}" com ${i.height}px de altura`).toBeGreaterThanOrEqual(ALVO_MINIMO)
  }
})

test('os alvos de toque nao se encostam', async ({ page }) => {
  await irPara(page, SCENES[0].id)
  const b = await caixas(page, '#hud-base .botao')
  for (let i = 1; i < b.length; i++) {
    const anterior = b[i - 1]
    const atual = b[i]
    if (Math.abs(anterior.y - atual.y) > 4) continue  // linhas diferentes
    expect(atual.x - (anterior.x + anterior.width),
      `"${anterior.texto}" e "${atual.texto}" encostados`).toBeGreaterThanOrEqual(0)
  }
})

test('nenhuma acao existe apenas no hover', async ({ page }) => {
  await irPara(page, SCENES[0].id)
  // Todo elemento clicavel precisa ser visivel e habilitado SEM hover.
  const clicaveis = page.locator('button, [data-ir]')
  const n = await clicaveis.count()
  expect(n).toBeGreaterThan(0)
  for (let i = 0; i < n; i++) {
    const el = clicaveis.nth(i)
    if (!(await el.isVisible())) continue
    await expect(el).toBeEnabled()
    const op = await el.evaluate((e) => Number(getComputedStyle(e).opacity))
    expect(op, 'controle invisivel ate o hover').toBeGreaterThan(0.1)
  }
})

test('os controles tem rotulo acessivel', async ({ page }) => {
  await irPara(page, SCENES[0].id)
  for (const id of ['btn-anterior', 'btn-play', 'btn-proxima', 'btn-menu']) {
    const rotulo = await page.getAttribute(`#${id}`, 'aria-label')
    expect(rotulo, `#${id} sem aria-label`).toBeTruthy()
  }
})

test('a barra de progresso expoe o estado por ARIA', async ({ page }) => {
  await irPara(page, SCENES[2].id)
  const p = page.locator('#progresso')
  await expect(p).toHaveAttribute('role', 'progressbar')
  const agora = Number(await p.getAttribute('aria-valuenow'))
  expect(agora).toBeGreaterThanOrEqual(0)
  expect(agora).toBeLessThanOrEqual(100)
})

test('cada cena tem exatamente um h1', async ({ page }) => {
  for (const cena of SCENES.slice(0, 6)) {
    await irPara(page, cena.id)
    await expect(page.locator('.cena h1')).toHaveCount(1)
  }
})

test('o foco fica visivel ao navegar por teclado', async ({ page }) => {
  await irPara(page, SCENES[0].id)
  await page.locator('#btn-proxima').focus()
  const contorno = await page.locator('#btn-proxima').evaluate((e) => {
    const s = getComputedStyle(e)
    return { largura: s.outlineWidth, estilo: s.outlineStyle }
  })
  expect(contorno.estilo).not.toBe('none')
  expect(parseFloat(contorno.largura)).toBeGreaterThan(0)
})

test('o menu leva o foco ao abrir', async ({ page }) => {
  await irPara(page, SCENES[0].id)
  await page.click('#btn-menu')
  await expect(page.locator('#btn-fechar-menu')).toBeFocused()
})

test('o contraste do texto sobre o fundo claro e suficiente', async ({ page }) => {
  const solucao = SCENES.find((s) => s.layout === LAYOUTS.SOLUCAO)
  await irPara(page, solucao.id)
  const cor = await page.locator('.cena h1').evaluate((e) => getComputedStyle(e).color)
  // #372060 sobre branco da ~11:1. Aqui checamos so que nao virou cor clara.
  const [r, g, b] = cor.match(/\d+/g).map(Number)
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  expect(lum, `titulo com luminancia ${lum.toFixed(2)} sobre fundo claro`).toBeLessThan(0.35)
})
