<script setup>
import * as THREE from 'three'
import { gsap } from 'gsap'
import * as dat from 'lil-gui'
const threeScene = ref(null)

onMounted(() => {
  /**
 * Base
 */
  // Debug
  const gui = new dat.GUI()

  const parameters = {
    materialColor: '#ffeded',
    objectDistance: 5,
    rotate: Math.PI * 0.25
  }

  // Canvas
  // const canvas = document.querySelector('canvas.webgl')

  // Scene
  const scene = new THREE.Scene()

  const textureLoader = new THREE.TextureLoader()
  const gradientTexture = textureLoader.load('/textures/20gradients/5.jpg')
  gradientTexture.magFilter = THREE.NearestFilter
  //  Material
  const material = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradientTexture
  })
  //  Object
  const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(0.7, 0.2, 16, 100),
    material
  )
  const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
  )
  const mesh3 = new THREE.Mesh(
    new THREE.TorusGeometry(0.8, 0.35, 160, 16),
    material
  )
  mesh1.position.y = -parameters.objectDistance * 0
  mesh2.position.y = -parameters.objectDistance * 1
  mesh3.position.y = -parameters.objectDistance * 2

  mesh1.position.x = 2
  mesh2.position.x = -2
  mesh3.position.x = 2

  scene.add(mesh1, mesh2, mesh3)

  const meshArray = [mesh1, mesh2, mesh3]

  // Lights

  const directionLight = new THREE.DirectionalLight('#ffffff', 1)
  directionLight.position.set(1, 1, 0)
  scene.add(directionLight)

  gui.addColor(parameters, 'materialColor').onChange(() => {
    material.color.set(parameters.materialColor)
  })
  gui.add(directionLight.position, 'x').min(-5).max(5).step(0.01)
  gui.add(directionLight.position, 'y').min(-5).max(5).step(0.01)
  gui.add(directionLight.position, 'z').min(-5).max(5).step(0.01)
  gui.add(directionLight, 'intensity').min(0).max(5).step(0.01)

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

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })

  const cameraGroup = new THREE.Group()
  scene.add(cameraGroup)
  /**
 * Camera
 */
  // Base camera
  const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
  camera.position.z = 6
  cameraGroup.add(camera)

  /**
 * Renderer
 */
  const renderer = new THREE.WebGLRenderer({
    canvas: threeScene.value,
    alpha: true
  })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  /**
 * Animate
 */

  let scrollY = window.scrollY
  let currentSection = 0
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY
    const newSection = Math.round(scrollY / sizes.height)
    if (newSection !== currentSection) {
      currentSection = newSection
      console.log(currentSection)
      gsap.to(
        meshArray[currentSection].rotation,
        {
          duration: 1,
          x: '+=6',
          y: '+=3',
          z: '+=2'
        }
      )
    }
  })

  const cursor = {
    x: 0,
    y: 0
  }
  window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = -(event.clientY / sizes.height - 0.5)
  })

  const clock = new THREE.Clock()
  let previousTime = 0
  const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime
    // Render
    renderer.render(scene, camera)

    // 旋轉物體
    for (const mesh of meshArray) {
      // mesh.rotation.x = elapsedTime * 0.2
      // mesh.rotation.y = elapsedTime * 0.22
      mesh.rotation.x += deltaTime * 0.2
      mesh.rotation.y += deltaTime * 0.22
    }

    //  移動相機
    // q: 這邊為什麼要除以sizes.height?
    camera.position.y = -scrollY / sizes.height * parameters.objectDistance
    // cameraGroup.position.x = -cursor.x
    // cameraGroup.position.y = cursor.y

    // 要變的更順暢，就是要漸慢的移動
    cameraGroup.position.x += (cursor.x - cameraGroup.position.x) * 2 * deltaTime
    cameraGroup.position.y += (cursor.y - cameraGroup.position.y) * 2 * deltaTime

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
  }

  tick()

  // 增加一點星星背景
  const starGeometry = new THREE.BufferGeometry()
  const startCount = 1000
  const positionArray = new Float32Array(startCount * 3)
  const starMaterial = new THREE.PointsMaterial({
    color: 0xFFFFFF,
    // q: 這邊為什麼要設定 sizeAttenutation  a: 這個是用來控制粒子大小的，如果是false，就是固定大小，如果是true，就是跟距離有關係
    sizeAttenutation: false,
    size: 0.05
  })
  for (let i = 0; i < startCount; i++) {
    positionArray[i * 3] = (Math.random() - 0.5) * 10
    positionArray[i * 3 + 1] = (parameters.objectDistance * 0.5) - Math.random() * parameters.objectDistance * 3
    positionArray[i * 3 + 2] = (Math.random() - 0.5) * 10
  }
  starGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
  const stars = new THREE.Points(starGeometry, starMaterial)
  scene.add(stars)
})
</script>

<template>
  <div class="pageBg">
    <canvas id="threeScene" ref="threeScene" class="webgl"></canvas>
    <section class="section">
        <h1>My Portfolio</h1>
    </section>
    <section class="section">
        <h2>My projects</h2>
    </section>
    <section class="section">
        <h2>Contact me</h2>
    </section>

  </div>
</template>

<style lang="scss" scoped>
.pageBg{
  background: #1e1a20;
}
.webgl
{
    position: fixed;
    top: 0;
    left: 0;
    outline: none;
}

.section
{
    display: flex;
    align-items: center;
    height: 100vh;
    position: relative;
    font-family: 'Cabin', sans-serif;
    color: #ffeded;
    text-transform: uppercase;
    font-size: 7vmin;
    padding-left: 10%;
    padding-right: 10%;
}

section:nth-child(odd)
{
    justify-content: flex-end;
}

</style>
