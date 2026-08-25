/**
 * A roda do ecossistema, em SVG.
 *
 * Por que SVG e nao three.js: a roda do video tem TEXTO CURVO no anel externo
 * ("INOVAÇÃO" em cima, "APLICADA" embaixo) e tres setores rotulados com icone.
 * Malha 3D nao faz texto em caminho; SVG faz, fica nitido em qualquer
 * resolucao e cada peca vira alvo de toque de verdade.
 *
 * Geometria: viewBox 0 0 100 100, centro em (50,50). Angulos em graus no
 * sistema do SVG — 0 e leste, 90 e SUL (y cresce para baixo), -90 e norte.
 * Setores de 120 graus: Seguranca no topo, Confianca a sudoeste, Operacoes a
 * sudeste, exatamente como no frame de 36s.
 */
import { PILLARS } from '../data/brand.js'
import { icone } from './icons.js'

/*
  Proporcoes MEDIDAS no frame de 36s, tomando o raio do anel de vidro como 1:
    borda externa dos setores  0,668
    borda interna dos setores  0,369
    nucleo verde               0,336
  Traduzidas para R_ANEL = 45. O nucleo estava a 13,5 — pequeno demais para o
  texto e a marca, que acabavam se sobrepondo.
*/
const R_ANEL = 45      // anel externo (INOVAÇÃO APLICADA)
const R_SETOR_EXT = 32.5
const R_SETOR_INT = 18
const R_NUCLEO = 16.3

/* Icone e rotulo simetricos a +-19 graus do meio do setor, no meio da coroa —
   e como o video posiciona os tres. */
const DESVIO = 19
const R_CONTEUDO = (R_SETOR_EXT + R_SETOR_INT) / 2

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
))

const ponto = (raio, graus) => {
  const a = (graus * Math.PI) / 180
  return [50 + raio * Math.cos(a), 50 + raio * Math.sin(a)]
}

/** Caminho de um setor de coroa circular. */
function setor (r0, r1, a0, a1) {
  const [x0, y0] = ponto(r1, a0)
  const [x1, y1] = ponto(r1, a1)
  const [x2, y2] = ponto(r0, a1)
  const [x3, y3] = ponto(r0, a0)
  const grande = Math.abs(a1 - a0) > 180 ? 1 : 0
  return `M${x0} ${y0}A${r1} ${r1} 0 ${grande} 1 ${x1} ${y1}` +
         `L${x2} ${y2}A${r0} ${r0} 0 ${grande} 0 ${x3} ${y3}Z`
}

/** Arco simples, para o texto correr por cima. */
function arco (raio, a0, a1, sentido) {
  const [x0, y0] = ponto(raio, a0)
  const [x1, y1] = ponto(raio, a1)
  const grande = Math.abs(a1 - a0) > 180 ? 1 : 0
  return `M${x0} ${y0}A${raio} ${raio} 0 ${grande} ${sentido} ${x1} ${y1}`
}

// Setores na ordem do video. O vao de 2 graus separa um do outro.
const SETORES = [
  { id: 'seguranca-digital', a0: -148, a1: -32, cor: '#2D0951' },
  { id: 'operacoes-inteligentes', a0: -28, a1: 88, cor: '#8A5FC4' },
  { id: 'confianca-digital', a0: 92, a1: 208, cor: '#5C33A0' }
]

