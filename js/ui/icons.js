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
  digital: D('<path d="M12 3a9 9 0 0 0-9 9v3"/><path d="M21 12a9 9 0 0 0-4.5-7.8"/><path d="M7.5 12a4.5 4.5 0 0 1 9 0v4.5"/><path d="M12 12v6"/><path d="M16.5 19.5v1.2"/><path d="M7.5 15v3"/>'),
  cerebro: D('<path d="M9.5 4.5a2.5 2.5 0 0 0-2.5 2.5 2.5 2.5 0 0 0-1.5 4.5 2.5 2.5 0 0 0 1 4.3A2.5 2.5 0 0 0 9.5 19.5V4.5Z"/><path d="M14.5 4.5A2.5 2.5 0 0 1 17 7a2.5 2.5 0 0 1 1.5 4.5 2.5 2.5 0 0 1-1 4.3 2.5 2.5 0 0 1-3 3.7V4.5Z"/><path d="M12 8v8M9.5 10h5M9.5 14h5"/>'),
  lampada: D('<path d="M9 17h6"/><path d="M10 20h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.4.3.5.7.5 1.1h6c0-.4.1-.8.5-1.1A6 6 0 0 0 12 3Z"/>'),

  // solucoes
  robo: D('<rect x="4" y="8" width="12" height="10" rx="2.5"/><circle cx="8" cy="12.5" r="1"/><circle cx="12" cy="12.5" r="1"/><path d="M8.5 15.5h3"/><path d="M10 8V5.5"/><circle cx="10" cy="4.5" r="1"/><path d="M18 5.5h4v3.5h-2.5L18 10.5Z"/>'),
  'engrenagem-binario': D('<path d="M9.5 4.5a7.5 7.5 0 0 0 0 15V4.5Z"/><path d="M9.5 2.5v2M9.5 19.5v2M2.6 8l1.8.7M2.6 16l1.8-.7"/><text x="13" y="9" font-size="4.2" fill="currentColor" stroke="none" font-family="monospace">0010</text><text x="13" y="14" font-size="4.2" fill="currentColor" stroke="none" font-family="monospace">1101</text><text x="13" y="19" font-size="4.2" fill="currentColor" stroke="none" font-family="monospace">0010</text>'),
  'cerebro-chip': D('<path d="M8 5.5a2.5 2.5 0 0 0-2.5 2.5A2.2 2.2 0 0 0 4 12a2.2 2.2 0 0 0 1.5 4A2.5 2.5 0 0 0 8 18.5V5.5Z"/><rect x="12" y="7" width="8" height="8" rx="1.4"/><path d="M14.5 7V5M17.5 7V5M14.5 17v-2M17.5 17v-2M12 9.5h-2M12 12.5h-2M20 9.5h2M20 12.5h2"/>'),
  'escudo-chip': D('<path d="M12 3 5 5.8v5.4c0 4 2.8 7.6 7 8.8 4.2-1.2 7-4.8 7-8.8V5.8Z"/><rect x="9.5" y="9.5" width="5" height="5" rx="0.8"/><path d="M11 9.5v-1.5M13 9.5v-1.5M11 16v-1.5M13 16v-1.5M9.5 11h-1.5M9.5 13h-1.5M14.5 11H16M14.5 13H16"/>'),
  'documento-check': D('<path d="M6 3h8l4 4v14H6Z"/><path d="M14 3v4h4"/><path d="m9 12.5 2 2 4-4"/>'),
  pos: D('<rect x="6" y="2.5" width="9" height="14" rx="1.6"/><rect x="8" y="4.5" width="5" height="3" rx="0.5"/><path d="M8 10h1.5M11 10h1.5M8 12.5h1.5M11 12.5h1.5"/><circle cx="17" cy="17" r="4"/><path d="m15.4 17 1.2 1.2 2.2-2.2"/>'),
  'escudo-check': D('<path d="M12 3 4.5 6v5.5c0 4.3 3 8.2 7.5 9.5 4.5-1.3 7.5-5.2 7.5-9.5V6Z"/><path d="m8.5 11.8 2.4 2.4 4.6-4.8"/>'),
  'escudo-cifrao': D('<path d="M12 3 4.5 6v5.5c0 4.3 3 8.2 7.5 9.5 4.5-1.3 7.5-5.2 7.5-9.5V6Z"/><circle cx="12" cy="12" r="4.2"/><path d="M12 9.2v5.6M13.4 10.4h-2.1a1 1 0 0 0 0 2h1.4a1 1 0 0 1 0 2h-2.1"/>'),
  atomo: D('<circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="9" ry="4"/><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(120 12 12)"/>'),
  cracha: D('<rect x="3" y="4.5" width="18" height="15" rx="1.6"/><circle cx="9" cy="10.5" r="2.2"/><path d="M5.5 16.5c.6-1.8 1.9-2.7 3.5-2.7s2.9.9 3.5 2.7"/><path d="M15 9.5h4M15 12.5h4M15 15.5h3"/>'),
  'pessoas-ciclo': D('<circle cx="8" cy="14" r="2.2"/><circle cx="16" cy="8" r="2.2"/><path d="M4 9.5A5.5 5.5 0 0 1 9.5 5"/><path d="m4 6.5 0 3 3 0"/><path d="M20 14.5A5.5 5.5 0 0 1 14.5 19"/><path d="m20 17.5 0-3-3 0"/>'),
  'onda-voz': D('<path d="M3 10v4M6 7.5v9M9 5v14M12 8.5v7"/><circle cx="18" cy="12" r="4.2"/><text x="18" y="13.6" font-size="4.4" text-anchor="middle" fill="currentColor" stroke="none" font-weight="700">AI</text>'),
  'servidor-no': D('<rect x="4" y="3.5" width="16" height="5" rx="1.2"/><rect x="4" y="10" width="16" height="5" rx="1.2"/><circle cx="7" cy="6" r="0.9"/><circle cx="7" cy="12.5" r="0.9"/><path d="M8 15v2.5M16 15v2.5M12 15v2.5"/><circle cx="8" cy="19.5" r="1.6"/><circle cx="16" cy="19.5" r="1.6"/>'),
  'chip-ia': D('<rect x="7" y="7" width="10" height="10" rx="1.4"/><text x="12" y="13.9" font-size="5" text-anchor="middle" fill="currentColor" stroke="none" font-weight="700">AI</text><path d="M10 7V4M14 7V4M10 20v-3M14 20v-3M7 10H4M7 14H4M20 10h-3M20 14h-3"/><circle cx="10" cy="3.2" r="0.9"/><circle cx="14" cy="3.2" r="0.9"/><circle cx="3.2" cy="10" r="0.9"/><circle cx="3.2" cy="14" r="0.9"/>'),
  rack: D('<rect x="4" y="4" width="16" height="4.5" rx="1"/><rect x="4" y="10" width="16" height="4.5" rx="1"/><rect x="4" y="16" width="16" height="4.5" rx="1"/><circle cx="7" cy="6.2" r="0.8"/><circle cx="7" cy="12.2" r="0.8"/><circle cx="7" cy="18.2" r="0.8"/><path d="M10 6.2h7M10 12.2h7M10 18.2h7"/>'),
  grafico: D('<rect x="3.5" y="3.5" width="17" height="17" rx="1.6"/><path d="M6.5 16.5v-3M9.5 16.5v-5M12.5 16.5v-2.5M15.5 16.5v-6"/><path d="m6.5 11 3-2 3 1.5 4-4"/><circle cx="6.5" cy="11" r="0.9"/><circle cx="16.5" cy="6.5" r="0.9"/>'),
  cifrao: D('<circle cx="12" cy="12" r="8.5"/><path d="M12 6.5v11"/><path d="M14.8 9.2h-3.9a2 2 0 0 0 0 4h2.2a2 2 0 0 1 0 4H9.2"/>')
}

/** Devolve o markup do icone. Icone desconhecido nao quebra a pagina. */
export function icone (nome) {
  return ICONES[nome] ?? D('<circle cx="12" cy="12" r="8.5"/>')
}

export const temIcone = (nome) => Object.hasOwn(ICONES, nome)
export const nomesDeIcone = () => Object.keys(ICONES)
