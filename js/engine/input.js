/**
 * Teclado e gestos. Contrato 2.
 * A TV e touch, entao nada aqui depende de hover. O teclado existe para a
 * bancada de testes e para o controle remoto (setas + OK).
 */
export function conectarInput (store, alvo = document) {
  const aoTeclar = (ev) => {
    if (ev.defaultPrevented) return
    switch (ev.key) {
      case 'ArrowRight': case 'PageDown': store.proxima('teclado'); break
      case 'ArrowLeft': case 'PageUp': store.anterior('teclado'); break
      case ' ': case 'Spacebar': ev.preventDefault(); store.alternarReproducao(); break
      case 'Escape': store.fecharMenu(); break
      case 'm': case 'M': store.alternarMenu(); break
      case 'Home': store.ir(0, 'teclado'); break
      case 'End': store.ir(Number.MAX_SAFE_INTEGER, 'teclado'); break
      default: return
    }
  }
  alvo.addEventListener('keydown', aoTeclar)

  // Swipe horizontal. Limiar generoso: dedo em TV grande erra mais.
  let x0 = null, y0 = null
  const LIMIAR = 60
  const aoTocar = (ev) => { const t = ev.changedTouches[0]; x0 = t.clientX; y0 = t.clientY }
  const aoSoltar = (ev) => {
    if (x0 === null) return
    const t = ev.changedTouches[0]
    const dx = t.clientX - x0
    const dy = t.clientY - y0
    x0 = null
    if (Math.abs(dx) < LIMIAR || Math.abs(dx) < Math.abs(dy)) return
    dx < 0 ? store.proxima('swipe') : store.anterior('swipe')
  }
  alvo.addEventListener('touchstart', aoTocar, { passive: true })
  alvo.addEventListener('touchend', aoSoltar, { passive: true })

  return () => {
    alvo.removeEventListener('keydown', aoTeclar)
    alvo.removeEventListener('touchstart', aoTocar)
    alvo.removeEventListener('touchend', aoSoltar)
  }
}
