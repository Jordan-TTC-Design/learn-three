<script setup>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import * as dat from 'lil-gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
const threeScene = ref(null);
onMounted(() => {
  /**
 * Debug
 */
  // const gui = new dat.GUI()

  /**
 * Base
 */
  // Canvas
  // const canvas = document.querySelector('canvas.webgl')

  // Scene
  const scene = new THREE.Scene()

  /**
 * Objects
 */
  const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
  )
  object1.position.x = -2

  const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
  )

  const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
  )
  object3.position.x = 2

  scene.add(object1, object2, object3)

  // 光線投射器
  const raycater = new THREE.Raycaster();

  /**
 * Lights
 */
  const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.7)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.2)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.set(1024, 1024)
  directionalLight.shadow.camera.far = 15
  directionalLight.shadow.camera.left = -7
  directionalLight.shadow.camera.top = 7
  directionalLight.shadow.camera.right = 7
  directionalLight.shadow.camera.bottom = -7
  directionalLight.position.set(5, 5, 5)
  scene.add(directionalLight)

  /**
 * Sizes
 */
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  }

  window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // 反推 sphereBody 的位置
    sphereBody.applyForse(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position)

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })

  /**
 * Camera
 */
  // Base camera
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
  camera.position.z = 3
  scene.add(camera)

  // Controls
  const controls = new OrbitControls(camera, threeScene.value)
  controls.enableDamping = true

  /**
 * Renderer
 */
  const renderer = new THREE.WebGLRenderer({
    canvas: threeScene.value
  })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // mouse event
  const mouse = new THREE.Vector2()
  const onDocumentMouseMove = (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
  }
  threeScene.value.addEventListener('mousemove', onDocumentMouseMove)

  const onDocumentMouseClick = (event) => {
    if (currentIntersect) {
      switch (currentIntersect.object) {
        case object1:
          console.log('click object1')
          break
        case object2:
          console.log('click object2')
          break
        case object3:
          console.log('click object3')
          break
      }
    }
  }
  threeScene.value.addEventListener('click', onDocumentMouseClick)

  // load model
  const gltfLoader = new GLTFLoader()
  let duck1 = null
  gltfLoader.load(
    '/models/Duck/glTF/Duck.gltf',
    (gltf) => {
      duck1 = gltf.scene
      scene.add(duck1)
    },)

  /**
 * Animate
 */
  const clock = new THREE.Clock()
  let oldTime = 0;
  let currentIntersect = null
  const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldTime;
    oldTime = elapsedTime;
    // Update controls
    controls.update()

    // 移動三個圓球
    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
    object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
    object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5

    // duck1.position.y = Math.sin(elapsedTime * 1.4) * 1.5
    // 要設定光線，需要兩個向量，一個是光線的起點，一個是光線的方向
    // const rayOrigin = new THREE.Vector3(-3, 0, 0);
    // const rayDirection = new THREE.Vector3(1, 0, 0);
    // rayDirection.normalize();

    // raycater.set(rayOrigin, rayDirection);
    // 設定光線投射器的起點
    raycater.setFromCamera(mouse, camera);

    // 設定光線投射器的物件
    const objectsToTest = [object1, object2, object3];
    const intersects = raycater.intersectObjects(objectsToTest);

    // 設定物體碰到光線時候會變色，但是要注意，也要每一幀都先把物體的顏色設定回來，才去判斷是否有碰到光線，最後變色：
    // 先把物體的顏色設定為遠本紅色
    for (const object of objectsToTest) {
      object.material.color.set('#ff0000');
    }
    // 判定有無碰到光線，變色
    for (const intersect of intersects) {
      intersect.object.material.color.set('#0000ff');
    }
    if (intersects.length) {
      if (!currentIntersect) {
        console.log('mouse enter')
      }
      currentIntersect = intersects[0]
    } else {
      if (currentIntersect) {
        console.log('mouse leave')
      }
      currentIntersect = null
    }

    if (duck1) {
      const duckIntersect = raycater.intersectObject(duck1)
      if (duckIntersect.length > 0) {
        console.log('duckIntersect')
        duck1.scale.set(1.5, 1.5, 1.5)
      } else {
        duck1.scale.set(1, 1, 1)
      }
      duck1.position.y = object2.position.y
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
  }

  tick()
});
</script>

<template>
  <div>
    <canvas id="threeScene" ref="threeScene"></canvas>
  </div>
</template>

<style lang="scss" scoped>
#threeScene {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  outline: none;
}
</style>
