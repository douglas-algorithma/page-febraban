/**
 * Renderizador de cenas. Contrato 4.
 *
 * Recebe uma cena do manifesto e desenha o card. O `layout` decide a forma;
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
import { LAYOUTS, solutions, rotuloMandala, solucoesDaColuna } from '../data/scenes.js'
import { PILLARS } from '../data/brand.js'
import { icone } from './icons.js'
import { qrSvg } from './qr.js'
import { rodaSvg } from './mandala.js'

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
))

/** Layouts que no video acontecem sobre fundo claro. */
const CLAROS = new Set([LAYOUTS.SOLUCAO, LAYOUTS.MANDALA, LAYOUTS.CTA, LAYOUTS.INSTITUCIONAL])
export const superficieDe = (cena) => (CLAROS.has(cena.layout) ? 'clara' : 'escura')

/**
 * `\n` no manifesto vira quebra de linha — o video quebra titulos em 2 linhas.
 *
 * Cada linha vira um <span> de bloco, separado por um espaco de verdade no
 * markup. Com <br> o textContent do h1 saia colado ("Data CenterGerência"),
 * porque <br> nao contribui texto — e qualquer conferencia do titulo contra
 * o manifesto quebrava.
 */
const comQuebras = (t) =>
  esc(t).split('\n').map((l) => `<span class="linha">${l}</span>`).join(' ')

/** **negrito parcial** nos rotulos da mandala, como no video. */
const comNegrito = (t) => esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')

/**
 * Destaque tipografico do titulo. Aceita string ou lista de trechos — o card
 * institucional tem tres trechos realcados na mesma frase.
 */
function comDestaque (texto, destaques) {
  let t = comQuebras(texto)
  if (!destaques) return t
  for (const d of [].concat(destaques)) {
    const alvo = esc(d)
    t = t.replace(alvo, `<em>${alvo}</em>`)
  }
  return t
}
const tituloComDestaque = (cena) => comDestaque(cena.titulo, cena.tituloDestaque)
const subtituloComDestaque = (cena) => comDestaque(cena.subtitulo, cena.subtituloDestaque)

// ────────────────────────────────────────────────────────────────── chips

/**
 * Tres modos, todos observados no video:
 *  - metrica: numero-heroi empilhado sobre unidade e legenda
 *  - corrido: uma FRASE so, com trechos coloridos inline
 *  - conceito: rotulo verde em linha propria e o texto branco embaixo
 *
 * O que decide entre corrido e conceito e a presenca de `rotulo`: quando ha
 * texto ANTES do destaque, o chip e uma frase ("Atendemos 90% das
 * adquirentes") e tem que fluir; quando e so destaque + texto, o video
 * empilha ("Confiabilidade" verde em cima, a explicacao embaixo).
 */
function chipHtml (c, metrica) {
  const parte = (v, classe) => (v ? `<span class="${classe}">${esc(v)}</span>` : '')
  const corpo =
    parte(c.rotulo, 'chip__rotulo') +
    parte(c.destaque, 'chip__destaque') +
    parte(c.unidade, 'chip__unidade') +
    parte(c.texto, 'chip__texto') +
    parte(c.destaque2, 'chip__destaque') +
    parte(c.texto2, 'chip__texto')
  const frase = Boolean(c.rotulo || c.destaque2)
  const modo = metrica ? 'chip--metrica' : (frase ? 'chip--corrido' : 'chip--conceito')
  return `<li class="chip ${modo}">${corpo}</li>`
}

function aplicacoesHtml (cena) {
  const apps = (cena.aplicacoes ?? []).join(' | ')
  if (!apps) return ''
  return `<p class="aplicacoes"><b>Aplicações:</b> ${esc(apps)}</p>`
}

/** Moeda do pilar + placa, canto inferior esquerdo. A placa e tingida. */
function moedaHtml (pilar) {
  if (!pilar) return ''
  return `<div class="moeda" data-pilar="${esc(pilar.id)}">
    <span class="moeda__disco">${icone(pilar.icone)}</span>
    <span class="moeda__etiqueta">${esc(pilar.nome)}</span>
  </div>`
}

// ────────────────────────────────────────────────────────────────── layouts

function abertura (cena) {
  return `<article class="card card--abertura">
    <h1 class="card__titulo">${tituloComDestaque(cena)}</h1>
    <p class="card__subtitulo">${esc(cena.subtitulo)}</p>
  </article>`
}