export function rodaSvg () {
  const setores = SETORES.map((s) => {
    const p = PILLARS[s.id]
    const meio = (s.a0 + s.a1) / 2
    /*
      Separados no ANGULO, nao no raio: assim nenhum dos dois corre por cima
      do nucleo nem vaza pela borda externa do setor.

      O ROTULO fica no lado mais proximo da base da roda e o icone no lado
      oposto — e como o video posiciona os tres setores (frame de 36s).
      `sin` maior significa mais para baixo no sistema do SVG.
    */
    const a1 = meio - DESVIO
    const a2 = meio + DESVIO
    const rad = (g) => (g * Math.PI) / 180
    const [aRotulo, aIcone] = Math.sin(rad(a1)) > Math.sin(rad(a2)) ? [a1, a2] : [a2, a1]

    const [xi, yi] = ponto(R_CONTEUDO, aIcone)
    const [xt, yt] = ponto(R_CONTEUDO, aRotulo)
    /*
      O icone volta de icone() como um <svg> SEM width/height. Aninhado dentro
      de outro SVG isso vira 100% do viewport e o desenho estoura a roda —
      era por isso que a digital e o cerebro cobriam a tela. Aqui damos
      dimensao em unidades do viewBox.
    */
    const svgIcone = icone(p.icone).replace(
      '<svg ', `<svg x="${xi - 4}" y="${yi - 4}" width="8" height="8" `)
    const [primeira, ...resto] = p.nome.split(' ')
    return `<g class="roda__setor" data-ir-pilar="${esc(s.id)}" role="button" tabindex="0"
              aria-label="Ir para o pilar ${esc(p.nome)}">
      <path d="${setor(R_SETOR_INT, R_SETOR_EXT, s.a0, s.a1)}" fill="${s.cor}"/>
      <g class="roda__icone">${svgIcone}</g>
      <text class="roda__rotulo" x="${xt}" y="${yt}" text-anchor="middle">
        <tspan x="${xt}" dy="-0.4">${esc(primeira.toUpperCase())}</tspan>
        <tspan x="${xt}" dy="3.1">${esc(resto.join(' ').toUpperCase())}</tspan>
      </text>
    </g>`
  }).join('')

  const inovacao = PILLARS['inovacao-aplicada']
  const [xe, ye] = ponto(R_ANEL, -8)   // esfera roxa presa no anel, a direita

  return `<svg class="roda" viewBox="0 0 100 100" role="group"
       aria-label="Mandala do ecossistema de soluções CPQD">
    <defs>
      <linearGradient id="vidro" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#EDE7F5"/>
        <stop offset="0.5" stop-color="#CFC0E6"/>
        <stop offset="1" stop-color="#EDE7F5"/>
      </linearGradient>
      <radialGradient id="nucleo" cx="0.38" cy="0.32" r="0.85">
        <stop offset="0" stop-color="#D6FF63"/>
        <stop offset="1" stop-color="#A5DC00"/>
      </radialGradient>
      <radialGradient id="esfera" cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stop-color="#6B45A8"/>
        <stop offset="1" stop-color="#1B0F2E"/>
      </radialGradient>
      <path id="arco-topo" d="${arco(R_ANEL - 0.6, 202, 338, 1)}"/>
      <path id="arco-base" d="${arco(R_ANEL - 5.2, 158, 22, 0)}"/>
    </defs>

    <!-- anel externo: o quarto pilar. No video ele ENVOLVE os outros tres. -->
    <circle cx="50" cy="50" r="${R_ANEL}" fill="none" stroke="url(#vidro)" stroke-width="9"/>
    <g class="roda__anel-texto" aria-label="${esc(inovacao.nome)}">
      <text><textPath href="#arco-topo" startOffset="50%" text-anchor="middle">INOVAÇÃO</textPath></text>
      <!--
        side="right" poe o texto do outro lado do caminho. Sem isso os glifos
        apontam para FORA do circulo e "APLICADA" sai de cabeca para baixo,
        porque no arco de baixo a normal do caminho aponta para baixo.
      -->
      <text><textPath href="#arco-base" side="right" startOffset="50%" text-anchor="middle">APLICADA</textPath></text>
    </g>
    <circle cx="${xe}" cy="${ye}" r="4.6" fill="url(#esfera)"/>

    ${setores}

    <circle cx="50" cy="50" r="${R_NUCLEO}" fill="url(#nucleo)"/>
  </svg>`
}

/** Os pilares desenhados na roda — o teste usa para conferir a cobertura. */
export const pilaresDaRoda = () => SETORES.map((s) => s.id)
