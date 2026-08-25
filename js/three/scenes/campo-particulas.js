/**
 * Abertura: onda de pontos sobre gradiente roxo, como o fundo da
 * apresentadora nos primeiros 14,5s do video.
 */
export default function criar ({ THREE, cores }) {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(cores.roxoNoite)

  const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 100)
  camera.position.set(0, 1.1, 6.2)
  camera.lookAt(0, 0, 0)

  const COLUNAS = 90
  const LINHAS = 34
  const TOTAL = COLUNAS * LINHAS

  const posicoes = new Float32Array(TOTAL * 3)
  const baseY = new Float32Array(TOTAL)
  let k = 0
  for (let ix = 0; ix < COLUNAS; ix++) {
    for (let iz = 0; iz < LINHAS; iz++) {
      const x = (ix / (COLUNAS - 1) - 0.5) * 16
      const z = (iz / (LINHAS - 1) - 0.5) * 9
      posicoes[k * 3] = x
      posicoes[k * 3 + 1] = 0
      posicoes[k * 3 + 2] = z
      baseY[k] = x * 0.35 + z * 0.6
      k++
    }
  }

  const geo = new THREE.BufferGeometry()
  const atributo = new THREE.BufferAttribute(posicoes, 3)
  geo.setAttribute('position', atributo)

  const mat = new THREE.PointsMaterial({
    color: new THREE.Color(cores.lilas),
    size: 0.045,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.85
  })
  const pontos = new THREE.Points(geo, mat)
  pontos.position.y = -1.5
  scene.add(pontos)

  function resize (w, h) {
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }

  function update (dt, t) {
    // Escreve direto no Float32Array ja alocado. Nada de novo por quadro.
    for (let i = 0; i < TOTAL; i++) {
      posicoes[i * 3 + 1] = Math.sin(t * 0.9 + baseY[i]) * 0.42
    }
    atributo.needsUpdate = true
    pontos.rotation.y = Math.sin(t * 0.08) * 0.05
  }

  function dispose () {
    geo.dispose()
    mat.dispose()
    scene.clear()
  }

  return { scene, camera, update, resize, dispose }
}
