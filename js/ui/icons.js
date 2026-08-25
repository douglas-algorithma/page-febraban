/**
 * Icones em SVG inline. Nada de fonte de icone nem requisicao de rede.
 * Todos herdam `currentColor` e usam viewBox 24x24, traco de 1.6.
 * Os nomes correspondem ao campo `icone` do manifesto.
 */

const D = (corpo) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ` +
  `stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${corpo}</svg>`

const ICONES = {
  // pilares
  escudo: D('<path d="M12 3 4.5 6v5.5c0 4.3 3 8.2 7.5 9.5 4.5-1.3 7.5-5.2 7.5-9.5V6Z"/><path d="m8.7 11.8 2.2 2.2 4.4-4.4"/><circle cx="16.6" cy="14.8" r="2.6"/><path d="M16.6 13.5v2.6M15.3 14.8h2.6"/>'),
  /*
    Impressao digital completa e oval, com os sulcos fechando em volta do
    nucleo — no video nao e um arco solto.
  */
  digital: D('<path d="M12 2.4c-2.6 0-5 1.3-6.4 3.4"/><path d="M18.5 6.1A7.7 7.7 0 0 0 12 2.4"/>'
    + '<path d="M4.3 8.6A9.4 9.4 0 0 0 3.6 12c0 3.1.6 6.1 1.8 8.9"/>'
    + '<path d="M20.4 12c0 3.1-.6 6.1-1.8 8.9"/><path d="M19.7 8.6A9.4 9.4 0 0 1 20.4 12"/>'
    + '<path d="M7.2 20.6A16 16 0 0 1 6 12a6 6 0 0 1 12 0c0 3-.4 5.9-1.2 8.6"/>'
    + '<path d="M9.6 19.9A13 13 0 0 1 8.7 12a3.3 3.3 0 0 1 6.6 0c0 2.7-.3 5.3-1 7.9"/>'
    + '<path d="M12 8.9v6.4"/>'),
  /*
    Cerebro-circuito, conferido no medalhao do frame de 182s: dois lobos com
    sulcos internos e CINCO hastes descendo para nos circulares.
  */
  cerebro: D('<path d="M11.6 5.1a2.7 2.7 0 0 0-4.9 1.2 2.5 2.5 0 0 0-1.3 4.3 2.6 2.6 0 0 0 1.1 4.1 2.5 2.5 0 0 0 5.1-.6Z"/>'
    + '<path d="M12.4 5.1a2.7 2.7 0 0 1 4.9 1.2 2.5 2.5 0 0 1 1.3 4.3 2.6 2.6 0 0 1-1.1 4.1 2.5 2.5 0 0 1-5.1-.6Z"/>'
    + '<path d="M9.5 7.4c-.9.4-1.3 1.2-1.1 2.1M8.6 11.4c-.8.3-1.2.9-1.2 1.7M14.5 7.4c.9.4 1.3 1.2 1.1 2.1M15.4 11.4c.8.3 1.2.9 1.2 1.7"/>'
    + '<path d="M8.6 14.4v1.6a1 1 0 0 1-1 1H6.9M12 14.6v4.2M15.4 14.4v1.6a1 1 0 0 0 1 1h.7M10.3 15.2v2.1a1 1 0 0 1-1 1h-.6M13.7 15.2v2.1a1 1 0 0 0 1 1h.6"/>'
    + '<circle cx="6.2" cy="17" r="1.1"/><circle cx="17.8" cy="17" r="1.1"/>'
    + '<circle cx="8.1" cy="18.9" r="1.1"/><circle cx="15.9" cy="18.9" r="1.1"/>'
    + '<circle cx="12" cy="19.9" r="1.2"/>'),
  // lampada com raios e pernas de circuito
  lampada: D('<path d="M9.4 16.4h5.2"/><path d="M10.2 19h3.6"/><path d="M12 4.4a5.4 5.4 0 0 0-3.1 9.8c.3.2.5.6.5 1h5.2c0-.4.2-.8.5-1A5.4 5.4 0 0 0 12 4.4Z"/><path d="M12 1.6v1.6M4.6 4.6l1.1 1.1M19.4 4.6l-1.1 1.1M1.8 12h1.6M20.6 12h1.6"/><path d="M10.2 21.4H7.6M13.8 21.4h2.6"/><circle cx="7" cy="21.4" r="0.9"/><circle cx="17" cy="21.4" r="0.9"/>'),

  // solucoes
  robo: D('<rect x="4" y="8" width="12" height="10" rx="2.5"/><circle cx="8" cy="12.5" r="1"/><circle cx="12" cy="12.5" r="1"/><path d="M8.5 15.5h3"/><path d="M10 8V5.5"/><circle cx="10" cy="4.5" r="1"/><path d="M18 5.5h4v3.5h-2.5L18 10.5Z"/>'),
  // meia engrenagem COM dentes; o binario no mesmo peso do resto
  'engrenagem-binario': D('<path d="M9.8 4.6a7.4 7.4 0 0 0 0 14.8Z"/><path d="M9.8 2.4v2.2M9.8 19.4v2.2M2.6 7.4l1.9 1.1M2.6 16.6l1.9-1.1M1.4 12h2.2M4.1 5.1l1.5 1.6M4.1 18.9l1.5-1.6"/><circle cx="9.8" cy="12" r="2.4"/><text x="13" y="9" font-size="4.2" fill="currentColor" stroke="none" font-family="monospace">0010</text><text x="13" y="14" font-size="4.2" fill="currentColor" stroke="none" font-family="monospace">1101</text><text x="13" y="19" font-size="4.2" fill="currentColor" stroke="none" font-family="monospace">0010</text>'),
  'cerebro-chip': D('<path d=\"M9.4 5a2.6 2.6 0 0 0-4.7 1.2 2.4 2.4 0 0 0-1.2 4.1 2.5 2.5 0 0 0 1 3.9A2.4 2.4 0 0 0 9.4 14Z\"/>'
    + '<path d=\"M7.3 7.2c-.8.4-1.1 1.1-.9 1.9M6.5 11c-.7.3-1.1.8-1.1 1.5\"/>'
    + '<rect x=\"12.4\" y=\"7.4\" width=\"7.6\" height=\"7.6\" rx=\"1.3\"/>'
    + '<path d=\"M14.8 7.4V5.2M17.6 7.4V5.2M14.8 17.2V15M17.6 17.2V15M12.4 9.8h-2.2M12.4 12.6h-2.2M20 9.8h2.2M20 12.6h2.2\"/>'
    + '<circle cx=\"14.8\" cy=\"4.4\" r=\"0.9\"/><circle cx=\"17.6\" cy=\"4.4\" r=\"0.9\"/>'
    + '<circle cx=\"14.8\" cy=\"18\" r=\"0.9\"/><circle cx=\"17.6\" cy=\"18\" r=\"0.9\"/>'),
  'escudo-chip': D('<path d="M12 3 5 5.8v5.4c0 4 2.8 7.6 7 8.8 4.2-1.2 7-4.8 7-8.8V5.8Z"/><rect x="9.5" y="9.5" width="5" height="5" rx="0.8"/><path d="M11 9.5v-1.5M13 9.5v-1.5M11 16v-1.5M13 16v-1.5M9.5 11h-1.5M9.5 13h-1.5M14.5 11H16M14.5 13H16"/>'),
  'documento-check': D('<path d="M6 3h8l4 4v14H6Z"/><path d="M14 3v4h4"/><path d="m9 12.5 2 2 4-4"/>'),
  // terminal POS: tela em cima, teclado 3x3, selo de check embaixo
  pos: D('<rect x="4.6" y="2" width="10.8" height="16" rx="1.8"/><rect x="6.4" y="3.8" width="7.2" height="4" rx="0.6"/><path d="M7 10.4h.9M9.6 10.4h.9M12.2 10.4h.9M7 12.6h.9M9.6 12.6h.9M12.2 12.6h.9M7 14.8h.9M9.6 14.8h.9M12.2 14.8h.9"/><circle cx="17.6" cy="17.6" r="4.2"/><path d="m15.9 17.6 1.3 1.3 2.3-2.5"/>'),
  'escudo-check': D('<path d="M12 3 4.5 6v5.5c0 4.3 3 8.2 7.5 9.5 4.5-1.3 7.5-5.2 7.5-9.5V6Z"/><path d="m8.5 11.8 2.4 2.4 4.6-4.8"/>'),
  'escudo-cifrao': D('<path d="M12 3 4.5 6v5.5c0 4.3 3 8.2 7.5 9.5 4.5-1.3 7.5-5.2 7.5-9.5V6Z"/><circle cx="12" cy="12" r="4.2"/><path d="M12 9.2v5.6M13.4 10.4h-2.1a1 1 0 0 0 0 2h1.4a1 1 0 0 1 0 2h-2.1"/>'),
  atomo: D('<circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="9" ry="4"/><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(120 12 12)"/>'),
  cracha: D('<rect x="3" y="4.5" width="18" height="15" rx="1.6"/><circle cx="9" cy="10.5" r="2.2"/><path d="M5.5 16.5c.6-1.8 1.9-2.7 3.5-2.7s2.9.9 3.5 2.7"/><path d="M15 9.5h4M15 12.5h4M15 15.5h3"/>'),
  // duas pessoas ligadas por duas setas em ciclo — era o icone mais ilegivel
  'pessoas-ciclo': D('<circle cx="5.6" cy="14.2" r="1.9"/><path d="M2.4 20.4a3.4 3.4 0 0 1 6.4 0"/><circle cx="18.4" cy="6.4" r="1.9"/><path d="M15.2 12.6a3.4 3.4 0 0 1 6.4 0"/><path d="M8.4 8.2A7 7 0 0 1 14.6 4"/><path d="m8.9 4.6-1 3.8 3.8 1"/><path d="M15.6 15.8A7 7 0 0 1 9.4 20"/><path d="m15.1 19.4 1-3.8-3.8-1"/>'),
  'onda-voz': D('<path d="M3 10v4M6 7.5v9M9 5v14M12 8.5v7"/><circle cx="18" cy="12" r="4.2"/><text x="18" y="13.6" font-size="4.4" text-anchor="middle" fill="currentColor" stroke="none" font-weight="700">AI</text>'),
  'servidor-no': D('<rect x="4" y="3.5" width="16" height="5" rx="1.2"/><rect x="4" y="10" width="16" height="5" rx="1.2"/><circle cx="7" cy="6" r="0.9"/><circle cx="7" cy="12.5" r="0.9"/><path d="M8 15v2.5M16 15v2.5M12 15v2.5"/><circle cx="8" cy="19.5" r="1.6"/><circle cx="16" cy="19.5" r="1.6"/>'),
  'chip-ia': D('<rect x="7" y="7" width="10" height="10" rx="1.4"/><text x="12" y="13.9" font-size="5" text-anchor="middle" fill="currentColor" stroke="none" font-weight="700">AI</text><path d="M10 7V4M14 7V4M10 20v-3M14 20v-3M7 10H4M7 14H4M20 10h-3M20 14h-3"/><circle cx="10" cy="3.2" r="0.9"/><circle cx="14" cy="3.2" r="0.9"/><circle cx="3.2" cy="10" r="0.9"/><circle cx="3.2" cy="14" r="0.9"/>'),
  rack: D('<rect x="4" y="4" width="16" height="4.5" rx="1"/><rect x="4" y="10" width="16" height="4.5" rx="1"/><rect x="4" y="16" width="16" height="4.5" rx="1"/><circle cx="7" cy="6.2" r="0.8"/><circle cx="7" cy="12.2" r="0.8"/><circle cx="7" cy="18.2" r="0.8"/><path d="M10 6.2h7M10 12.2h7M10 18.2h7"/>'),
  grafico: D('<rect x="3.5" y="3.5" width="17" height="17" rx="1.6"/><path d="M6.5 16.5v-3M9.5 16.5v-5M12.5 16.5v-2.5M15.5 16.5v-6"/><path d="m6.5 11 3-2 3 1.5 4-4"/><circle cx="6.5" cy="11" r="0.9"/><circle cx="16.5" cy="6.5" r="0.9"/>'),
  // ── card institucional (9,7s-15,5s do video) ──────────────────────────
  rede: D('<circle cx=\"12\" cy=\"12\" r=\"9.2\"/>'
    + '<circle cx=\"12\" cy=\"7\" r=\"1.3\"/><path d=\"M10.1 9.7a2.3 2.3 0 0 1 3.8 0\"/>'
    + '<circle cx=\"7.4\" cy=\"14.4\" r=\"1.3\"/><path d=\"M5.5 17.1a2.3 2.3 0 0 1 3.8 0\"/>'
    + '<circle cx=\"16.6\" cy=\"14.4\" r=\"1.3\"/><path d=\"M14.7 17.1a2.3 2.3 0 0 1 3.8 0\"/>'
    + '<path d=\"m10.7 9.9-2 3.3M13.3 9.9l2 3.3M9.4 15.2h5.2\"/>'),
  software: D('<path d="M6 3h8l4 4v14H6Z"/><path d="M14 3v4h4"/><path d="M8.6 11h4M8.6 13.4h5.6M8.6 15.8h3.4"/><rect x="14.4" y="13.6" width="6" height="6" rx="1.2"/><text x="17.4" y="17.9" font-size="3.6" text-anchor="middle" fill="currentColor" stroke="none" font-weight="700">AI</text>'),
  globo: D('<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M5.2 6.5a13 13 0 0 0 13.6 0M5.2 17.5a13 13 0 0 1 13.6 0"/>'),
  'mao-engrenagem': D('<path d="M2.6 15.4c1.6-1.2 3.2-1.2 4.8 0l2.6 2h3.2"/><path d="M2.6 19.8c2.2-1.6 4.4-1.6 6.6 0h6.6l4.6-3.4"/><circle cx="15.4" cy="7.6" r="3"/><path d="M15.4 2.8v1.6M15.4 10.8v1.6M10.6 7.6h1.6M18.6 7.6h1.6M12 4.2l1.2 1.2M17.6 9.8l1.2 1.2M18.8 4.2l-1.2 1.2M13.2 9.8 12 11"/>'),

  cifrao: D('<circle cx="12" cy="12" r="8.5"/><path d="M12 6.5v11"/><path d="M14.8 9.2h-3.9a2 2 0 0 0 0 4h2.2a2 2 0 0 1 0 4H9.2"/>')
}

/** Devolve o markup do icone. Icone desconhecido nao quebra a pagina. */
export function icone (nome) {
  return ICONES[nome] ?? D('<circle cx="12" cy="12" r="8.5"/>')
}

export const temIcone = (nome) => Object.hasOwn(ICONES, nome)
export const nomesDeIcone = () => Object.keys(ICONES)
