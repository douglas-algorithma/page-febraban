/**
 * Um teste por bug real ja encontrado neste projeto.
 *
 * Cada um cita o que quebrava e por que. Nao apagar: sao a memoria de onde a
 * suite ja falhou em olhar.
 */
import { test, expect } from '@playwright/test'
import { SCENES, solutions } from '../js/data/scenes.js'
import { irPara, esperarCena, cenaNoStore, cenaNaTela } from './helpers.js'

test('escolher no menu troca o CARD, nao so o estado', async ({ page }) => {
  /*
    P0. store, hash e HUD mudavam e o card ficava na cena anterior: a view
    filtrava por `motivo` e o motivo da navegacao vinda do menu era o mesmo
    de abrir/fechar o painel. A suite passava porque conferia o store.
  */
  await irPara(page, SCENES[0].id)
  const alvo = solutions().find((s) => s.id === 'antifraude') ?? solutions().at(-1)

  await page.click('#btn-menu')
  await page.click(`.menu__item[data-ir="${alvo.id}"]`)
  await esperarCena(page, alvo)          // confere TELA, store e cena 3D
})

test('todo item do menu leva ao card correspondente', async ({ page }) => {
  // Visita uma cena de cada layout, com o menu abrindo e fechando. Em 4K sob
  // carga paralela isso passa do limite padrao — e lentidao de render, nao
  // falha de logica, entao damos folga em vez de encolher a cobertura.
  test.slow()
  await irPara(page, SCENES[0].id)
  // Amostra ampla: uma cena de cada layout presente no manifesto.
  const vistos = new Set()
  const amostra = SCENES.filter((s) => !vistos.has(s.layout) && vistos.add(s.layout))
  for (const cena of amostra) {
    await page.click('#btn-menu')
    await page.click(`.menu__item[data-ir="${cena.id}"]`)
    await esperarCena(page, cena)
  }
})

test('rota por hash funciona DEPOIS de navegar por dentro', async ({ page }) => {
  /*
    P1. O router armava `ignorarProximo` antes de history.replaceState, mas
    replaceState nao dispara hashchange — a flag ficava armada e engolia o
    proximo hashchange legitimo. A primeira rota apos qualquer navegacao
    interna era perdida.
  */
  await irPara(page, SCENES[0].id)
  await page.click('#btn-proxima')
  await esperarCena(page, SCENES[1])

  const alvo = SCENES.at(-1)
  await page.evaluate((id) => { location.hash = `#/${id}` }, alvo.id)
  await esperarCena(page, alvo)
})

test('rota invalida em runtime nao deixa a URL mentindo', async ({ page }) => {
  await irPara(page, SCENES[5].id)
  await page.evaluate(() => { location.hash = '#/rota-que-nao-existe' })
  await expect.poll(() => page.evaluate(() => location.hash)).toBe(`#/${SCENES[5].id}`)
  expect(await cenaNoStore(page)).toBe(SCENES[5].id)
})

test('o botao de menu fecha o menu que ele abriu', async ({ page }) => {
  /*
    P2. O painel usava inset:var(--safe) e cobria exatamente a faixa dos
    controles, entao #btn-menu — que anuncia aria-expanded — ficava embaixo
    do overlay e nao alternava.
  */
  await irPara(page, SCENES[0].id)
  await page.click('#btn-menu')
  await expect(page.locator('#menu')).toBeVisible()
  await page.click('#btn-menu')
  await expect(page.locator('#menu')).toBeHidden()
})

test('indice nao-finito nao trava a aplicacao', async ({ page }) => {
  /*
    P2. clampIndex nao tratava NaN; o estado ficava NaN, a view lancava, a
    excecao interrompia o laco de notificacao e a pagina ficava inerte para
    sempre.
  */
  await irPara(page, SCENES[3].id)
  const erros = []
  page.on('pageerror', (e) => erros.push(e.message))

  await page.evaluate(() => globalThis.__cpqd.store.ir(NaN, 'teste'))
  await page.evaluate(() => globalThis.__cpqd.store.ir(undefined, 'teste'))
  // Continua respondendo depois disso:
  await page.click('#btn-proxima')
  await page.waitForSelector('#app[data-scene-settled="true"]')
  expect(Number.isFinite(await page.evaluate(() => globalThis.__cpqd.store.snapshot().indice))).toBe(true)
  expect(erros).toEqual([])
})

test('o foco volta para o botao de menu ao fechar', async ({ page }) => {
  await irPara(page, SCENES[0].id)
  await page.click('#btn-menu')
  await expect(page.locator('#btn-fechar-menu')).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.locator('#btn-menu')).toBeFocused()
})

