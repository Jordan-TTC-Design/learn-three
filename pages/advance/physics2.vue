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
  const debugObject = {}

  /**
  * Physics
   */
  const world = new CANNON.World()

  // 新增音效
  const hitSound = new Audio('/textures/sounds/hit.mp3');
  const playSound = (collision) => {
    // 因為碰撞的力量不一樣，所以我們可以用碰撞的力量來決定是否要播放音效，這樣就不會每次都播放音效
    const impactStrength = collision.contact.getImpactVelocityAlongNormal();
    if (impactStrength > 2) {
      hitSound.volume = impactStrength / 2 > 1 ? 1 : impactStrength / 2;
      hitSound.currentTime = 0;
      hitSound.play();
    }
  }

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
  // 這邊是設定物理引擎中的物體的碰撞檢測方式
  world.broadphase = new CANNON.SAPBroadphase(world)
  // 讓物理引擎中的物體可以睡眠，可以提升效能
  world.allowSleep = true
  // 重力
  world.gravity.set(0, -9.82, 0)

  // world.addBody(sphereBody)

  // 這邊是給球體一個初速度
  // sphereBody.applyLocalForce(new CANNON.Vec3(50, 0, 0), new CANNON.Vec3(0, 0, 0))

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
  // const textureLoader = new THREE.TextureLoader()
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

  // 新增第二種形狀的物體，也把他包成一個 function
  const boxBodies = []
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
  const boxMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5
  })
  const creatBox = (width, height, depth, position) => {
    // new three.js 的方塊
    const mesh = new THREE.Mesh(
      boxGeometry,
      boxMaterial
    )
    mesh.castShadow = true
    mesh.scale.set(width, height, depth)
    mesh.position.copy(position)
    scene.add(mesh)

    // new cannon.js 的方塊
    const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5))
    const body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0, 3, 0),
      shape,
      material: defaultMaterial
    })
    body.position.copy(position)
    body.addEventListener('collide', playSound)
    world.addBody(body)
    boxBodies.push({ mesh, body })
  }
  creatBox(1, 1, 1, new THREE.Vector3(0, 3, 0))
  debugObject.creatBox = () => {
    creatBox(
      Math.random() * 0.5,
      Math.random() * 0.5,
      Math.random() * 0.5,
      { x: (Math.random() - 0.5) * 3, y: 3, z: (Math.random() - 0.5) * 3 })
  }
  gui.add(debugObject, 'creatBox')
  // 把新增 three.js 的圓球和物理引擎的球體連接起來包成一個 function
  // 因為要更新物件位置，所以要把每個圓球存進陣列中
  const sphereBodies = []
  const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
  const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5
  })
  const creatSphere = (raduis, position) => {
    // new three.js 的圓球
    // 另外由於材質、幾何圖形都是共用的，可以抽出來更省效能
    const mesh = new THREE.Mesh(
      sphereGeometry,
      sphereMaterial
    )
    mesh.castShadow = true
    mesh.scale.set(raduis, raduis, raduis)
    mesh.position.copy(position)
    scene.add(mesh)

    // new cannon.js 的球體
    const shape = new CANNON.Sphere(raduis)
    const body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0, 3, 0),
      shape,
      material: defaultMaterial
    })
    body.position.copy(position)
    world.addBody(body)
    sphereBodies.push({ mesh, body })
  }
  // 用函式新增一個球體
  creatSphere(0.5, new THREE.Vector3(0, 3, 0))
  creatSphere(0.5, new THREE.Vector3(0, 4, 0))
  debugObject.creatSphere = () => {
    creatSphere(Math.random() * 0.5, new THREE.Vector3((Math.random() - 0.5) * 3, 3, (Math.random() - 0.5) * 3))
  }
  gui.add(debugObject, 'creatSphere')

  // 清空所有的物體
  debugObject.clearAll = () => {
    for (const boxBody of boxBodies) {
      boxBody.body.removeEventListener('collide', playSound)
      scene.remove(boxBody.mesh)
      world.removeBody(boxBody.body)
    }
    for (const sphereBody of sphereBodies) {
      scene.remove(sphereBody.mesh)
      world.removeBody(sphereBody.body)
    }
    boxBodies.length = 0
    sphereBodies.length = 0
  }
  gui.add(debugObject, 'clearAll')

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
    // sphereBody.applyForse(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position)

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

    // creat a new force wind
    // sphereBody.applyForce(new CANNON.Vec3(0.5, 0, 0), sphereBody.position)

    // Update physics world
    world.step(1 / 60, deltaTime, 3)
    // world.step(1 / 60)

    // 用迴圈更新每個 sphereBody 的位置
    for (const sphereBody of sphereBodies) {
      sphereBody.mesh.position.copy(sphereBody.body.position)
      // sphereBody.mesh.quaternion.copy(sphereBody.body.quaternion)
    }

    for (const boxBody of boxBodies) {
      boxBody.mesh.position.copy(boxBody.body.position)
      boxBody.mesh.quaternion.copy(boxBody.body.quaternion)
    }

    // combine cannonjs and threejs
    // sphere.position.x = sphereBody.position.x
    // sphere.position.y = sphereBody.position.y
    // sphere.position.z = sphereBody.position.z
    // sphere.position.copy(sphereBody.position)
    // floor.position.copy(floorBody.position)
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