function institucional (cena) {
  const cartoes = (cena.chips ?? []).map((c) => {
    const lista = c.lista
      ? `<ul class="numero__lista">${c.lista.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`
      : ''
    return `<li class="numero">
      <span class="numero__icone">${icone(c.icone)}</span>
      <span class="numero__corpo">
        ${c.rotulo ? `<span class="numero__rotulo">${esc(c.rotulo)}</span>` : ''}
        ${c.destaque ? `<span class="numero__destaque">${esc(c.destaque)}</span>` : ''}
        ${c.texto ? `<span class="numero__texto">${esc(c.texto)}</span>` : ''}
        ${lista}
      </span>
    </li>`
  }).join('')
  return `<article class="card card--institucional">
    <h1 class="card__titulo">${tituloComDestaque(cena)}</h1>
    <ul class="numeros">${cartoes}</ul>
  </article>`
}

function pilares (cena) {
  const itens = Object.values(PILLARS).map((p) => {
    const [primeira, ...resto] = p.nome.split(' ')
    return `<li class="pilares__item">
      <span class="pilares__disco">${icone(p.icone)}</span>
      <span class="pilares__nome">${esc(primeira.toUpperCase())}<span>${esc(resto.join(' ').toUpperCase())}</span></span>
    </li>`
  }).join('')
  return `<article class="card card--pilares">
    <h1 class="card__titulo">${tituloComDestaque(cena)}</h1>
    <p class="card__subtitulo">${esc(cena.subtitulo)}</p>
    <ul class="pilares">${itens}</ul>
  </article>`
}

function tituloPilar (cena) {
  const p = PILLARS[cena.pilar]
  return `<article class="card card--titulo-pilar" data-pilar="${esc(cena.pilar)}">
    <span class="medalhao">${icone(p?.icone)}</span>
    <div class="card__texto">
      <h1 class="card__titulo">${comQuebras(cena.titulo)}</h1>
      <p class="card__subtitulo">${esc(cena.subtitulo)}</p>
    </div>
  </article>`
}

function solucao (cena) {
  const chips = (cena.chips ?? []).map((c) => chipHtml(c, cena.metrica)).join('')
  return `<article class="card card--solucao">
    <div class="card__cabecalho">
      <span class="card__icone">${icone(cena.icone)}</span>
      <h1 class="card__titulo">${comQuebras(cena.titulo)}</h1>
    </div>
    <ul class="chips">${chips}</ul>
    ${aplicacoesHtml(cena)}
    ${moedaHtml(PILLARS[cena.pilar])}
  </article>`
}

function mandala (cena) {
  // A coluna de cada solucao vem do manifesto: e a disposicao do video, nao
  // ordem de leitura. 8 + 8 nas laterais e o resto embaixo da roda.
  const esquerda = solucoesDaColuna('esq')
  const direita = solucoesDaColuna('dir')
  const rodape = solucoesDaColuna('base')

  const pilula = (s) => `<button type="button" class="mandala__item"
      data-ir="${esc(s.id)}" data-pilar="${esc(s.pilar)}">
    ${icone(s.icone)}<span>${comNegrito(rotuloMandala(s))}</span>
  </button>`

  return `<article class="card card--mandala">
    <div class="mandala">
      <div class="mandala__coluna mandala__coluna--esq">${esquerda.map(pilula).join('')}</div>
      <div class="mandala__roda">
        <div class="mandala__disco">
          ${rodaSvg()}
          <div class="mandala__nucleo">
            <h1 class="card__titulo">${esc(cena.titulo)}</h1>
            <span class="mandala__marca">cpqd</span>
          </div>
        </div>
        <p class="mandala__dica">${esc(cena.subtitulo)}</p>
      </div>
      <div class="mandala__coluna mandala__coluna--dir">${direita.map(pilula).join('')}</div>
      <!-- No DOM depois da coluna direita para o Tab ir esq -> dir -> rodape.
           O CSS reposiciona embaixo da roda. -->
      <div class="mandala__rodape">${rodape.map(pilula).join('')}</div>
    </div>
  </article>`
}

function cta (cena) {
  return `<article class="card card--cta">
    <div class="qr">${qrSvg()}</div>
    <div class="card__texto">
      <div class="cta__marca"><span class="marca__cpqd">cpqd</span><i class="cta__filete"></i></div>
      <h1 class="card__titulo">${tituloComDestaque(cena)}</h1>
      <p class="card__subtitulo">${subtituloComDestaque(cena)}</p>
    </div>
  </article>`
}

