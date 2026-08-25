/**
 * Card final de contato: a onda de barras roxas e verdes na base,
 * como aos 245,5s-251,5s do video.
 */
export default function criar ({ THREE, cores }) {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf4f2f7)

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100)
  camera.position.set(0, 0, 10)

  const TOTAL = 64
  const grupo = new THREE.Group()
  scene.add(grupo)

  const geo = new THREE.BoxGeometry(1, 1, 1)
  const matRoxo = new THREE.MeshStandardMaterial({
    color: new THREE.Color(cores.roxoMedio), roughness: 0.5, metalness: 0.05
  })
  const matLime = new THREE.MeshStandardMaterial({
    color: new THREE.Color(cores.lime), roughness: 0.5, metalness: 0.05
  })

  const barras = []
  for (let i = 0; i < TOTAL; i++) {
    const malha = new THREE.Mesh(geo, i % 5 === 0 ? matLime : matRoxo)
    grupo.add(malha)
    barras.push(malha)
  }

  const luz = new THREE.DirectionalLight(0xffffff, 1.8)
  luz.position.set(0.5, 1.5, 3)
  scene.add(luz)
  scene.add(new THREE.AmbientLight(0xffffff, 1.0))

  let meiaLargura = 1

  function resize (w, h) {
    const a = w / h
    camera.left = -a; camera.right = a; camera.top = 1; camera.bottom = -1
    camera.updateProjectionMatrix()
    meiaLargura = a
    const passo = (a * 2) / TOTAL
    for (let i = 0; i < TOTAL; i++) {
      barras[i].position.x = -a + passo * (i + 0.5)
      barras[i].scale.x = passo * 0.62
    }
  }

  function update (dt, t) {
    for (let i = 0; i < TOTAL; i++) {
      const fase = (i / TOTAL) * Math.PI * 2
      const alt = 0.10 + (Math.sin(fase * 1.6 + t * 0.5) * 0.5 + 0.5) * 0.42
      barras[i].scale.y = alt
      barras[i].position.y = -1 + alt / 2
    }
  }

  function dispose () {
    geo.dispose(); matRoxo.dispose(); matLime.dispose()
    barras.length = 0
    scene.clear()
  }

  return { scene, camera, update, resize, dispose }
}
