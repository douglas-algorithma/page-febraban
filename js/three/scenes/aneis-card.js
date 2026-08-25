/**
 * Fundo dos cards de solucao: superficie branca com os aneis concentricos
 * verde/roxo saindo do canto inferior esquerdo, como no video.
 *
 * Camera ortografica com frustum [-a..a] x [-1..1]: o canto inferior
 * esquerdo e sempre (-a, -1), independente da resolucao. Sem media query.
 */
export default function criar ({ THREE, cores }) {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xffffff)

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100)
  camera.position.set(0, 0, 10)

  const grupo = new THREE.Group()
  grupo.rotation.set(-0.62, 0.0, 0.34)
  scene.add(grupo)

  const paleta = [cores.lime, cores.roxoMedio, cores.lime, cores.roxoProfundo, cores.lime]
  const aneis = []
  for (let i = 0; i < 5; i++) {
    const raio = 0.35 + i * 0.125
    const geo = new THREE.TorusGeometry(raio, 0.042, 18, 96)
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(paleta[i]),
      roughness: 0.35,
      metalness: 0.12
    })
    const malha = new THREE.Mesh(geo, mat)
    malha.position.z = -i * 0.02
    grupo.add(malha)
    aneis.push({ malha, faseBase: i * 0.7 })
  }

  const luz = new THREE.DirectionalLight(0xffffff, 2.1)
  luz.position.set(-1.4, 1.6, 2.4)
  scene.add(luz)
  scene.add(new THREE.AmbientLight(0xffffff, 1.15))

  function resize (w, h) {
    const a = w / h
    camera.left = -a; camera.right = a; camera.top = 1; camera.bottom = -1
    camera.updateProjectionMatrix()
    // ancorado no canto inferior esquerdo, com uma fatia fora do quadro
    grupo.position.set(-a + 0.05, -1 + 0.05, 0)
  }

  function update (dt, t) {
    // Sem alocacao: so escrita em campos ja existentes.
    for (let i = 0; i < aneis.length; i++) {
      const a = aneis[i]
      a.malha.rotation.z = t * 0.16 + a.faseBase
      const s = 1 + Math.sin(t * 0.8 + a.faseBase) * 0.012
      a.malha.scale.set(s, s, 1)
    }
  }

  function dispose () {
    for (let i = 0; i < aneis.length; i++) {
      aneis[i].malha.geometry.dispose()
      aneis[i].malha.material.dispose()
    }
    aneis.length = 0
    scene.clear()
  }

  return { scene, camera, update, resize, dispose }
}
