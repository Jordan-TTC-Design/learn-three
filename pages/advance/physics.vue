<script setup>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import CANNON from 'cannon'
import * as dat from 'lil-gui';

const threeScene = ref(null);
onMounted(() => {
  /**
 * Debug
 */
  const gui = new dat.GUI()

  /**
  * Physics
   */
  const world = new CANNON.World()

  // 新增兩個材質，用於計算說兩者的碰撞
  const concreteMaterial = new CANNON.Material('concrete')
  const plasticMaterial = new CANNON.Material('plastic')
  // 連接兩個材質
  const concretePlasticContactMaterial = new CANNON.ContactMaterial(
    concreteMaterial,
    plasticMaterial,
    {
      friction: 0.1, // 摩擦力
      restitution: 0.5 // 彈性
    }
  )
  // 將連接的材質加入到物理引擎中
  // world.addContactMaterial(concretePlasticContactMaterial)

  // 如果不太在乎不同的材質碰撞，可以直接使用下面的方式，以同一種材質來計算碰撞
  const defaultMaterial = new CANNON.Material('default')
  const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
      friction: 0.1,
      restitution: 0.5
    }
  )
  world.addContactMaterial(defaultContactMaterial)
  // 也可以把全部的材質都設定成同一種材質
  world.defaultContactMaterial = defaultContactMaterial

  world.gravity.set(0, -9.82, 0)
  // 創建一個實體物件在物理引擎世界中
  const sphereShape = new CANNON.Sphere(0.5)
  const sphereBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape: sphereShape,
    material: defaultMaterial
  })
  world.addBody(sphereBody)

  // 這邊是給球體一個初速度
  sphereBody.applyLocalForce(new CANNON.Vec3(50, 0, 0), new CANNON.Vec3(0, 0, 0))

  // 新增實體地板在物理引擎世界中
  const floorShape = new CANNON.Plane();
  const floorBody = new CANNON.Body({
    mass: 0,
    shape: floorShape,
    position: new CANNON.Vec3(-2, 0, 0),
    material: defaultMaterial
  })

  // 旋轉地板
  // q:可以解釋 quaternion.setFromAxisAngle 嗎？
  floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)
  world.addBody(floorBody)

  /**
 * Base
 */
  // Canvas
  // const canvas = document.querySelector('canvas.webgl')

  // Scene
  const scene = new THREE.Scene()

  /**
 * Textures
 */
  const textureLoader = new THREE.TextureLoader()
  const cubeTextureLoader = new THREE.CubeTextureLoader()

  const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
  ])

  /**
 * Test sphere
 */
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.4,
      envMap: environmentMapTexture,
      envMapIntensity: 0.5
    })
  )
  sphere.castShadow = true
  sphere.position.y = 0.5
  scene.add(sphere)

  /**
 * Floor
 */
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
      color: '#777777',
      metalness: 0.3,
      roughness: 0.4,
      envMap: environmentMapTexture,
      envMapIntensity: 0.5
    })
  )
  floor.receiveShadow = true
  floor.rotation.x = -Math.PI * 0.5
  scene.add(floor)

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
  camera.position.set(-3, 3, 3)
  scene.add(camera)

  // Controls
  const controls = new OrbitControls(camera, threeScene.value)
  controls.enableDamping = true

  /**
 * Renderer
 */
  const renderer = new THREE.WebGLRenderer({
    canvas: threeScene.value,
  })
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  /**
 * Animate
 */
  const clock = new THREE.Clock()
  let oldTime = 0;
  const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldTime;
    oldTime = elapsedTime;
    // Update controls
    controls.update()

    // Update physics world
    world.step(1 / 60, deltaTime, 3)
    // world.step(1 / 60)

    // combine cannonjs and threejs
    // sphere.position.x = sphereBody.position.x
    // sphere.position.y = sphereBody.position.y
    // sphere.position.z = sphereBody.position.z
    sphere.position.copy(sphereBody.position)
    floor.position.copy(floorBody.position)
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
