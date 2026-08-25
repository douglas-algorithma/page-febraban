/**
 * Fundo do card institucional (9,7s-15,5s): superficie verde-limao de sangria
 * total com a onda de pontos claros subindo pela direita e os arcos roxos
 * entrando pela borda esquerda.
 */
export default function criar ({ THREE, cores }) {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(cores.lime)

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100)
  camera.position.set(0, 0, 10)

  // ── onda de pontos ────────────────────────────────────────────────────
  const COLUNAS = 96
  const LINHAS = 26
  const TOTAL = COLUNAS * LINHAS
  const posicoes = new Float32Array(TOTAL * 3)
  const fase = new Float32Array(TOTAL)
  let k = 0
  for (let ix = 0; ix < COLUNAS; ix++) {
    for (let iz = 0; iz < LINHAS; iz++) {
      const u = ix / (COLUNAS - 1)
      const v = iz / (LINHAS - 1)
      posicoes[k * 3] = (u - 0.5) * 4.6
      posicoes[k * 3 + 1] = -0.55 - v * 0.75
      posicoes[k * 3 + 2] = 0
      fase[k] = u * 7.5 + v * 2.2
      k++
    }
  }
  const pontosGeo = new THREE.BufferGeometry()
  const attrPontos = new THREE.BufferAttribute(posicoes, 3)
  pontosGeo.setAttribute('position', attrPontos)
  const pontosMat = new THREE.PointsMaterial({
    color: 0xf2ffd0, size: 0.011, transparent: true, opacity: 0.75, sizeAttenuation: false
  })
  const pontos = new THREE.Points(pontosGeo, pontosMat)
  scene.add(pontos)

  // ── arcos roxos na borda esquerda ─────────────────────────────────────
  const arcos = []
  const grupoArcos = new THREE.Group()
  scene.add(grupoArcos)
  for (let i = 0; i < 3; i++) {
    const geo = new THREE.TorusGeometry(0.46 + i * 0.13, 0.028, 14, 96, Math.PI * 1.1)
    const mat = new THREE.MeshBasicMaterial({ color: i === 1 ? 0x2D0951 : 0x48267D })
    const malha = new THREE.Mesh(geo, mat)
    malha.rotation.z = Math.PI * 0.62
    grupoArcos.add(malha)
    arcos.push(malha)
  }

  const baseY = new Float32Array(TOTAL)
  for (let i = 0; i < TOTAL; i++) baseY[i] = posicoes[i * 3 + 1]

  function resize (w, h) {
    const a = w / h
    camera.left = -a; camera.right = a; camera.top = 1; camera.bottom = -1
    camera.updateProjectionMatrix()
    grupoArcos.position.set(-a - 0.12, -0.34, 0)
    pontos.position.x = a * 0.18
  }

  function update (dt, t) {
    for (let i = 0; i < TOTAL; i++) {
      posicoes[i * 3 + 1] = baseY[i] + Math.sin(t * 0.7 + fase[i]) * 0.055
    }
    attrPontos.needsUpdate = true
  }

  function dispose () {
    pontosGeo.dispose()
    pontosMat.dispose()
    for (let i = 0; i < arcos.length; i++) {
      arcos[i].geometry.dispose()
      arcos[i].material.dispose()
    }
    arcos.length = 0
    scene.clear()
  }

  return { scene, camera, update, resize, dispose }
}
