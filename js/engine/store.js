/**
 * Estado da apresentacao. Contrato 2.
 *
 * O store nao conhece DOM nem three.js. Ele guarda um indice dentro de
 * SCENES e avisa quem assinou. Views sao funcao do estado; nenhuma delas
 * mantem indice proprio.
 */
import { SCENES, clampIndex, indexOfScene } from '../data/scenes.js'

export function createStore (indiceInicial = 0) {
  const estado = {
    indice: clampIndex(indiceInicial),
    tocando: true,
    menuAberto: false,
    /** ms decorridos dentro da cena atual — o HUD usa para o progresso fino */
    decorridoMs: 0
  }

  const inscritos = new Set()
  let ultimoMotivo = 'inicial'

  const notificar = (motivo) => {
    ultimoMotivo = motivo
    for (const fn of inscritos) fn(snapshot(), motivo)
  }

  const snapshot = () => ({
    ...estado,
    cena: SCENES[estado.indice],
    total: SCENES.length,
    motivo: ultimoMotivo
  })

  function ir (indice, motivo = 'ir') {
    const alvo = clampIndex(indice)
    if (alvo === estado.indice && motivo !== 'inicial') return
    estado.indice = alvo
    estado.decorridoMs = 0
    notificar(motivo)
  }

  return {
    snapshot,

    subscribe (fn) {
      inscritos.add(fn)
      fn(snapshot(), 'inicial')
      return () => inscritos.delete(fn)
    },

    ir,
    irPara (id, motivo = 'menu') {
      const i = indexOfScene(id)
      if (i >= 0) ir(i, motivo)
    },
    proxima (motivo = 'proxima') {
      // Ultima cena: volta ao inicio. A TV roda em laco o dia inteiro.
      const alvo = estado.indice >= SCENES.length - 1 ? 0 : estado.indice + 1
      ir(alvo, motivo)
    },
    anterior (motivo = 'anterior') {
      const alvo = estado.indice <= 0 ? SCENES.length - 1 : estado.indice - 1
      ir(alvo, motivo)
    },

    tocar () { if (!estado.tocando) { estado.tocando = true; notificar('tocar') } },
    pausar () { if (estado.tocando) { estado.tocando = false; notificar('pausar') } },
    alternarReproducao () { estado.tocando ? this.pausar() : this.tocar() },

    abrirMenu () { if (!estado.menuAberto) { estado.menuAberto = true; notificar('menu') } },
    fecharMenu () { if (estado.menuAberto) { estado.menuAberto = false; notificar('menu') } },
    alternarMenu () { estado.menuAberto ? this.fecharMenu() : this.abrirMenu() },

    /** Chamado pelo relogio a cada quadro. Nao notifica: seria 60x/s. */
    avancarTempo (dtMs) {
      estado.decorridoMs += dtMs
      return estado.decorridoMs
    },
    zerarTempo () { estado.decorridoMs = 0 }
  }
}
