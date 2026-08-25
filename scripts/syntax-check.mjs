/** Passa todo JS do projeto pelo parser do Node e importa os modulos de dados. */
import { readdir } from 'node:fs/promises'
import { join, extname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { execFileSync } from 'node:child_process'

const raiz = fileURLToPath(new URL('..', import.meta.url))
const IGNORAR = new Set(['node_modules', '.git', '.ingest', 'test-results', 'playwright-report', 'vendor'])

async function* varrer (dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (IGNORAR.has(e.name)) continue
    const p = join(dir, e.name)
    if (e.isDirectory()) yield* varrer(p)
    else if (['.js', '.mjs'].includes(extname(e.name))) yield p
  }
}

let n = 0
const falhas = []
for await (const arquivo of varrer(raiz)) {
  n++
  try {
    execFileSync(process.execPath, ['--check', arquivo], { stdio: 'pipe' })
  } catch (erro) {
    falhas.push(`${arquivo}\n${erro.stderr?.toString() ?? erro.message}`)
  }
}

// Os modulos de dados sao puros: devem importar fora do browser tambem.
for (const mod of ['js/data/scenes.js', 'js/data/brand.js', 'js/ui/qr.js', 'js/ui/icons.js']) {
  try { await import(pathToFileURL(join(raiz, mod)).href) }
  catch (erro) { falhas.push(`${mod} nao importa: ${erro.message}`) }
}

if (falhas.length) {
  console.error(`\nsyntax: ${falhas.length} falha(s)\n` + falhas.join('\n\n'))
  process.exit(1)
}
console.log(`syntax: ${n} arquivos OK (vendor ignorado)`)
