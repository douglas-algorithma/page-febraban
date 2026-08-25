/**
 * Relogio de reproducao. Contrato 2.
 *
 * Uma unica requestAnimationFrame move: (a) o avanco automatico entre cenas,
 * respeitando o `durationMs` medido no video, e (b) o `update(dt)` da cena 3D.
 * Ninguem mais pode abrir um rAF proprio.
 */
export function createClock ({ store, aoQuadro, aoTerminarCena }) {
  let handle = 0
  let ultimo = 0
  let vivo = false

  function quadro (agora) {
    if (!vivo) return
    const dt = ultimo === 0 ? 16.7 : Math.min(agora - ultimo, 100) // clamp: aba oculta
    ultimo = agora

    const s = store.snapshot()
    if (s.tocando && !s.menuAberto) {
      const decorrido = store.avancarTempo(dt)
      if (decorrido >= s.cena.durationMs) {
        store.zerarTempo()
        aoTerminarCena?.()
      }
    }
    aoQuadro?.(dt, agora)
    handle = requestAnimationFrame(quadro)
  }

  return {
    iniciar () {
      if (vivo) return
      vivo = true
      ultimo = 0
      handle = requestAnimationFrame(quadro)
    },
    parar () {
      vivo = false
      if (handle) cancelAnimationFrame(handle)
      handle = 0
    }
  }
}
