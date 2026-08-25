/**
 * Renderizador de cenas. Contrato 4.
 *
 * Recebe uma cena do manifesto e devolve o card. O `layout` decide a forma;
 * nenhum id de cena aparece aqui — acrescentar uma solucao no manifesto nao
 * toca este arquivo.
 *
 * SINAL DE ASSENTAMENTO (importante para o QA)
 * Enquanto a entrada do GSAP corre, um item medido no meio do tween e MENOR
 * que o tamanho de repouso, e a medicao vira falha intermitente. Por isso,
 * ao terminar a timeline marcamos #app[data-scene-settled="true"].
 * Os testes esperam por esse atributo — nunca por timeout.
 */
import { gsap } from 'gsap'
import { LAYOUTS, solutions, indexOfScene } from '../data/scenes.js'
import { PILLARS } from '../data/brand.js'
import { icone } from './icons.js'
import { qrSvg } from './qr.js'

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
))

/** Layouts que no video acontecem sobre fundo claro. */
const CLAROS = new Set([LAYOUTS.SOLUCAO, LAYOUTS.MANDALA, LAYOUTS.CTA])
export const superficieDe = (cena) => (CLAROS.has(cena.layout) ? 'clara' : 'escura')

function tituloComDestaque (cena) {
  const t = esc(cena.titulo)
  if (!cena.tituloDestaque) return t
  const d = esc(cena.tituloDestaque)
  return t.replace(d, `<em>${d}</em>`)
}

// ────────────────────────────────────────────────────────────── layouts

function abertura (cena) {
  return `<article class="card card--abertura">
    <h1 class="card__titulo">${tituloComDestaque(cena)}</h1>
    <p class="card__subtitulo">${esc(cena.subtitulo)}</p>
  </article>`
}

function pilares (cena) {
  const itens = Object.values(PILLARS).map((p) => {
    const [primeira, ...resto] = p.nome.split(' ')
    return `<li class="pilares__item">
      <span class="pilares__disco">${icone(p.icone)}</span>
      <span class="pilares__nome">${esc(primeira)}<span>${esc(resto.join(' '))}</span></span>
    </li>`
  }).join('')
  return `<article class="card card--pilares">
    <h1 class="card__titulo">${tituloComDestaque(cena)}</h1>
    <p class="card__subtitulo">${esc(cena.subtitulo)}</p>
    <ul class="pilares">${itens}</ul>
  </article>`
}

function tituloPilar (cena) {
  return `<article class="card card--titulo-pilar">
    <h1 class="card__titulo">${esc(cena.titulo)}</h1>
    <p class="card__subtitulo">${esc(cena.subtitulo)}</p>
  </article>`
}

function chipHtml (c, metrica) {
  const partes = []
  if (c.rotulo) partes.push(`<span class="chip__rotulo">${esc(c.rotulo)}</span>`)
  if (c.destaque) partes.push(`<span class="chip__destaque">${esc(c.destaque)}</span>`)
  if (c.unidade) partes.push(`<span class="chip__unidade">${esc(c.unidade)}</span>`)
  if (c.texto) partes.push(`<span class="chip__texto">${esc(c.texto)}</span>`)
  return `<li class="chip${metrica ? ' chip--metrica' : ''}">${partes.join('')}</li>`
}

function solucao (cena) {
  const p = PILLARS[cena.pilar]
  const chips = (cena.chips ?? []).map((c) => chipHtml(c, cena.metrica)).join('')
  const apps = (cena.aplicacoes ?? []).join(' | ')
  return `<article class="card card--solucao">
    <div class="card__cabecalho">
      <span class="card__icone">${icone(cena.icone)}</span>
      <h1 class="card__titulo">${esc(cena.titulo)}</h1>
    </div>
    <ul class="chips">${chips}</ul>
    ${apps ? `<p class="aplicacoes"><b>Aplicações:</b> ${esc(apps)}</p>` : ''}
    <div class="moeda">
      <span class="moeda__disco">${icone(p?.icone)}</span>
      <span class="moeda__etiqueta">${esc(p?.nome)}</span>
    </div>
  </article>`
}

function mandala (cena) {
  const todas = solutions()
  const meio = Math.ceil(todas.length / 2)
  const coluna = (lista) => `<div class="mandala__coluna">` + lista.map((s) => `
    <button type="button" class="mandala__item" data-ir="${esc(s.id)}" data-pilar="${esc(s.pilar)}">
      ${icone(s.icone)}<span>${esc(s.titulo)}</span>
    </button>`).join('') + `</div>`
  return `<article class="card card--mandala">
    <h1 class="card__titulo">${esc(cena.titulo)}</h1>
    <p class="card__subtitulo">${esc(cena.subtitulo)}</p>
    <div class="mandala">
      ${coluna(todas.slice(0, meio))}
      <div class="mandala__centro">
        <div class="mandala__nucleo">ECOSSISTEMA<br>DE SOLUÇÕES<br><strong>cpqd</strong></div>
      </div>
      ${coluna(todas.slice(meio))}
    </div>
  </article>`
}

function cta (cena) {
  return `<article class="card card--cta">
    <div class="qr">${qrSvg()}</div>
    <h1 class="card__titulo">${tituloComDestaque(cena)}</h1>
    <p class="card__subtitulo">${esc(cena.subtitulo)}</p>
  </article>`
}

function encerramento (cena) {
  return `<article class="card card--encerramento">
    <h1 class="card__titulo">${esc(cena.titulo)}</h1>
  </article>`
}

const RENDER = {
  [LAYOUTS.ABERTURA]: abertura,
  [LAYOUTS.PILARES]: pilares,
  [LAYOUTS.TITULO_PILAR]: tituloPilar,
  [LAYOUTS.SOLUCAO]: solucao,
  [LAYOUTS.MANDALA]: mandala,
  [LAYOUTS.CTA]: cta,
  [LAYOUTS.ENCERRAMENTO]: encerramento
}

// ────────────────────────────────────────────────────────────────── view

export function createSceneView ({ raiz, app, store }) {
  let timeline = null

  function desenhar (cena) {
    timeline?.kill()
    app.dataset.sceneSettled = 'false'
    app.dataset.superficie = superficieDe(cena)
    raiz.dataset.superficie = superficieDe(cena)
    raiz.innerHTML = (RENDER[cena.layout] ?? encerramento)(cena)

    const card = raiz.firstElementChild
    const filhos = card.querySelectorAll(':scope > *')

    timeline = gsap.timeline({
      onComplete: () => { app.dataset.sceneSettled = 'true' }
    })
    timeline
      .fromTo(card, { opacity: 0 }, { opacity: 1, duration: 0.36, ease: 'power2.out' })
      .fromTo(filhos,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.42, stagger: 0.06, ease: 'power2.out', clearProps: 'transform' },
        '<0.05')

    // Clique nos itens da mandala: navegacao derivada do proprio manifesto.
    raiz.querySelectorAll('[data-ir]').forEach((b) => {
      b.addEventListener('click', () => store.irPara(b.dataset.ir, 'mandala'))
    })
  }

  const desinscrever = store.subscribe((s, motivo) => {
    if (motivo === 'tocar' || motivo === 'pausar' || motivo === 'menu') return
    desenhar(s.cena)
  })

  return {
    dispose () { timeline?.kill(); desinscrever() }
  }
}