test('trocar de cena com o menu aberto nao rouba o foco', async ({ page }) => {
  /*
    P2. O subscriber chamava btnFechar.focus() em TODA notificacao do store,
    entao qualquer navegacao puxava o foco de volta.
  */
  await irPara(page, SCENES[0].id)
  await page.click('#btn-menu')
  const primeiro = page.locator('.menu__item').first()
  await primeiro.focus()
  await page.evaluate(() => globalThis.__cpqd.store.proxima('teste'))
  await expect(primeiro).toBeFocused()
})

test('o Tab nao escapa do menu aberto', async ({ page }) => {
  await irPara(page, SCENES[0].id)
  await page.click('#btn-menu')
  for (let i = 0; i < 40; i++) await page.keyboard.press('Tab')
  const dentro = await page.evaluate(() =>
    document.getElementById('menu').contains(document.activeElement))
  expect(dentro, 'o foco saiu do menu para controles cobertos pelo overlay').toBe(true)
})

test('multitoque nao gera swipe fantasma', async ({ page, hasTouch }) => {
  test.skip(!hasTouch, 'projeto sem toque')
  /*
    P2. aoTocar reescrevia a origem em qualquer touchstart e aoSoltar usava
    changedTouches[0] sem casar o identificador. Duas pessoas tocando a TV ao
    mesmo tempo navegavam sozinhas.
  */
  await irPara(page, SCENES[9].id)
  const antes = await cenaNoStore(page)
  await page.evaluate(() => {
    const alvo = document.getElementById('cena')
    const toque = (id, x) => new Touch({ identifier: id, target: alvo, clientX: x, clientY: 500 })
    const t1 = toque(1, 1500)
    const t2 = toque(2, 400)
    alvo.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, changedTouches: [t1], touches: [t1] }))
    alvo.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, changedTouches: [t2], touches: [t1, t2] }))
    alvo.dispatchEvent(new TouchEvent('touchend', { bubbles: true, changedTouches: [t1], touches: [t2] }))
  })
  await page.waitForTimeout(200)
  expect(await cenaNoStore(page), 'multitoque navegou sozinho').toBe(antes)
})

test('as setas para cima e para baixo navegam', async ({ page }) => {
  await irPara(page, SCENES[4].id)
  await page.keyboard.press('ArrowDown')
  await esperarCena(page, SCENES[5])
  await page.keyboard.press('ArrowUp')
  await esperarCena(page, SCENES[4])
})

test('os setores da roda levam ao card do pilar', async ({ page }) => {
  const mandala = SCENES.find((s) => s.layout === 'mandala')
  await irPara(page, mandala.id)
  const setores = await page.$$eval('[data-ir-pilar]', (els) => els.map((e) => e.dataset.irPilar))
  expect(setores.length, 'a roda precisa ter os setores dos pilares').toBeGreaterThanOrEqual(3)

  for (const pilar of setores) {
    await irPara(page, mandala.id)
    await page.click(`[data-ir-pilar="${pilar}"]`)
    const alvo = SCENES.find((s) => s.id === `pilar-${pilar}`)
    expect(alvo, `nao existe cena pilar-${pilar}`).toBeTruthy()
    await esperarCena(page, alvo)
  }
})

test('o toque manual ganha carencia antes do avanco automatico', async ({ page }) => {
  /*
    Sem carencia o totem voltava a avancar sozinho ~7s depois do dedo do
    visitante, no meio da leitura.
  */
  await page.goto(`/#/${SCENES[0].id}`)
  await page.waitForSelector('#app[data-scene-settled="true"]')
  await page.evaluate(() => globalThis.__cpqd.store.tocar())
  await page.click('#btn-proxima')
  const decorrido = await page.evaluate(() => globalThis.__cpqd.store.snapshot().decorridoMs)
  expect(decorrido, 'navegacao manual deveria comecar com credito de tempo').toBeLessThan(0)
})

test('com menos movimento a entrada assenta de imediato', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1920, height: 1080 } })
  const page = await ctx.newPage()
  await page.goto(`/#/${SCENES[0].id}`)
  await page.waitForSelector('#app[data-scene-settled="true"]')

  // Medimos uma NAVEGACAO, nao o carregamento: o load inclui baixar three e
  // gsap, o que nada tem a ver com a duracao da animacao.
  const gasto = await page.evaluate(async () => {
    const app = document.getElementById('app')
    const t0 = performance.now()
    globalThis.__cpqd.store.proxima('teste')
    await new Promise((pronto) => {
      const obs = new MutationObserver(() => {
        if (app.dataset.sceneSettled === 'true') { obs.disconnect(); pronto() }
      })
      obs.observe(app, { attributes: true, attributeFilter: ['data-scene-settled'] })
    })
    return performance.now() - t0
  })
  await ctx.close()
  expect(gasto, `a entrada levou ${Math.round(gasto)}ms com prefers-reduced-motion`).toBeLessThan(150)
})
