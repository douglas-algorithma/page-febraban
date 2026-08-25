/**
 * Contrato 3: dispose() completo e zero alocacao em update().
 *
 * O vazamento de GPU nao aparece na tela — a pagina fica linda e vai comendo
 * memoria ate a TV engasgar depois de horas em laco. Por isso medimos
 * renderer.info em vez de confiar em inspecao visual.
 */
import { test, expect } from '@playwright/test'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { SCENES } from '../js/data/scenes.js'
import { REGISTRY } from '../js/three/scenes/index.js'
import { irPara } from './helpers.js'

const DIR_CENAS = fileURLToPath(new URL('../js/three/scenes', import.meta.url))

/** Extrai o corpo de `function nome (...) { ... }` casando chaves. */
function corpoDaFuncao (fonte, nome) {
  const i = fonte.indexOf(`function ${nome} (`)
  if (i < 0) return null
  const abre = fonte.indexOf('{', i)
  let nivel = 0
  for (let k = abre; k < fonte.length; k++) {
    if (fonte[k] === '{') nivel++
    else if (fonte[k] === '}' && --nivel === 0) return fonte.slice(abre + 1, k)
  }
  return null
}

const arquivosDeCena = readdirSync(DIR_CENAS).filter((f) => f.endsWith('.js') && f !== 'index.js')

test('todo scene3d usado pelo manifesto existe no registro', async () => {
  for (const s of SCENES) {
    expect(Object.hasOwn(REGISTRY, s.scene3d), `"${s.scene3d}" (cena ${s.id}) fora do registro`).toBe(true)
  }
})

for (const arquivo of arquivosDeCena) {
  const fonte = readFileSync(join(DIR_CENAS, arquivo), 'utf8')

  test(`${arquivo}: update() nao aloca por quadro`, async () => {
    const corpo = corpoDaFuncao(fonte, 'update')
    expect(corpo, `${arquivo} nao tem function update`).toBeTruthy()

    // Uma alocacao por quadro a 60fps sao 3.600 objetos por minuto para o GC.
    const proibidos = [
      [/\bnew\s+[A-Z]/, 'construtor (new)'],
      [/=\s*\[/, 'literal de array'],
      [/=\s*\{/, 'literal de objeto'],
      [/\.\s*(map|filter|slice|concat|flatMap)\s*\(/, 'metodo de array que cria copia']
    ]
    for (const [re, oque] of proibidos) {
      expect(re.test(corpo), `${arquivo}: update() usa ${oque}\n---\n${corpo.trim()}\n---`).toBe(false)
    }
  })

  test(`${arquivo}: dispose() devolve tudo o que a cena alocou`, async () => {
    const corpo = corpoDaFuncao(fonte, 'dispose')
    expect(corpo, `${arquivo} nao tem function dispose`).toBeTruthy()

    // Conta recursos de GPU criados no modulo e liberacoes dentro de dispose().
    // Casar nome de variavel seria fragil (aneis-card cria dentro de um laco);
    // contar e o que vale, porque e isso que a GPU enxerga.
    const alocados = (fonte.match(/new THREE\.\w*(Geometry|Material)\s*\(/g) ?? []).length
    const liberados = (corpo.match(/\.dispose\s*\(\)/g) ?? []).length

    expect(alocados, `${arquivo} nao cria geometria nem material`).toBeGreaterThan(0)
    expect(liberados,
      `${arquivo}: aloca ${alocados} recurso(s) de GPU mas dispose() libera ${liberados}\n---\n${corpo.trim()}\n---`)
      .toBeGreaterThanOrEqual(alocados)
  })
}

test('percorrer todas as cenas nao deixa geometria viva na GPU', async ({ page }) => {
  await irPara(page, SCENES[0].id)

  /*
    Medir renderer.info exige estado deterministico: a contagem sobe no UPLOAD
    (primeiro render) e desce no dispose. Trocar 29 cenas em rajada, sem deixar
    render acontecer, le um numero que depende de quantos quadros couberam no
    meio — foi o que tornou este teste flaky sob carga paralela.
    Entao sempre medimos na MESMA cena e depois de dois quadros garantidos.
  */
  const medir = async () => {
    await page.evaluate((id) => globalThis.__cpqd.store.irPara(id, 'teste'), SCENES[0].id)
    await page.waitForSelector('#app[data-scene-settled="true"]')
    await page.evaluate(() => new Promise((r) =>
      requestAnimationFrame(() => requestAnimationFrame(r))))
    return page.evaluate(() => {
      const m = globalThis.__cpqd.stage.info.memory
      return { geometrias: m.geometries, texturas: m.textures }
    })
  }

  const umaVolta = async () => {
    for (const cena of SCENES) {
      await page.evaluate((id) => globalThis.__cpqd.store.irPara(id, 'teste'), cena.id)
      await page.evaluate(() => new Promise((r) => requestAnimationFrame(r)))
    }
  }

  // Volta de aquecimento antes de medir: o three aloca por conta propria na
  // primeira renderizacao de MeshStandardMaterial (a LUT de BRDF, uma textura
  // do renderer que nunca e liberada). Contar isso seria medir errado.
  await umaVolta()
  const linhaBase = await medir()

  await umaVolta()
  await umaVolta()
  const depois = await medir()

  expect(depois.geometrias,
    `geometrias: ${linhaBase.geometrias} -> ${depois.geometrias} apos 2 voltas completas`)
    .toBeLessThanOrEqual(linhaBase.geometrias)
  expect(depois.texturas,
    `texturas: ${linhaBase.texturas} -> ${depois.texturas} apos 2 voltas completas`)
    .toBeLessThanOrEqual(linhaBase.texturas)
})

test('a cena 3D anterior e desmontada antes da proxima montar', async ({ page }) => {
  await irPara(page, SCENES[0].id)
  const vivas = await page.evaluate(async () => {
    const { stage, store } = globalThis.__cpqd
    const ids = new Set()
    for (const s of [1, 2, 3, 4, 5]) {
      store.ir(s, 'teste')
      ids.add(stage.idAtual)
    }
    return { idAtual: stage.idAtual, distintas: ids.size }
  })
  expect(vivas.idAtual).toBeTruthy()
  expect(vivas.distintas).toBeGreaterThan(1)
})

test('trocar de cena nao gera erro de WebGL nem de console', async ({ page }) => {
  const problemas = []
  page.on('pageerror', (e) => problemas.push('pageerror: ' + e.message))
  page.on('console', (m) => { if (m.type() === 'error') problemas.push('console: ' + m.text()) })

  await irPara(page, SCENES[0].id)
  for (const cena of SCENES) {
    await page.evaluate((id) => globalThis.__cpqd.store.irPara(id, 'teste'), cena.id)
  }
  await page.waitForTimeout(300)
  expect(problemas).toEqual([])
})

test('o palco continua renderizando depois de redimensionar', async ({ page }) => {
  await irPara(page, SCENES[0].id)
  const antes = await page.evaluate(() => globalThis.__cpqd.stage.info.render.frame)
  await page.setViewportSize({ width: 1280, height: 720 })
  await page.waitForTimeout(250)
  const depois = await page.evaluate(() => globalThis.__cpqd.stage.info.render.frame)
  expect(depois, 'o loop de render parou apos o resize').toBeGreaterThan(antes)
})
