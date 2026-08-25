/**
 * Valida o manifesto contra os contratos. Roda fora do browser: e barato e
 * pega erro de conteudo antes de subir o Playwright.
 */
import { fileURLToPath, pathToFileURL } from 'node:url'
import { join } from 'node:path'

const raiz = fileURLToPath(new URL('..', import.meta.url))
const imp = (p) => import(pathToFileURL(join(raiz, p)).href)

const { SCENES, CONTENT_STATUS, VIDEO_SOURCE, LAYOUTS, totalDurationMs, solutions, chapters } = await imp('js/data/scenes.js')
const { PILLARS } = await imp('js/data/brand.js')
const { REGISTRY } = await imp('js/three/scenes/index.js')
const { temIcone } = await imp('js/ui/icons.js')

const erros = []
const check = (cond, msg) => { if (!cond) erros.push(msg) }

check(SCENES.length > 0, 'manifesto vazio')
check(['final', 'real-sem-video'].includes(CONTENT_STATUS), `CONTENT_STATUS invalido: ${CONTENT_STATUS}`)

const ids = new Set()
for (const [i, s] of SCENES.entries()) {
  const onde = `cena[${i}] ${s.id ?? '(sem id)'}`
  check(typeof s.id === 'string' && /^[a-z0-9-]+$/.test(s.id), `${onde}: id deve ser kebab-case`)
  check(!ids.has(s.id), `${onde}: id duplicado`)
  ids.add(s.id)

  check(Object.values(LAYOUTS).includes(s.layout), `${onde}: layout desconhecido "${s.layout}"`)
  check(Number.isFinite(s.durationMs) && s.durationMs > 0, `${onde}: durationMs invalido`)
  check(typeof s.titulo === 'string' && s.titulo.length > 0, `${onde}: sem titulo`)
  check(Object.hasOwn(REGISTRY, s.scene3d), `${onde}: scene3d "${s.scene3d}" nao esta no registro 3D`)
  check(s.pilar === null || Object.hasOwn(PILLARS, s.pilar), `${onde}: pilar "${s.pilar}" desconhecido`)

  // Rastreabilidade ao video: sem isso o ritmo vira palpite.
  check(s.fonte && Number.isFinite(s.fonte.tIn) && Number.isFinite(s.fonte.tOut),
    `${onde}: falta fonte.tIn/tOut (segundos no video)`)
  if (s.fonte) {
    check(s.fonte.tOut > s.fonte.tIn, `${onde}: janela invertida no video`)
    const janelaMs = Math.round((s.fonte.tOut - s.fonte.tIn) * 1000)
    check(Math.abs(janelaMs - s.durationMs) <= 60,
      `${onde}: durationMs ${s.durationMs} nao bate com a janela do video ${janelaMs}`)
  }

  if (s.layout === LAYOUTS.SOLUCAO) {
    check(s.pilar !== null, `${onde}: solucao sem pilar`)
    check(Array.isArray(s.chips) && s.chips.length >= 2, `${onde}: solucao precisa de 2+ chips`)
    check(Array.isArray(s.aplicacoes) && s.aplicacoes.length > 0, `${onde}: solucao sem aplicacoes`)
    check(temIcone(s.icone), `${onde}: icone "${s.icone}" nao existe em ui/icons.js`)
    for (const [j, c] of s.chips.entries()) {
      check(Boolean(c.destaque || c.texto), `${onde}: chip[${j}] vazio`)
    }
  }
}

// As cenas devem ser contiguas no video: o fim de uma e o inicio da proxima.
for (let i = 1; i < SCENES.length; i++) {
  const a = SCENES[i - 1].fonte, b = SCENES[i].fonte
  if (a && b) check(Math.abs(b.tIn - a.tOut) < 0.001,
    `descontinuidade entre ${SCENES[i - 1].id} (fim ${a.tOut}s) e ${SCENES[i].id} (inicio ${b.tIn}s)`)
}

// A soma tem que reproduzir a duracao do video.
const somaMs = totalDurationMs()
const videoMs = Math.round(VIDEO_SOURCE.duracaoS * 1000)
check(Math.abs(somaMs - videoMs) <= 100,
  `soma das cenas ${somaMs}ms difere do video ${videoMs}ms`)

// Toda cena registrada no 3D precisa ser usada; todo pilar precisa aparecer.
const usados = new Set(SCENES.map((s) => s.scene3d))
for (const id of Object.keys(REGISTRY)) {
  check(usados.has(id), `cena 3D "${id}" registrada mas nunca usada pelo manifesto`)
}
check(solutions().length > 0, 'nenhuma solucao no manifesto')
check(chapters().length > 0, 'nenhum capitulo derivado')

if (erros.length) {
  console.error(`\nmanifesto: ${erros.length} erro(s)\n - ` + erros.join('\n - '))
  process.exit(1)
}
console.log(
  `manifesto OK — ${SCENES.length} cenas, ${solutions().length} solucoes, ` +
  `${chapters().length} capitulos, ${(somaMs / 1000).toFixed(1)}s (video ${VIDEO_SOURCE.duracaoS.toFixed(1)}s), ` +
  `status "${CONTENT_STATUS}"`)
