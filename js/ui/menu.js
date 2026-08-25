/**
 * Menu de atalhos. Contrato 6.
 * A lista inteira vem de chapters() + interludes(): reordenar o manifesto
 * reordena o menu, sem tocar aqui.
 */
import { chapters, interludes, SCENES } from '../data/scenes.js'
import { icone } from './icons.js'

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
))

export function createMenu ({ store }) {
  const painel = document.getElementById('menu')
  const corpo = document.getElementById('menu-corpo')
  const btnFechar = document.getElementById('btn-fechar-menu')

  const grupo = (titulo, cenas) => `
    <section class="menu__grupo">
      <h3 class="menu__grupo-titulo">${esc(titulo)}</h3>
      <ul class="menu__lista">${cenas.map(itemHtml).join('')}</ul>
    </section>`

  const itemHtml = (s) => `<li>
    <button type="button" class="menu__item" data-ir="${esc(s.id)}">
      ${icone(s.icone ?? 'lampada')}<span>${esc(s.titulo)}</span>
    </button>
  </li>`

  corpo.innerHTML =
    grupo('Percurso', interludes()) +
    chapters().map((c) => grupo(c.pilar.nome, c.cenas)).join('')

  corpo.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-ir]')
    if (!b) return
    store.irPara(b.dataset.ir, 'menu')
    store.fecharMenu()
  })
  btnFechar.addEventListener('click', () => store.fecharMenu())

  const desinscrever = store.subscribe((s) => {
    painel.hidden = !s.menuAberto
    const idAtual = SCENES[s.indice].id
    corpo.querySelectorAll('[data-ir]').forEach((b) => {
      b.setAttribute('aria-current', String(b.dataset.ir === idAtual))
    })
    if (s.menuAberto) btnFechar.focus({ preventScroll: true })
  })

  return { dispose () { desinscrever() } }
}
