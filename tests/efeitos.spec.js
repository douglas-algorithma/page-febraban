/**
 * Efeitos de presenca do totem. Nenhum pode atrapalhar navegacao, roubar
 * ponteiro ou vazar nos no DOM.
 */
import { test, expect } from '@playwright/test'
import { SCENES } from '../js/data/scenes.js'
import { irPara, esperarCena } from './helpers.js'

test('o toque deixa uma onda e ela se limpa sozinha', async ({ page }) => {
  await irPara(page, SCENES[0].id)
  await page.mouse.move(960, 540)
  await page.mouse.down()
  await expect.poll(() => page.locator('.onda').count()).toBeGreaterThan(0)
  await page.mouse.up()
  // A propria animacao remove o no; sem isso o DOM cresceria o dia inteiro.
  await expect.poll(() => page.locator('.onda').count(), { timeout: 4000 }).toBe(0)
})

test('a camada de ondas nao intercepta toque', async ({ page }) => {
  await irPara(page, SCENES[0].id)
  const passa = await page.evaluate(() =>
    getComputedStyle(document.querySelector('.ondas')).pointerEvents)
  expect(passa).toBe('none')
  // E os controles continuam clicaveis com a camada por cima.
  await page.click('#btn-proxima')
  await esperarCena(page, SCENES[1])
})

test('o anel do botao de reproducao acompanha o tempo da cena', async ({ page }) => {
  await page.goto(`/#/${SCENES[0].id}`)
  await page.waitForSelector('#app[data-scene-settled="true"]')
  await page.evaluate(() => globalThis.__cpqd.store.tocar())

  const ler = () => page.evaluate(() => {
    const el = document.getElementById('btn-play')
    return {
      anel: Number(getComputedStyle(el).getPropertyValue('--cena-progresso')),
      razao: globalThis.__cpqd.store.snapshot().decorridoMs /
             globalThis.__cpqd.store.snapshot().cena.durationMs
    }
  })

  await page.waitForTimeout(1200)
  const a = await ler()
  expect(a.anel).toBeGreaterThan(0)
  expect(Math.abs(a.anel - a.razao), 'o anel discorda do relogio').toBeLessThan(0.08)

  await page.waitForTimeout(1200)
  const b = await ler()
  expect(b.anel, 'o anel nao avancou').toBeGreaterThan(a.anel)
})

test('o modo atracao existe e nao dispara durante o uso', async ({ page }) => {
  /*
    Depois de muito tempo sem ninguem tocar a apresentacao volta ao inicio.
    O gatilho e de minutos — aqui garantimos apenas que ele NAO age enquanto
    alguem esta mexendo, que e o erro que estragaria a experiencia.
  */
  await irPara(page, SCENES[7].id)
  expect(await page.evaluate(() => Boolean(globalThis.__cpqd.atracao))).toBe(true)
  await page.mouse.move(900, 500)
  await page.waitForTimeout(1500)
  expect(await page.evaluate(() => globalThis.__cpqd.store.snapshot().indice)).toBe(7)
})

test('com menos movimento os efeitos ficam quietos', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1920, height: 1080 } })
  const page = await ctx.newPage()
  await page.goto(`/#/${SCENES[4].id}`)
  await page.waitForSelector('#app[data-scene-settled="true"]')

  await page.mouse.move(960, 540)
  await page.mouse.down()
  await page.waitForTimeout(220)
  expect(await page.locator('.onda').count(), 'onda apareceu com movimento reduzido').toBe(0)

  const brilho = await page.evaluate(() => {
    const el = document.querySelector('.aplicacoes')
    return el ? getComputedStyle(el, '::after').animationName : 'none'
  })
  expect(brilho).toBe('none')
  await ctx.close()
})
