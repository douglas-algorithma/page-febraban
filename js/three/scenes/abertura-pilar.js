/**
 * Abertura de pilar: fundo quase preto com a moeda luminosa a esquerda e
 * poeira em suspensao, como os cards de 42,7s / 133,0s / 177,5s do video.
 * O acento vem do pilar (Contrato 3: a cena recebe `pilar` no contexto).
 */
export default function criar ({ THREE, cores, pilar }) {
  const acento = new THREE.Color(pilar?.acento ?? cores.roxoMedio)

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(cores.quaseCarvao)

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100)
  camera.position.set(0, 0, 6)

  // halo atras do titulo
  const haloGeo = new THREE.CircleGeometry(2.6, 64)
  const haloMat = new THREE.MeshBasicMaterial({
    color: acento, transparent: true, opacity: 0.16
  })
  const halo = new THREE.Mesh(haloGeo, haloMat)
  halo.position.set(-1.6, 0, -2)
  scene.add(halo)

  // moeda do pilar
  const moedaGeo = new THREE.TorusGeometry(1.05, 0.06, 16, 96)
  const moedaMat = new THREE.MeshStandardMaterial({
    color: acento, roughness: 0.3, metalness: 0.4,
    emissive: acento, emissiveIntensity: 0.35
  })
  const moeda = new THREE.Mesh(moedaGeo, moedaMat)
  moeda.position.set(-2.6, 0, 0)
  scene.add(moeda)

  // poeira
  const TOTAL = 420
  const posicoes = new Float32Array(TOTAL * 3)
  const velocidades = new Float32Array(TOTAL)
  for (let i = 0; i < TOTAL; i++) {
    posicoes[i * 3] = (Math.random() - 0.5) * 14
    posicoes[i * 3 + 1] = (Math.random() - 0.5) * 8
    posicoes[i * 3 + 2] = (Math.random() - 0.5) * 4 - 1
    velocidades[i] = 0.08 + Math.random() * 0.22
  }
  const poeiraGeo = new THREE.BufferGeometry()
  const attrPoeira = new THREE.BufferAttribute(posicoes, 3)
  poeiraGeo.setAttribute('position', attrPoeira)
  const poeiraMat = new THREE.PointsMaterial({
    color: acento, size: 0.035, transparent: true, opacity: 0.55, sizeAttenuation: true
  })
  const poeira = new THREE.Points(poeiraGeo, poeiraMat)
  scene.add(poeira)

  const luz = new THREE.DirectionalLight(0xffffff, 1.4)
  luz.position.set(-2, 2, 4)
  scene.add(luz)
  scene.add(new THREE.AmbientLight(0xffffff, 0.5))

  function resize (w, h) {
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }

  function update (dt, t) {
    moeda.rotation.z = t * 0.22
    moeda.rotation.x = Math.sin(t * 0.5) * 0.18
    haloMat.opacity = 0.13 + Math.sin(t * 1.1) * 0.04
    for (let i = 0; i < TOTAL; i++) {
      const y = posicoes[i * 3 + 1] + velocidades[i] * dt
      posicoes[i * 3 + 1] = y > 4 ? -4 : y
    }
    attrPoeira.needsUpdate = true
  }

  function dispose () {
    haloGeo.dispose(); haloMat.dispose()
    moedaGeo.dispose(); moedaMat.dispose()
    poeiraGeo.dispose(); poeiraMat.dispose()
    scene.clear()
  }

  return { scene, camera, update, resize, dispose }
}
