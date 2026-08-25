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
import { createFullscreen } from './ui/fullscreen.js'
import { createRipple, createAtracao } from './ui/efeitos.js'
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
const telaCheia = createFullscreen()
const ripple = createRipple()
const atracao = createAtracao({ store })

conectarRouter(store)
conectarInput(store)

// Troca a cena 3D junto com o card, usando o `scene3d` do manifesto.
// Remonta quando muda o visual OU o pilar (o acento vem do pilar), e nao a
// cada navegacao — antes os dois bracos do if eram identicos.
let montado = null
store.subscribe((s) => {
  const chave = `${s.cena.scene3d}|${s.cena.pilar ?? ''}`
  if (chave === montado) return
  montado = chave
  stage.montar(s.cena.scene3d, s.cena.pilar ? PILLARS[s.cena.pilar] : null)
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
globalThis.__cpqd = { store, stage, clock, view, hud, menu, telaCheia, ripple, atracao }