function encerramento (cena) {
  /*
    O lockup "50 ANOS" fica FORA do h1. Quando estava dentro, o texto do
    titulo virava "50ANOSCPQD 50 anos" e qualquer conferencia de titulo
    contra o manifesto quebrava.
  */
  return `<article class="card card--encerramento">
    <span class="selo50__marca">cpqd</span>
    <h1 class="card__titulo"><span class="visualmente-oculto">${esc(cena.titulo)}</span></h1>
    <div class="selo50" aria-hidden="true">
      <span class="selo50__numero">50</span>
      <span class="selo50__anos">ANOS</span>
    </div>
  </article>`
}

const RENDER = {
  [LAYOUTS.ABERTURA]: abertura,
  [LAYOUTS.INSTITUCIONAL]: institucional,
  [LAYOUTS.PILARES]: pilares,
  [LAYOUTS.TITULO_PILAR]: tituloPilar,
  [LAYOUTS.SOLUCAO]: solucao,
  [LAYOUTS.MANDALA]: mandala,
  [LAYOUTS.CTA]: cta,
  [LAYOUTS.ENCERRAMENTO]: encerramento
}

// ────────────────────────────────────────────────────────────────────── view

/*
  css/tokens.css zera as duracoes de CSS quando o sistema pede menos
  movimento, mas as do GSAP sao JS e ficavam de fora — a entrada continuava
  levando meio segundo. Aqui elas caem junto.
*/
const menosMovimento = () =>
  globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

export function createSceneView ({ raiz, app, store }) {
  let timeline = null
  let desenhada = null

  function desenhar (cena) {
    timeline?.kill()
    app.dataset.sceneSettled = 'false'
    app.dataset.superficie = superficieDe(cena)
    app.dataset.layout = cena.layout
    raiz.dataset.superficie = superficieDe(cena)
    raiz.innerHTML = (RENDER[cena.layout] ?? encerramento)(cena)

    const card = raiz.firstElementChild
    const filhos = card.querySelectorAll(':scope > *')

    const calmo = menosMovimento()
    const dur = calmo ? 0 : 0.36
    const durFilhos = calmo ? 0 : 0.42
    const escada = calmo ? 0 : 0.06

    /*
      O "assentado" so vale depois que as FONTES carregaram. Com font-display:
      swap o texto e desenhado primeiro na fonte de sistema e reflui quando a
      Poppins chega — quem medisse geometria nessa janela leria posicoes que
      mudam logo em seguida. E exatamente o tipo de mentira que o sinal
      existe para evitar.
    */
    const marcarAssentado = () => {
      const pronto = () => { app.dataset.sceneSettled = 'true' }
      if (document.fonts?.status === 'loaded') pronto()
      else (document.fonts?.ready ?? Promise.resolve()).then(pronto)
    }

    timeline = gsap.timeline({ onComplete: marcarAssentado })
    timeline
      .fromTo(card, { opacity: 0 }, { opacity: 1, duration: dur, ease: 'power2.out' })
      .fromTo(filhos,
        { y: calmo ? 0 : 18, opacity: 0 },
        { y: 0, opacity: 1, duration: durFilhos, stagger: escada, ease: 'power2.out', clearProps: 'transform' },
        calmo ? 0 : '<0.05')

    // Navegacao derivada do proprio manifesto: pilulas da mandala e setores
    // da roda (que levam ao card de titulo do pilar).
    raiz.querySelectorAll('[data-ir]').forEach((b) => {
      b.addEventListener('click', () => store.irPara(b.dataset.ir, 'mandala'))
    })
    raiz.querySelectorAll('[data-ir-pilar]').forEach((el) => {
      const ir = () => store.irPara(`pilar-${el.dataset.irPilar}`, 'roda')
      el.addEventListener('click', ir)
      el.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); ir() }
      })
    })
  }

  /*
    Redesenha quando a CENA muda — e so isso.
    Antes havia um filtro por `motivo` que pulava 'menu' para nao redesenhar
    ao abrir/fechar o painel. So que a navegacao VINDA do menu usa o mesmo
    motivo, entao escolher um item no menu mudava o store, o hash e o HUD e
    deixava o card parado na cena anterior. Comparar o id nao tem essa
    ambiguidade: nenhum motivo novo pode reintroduzir o bug.
  */
  const desinscrever = store.subscribe((s) => {
    if (s.cena.id === desenhada) return
    desenhada = s.cena.id
    desenhar(s.cena)
  })

  return {
    dispose () { timeline?.kill(); desinscrever() }
  }
}
