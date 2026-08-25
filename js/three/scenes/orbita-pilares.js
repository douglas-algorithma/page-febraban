/**
 * Card dos quatro pilares: o "C" da marca aberto, em roxo e verde-limao,
 * girando devagar a esquerda — como aos 14,5s-21,4s do video.
 */
export default function criar ({ THREE, cores }) {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(cores.roxoNoite)

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100)
  camera.position.set(0, 0, 10)

  const grupo = new THREE.Group()
  grupo.rotation.z = -0.4
  scene.add(grupo)

  // arco externo lime (o "C")
  const arcoGeo = new THREE.TorusGeometry(0.52, 0.070, 18, 120, Math.PI * 1.55)
  const arcoMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(cores.lime), roughness: 0.3, metalness: 0.15
  })
  const arco = new THREE.Mesh(arcoGeo, arcoMat)
  grupo.add(arco)

  // arco interno roxo
  const arcoIntGeo = new THREE.TorusGeometry(0.36, 0.070, 18, 120, Math.PI * 1.3)
  const arcoIntMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(cores.roxoMedio), roughness: 0.35, metalness: 0.1
  })
  const arcoInt = new THREE.Mesh(arcoIntGeo, arcoIntMat)
  arcoInt.rotation.z = 0.5
  grupo.add(arcoInt)

  // esfera terminal
  const esferaGeo = new THREE.SphereGeometry(0.095, 32, 24)
  const esferaMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(cores.roxoMedio), roughness: 0.25, metalness: 0.3
  })
  const esfera = new THREE.Mesh(esferaGeo, esferaMat)
  grupo.add(esfera)

  const luz = new THREE.DirectionalLight(0xffffff, 2.2)
  luz.position.set(-1, 1.5, 3)
  scene.add(luz)
  scene.add(new THREE.AmbientLight(0xffffff, 0.8))

  function resize (w, h) {
    const a = w / h
    camera.left = -a; camera.right = a; camera.top = 1; camera.bottom = -1
    camera.updateProjectionMatrix()
    grupo.position.set(-a + 0.42, 0.05, 0)
  }

  function update (dt, t) {
    grupo.rotation.z = -0.4 + Math.sin(t * 0.3) * 0.08
    arco.rotation.z = t * 0.12
    arcoInt.rotation.z = 0.5 - t * 0.09
    // esfera acompanha a ponta do arco externo, sem alocar vetor
    const ang = t * 0.12 + Math.PI * 1.55
    esfera.position.set(Math.cos(ang) * 0.52, Math.sin(ang) * 0.52, 0.02)
  }

  function dispose () {
    arcoGeo.dispose(); arcoMat.dispose()
    arcoIntGeo.dispose(); arcoIntMat.dispose()
    esferaGeo.dispose(); esferaMat.dispose()
    scene.clear()
  }

  return { scene, camera, update, resize, dispose }
}
