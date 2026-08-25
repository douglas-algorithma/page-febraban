/**
 * Fundo das cenas de mandala.
 *
 * A RODA em si e SVG (js/ui/mandala.js) — so SVG faz o texto curvo do anel
 * ("INOVAÇÃO"/"APLICADA") e os setores rotulados, e fica nitido em 4K.
 * Aqui sobra o que o 3D faz melhor: um halo lilas de respiro atras dela.
 * Antes esta cena desenhava toros que apareciam POR CIMA do SVG, duplicando
 * a roda e cortando as pilulas.
 */
export default function criar ({ THREE, cores }) {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xffffff)

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100)
  camera.position.set(0, 0, 10)

  const geo = new THREE.CircleGeometry(0.92, 96)
  const mat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(cores.lilasClaro), transparent: true, opacity: 0.5
  })
  const halo = new THREE.Mesh(geo, mat)
  scene.add(halo)

  function resize (w, h) {
    const a = w / h
    camera.left = -a; camera.right = a; camera.top = 1; camera.bottom = -1
    camera.updateProjectionMatrix()
  }

  function update (dt, t) {
    const s = 1 + Math.sin(t * 0.5) * 0.02
    halo.scale.set(s, s, 1)
    mat.opacity = 0.42 + Math.sin(t * 0.7) * 0.06
  }

  function dispose () {
    geo.dispose()
    mat.dispose()
    scene.clear()
  }

  return { scene, camera, update, resize, dispose }
}
