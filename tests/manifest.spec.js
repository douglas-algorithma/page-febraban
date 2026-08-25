/**
 * O manifesto e a especificacao. Estes testes iteram SCENES: acrescentar uma
 * cena la cria testes aqui sozinho. Nenhum id aparece escrito no teste.
 */
import { test, expect } from '@playwright/test'
import { SCENES, CONTENT_STATUS, LAYOUTS, totalDurationMs, VIDEO_SOURCE, solutions } from '../js/data/scenes.js'
import { irPara, caixa, caixas } from './helpers.js'

test('o conteudo esta marcado como conferido contra o video', async () => {
  expect(CONTENT_STATUS).toBe('final')
})

test('a soma das cenas reproduz a duracao do video', async () => {
  const diff = Math.abs(totalDurationMs() - VIDEO_SOURCE.duracaoS * 1000)
  expect(diff, `diferenca de ${diff.toFixed(0)}ms`).toBeLessThanOrEqual(100)
})

test('o video nao tem narracao — nenhuma cena pode depender de audio', async () => {
  expect(VIDEO_SOURCE.temNarracao).toBe(false)
})

for (const cena of SCENES) {
  test(`cena "${cena.id}" renderiza com o titulo do manifesto`, async ({ page }) => {
    await irPara(page, cena.id)
    const h1 = page.locator('.cena h1')
    await expect(h1).toBeVisible()
    // O titulo pode vir com destaque tipografico; comparamos o texto puro.
    expect((await h1.innerText()).replace(/\s+/g, ' ').trim())
      .toBe(cena.titulo.replace(/\s+/g, ' ').trim())
  })
}

for (const cena of SCENES.filter((s) => s.layout === LAYOUTS.SOLUCAO)) {
  test(`solucao "${cena.id}" mostra todos os chips e as aplicacoes`, async ({ page }) => {
    await irPara(page, cena.id)
    await expect(page.locator('.chip')).toHaveCount(cena.chips.length)
    const apps = await page.locator('.aplicacoes').innerText()
    for (const a of cena.aplicacoes) {
      expect(apps, `aplicacao "${a}" ausente`).toContain(a)
    }
  })
}

/*
  Contrato: NADA do manifesto pode ser silenciosamente descartado na tela.
  Se alguem acrescentar um campo ao chip e esquecer de renderiza-lo, ou se um
  pedaco do texto sumir na composicao, isto acusa. Foi assim que apareceu um
  "de dados" que tinha caido de um chip do Data Center.
*/
for (const cena of SCENES.filter((s) => s.layout === LAYOUTS.SOLUCAO)) {
  test(`solucao "${cena.id}": todo texto do manifesto chega na tela`, async ({ page }) => {
    await irPara(page, cena.id)
    const normalizar = (t) => t.replace(/\s+/g, ' ').trim()
    const naTela = normalizar(await page.locator('.chips').innerText())

    for (const chip of cena.chips) {
      for (const campo of ['rotulo', 'destaque', 'unidade', 'texto']) {
        const valor = chip[campo]
        if (!valor) continue
        expect(naTela, `"${valor}" (campo ${campo}) nao aparece no card`).toContain(normalizar(valor))
      }
    }
  })
}

test('a mandala lista exatamente as solucoes do manifesto', async ({ page }) => {
  const mandala = SCENES.find((s) => s.layout === LAYOUTS.MANDALA)
  await irPara(page, mandala.id)
  // Compara pelo destino (data-ir), nao pelo textContent: alguns icones tem
  // <text> dentro do SVG ("AI", "0010 1101") e sujariam a leitura do rotulo.
  const destinos = await page.$$eval('.mandala__item', (els) => els.map((e) => e.dataset.ir))
  expect(destinos).toEqual(solutions().map((s) => s.id))

  // E o rotulo visivel de cada item e o titulo do manifesto.
  const rotulos = await page.$$eval('.mandala__item > span', (els) => els.map((e) => e.textContent.trim()))
  expect(rotulos).toEqual(solutions().map((s) => s.titulo))
})

test('o contador do HUD acompanha o indice do manifesto', async ({ page }) => {
  await irPara(page, SCENES[4].id)
  await expect(page.locator('#hud-contador')).toHaveText(`5 / ${SCENES.length}`)
})
