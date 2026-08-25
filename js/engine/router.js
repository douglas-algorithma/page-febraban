/**
 * Rotas por hash, derivadas do manifesto. Contrato 2.
 * #/<id-da-cena>. Id desconhecido cai na primeira cena, sem erro.
 *
 * Usamos replaceState de proposito: e um totem que roda em laco o dia
 * inteiro, e pushState empilharia 30 entradas por volta, para sempre. O preco
 * e que o Voltar do navegador sai da apresentacao — que num totem e o
 * comportamento desejado.
 */
import { SCENES, indexOfScene } from '../data/scenes.js'

export const idDoHash = () => decodeURIComponent(location.hash.replace(/^#\/?/, ''))

export function indiceInicialPeloHash () {
  const i = indexOfScene(idDoHash())
  return i >= 0 ? i : 0
}

export function conectarRouter (store) {
  const escrever = (indice) => {
    const alvo = `#/${SCENES[indice].id}`
    // replaceState NAO dispara hashchange, entao nao ha laco a evitar aqui.
    if (location.hash !== alvo) history.replaceState(null, '', alvo)
  }

  const aoMudarHash = () => {
    const i = indexOfScene(idDoHash())
    if (i >= 0) {
      store.ir(i, 'rota')
    } else {
      // Rota invalida em runtime: a cena (corretamente) nao muda, mas a URL
      // nao pode ficar mentindo o que esta na tela.
      escrever(store.snapshot().indice)
    }
  }
  addEventListener('hashchange', aoMudarHash)

  const desinscrever = store.subscribe((s) => escrever(s.indice))

  return () => { removeEventListener('hashchange', aoMudarHash); desinscrever() }
}
