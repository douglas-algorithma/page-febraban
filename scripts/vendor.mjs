// Copia as libs do node_modules para js/vendor/ como ESM puro.
// Roda UMA vez, na preparacao. Em runtime a pagina nao busca nada na rede.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const vendor = join(root, 'js', 'vendor')
mkdirSync(join(vendor, 'gsap'), { recursive: true })

const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))

// three: three.module.js importa ./three.core.js — os dois bastam.
for (const f of ['three.module.js', 'three.core.js']) {
  copyFileSync(join(root, 'node_modules/three/build', f), join(vendor, f))
}
// gsap: index.js importa apenas gsap-core.js e CSSPlugin.js.
for (const f of ['index.js', 'gsap-core.js', 'CSSPlugin.js']) {
  copyFileSync(join(root, 'node_modules/gsap', f), join(vendor, 'gsap', f))
}

writeFileSync(join(vendor, 'VERSIONS.txt'),
  `three ${pkg.devDependencies.three}\ngsap  ${pkg.devDependencies.gsap}\n` +
  `\nGerado por scripts/vendor.mjs. Nao editar a mao.\n`)
console.log('vendorizado: three', pkg.devDependencies.three, '| gsap', pkg.devDependencies.gsap)
