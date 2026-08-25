/**
 * HUD: cabecalho e controles. Contrato 5.
 *
 * O HUD nunca desenha o titulo da cena — quem faz isso e a scene-view. Essa
 * separacao e proposital: a duplicacao era o que produzia dois textos no
 * mesmo lugar, em camadas diferentes, sem nenhuma medicao acusar.
 */
import { PILLARS } from '../data/brand.js'
import { SCENES, totalDurationMs, startMsAt } from '../data/scenes.js'

export function createHud ({ store }) {
  const pilarEl = document.getElementById('hud-pilar')
  const contadorEl = document.getElementById('hud-contador')
  const barraEl = document.getElementById('progresso-preenchido')
  const progressoEl = document.getElementById('progresso')
  const btnAnterior = document.getElementById('btn-anterior')
  const btnPlay = document.getElementById('btn-play')
  const btnPlayGlifo = document.getElementById('btn-play-glifo')
  const btnProxima = document.getElementById('btn-proxima')
  const btnMenu = document.getElementById('btn-menu')

  const anuncioEl = document.getElementById('anuncio')
  const total = totalDurationMs()

  btnAnterior.addEventListener('click', () => store.anterior('botao'))
  btnProxima.addEventListener('click', () => store.proxima('botao'))
  btnPlay.addEventListener('click', () => store.alternarReproducao())
  btnMenu.addEventListener('click', () => store.alternarMenu())

  const desinscrever = store.subscribe((s) => {
    const p = s.cena.pilar ? PILLARS[s.cena.pilar] : null
    // So o contexto. O titulo pertence ao card — duplicar era o bug de sobreposicao.
    pilarEl.textContent = p ? p.nome : ''
    contadorEl.textContent = `${s.indice + 1} / ${s.total}`

    btnPlay.setAttribute('aria-pressed', String(!s.tocando))
    btnPlay.setAttribute('aria-label', s.tocando ? 'Pausar reprodução automática' : 'Retomar reprodução automática')
    btnPlayGlifo.textContent = s.tocando ? '❚❚' : '▶'

    btnMenu.setAttribute('aria-expanded', String(s.menuAberto))
    // Anuncia so o titulo da cena, nao o card inteiro.
    const anuncio = `${s.cena.titulo.replace(/\n/g, ' ')} — ${s.indice + 1} de ${s.total}`
    if (anuncioEl.textContent !== anuncio) anuncioEl.textContent = anuncio
    atualizarProgresso(s)
  })

  function atualizarProgresso (s) {
    const dentro = Math.min(Math.max(s.decorridoMs, 0), s.cena.durationMs)
    const decorrido = startMsAt(s.indice) + dentro
    const razao = Math.max(0, Math.min(decorrido / total, 1))
    barraEl.style.width = `${(razao * 100).toFixed(2)}%`
    progressoEl.setAttribute('aria-valuenow', String(Math.round(razao * 100)))

    // Anel do botao de reproducao: quanto falta da CENA, nao da apresentacao.
    const naCena = s.cena.durationMs > 0 ? dentro / s.cena.durationMs : 0
    btnPlay.style.setProperty('--cena-progresso', naCena.toFixed(3))
  }

  return {
    /** Chamado pelo relogio. Nao passa pelo store: seriam 60 notificacoes/s. */
    aoQuadro () { atualizarProgresso(store.snapshot()) },
    dispose () { desinscrever() }
  }
}
