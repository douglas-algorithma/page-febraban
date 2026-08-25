/** Fluxos de navegacao: botoes, teclado, toque, menu, mandala, rota e laco. */
import { test, expect } from '@playwright/test'
import { SCENES, LAYOUTS, solutions } from '../js/data/scenes.js'
import { irPara, pausar, cenaAtual } from './helpers.js'

test('o botao proxima avanca uma cena', async ({ page }) => {
  await irPara(page, SCENES[0].id)
  await page.click('#btn-proxima')
  await page.waitForSelector('#app[data-scene-settled="true"]')
  expect(await cenaAtual(page)).toBe(SCENES[1].id)
})

test('o botao anterior volta uma cena', async ({ page }) => {
  await irPara(page, SCENES[3].id)
  await page.click('#btn-anterior')
  await page.waitForSelector('#app[data-scene-settled="true"]')
  expect(await cenaAtual(page)).toBe(SCENES[2].id)
})

test('a apresentacao faz laco: da ultima volta para a primeira', async ({ page }) => {
  await irPara(page, SCENES.at(-1).id)
  await page.click('#btn-proxima')
  await page.waitForSelector('#app[data-scene-settled="true"]')
  expect(await cenaAtual(page)).toBe(SCENES[0].id)
})

test('da primeira, anterior vai para a ultima', async ({ page }) => {
  await irPara(page, SCENES[0].id)
  await page.click('#btn-anterior')
  await page.waitForSelector('#app[data-scene-settled="true"]')
  expect(await cenaAtual(page)).toBe(SCENES.at(-1).id)
})

test('as setas do teclado navegam', async ({ page }) => {
  await irPara(page, SCENES[2].id)
  await page.keyboard.press('ArrowRight')
  await page.waitForSelector('#app[data-scene-settled="true"]')
  expect(await cenaAtual(page)).toBe(SCENES[3].id)
  await page.keyboard.press('ArrowLeft')
  await page.waitForSelector('#app[data-scene-settled="true"]')
  expect(await cenaAtual(page)).toBe(SCENES[2].id)
})

test('espaco alterna pausa e o rotulo do botao acompanha', async ({ page }) => {
  await irPara(page, SCENES[0].id)   // irPara ja pausa
  await expect(page.locator('#btn-play')).toHaveAttribute('aria-pressed', 'true')
  await page.keyboard.press(' ')
  await expect(page.locator('#btn-play')).toHaveAttribute('aria-pressed', 'false')
})

test('a rota por hash abre a cena certa e o hash acompanha a navegacao', async ({ page }) => {
  const alvo = SCENES[7]
  await irPara(page, alvo.id)
  expect(await cenaAtual(page)).toBe(alvo.id)
  await page.click('#btn-proxima')
  await page.waitForSelector('#app[data-scene-settled="true"]')
  await expect.poll(() => page.evaluate(() => location.hash)).toBe(`#/${SCENES[8].id}`)
})

test('hash desconhecido cai na primeira cena sem quebrar', async ({ page }) => {
  const erros = []
  page.on('pageerror', (e) => erros.push(e.message))
  await page.goto('/#/cena-que-nao-existe')
  await page.waitForSelector('#app[data-scene-settled="true"]')
  expect(await cenaAtual(page)).toBe(SCENES[0].id)
  expect(erros).toEqual([])
})

test('o menu abre, lista todas as cenas e navega', async ({ page }) => {
  await irPara(page, SCENES[0].id)
  await page.click('#btn-menu')
  await expect(page.locator('#menu')).toBeVisible()
  await expect(page.locator('.menu__item')).toHaveCount(SCENES.length)

  const alvo = solutions().at(-1)
  await page.click(`.menu__item[data-ir="${alvo.id}"]`)
  await page.waitForSelector('#app[data-scene-settled="true"]')
  expect(await cenaAtual(page)).toBe(alvo.id)
  await expect(page.locator('#menu')).toBeHidden()
})

test('Escape fecha o menu', async ({ page }) => {
  await irPara(page, SCENES[0].id)
  await page.click('#btn-menu')
  await expect(page.locator('#menu')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.locator('#menu')).toBeHidden()
})

test('o menu marca a cena atual com aria-current', async ({ page }) => {
  const alvo = SCENES[6]
  await irPara(page, alvo.id)
  await page.click('#btn-menu')
  await expect(page.locator(`.menu__item[data-ir="${alvo.id}"]`)).toHaveAttribute('aria-current', 'true')
})

test('tocar em um item da mandala abre aquela solucao', async ({ page }) => {
  const mandala = SCENES.find((s) => s.layout === LAYOUTS.MANDALA)
  await irPara(page, mandala.id)
  const alvo = solutions()[3]
  await page.click(`.mandala__item[data-ir="${alvo.id}"]`)
  await page.waitForSelector('#app[data-scene-settled="true"]')
  expect(await cenaAtual(page)).toBe(alvo.id)
})

test('a reproducao automatica avanca sozinha respeitando a duracao da cena', async ({ page }) => {
  // Cena curta de proposito para o teste nao ficar lento: usamos a menor.
  const curta = SCENES.reduce((a, b) => (a.durationMs <= b.durationMs ? a : b))
  await page.goto(`/#/${curta.id}`)
  await page.waitForSelector('#app[data-scene-settled="true"]')
  await page.evaluate(() => globalThis.__cpqd.store.tocar())
  const indiceAntes = await page.evaluate(() => globalThis.__cpqd.store.snapshot().indice)
  await expect.poll(
    () => page.evaluate(() => globalThis.__cpqd.store.snapshot().indice),
    { timeout: curta.durationMs + 6000, intervals: [200] }
  ).not.toBe(indiceAntes)
})

test('a barra de progresso cresce ao longo da apresentacao', async ({ page }) => {
  await irPara(page, SCENES[1].id)
  const cedo = Number(await page.getAttribute('#progresso', 'aria-valuenow'))
  await irPara(page, SCENES.at(-2).id)
  const tarde = Number(await page.getAttribute('#progresso', 'aria-valuenow'))
  expect(tarde).toBeGreaterThan(cedo)
})

test('swipe navega em telas de toque', async ({ page, hasTouch }) => {
  test.skip(!hasTouch, 'projeto sem toque')
  await irPara(page, SCENES[2].id)
  // Touch precisa de identifier e target — sem eles o construtor lanca e o
  // teste morre ANTES de exercitar o gesto (foi o que acontecia aqui).
  await page.evaluate(() => {
    const alvo = document.getElementById('cena')
    const evento = (tipo, x, y) => new TouchEvent(tipo, {
      bubbles: true,
      cancelable: true,
      changedTouches: [new Touch({ identifier: 1, target: alvo, clientX: x, clientY: y })]
    })
    alvo.dispatchEvent(evento('touchstart', 1200, 500))
    alvo.dispatchEvent(evento('touchend', 400, 510))
  })
  await page.waitForSelector('#app[data-scene-settled="true"]')
  expect(await cenaAtual(page)).toBe(SCENES[3].id)
})
