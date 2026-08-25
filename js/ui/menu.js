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
  const btnMenu = document.getElementById('btn-menu')
  const cena = document.getElementById('cena')

  const itemHtml = (s) => `<li>
    <button type="button" class="menu__item" data-ir="${esc(s.id)}">
      ${icone(s.icone ?? 'lampada')}<span>${esc(s.titulo.replace(/\n/g, ' '))}</span>
    </button>
  </li>`

  const grupo = (titulo, cenas) => `
    <section class="menu__grupo">
      <h3 class="menu__grupo-titulo">${esc(titulo)}</h3>
      <ul class="menu__lista">${cenas.map(itemHtml).join('')}</ul>
    </section>`

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

  // Armadilha de foco: com o painel aberto o Tab nao pode escapar para os
  // controles que estao visualmente cobertos.
  painel.addEventListener('keydown', (ev) => {
    if (ev.key !== 'Tab') return
    const focaveis = painel.querySelectorAll('button:not([disabled])')
    if (!focaveis.length) return
    const primeiro = focaveis[0]
    const ultimo = focaveis[focaveis.length - 1]
    if (ev.shiftKey && document.activeElement === primeiro) {
      ev.preventDefault(); ultimo.focus()
    } else if (!ev.shiftKey && document.activeElement === ultimo) {
      ev.preventDefault(); primeiro.focus()
    }
  })

  let aberto = false

  const desinscrever = store.subscribe((s) => {
    const idAtual = SCENES[s.indice].id
    corpo.querySelectorAll('[data-ir]').forEach((b) => {
      b.setAttribute('aria-current', String(b.dataset.ir === idAtual))
    })

    if (s.menuAberto === aberto) return   // so age na TRANSICAO
    aberto = s.menuAberto
    painel.hidden = !aberto
    cena.inert = aberto                    // fundo fora da arvore de foco
    if (aberto) btnFechar.focus({ preventScroll: true })
    else btnMenu.focus({ preventScroll: true })   // devolve o foco a origem
  })

  return { dispose () { desinscrever() } }
}
