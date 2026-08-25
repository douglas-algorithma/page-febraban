/**
 * Encerramento: brilho dourado sobre roxo profundo, como o selo de
 * 50 anos nos ultimos 4,7s do video.
 */
export default function criar ({ THREE, cores }) {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(cores.roxoNoite)

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100)
  camera.position.set(0, 0, 6)

  const OURO = 0xc9a227

  const haloGeo = new THREE.CircleGeometry(2.2, 64)
  const haloMat = new THREE.MeshBasicMaterial({ color: OURO, transparent: true, opacity: 0.12 })
  const halo = new THREE.Mesh(haloGeo, haloMat)
  halo.position.z = -2
  scene.add(halo)

  const anelGeo = new THREE.TorusGeometry(1.15, 0.055, 20, 128)
  const anelMat = new THREE.MeshStandardMaterial({
    color: OURO, roughness: 0.22, metalness: 0.85, emissive: OURO, emissiveIntensity: 0.18
  })
  const anel = new THREE.Mesh(anelGeo, anelMat)
  scene.add(anel)

  const anel2Geo = new THREE.TorusGeometry(0.72, 0.045, 20, 128)
  const anel2 = new THREE.Mesh(anel2Geo, anelMat)   // material compartilhado
  anel2.position.set(0.42, -0.28, 0.05)
  scene.add(anel2)

  const luz = new THREE.DirectionalLight(0xfff2cc, 2.4)
  luz.position.set(-1, 1.5, 3)
  scene.add(luz)
  scene.add(new THREE.AmbientLight(0xffffff, 0.55))

  function resize (w, h) {
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }

  function update (dt, t) {
    anel.rotation.z = t * 0.18
    anel.rotation.x = Math.sin(t * 0.4) * 0.22
    anel2.rotation.z = -t * 0.14
    haloMat.opacity = 0.10 + Math.sin(t * 1.3) * 0.035
  }

  function dispose () {
    haloGeo.dispose(); haloMat.dispose()
    anelGeo.dispose(); anel2Geo.dispose()
    anelMat.dispose()                    // um material para os dois aneis
    scene.clear()
  }

  return { scene, camera, update, resize, dispose }
}
