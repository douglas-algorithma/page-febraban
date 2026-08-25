import { expect } from '@playwright/test'

/**
 * Navega ate uma cena e SO devolve quando a entrada assentou.
 *
 * Espera por #app[data-scene-settled="true"], nunca por timeout: um item a
 * meio tween do GSAP mede menor que o tamanho de repouso, e medir nessa
 * janela produz falha intermitente.
 */
export async function irPara (page, id) {
  await page.goto(`/#/${id}`)
  await page.evaluate(() => globalThis.__cpqd?.store.pausar())
  await page.waitForSelector('#app[data-scene-settled="true"]')
}

/** Pausa a reproducao para que a cena nao troque no meio de uma medicao. */
export async function pausar (page) {
  await page.evaluate(() => globalThis.__cpqd.store.pausar())
}

/** O que o STORE acha que esta na tela. */
export async function cenaNoStore (page) {
  return page.evaluate(() => globalThis.__cpqd.store.snapshot().cena.id)
}

/** O que esta DESENHADO na tela: titulo do card e cena 3D montada. */
export async function cenaNaTela (page) {
  return page.evaluate(() => ({
    titulo: (document.querySelector('.cena h1')?.textContent ?? '').replace(/\s+/g, ' ').trim(),
    layout: document.querySelector('.cena .card')?.className ?? '',
    scene3d: globalThis.__cpqd.stage.idAtual
  }))
}

/**
 * Afirma que a cena `esperada` esta REALMENTE na tela — nao so no store.
 *
 * Nasceu de um bug que a suite deixou passar inteira: escolher um item no
 * menu mudava store, hash e HUD, e o card ficava na cena anterior. O teste
 * antigo comparava `store.snapshot().cena.id`, entao passava com a tela
 * errada. Estado nao e tela; aqui conferimos os dois.
 */
export async function esperarCena (page, cena) {
  await page.waitForSelector('#app[data-scene-settled="true"]')
  const esperado = cena.titulo.replace(/\s+/g, ' ').trim()
  await expect.poll(
    async () => (await cenaNaTela(page)).titulo,
    { message: `o card na tela deveria ser "${esperado}"` }
  ).toBe(esperado)
  expect(await cenaNoStore(page), 'store e tela discordam').toBe(cena.id)
  expect((await cenaNaTela(page)).scene3d, 'cena 3D nao acompanhou').toBe(cena.scene3d)
}

/** Interseccao de retangulos, com folga de 1px para arredondamento. */
export function sobrepoe (a, b, folga = 1) {
  if (!a || !b) return false
  return !(a.x + a.width - folga <= b.x ||
           b.x + b.width - folga <= a.x ||
           a.y + a.height - folga <= b.y ||
           b.y + b.height - folga <= a.y)
}

export const areaVisivel = (r) => Boolean(r) && r.width > 0 && r.height > 0

/** Coleta as caixas de todos os elementos que casam com o seletor. */
export async function caixas (page, seletor) {
  return page.$$eval(seletor, (els) => els.map((el) => {
    const r = el.getBoundingClientRect()
    return {
      x: r.x, y: r.y, width: r.width, height: r.height,
      texto: (el.textContent ?? '').trim().slice(0, 60),
      tag: el.tagName.toLowerCase()
    }
  }))
}

export async function caixa (page, seletor) {
  const l = await caixas(page, seletor)
  return l[0] ?? null
}

/** Falha com uma mensagem que diz QUAIS elementos colidiram. */
export function esperarSemSobreposicao (a, b, rotuloA, rotuloB) {
  const colisao = sobrepoe(a, b)
  expect(colisao, `"${rotuloA}" (${JSON.stringify(a)}) sobrepoe "${rotuloB}" (${JSON.stringify(b)})`).toBe(false)
}
