/**
 * Paleta e tokens da IDV CPQD — Setor Financeiro.
 *
 * Os valores foram conferidos por amostragem dos frames do video
 * "04828 - Video Febraban V5 - High Quality.mp4" (1920x1080, 60fps, 256,2s).
 * Onde o JPEG do frame desloca o tom, prevalece o valor de marca:
 *   titulo  #301857 amostrado -> #372060 (marca)
 *   lime    #B8FE0B amostrado -> #B6F000 (marca)
 * O roxo medio #48267D e o quase-preto #0E0818 vem direto do video.
 *
 * Nao inventar cor. Novo tom entra aqui, com a origem anotada.
 */

export const COLORS = {
  // Roxos
  roxo: '#372060',          // titulos de card, texto forte
  roxoMedio: '#48267D',     // chips, painel lateral, pilulas
  roxoProfundo: '#2D0951',  // fundo de cena 3D
  roxoNoite: '#20112C',     // fundo mais escuro do gradiente
  quaseCarvao: '#0E0818',   // etiqueta de pilar, fundo dos cards cinematograficos

  // Verde-limao
  lime: '#B6F000',
  limeSuave: '#CAEE68',

  // Familia lilas
  lilas: '#B9A9CE',
  lilasClaro: '#E7D9F2',

  // Neutros
  branco: '#FFFFFF',
  brancoQuente: '#FBFAFF',
  cinza: '#706A7F'
}

/** Um acento por pilar — usado pela cena 3D e pela etiqueta. */
export const PILLARS = {
  'seguranca-digital': {
    id: 'seguranca-digital',
    nome: 'Segurança Digital',
    lema: 'Protegendo dados, operações e negócios',
    acento: COLORS.roxoMedio,
    icone: 'escudo'
  },
  'confianca-digital': {
    id: 'confianca-digital',
    nome: 'Confiança Digital',
    lema: 'Garantindo autenticidade em cada interação',
    acento: COLORS.lime,
    icone: 'digital'
  },
  'operacoes-inteligentes': {
    id: 'operacoes-inteligentes',
    nome: 'Operações Inteligentes',
    lema: 'Transformando dados em eficiência operacional',
    acento: COLORS.lilas,
    icone: 'cerebro'
  },
  'inovacao-aplicada': {
    id: 'inovacao-aplicada',
    nome: 'Inovação Aplicada',
    // No video a Inovacao Aplicada e o ANEL EXTERNO da mandala: envolve os
    // outros tres pilares em vez de ocupar um setor. Por isso nao tem card
    // de titulo proprio nem bloco de solucoes.
    lema: 'O anel que envolve todo o ecossistema',
    acento: COLORS.limeSuave,
    icone: 'lampada'
  }
}

/** Escreve os tokens como custom properties no :root. Contrato 7. */
export function applyBrandTokens (root = document.documentElement) {
  for (const [nome, valor] of Object.entries(COLORS)) {
    root.style.setProperty(`--c-${kebab(nome)}`, valor)
  }
  for (const p of Object.values(PILLARS)) {
    root.style.setProperty(`--acento-${p.id}`, p.acento)
  }
}

function kebab (s) {
  return s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}
