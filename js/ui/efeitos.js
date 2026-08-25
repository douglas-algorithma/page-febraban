/**
 * Efeitos de presenca para o totem.
 *
 * Nada aqui muda conteudo nem navegacao — sao respostas visuais ao toque.
 * Tudo respeita `prefers-reduced-motion` e nada intercepta ponteiro.
 */
const MENOS_MOVIMENTO = () =>
  globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

/**
 * Onda de toque: um circulo verde-limao que abre onde o dedo encostou.
 * Numa TV grande o visitante precisa de confirmacao imediata de que a tela
 * registrou o toque — sem isso ele toca de novo, e duas vezes.
 */
export function createRipple (raiz = document.body) {
  const camada = document.createElement('div')
  camada.className = 'ondas'
  camada.setAttribute('aria-hidden', 'true')
  raiz.append(camada)

  const aoTocar = (ev) => {
    if (MENOS_MOVIMENTO()) return
    const onda = document.createElement('span')
    onda.className = 'onda'
    onda.style.left = `${ev.clientX}px`
    onda.style.top = `${ev.clientY}px`
    camada.append(onda)
    // O proprio fim da animacao limpa: sem timer, sem vazamento de nos.
    onda.addEventListener('animationend', () => onda.remove(), { once: true })
  }
  document.addEventListener('pointerdown', aoTocar, { passive: true })

  return {
    dispose () {
      document.removeEventListener('pointerdown', aoTocar)
      camada.remove()
    }
  }
}

/**
 * Modo atracao: depois de muito tempo sem ninguem tocar, a apresentacao volta
 * ao inicio e retoma sozinha. E o comportamento esperado de um totem de
 * estande — ninguem quer encontrar a tela parada no card 23 de manha.
 */
export function createAtracao ({ store, ociosoMs = 180_000 }) {
  let timer = 0

  const reiniciar = () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      const s = store.snapshot()
      if (s.indice !== 0) store.ir(0, 'atracao')
      if (!s.tocando) store.tocar()
    }, ociosoMs)
  }

  for (const ev of ['pointerdown', 'keydown', 'touchstart']) {
    document.addEventListener(ev, reiniciar, { passive: true })
  }
  reiniciar()

  return {
    dispose () {
      clearTimeout(timer)
      for (const ev of ['pointerdown', 'keydown', 'touchstart']) {
        document.removeEventListener(ev, reiniciar)
      }
    }
  }
}
