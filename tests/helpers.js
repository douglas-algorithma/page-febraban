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

export async function cenaAtual (page) {
  return page.evaluate(() => globalThis.__cpqd.store.snapshot().cena.id)
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
