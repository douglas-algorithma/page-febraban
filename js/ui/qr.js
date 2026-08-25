/**
 * QR de contato — reproduzido do proprio video, nao gerado por palpite.
 *
 * Origem: frame de 249s do video, recortado, binarizado e amostrado em uma
 * matriz 29x29 (QR versao 3). A matriz foi validada por round-trip: renderizada
 * de volta e lida com zbarimg, devolve exatamente
 *   https://www.cpqd.com.br/febrabantech-lp
 * que e o mesmo destino lido do frame original. Nenhuma URL foi inventada.
 *
 * Emitido como SVG vetorial para ficar nitido tambem em 4K.
 */

export const QR_DESTINO = 'https://www.cpqd.com.br/febrabantech-lp'

const MATRIZ = [
  '11111110000001000001101111111',
  '10000010000010110110001000001',
  '10111010101010110011001011101',
  '10111010101101100110001011101',
  '10111010101101001111101011101',
  '10000010110110111100001000001',
  '11111110101010101010101111111',
  '00000000110100000001100000000',
  '10111110011111110101001111100',
  '00110001010100101011011110001',
  '10000010000100011100110000000',
  '01101100010110011010101101010',
  '01000011011000010101000001100',
  '00000100100111001011101010001',
  '00110110000100110000110101100',
  '01001001000010111001110110010',
  '10100111001010011101000101100',
  '11011001110001001011101110101',
  '10101011001011010110110100100',
  '10010000111010001011000110010',
  '10000111000110000100111110111',
  '00000000101111001000100011111',
  '11111110011001111111101011100',
  '10000010101011010011100010000',
  '10111010111110110100111110111',
  '10111010100001001010100101111',
  '10111010111100110011111111110',
  '10000010011001100000100101010',
  '11111110111101110100010111100',
]

/** SVG do QR, com zona de silencio de 4 modulos (exigida pela norma). */
export function qrSvg () {
  const n = MATRIZ.length
  const q = 4
  const lado = n + q * 2
  let rects = ''
  for (let y = 0; y < n; y++) {
    const linha = MATRIZ[y]
    for (let x = 0; x < n; x++) {
      if (linha[x] === '1') rects += `<rect x="${x + q}" y="${y + q}" width="1" height="1"/>`
    }
  }
  return `<svg viewBox="0 0 ${lado} ${lado}" role="img" aria-label="QR Code para ${QR_DESTINO}">` +
         `<rect width="${lado}" height="${lado}" fill="#fff"/><g fill="#000" shape-rendering="crispEdges">${rects}</g></svg>`
}

export const qrTamanho = () => MATRIZ.length
