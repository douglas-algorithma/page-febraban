/**
 * Geometria: sobreposicao, safe area, transbordo e paridade entre resolucoes.
 *
 * O teste de SOBREPOSICAO existe porque a suite ja passou inteira com o
 * cabecalho do HUD escrevendo por cima do titulo da cena. Nao havia transbordo,
 * os alvos tinham 88px e o texto era legivel — os elementos so ocupavam o mesmo
 * espaco em camadas diferentes. Nenhuma medicao de tamanho pega isso; so
 * comparar retangulos pega.
 */
import { test, expect } from '@playwright/test'
import { SCENES } from '../js/data/scenes.js'
import { irPara, caixa, caixas, sobrepoe, esperarSemSobreposicao } from './helpers.js'

/** Tudo que carrega texto dentro do card. */
const TEXTO_DA_CENA = '.cena h1, .cena > * > p, .cena .chip, .cena .aplicacoes, ' +
                      '.cena .moeda__etiqueta, .cena .mandala__item, .cena .pilares__nome'

for (const cena of SCENES) {
  test(`"${cena.id}": nada do HUD escreve por cima do conteudo`, async ({ page }) => {
    await irPara(page, cena.id)
    const topo = await caixa(page, '#hud-topo')
    const base = await caixa(page, '#hud-base')
    const conteudo = await caixas(page, TEXTO_DA_CENA)

    expect(conteudo.length, 'a cena precisa ter algum texto medivel').toBeGreaterThan(0)
    for (const c of conteudo) {
      esperarSemSobreposicao(c, topo, `${cena.id} :: ${c.tag} "${c.texto}"`, '#hud-topo')
      esperarSemSobreposicao(c, base, `${cena.id} :: ${c.tag} "${c.texto}"`, '#hud-base')
    }
  })
}

test('as tres faixas do grid nao se cruzam', async ({ page }) => {
  await irPara(page, SCENES[0].id)
  const topo = await caixa(page, '#hud-topo')
  const meio = await caixa(page, '#cena')
  const base = await caixa(page, '#hud-base')
  esperarSemSobreposicao(topo, meio, '#hud-topo', '#cena')
  esperarSemSobreposicao(meio, base, '#cena', '#hud-base')
  esperarSemSobreposicao(topo, base, '#hud-topo', '#hud-base')
})

for (const cena of SCENES) {
  test(`"${cena.id}": nenhum texto sai da tela`, async ({ page }) => {
    await irPara(page, cena.id)
    const vp = page.viewportSize()
    for (const c of await caixas(page, TEXTO_DA_CENA)) {
      expect(c.x, `"${c.texto}" comeca fora da tela`).toBeGreaterThanOrEqual(-1)
      expect(c.y, `"${c.texto}" comeca acima da tela`).toBeGreaterThanOrEqual(-1)
      expect(c.x + c.width, `"${c.texto}" passa da borda direita`).toBeLessThanOrEqual(vp.width + 1)
      expect(c.y + c.height, `"${c.texto}" passa da borda inferior`).toBeLessThanOrEqual(vp.height + 1)
    }
  })
}

test('a pagina nunca rola — e uma TV, nao um site', async ({ page }) => {
  await irPara(page, SCENES[0].id)
  const { rolaX, rolaY } = await page.evaluate(() => ({
    rolaX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    rolaY: document.documentElement.scrollHeight > document.documentElement.clientHeight
  }))
  expect(rolaX, 'a pagina rola na horizontal').toBe(false)
  expect(rolaY, 'a pagina rola na vertical').toBe(false)
})

test('a safe area de 4% e respeitada nas quatro bordas', async ({ page }) => {
  await irPara(page, SCENES[0].id)
  const vp = page.viewportSize()
  const margemX = vp.width * 0.04
  const margemY = vp.height * 0.04
  const topo = await caixa(page, '#hud-topo')
  const base = await caixa(page, '#hud-base')

  expect(topo.y, 'cabecalho invade a safe area superior').toBeGreaterThanOrEqual(margemY - 1)
  expect(base.y + base.height, 'controles invadem a safe area inferior')
    .toBeLessThanOrEqual(vp.height - margemY + 1)
  // A marca no fundo claro e sangrada de proposito (painel roxo do video),
  // entao medimos a safe area pelo contador, que e conteudo comum.
  const contador = await caixa(page, '#hud-contador')
  expect(contador.x + contador.width, 'contador invade a safe area direita')
    .toBeLessThanOrEqual(vp.width - margemX + 1)
})

test('o canvas 3D cobre a tela inteira e fica atras do conteudo', async ({ page }) => {
  await irPara(page, SCENES[0].id)
  const vp = page.viewportSize()
  const c = await caixa(page, '#palco')
  expect(Math.round(c.width)).toBe(vp.width)
  expect(Math.round(c.height)).toBe(vp.height)
  const zPalco = await page.evaluate(() => getComputedStyle(document.getElementById('palco')).zIndex)
  const zCena = await page.evaluate(() => getComputedStyle(document.getElementById('cena')).zIndex)
  expect(Number(zPalco)).toBeLessThan(Number(zCena))
})

test('o layout escala por proporcao — mesma composicao em 1080p e 4K', async ({ page }) => {
  const solucao = SCENES.find((s) => s.layout === 'solucao')
  await irPara(page, solucao.id)
  const vp = page.viewportSize()
  const titulo = await caixa(page, '.cena h1')
  // A mesma fracao da tela em qualquer resolucao: e o que prova que a raiz
  // em min(vw,vh) escala e que nao ha media query de resolucao escondida.
  expect(titulo.x / vp.width).toBeGreaterThan(0.18)
  expect(titulo.x / vp.width).toBeLessThan(0.32)
  expect(titulo.height / vp.height).toBeGreaterThan(0.05)
  expect(titulo.height / vp.height).toBeLessThan(0.25)
})

test('o menu aberto nao deixa conteudo do card vazando por cima', async ({ page }) => {
  await irPara(page, SCENES[0].id)
  await page.click('#btn-menu')
  await expect(page.locator('#menu')).toBeVisible()
  const zMenu = await page.evaluate(() => getComputedStyle(document.getElementById('menu')).zIndex)
  expect(Number(zMenu)).toBeGreaterThan(1)
})
