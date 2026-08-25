/**
 * Teclado e gestos. Contrato 2.
 * A TV e touch, entao nada aqui depende de hover. O teclado existe para a
 * bancada de testes e para o controle remoto (setas + OK).
 */
export function conectarInput (store, alvo = document) {
  const aoTeclar = (ev) => {
    if (ev.defaultPrevented) return
    switch (ev.key) {
      // Controle remoto de TV manda Up/Down tanto quanto Left/Right.
      case 'ArrowRight': case 'ArrowDown': case 'PageDown': store.proxima('teclado'); break
      case 'ArrowLeft': case 'ArrowUp': case 'PageUp': store.anterior('teclado'); break
      case ' ': case 'Spacebar': ev.preventDefault(); store.alternarReproducao(); break
      case 'Escape': store.fecharMenu(); break
      case 'm': case 'M': store.alternarMenu(); break
      case 'Home': store.ir(0, 'teclado'); break
      case 'End': store.ir(Number.MAX_SAFE_INTEGER, 'teclado'); break
      default: return
    }
  }
  alvo.addEventListener('keydown', aoTeclar)

  /*
    Swipe horizontal. Limiar generoso: dedo em TV grande erra mais.

    Rastreamos o IDENTIFICADOR do toque. Antes qualquer touchstart reescrevia
    a origem e qualquer touchend disparava, entao duas pessoas tocando a tela
    ao mesmo tempo — ou uma palma de mao — geravam swipe fantasma.
  */
  const LIMIAR = 60
  let ativo = null

  const aoTocar = (ev) => {
    if (ev.touches.length > 1) { ativo = null; return }  // multitoque: ignora
    const t = ev.changedTouches[0]
    ativo = { id: t.identifier, x: t.clientX, y: t.clientY }
  }
  const aoSoltar = (ev) => {
    if (!ativo) return
    const t = [...ev.changedTouches].find((c) => c.identifier === ativo.id)
    if (!t) return
    const dx = t.clientX - ativo.x
    const dy = t.clientY - ativo.y
    ativo = null
    if (Math.abs(dx) < LIMIAR || Math.abs(dx) < Math.abs(dy)) return
    dx < 0 ? store.proxima('swipe') : store.anterior('swipe')
  }
  const aoCancelar = () => { ativo = null }

  alvo.addEventListener('touchstart', aoTocar, { passive: true })
  alvo.addEventListener('touchend', aoSoltar, { passive: true })
  alvo.addEventListener('touchcancel', aoCancelar, { passive: true })

  return () => {
    alvo.removeEventListener('keydown', aoTeclar)
    alvo.removeEventListener('touchstart', aoTocar)
    alvo.removeEventListener('touchend', aoSoltar)
    alvo.removeEventListener('touchcancel', aoCancelar)
  }
}
