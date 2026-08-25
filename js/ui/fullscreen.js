/**
 * Tela cheia para o totem.
 *
 * Some com a aba, a barra de endereco e a moldura do navegador — na TV do
 * estande o visitante nao pode ver Chrome nenhum. Precisa partir de um gesto
 * do usuario (regra dos navegadores), entao vive num botao e na tecla F.
 *
 * Tambem esconde o cursor quando ninguem mexe: em TV touch o ponteiro do
 * mouse parado no meio da tela e um defeito visivel.
 */
const OCIOSO_MS = 3000

export function createFullscreen () {
  const botao = document.getElementById('btn-tela-cheia')
  const glifo = document.getElementById('btn-tela-cheia-glifo')
  const app = document.documentElement

  const ativa = () => Boolean(document.fullscreenElement)

  async function alternar () {
    try {
      if (ativa()) await document.exitFullscreen()
      else await app.requestFullscreen?.({ navigationUI: 'hide' })
    } catch {
      // Navegador pode recusar (sem gesto, ou politica de permissao).
      // Nao e motivo para derrubar a apresentacao.
    }
  }

  function refletir () {
    const on = ativa()
    botao.setAttribute('aria-pressed', String(on))
    botao.setAttribute('aria-label', on ? 'Sair da tela cheia' : 'Entrar em tela cheia')
    glifo.textContent = on ? '⛗' : '⛶'
    document.body.dataset.telaCheia = String(on)
  }

  botao.addEventListener('click', alternar)
  document.addEventListener('fullscreenchange', refletir)

  const aoTeclar = (ev) => {
    if (ev.key === 'f' || ev.key === 'F') { ev.preventDefault(); alternar() }
  }
  document.addEventListener('keydown', aoTeclar)

  // ── cursor ocioso ─────────────────────────────────────────────────────
  let timer = 0
  const acordar = () => {
    document.body.dataset.cursor = 'visivel'
    clearTimeout(timer)
    timer = setTimeout(() => { document.body.dataset.cursor = 'oculto' }, OCIOSO_MS)
  }
  for (const ev of ['pointermove', 'pointerdown', 'keydown']) {
    document.addEventListener(ev, acordar, { passive: true })
  }
  acordar()

  refletir()

  return {
    alternar,
    get ativa () { return ativa() },
    dispose () {
      clearTimeout(timer)
      botao.removeEventListener('click', alternar)
      document.removeEventListener('fullscreenchange', refletir)
      document.removeEventListener('keydown', aoTeclar)
    }
  }
}
