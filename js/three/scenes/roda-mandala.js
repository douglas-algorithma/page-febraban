/**
 * Fundo da mandala: nucleo verde-limao com aneis concentricos girando
 * devagar sobre branco. O texto das 18 solucoes fica no DOM, por cima.
 */
export default function criar ({ THREE, cores }) {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xffffff)

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100)
  camera.position.set(0, 0, 10)

  const grupo = new THREE.Group()
  scene.add(grupo)

  // O nucleo verde-limao e DOM (.mandala__nucleo, 13rem). Aqui ficam so os
  // aneis externos, com raio pequeno o bastante para nao invadir a linha do
  // titulo do card — o 3D e pano de fundo, nao pode competir com o texto.
  const specs = [
    { raio: 0.27, tubo: 0.048, cor: cores.roxoProfundo, vel: -0.07 },
    { raio: 0.34, tubo: 0.032, cor: 0x7a4fb6, vel: 0.05 },
    { raio: 0.41, tubo: 0.020, cor: 0xcfc0e6, vel: -0.04 }
  ]
  const aneis = []
  for (const s of specs) {
    const geo = new THREE.TorusGeometry(s.raio, s.tubo, 16, 128)
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(s.cor), roughness: 0.4, metalness: 0.1
    })
    const malha = new THREE.Mesh(geo, mat)
    grupo.add(malha)
    aneis.push({ malha, vel: s.vel })
  }

  const luz = new THREE.DirectionalLight(0xffffff, 2.0)
  luz.position.set(0.6, 1.2, 2.5)
  scene.add(luz)
  scene.add(new THREE.AmbientLight(0xffffff, 1.2))

  function resize (w, h) {
    const a = w / h
    camera.left = -a; camera.right = a; camera.top = 1; camera.bottom = -1
    camera.updateProjectionMatrix()
  }

  function update (dt, t) {
    for (let i = 0; i < aneis.length; i++) {
      aneis[i].malha.rotation.z = t * aneis[i].vel
    }
    grupo.rotation.x = Math.sin(t * 0.25) * 0.06
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
