/**
 * Palco 3D. Contrato 3.
 *
 * O palco e dono do renderer e do ciclo de vida. Cada modulo de cena cria a
 * PROPRIA THREE.Scene e a propria camera, e e obrigado a devolver tudo em
 * dispose(). O palco ainda passa um pente fino (disposeDeep) como rede de
 * seguranca — se um modulo esquecer uma geometria, ela morre aqui, e o teste
 * de ciclo de vida acusa o vazamento.
 */
import * as THREE from 'three'
import { REGISTRY } from './scenes/index.js'

/** Libera geometria, material e textura de tudo que estiver na arvore. */
export function disposeDeep (raiz) {
  if (!raiz) return
  raiz.traverse((obj) => {
    obj.geometry?.dispose?.()
    const mats = Array.isArray(obj.material) ? obj.material : (obj.material ? [obj.material] : [])
    for (const m of mats) {
      for (const chave of Object.keys(m)) {
        const v = m[chave]
        if (v && v.isTexture) v.dispose()
      }
      m.dispose?.()
    }
  })
  if (raiz.background?.isTexture) raiz.background.dispose()
  if (raiz.environment?.isTexture) raiz.environment.dispose()
  raiz.clear?.()
}

export function createStage (canvas, cores) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance'
  })
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2)) // 4K: teto de 2
  renderer.setClearColor(0x20112c, 1)

  let atual = null      // { id, mod }
  let largura = 1
  let altura = 1
  let tempo = 0

  function montar (id, pilar) {
    desmontar()
    const fabrica = REGISTRY[id]
    if (!fabrica) return   // id desconhecido nao derruba a pagina
    const mod = fabrica({ THREE, cores, pilar, largura, altura })
    mod.resize?.(largura, altura)
    atual = { id, mod }
    tempo = 0
  }

  function desmontar () {
    if (!atual) return
    const { mod } = atual
    try { mod.dispose?.() } finally { disposeDeep(mod.scene) }
    atual = null
  }

  function redimensionar (w, h) {
    largura = Math.max(1, Math.floor(w))
    altura = Math.max(1, Math.floor(h))
    renderer.setSize(largura, altura, false)
    atual?.mod.resize?.(largura, altura)
  }

  function atualizar (dtMs) {
    if (!atual) return
    tempo += dtMs
    atual.mod.update?.(dtMs / 1000, tempo / 1000)
    if (atual.mod.scene && atual.mod.camera) {
      renderer.render(atual.mod.scene, atual.mod.camera)
    }
  }

  return {
    montar,
    desmontar,
    redimensionar,
    atualizar,
    get idAtual () { return atual?.id ?? null },
    /** Numero de objetos vivos na GPU — o teste de vazamento le isto. */
    get info () { return renderer.info },
    dispose () {
      desmontar()
      renderer.dispose()
    }
  }
}
