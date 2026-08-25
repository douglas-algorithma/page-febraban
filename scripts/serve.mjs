/** Servidor estatico minimo. Sem build step: serve os arquivos como estao. */
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const raiz = fileURLToPath(new URL('..', import.meta.url))
const PORTA = Number(process.env.PORT ?? 4173)
const HOST = process.env.HOST ?? '127.0.0.1'

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2'
}

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`)
    let caminho = normalize(decodeURIComponent(url.pathname))
    if (caminho.includes('..')) { res.writeHead(403).end('403'); return }
    if (caminho === '/' || caminho.endsWith('/')) caminho += 'index.html'

    const arquivo = join(raiz, caminho)
    const info = await stat(arquivo).catch(() => null)
    if (!info?.isFile()) { res.writeHead(404).end('404'); return }

    const corpo = await readFile(arquivo)
    res.writeHead(200, {
      'content-type': TIPOS[extname(arquivo)] ?? 'application/octet-stream',
      'cache-control': 'no-store'
    }).end(corpo)
  } catch (erro) {
    res.writeHead(500).end(String(erro))
  }
}).listen(PORTA, HOST, () => {
  console.log(`page-cpqd-video em http://${HOST}:${PORTA}`)
})
