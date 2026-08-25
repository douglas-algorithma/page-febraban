/**
 * Rotas por hash, derivadas do manifesto. Contrato 2.
 * #/<id-da-cena>. Id desconhecido cai na primeira cena, sem erro.
 */
import { SCENES, indexOfScene } from '../data/scenes.js'

export const idDoHash = () => decodeURIComponent(location.hash.replace(/^#\/?/, ''))

export function indiceInicialPeloHash () {
  const i = indexOfScene(idDoHash())
  return i >= 0 ? i : 0
}

export function conectarRouter (store) {
  let ignorarProximo = false

  const aoMudarHash = () => {
    if (ignorarProximo) { ignorarProximo = false; return }
    const i = indexOfScene(idDoHash())
    if (i >= 0) store.ir(i, 'rota')
  }
  addEventListener('hashchange', aoMudarHash)

  const desinscrever = store.subscribe((s) => {
    const alvo = `#/${SCENES[s.indice].id}`
    if (location.hash !== alvo) {
      ignorarProximo = true
      history.replaceState(null, '', alvo)
    }
  })

  return () => { removeEventListener('hashchange', aoMudarHash); desinscrever() }
}
