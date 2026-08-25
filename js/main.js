/**
 * Ponto de entrada. Amarra manifesto -> estado -> views -> palco 3D.
 * Nenhuma requisicao de rede: three e gsap vem do import map, apontando
 * para js/vendor/. A pagina roda com o cabo desligado.
 */
import { applyBrandTokens, COLORS, PILLARS } from './data/brand.js'
import { createStore } from './engine/store.js'
import { createClock } from './engine/clock.js'
import { conectarRouter, indiceInicialPeloHash } from './engine/router.js'
import { conectarInput } from './engine/input.js'
import { createSceneView } from './ui/scene-view.js'
import { createHud } from './ui/hud.js'
import { createMenu } from './ui/menu.js'
import { createStage } from './three/stage.js'

applyBrandTokens()

const app = document.getElementById('app')
const cena = document.getElementById('cena')
const canvas = document.getElementById('palco')

const store = createStore(indiceInicialPeloHash())
const stage = createStage(canvas, COLORS)

const view = createSceneView({ raiz: cena, app, store })
const hud = createHud({ store })
const menu = createMenu({ store })

conectarRouter(store)
conectarInput(store)

// Troca a cena 3D junto com o card, usando o `scene3d` do manifesto.
store.subscribe((s, motivo) => {
  if (motivo === 'tocar' || motivo === 'pausar' || motivo === 'menu') return
  const pilar = s.cena.pilar ? PILLARS[s.cena.pilar] : null
  if (stage.idAtual !== s.cena.scene3d || motivo === 'inicial') {
    stage.montar(s.cena.scene3d, pilar)
  } else {
    stage.montar(s.cena.scene3d, pilar)  // remonta: o acento do pilar muda
  }
})

function ajustar () {
  stage.redimensionar(innerWidth, innerHeight)
}
addEventListener('resize', ajustar)
ajustar()

const clock = createClock({
  store,
  aoQuadro: (dt) => { stage.atualizar(dt); hud.aoQuadro() },
  aoTerminarCena: () => store.proxima('auto')
})
clock.iniciar()

// Superficie de teste: a suite le daqui em vez de espiar variaveis internas.
globalThis.__cpqd = { store, stage, clock, view, hud, menu }
